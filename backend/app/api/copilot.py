from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import StudentProfile, Scholarship
from app.schemas.schemas import CopilotQuery, CopilotResponse
from app.services.copilot_service import generate_copilot_response

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

@router.post("/query", response_model=CopilotResponse)
def query_copilot(query_data: CopilotQuery, user_id: int = 1, db: Session = Depends(get_db)):
    profile = None
    if query_data.include_student_context:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not profile:
            profile = db.query(StudentProfile).first()

    active_scholarship = None
    if query_data.active_scholarship_id:
        active_scholarship = db.query(Scholarship).filter(Scholarship.id == query_data.active_scholarship_id).first()

    return generate_copilot_response(
        query=query_data.query,
        language=query_data.language,
        profile=profile,
        active_scholarship=active_scholarship
    )
