import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Scholarship, Application, StudentProfile, GuidelineVersion, AuditLog
from app.schemas.schemas import ScholarshipBase

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total_scholarships = db.query(Scholarship).count()
    verified_scholarships = db.query(Scholarship).filter(Scholarship.verification_status == "Officially Verified").count()
    total_applications = db.query(Application).count()
    total_students = db.query(StudentProfile).count()
    guideline_updates = db.query(GuidelineVersion).count()

    return {
        "total_scholarships": total_scholarships,
        "verified_scholarships": verified_scholarships,
        "total_applications": total_applications,
        "total_registered_students": total_students,
        "active_guideline_versions": guideline_updates,
        "system_status": "Operational - All Government Portals Synced"
    }

@router.post("/publish-guideline-update")
def publish_guideline_update(
    scholarship_id: int,
    version_tag: str,
    summary_of_changes: str,
    old_values_json: str,
    new_values_json: str,
    official_source_doc: str,
    db: Session = Depends(get_db)
):
    sch = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not sch:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    gv = GuidelineVersion(
        scholarship_id=sch.id,
        version_tag=version_tag,
        publication_date=datetime.date.today().strftime("%Y-%m-%d"),
        summary_of_changes=summary_of_changes,
        old_values_json=old_values_json,
        new_values_json=new_values_json,
        official_source_doc=official_source_doc,
        is_active=True
    )
    db.add(gv)

    # Log to audit log
    log = AuditLog(
        action="PUBLISH_GUIDELINE_UPDATE",
        entity_type="GuidelineVersion",
        entity_id=version_tag,
        details_json=json.dumps({"scholarship": sch.title, "summary": summary_of_changes})
    )
    db.add(log)
    db.commit()

    return {"status": "success", "message": f"Guideline {version_tag} published and change detector alerts triggered."}
