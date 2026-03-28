from typing import Dict, Any

from engines.scoring import calculate_all_scores, calculate_weighted_score
from engines.fire_math import calculate_fire_projection
from engines.recommendations import generate_recommendations
from engines.fire_planner import (
    calculate_emergency_fund_target,
    calculate_insurance_gap,
    generate_tax_suggestions,
    generate_monthly_corpus_growth,
    generate_sip_by_goal,
    generate_asset_allocation,
    generate_allocation_shift,
    calculate_fire_progress,
)
from agents.explainer_agent import ExplainerAgent


class PlannerAgent:
    def __init__(self):
        self.explainer = ExplainerAgent()

    def analyze_profile(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        fire_projection = calculate_fire_projection(profile)

        dimension_scores = calculate_all_scores(
            profile=profile,
            retirement_gap_ratio=fire_projection["gap_ratio"],
        )

        overall_score = calculate_weighted_score(dimension_scores)

        recommendations = generate_recommendations(
            profile=profile,
            scores=dimension_scores,
            fire_projection=fire_projection,
        )

        dimension_summary = self.explainer.build_score_summary(
            dimension_scores=dimension_scores,
            profile=profile,
            fire_projection=fire_projection,
        )

        overall_summary = self.explainer.build_overall_summary(
            overall_score=overall_score,
            top_recommendations=recommendations,
        )

        fire_plan = {
            "emergency_fund_target": calculate_emergency_fund_target(profile),
            "insurance_gap": calculate_insurance_gap(profile),
            "tax_suggestions": generate_tax_suggestions(profile),
            "monthly_corpus_growth": generate_monthly_corpus_growth(profile, months=24),
            "sip_by_goal": generate_sip_by_goal(profile),
            "asset_allocation": generate_asset_allocation(profile),
            "allocation_shift": generate_allocation_shift(profile),
            "fire_progress": calculate_fire_progress(profile, fire_projection),
        }

        return {
            "overall_score": overall_score,
            "dimension_scores": dimension_scores,
            "dimension_summary": dimension_summary,
            "overall_summary": overall_summary,
            "fire_projection": fire_projection,
            "fire_plan": fire_plan,
            "top_recommendations": recommendations,
        }