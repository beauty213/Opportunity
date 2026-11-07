import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, StudentProfile, EducationalRecord, FinancialProfile
from app.schemas.schemas import StudentIdentityResponse, StudentProfileUpdate, EducationalRecordBase, FinancialProfileBase

router = APIRouter(prefix="/student", tags=["Student Identity"])

def calculate_identity_hash(profile: StudentProfile) -> str:
    edu = profile.educational_record
    fin = profile.financial_profile
    data_str = f"{profile.full_name}:{profile.dob}:{profile.category}:{edu.institution_name if edu else ''}:{fin.annual_family_income if fin else ''}"
    return "SE-ID-" + hashlib.sha256(data_str.encode()).hexdigest()[:12].upper()

def calculate_completion(profile: StudentProfile) -> int:
    score = 0
    if profile.full_name and profile.dob and profile.category:
        score += 30
    if profile.educational_record:
        edu = profile.educational_record
        if edu.course_name and edu.institution_name and edu.previous_marks_percentage:
            score += 35
    if profile.financial_profile:
        fin = profile.financial_profile
        if fin.annual_family_income and fin.bank_account_no:
            score += 35
    return min(100, score)

@router.get("/identity", response_model=StudentIdentityResponse)
def get_student_identity(user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    return StudentIdentityResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        dob=profile.dob,
        gender=profile.gender,
        state=profile.state,
        district=profile.district,
        phone=profile.phone,
        category=profile.category,
        sub_caste=profile.sub_caste,
        is_disabled=profile.is_disabled,
        is_first_generation=profile.is_first_generation,
        educational_record=profile.educational_record,
        financial_profile=profile.financial_profile,
        verified_identity_hash=calculate_identity_hash(profile),
        profile_completion_percentage=calculate_completion(profile)
    )

@router.put("/profile")
def update_profile(updates: StudentProfileUpdate, user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    for k, v in updates.dict(exclude_unset=True).items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return {"status": "success", "message": "Profile updated successfully"}

@router.put("/education")
def update_education(edu_in: EducationalRecordBase, user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    edu = profile.educational_record
    if not edu:
        edu = EducationalRecord(student_id=profile.id)
        db.add(edu)

    for k, v in edu_in.dict().items():
        setattr(edu, k, v)

    db.commit()
    return {"status": "success", "message": "Educational record updated successfully"}

@router.put("/financial")
def update_financial(fin_in: FinancialProfileBase, user_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    fin = profile.financial_profile
    if not fin:
        fin = FinancialProfile(student_id=profile.id)
        db.add(fin)

    for k, v in fin_in.dict().items():
        setattr(fin, k, v)

    db.commit()
    return {"status": "success", "message": "Financial profile updated successfully"}
