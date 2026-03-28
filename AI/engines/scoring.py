from typing import Dict, Any


def clamp_score(value: float) -> int:
    return max(0, min(100, round(value)))


def calculate_emergency_score(profile: Dict[str, Any]) -> int:
    monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
    liquid_savings = profile.get("liquid_savings", 0)
    months = liquid_savings / monthly_expenses

    if months >= 6:
        return 100
    elif months >= 4:
        return 80
    elif months >= 2:
        return 55
    elif months >= 1:
        return 35
    return 15


def calculate_insurance_score(profile: Dict[str, Any]) -> int:
    health_cover = profile.get("health_insurance_cover", 0)
    term_cover = profile.get("term_insurance_cover", 0)
    dependents = profile.get("dependents", 0)
    annual_income = profile.get("monthly_income", 0) * 12

    score = 0

    if health_cover >= 1000000:
        score += 50
    elif health_cover >= 500000:
        score += 35
    elif health_cover > 0:
        score += 20

    if dependents > 0:
        if term_cover >= annual_income * 10:
            score += 50
        elif term_cover >= annual_income * 5:
            score += 30
        elif term_cover > 0:
            score += 15
    else:
        score += 40 if health_cover > 0 else 10

    return clamp_score(score)


def calculate_diversification_score(profile: Dict[str, Any]) -> int:
    equity = profile.get("equity_investments", 0)
    debt = profile.get("debt_investments", 0)
    gold = profile.get("gold_investments", 0)
    cash = profile.get("liquid_savings", 0)

    total = equity + debt + gold + cash
    if total <= 0:
        return 10

    categories = sum([
        1 if equity > 0 else 0,
        1 if debt > 0 else 0,
        1 if gold > 0 else 0,
        1 if cash > 0 else 0,
    ])

    if categories >= 4:
        return 90
    elif categories == 3:
        return 75
    elif categories == 2:
        return 55
    return 30


def calculate_debt_score(profile: Dict[str, Any]) -> int:
    monthly_income = max(profile.get("monthly_income", 0), 1)
    monthly_emi = profile.get("monthly_emi", 0)
    credit_card_outstanding = profile.get("credit_card_outstanding", 0)

    dti = monthly_emi / monthly_income
    score = 100

    if dti > 0.5:
        score -= 60
    elif dti > 0.35:
        score -= 40
    elif dti > 0.2:
        score -= 20

    if credit_card_outstanding > monthly_income:
        score -= 30
    elif credit_card_outstanding > 0:
        score -= 10

    return clamp_score(score)


def calculate_tax_score(profile: Dict[str, Any]) -> int:
    epf = profile.get("epf_annual", 0)
    ppf = profile.get("ppf_annual", 0)
    elss = profile.get("elss_annual", 0)
    nps = profile.get("nps_annual", 0)

    tax_saving_total = epf + ppf + elss + nps

    if tax_saving_total >= 200000:
        return 90
    elif tax_saving_total >= 150000:
        return 75
    elif tax_saving_total >= 75000:
        return 55
    elif tax_saving_total > 0:
        return 35
    return 15


def calculate_retirement_score(profile: Dict[str, Any], retirement_gap_ratio: float) -> int:
    """
    retirement_gap_ratio = projected_corpus / target_corpus
    """
    if retirement_gap_ratio >= 1.0:
        return 95
    elif retirement_gap_ratio >= 0.75:
        return 75
    elif retirement_gap_ratio >= 0.5:
        return 55
    elif retirement_gap_ratio >= 0.25:
        return 35
    return 15


def calculate_weighted_score(dimension_scores: Dict[str, int]) -> int:
    weights = {
        "emergency_preparedness": 20,
        "insurance_coverage": 15,
        "investment_diversification": 15,
        "debt_health": 15,
        "tax_efficiency": 15,
        "retirement_readiness": 20,
    }

    weighted_total = 0
    for key, weight in weights.items():
        weighted_total += dimension_scores[key] * weight / 100

    return clamp_score(weighted_total)


def calculate_all_scores(profile: Dict[str, Any], retirement_gap_ratio: float) -> Dict[str, int]:
    scores = {
        "emergency_preparedness": calculate_emergency_score(profile),
        "insurance_coverage": calculate_insurance_score(profile),
        "investment_diversification": calculate_diversification_score(profile),
        "debt_health": calculate_debt_score(profile),
        "tax_efficiency": calculate_tax_score(profile),
        "retirement_readiness": calculate_retirement_score(profile, retirement_gap_ratio),
    }
    return scores