from typing import Dict, Any, List


def calculate_emergency_fund_target(profile: Dict[str, Any]) -> float:
    return round(profile.get("monthly_expenses", 0) * 6, 2)


def calculate_insurance_gap(profile: Dict[str, Any]) -> Dict[str, float]:
    annual_income = profile.get("monthly_income", 0) * 12
    dependents = profile.get("dependents", 0)

    recommended_health = 1000000 if dependents > 0 else 500000
    recommended_term = annual_income * 10 if dependents > 0 else annual_income * 5

    current_health = profile.get("health_insurance_cover", 0)
    current_term = profile.get("term_insurance_cover", 0)

    return {
        "recommended_health_cover": recommended_health,
        "current_health_cover": current_health,
        "health_gap": max(recommended_health - current_health, 0),
        "recommended_term_cover": recommended_term,
        "current_term_cover": current_term,
        "term_gap": max(recommended_term - current_term, 0),
    }


def generate_tax_suggestions(profile: Dict[str, Any]) -> List[str]:
    suggestions = []
    total_tax_saving = (
        profile.get("epf_annual", 0)
        + profile.get("ppf_annual", 0)
        + profile.get("elss_annual", 0)
        + profile.get("nps_annual", 0)
    )

    if total_tax_saving < 150000:
        suggestions.append("Increase 80C usage through EPF, PPF, or ELSS up to Rs. 1.5 lakh.")
    if profile.get("nps_annual", 0) < 50000:
        suggestions.append("Consider additional NPS contribution for extra tax benefit under 80CCD(1B).")
    if not suggestions:
        suggestions.append("Your current tax-saving usage looks reasonably efficient.")

    return suggestions


def generate_monthly_corpus_growth(profile: Dict[str, Any], months: int = 24) -> List[Dict[str, float]]:
    current_corpus = profile.get("current_investment_corpus", 0)
    monthly_sip = profile.get("monthly_sip", 0)
    monthly_return = profile.get("expected_annual_return", 0.10) / 12

    rows = []
    corpus = current_corpus

    for month in range(1, months + 1):
        corpus = corpus * (1 + monthly_return) + monthly_sip
        rows.append({"month": month, "corpus": round(corpus, 2)})

    return rows


def generate_sip_by_goal(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    monthly_sip = profile.get("monthly_sip", 0)

    return [
        {"goal": "Retirement", "sip": round(monthly_sip * 0.5, 2)},
        {"goal": "House", "sip": round(monthly_sip * 0.2, 2)},
        {"goal": "Child Education", "sip": round(monthly_sip * 0.2, 2)},
        {"goal": "Travel", "sip": round(monthly_sip * 0.1, 2)},
    ]


def generate_asset_allocation(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    age = profile.get("age", 30)
    risk_profile = profile.get("risk_profile", "moderate").lower()

    if risk_profile == "aggressive":
        equity = min(80, 100 - age // 2)
        debt = 15
        gold = 5
        cash = 0
    elif risk_profile == "conservative":
        equity = 40
        debt = 40
        gold = 10
        cash = 10
    else:
        equity = min(65, 100 - age)
        debt = 25
        gold = 5
        cash = 5

    total = equity + debt + gold + cash
    scale = 100 / total

    return [
        {"asset": "Equity", "value": round(equity * scale, 2)},
        {"asset": "Debt", "value": round(debt * scale, 2)},
        {"asset": "Gold", "value": round(gold * scale, 2)},
        {"asset": "Cash", "value": round(cash * scale, 2)},
    ]


def generate_allocation_shift(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    current_age = profile.get("age", 30)
    retirement_age = profile.get("retirement_age_goal", 50)

    rows = []
    for age in [current_age, min(current_age + 5, retirement_age), min(current_age + 10, retirement_age), retirement_age]:
        equity = max(20, 100 - age)
        debt = min(70, age - 20)
        gold = 5
        cash = 5
        total = equity + debt + gold + cash
        rows.append({
            "age": age,
            "Equity": round(equity * 100 / total, 2),
            "Debt": round(debt * 100 / total, 2),
            "Gold": round(gold * 100 / total, 2),
            "Cash": round(cash * 100 / total, 2),
        })
    return rows


def calculate_fire_progress(profile: Dict[str, Any], fire_projection: Dict[str, Any]) -> Dict[str, float]:
    target = fire_projection.get("target_corpus", 0)
    current = profile.get("current_investment_corpus", 0)
    progress_pct = (current / target * 100) if target > 0 else 0

    return {
        "current_corpus": current,
        "target_corpus": target,
        "progress_pct": round(min(progress_pct, 100), 2),
    }