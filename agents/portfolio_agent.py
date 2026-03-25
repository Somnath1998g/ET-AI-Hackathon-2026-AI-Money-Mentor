from typing import Dict, Any, List

from services.pdf_parser import extract_lines_from_pdf, parse_sample_portfolio
from engines.xirr import (
    calculate_portfolio_totals,
    calculate_weighted_expense_ratio,
    calculate_concentration,
    portfolio_risk_flags,
)


class PortfolioAgent:
    def analyze_uploaded_pdf(self, uploaded_file) -> Dict[str, Any]:
        lines = extract_lines_from_pdf(uploaded_file)
        holdings = parse_sample_portfolio(lines)
        return self.analyze_holdings(holdings)

    def analyze_holdings(self, holdings: List[Dict[str, Any]]) -> Dict[str, Any]:
        totals = calculate_portfolio_totals(holdings)
        weighted_expense_ratio = calculate_weighted_expense_ratio(holdings)
        concentration = calculate_concentration(holdings)
        flags = portfolio_risk_flags(holdings)

        recommendations = []
        if len(holdings) < 3:
            recommendations.append("Consider diversifying across more than one or two funds.")
        if concentration and concentration[0]["weight_pct"] > 50:
            recommendations.append("Reduce over-concentration in the top holding over time.")
        if weighted_expense_ratio > 1.5:
            recommendations.append("Review whether lower-cost alternatives are available.")
        if not recommendations:
            recommendations.append("Portfolio looks reasonably balanced at a high level. Review overlap and goals next.")

        return {
            "holdings": holdings,
            "totals": totals,
            "weighted_expense_ratio": weighted_expense_ratio,
            "concentration": concentration,
            "risk_flags": flags,
            "recommendations": recommendations,
        }