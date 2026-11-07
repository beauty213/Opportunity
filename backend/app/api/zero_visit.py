from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import StudentProfile
from app.schemas.schemas import ZeroVisitReport
from app.services.zero_visit_service import generate_zero_visit_report

router = APIRouter(prefix="/zero-visit", tags=["Zero-Repeat-Visit Assistant"])

@router.get("/report", response_model=ZeroVisitReport)
def get_report(
    process_type: str = Query("epass_college_verification", description="epass_college_verification or bank_npci_seeding"),
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    return generate_zero_visit_report(db, profile.id, process_type)
