const API_BASE_URL = "http://127.0.0.1:8000";

export interface MoneyHealthPayload {
  age: number;
  monthly_income: number;
  monthly_expenses: number;
  liquid_savings: number;
  current_investment_corpus: number;
  monthly_sip: number;
  monthly_emi: number;
  credit_card_outstanding: number;
  health_insurance_cover: number;
  term_insurance_cover: number;
  dependents: number;
  equity_investments: number;
  debt_investments: number;
  gold_investments: number;
  epf_annual: number;
  ppf_annual: number;
  elss_annual: number;
  nps_annual: number;
  retirement_age_goal: number;
  expected_annual_return: number;
  inflation_rate: number;
  risk_profile: "conservative" | "moderate" | "aggressive";
}

export async function fetchMoneyHealthScore(payload: MoneyHealthPayload) {
  const response = await fetch(`${API_BASE_URL}/money-health-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.detail || "Failed to fetch Money Health Score");
  }

  return result;
}