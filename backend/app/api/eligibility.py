from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Scholarship, StudentProfile
from app.schemas.schemas import EligibilityAssessment, SimulatorRequest, SimulatorResponse
from app.services.eligibility_service import evaluate_student_eligibility, simulate_eligibility

router = APIRouter(prefix="/eligibility", tags=["Eligibility Engine"])

@router.get("/assess/{scholarship_id}", response_model=EligibilityAssessment)
def assess_eligibility(scholarship_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    return evaluate_student_eligibility(db, scholarship, profile)

@router.post("/simulate", response_model=SimulatorResponse)
def simulate(req: SimulatorRequest, user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    return simulate_eligibility(db, req, profile)
