import json
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import StudentDocument, StudentProfile
from app.schemas.schemas import DocumentItem, CrossDocumentConsistencyReport
from app.services.document_service import audit_document_consistency

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])

@router.get("", response_model=list[DocumentItem])
def get_documents(user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    if not profile:
        return []

    docs = db.query(StudentDocument).filter(StudentDocument.student_id == profile.id).all()
    results = []
    for d in docs:
        try:
            meta = json.loads(d.extracted_metadata_json or "{}")
        except Exception:
            meta = {}
        results.append(DocumentItem(
            id=d.id,
            student_id=d.student_id,
            document_type=d.document_type,
            document_name=d.document_name,
            file_url=d.file_url,
            file_size_kb=d.file_size_kb,
            file_format=d.file_format,
            is_verified=d.is_verified,
            upload_date=d.upload_date,
            expiry_date=d.expiry_date,
            extracted_metadata=meta,
            ocr_confidence_score=d.ocr_confidence_score,
            notes=d.notes
        ))
    return results

@router.post("/upload", response_model=DocumentItem)
def upload_document(
    document_type: str = Form(...),
    document_name: str = Form(...),
    notes: str = Form(None),
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    # Simulated OCR extraction based on document type
    simulated_metadata = {
        "candidate_name": profile.full_name,
        "document_type": document_type,
        "processed_at": datetime.datetime.utcnow().isoformat(),
        "verification_seal": "Digitally Verified (Valid Barcode / QR Detected)"
    }
    if document_type == "bonafide_cert":
        simulated_metadata.update({
            "institution_name": profile.educational_record.institution_name if profile.educational_record else "JNTUH College of Engineering",
            "course": "B.Tech (Lateral Entry)",
            "academic_year": "2026-2027",
            "principal_signature_detected": True,
            "college_seal_detected": True
        })

    doc = StudentDocument(
        student_id=profile.id,
        document_type=document_type,
        document_name=document_name,
        file_url=f"/uploads/{document_name}",
        file_size_kb=210.0,
        file_format="PDF",
        is_verified=True,
        extracted_metadata_json=json.dumps(simulated_metadata),
        ocr_confidence_score=0.98,
        notes=notes or "Uploaded via ScholarEase Document Vault"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return DocumentItem(
        id=doc.id,
        student_id=doc.student_id,
        document_type=doc.document_type,
        document_name=doc.document_name,
        file_url=doc.file_url,
        file_size_kb=doc.file_size_kb,
        file_format=doc.file_format,
        is_verified=doc.is_verified,
        upload_date=doc.upload_date,
        expiry_date=doc.expiry_date,
        extracted_metadata=simulated_metadata,
        ocr_confidence_score=doc.ocr_confidence_score,
        notes=doc.notes
    )

@router.get("/consistency-audit", response_model=CrossDocumentConsistencyReport)
def get_consistency_audit(user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    return audit_document_consistency(db, profile.id)
