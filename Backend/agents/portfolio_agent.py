from typing import Dict, Any, List
from datetime import date
from services.pdf_parser import extract_lines_from_pdf, parse_sample_portfolio
from engines.xirr import (
    calculate_portfolio_xirr,
    calculate_portfolio_totals,
    calculate_weighted_expense_ratio,
    calculate_expense_drag,
    calculate_concentration,
    calculate_overlap,
    compare_to_benchmark,
)
from agents.explainer_agent import ExplainerAgent


class PortfolioAgent:
    def __init__(self):
        self.explainer = ExplainerAgent()

    def analyze_uploaded_pdf(
        self,
        uploaded_file,
        benchmark_return: float = 12.0,
        risk_preference: str = "moderate",
    ) -> Dict[str, Any]:
        lines = extract_lines_from_pdf(uploaded_file)
        holdings = parse_sample_portfolio(lines)
        return self.analyze_holdings(
            holdings=holdings,
            benchmark_return=benchmark_return,
            risk_preference=risk_preference,
        )
    
    def normalize_holdings(self, holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        today = str(date.today())
        normalized = []

        for h in holdings:
            item = dict(h)

            transactions = item.get("transactions")
            if not transactions:
                invested_amount = item.get("invested_amount", 0)
                current_value = item.get("current_value", 0)
                transactions = [
                    {"date": "2024-01-01", "amount": -invested_amount},
                    {"date": today, "amount": current_value},
                ]

            item["transactions"] = transactions
            normalized.append(item)

        return normalized

    def analyze_holdings(
        self,
        holdings: List[Dict[str, Any]],
        benchmark_return: float = 12.0,
        risk_preference: str = "moderate",
    ) -> Dict[str, Any]:
        holdings = self.normalize_holdings(holdings)
        if not holdings:
            return {
                "holdings": [],
                "totals": {
                    "total_invested": 0.0,
                    "total_current_value": 0.0,
                    "gain_loss": 0.0,
                    "absolute_return_pct": 0.0,
                },
                "portfolio_xirr": 0.0,
                "weighted_expense_ratio": 0.0,
                "expense_drag": 0.0,
                "concentration": [],
                "overlap": [],
                "benchmark_comparison": {
                    "portfolio_xirr": 0.0,
                    "benchmark_return": benchmark_return,
                    "alpha": round(0.0 - benchmark_return, 2),
                    "status": "No Data",
                },
                "risk_flags": ["No holdings could be parsed from the uploaded PDF. Check the parser format."],
                "ai_rebalancing_plan": "No portfolio analysis could be generated because the uploaded PDF was not parsed into valid holdings.",
                "category_allocation": [],
                "expense_drag_by_fund": [],
                "portfolio_vs_benchmark": [],
            }

        totals = calculate_portfolio_totals(holdings)
        portfolio_xirr = calculate_portfolio_xirr(holdings)
        weighted_expense_ratio = calculate_weighted_expense_ratio(holdings)
        expense_drag = calculate_expense_drag(holdings)
        concentration = calculate_concentration(holdings)
        overlap = calculate_overlap(holdings)
        benchmark = compare_to_benchmark(portfolio_xirr, benchmark_return)

        category_allocation = self.build_category_allocation(holdings)
        expense_drag_by_fund = self.build_expense_drag_by_fund(holdings)
        portfolio_vs_benchmark = self.build_portfolio_vs_benchmark_series(
            holdings=holdings,
            benchmark_return=benchmark_return,
        )

        risk_flags = []

        if len(holdings) < 3:
            risk_flags.append("Portfolio has low diversification across schemes.")

        if concentration and concentration[0]["weight_pct"] > 50:
            risk_flags.append(
                f"More than 50% of portfolio is concentrated in {concentration[0]['scheme_name']}."
            )

        if weighted_expense_ratio > 1.5:
            risk_flags.append("Weighted expense ratio is high and may reduce long-term returns.")

        if benchmark["alpha"] < 0:
            risk_flags.append("Portfolio is underperforming the selected benchmark.")

        rebalancing_prompt_input = {
            "risk_preference": risk_preference,
            "totals": totals,
            "portfolio_xirr": portfolio_xirr,
            "weighted_expense_ratio": weighted_expense_ratio,
            "expense_drag": expense_drag,
            "concentration": concentration[:3],
            "overlap": overlap[:5],
            "benchmark": benchmark,
            "risk_flags": risk_flags,
        }

        ai_rebalancing_plan = self.explainer.generate_portfolio_rebalancing_plan(
            rebalancing_prompt_input
        )

        return {
            "holdings": holdings,
            "totals": totals,
            "portfolio_xirr": portfolio_xirr,
            "weighted_expense_ratio": weighted_expense_ratio,
            "expense_drag": expense_drag,
            "concentration": concentration,
            "overlap": overlap,
            "benchmark_comparison": benchmark,
            "risk_flags": risk_flags,
            "ai_rebalancing_plan": ai_rebalancing_plan,
            "category_allocation": category_allocation,
            "expense_drag_by_fund": expense_drag_by_fund,
            "portfolio_vs_benchmark": portfolio_vs_benchmark,
        }

    def build_category_allocation(self, holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        category_map = {}

        for h in holdings:
            category = h.get("category", h.get("asset_class", "Other"))
            current_value = h.get("current_value", 0)
            category_map[category] = category_map.get(category, 0) + current_value

        return [
            {"category": category, "value": round(value, 2)}
            for category, value in category_map.items()
        ]

    def build_expense_drag_by_fund(self, holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        rows = []

        for h in holdings:
            current_value = h.get("current_value", 0)
            expense_ratio = h.get("expense_ratio", 0)
            drag = current_value * (expense_ratio / 100)

            rows.append(
                {
                    "scheme_name": h.get("scheme_name", "Unknown Fund"),
                    "expense_drag": round(drag, 2),
                }
            )

        return rows

    def build_portfolio_vs_benchmark_series(
        self,
        holdings: List[Dict[str, Any]],
        benchmark_return: float,
    ) -> List[Dict[str, Any]]:
        total_invested = sum(h.get("invested_amount", 0) for h in holdings)
        total_current = sum(h.get("current_value", 0) for h in holdings)

        benchmark_current = total_invested * (1 + benchmark_return / 100)

        return [
            {
                "period": "Start",
                "portfolio_value": round(total_invested, 2),
                "benchmark_value": round(total_invested, 2),
            },
            {
                "period": "Current",
                "portfolio_value": round(total_current, 2),
                "benchmark_value": round(benchmark_current, 2),
            },
        ]