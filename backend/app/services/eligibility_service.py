from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Scholarship, StudentProfile, EducationalRecord, FinancialProfile, EligibilityRule
from app.schemas.schemas import RuleCheckResult, EligibilityAssessment, SimulatorRequest, SimulatorResponse

def evaluate_student_eligibility(
    db: Session,
    scholarship: Scholarship,
    profile: StudentProfile
) -> EligibilityAssessment:
    edu: EducationalRecord = profile.educational_record
    fin: FinancialProfile = profile.financial_profile

    rule_checks: List[RuleCheckResult] = []
    failed_mandatory: List[str] = []
    pending_checks: List[str] = []

    # 1. State Domicile Check
    if scholarship.target_state != "All India":
        passed_state = (profile.state.lower() == scholarship.target_state.lower())
        rule_checks.append(RuleCheckResult(
            rule_code="DOMICILE_CHECK",
            rule_name=f"Domicile in {scholarship.target_state}",
            category="domicile",
            student_value=profile.state,
            required_condition=f"Must reside in {scholarship.target_state}",
            passed=passed_state,
            explanation=f"Student resides in {profile.state}. Target is {scholarship.target_state}."
        ))
        if not passed_state:
            failed_mandatory.append(f"Residency mismatch (requires {scholarship.target_state})")

    # 2. Education Level Check
    allowed_levels = [l.strip().lower() for l in scholarship.education_levels.split(",")]
    if edu and edu.education_level:
        passed_level = (edu.education_level.lower() in allowed_levels)
        rule_checks.append(RuleCheckResult(
            rule_code="LEVEL_CHECK",
            rule_name="Permitted Education Level",
            category="academic",
            student_value=edu.education_level,
            required_condition=f"One of: {scholarship.education_levels}",
            passed=passed_level,
            explanation=f"Current education level is {edu.education_level}."
        ))
        if not passed_level:
            failed_mandatory.append(f"Course level {edu.education_level} is not covered")
    else:
        pending_checks.append("Education level not recorded in profile")

    # 3. Lateral Entry Consideration
    if edu and edu.admission_type == "Lateral Entry":
        passed_lateral = scholarship.allows_lateral_entry
        rule_checks.append(RuleCheckResult(
            rule_code="LATERAL_ENTRY_CHECK",
            rule_name="Lateral Entry Admission Acceptance",
            category="admission",
            student_value=edu.admission_type,
            required_condition="Lateral Entry allowed by scheme rules",
            passed=passed_lateral,
            explanation="Scheme guidelines officially recognize 2nd year Diploma Lateral Entry admissions." if passed_lateral else "This scheme only accepts regular 4-year 10+2 entry."
        ))
        if not passed_lateral:
            failed_mandatory.append("Lateral entry students are not eligible for this specific central quota")

    # 4. Income Limit Check
    if fin and fin.annual_family_income is not None:
        passed_income = (fin.annual_family_income <= scholarship.max_family_income)
        rule_checks.append(RuleCheckResult(
            rule_code="INCOME_CEILING",
            rule_name="Annual Family Income Ceiling",
            category="financial",
            student_value=f"₹{int(fin.annual_family_income):,}",
            required_condition=f"<= ₹{int(scholarship.max_family_income):,}",
            passed=passed_income,
            explanation=f"Annual family income is ₹{int(fin.annual_family_income):,}, which is {'below' if passed_income else 'above'} the ceiling of ₹{int(scholarship.max_family_income):,}."
        ))
        if not passed_income:
            diff = fin.annual_family_income - scholarship.max_family_income
            failed_mandatory.append(f"Family income exceeds maximum threshold by ₹{int(diff):,}")
    else:
        pending_checks.append("Family income proof not yet updated")

    # 5. Minimum Marks / Percentage Check
    student_marks = 0.0
    if edu:
        student_marks = edu.previous_marks_percentage or (edu.current_cgpa * 9.5 if edu.current_cgpa else 0.0)

    if scholarship.min_percentage > 0:
        passed_marks = (student_marks >= scholarship.min_percentage)
        rule_checks.append(RuleCheckResult(
            rule_code="MIN_MARKS",
            rule_name=f"Minimum Academic Performance ({scholarship.min_percentage}%)",
            category="academic",
            student_value=f"{student_marks:.1f}%",
            required_condition=f">= {scholarship.min_percentage}%",
            passed=passed_marks,
            explanation=f"Qualifying marks aggregate is {student_marks:.1f}%. Cutoff is {scholarship.min_percentage}%."
        ))
        if not passed_marks:
            failed_mandatory.append(f"Marks ({student_marks:.1f}%) below minimum requirement ({scholarship.min_percentage}%)")

    # 6. Category / Quota Check
    allowed_categories = [c.strip().upper() for c in scholarship.eligible_categories.split(",")]
    if profile.category:
        passed_category = (profile.category.upper() in allowed_categories or "GENERAL" in allowed_categories)
        rule_checks.append(RuleCheckResult(
            rule_code="CATEGORY_QUOTA",
            rule_name="Social Category / Quota Eligibility",
            category="demographic",
            student_value=profile.category,
            required_condition=scholarship.eligible_categories,
            passed=passed_category,
            explanation=f"Student's category is {profile.category}."
        ))
        if not passed_category:
            failed_mandatory.append(f"Reserved for {scholarship.eligible_categories}")

    # Determine 4-Tier Match Status
    total_checks = len(rule_checks)
    passed_count = sum(1 for r in rule_checks if r.passed)
    match_score = int((passed_count / total_checks) * 100) if total_checks > 0 else 0

    if len(failed_mandatory) > 0:
        status = "Not Eligible"
        ai_explanation = (
            f"Your profile does not currently meet the published requirements for this scholarship. "
            f"Key bottleneck(s): {'; '.join(failed_mandatory)}. "
            f"You can explore alternative financial aid programs in the Discovery tab."
        )
    elif len(pending_checks) > 0:
        status = "Insufficient Information"
        ai_explanation = (
            f"We could not definitively evaluate your eligibility because some profile information is incomplete: "
            f"{', '.join(pending_checks)}. Please complete your educational and financial details."
        )
    elif match_score == 100:
        status = "Eligible"
        ai_explanation = (
            f"Your profile appears to match all verified rules for {scholarship.title}! "
            f"Your academic standing ({student_marks:.1f}%), family income (₹{int(fin.annual_family_income):,}), "
            f"and category ({profile.category}) meet the published criteria. "
            f"Next step: ensure your document vault is ready before applying."
        )
    else:
        status = "Potentially Eligible"
        ai_explanation = (
            f"Your profile satisfies the primary financial and academic requirements, but requires institutional verification "
            f"(such as Bonafide endorsement from {edu.institution_name if edu else 'your college'}) before final submission."
        )

    next_steps = []
    if status == "Eligible":
        next_steps = [
            "Check the Document Vault to ensure all required certificates are uploaded.",
            "Run the Zero-Repeat-Visit Assistant to verify that your original and photocopy sets are ready.",
            "Click 'Apply on Official Portal' to begin your registration on the verified government website."
        ]
    elif status == "Potentially Eligible":
        next_steps = [
            "Obtain the official Bonafide Certificate and Fee Structure from your college Principal's office.",
            "Confirm that your bank account is active with NPCI Aadhaar seeding.",
            "Consult the AI Copilot if you need clarification on regional rules."
        ]
    elif status == "Not Eligible":
        next_steps = [
            "Review the specific disqualifying criteria above.",
            "Use the Eligibility Simulator to see if future academic improvement or category provisions change the outcome.",
            "Check the Funding Gap Calculator for private CSR scholarships or college concession options."
        ]
    else:
        next_steps = [
            "Complete your missing educational and financial details in your Profile.",
            "Upload your latest marksheets and certificates to auto-populate missing fields."
        ]

    return EligibilityAssessment(
        scholarship_id=scholarship.id,
        scholarship_title=scholarship.title,
        status=status,
        match_score=match_score,
        rule_checks=rule_checks,
        ai_explanation=ai_explanation,
        next_steps=next_steps
    )

def simulate_eligibility(
    db: Session,
    request: SimulatorRequest,
    profile: StudentProfile
) -> SimulatorResponse:
    scholarship = db.query(Scholarship).filter(Scholarship.id == request.scholarship_id).first()
    if not scholarship:
        raise ValueError("Scholarship not found")

    # Baseline evaluation
    base_eval = evaluate_student_eligibility(db, scholarship, profile)

    # Clone attributes for hypothetical run
    changed_factors = []
    simulated_income = request.annual_family_income if request.annual_family_income is not None else (profile.financial_profile.annual_family_income if profile.financial_profile else 200000.0)
    if request.annual_family_income is not None and profile.financial_profile and request.annual_family_income != profile.financial_profile.annual_family_income:
        changed_factors.append(f"Family income changed from ₹{int(profile.financial_profile.annual_family_income):,} to ₹{int(request.annual_family_income):,}")

    simulated_marks = request.previous_marks_percentage if request.previous_marks_percentage is not None else (profile.educational_record.previous_marks_percentage if profile.educational_record else 75.0)
    if request.previous_marks_percentage is not None and profile.educational_record and request.previous_marks_percentage != profile.educational_record.previous_marks_percentage:
        changed_factors.append(f"Marks changed from {profile.educational_record.previous_marks_percentage}% to {request.previous_marks_percentage}%")

    simulated_admission = request.admission_type if request.admission_type is not None else (profile.educational_record.admission_type if profile.educational_record else "Regular")
    if request.admission_type is not None and profile.educational_record and request.admission_type != profile.educational_record.admission_type:
        changed_factors.append(f"Admission type changed to {request.admission_type}")

    # Simulated rules checks
    sim_passed = True
    sim_reasons = []

    # Income check
    if simulated_income > scholarship.max_family_income:
        sim_passed = False
        sim_reasons.append(f"Income ₹{int(simulated_income):,} still exceeds max limit of ₹{int(scholarship.max_family_income):,}")
    
    # Marks check
    if scholarship.min_percentage > 0 and simulated_marks < scholarship.min_percentage:
        sim_passed = False
        sim_reasons.append(f"Marks {simulated_marks}% below required {scholarship.min_percentage}%")

    # Lateral check
    if simulated_admission == "Lateral Entry" and not scholarship.allows_lateral_entry:
        sim_passed = False
        sim_reasons.append("Lateral entry not permitted for this scheme")

    sim_status = "Eligible" if sim_passed else "Not Eligible"
    sim_score = 100 if sim_passed else 40

    if not changed_factors:
        changed_factors.append("No changes applied in simulation")

    if sim_status == "Eligible" and base_eval.status != "Eligible":
        explanation = f"Great news! With these adjustments, your simulated profile meets all conditions and changes your status to Eligible."
    elif sim_status != "Eligible" and base_eval.status == "Eligible":
        explanation = f"Notice: With these simulated parameters ({'; '.join(sim_reasons)}), your eligibility would be compromised."
    elif sim_status == "Eligible":
        explanation = "Your simulated profile remains fully eligible."
    else:
        explanation = f"Even with these changes, the profile remains ineligible because: {'; '.join(sim_reasons)}."

    return SimulatorResponse(
        original_status=base_eval.status,
        simulated_status=sim_status,
        original_score=base_eval.match_score,
        simulated_score=sim_score,
        changed_factors=changed_factors,
        impact_explanation=explanation
    )
