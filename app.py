import pandas as pd
import streamlit as st

from agents.planner_agent import PlannerAgent
from agents.portfolio_agent import PortfolioAgent
from agents.explainer_agent import ExplainerAgent
from engines.fire_math import calculate_fire_projection


st.set_page_config(page_title="AI Money Mentor", layout="wide")
st.title("AI Money Mentor")
st.caption("Day 4 MVP - Multi-Agent Financial Mentor")

planner_agent = PlannerAgent()
portfolio_agent = PortfolioAgent()
explainer_agent = ExplainerAgent()


def format_inr(value: float) -> str:
    return f"Rs. {value:,.0f}"


tab1, tab2, tab3, tab4 = st.tabs([
    "Money Health Score",
    "FIRE Path Planner",
    "Portfolio X-Ray",
    "AI Mentor Summary"
])

with st.sidebar:
    st.header("User Profile")

    age = st.number_input("Age", min_value=18, max_value=80, value=30)
    monthly_income = st.number_input("Monthly Income", min_value=0, value=100000)
    monthly_expenses = st.number_input("Monthly Expenses", min_value=0, value=60000)
    liquid_savings = st.number_input("Liquid Savings", min_value=0, value=80000)
    current_investment_corpus = st.number_input("Current Investment Corpus", min_value=0, value=250000)
    monthly_sip = st.number_input("Monthly SIP", min_value=0, value=5000)
    monthly_emi = st.number_input("Monthly EMI", min_value=0, value=18000)
    credit_card_outstanding = st.number_input("Credit Card Outstanding", min_value=0, value=25000)

    health_insurance_cover = st.number_input("Health Insurance Cover", min_value=0, value=300000)
    term_insurance_cover = st.number_input("Term Insurance Cover", min_value=0, value=0)
    dependents = st.number_input("Dependents", min_value=0, value=1)

    equity_investments = st.number_input("Equity Investments", min_value=0, value=150000)
    debt_investments = st.number_input("Debt Investments", min_value=0, value=50000)
    gold_investments = st.number_input("Gold Investments", min_value=0, value=0)

    epf_annual = st.number_input("EPF Annual", min_value=0, value=36000)
    ppf_annual = st.number_input("PPF Annual", min_value=0, value=0)
    elss_annual = st.number_input("ELSS Annual", min_value=0, value=0)
    nps_annual = st.number_input("NPS Annual", min_value=0, value=0)

    retirement_age_goal = st.number_input("Retirement Age Goal", min_value=35, max_value=80, value=50)

profile = {
    "age": age,
    "monthly_income": monthly_income,
    "monthly_expenses": monthly_expenses,
    "liquid_savings": liquid_savings,
    "current_investment_corpus": current_investment_corpus,
    "monthly_sip": monthly_sip,
    "monthly_emi": monthly_emi,
    "credit_card_outstanding": credit_card_outstanding,
    "health_insurance_cover": health_insurance_cover,
    "term_insurance_cover": term_insurance_cover,
    "dependents": dependents,
    "equity_investments": equity_investments,
    "debt_investments": debt_investments,
    "gold_investments": gold_investments,
    "epf_annual": epf_annual,
    "ppf_annual": ppf_annual,
    "elss_annual": elss_annual,
    "nps_annual": nps_annual,
    "retirement_age_goal": retirement_age_goal,
}

if "portfolio_result" not in st.session_state:
    st.session_state["portfolio_result"] = None

planner_result = planner_agent.analyze_profile(profile)

with tab1:
    st.subheader("Overall Financial Health")
    c1, c2 = st.columns([1, 2])
    with c1:
        st.metric("Money Health Score", planner_result["overall_score"])
    with c2:
        st.info(planner_result["overall_summary"])

    score_df = pd.DataFrame(
        {
            "Dimension": ["Emergency", "Insurance", "Diversification", "Debt", "Tax", "Retirement"],
            "Score": [
                planner_result["dimension_scores"]["emergency_preparedness"],
                planner_result["dimension_scores"]["insurance_coverage"],
                planner_result["dimension_scores"]["investment_diversification"],
                planner_result["dimension_scores"]["debt_health"],
                planner_result["dimension_scores"]["tax_efficiency"],
                planner_result["dimension_scores"]["retirement_readiness"],
            ],
        }
    )
    st.bar_chart(score_df.set_index("Dimension"))

    fp = planner_result["fire_projection"]
    f1, f2, f3, f4 = st.columns(4)
    f1.metric("Years to Retirement", fp["years_to_retirement"])
    f2.metric("Target Corpus", format_inr(fp["target_corpus"]))
    f3.metric("Projected Corpus", format_inr(fp["projected_corpus"]))
    f4.metric("Gap", format_inr(fp["gap"]))

    st.metric("Suggested Monthly SIP", format_inr(fp["recommended_monthly_sip"]))

    st.subheader("Top Recommendations")
    for i, rec in enumerate(planner_result["top_recommendations"], start=1):
        st.success(f"{i}. {rec}")

with tab2:
    st.subheader("FIRE Path Planner")

    fire_plan = planner_result["fire_plan"]
    fire_projection = planner_result["fire_projection"]

    st.markdown("### Key Planning Cards")
    c1, c2, c3 = st.columns(3)
    c1.metric("Emergency Fund Target", format_inr(fire_plan["emergency_fund_target"]))
    c2.metric("Target Corpus", format_inr(fire_projection["target_corpus"]))
    c3.metric("Suggested Monthly SIP", format_inr(fire_projection["recommended_monthly_sip"]))

    st.markdown("### Insurance Gap Analysis")
    insurance_gap = fire_plan["insurance_gap"]
    i1, i2 = st.columns(2)
    with i1:
        st.write(f"Recommended Health Cover: {format_inr(insurance_gap['recommended_health_cover'])}")
        st.write(f"Current Health Cover: {format_inr(insurance_gap['current_health_cover'])}")
        st.write(f"Health Gap: {format_inr(insurance_gap['health_gap'])}")
    with i2:
        st.write(f"Recommended Term Cover: {format_inr(insurance_gap['recommended_term_cover'])}")
        st.write(f"Current Term Cover: {format_inr(insurance_gap['current_term_cover'])}")
        st.write(f"Term Gap: {format_inr(insurance_gap['term_gap'])}")

    st.markdown("### Tax-Saving Suggestions")
    for suggestion in fire_plan["tax_suggestions"]:
        st.success(suggestion)

    st.markdown("### Month-by-Month Wealth Growth")
    corpus_df = pd.DataFrame(fire_plan["monthly_corpus_growth"])
    st.line_chart(corpus_df.set_index("month")[["corpus"]])

    st.markdown("### SIP Amount Per Goal")
    sip_df = pd.DataFrame(fire_plan["sip_by_goal"])
    st.bar_chart(sip_df.set_index("goal")[["sip"]])

    st.markdown("### Recommended Asset Allocation")
    alloc_df = pd.DataFrame(fire_plan["asset_allocation"])
    st.dataframe(alloc_df)
    st.bar_chart(alloc_df.set_index("asset")[["value"]])

    st.markdown("### Asset Allocation Shift Over Time")
    shift_df = pd.DataFrame(fire_plan["allocation_shift"])
    st.line_chart(shift_df.set_index("age")[["Equity", "Debt", "Gold", "Cash"]])

    st.markdown("### Progress Toward FIRE Target")
    progress = fire_plan["fire_progress"]
    st.progress(min(int(progress["progress_pct"]), 100))
    st.write(
        f"Current Corpus: {format_inr(progress['current_corpus'])} | "
        f"Target Corpus: {format_inr(progress['target_corpus'])} | "
        f"Progress: {progress['progress_pct']}%"
    )
with tab3:
    st.subheader("Portfolio X-Ray")

    benchmark_options = {
        "Nifty 50": 12.0,
        "Nifty 500": 11.0,
        "Hybrid Benchmark": 9.0,
    }

    benchmark_name = st.selectbox("Select Benchmark", list(benchmark_options.keys()))
    risk_preference = st.selectbox("Risk Preference", ["Conservative", "Moderate", "Aggressive"])

    uploaded_file = st.file_uploader("Upload CAMS / KFintech Statement", type=["pdf"])

    demo_holdings = [
        {
            "scheme_name": "Axis Bluechip Fund",
            "asset_class": "Equity",
            "category": "Large Cap",
            "invested_amount": 120000,
            "current_value": 145000,
            "expense_ratio": 1.6,
            "transactions": [
                {"date": "2024-01-01", "amount": -120000},
                {"date": "2026-03-26", "amount": 145000},
            ],
        },
        {
            "scheme_name": "Parag Parikh Flexi Cap",
            "asset_class": "Equity",
            "category": "Flexi Cap",
            "invested_amount": 100000,
            "current_value": 130000,
            "expense_ratio": 1.5,
            "transactions": [
                {"date": "2024-01-01", "amount": -100000},
                {"date": "2026-03-26", "amount": 130000},
            ],
        },
        {
            "scheme_name": "HDFC Short Term Debt Fund",
            "asset_class": "Debt",
            "category": "Debt",
            "invested_amount": 80000,
            "current_value": 86000,
            "expense_ratio": 0.8,
            "transactions": [
                {"date": "2024-01-01", "amount": -80000},
                {"date": "2026-03-26", "amount": 86000},
            ],
        },
    ]

    if st.button("Run Demo Portfolio X-Ray"):
        st.session_state["portfolio_result"] = portfolio_agent.analyze_holdings(
            demo_holdings,
            benchmark_return=benchmark_options[benchmark_name],
            risk_preference=risk_preference,
        )

    if uploaded_file is not None:
        st.session_state["portfolio_result"] = portfolio_agent.analyze_uploaded_pdf(
            uploaded_file,
            benchmark_return=benchmark_options[benchmark_name],
            risk_preference=risk_preference,
        )

    portfolio_result = st.session_state.get("portfolio_result")

    if portfolio_result:
        totals = portfolio_result["totals"]

        st.markdown("### Key Portfolio Metrics")
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Total Invested", format_inr(totals["total_invested"]))
        c2.metric("Current Value", format_inr(totals["total_current_value"]))
        c3.metric("Gain / Loss", format_inr(totals["gain_loss"]))
        c4.metric("True XIRR", f"{portfolio_result['portfolio_xirr']}%")

        c5, c6 = st.columns(2)
        c5.metric("Weighted Expense Ratio", f"{portfolio_result['weighted_expense_ratio']}%")
        c6.metric("Expense Ratio Drag", format_inr(portfolio_result["expense_drag"]))

        st.markdown("### AI-Generated Rebalancing Plan")
        st.info(portfolio_result["ai_rebalancing_plan"])

        st.markdown("### Portfolio Allocation by Category")
        allocation_df = pd.DataFrame(portfolio_result["category_allocation"])
        if not allocation_df.empty:
            st.caption("Use as donut/pie in final polished version. Streamlit shows pie-ready table or chart.")
            st.dataframe(allocation_df)
            st.bar_chart(allocation_df.set_index("category"))
        else:
            st.write("No category allocation available.")

        st.markdown("### Fund-wise Investment vs Current Value")
        holdings_df = pd.DataFrame(portfolio_result["holdings"])
        if not holdings_df.empty:
            compare_df = holdings_df[["scheme_name", "invested_amount", "current_value"]].set_index("scheme_name")
            st.bar_chart(compare_df)

        st.markdown("### Overlap Analysis")
        overlap_df = pd.DataFrame(portfolio_result["overlap"])
        if not overlap_df.empty:
            st.dataframe(overlap_df)
            grouped_overlap = overlap_df.copy()
            grouped_overlap["pair"] = grouped_overlap["fund_1"] + " vs " + grouped_overlap["fund_2"]
            st.bar_chart(grouped_overlap.set_index("pair")[["overlap_pct"]])

        st.markdown("### Expense Ratio Drag by Fund")
        expense_df = pd.DataFrame(portfolio_result["expense_drag_by_fund"])
        if not expense_df.empty:
            st.bar_chart(expense_df.set_index("scheme_name"))

        st.markdown("### Portfolio Return vs Benchmark")
        benchmark_df = pd.DataFrame(portfolio_result["portfolio_vs_benchmark"])
        if not benchmark_df.empty:
            st.line_chart(benchmark_df.set_index("period")[["portfolio_value", "benchmark_value"]])

        st.markdown("### Benchmark Comparison")
        st.dataframe(pd.DataFrame([portfolio_result["benchmark_comparison"]]))

        st.markdown("### Risk Flags")
        for flag in portfolio_result["risk_flags"]:
            st.warning(flag)

        st.markdown("### Portfolio Reconstruction")
        st.dataframe(holdings_df)

with tab4:
    st.subheader("AI Mentor Summary")

    portfolio_result = st.session_state.get("portfolio_result")

    mentor_summary = explainer_agent.generate_mentor_summary(
        planner_result=planner_result,
        portfolio_result=portfolio_result,
    )

    st.info(mentor_summary)

    st.markdown("### Scenario Analysis")
    extra_sip = st.slider("Increase SIP by", min_value=0, max_value=50000, value=5000, step=1000)
    delayed_retirement_age = st.slider("Alternative Retirement Age", min_value=profile["age"] + 1, max_value=80, value=55)

    scenario_profile = profile.copy()
    scenario_profile["monthly_sip"] = profile["monthly_sip"] + extra_sip
    scenario_profile["retirement_age_goal"] = delayed_retirement_age

    scenario_projection = calculate_fire_projection(scenario_profile)

    st.write("#### Base vs Scenario")
    s1, s2, s3 = st.columns(3)
    s1.metric("Base Gap", format_inr(planner_result["fire_projection"]["gap"]))
    s2.metric("Scenario Gap", format_inr(scenario_projection["gap"]))
    s3.metric("Scenario SIP", format_inr(scenario_projection["recommended_monthly_sip"]))

    scenario_text = explainer_agent.compare_scenarios(
        base_projection=planner_result["fire_projection"],
        new_projection=scenario_projection,
    )
    st.success(scenario_text)