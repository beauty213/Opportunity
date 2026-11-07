import datetime
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Application, ApplicationEvent, StudentProfile, Scholarship
from app.schemas.schemas import ApplicationResponse, ApplicationEventResponse, ProblemSolverRequest, ProblemSolverResponse
from app.services.journey_service import solve_application_problem

router = APIRouter(prefix="/applications", tags=["Application Journey Navigator"])

def get_next_action(stage: str) -> str:
    actions = {
        "Discovered": "Review eligibility breakdown and shortlist scholarship.",
        "Shortlisted": "Audit required documents in your Document Vault.",
        "Eligibility Checked": "Confirm Bonafide issuance from your college.",
        "Documents Prepared": "Run the Zero-Repeat-Visit Assistant before physical file submission.",
        "Ready to Apply": "Submit the online application on the official portal and download the PDF acknowledgment.",
        "Submitted": "Hand over 2 self-attested photocopy sets to the College Scholarship Clerk.",
        "Under Verification": "Monitor college nodal verification and DWO approval status.",
        "Correction Requested": "Open Rejection Recovery to resolve the flagged deficit immediately.",
        "Approved": "Awaiting treasury fund sanction from Social Welfare Department.",
        "Payment Pending": "Confirm that your bank account has active NPCI Aadhaar mapping to receive DBT.",
        "Disbursed": "Download and file your scholarship award letter for future renewals.",
        "Renewal Due": "Obtain fresh MeeSeva Income Certificate and submit renewal application on ePASS."
    }
    return actions.get(stage, "Check application notifications.")

@router.get("", response_model=List[ApplicationResponse])
def get_applications(user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    if not profile:
        return []

    apps = db.query(Application).filter(Application.student_id == profile.id).all()
    results = []
    for app in apps:
        events = db.query(ApplicationEvent).filter(ApplicationEvent.application_id == app.id).order_by(ApplicationEvent.timestamp.desc()).all()
        results.append(ApplicationResponse(
            id=app.id,
            scholarship_id=app.scholarship_id,
            scholarship_title=app.scholarship.title if app.scholarship else "Scholarship",
            application_reference_no=app.application_reference_no,
            portal_name=app.portal_name,
            current_stage=app.current_stage,
            is_officially_verified=app.is_officially_verified,
            submission_date=app.submission_date,
            last_status_update_date=app.last_status_update_date,
            rejection_reason=app.rejection_reason,
            correction_deadline=app.correction_deadline,
            events=[ApplicationEventResponse.from_orm(e) for e in events],
            next_action_recommendation=get_next_action(app.current_stage)
        ))
    return results

@router.post("/create")
def create_application(scholarship_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    sch = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not sch:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    existing = db.query(Application).filter(Application.student_id == profile.id, Application.scholarship_id == scholarship_id).first()
    if existing:
        return {"status": "already_exists", "application_id": existing.id}

    app = Application(
        student_id=profile.id,
        scholarship_id=sch.id,
        portal_name=sch.provider,
        current_stage="Shortlisted",
        is_officially_verified=False
    )
    db.add(app)
    db.flush()

    evt = ApplicationEvent(
        application_id=app.id,
        event_title="Scholarship Shortlisted",
        event_description=f"Student shortlisted {sch.title} for upcoming application cycle.",
        stage="Shortlisted",
        source="Student Reported"
    )
    db.add(evt)
    db.commit()
    db.refresh(app)
    return {"status": "created", "application_id": app.id}

@router.put("/{application_id}/stage")
def update_stage(application_id: int, new_stage: str, note: Optional[str] = None, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.current_stage = new_stage
    app.last_status_update_date = datetime.datetime.utcnow()

    evt = ApplicationEvent(
        application_id=app.id,
        event_title=f"Stage Advanced to {new_stage}",
        event_description=note or f"Application status progressed to {new_stage}.",
        stage=new_stage,
        source="Student Reported"
    )
    db.add(evt)
    db.commit()
    return {"status": "success", "new_stage": new_stage}

@router.post("/problem-solver", response_model=ProblemSolverResponse)
def solve_problem(req: ProblemSolverRequest, db: Session = Depends(get_db)):
    return solve_application_problem(
        db=db,
        error_message=req.error_message,
        application_id=req.application_id,
        portal_name=req.portal_name or "Telangana ePASS"
    )
