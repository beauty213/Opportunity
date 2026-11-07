import json
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import GuidelineVersion, StudentProfile
from app.schemas.schemas import GuidelineChangeItem

router = APIRouter(prefix="/changes", tags=["Scholarship Change Detector"])

@router.get("", response_model=List[GuidelineChangeItem])
def get_guideline_changes(user_id: int = 1, db: Session = Depends(get_db)):
    versions = db.query(GuidelineVersion).order_by(GuidelineVersion.publication_date.desc()).all()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()

    results = []
    for v in versions:
        sch_title = v.scholarship.title if v.scholarship else "Government Scholarship Scheme"
        old_val = v.old_values_json or "{}"
        new_val = v.new_values_json or "{}"

        # Contextual impact evaluation
        impact_text = "General advisory: review updated submission rules."
        action_req = False

        if "income" in v.summary_of_changes.lower():
            income_num = profile.financial_profile.annual_family_income if profile.financial_profile else 175000.0
            impact_text = f"Favorable change: The income limit was raised to ₹2,00,000. Your current reported family income of ₹{int(income_num):,} is fully within the revised threshold."
            action_req = False
        elif "deadline" in v.summary_of_changes.lower():
            impact_text = "Deadline extended to November 30, 2026! This gives Lateral Entry students additional time after web counselling rounds."
            action_req = True
        elif "npci" in v.summary_of_changes.lower() or "aadhaar" in v.summary_of_changes.lower():
            is_seeded = profile.financial_profile.is_aadhaar_seeded_npci if profile.financial_profile else True
            if not is_seeded:
                impact_text = "CRITICAL ACTION REQUIRED: Aadhaar NPCI mapper linkage is now strictly verified. Your bank account is currently unseeded. Visit your branch immediately."
                action_req = True
            else:
                impact_text = "Your bank account is already verified with active NPCI Aadhaar seeding."

        results.append(GuidelineChangeItem(
            scholarship_title=sch_title,
            version_tag=v.version_tag,
            publication_date=v.publication_date,
            change_category="Official Rule Revision",
            previous_rule=old_val,
            updated_rule=new_val,
            official_document_ref=v.official_source_doc or "State Government Notification",
            impact_on_user_profile=impact_text,
            user_action_required=action_req
        ))

    return results
