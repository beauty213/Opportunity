from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import StudentProfile, StudentDocument
from app.schemas.schemas import ZeroVisitReport, ZeroVisitChecklistItem

def generate_zero_visit_report(
    db: Session,
    student_id: int,
    process_type: str = "epass_college_verification"
) -> ZeroVisitReport:
    profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not profile:
        raise ValueError("Student profile not found")

    docs = db.query(StudentDocument).filter(StudentDocument.student_id == student_id).all()
    uploaded_doc_types = {d.document_type: d.id for d in docs}

    if process_type == "epass_college_verification":
        process_name = "Telangana ePASS Post-Matric Hard-Copy Verification (College Nodal Desk)"
        target_office = "College Scholarship Section / Nodal Officer Desk"
        office_address = f"{profile.educational_record.institution_name if profile.educational_record else 'College Campus'}, Administrative Block, Counter 3"
        visiting_hours = "10:30 AM to 03:30 PM (Monday to Saturday, except 2nd Saturday)"
        contact_helpline = "College Nodal Officer: 040-23456789 | ePASS State Helpline: 040-23390228"
        rules_summary = (
            "Under Telangana Social Welfare circular, college scholarship clerks will reject application files "
            "if original bonafide or Convenor allotment orders are missing, or if photocopies lack self-attestation. "
            "Complete this checklist before joining the queue."
        )

        raw_items = [
            {
                "id": "ITEM_BONAFIDE",
                "name": "College Study / Bonafide Certificate for Current Year",
                "category": "Original Document",
                "doc_type": "bonafide_cert",
                "mandatory": True,
                "qty": 1,
                "attestation": "Must carry Principal's original signature & blue ink college round seal.",
                "notes": "Must state admission under TS ECET / EAMCET Convenor Quota."
            },
            {
                "id": "ITEM_INCOME_ORIGINAL",
                "name": "MeeSeva Income Certificate (Original & Scanned Barcode Copy)",
                "category": "Original Document",
                "doc_type": "income_cert",
                "mandatory": True,
                "qty": 1,
                "attestation": "Original Tahsildar digitally signed MeeSeva printout. Do not submit black & white xerox without verifiable QR code.",
                "notes": "Must have been issued within the current financial year."
            },
            {
                "id": "ITEM_CASTE_ORIGINAL",
                "name": "MeeSeva Permanent Caste Certificate (C-Series)",
                "category": "Original Document",
                "doc_type": "caste_cert",
                "mandatory": True,
                "qty": 1,
                "attestation": "Digital signature from MeeSeva / Revenue Department.",
                "notes": "Verify that sub-caste matches application entry."
            },
            {
                "id": "ITEM_MARKS_MEMO",
                "name": "Qualifying Marks Memo (Diploma Consolidated or Inter Memo)",
                "category": "Photocopy Set",
                "doc_type": "marks_memo",
                "mandatory": True,
                "qty": 2,
                "attestation": "Self-attested signature with current date at bottom right of each sheet.",
                "notes": "Carry original memo for physical verification."
            },
            {
                "id": "ITEM_BANK_PASSBOOK",
                "name": "Bank Passbook First Page with IFSC & Account Number",
                "category": "Bank Verification",
                "doc_type": "bank_passbook",
                "mandatory": True,
                "qty": 2,
                "attestation": "Must show account holder's name clearly matching profile.",
                "notes": "Verify NPCI Aadhaar seeding receipt is attached."
            },
            {
                "id": "ITEM_ALLOTMENT_ORDER",
                "name": "TS ECET / EAMCET Convenor Admission Allotment Order",
                "category": "Original Document",
                "doc_type": "allotment_order",
                "mandatory": True,
                "qty": 2,
                "attestation": "Original Joining Report copy signed by College Admission In-charge.",
                "notes": "Crucial for Lateral Entry fee reimbursement confirmation."
            },
            {
                "id": "ITEM_EPASS_PRINTOUT",
                "name": "Online ePASS Registered Application Acknowledgment Form",
                "category": "Photocopy Set",
                "doc_type": "epass_printout",
                "mandatory": True,
                "qty": 2,
                "attestation": "Student signature and Parent / Guardian signature in designated boxes.",
                "notes": "Printed from ePASS portal after online final submission."
            }
        ]

        dos_and_donts = [
            "DO carry 2 passport size photographs matching your ePASS upload.",
            "DO arrange all documents in the exact sequence specified by the nodal desk.",
            "DO verify your bank account is active with at least one recent transaction.",
            "DO NOT submit laminated original certificates (clerks cannot stamp reverse side).",
            "DO NOT leave before obtaining the signed Physical File Deposit Acknowledgment Slip."
        ]

    else:
        # Bank NPCI Aadhaar Seeding Process
        process_name = "Bank Account Aadhaar Seeding & NPCI DBT Mapping"
        target_office = f"{profile.financial_profile.bank_name if profile.financial_profile else 'Bank'} Home Branch"
        office_address = "Branch Operations Counter / Customer Service Desk"
        visiting_hours = "10:00 AM to 02:00 PM (Working weekdays)"
        contact_helpline = "National Payment Corporation of India (NPCI) DBT: 1800-120-1740"
        rules_summary = (
            "Government scholarships are credited via Direct Benefit Transfer (DBT) into the bank account "
            "linked with the NPCI mapper. Simply opening a bank account is NOT enough; you must submit an NPCI mandate."
        )

        raw_items = [
            {
                "id": "ITEM_AADHAAR_ORIGINAL",
                "name": "Original Aadhaar Card with Registered Mobile Number",
                "category": "Original Document",
                "doc_type": "aadhaar_card",
                "mandatory": True,
                "qty": 1,
                "attestation": "Physical Aadhaar card or e-Aadhaar with valid digital signature.",
                "notes": "Must receive SMS OTP for biometric linkage."
            },
            {
                "id": "ITEM_BANK_PASSBOOK",
                "name": "Original Bank Passbook / Account Statement",
                "category": "Bank Verification",
                "doc_type": "bank_passbook",
                "mandatory": True,
                "qty": 1,
                "attestation": "Active savings account in student's individual name.",
                "notes": "Zero balance PMJDY or regular savings account."
            },
            {
                "id": "ITEM_NPCI_MANDATE",
                "name": "Aadhaar Seeding Consent Form (NPCI Annexure I)",
                "category": "Photocopy Set",
                "doc_type": "npci_form",
                "mandatory": True,
                "qty": 2,
                "attestation": "Duly filled and signed matching your bank signature specimen.",
                "notes": "Request branch staff to select 'Mandate for receiving DBT in this account'."
            }
        ]

        dos_and_donts = [
            "DO insist on collecting the branch seal stamped customer copy of the NPCI Mandate.",
            "DO verify linking status 48 hours later via UIDAI portal or *99*99*1# on registered mobile.",
            "DO NOT submit joint accounts where parent is primary holder (causes PFMS DBT bounce)."
        ]

    # Evaluate checklist against vault
    checklist: List[ZeroVisitChecklistItem] = []
    missing_mandatory = 0

    for item in raw_items:
        is_uploaded = item["doc_type"] in uploaded_doc_types
        vault_id = uploaded_doc_types.get(item["doc_type"])
        if item["mandatory"] and not is_uploaded:
            missing_mandatory += 1

        checklist.append(ZeroVisitChecklistItem(
            item_id=item["id"],
            document_name=item["name"],
            category=item["category"],
            is_mandatory=item["mandatory"],
            quantity_required=item["qty"],
            uploaded_in_vault=is_uploaded,
            vault_doc_id=vault_id,
            attestation_instructions=item["attestation"],
            special_notes=item["notes"]
        ))

    total_mandatory = sum(1 for i in checklist if i.is_mandatory)
    uploaded_mandatory = total_mandatory - missing_mandatory
    score = int((uploaded_mandatory / total_mandatory) * 100) if total_mandatory > 0 else 100

    if missing_mandatory == 0:
        readiness_status = "READY"
    else:
        readiness_status = "ACTION REQUIRED"

    return ZeroVisitReport(
        process_name=process_name,
        target_office=target_office,
        office_address=office_address,
        visiting_hours=visiting_hours,
        contact_helpline=contact_helpline,
        readiness_status=readiness_status,
        readiness_score=score,
        missing_mandatory_count=missing_mandatory,
        checklist=checklist,
        official_rules_summary=rules_summary,
        critical_dos_and_donts=dos_and_donts
    )
