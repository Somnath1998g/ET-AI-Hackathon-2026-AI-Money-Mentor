from typing import Dict, Any, List


def generate_recommendations(
    profile: Dict[str, Any],
    scores: Dict[str, int],
    fire_projection: Dict[str, Any],
) -> List[str]:
    recommendations = []

    monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
    liquid_savings = profile.get("liquid_savings", 0)
    emergency_months = liquid_savings / monthly_expenses

    if emergency_months < 3:
        recommendations.append("Build an emergency fund of at least 3 months of expenses.")
    if emergency_months < 6:
        recommendations.append("Set up an auto-transfer each month to grow your emergency corpus toward 6 months.")

    if scores["insurance_coverage"] < 50:
        recommendations.append("Review your health and term insurance coverage to protect your family and goals.")

    if scores["debt_health"] < 60:
        recommendations.append("Reduce high-cost debt and lower EMI burden before increasing risky investments.")

    if scores["tax_efficiency"] < 60:
        recommendations.append("Use tax-saving instruments like EPF, PPF, ELSS, or NPS more efficiently.")

    if scores["retirement_readiness"] < 60:
        recommendations.append(
            f"Increase your monthly SIP toward approximately Rs. {int(fire_projection['recommended_monthly_sip'])} for retirement readiness."
        )

    if scores["investment_diversification"] < 60:
        recommendations.append("Diversify beyond one asset category by balancing equity, debt, and emergency liquidity.")

    return recommendations[:5]