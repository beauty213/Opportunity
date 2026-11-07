import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Application, ApplicationEvent, StudentProfile
from app.schemas.schemas import ProblemSolverResponse

STAGE_SEQUENCE = [
    "Discovered", "Shortlisted", "Eligibility Checked", "Documents Prepared",
    "Ready to Apply", "Submitted", "Under Verification", "Correction Requested",
    "Approved", "Rejected", "Payment Pending", "Disbursed", "Renewal Due"
]

ERROR_KNOWLEDGE_BASE = [
    {
        "patterns": ["income", "barcode", "meeseva", "invalid income", "income unreadable"],
        "diagnosed_issue": "MeeSeva Income Certificate Barcode Verification Failure",
        "severity": "Action Required",
        "root_cause": "The digital barcode on your scanned Income Certificate could not be verified automatically by the ePASS-MeeSeva API bridge. This commonly happens if the certificate is older than 1 year or if the scan is blurry.",
        "rule_ref": "Telangana Social Welfare G.O. Ms. No. 66, Rule 9 (Annual Verification of Income)",
        "remedial_steps": [
            "Visit your local MeeSeva center or MeeSeva 2.0 online portal to verify if your certificate is active.",
            "If expired (older than 1 year), apply for an instant MeeSeva Income Certificate renewal.",
            "Upload a crisp, 200 DPI color PDF scan where the QR code and digital signature barcode are sharp.",
            "Take the updated certificate to your college scholarship clerk to trigger a re-push to the welfare officer."
        ],
        "grievance_url": "https://telanganaepass.cgg.gov.in/Grievance.do",
        "escalation_contacts": [
            {"role": "College Scholarship Nodal Officer", "contact": "administrative.office@college.edu"},
            {"role": "District Welfare Officer (DWO)", "contact": "dwo.hyd.welfare@telangana.gov.in"},
            {"role": "ePASS State Helpdesk", "contact": "040-23390228"}
        ],
        "can_appeal": True,
        "deadline_days": 15
    },
    {
        "patterns": ["npci", "bank", "pfms", "dbt", "seeding", "not mapped", "inactive account"],
        "diagnosed_issue": "Bank Account Not Mapped to NPCI Aadhaar DBT Bridge",
        "severity": "Grievance Required",
        "root_cause": "Although your bank account is active for regular transactions and UPI, the bank has not uploaded your Aadhaar number to the National Payments Corporation of India (NPCI) Central DBT Mapper. As a result, the government treasury system cannot disburse funds.",
        "rule_ref": "Ministry of Finance & DBT Mission Mandate 2024 / PFMS Public Financial Management System Rule 8",
        "remedial_steps": [
            "Download the official NPCI Aadhaar Seeding Mandate Form (Annexure I).",
            "Visit your home bank branch in person and submit the form along with a photocopy of your Aadhaar card and passbook.",
            "Specifically request the branch officer: 'Please link my account with the NPCI mapper for DBT payments, not just core banking.'",
            "Ask for the stamped customer acknowledgment slip.",
            "Verify mapping status after 48 hours on the UIDAI Bank Linking status portal or via dialing *99*99*1#.",
            "Once active, notify your college scholarship clerk to update the bank verification flag on ePASS."
        ],
        "grievance_url": "https://dbtbharat.gov.in/",
        "escalation_contacts": [
            {"role": "Branch Manager, Home Bank Branch", "contact": "Visit home branch counter"},
            {"role": "Lead District Bank Manager (LDM)", "contact": "ldm.district@banking.in"},
            {"role": "NPCI DBT Consumer Grievances", "contact": "1800-120-1740"}
        ],
        "can_appeal": True,
        "deadline_days": 21
    },
    {
        "patterns": ["bonafide", "principal", "stamp", "attendance", "biometric"],
        "diagnosed_issue": "Institutional Bonafide or Biometric Attendance Deficiency",
        "severity": "Action Required",
        "root_cause": "The college nodal desk reported either that your biometric attendance for the current semester is below 75% or that the uploaded Bonafide certificate lacks the mandatory round college seal or TS ECET convenor quota details.",
        "rule_ref": "Telangana State Council of Higher Education (TSCHE) Biometric Attendance Norms",
        "remedial_steps": [
            "Meet your Department Head to inspect your biometric attendance log.",
            "If attendance was lost due to medical reasons, submit a registered medical certificate to the Principal's office for condonation.",
            "Collect a fresh Bonafide certificate explicitly stating: 'Admitted under TS ECET Lateral Entry Convenor Quota'.",
            "Ensure the certificate carries the Principal's signature in blue ink and the college circular rubber stamp.",
            "Have the college scholarship clerk re-upload and certify the document in the institutional portal."
        ],
        "grievance_url": "https://telanganaepass.cgg.gov.in/",
        "escalation_contacts": [
            {"role": "Head of Department (ECE / College)", "contact": "hod@college.edu"},
            {"role": "Principal / Dean Academic Affairs", "contact": "principal@college.edu"}
        ],
        "can_appeal": True,
        "deadline_days": 10
    }
]

def solve_application_problem(
    db: Session,
    error_message: str,
    application_id: Optional[int] = None,
    portal_name: str = "Telangana ePASS"
) -> ProblemSolverResponse:
    err_lower = error_message.lower()

    matched_problem = None
    for entry in ERROR_KNOWLEDGE_BASE:
        if any(p in err_lower for p in entry["patterns"]):
            matched_problem = entry
            break

    if not matched_problem:
        # Generic intelligent diagnosis
        return ProblemSolverResponse(
            diagnosed_issue="Administrative Verification Hold / Document Discrepancy",
            severity="Action Required",
            root_cause=f"The portal returned notice '{error_message}'. This indicates that the reviewing nodal officer found discrepancies between your submitted documents and college or revenue department records.",
            official_rule_reference=f"{portal_name} Standard Verification Guidelines 2026",
            remedial_steps=[
                "Review your uploaded documents in the ScholarEase Document Vault.",
                "Verify that your personal details (Name, DOB, Parent Name) match your SSC Hall Ticket exactly.",
                "Visit your College Scholarship Nodal Officer with original certificates for manual verification.",
                "Submit a formal clarification request before the correction window expires."
            ],
            grievance_portal_url="https://telanganaepass.cgg.gov.in/Grievance.do",
            escalation_contacts=[
                {"role": "College Scholarship Clerk", "contact": "Administrative Office"},
                {"role": "District Welfare Helpdesk", "contact": "040-23390228"}
            ],
            can_appeal_or_correct=True,
            recommended_deadline_days=14
        )

    return ProblemSolverResponse(
        diagnosed_issue=matched_problem["diagnosed_issue"],
        severity=matched_problem["severity"],
        root_cause_explanation=matched_problem["root_cause"],
        official_rule_reference=matched_problem["rule_ref"],
        remedial_steps=matched_problem["remedial_steps"],
        grievance_portal_url=matched_problem["grievance_url"],
        escalation_contacts=matched_problem["escalation_contacts"],
        can_appeal_or_correct=matched_problem["can_appeal"],
        recommended_deadline_days=matched_problem["deadline_days"]
    )
