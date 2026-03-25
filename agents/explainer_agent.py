from typing import Dict, Any, Optional

from services.llm_client import LLMClient


class ExplainerAgent:
    def __init__(self):
        self.llm = LLMClient()

    def score_band(self, score: int) -> str:
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        return "Poor"

    def explain_dimension(
        self,
        dimension: str,
        score: int,
        profile: Dict[str, Any],
        fire_projection: Dict[str, Any],
    ) -> str:
        if dimension == "emergency_preparedness":
            monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
            months = profile.get("liquid_savings", 0) / monthly_expenses
            return f"You currently have about {months:.1f} months of emergency savings. This score reflects how prepared you are for sudden expenses or income shocks."

        if dimension == "insurance_coverage":
            return "This score checks whether your health and term insurance are enough to protect your goals and dependents."

        if dimension == "investment_diversification":
            return "This score reflects how balanced your investments are across equity, debt, gold, and liquid savings."

        if dimension == "debt_health":
            monthly_income = max(profile.get("monthly_income", 0), 1)
            dti = profile.get("monthly_emi", 0) / monthly_income
            return f"Your debt score is influenced by your EMI-to-income ratio of about {dti:.2f} and any outstanding credit card balance."

        if dimension == "tax_efficiency":
            return "This score estimates whether you are using common tax-saving instruments efficiently."

        if dimension == "retirement_readiness":
            gap_ratio = fire_projection.get("gap_ratio", 0)
            return f"Your projected retirement corpus currently covers about {gap_ratio * 100:.1f}% of your estimated target corpus."

        return "This score reflects your current financial profile."

    def build_score_summary(
        self,
        dimension_scores: Dict[str, int],
        profile: Dict[str, Any],
        fire_projection: Dict[str, Any],
    ) -> Dict[str, Dict[str, str]]:
        summary = {}
        for dimension, score in dimension_scores.items():
            summary[dimension] = {
                "score_band": self.score_band(score),
                "explanation": self.explain_dimension(dimension, score, profile, fire_projection),
            }
        return summary

    def build_overall_summary(self, overall_score: int, top_recommendations: list) -> str:
        band = self.score_band(overall_score)
        rec_text = " ".join(top_recommendations[:2]) if top_recommendations else "Keep monitoring your financial plan regularly."
        return f"Your overall financial health is {band.lower()} with a score of {overall_score}. The most important next steps are: {rec_text}"

    def build_rule_based_mentor_summary(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        overall_score = planner_result["overall_score"]
        fire_gap = planner_result["fire_projection"]["gap"]
        recs = planner_result["top_recommendations"]

        summary_parts = [
            f"Your overall financial health is {self.score_band(overall_score).lower()} with a score of {overall_score}.",
        ]

        if fire_gap > 0:
            summary_parts.append(
                f"You still have a retirement gap of Rs. {fire_gap:,.0f}, so increasing your SIP and improving long-term discipline should be a priority."
            )

        if portfolio_result:
            flags = portfolio_result.get("risk_flags", [])
            if flags:
                summary_parts.append("Your portfolio also shows some issues: " + " ".join(flags[:2]))

        if recs:
            summary_parts.append("Top next steps: " + " ".join(recs[:3]))

        return " ".join(summary_parts)

    def build_llm_prompt(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        return f"""
You are an Indian personal finance mentor.
Use only the structured results below.
Do not make up facts.
Do not give unsafe investment promises.
Be practical, clear, and supportive.

Planner Result:
{planner_result}

Portfolio Result:
{portfolio_result}

Write:
1. A short mentor-style summary
2. Top 3 actions
3. What the user should do in the next 30 days
"""

    def generate_mentor_summary(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        if self.llm.is_available():
            prompt = self.build_llm_prompt(planner_result, portfolio_result)
            return self.llm.generate_text(prompt)

        return self.build_rule_based_mentor_summary(planner_result, portfolio_result)

    def compare_scenarios(
        self,
        base_projection: Dict[str, Any],
        new_projection: Dict[str, Any],
    ) -> str:
        base_gap = base_projection["gap"]
        new_gap = new_projection["gap"]
        gap_change = base_gap - new_gap

        base_sip = base_projection["recommended_monthly_sip"]
        new_sip = new_projection["recommended_monthly_sip"]

        if gap_change > 0:
            return (
                f"This scenario improves your retirement path by reducing the gap by Rs. {gap_change:,.0f}. "
                f"Suggested SIP changes from Rs. {base_sip:,.0f} to Rs. {new_sip:,.0f}."
            )

        return (
            f"This scenario does not materially improve the retirement outlook. "
            f"Suggested SIP changes from Rs. {base_sip:,.0f} to Rs. {new_sip:,.0f}."
        )