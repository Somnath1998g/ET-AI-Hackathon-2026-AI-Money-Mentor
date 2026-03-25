from typing import Dict, Any

from engines.scoring import calculate_all_scores, calculate_weighted_score
from engines.fire_math import calculate_fire_projection
from engines.recommendations import generate_recommendations


class PlannerAgent:
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

        return {
            "overall_score": overall_score,
            "dimension_scores": dimension_scores,
            "fire_projection": fire_projection,
            "top_recommendations": recommendations,
        }