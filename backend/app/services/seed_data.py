import json
import datetime
from sqlalchemy.orm import Session
from app.models.models import (
    User, StudentProfile, EducationalRecord, FinancialProfile,
    Scholarship, EligibilityRule, StudentDocument, Application,
    ApplicationEvent, GuidelineVersion, Notification
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Scholarship).count() > 0:
        return

    print("Seeding ScholarEase database with verified scholarships and demo students...")

    # --- 1. SCHOLARSHIPS ---
    scholarships_data = [
        {
            "title": "Telangana ePASS Post-Matric Scholarship (RTF & MTF)",
            "slug": "telangana-epass-post-matric",
            "provider": "Department of Social Welfare, Government of Telangana",
            "provider_type": "Government State",
            "target_state": "Telangana",
            "description": "Comprehensive fee reimbursement (RTF) and maintenance fee (MTF) for SC, ST, BC, EBC, Minority, and Specially-Abled students studying Post-Matric courses including 4-year B.Tech and 3-year Lateral Entry B.Tech in recognized colleges.",
            "financial_benefits": "Full Tuition Fee Reimbursement (up to ₹85,000-₹1,20,000 depending on college convenor fee) + Monthly Maintenance Fee (MTF) of ₹1,400 to ₹2,000 for college hostelers/day scholars.",
            "award_amount_max": 105000.0,
            "deadline": "2026-11-30",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": True,
            "education_levels": "Diploma,Undergraduate,Postgraduate",
            "eligible_courses": "B.Tech,Diploma in Engineering,B.Pharmacy,MBA,MCA,Degree",
            "min_percentage": 50.0,
            "max_family_income": 200000.0,  # 2.0 Lakhs for BC/EBC in rural & urban
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS",
            "allows_lateral_entry": True,
            "verification_status": "Officially Verified",
            "official_source_url": "https://telanganaepass.cgg.gov.in/",
            "apply_url": "https://telanganaepass.cgg.gov.in/Postmatrichomepage.do",
            "required_documents_json": json.dumps([
                {"name": "Latest MeeSeva Income Certificate (issued within 1 year)", "is_mandatory": True, "description": "Issued by Tahsildar / MeeSeva with verifiable barcode"},
                {"name": "Permanent Caste Certificate (C-Series from MeeSeva)", "is_mandatory": True, "description": "Barcoded caste certificate for SC/ST/BC"},
                {"name": "College Study / Bonafide Certificate with Principal Seal", "is_mandatory": True, "description": "Current academic year certificate confirming admission quota"},
                {"name": "Previous Qualifying Mark Memo (Diploma / Inter)", "is_mandatory": True, "description": "Consolidated marks memo or final semester marksheet"},
                {"name": "Bank Passbook with Aadhaar-NPCI Seeding confirmation", "is_mandatory": True, "description": "Nationalized bank account mapped to Aadhaar via NPCI"},
                {"name": "College Admission Allotment Order & Fee Receipt", "is_mandatory": True, "description": "TS ECET / TS EAMCET Convenor allotment order"}
            ]),
            "application_procedure_markdown": "1. Apply online at telanganaepass.cgg.gov.in selecting Post-Matric Fresh/Renewal.\n2. Enter SSC Hall Ticket, Year of Pass, and Admission Allotment Order Number.\n3. Upload scanned MeeSeva Income and Caste certificates.\n4. Submit hard copy printout with all original attestation seals to the College Scholarship Clerk within 10 days of online submission.\n5. College Nodal Officer verifies and forwards to District Welfare Officer (DWO).",
            "rules": [
                {"code": "DOMICILE_STATE", "name": "Telangana State Domicile", "category": "domicile", "operator": "==", "val": "Telangana", "mandatory": True, "desc": "Student must be a local resident of Telangana State."},
                {"code": "INCOME_LIMIT_BC", "name": "BC/EBC Annual Family Income <= 2 Lakhs", "category": "financial", "operator": "<=", "val": "200000", "mandatory": True, "desc": "Annual income of parents/guardians should not exceed ₹2,00,000 for BC/EBC categories."},
                {"code": "ADMISSION_TYPE", "name": "Convenor Quota / Lateral Entry", "category": "admission", "operator": "IN", "val": "Convenor Quota,Lateral Entry,Regular", "mandatory": True, "desc": "Admitted through TS ECET or TS EAPCET convenor counseling. Management quota ineligible."},
                {"code": "ATTENDANCE_MIN", "name": "Minimum 75% Biometric Attendance", "category": "academic", "operator": ">=", "val": "75", "mandatory": True, "desc": "College biometric attendance must be 75% or higher."}
            ]
        },
        {
            "title": "National Scholarship Portal (NSP) - Central Sector Scheme for College Students (CSSS)",
            "slug": "nsp-central-sector-scheme",
            "provider": "Department of Higher Education, Ministry of Education, Govt of India",
            "provider_type": "Government Central",
            "target_state": "All India",
            "description": "Scholarships for meritorious college and university students from low-income families to meet day-to-day college expenses while pursuing graduate and professional studies.",
            "financial_benefits": "₹12,000 per annum at Graduation level for first 3 years and ₹20,000 per annum at Post-Graduation level.",
            "award_amount_max": 20000.0,
            "deadline": "2026-12-15",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": False,
            "education_levels": "Undergraduate,Postgraduate",
            "eligible_courses": "B.Tech,B.Sc,B.Com,BA,MBBS",
            "min_percentage": 80.0,  # Top 20th percentile in Class 12 board
            "max_family_income": 450000.0,
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General",
            "allows_lateral_entry": False,  # Standard CSSS requires 10+2 top 20th percentile
            "verification_status": "Officially Verified",
            "official_source_url": "https://scholarships.gov.in/",
            "apply_url": "https://scholarships.gov.in/",
            "required_documents_json": json.dumps([
                {"name": "Aadhaar Card with Biometric Face Authentication", "is_mandatory": True, "description": "Verified on NSP portal using Aadhaar FaceRD app"},
                {"name": "Class 12th Board Marksheet", "is_mandatory": True, "description": "Showing top 20th percentile ranking in board exams"},
                {"name": "Family Income Certificate", "is_mandatory": True, "description": "Annual income below ₹4.5 Lakhs"},
                {"name": "College Enrollment / Bonafide Certificate", "is_mandatory": True, "description": "Signed by Head of Institution"}
            ]),
            "application_procedure_markdown": "1. Register on NSP (scholarships.gov.in) with One-Time Registration (OTR).\n2. Complete Aadhaar Face Authentication using the NSP OTR app.\n3. Select Central Sector Scheme of Scholarship for College and University Students.\n4. Institute verifies electronic application on NSP portal.",
            "rules": [
                {"code": "CLASS_12_MARKS", "name": "Class 12 Marks >= 80%", "category": "academic", "operator": ">=", "val": "80", "mandatory": True, "desc": "Must score above 80th percentile in relevant State Board or CBSE."},
                {"code": "INCOME_LIMIT_NSP", "name": "Income <= 4.5 Lakhs", "category": "financial", "operator": "<=", "val": "450000", "mandatory": True, "desc": "Gross parental income cannot exceed ₹4,50,000."}
            ]
        },
        {
            "title": "AICTE Pragati Scholarship for Girl Students (Technical Degree)",
            "slug": "aicte-pragati-degree-girls",
            "provider": "All India Council for Technical Education (AICTE)",
            "provider_type": "Government Central",
            "target_state": "All India",
            "description": "Scheme aimed at providing assistance for advancement of girls pursuing technical education. Covers girls admitted to 1st year Degree or 2nd year Degree through Lateral Entry in AICTE approved institutions.",
            "financial_benefits": "₹50,000 per annum for every year of study towards college fee, computer purchase, books, and competitive exam fees.",
            "award_amount_max": 50000.0,
            "deadline": "2026-11-25",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": False,
            "education_levels": "Undergraduate",
            "eligible_courses": "B.Tech,B.E,B.Arch,B.Pharmacy",
            "min_percentage": 60.0,
            "max_family_income": 800000.0,
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General",
            "allows_lateral_entry": True,  # Explicitly supports 2nd year lateral entry
            "verification_status": "Officially Verified",
            "official_source_url": "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
            "apply_url": "https://scholarships.gov.in/",
            "required_documents_json": json.dumps([
                {"name": "Class 10 and 12/Diploma Marksheets", "is_mandatory": True, "description": "Proof of qualification marks"},
                {"name": "Income Certificate (< ₹8 Lakhs)", "is_mandatory": True, "description": "Issued by Tehsildar/Competent authority"},
                {"name": "Director/Principal Bonafide Certificate", "is_mandatory": True, "description": "Confirming AICTE approval of institution and branch"},
                {"name": "Tuition Fee Receipt", "is_mandatory": True, "description": "Copy of paid college fee receipt"}
            ]),
            "application_procedure_markdown": "1. Apply online via National Scholarship Portal under AICTE Schemes.\n2. Submit Bonafide and family income certificate.\n3. Institution AICTE Nodal Officer conducts online verification.",
            "rules": [
                {"code": "GENDER_FEMALE", "name": "Female Candidates Only", "category": "demographic", "operator": "==", "val": "Female", "mandatory": True, "desc": "Scholarship is exclusively for female students (up to 2 girls per family)."},
                {"code": "INCOME_LIMIT_AICTE", "name": "Family Income <= 8 Lakhs", "category": "financial", "operator": "<=", "val": "800000", "mandatory": True, "desc": "Parental income must not exceed ₹8,00,000 per annum."},
                {"code": "AICTE_APPROVED", "name": "AICTE Approved Institution", "category": "academic", "operator": "==", "val": "True", "mandatory": True, "desc": "Institution and engineering course must hold valid AICTE approval."}
            ]
        },
        {
            "title": "Reliance Foundation Undergraduate Scholarship",
            "slug": "reliance-foundation-undergraduate",
            "provider": "Reliance Foundation",
            "provider_type": "Corporate CSR",
            "target_state": "All India",
            "description": "Merit-cum-means scholarship supporting undergraduate students across all disciplines to pursue higher education, with additional mentorship and development workshops.",
            "financial_benefits": "Up to ₹2,00,000 over the duration of the degree course + Leadership training sessions and alumni network access.",
            "award_amount_max": 200000.0,
            "deadline": "2026-10-15",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": False,
            "education_levels": "Undergraduate",
            "eligible_courses": "B.Tech,B.Sc,B.Com,BA,BBA,B.Pharmacy",
            "min_percentage": 60.0,
            "max_family_income": 1500000.0,  # Preference to < 2.5 Lakhs
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General",
            "allows_lateral_entry": True,
            "verification_status": "Officially Verified",
            "official_source_url": "https://www.scholarships.reliancefoundation.org/",
            "apply_url": "https://www.scholarships.reliancefoundation.org/UG_Scholarship.aspx",
            "required_documents_json": json.dumps([
                {"name": "Previous Qualifying Mark Memo (12th / Diploma)", "is_mandatory": True, "description": "Minimum 60% aggregate"},
                {"name": "Annual Family Income Proof", "is_mandatory": True, "description": "Income Certificate / Salary Slip / ITR / Form 16"},
                {"name": "College Identity Card or Bonafide Letter", "is_mandatory": True, "description": "Proof of full-time enrollment"},
                {"name": "Two Letters of Reference", "is_mandatory": False, "description": "From high school teacher or college professor"}
            ]),
            "application_procedure_markdown": "1. Submit online application on Reliance Foundation Scholarship portal.\n2. Complete mandatory 60-minute online aptitude test (Math, Verbal, Analytical).\n3. Shortlisted candidates are announced for merit-cum-means disbursement.",
            "rules": [
                {"code": "MIN_MARKS_60", "name": "Minimum 60% Marks in Qualifying Exam", "category": "academic", "operator": ">=", "val": "60", "mandatory": True, "desc": "Minimum 60% aggregate in 12th standard or Diploma."},
                {"code": "MAX_INCOME_RELIANCE", "name": "Income <= 15 Lakhs (Priority < 2.5L)", "category": "financial", "operator": "<=", "val": "1500000", "mandatory": True, "desc": "Preference given to students with family income less than ₹2.5 Lakhs."}
            ]
        },
        {
            "title": "HDFC Bank Parivartan's ECSS Programme",
            "slug": "hdfc-bank-parivartan-ecss",
            "provider": "HDFC Bank",
            "provider_type": "Corporate CSR",
            "target_state": "All India",
            "description": "Educational Crisis Support Scholarship (ECSS) supporting meritorious and needy students facing financial hardship or loss of earning parent to continue their education.",
            "financial_benefits": "Up to ₹75,000 for professional degree students (Engineering, Medical, Law) towards tuition and college fee.",
            "award_amount_max": 75000.0,
            "deadline": "2026-12-31",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": False,
            "education_levels": "Diploma,Undergraduate,Postgraduate",
            "eligible_courses": "B.Tech,Diploma,MBBS,LLB,B.Sc",
            "min_percentage": 55.0,
            "max_family_income": 250000.0,
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General",
            "allows_lateral_entry": True,
            "verification_status": "Officially Verified",
            "official_source_url": "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme",
            "apply_url": "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme",
            "required_documents_json": json.dumps([
                {"name": "Previous Year Marksheet", "is_mandatory": True, "description": "Minimum 55% marks"},
                {"name": "Income Proof from Govt Authority", "is_mandatory": True, "description": "Income below ₹2.5 Lakhs"},
                {"name": "Current Year College Fee Receipt", "is_mandatory": True, "description": "Shows exact fee payable"}
            ]),
            "application_procedure_markdown": "1. Apply through Buddy4Study portal.\n2. Upload income proof, previous semester memo, and fee receipt.\n3. Telephonic interview round before grant sanction.",
            "rules": [
                {"code": "MIN_MARKS_55", "name": "Previous Marks >= 55%", "category": "academic", "operator": ">=", "val": "55", "mandatory": True, "desc": "Candidate must have passed previous academic level with 55% or higher."},
                {"code": "INCOME_LIMIT_HDFC", "name": "Income <= 2.5 Lakhs", "category": "financial", "operator": "<=", "val": "250000", "mandatory": True, "desc": "Family income must be ₹2,50,000 or below."}
            ]
        },
        {
            "title": "Tata Capital Pankh Scholarship Programme",
            "slug": "tata-capital-pankh-scholarship",
            "provider": "Tata Capital Limited",
            "provider_type": "Corporate CSR",
            "target_state": "All India",
            "description": "Financial assistance program for students studying in professional degree courses (Engineering, Medical, Law) to empower youth from underprivileged backgrounds.",
            "financial_benefits": "Up to 80% of tuition fees or ₹50,000 (whichever is lower).",
            "award_amount_max": 50000.0,
            "deadline": "2026-11-15",
            "is_active": True,
            "is_renewal_allowed": True,
            "is_fully_funded": False,
            "education_levels": "Undergraduate",
            "eligible_courses": "B.Tech,B.E,MBBS",
            "min_percentage": 60.0,
            "max_family_income": 400000.0,
            "eligible_categories": "SC,ST,BC-A,BC-B,BC-C,BC-D,BC-E,EWS,General",
            "allows_lateral_entry": True,
            "verification_status": "Officially Verified",
            "official_source_url": "https://www.tatacapital.com/csr/pankh.html",
            "apply_url": "https://www.tatacapital.com/csr/pankh.html",
            "required_documents_json": json.dumps([
                {"name": "Marksheet of Previous Qualifying Exam", "is_mandatory": True, "description": "Showing minimum 60% marks"},
                {"name": "Income Certificate", "is_mandatory": True, "description": "Less than ₹4 Lakhs per annum"},
                {"name": "Admission Confirmation Letter", "is_mandatory": True, "description": "Bonafide from college"}
            ]),
            "application_procedure_markdown": "1. Online submission of academic and financial credentials.\n2. Telephonic verification.\n3. Direct bank transfer into student's verified account.",
            "rules": [
                {"code": "MIN_MARKS_60", "name": "Marks >= 60%", "category": "academic", "operator": ">=", "val": "60", "mandatory": True, "desc": "Minimum 60% in qualifying board or diploma examination."},
                {"code": "INCOME_LIMIT_TATA", "name": "Income <= 4 Lakhs", "category": "financial", "operator": "<=", "val": "400000", "mandatory": True, "desc": "Parental income below ₹4,00,000."}
            ]
        }
    ]

    for item in scholarships_data:
        rules_data = item.pop("rules", [])
        sch = Scholarship(**item)
        db.add(sch)
        db.flush()

        for r in rules_data:
            rule_obj = EligibilityRule(
                scholarship_id=sch.id,
                rule_code=r["code"],
                rule_name=r["name"],
                rule_category=r["category"],
                operator=r["operator"],
                threshold_value=r["val"],
                is_mandatory=r["mandatory"],
                description=r["desc"]
            )
            db.add(rule_obj)

    # --- 2. GUIDELINE VERSIONS (For Change Detector) ---
    epass = db.query(Scholarship).filter(Scholarship.slug == "telangana-epass-post-matric").first()
    if epass:
        gv1 = GuidelineVersion(
            scholarship_id=epass.id,
            version_tag="G.O. Ms. No. 66 (Revised)",
            publication_date="2026-08-20",
            summary_of_changes="Annual Family Income ceiling revised from ₹1,50,000 to ₹2,00,000 for BC and EBC students in both rural and urban areas. Mandatory Aadhaar NPCI bank account seeding reinforced.",
            old_values_json=json.dumps({"max_family_income": 150000, "urban_income_limit": 150000, "bank_verification": "Manual IFSC / Branch passbook"}),
            new_values_json=json.dumps({"max_family_income": 200000, "urban_income_limit": 200000, "bank_verification": "Automated NPCI Aadhaar DBT Mapper active"}),
            official_source_doc="G.O. Ms. No. 66, Backward Classes Welfare (OP) Dept, Govt of Telangana",
            is_active=True
        )
        db.add(gv1)

        gv2 = GuidelineVersion(
            scholarship_id=epass.id,
            version_tag="Notification Memo 412/ePASS/2026",
            publication_date="2026-10-25",
            summary_of_changes="Online application last date extended from October 31, 2026 to November 30, 2026 to facilitate Lateral Entry students completing TS ECET 3rd round web counselling.",
            old_values_json=json.dumps({"deadline": "2026-10-31"}),
            new_values_json=json.dumps({"deadline": "2026-11-30"}),
            official_source_doc="Director of Social Welfare & ePASS Commissionerate Notice",
            is_active=True
        )
        db.add(gv2)

    # --- 3. DEMO USERS AND PROFILES ---
    # Demo User 1: Rahul Korra (Telangana Lateral Entry B.Tech ECE)
    user_rahul = User(
        email="rahul.korra@example.com",
        hashed_password="demo_password_hash_rahul",
        full_name="Rahul Korra",
        role="student",
        is_active=True
    )
    db.add(user_rahul)
    db.flush()

    profile_rahul = StudentProfile(
        user_id=user_rahul.id,
        full_name="Rahul Korra",
        dob="2004-08-15",
        gender="Male",
        state="Telangana",
        district="Hyderabad",
        phone="+91 98765 43210",
        category="BC-B",
        sub_caste="Goud",
        is_disabled=False,
        is_first_generation=True,
        achievements="State Polytechnic Technical Paper Presentation Winner (Rank 3)"
    )
    db.add(profile_rahul)
    db.flush()

    edu_rahul = EducationalRecord(
        student_id=profile_rahul.id,
        education_level="Undergraduate",
        course_name="B.Tech",
        branch="Electronics & Communication Engineering (ECE)",
        institution_name="JNTUH University College of Engineering Hyderabad",
        university_name="Jawaharlal Nehru Technological University Hyderabad",
        institution_state="Telangana",
        academic_year=2,
        current_semester=3,
        admission_type="Lateral Entry",
        previous_qualification="Diploma in ECE",
        previous_marks_percentage=84.5,
        current_cgpa=8.2,
        hall_ticket_number="22015-EC-042"
    )
    db.add(edu_rahul)

    fin_rahul = FinancialProfile(
        student_id=profile_rahul.id,
        annual_family_income=175000.0,
        income_certificate_number="IC012398472910",
        income_certificate_issue_date="2026-04-12",
        annual_tuition_fee=85000.0,
        hostel_living_expenses=50000.0,
        transportation_expenses=15000.0,
        family_contribution=25000.0,
        existing_financial_aid=0.0,
        bank_name="State Bank of India",
        bank_account_no="39847291045",
        bank_ifsc="SBIN0012345",
        is_aadhaar_seeded_npci=True
    )
    db.add(fin_rahul)

    # Rahul's Documents in Vault (Missing Bonafide for Zero-Repeat-Visit Demo)
    doc1 = StudentDocument(
        student_id=profile_rahul.id,
        document_type="income_cert",
        document_name="MeeSeva_Income_Certificate_2026.pdf",
        file_url="/uploads/demo_rahul_income_cert.pdf",
        file_size_kb=180.5,
        file_format="PDF",
        is_verified=True,
        expiry_date="2027-04-11",
        ocr_confidence_score=0.98,
        extracted_metadata_json=json.dumps({
            "applicant_name": "Rahul Korra",
            "father_name": "Korra Srinivas",
            "annual_income": "175000",
            "certificate_number": "IC012398472910",
            "mandal": "Secunderabad",
            "district": "Hyderabad",
            "issuing_authority": "Tahsildar MeeSeva Center"
        }),
        notes="Verified active on MeeSeva portal."
    )
    doc2 = StudentDocument(
        student_id=profile_rahul.id,
        document_type="caste_cert",
        document_name="MeeSeva_Caste_Certificate_BC_B.pdf",
        file_url="/uploads/demo_rahul_caste_cert.pdf",
        file_size_kb=160.0,
        file_format="PDF",
        is_verified=True,
        ocr_confidence_score=0.97,
        extracted_metadata_json=json.dumps({
            "candidate_name": "Rahul Korra",
            "father_name": "Korra Srinivas",
            "category": "BC-B",
            "sub_caste": "Goud",
            "certificate_number": "CC98124701239",
            "state": "Telangana"
        }),
        notes="Permanent C-Series caste certificate."
    )
    doc3 = StudentDocument(
        student_id=profile_rahul.id,
        document_type="marks_memo",
        document_name="SBTET_Diploma_Consolidated_Marks_Memo.pdf",
        file_url="/uploads/demo_rahul_diploma_memo.pdf",
        file_size_kb=240.0,
        file_format="PDF",
        is_verified=True,
        ocr_confidence_score=0.96,
        extracted_metadata_json=json.dumps({
            "student_name": "Rahul Korra",
            "pin_number": "19015-EC-042",
            "institution": "Govt Polytechnic Masab Tank Hyderabad",
            "branch": "Electronics and Communication Engineering",
            "aggregate_percentage": "84.50%",
            "division": "First Class with Distinction"
        }),
        notes="Polytechnic diploma consolidated marks memo."
    )
    doc4 = StudentDocument(
        student_id=profile_rahul.id,
        document_type="bank_passbook",
        document_name="SBI_Aadhaar_Seeded_Bank_Passbook.pdf",
        file_url="/uploads/demo_rahul_bank_passbook.pdf",
        file_size_kb=195.0,
        file_format="PDF",
        is_verified=True,
        ocr_confidence_score=0.95,
        extracted_metadata_json=json.dumps({
            "account_holder": "Rahul Korra",
            "bank_name": "State Bank of India",
            "account_number": "39847291045",
            "ifsc": "SBIN0012345",
            "npci_aadhaar_status": "Active / Seeded"
        }),
        notes="Confirmed NPCI mapped for Direct Benefit Transfer (DBT)."
    )
    db.add_all([doc1, doc2, doc3, doc4])

    # Rahul's Active Application on ePASS
    app_rahul = Application(
        student_id=profile_rahul.id,
        scholarship_id=epass.id if epass else 1,
        application_reference_no="TS-EPASS-2026-9812401",
        portal_name="Telangana ePASS",
        current_stage="Documents Prepared",
        is_officially_verified=False,
        submission_date=None,
        notes_json=json.dumps(["Profile match confirmed", "Online application draft initiated", "Pending college Bonafide submission"])
    )
    db.add(app_rahul)
    db.flush()

    evt1 = ApplicationEvent(
        application_id=app_rahul.id,
        event_title="Scholarship Discovered and Shortlisted",
        event_description="Student shortlisted Telangana ePASS Post-Matric RTF & MTF based on 100% rule match.",
        stage="Shortlisted",
        source="Student Reported"
    )
    evt2 = ApplicationEvent(
        application_id=app_rahul.id,
        event_title="Automated Rule Match Evaluated",
        event_description="Eligibility engine confirmed: BC-B, Income ₹1.75L <= ₹2.0L ceiling, Lateral Entry B.Tech convenor quota approved.",
        stage="Eligibility Checked",
        source="Student Reported"
    )
    evt3 = ApplicationEvent(
        application_id=app_rahul.id,
        event_title="Document Vault Audit Completed",
        event_description="Income Certificate, Caste Certificate, Diploma memo, and Bank Passbook uploaded and verified. Bonafide pending.",
        stage="Documents Prepared",
        source="Student Reported"
    )
    db.add_all([evt1, evt2, evt3])

    # Notifications for Rahul
    n1 = Notification(
        user_id=user_rahul.id,
        title="Scholarship Change Detected: ePASS Income Ceiling Raised",
        message="Telangana ePASS revised BC family income limit to ₹2,00,000 under G.O. Ms. No. 66. Your profile (₹1,75,000) is well within the eligible limit!",
        notification_type="change_detected",
        action_url="/changes"
    )
    n2 = Notification(
        user_id=user_rahul.id,
        title="Zero-Repeat-Visit Reminder: Collect College Bonafide",
        message="Your ePASS visit readiness is at 80%. You need to collect the Bonafide Certificate with Principal's seal before visiting the college scholarship counter.",
        notification_type="journey_update",
        action_url="/zero-visit"
    )
    db.add_all([n1, n2])

    # --- Demo User 2: Sneha Patel (Rejection Recovery Case) ---
    user_sneha = User(
        email="sneha.patel@example.com",
        hashed_password="demo_password_hash_sneha",
        full_name="Sneha Patel",
        role="student",
        is_active=True
    )
    db.add(user_sneha)
    db.flush()

    profile_sneha = StudentProfile(
        user_id=user_sneha.id,
        full_name="Sneha Patel",
        dob="2005-03-22",
        gender="Female",
        state="Telangana",
        district="Ranga Reddy",
        phone="+91 91234 56789",
        category="General",
        is_first_generation=False,
        achievements="National Science Olympiad Silver Medalist"
    )
    db.add(profile_sneha)
    db.flush()

    edu_sneha = EducationalRecord(
        student_id=profile_sneha.id,
        education_level="Undergraduate",
        course_name="B.Tech",
        branch="Computer Science & Engineering (Data Science)",
        institution_name="VNR Vignana Jyothi Institute of Engineering & Technology",
        university_name="Autonomous / JNTUH",
        institution_state="Telangana",
        academic_year=1,
        current_semester=1,
        admission_type="Convenor Quota",
        previous_qualification="Class 12th CBSE",
        previous_marks_percentage=91.4,
        current_cgpa=8.8
    )
    db.add(edu_sneha)

    fin_sneha = FinancialProfile(
        student_id=profile_sneha.id,
        annual_family_income=220000.0,
        annual_tuition_fee=135000.0,
        hostel_living_expenses=65000.0,
        transportation_expenses=20000.0,
        family_contribution=40000.0,
        bank_name="Canara Bank",
        bank_account_no="48291029381",
        bank_ifsc="CNRB0001234",
        is_aadhaar_seeded_npci=False  # Unseeded NPCI causes rejection!
    )
    db.add(fin_sneha)

    # Sneha's Rejected Application for Rejection Recovery Demo
    app_sneha = Application(
        student_id=profile_sneha.id,
        scholarship_id=epass.id if epass else 1,
        application_reference_no="TS-EPASS-2026-8102945",
        portal_name="Telangana ePASS",
        current_stage="Correction Requested",
        is_officially_verified=True,
        submission_date="2026-10-10",
        rejection_reason="Income Certificate Barcode Unreadable on MeeSeva verification portal & Bank Account not seeded with NPCI Aadhaar mapper.",
        correction_deadline="2026-11-20",
        notes_json=json.dumps(["Notice received from District Welfare Officer", "Barcode mismatch on scanned copy", "DBT payment returned: Inactive Aadhaar mapper"])
    )
    db.add(app_sneha)
    db.flush()

    evt_s1 = ApplicationEvent(
        application_id=app_sneha.id,
        event_title="Application Submitted",
        event_description="Online submission completed and hard copies deposited at nodal desk.",
        stage="Submitted",
        source="Student Reported"
    )
    evt_s2 = ApplicationEvent(
        application_id=app_sneha.id,
        event_title="Verification Notice / Correction Flagged",
        event_description="ePASS portal updated: 'Income certificate barcode invalid / expired. NPCI DBT mapping inactive.'",
        stage="Correction Requested",
        source="Official Portal Notice"
    )
    db.add_all([evt_s1, evt_s2])

    # Admin User
    admin_user = User(
        email="admin@scholarease.gov.in",
        hashed_password="admin_password_hash_2026",
        full_name="ScholarEase State Verification Admin",
        role="admin",
        is_active=True
    )
    db.add(admin_user)

    db.commit()
    print("Database successfully seeded with realistic scholarships, guideline versions, and demo students!")
