import pandas as pd
import streamlit as st

from agents.planner_agent import PlannerAgent


st.set_page_config(page_title="AI Money Mentor", layout="wide")
st.title("AI Money Mentor")
st.caption("Day 2 MVP - Money Health Score + FIRE Planner")

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


def format_inr(value: float) -> str:
    return f"Rs. {value:,.0f}"


if st.button("Analyze Profile"):
    result = agent.analyze_profile(profile)

    st.subheader("Overall Financial Health")
    col1, col2 = st.columns([1, 2])
    with col1:
        st.metric("Money Health Score", result["overall_score"])
    with col2:
        st.info(result["overall_summary"])

    st.subheader("6-Dimension Score Breakdown")
    score_df = pd.DataFrame(
        {
            "Dimension": [
                "Emergency",
                "Insurance",
                "Diversification",
                "Debt",
                "Tax",
                "Retirement",
            ],
            "Score": [
                result["dimension_scores"]["emergency_preparedness"],
                result["dimension_scores"]["insurance_coverage"],
                result["dimension_scores"]["investment_diversification"],
                result["dimension_scores"]["debt_health"],
                result["dimension_scores"]["tax_efficiency"],
                result["dimension_scores"]["retirement_readiness"],
            ],
        }
    )

    st.bar_chart(score_df.set_index("Dimension"))

    summary_map = result["dimension_summary"]

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("### Emergency Preparedness")
        st.write(f"**Score:** {result['dimension_scores']['emergency_preparedness']} ({summary_map['emergency_preparedness']['score_band']})")
        st.write(summary_map["emergency_preparedness"]["explanation"])

        st.markdown("### Investment Diversification")
        st.write(f"**Score:** {result['dimension_scores']['investment_diversification']} ({summary_map['investment_diversification']['score_band']})")
        st.write(summary_map["investment_diversification"]["explanation"])

        st.markdown("### Tax Efficiency")
        st.write(f"**Score:** {result['dimension_scores']['tax_efficiency']} ({summary_map['tax_efficiency']['score_band']})")
        st.write(summary_map["tax_efficiency"]["explanation"])

    with c2:
        st.markdown("### Insurance Coverage")
        st.write(f"**Score:** {result['dimension_scores']['insurance_coverage']} ({summary_map['insurance_coverage']['score_band']})")
        st.write(summary_map["insurance_coverage"]["explanation"])

        st.markdown("### Debt Health")
        st.write(f"**Score:** {result['dimension_scores']['debt_health']} ({summary_map['debt_health']['score_band']})")
        st.write(summary_map["debt_health"]["explanation"])

        st.markdown("### Retirement Readiness")
        st.write(f"**Score:** {result['dimension_scores']['retirement_readiness']} ({summary_map['retirement_readiness']['score_band']})")
        st.write(summary_map["retirement_readiness"]["explanation"])

    st.subheader("FIRE Projection")
    fp = result["fire_projection"]
    f1, f2, f3, f4 = st.columns(4)
    f1.metric("Years to Retirement", fp["years_to_retirement"])
    f2.metric("Target Corpus", format_inr(fp["target_corpus"]))
    f3.metric("Projected Corpus", format_inr(fp["projected_corpus"]))
    f4.metric("Retirement Gap", format_inr(fp["gap"]))

    st.metric("Suggested Monthly SIP", format_inr(fp["recommended_monthly_sip"]))

    st.subheader("Top Recommendations")
    for i, rec in enumerate(result["top_recommendations"], start=1):
        st.success(f"{i}. {rec}")
else:
    st.write("Fill the profile from the sidebar and click **Analyze Profile**.")