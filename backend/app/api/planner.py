from fastapi import APIRouter, Query
from app.schemas.schemas import BackwardPlanResponse, FundingGapRequest, FundingGapResponse
from app.services.planner_service import generate_backward_plan, calculate_funding_gap

router = APIRouter(prefix="/planner", tags=["Smart Deadline & Funding Gap Planner"])

@router.get("/backward-schedule", response_model=BackwardPlanResponse)
def get_backward_schedule(
    scholarship_title: str = Query("Telangana ePASS Post-Matric Scholarship", description="Name of scholarship"),
    deadline: str = Query("2026-11-30", description="YYYY-MM-DD")
):
    return generate_backward_plan(scholarship_title, deadline)

@router.post("/funding-gap", response_model=FundingGapResponse)
def compute_funding_gap(req: FundingGapRequest):
    return calculate_funding_gap(req)
