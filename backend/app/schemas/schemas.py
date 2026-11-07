from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Educational Record Schemas ---
class EducationalRecordBase(BaseModel):
    education_level: str = "Undergraduate"  # Diploma, Undergraduate, Postgraduate
    course_name: str = "B.Tech"
    branch: str = "Electronics & Communication Engineering (ECE)"
    institution_name: str = "JNTUH University College of Engineering Hyderabad"
    university_name: str = "Jawaharlal Nehru Technological University Hyderabad"
    institution_state: str = "Telangana"
    academic_year: int = 2
    current_semester: int = 3
    admission_type: str = "Lateral Entry"  # Regular, Lateral Entry, Convenor Quota
    previous_qualification: str = "Diploma in ECE"
    previous_marks_percentage: float = 84.5
    current_cgpa: float = 8.2
    hall_ticket_number: str = "22015-EC-042"

class EducationalRecordResponse(EducationalRecordBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

# --- Financial Profile Schemas ---
class FinancialProfileBase(BaseModel):
    annual_family_income: float = 175000.0
    income_certificate_number: str = "IC012398472910"
    income_certificate_issue_date: str = "2026-04-12"
    annual_tuition_fee: float = 85000.0
    hostel_living_expenses: float = 50000.0
    transportation_expenses: float = 15000.0
    family_contribution: float = 25000.0
    existing_financial_aid: float = 0.0
    bank_name: str = "State Bank of India"
    bank_account_no: str = "39847291045"
    bank_ifsc: str = "SBIN0012345"
    is_aadhaar_seeded_npci: bool = True

class FinancialProfileResponse(FinancialProfileBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

# --- Student Profile Schemas ---
class StudentProfileBase(BaseModel):
    full_name: str = "Rahul Korra"
    dob: Optional[str] = "2004-08-15"
    gender: Optional[str] = "Male"
    state: str = "Telangana"
    district: Optional[str] = "Hyderabad"
    phone: Optional[str] = "+91 98765 43210"
    category: str = "BC-B"
    sub_caste: Optional[str] = "Goud"
    is_disabled: bool = False
    disability_type: Optional[str] = None
    disability_percentage: Optional[float] = None
    is_first_generation: bool = True
    achievements: Optional[str] = "State Polytechnic Technical Quiz Winner (Rank 3)"

class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = None
    category: Optional[str] = None
    sub_caste: Optional[str] = None
    is_disabled: Optional[bool] = None
    is_first_generation: Optional[bool] = None
    achievements: Optional[str] = None

class StudentIdentityResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    dob: Optional[str]
    gender: Optional[str]
    state: str
    district: Optional[str]
    phone: Optional[str]
    category: str
    sub_caste: Optional[str]
    is_disabled: bool
    is_first_generation: bool
    educational_record: Optional[EducationalRecordResponse]
    financial_profile: Optional[FinancialProfileResponse]
    verified_identity_hash: str
    profile_completion_percentage: int

    class Config:
        from_attributes = True

# --- Scholarship Schemas ---
class ScholarshipDocumentRequirement(BaseModel):
    name: str
    is_mandatory: bool
    description: str

class ScholarshipBase(BaseModel):
    title: str
    slug: str
    provider: str
    provider_type: str
    target_state: str
    description: str
    financial_benefits: str
    award_amount_max: float
    deadline: str
    is_active: bool
    is_renewal_allowed: bool
    is_fully_funded: bool
    education_levels: str
    eligible_courses: str
    min_percentage: float
    max_family_income: float
    eligible_categories: str
    allows_lateral_entry: bool
    verification_status: str
    official_source_url: str
    apply_url: str
    required_documents_json: str
    application_procedure_markdown: str

class ScholarshipResponse(ScholarshipBase):
    id: int
    match_score: Optional[int] = 0
    match_status: Optional[str] = "Insufficient Information"
    eligibility_summary: Optional[str] = None

    class Config:
        from_attributes = True

# --- Eligibility Engine Schemas ---
class RuleCheckResult(BaseModel):
    rule_code: str
    rule_name: str
    category: str
    student_value: Any
    required_condition: str
    passed: bool
    explanation: str

class EligibilityAssessment(BaseModel):
    scholarship_id: int
    scholarship_title: str
    status: str  # "Eligible", "Potentially Eligible", "Not Eligible", "Insufficient Information"
    match_score: int  # 0 to 100
    rule_checks: List[RuleCheckResult]
    ai_explanation: str
    next_steps: List[str]
    caveat: str = "This assessment is based on structured rules and does not guarantee official approval."

class SimulatorRequest(BaseModel):
    scholarship_id: int
    annual_family_income: Optional[float] = None
    previous_marks_percentage: Optional[float] = None
    education_level: Optional[str] = None
    admission_type: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None

class SimulatorResponse(BaseModel):
    original_status: str
    simulated_status: str
    original_score: int
    simulated_score: int
    changed_factors: List[str]
    impact_explanation: str

# --- Copilot Schemas ---
class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None

class CopilotQuery(BaseModel):
    query: str
    language: str = "en"  # "en", "te", "hi"
    include_student_context: bool = True
    active_scholarship_id: Optional[int] = None

class CitationSource(BaseModel):
    title: str
    clause: str
    url: str
    verified: bool

class CopilotResponse(BaseModel):
    answer: str
    language: str
    citations: List[CitationSource]
    suggested_questions: List[str]
    action_pills: List[Dict[str, str]]

# --- Document Intelligence Schemas ---
class DocumentItem(BaseModel):
    id: int
    student_id: int
    document_type: str
    document_name: str
    file_url: str
    file_size_kb: float
    file_format: str
    is_verified: bool
    upload_date: datetime.datetime
    expiry_date: Optional[str]
    extracted_metadata: Dict[str, Any]
    ocr_confidence_score: float
    notes: Optional[str]

    class Config:
        from_attributes = True

class DiscrepancyItem(BaseModel):
    field_name: str
    severity: str  # "MATCH", "MINOR_DISCREPANCY", "CRITICAL_MISMATCH"
    source_document_1: str
    value_1: str
    source_document_2: str
    value_2: str
    explanation: str
    remediation_guidance: str

class CrossDocumentConsistencyReport(BaseModel):
    student_id: int
    overall_status: str  # "ALL_VERIFIED_MATCH", "MINOR_ISSUES_DETECTED", "CRITICAL_DISCREPANCIES"
    match_percentage: int
    discrepancies: List[DiscrepancyItem]
    audit_timestamp: str

# --- Zero-Repeat-Visit Schemas ---
class ZeroVisitChecklistItem(BaseModel):
    item_id: str
    document_name: str
    category: str  # "Original Document", "Photocopy Set", "Attestation / Stamp", "Bank Verification", "Identity Reference"
    is_mandatory: bool
    quantity_required: int
    uploaded_in_vault: bool
    vault_doc_id: Optional[int]
    attestation_instructions: str
    special_notes: str

class ZeroVisitReport(BaseModel):
    process_name: str
    target_office: str
    office_address: str
    visiting_hours: str
    contact_helpline: str
    readiness_status: str  # "READY", "ACTION REQUIRED", "REQUIREMENTS UNCLEAR"
    readiness_score: int
    missing_mandatory_count: int
    checklist: List[ZeroVisitChecklistItem]
    official_rules_summary: str
    critical_dos_and_donts: List[str]

# --- Application Journey & Problem Solver Schemas ---
class ApplicationEventResponse(BaseModel):
    id: int
    event_title: str
    event_description: Optional[str]
    stage: str
    timestamp: datetime.datetime
    source: str

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    scholarship_id: int
    scholarship_title: str
    application_reference_no: Optional[str]
    portal_name: str
    current_stage: str
    is_officially_verified: bool
    submission_date: Optional[str]
    last_status_update_date: datetime.datetime
    rejection_reason: Optional[str]
    correction_deadline: Optional[str]
    events: List[ApplicationEventResponse]
    next_action_recommendation: str

    class Config:
        from_attributes = True

class ProblemSolverRequest(BaseModel):
    error_message: str
    application_id: Optional[int] = None
    portal_name: Optional[str] = "Telangana ePASS"

class ProblemSolverResponse(BaseModel):
    diagnosed_issue: str
    severity: str  # "Action Required", "Information", "Grievance Required"
    root_cause_explanation: str
    official_rule_reference: str
    remedial_steps: List[str]
    grievance_portal_url: Optional[str]
    escalation_contacts: List[Dict[str, str]]
    can_appeal_or_correct: bool
    recommended_deadline_days: int

# --- Smart Planner & Funding Gap Schemas ---
class DeadlineMilestone(BaseModel):
    milestone_date: str
    days_remaining: int
    title: str
    description: str
    category: str
    is_completed: bool

class BackwardPlanResponse(BaseModel):
    scholarship_title: str
    final_deadline: str
    milestones: List[DeadlineMilestone]
    recommendation_summary: str

class FundingGapRequest(BaseModel):
    annual_tuition_fee: float
    hostel_living_expenses: float
    transportation_expenses: float
    academic_supplies: float
    family_contribution: float
    existing_financial_aid: float = 0.0

class AidStackLayer(BaseModel):
    layer_name: str
    type_tag: str  # "Fee Reimbursement (Govt)", "Maintenance Allowance (Govt)", "Merit Scholarship (CSR)", "Low-Interest Loan"
    estimated_amount: float
    eligibility_note: str
    is_loan: bool
    repayment_warning: Optional[str] = None

class FundingGapResponse(BaseModel):
    total_educational_expenses: float
    existing_funding_available: float
    net_funding_gap: float
    aid_stack: List[AidStackLayer]
    advisory_notice: str

# --- Change Detector Schemas ---
class GuidelineChangeItem(BaseModel):
    scholarship_title: str
    version_tag: str
    publication_date: str
    change_category: str  # "Income Limit", "Deadline Extension", "Document Requirement", "Benefit Expansion"
    previous_rule: str
    updated_rule: str
    official_document_ref: str
    impact_on_user_profile: str
    user_action_required: bool
