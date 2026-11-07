from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Scholarship, StudentProfile
from app.schemas.schemas import ScholarshipResponse
from app.services.eligibility_service import evaluate_student_eligibility

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])

@router.get("", response_model=List[ScholarshipResponse])
def get_scholarships(
    query: Optional[str] = None,
    education_level: Optional[str] = None,
    target_state: Optional[str] = None,
    provider_type: Optional[str] = None,
    max_income: Optional[float] = None,
    min_marks: Optional[float] = None,
    category: Optional[str] = None,
    lateral_entry_only: Optional[bool] = None,
    user_id: Optional[int] = 1,
    db: Session = Depends(get_db)
):
    q = db.query(Scholarship).filter(Scholarship.is_active == True)

    if query:
        search_fmt = f"%{query}%"
        q = q.filter(
            (Scholarship.title.ilike(search_fmt)) |
            (Scholarship.provider.ilike(search_fmt)) |
            (Scholarship.description.ilike(search_fmt))
        )

    if target_state and target_state != "All":
        q = q.filter((Scholarship.target_state == target_state) | (Scholarship.target_state == "All India"))

    if provider_type and provider_type != "All":
        q = q.filter(Scholarship.provider_type == provider_type)

    if lateral_entry_only:
        q = q.filter(Scholarship.allows_lateral_entry == True)

    scholarships = q.all()

    # Dynamic student match score injection
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first() if user_id else None

    results = []
    for s in scholarships:
        resp = ScholarshipResponse.from_orm(s)
        if profile:
            try:
                assessment = evaluate_student_eligibility(db, s, profile)
                resp.match_score = assessment.match_score
                resp.match_status = assessment.status
                resp.eligibility_summary = assessment.ai_explanation
            except Exception:
                pass
        results.append(resp)

    # Sort primarily by match score descending if profile exists
    if profile:
        results.sort(key=lambda x: (x.match_score or 0), reverse=True)

    return results

@router.get("/{scholarship_id}", response_model=ScholarshipResponse)
def get_scholarship(scholarship_id: int, user_id: Optional[int] = 1, db: Session = Depends(get_db)):
    s = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    resp = ScholarshipResponse.from_orm(s)
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first() if user_id else None
    if profile:
        assessment = evaluate_student_eligibility(db, s, profile)
        resp.match_score = assessment.match_score
        resp.match_status = assessment.status
        resp.eligibility_summary = assessment.ai_explanation
    return resp

@router.get("/compare/items", response_model=List[ScholarshipResponse])
def compare_scholarships(
    ids: str = Query(..., description="Comma-separated IDs e.g. 1,2,3"),
    user_id: Optional[int] = 1,
    db: Session = Depends(get_db)
):
    id_list = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
    items = db.query(Scholarship).filter(Scholarship.id.in_(id_list)).all()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first() if user_id else None

    results = []
    for s in items:
        resp = ScholarshipResponse.from_orm(s)
        if profile:
            assessment = evaluate_student_eligibility(db, s, profile)
            resp.match_score = assessment.match_score
            resp.match_status = assessment.status
            resp.eligibility_summary = assessment.ai_explanation
        results.append(resp)
    return results
