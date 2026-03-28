from typing import Dict, Any


def future_value_lump_sum(present_value: float, annual_return: float, years: int) -> float:
    return present_value * ((1 + annual_return) ** years)


def future_value_sip(monthly_investment: float, annual_return: float, years: int) -> float:
    monthly_rate = annual_return / 12
    months = years * 12
    if monthly_rate == 0:
        return monthly_investment * months
    return monthly_investment * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)


def estimate_target_corpus(
    monthly_expenses: float,
    years_to_retirement: int,
    inflation_rate: float = 0.06,
    withdrawal_rate: float = 0.04,
) -> float:
    future_monthly_expense = monthly_expenses * ((1 + inflation_rate) ** years_to_retirement)
    annual_expense_at_retirement = future_monthly_expense * 12
    target_corpus = annual_expense_at_retirement / withdrawal_rate
    return target_corpus


def calculate_fire_projection(profile: Dict[str, Any]) -> Dict[str, float]:
    age = profile.get("age", 30)
    retirement_age_goal = profile.get("retirement_age_goal", 50)
    years_to_retirement = max(retirement_age_goal - age, 1)

    monthly_expenses = profile.get("monthly_expenses", 0)
    current_corpus = profile.get("current_investment_corpus", 0)
    monthly_sip = profile.get("monthly_sip", 0)

    expected_return = profile.get("expected_annual_return", 0.10)
    inflation_rate = profile.get("inflation_rate", 0.06)

    target_corpus = estimate_target_corpus(
        monthly_expenses=monthly_expenses,
        years_to_retirement=years_to_retirement,
        inflation_rate=inflation_rate,
    )

    projected_lump_sum = future_value_lump_sum(current_corpus, expected_return, years_to_retirement)
    projected_sip = future_value_sip(monthly_sip, expected_return, years_to_retirement)
    projected_corpus = projected_lump_sum + projected_sip

    gap = max(target_corpus - projected_corpus, 0)
    gap_ratio = projected_corpus / target_corpus if target_corpus > 0 else 0

    recommended_monthly_sip = monthly_sip
    if gap > 0:
        monthly_rate = expected_return / 12
        months = years_to_retirement * 12
        if monthly_rate > 0:
            additional_sip = gap / ((((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate))
            recommended_monthly_sip = monthly_sip + additional_sip

    return {
        "years_to_retirement": years_to_retirement,
        "target_corpus": round(target_corpus, 2),
        "projected_corpus": round(projected_corpus, 2),
        "gap": round(gap, 2),
        "gap_ratio": round(gap_ratio, 4),
        "recommended_monthly_sip": round(recommended_monthly_sip, 2),
    }