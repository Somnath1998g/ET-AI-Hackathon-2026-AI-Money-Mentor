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


tab1, tab2, tab3 = st.tabs(["Money Health Score", "Portfolio X-Ray", "AI Mentor Summary"])

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
    st.subheader("Portfolio X-Ray")

    uploaded_file = st.file_uploader("Upload Portfolio PDF", type=["pdf"])

    demo_holdings = [
        {"fund_name": "Axis Bluechip Fund", "invested": 120000, "current_value": 145000, "expense_ratio": 1.6},
        {"fund_name": "Parag Parikh Flexi Cap", "invested": 100000, "current_value": 130000, "expense_ratio": 1.5},
        {"fund_name": "HDFC Short Term Debt Fund", "invested": 80000, "current_value": 86000, "expense_ratio": 0.8},
    ]

    if st.button("Run Demo Portfolio X-Ray"):
        st.session_state["portfolio_result"] = portfolio_agent.analyze_holdings(demo_holdings)

    if uploaded_file is not None:
        st.session_state["portfolio_result"] = portfolio_agent.analyze_uploaded_pdf(uploaded_file)

    portfolio_result = st.session_state["portfolio_result"]

    if portfolio_result:
        totals = portfolio_result["totals"]
        p1, p2, p3, p4 = st.columns(4)
        p1.metric("Total Invested", format_inr(totals["total_invested"]))
        p2.metric("Current Value", format_inr(totals["total_current_value"]))
        p3.metric("Gain / Loss", format_inr(totals["gain_loss"]))
        p4.metric("Absolute Return %", f"{totals['absolute_return_pct']}%")

        st.metric("Weighted Expense Ratio", f"{portfolio_result['weighted_expense_ratio']}%")
        st.dataframe(pd.DataFrame(portfolio_result["holdings"]))
        st.dataframe(pd.DataFrame(portfolio_result["concentration"]))

        for flag in portfolio_result["risk_flags"]:
            st.warning(flag)

        for rec in portfolio_result["recommendations"]:
            st.success(rec)

with tab3:
    st.subheader("Unified AI Mentor Summary")

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