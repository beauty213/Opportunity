import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_and_root():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    root_res = client.get("/")
    assert root_res.status_code == 200
    assert "ScholarEase" in root_res.json()["message"]

def test_demo_users_and_identity():
    res = client.get("/api/auth/demo-users")
    assert res.status_code == 200
    users = res.json()
    assert len(users) >= 2
    emails = [u["email"] for u in users]
    assert "rahul.korra@example.com" in emails

    # Test Student Financial Identity
    id_res = client.get("/api/student/identity?user_id=1")
    assert id_res.status_code == 200
    identity = id_res.json()
    assert identity["full_name"] == "Rahul Korra"
    assert identity["state"] == "Telangana"
    assert identity["educational_record"]["course_name"] == "B.Tech"
    assert identity["educational_record"]["admission_type"] == "Lateral Entry"
    assert identity["financial_profile"]["annual_family_income"] == 175000.0
    assert "SE-ID-" in identity["verified_identity_hash"]
    assert identity["profile_completion_percentage"] >= 90

def test_scholarships_listing_and_match():
    res = client.get("/api/scholarships?user_id=1")
    assert res.status_code == 200
    scholarships = res.json()
    assert len(scholarships) >= 5

    # Rahul should match Telangana ePASS with 100% score
    epass = next((s for s in scholarships if "telangana-epass" in s["slug"]), None)
    assert epass is not None
    assert epass["match_score"] == 100
    assert epass["match_status"] == "Eligible"

def test_eligibility_engine_and_simulator():
    # Assess Telangana ePASS for Rahul
    res = client.get("/api/eligibility/assess/1?user_id=1")
    assert res.status_code == 200
    assessment = res.json()
    assert assessment["status"] == "Eligible"
    assert len(assessment["rule_checks"]) >= 4

    # Run simulator with income exceeding ceiling (e.g., 2,50,000 > 2,00,000)
    sim_res = client.post("/api/eligibility/simulate?user_id=1", json={
        "scholarship_id": 1,
        "annual_family_income": 250000.0
    })
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert sim_data["simulated_status"] == "Not Eligible"

def test_cross_document_consistency_audit():
    res = client.get("/api/documents/consistency-audit?user_id=1")
    assert res.status_code == 200
    audit = res.json()
    assert audit["match_percentage"] >= 80
    assert len(audit["discrepancies"]) >= 3
    # Check Candidate Name check
    name_check = next((d for d in audit["discrepancies"] if "Candidate Full Name" in d["field_name"]), None)
    assert name_check is not None
    assert name_check["severity"] == "MATCH"

def test_zero_visit_assistant():
    res = client.get("/api/zero-visit/report?process_type=epass_college_verification&user_id=1")
    assert res.status_code == 200
    report = res.json()
    assert "ePASS" in report["process_name"]
    assert len(report["checklist"]) >= 5
    assert report["readiness_score"] >= 50
    assert report["readiness_status"] == "ACTION REQUIRED"
    assert len(report["critical_dos_and_donts"]) >= 3

def test_ai_copilot_rag():
    # English query about lateral entry
    res = client.post("/api/copilot/query?user_id=1", json={
        "query": "Can lateral entry diploma students get fee reimbursement in B.Tech?",
        "language": "en",
        "include_student_context": True
    })
    assert res.status_code == 200
    ans = res.json()
    assert "TS ECET" in ans["answer"] or "Lateral Entry" in ans["answer"]
    assert len(ans["citations"]) >= 1

    # Telugu query
    te_res = client.post("/api/copilot/query?user_id=1", json={
        "query": "లాటరల్ ఎంట్రీ విద్యార్థులకు ఫీజు రీయింబర్స్‌మెంట్ వర్తిస్తుందా?",
        "language": "te",
        "include_student_context": True
    })
    assert te_res.status_code == 200
    te_ans = te_res.json()
    assert "ePASS" in te_ans["answer"] or "అవును" in te_ans["answer"]

def test_application_problem_solver():
    res = client.post("/api/applications/problem-solver", json={
        "error_message": "Income Certificate Barcode Unreadable on MeeSeva online verification portal",
        "portal_name": "Telangana ePASS"
    })
    assert res.status_code == 200
    sol = res.json()
    assert "MeeSeva" in sol["diagnosed_issue"]
    assert len(sol["remedial_steps"]) >= 3
    assert sol["can_appeal_or_correct"] is True

def test_planner_and_funding_gap():
    # Backward planner
    plan_res = client.get("/api/planner/backward-schedule?scholarship_title=Telangana+ePASS&deadline=2026-11-30")
    assert plan_res.status_code == 200
    plan = plan_res.json()
    assert len(plan["milestones"]) >= 5

    # Funding gap calculation
    gap_res = client.post("/api/planner/funding-gap", json={
        "annual_tuition_fee": 85000.0,
        "hostel_living_expenses": 50000.0,
        "transportation_expenses": 15000.0,
        "academic_supplies": 10000.0,
        "family_contribution": 25000.0,
        "existing_financial_aid": 0.0
    })
    assert gap_res.status_code == 200
    gap = gap_res.json()
    assert gap["total_educational_expenses"] == 160000.0
    assert gap["net_funding_gap"] == 135000.0
    assert len(gap["aid_stack"]) >= 3
    # Check loan is marked with repayment warning
    loan_layer = next((l for l in gap["aid_stack"] if l["is_loan"]), None)
    if loan_layer:
        assert loan_layer["repayment_warning"] is not None
