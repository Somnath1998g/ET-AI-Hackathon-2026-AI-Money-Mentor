from datetime import datetime
from typing import List, Dict, Any
import math


def xnpv(rate: float, cashflows: List[tuple]) -> float:
    if rate <= -1:
        return float("inf")
    t0 = cashflows[0][0]
    return sum(cf / ((1 + rate) ** ((d - t0).days / 365.0)) for d, cf in cashflows)


def xirr(transactions: List[Dict[str, Any]], guess: float = 0.1) -> float:
    cashflows = []
    for txn in transactions:
        cashflows.append((datetime.strptime(txn["date"], "%Y-%m-%d"), txn["amount"]))

    if len(cashflows) < 2:
        return 0.0

    low, high = -0.9999, 10.0
    for _ in range(100):
        mid = (low + high) / 2
        val = xnpv(mid, cashflows)
        if abs(val) < 1e-6:
            return round(mid * 100, 2)
        if val > 0:
            low = mid
        else:
            high = mid

    return round(mid * 100, 2)


def calculate_portfolio_xirr(holdings: List[Dict[str, Any]]) -> float:
    all_transactions = []
    for h in holdings:
        for txn in h.get("transactions", []):
            all_transactions.append(txn)

    if not all_transactions:
        return 0.0

    all_transactions = sorted(all_transactions, key=lambda x: x["date"])
    return xirr(all_transactions)


def calculate_portfolio_totals(holdings: List[Dict[str, Any]]) -> Dict[str, float]:
    total_invested = sum(h.get("invested_amount", 0) for h in holdings)
    total_current_value = sum(h.get("current_value", 0) for h in holdings)
    gain_loss = total_current_value - total_invested
    absolute_return_pct = (gain_loss / total_invested * 100) if total_invested > 0 else 0

    return {
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current_value, 2),
        "gain_loss": round(gain_loss, 2),
        "absolute_return_pct": round(absolute_return_pct, 2),
    }


def calculate_weighted_expense_ratio(holdings: List[Dict[str, Any]]) -> float:
    total_value = sum(h.get("current_value", 0) for h in holdings)
    if total_value <= 0:
        return 0.0

    weighted = sum(
        (h.get("current_value", 0) / total_value) * h.get("expense_ratio", 0)
        for h in holdings
    )
    return round(weighted, 2)


def calculate_expense_drag(holdings: List[Dict[str, Any]]) -> float:
    total_value = sum(h.get("current_value", 0) for h in holdings)
    weighted_er = calculate_weighted_expense_ratio(holdings)
    return round(total_value * (weighted_er / 100), 2)


def calculate_concentration(holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    total_value = sum(h.get("current_value", 0) for h in holdings)
    if total_value <= 0:
        return []

    data = []
    for h in holdings:
        weight = (h.get("current_value", 0) / total_value) * 100
        data.append({
            "scheme_name": h.get("scheme_name", "Unknown"),
            "weight_pct": round(weight, 2)
        })

    return sorted(data, key=lambda x: x["weight_pct"], reverse=True)


def calculate_overlap(holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Hackathon-friendly placeholder overlap.
    Replace later with actual stock-level holdings overlap.
    """
    overlap_results = []
    for i in range(len(holdings)):
        for j in range(i + 1, len(holdings)):
            h1 = holdings[i]
            h2 = holdings[j]

            if h1.get("asset_class") == h2.get("asset_class") == "Equity":
                overlap_pct = 35.0
            else:
                overlap_pct = 10.0

            overlap_results.append({
                "fund_1": h1.get("scheme_name"),
                "fund_2": h2.get("scheme_name"),
                "overlap_pct": overlap_pct
            })

    return overlap_results


def compare_to_benchmark(portfolio_xirr: float, benchmark_return: float) -> Dict[str, Any]:
    alpha = round(portfolio_xirr - benchmark_return, 2)
    return {
        "portfolio_xirr": portfolio_xirr,
        "benchmark_return": benchmark_return,
        "alpha": alpha,
        "status": "Outperformed" if alpha > 0 else "Underperformed" if alpha < 0 else "Matched"
    }