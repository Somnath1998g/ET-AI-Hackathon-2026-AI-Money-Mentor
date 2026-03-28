import streamlit as st
from agents.planner_agent import PlannerAgent


st.set_page_config(page_title="AI Money Mentor", layout="wide")
st.title("AI Money Mentor - Day 1 MVP")

st.write("Enter a sample financial profile and get Money Health Score + FIRE projection.")

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

agent = PlannerAgent()

if st.button("Analyze Profile"):
    result = agent.analyze_profile(profile)

    st.subheader("Overall Money Health Score")
    st.metric("Score", result["overall_score"])

    st.subheader("Dimension Scores")
    st.json(result["dimension_scores"])

    st.subheader("FIRE Projection")
    st.json(result["fire_projection"])

    st.subheader("Top Recommendations")
    for idx, rec in enumerate(result["top_recommendations"], start=1):
        st.write(f"{idx}. {rec}")