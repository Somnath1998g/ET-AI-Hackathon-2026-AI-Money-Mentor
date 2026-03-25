from typing import Dict, Any


class ExplainerAgent:
    def score_band(self, score: int) -> str:
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        return "Poor"

    def explain_dimension(self, dimension: str, score: int, profile: Dict[str, Any], fire_projection: Dict[str, Any]) -> str:
        if dimension == "emergency_preparedness":
            monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
            months = profile.get("liquid_savings", 0) / monthly_expenses
            return f"You currently have about {months:.1f} months of emergency savings. This score reflects how prepared you are for income shocks or sudden expenses."

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

    def build_score_summary(self, dimension_scores: Dict[str, int], profile: Dict[str, Any], fire_projection: Dict[str, Any]) -> Dict[str, Dict[str, str]]:
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