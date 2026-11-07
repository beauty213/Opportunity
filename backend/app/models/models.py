import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # "student", "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    dob = Column(String(20), nullable=True)  # YYYY-MM-DD
    gender = Column(String(50), nullable=True)
    state = Column(String(100), default="Telangana")
    district = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    category = Column(String(50), default="BC-B")  # SC, ST, BC-A, BC-B, BC-C, BC-D, BC-E, EWS, General
    sub_caste = Column(String(100), nullable=True)
    is_disabled = Column(Boolean, default=False)
    disability_type = Column(String(100), nullable=True)
    disability_percentage = Column(Float, nullable=True)
    is_first_generation = Column(Boolean, default=False)
    achievements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    educational_record = relationship("EducationalRecord", back_populates="student_profile", uselist=False)
    financial_profile = relationship("FinancialProfile", back_populates="student_profile", uselist=False)
    documents = relationship("StudentDocument", back_populates="student_profile")
    applications = relationship("Application", back_populates="student_profile")
    visit_reports = relationship("VisitReadinessReport", back_populates="student_profile")


class EducationalRecord(Base):
    __tablename__ = "educational_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True, nullable=False)
    education_level = Column(String(100), default="Undergraduate")  # Diploma, Undergraduate, Postgraduate
    course_name = Column(String(150), default="B.Tech")
    branch = Column(String(150), default="Electronics & Communication Engineering (ECE)")
    institution_name = Column(String(255), default="JNTUH University College of Engineering Hyderabad")
    university_name = Column(String(255), default="Jawaharlal Nehru Technological University Hyderabad")
    institution_state = Column(String(100), default="Telangana")
    academic_year = Column(Integer, default=2)  # 1st, 2nd, 3rd, 4th year
    current_semester = Column(Integer, default=3)
    admission_type = Column(String(100), default="Lateral Entry")  # Regular, Lateral Entry, Convenor Quota
    previous_qualification = Column(String(100), default="Diploma in ECE")
    previous_marks_percentage = Column(Float, default=84.5)
    current_cgpa = Column(Float, default=8.2)
    hall_ticket_number = Column(String(100), default="22015-EC-042")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="educational_record")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True, nullable=False)
    annual_family_income = Column(Float, default=175000.0)  # in INR
    income_certificate_number = Column(String(100), default="IC012398472910")
    income_certificate_issue_date = Column(String(20), default="2026-04-12")
    annual_tuition_fee = Column(Float, default=85000.0)
    hostel_living_expenses = Column(Float, default=50000.0)
    transportation_expenses = Column(Float, default=15000.0)
    family_contribution = Column(Float, default=25000.0)
    existing_financial_aid = Column(Float, default=0.0)
    bank_name = Column(String(150), default="State Bank of India")
    bank_account_no = Column(String(50), default="39847291045")
    bank_ifsc = Column(String(50), default="SBIN0012345")
    is_aadhaar_seeded_npci = Column(Boolean, default=True)  # Aadhaar DBT mapping status
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="financial_profile")


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    provider = Column(String(255), nullable=False)
    provider_type = Column(String(100), default="Government State")  # Government State, Government Central, Private, Corporate CSR
    target_state = Column(String(100), default="Telangana")  # Telangana, All India
    description = Column(Text, nullable=False)
    financial_benefits = Column(Text, nullable=False)
    award_amount_max = Column(Float, default=0.0)  # Max annual monetary value
    deadline = Column(String(30), nullable=False)  # YYYY-MM-DD
    is_active = Column(Boolean, default=True)
    is_renewal_allowed = Column(Boolean, default=True)
    is_fully_funded = Column(Boolean, default=False)
    education_levels = Column(Text, default="Diploma,Undergraduate")  # Comma separated
    eligible_courses = Column(Text, default="B.Tech,Diploma,Degree,Pharmacy")
    min_percentage = Column(Float, default=0.0)
    max_family_income = Column(Float, default=200000.0)  # 2 Lakhs standard for BC in Telangana
    eligible_categories = Column(Text, default="SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General")
    allows_lateral_entry = Column(Boolean, default=True)
    verification_status = Column(String(100), default="Officially Verified")
    official_source_url = Column(String(500), nullable=False)
    apply_url = Column(String(500), nullable=False)
    required_documents_json = Column(Text, default="[]")  # JSON list
    application_procedure_markdown = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    eligibility_rules = relationship("EligibilityRule", back_populates="scholarship")
    guideline_versions = relationship("GuidelineVersion", back_populates="scholarship")
    applications = relationship("Application", back_populates="scholarship")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    rule_code = Column(String(100), nullable=False)
    rule_name = Column(String(255), nullable=False)
    rule_category = Column(String(100), default="academic")  # academic, financial, domicile, category, admission
    operator = Column(String(50), default="<=")  # <=, >=, ==, IN, CONTAINS
    threshold_value = Column(String(255), nullable=False)
    is_mandatory = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

    scholarship = relationship("Scholarship", back_populates="eligibility_rules")


class StudentDocument(Base):
    __tablename__ = "student_documents"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    document_type = Column(String(100), nullable=False)  # income_cert, caste_cert, marks_memo, bonafide_cert, bank_passbook, fee_receipt, aadhaar_card
    document_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size_kb = Column(Float, default=150.0)
    file_format = Column(String(20), default="PDF")
    is_verified = Column(Boolean, default=True)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(String(30), nullable=True)  # YYYY-MM-DD
    extracted_metadata_json = Column(Text, default="{}")
    ocr_confidence_score = Column(Float, default=0.96)
    notes = Column(Text, nullable=True)

    student_profile = relationship("StudentProfile", back_populates="documents")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    application_reference_no = Column(String(100), nullable=True)
    portal_name = Column(String(150), default="Telangana ePASS")
    current_stage = Column(String(100), default="Discovered")
    # Stages: Discovered, Shortlisted, Eligibility Checked, Documents Prepared,
    # Ready to Apply, Submitted, Under Verification, Correction Requested,
    # Approved, Rejected, Payment Pending, Disbursed, Renewal Due
    is_officially_verified = Column(Boolean, default=False)
    submission_date = Column(String(30), nullable=True)
    last_status_update_date = Column(DateTime, default=datetime.datetime.utcnow)
    rejection_reason = Column(Text, nullable=True)
    correction_deadline = Column(String(30), nullable=True)
    notes_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")
    events = relationship("ApplicationEvent", back_populates="application")


class ApplicationEvent(Base):
    __tablename__ = "application_events"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    event_title = Column(String(255), nullable=False)
    event_description = Column(Text, nullable=True)
    stage = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    source = Column(String(100), default="Student Reported")  # Student Reported, Official Portal Notice

    application = relationship("Application", back_populates="events")


class VisitReadinessReport(Base):
    __tablename__ = "visit_readiness_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    process_name = Column(String(255), nullable=False)
    readiness_status = Column(String(50), default="ACTION REQUIRED")  # READY, ACTION REQUIRED, REQUIREMENTS UNCLEAR
    readiness_percentage = Column(Integer, default=75)
    checklist_json = Column(Text, default="{}")
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="visit_reports")


class GuidelineVersion(Base):
    __tablename__ = "guideline_versions"

    id = Column(Integer, primary_key=True, index=True)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    version_tag = Column(String(50), nullable=False)  # e.g., "v2026.2"
    publication_date = Column(String(30), nullable=False)  # YYYY-MM-DD
    summary_of_changes = Column(Text, nullable=False)
    old_values_json = Column(Text, default="{}")
    new_values_json = Column(Text, default="{}")
    official_source_doc = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)

    scholarship = relationship("Scholarship", back_populates="guideline_versions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(100), default="general")  # deadline_alert, change_detected, consistency_alert, journey_update
    is_read = Column(Boolean, default=False)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
