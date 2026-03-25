from typing import Dict, Any

from engines.scoring import calculate_all_scores, calculate_weighted_score
from engines.fire_math import calculate_fire_projection
from engines.recommendations import generate_recommendations
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

        return {
            "overall_score": overall_score,
            "dimension_scores": dimension_scores,
            "dimension_summary": dimension_summary,
            "overall_summary": overall_summary,
            "fire_projection": fire_projection,
            "top_recommendations": recommendations,
        }