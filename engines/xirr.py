from typing import List, Dict, Any


def calculate_portfolio_totals(holdings: List[Dict[str, Any]]) -> Dict[str, float]:
    total_invested = sum(h["invested"] for h in holdings)
    total_current_value = sum(h["current_value"] for h in holdings)
    gain_loss = total_current_value - total_invested
    absolute_return_pct = (gain_loss / total_invested * 100) if total_invested > 0 else 0

    return {
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current_value, 2),
        "gain_loss": round(gain_loss, 2),
        "absolute_return_pct": round(absolute_return_pct, 2),
    }


def calculate_weighted_expense_ratio(holdings: List[Dict[str, Any]]) -> float:
    total_value = sum(h["current_value"] for h in holdings)
    if total_value <= 0:
        return 0.0

    weighted_expense = sum(
        (h["current_value"] / total_value) * h["expense_ratio"]
        for h in holdings
    )
    return round(weighted_expense, 2)


def calculate_concentration(holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    total_value = sum(h["current_value"] for h in holdings)
    if total_value <= 0:
        return []

    output = []
    for h in holdings:
        weight = (h["current_value"] / total_value) * 100
        output.append(
            {
                "fund_name": h["fund_name"],
                "weight_pct": round(weight, 2),
            }
        )
    return sorted(output, key=lambda x: x["weight_pct"], reverse=True)


def portfolio_risk_flags(holdings: List[Dict[str, Any]]) -> List[str]:
    flags = []
    concentration = calculate_concentration(holdings)

    if len(holdings) == 0:
        flags.append("No holdings detected.")
        return flags

    if len(holdings) < 3:
        flags.append("Portfolio has low diversification across funds.")

    if concentration and concentration[0]["weight_pct"] > 50:
        flags.append(f"More than 50% of portfolio is concentrated in {concentration[0]['fund_name']}.")

    expense_ratio = calculate_weighted_expense_ratio(holdings)
    if expense_ratio > 1.5:
        flags.append("Weighted expense ratio appears high and may drag long-term returns.")

    return flags