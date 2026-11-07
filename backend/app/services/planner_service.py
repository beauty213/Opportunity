import datetime
from typing import List
from app.schemas.schemas import BackwardPlanResponse, DeadlineMilestone, FundingGapRequest, FundingGapResponse, AidStackLayer

def generate_backward_plan(scholarship_title: str, deadline_str: str) -> BackwardPlanResponse:
    try:
        final_date = datetime.datetime.strptime(deadline_str, "%Y-%m-%d").date()
    except Exception:
        final_date = datetime.date(2026, 11, 30)

    today = datetime.date(2026, 11, 7)
    days_to_deadline = (final_date - today).days

    milestones = [
        DeadlineMilestone(
            milestone_date=(final_date - datetime.timedelta(days=15)).strftime("%Y-%m-%d"),
            days_remaining=max(0, (final_date - datetime.timedelta(days=15) - today).days),
            title="Collect Revenue & MeeSeva Certificates",
            description="Ensure latest MeeSeva Income Certificate and C-Series Caste Certificate are issued and verifiable online.",
            category="Document Collection",
            is_completed=True
        ),
        DeadlineMilestone(
            milestone_date=(final_date - datetime.timedelta(days=10)).strftime("%Y-%m-%d"),
            days_remaining=max(0, (final_date - datetime.timedelta(days=10) - today).days),
            title="Obtain College Bonafide & Fee Structure",
            description="Request your college administrative desk to issue the Bonafide Certificate with the Principal's signature and seal.",
            category="Institutional Verification",
            is_completed=False
        ),
        DeadlineMilestone(
            milestone_date=(final_date - datetime.timedelta(days=6)).strftime("%Y-%m-%d"),
            days_remaining=max(0, (final_date - datetime.timedelta(days=6) - today).days),
            title="Verify NPCI Aadhaar Bank Seeding",
            description="Confirm via your bank or UIDAI portal that Direct Benefit Transfer (DBT) is active on your primary savings account.",
            category="Bank Readiness",
            is_completed=True
        ),
        DeadlineMilestone(
            milestone_date=(final_date - datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            days_remaining=max(0, (final_date - datetime.timedelta(days=3) - today).days),
            title="Complete Online Application & Cross-Check",
            description="Fill the online application on the official portal, upload high-resolution documents, and print the draft acknowledgment.",
            category="Application Submission",
            is_completed=False
        ),
        DeadlineMilestone(
            milestone_date=(final_date - datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            days_remaining=max(0, (final_date - datetime.timedelta(days=1) - today).days),
            title="Deposit Physical File at College Nodal Counter",
            description="Submit the signed application printout along with 2 self-attested photocopy sets and collect your deposit receipt.",
            category="Final Submission",
            is_completed=False
        )
    ]

    return BackwardPlanResponse(
        scholarship_title=scholarship_title,
        final_deadline=deadline_str,
        milestones=milestones,
        recommendation_summary=(
            f"There are {days_to_deadline} days remaining until the deadline on {deadline_str}. "
            f"Following this backward schedule guarantees you have all institutional stamps "
            f"and revenue certificates ready without last-minute server congestion."
        )
    )

def calculate_funding_gap(req: FundingGapRequest) -> FundingGapResponse:
    total_expenses = (
        req.annual_tuition_fee +
        req.hostel_living_expenses +
        req.transportation_expenses +
        req.academic_supplies
    )

    available_funding = req.family_contribution + req.existing_financial_aid
    net_gap = max(0.0, total_expenses - available_funding)

    # Multi-Tier Aid Stacking Recommendation
    aid_stack: List[AidStackLayer] = []

    # Layer 1: Tuition Fee Reimbursement (ePASS RTF)
    rtf_potential = min(req.annual_tuition_fee, 85000.0)
    aid_stack.append(AidStackLayer(
        layer_name="Telangana ePASS Tuition Fee Reimbursement (RTF)",
        type_tag="Fee Reimbursement (Govt)",
        estimated_amount=rtf_potential,
        eligibility_note="Covers 100% of convenor quota tuition fee for BC/SC/ST students with family income <= ₹2 Lakhs.",
        is_loan=False
    ))

    # Layer 2: Maintenance Allowance (ePASS MTF)
    mtf_potential = 20000.0  # ₹2,000/mo * 10 months
    aid_stack.append(AidStackLayer(
        layer_name="ePASS Maintenance Allowance (MTF - Hostel / Living)",
        type_tag="Maintenance Allowance (Govt)",
        estimated_amount=mtf_potential,
        eligibility_note="Direct allowance credited to student's bank account for boarding and mess charges.",
        is_loan=False
    ))

    # Layer 3: Merit CSR Scholarship
    csr_potential = 50000.0
    aid_stack.append(AidStackLayer(
        layer_name="Corporate CSR Merit-cum-Means Grant (Reliance / HDFC / Tata)",
        type_tag="Merit Scholarship (CSR)",
        estimated_amount=csr_potential,
        eligibility_note="Competitive grants based on diploma/12th marks (>80%) and socio-economic background.",
        is_loan=False
    ))

    # Calculate remaining gap after non-repayable aid
    total_grants = rtf_potential + mtf_potential + csr_potential
    remaining_after_grants = max(0.0, net_gap - (rtf_potential + mtf_potential))

    # Layer 4: Education Loan (Vidya Lakshmi) - Clearly distinguished
    if remaining_after_grants > 0:
        aid_stack.append(AidStackLayer(
            layer_name="Vidya Lakshmi Government Subsidized Education Loan",
            type_tag="Low-Interest Education Loan",
            estimated_amount=remaining_after_grants,
            eligibility_note="Central Scheme for Interest Subsidy (CSIS) during moratorium period for students with income <= ₹4.5 Lakhs.",
            is_loan=True,
            repayment_warning="IMPORTANT: This is a loan, NOT a scholarship. You must repay the principal amount plus interest starting 1 year after graduation or 6 months after getting a job."
        ))

    return FundingGapResponse(
        total_educational_expenses=total_expenses,
        existing_funding_available=available_funding,
        net_funding_gap=net_gap,
        aid_stack=aid_stack,
        advisory_notice=(
            "Prioritize grants, fee reimbursements, and scholarships first. "
            "Never consider education loans until all non-repayable government and CSR assistance avenues have been exhausted."
        )
    )
