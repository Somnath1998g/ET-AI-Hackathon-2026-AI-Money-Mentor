from typing import List, Optional, Dict, Any, Literal
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import io

from agents.planner_agent import PlannerAgent
from agents.portfolio_agent import PortfolioAgent
from agents.explainer_agent import ExplainerAgent
from engines.fire_math import calculate_fire_projection


app = FastAPI(title="AI Money Mentor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

planner_agent = PlannerAgent()
portfolio_agent = PortfolioAgent()
explainer_agent = ExplainerAgent()


class ProfileInput(BaseModel):
    age: int = Field(..., gt=0, le=80)
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., ge=0)
    liquid_savings: float = Field(..., ge=0)
    current_investment_corpus: float = Field(..., ge=0)
    monthly_sip: float = Field(..., ge=0)
    monthly_emi: float = Field(..., ge=0)
    credit_card_outstanding: float = Field(..., ge=0)
    health_insurance_cover: float = Field(..., ge=0)
    term_insurance_cover: float = Field(..., ge=0)
    dependents: int = Field(..., ge=0)
    equity_investments: float = Field(..., ge=0)
    debt_investments: float = Field(..., ge=0)
    gold_investments: float = Field(..., ge=0)
    epf_annual: float = Field(..., ge=0)
    ppf_annual: float = Field(..., ge=0)
    elss_annual: float = Field(..., ge=0)
    nps_annual: float = Field(..., ge=0)
    retirement_age_goal: int = Field(..., ge=35, le=80)
    expected_annual_return: float = 0.10
    inflation_rate: float = 0.07
    risk_profile: Literal["conservative", "moderate", "aggressive"] = Field(
        default="moderate",
        description="Risk level of the user"
    )


class TransactionInput(BaseModel):
    date: str
    amount: float


class HoldingInput(BaseModel):
    scheme_name: str
    asset_class: str
    category: Optional[str] = None
    invested_amount: float = Field(..., ge=0)
    current_value: float = Field(..., ge=0)
    expense_ratio: float = Field(..., ge=0)
    transactions: List[TransactionInput]


class PortfolioRequest(BaseModel):
    holdings: List[HoldingInput]
    benchmark_return: float = 12.0
    risk_preference: Literal["conservative", "moderate", "aggressive"] = Field(
        default="moderate",
        description="Risk preference level of the user"
    )


class MentorSummaryRequest(BaseModel):
    profile: ProfileInput
    portfolio: Optional[PortfolioRequest] = None


class ScenarioRequest(BaseModel):
    profile: ProfileInput
    extra_sip: float = Field(0, ge=0)
    alternative_retirement_age: int = Field(..., ge=19, le=80)


@app.get("/")
def root():
    return {"message": "Running successfully"}


@app.post("/money-health-score")
def money_health_score(profile: ProfileInput):
    result = planner_agent.analyze_profile(profile.model_dump())
    return {
        "success": True,
        "message": "Money Health Score generated successfully",
        "data": {
            "overall_score": result["overall_score"],
            "dimension_scores": result["dimension_scores"],
            "dimension_summary": result["dimension_summary"],
            "overall_summary": result["overall_summary"],
            "top_recommendations": result["top_recommendations"],
            "retirement_snapshot": {
                "gap_ratio": result["fire_projection"]["gap_ratio"],
                "recommended_monthly_sip": result["fire_projection"]["recommended_monthly_sip"]
            }
        },
    }


@app.post("/fire-path-planner")
def fire_path_planner(profile: ProfileInput):
    result = planner_agent.analyze_profile(profile.model_dump())
    return {
        "success": True,
        "message": "FIRE plan generated successfully",
        "data": {
            "fire_projection": result["fire_projection"],
            "fire_plan": result["fire_plan"],
            "top_recommendations": result["top_recommendations"],
        },
    }


@app.post("/portfolio-xray")
def portfolio_xray(payload: PortfolioRequest):
    result = portfolio_agent.analyze_holdings(
        holdings=[h.model_dump() for h in payload.holdings],
        benchmark_return=payload.benchmark_return,
        risk_preference=payload.risk_preference,
    )
    return {
        "success": True,
        "message": "Portfolio X-Ray generated successfully",
        "data": result,
    }


@app.post("/portfolio-xray/upload")
async def portfolio_xray_upload(
    file: UploadFile = File(...),
    benchmark_return: float = Form(12.0),
    risk_preference: str = Form("Moderate"),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_bytes = await file.read()
    pdf_file = io.BytesIO(file_bytes)
    pdf_file.name = file.filename

    result = portfolio_agent.analyze_uploaded_pdf(
        uploaded_file=pdf_file,
        benchmark_return=benchmark_return,
        risk_preference=risk_preference,
    )
    return {
        "success": True,
        "message": "Portfolio X-Ray from PDF generated successfully",
        "data": result,
    }


@app.post("/ai-mentor-summary")
def ai_mentor_summary(payload: MentorSummaryRequest):
    planner_result = planner_agent.analyze_profile(payload.profile.model_dump())

    portfolio_result = None
    if payload.portfolio and payload.portfolio.holdings:
        portfolio_result = portfolio_agent.analyze_holdings(
            holdings=[h.model_dump() for h in payload.portfolio.holdings],
            benchmark_return=payload.portfolio.benchmark_return,
            risk_preference=payload.portfolio.risk_preference,
        )

    mentor_summary = explainer_agent.generate_mentor_summary(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )
    analysis = explainer_agent.extract_strengths_and_risks(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )
    action_plan = explainer_agent.build_personalized_action_plan(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )
    combined_scores = explainer_agent.build_combined_score_dashboard(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )
    before_after = explainer_agent.build_before_after_projection(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )
    roadmap = explainer_agent.build_roadmap()

    return {
        "success": True,
        "message": "AI Mentor Summary generated successfully",
        "data": {
            "mentor_summary": mentor_summary,
            "strengths_and_risks": analysis,
            "personalized_action_plan": action_plan,
            "combined_scores": combined_scores,
            "before_after_projection": before_after,
            "roadmap": roadmap,
        },
    }


@app.post("/scenario-analysis")
def scenario_analysis(payload: ScenarioRequest):
    profile = payload.profile.model_dump()
    base_projection = calculate_fire_projection(profile)

    scenario_profile = profile.copy()
    scenario_profile["monthly_sip"] = profile["monthly_sip"] + payload.extra_sip
    scenario_profile["retirement_age_goal"] = payload.alternative_retirement_age

    if scenario_profile["retirement_age_goal"] <= scenario_profile["age"]:
        raise HTTPException(status_code=400, detail="alternative_retirement_age must be greater than current age")

    new_projection = calculate_fire_projection(scenario_profile)
    scenario_text = explainer_agent.compare_scenarios(
        base_projection=base_projection,
        new_projection=new_projection,
    )

    return {
        "success": True,
        "message": "Scenario analysis generated successfully",
        "data": {
            "base_projection": base_projection,
            "scenario_projection": new_projection,
            "scenario_summary": scenario_text,
        },
    }


# Run using:
# uvicorn fastapi_backend_example:app --reload
