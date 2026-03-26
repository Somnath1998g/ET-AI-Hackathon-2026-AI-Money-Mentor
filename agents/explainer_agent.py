from typing import Dict, Any, Optional, List

from services.llm_client import LLMClient


class ExplainerAgent:
    def __init__(self):
        self.llm = LLMClient()

    def score_band(self, score: int) -> str:
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        return "Poor"

    def explain_dimension(
        self,
        dimension: str,
        score: int,
        profile: Dict[str, Any],
        fire_projection: Dict[str, Any],
    ) -> str:
        if dimension == "emergency_preparedness":
            monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
            months = profile.get("liquid_savings", 0) / monthly_expenses
            return f"You currently have about {months:.1f} months of emergency savings. This score reflects how prepared you are for sudden expenses or income shocks."

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
    def generate_portfolio_rebalancing_plan(self, portfolio_result: Dict[str, Any]) -> str:
        prompt = f"""
        You are a mutual fund portfolio mentor for an Indian investor.

        Use only this data:
        {portfolio_result}

        Write:
        1. A short portfolio diagnosis
        2. Key issues in allocation / concentration / cost / underperformance
        3. A practical rebalancing plan aligned to the user's risk preference
        4. Keep the tone simple and actionable
        """

        if self.llm.is_available():
            return self.llm.generate_text(prompt)

        flags = portfolio_result.get("risk_flags", [])
        benchmark = portfolio_result.get("benchmark", {})
        risk = portfolio_result.get("risk_preference", "Moderate")

        text = f"Risk preference: {risk}. "
        if flags:
            text += "Key portfolio issues: " + " ".join(flags[:3]) + " "
        if benchmark:
            text += f"Benchmark status: {benchmark.get('status', 'Unknown')} with alpha of {benchmark.get('alpha', 0)}%. "
        text += "Suggested action: reduce over-concentration, review expensive funds, and align equity-debt allocation to your risk profile."
        return text

    def build_score_summary(
        self,
        dimension_scores: Dict[str, int],
        profile: Dict[str, Any],
        fire_projection: Dict[str, Any],
    ) -> Dict[str, Dict[str, str]]:
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

    def build_rule_based_mentor_summary(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        overall_score = planner_result["overall_score"]
        fire_gap = planner_result["fire_projection"]["gap"]
        recs = planner_result["top_recommendations"]

        summary_parts = [
            f"Your overall financial health is {self.score_band(overall_score).lower()} with a score of {overall_score}.",
        ]

        if fire_gap > 0:
            summary_parts.append(
                f"You still have a retirement gap of Rs. {fire_gap:,.0f}, so increasing your SIP and improving long-term discipline should be a priority."
            )

        if portfolio_result:
            flags = portfolio_result.get("risk_flags", [])
            if flags:
                summary_parts.append("Your portfolio also shows some issues: " + " ".join(flags[:2]))

        if recs:
            summary_parts.append("Top next steps: " + " ".join(recs[:3]))

        return " ".join(summary_parts)

    def extract_strengths_and_risks(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        strengths = []
        risks = []
        priorities = []

        ds = planner_result["dimension_scores"]

        if ds["emergency_preparedness"] >= 70:
            strengths.append("Healthy emergency preparedness.")
        else:
            risks.append("Emergency fund is below ideal safety level.")
            priorities.append(("Build emergency fund", 95))

        if ds["insurance_coverage"] >= 70:
            strengths.append("Insurance coverage is reasonably aligned.")
        else:
            risks.append("Insurance coverage gap may expose long-term goals.")
            priorities.append(("Improve insurance", 85))

        if ds["debt_health"] >= 70:
            strengths.append("Debt burden is under reasonable control.")
        else:
            risks.append("Debt burden or credit rollover is hurting financial health.")
            priorities.append(("Reduce debt / EMI pressure", 90))

        if ds["tax_efficiency"] >= 70:
            strengths.append("Tax-saving usage is reasonably efficient.")
        else:
            risks.append("Tax-saving opportunities are underutilized.")
            priorities.append(("Improve tax-saving allocation", 65))

        if ds["retirement_readiness"] >= 70:
            strengths.append("Retirement planning is on a relatively strong track.")
        else:
            risks.append("Retirement corpus is below target trajectory.")
            priorities.append(("Increase SIP for retirement", 92))

        if ds["investment_diversification"] >= 70:
            strengths.append("Investment mix is reasonably diversified.")
        else:
            risks.append("Investment diversification is weak or concentrated.")
            priorities.append(("Improve diversification", 70))

        if portfolio_result:
            for flag in portfolio_result.get("risk_flags", []):
                risks.append(flag)

            concentration = portfolio_result.get("concentration", [])
            if concentration and concentration[0]["weight_pct"] > 50:
                priorities.append(("Reduce portfolio concentration", 88))

            benchmark = portfolio_result.get("benchmark_comparison", {})
            if benchmark and benchmark.get("alpha", 0) < 0:
                priorities.append(("Improve portfolio performance vs benchmark", 72))

        priorities = sorted(priorities, key=lambda x: x[1], reverse=True)

        return {
            "strengths": strengths[:5],
            "risks": risks[:6],
            "priority_actions": priorities[:6],
        }


    def build_personalized_action_plan(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> List[str]:
        items = []
        for rec in planner_result.get("top_recommendations", []):
            items.append(rec)

        if portfolio_result:
            for flag in portfolio_result.get("risk_flags", []):
                if "concentrated" in flag.lower():
                    items.append("Gradually rebalance away from concentrated portfolio positions.")
                if "expense ratio" in flag.lower():
                    items.append("Review high-cost funds and compare with lower-cost alternatives.")
                if "underperforming" in flag.lower():
                    items.append("Review whether current fund mix matches benchmark and goals.")

        deduped = []
        for item in items:
            if item not in deduped:
                deduped.append(item)

        return deduped[:6]


    def build_combined_score_dashboard(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, float]:
        money_health = planner_result["overall_score"]
        fire_readiness = planner_result["dimension_scores"]["retirement_readiness"]

        portfolio_health = 65.0
        if portfolio_result:
            portfolio_health = 100.0
            if len(portfolio_result.get("risk_flags", [])) >= 3:
                portfolio_health -= 30
            elif len(portfolio_result.get("risk_flags", [])) >= 1:
                portfolio_health -= 15

            weighted_er = portfolio_result.get("weighted_expense_ratio", 0)
            if weighted_er > 1.5:
                portfolio_health -= 10

            benchmark = portfolio_result.get("benchmark_comparison", {})
            if benchmark.get("alpha", 0) < 0:
                portfolio_health -= 10

            portfolio_health = max(0, round(portfolio_health, 2))

        return {
            "Money Health Score": money_health,
            "FIRE Readiness": fire_readiness,
            "Portfolio Health": portfolio_health,
        }


    def build_before_after_projection(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        current_money = planner_result["overall_score"]
        current_fire = planner_result["dimension_scores"]["retirement_readiness"]
        current_portfolio = self.build_combined_score_dashboard(planner_result, portfolio_result)["Portfolio Health"]

        improved_money = min(current_money + 18, 100)
        improved_fire = min(current_fire + 20, 100)
        improved_portfolio = min(current_portfolio + 15, 100)

        return [
            {"metric": "Money Health Score", "current": current_money, "projected": improved_money},
            {"metric": "FIRE Readiness", "current": current_fire, "projected": improved_fire},
            {"metric": "Portfolio Health", "current": current_portfolio, "projected": improved_portfolio},
        ]


    def build_roadmap(self) -> List[Dict[str, str]]:
        return [
            {"timeline": "Next 3 Months", "action": "Build emergency fund discipline, review insurance, reduce high-cost debt."},
            {"timeline": "Next 6 Months", "action": "Increase SIP, optimize tax-saving allocation, improve diversification."},
            {"timeline": "Next 12 Months", "action": "Rebalance portfolio, track benchmark performance, move closer to FIRE target."},
        ]
    def build_llm_prompt(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        return f"""
You are an Indian personal finance mentor.
Use only the structured results below.
Do not make up facts.
Do not give unsafe investment promises.
Be practical, clear, and supportive.

Planner Result:
{planner_result}

Portfolio Result:
{portfolio_result}

Write:
1. A short mentor-style summary
2. Top 3 actions
3. What the user should do in the next 30 days
"""

    def generate_mentor_summary(
        self,
        planner_result: Dict[str, Any],
        portfolio_result: Optional[Dict[str, Any]] = None,
    ) -> str:
        if self.llm.is_available():
            prompt = self.build_llm_prompt(planner_result, portfolio_result)
            return self.llm.generate_text(prompt)

        return self.build_rule_based_mentor_summary(planner_result, portfolio_result)

    def compare_scenarios(
        self,
        base_projection: Dict[str, Any],
        new_projection: Dict[str, Any],
    ) -> str:
        base_gap = base_projection["gap"]
        new_gap = new_projection["gap"]
        gap_change = base_gap - new_gap

        base_sip = base_projection["recommended_monthly_sip"]
        new_sip = new_projection["recommended_monthly_sip"]

        if gap_change > 0:
            return (
                f"This scenario improves your retirement path by reducing the gap by Rs. {gap_change:,.0f}. "
                f"Suggested SIP changes from Rs. {base_sip:,.0f} to Rs. {new_sip:,.0f}."
            )

        return (
            f"This scenario does not materially improve the retirement outlook. "
            f"Suggested SIP changes from Rs. {base_sip:,.0f} to Rs. {new_sip:,.0f}."
        )