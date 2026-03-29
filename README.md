# AI Money Mentor

AI Money Mentor is an AI-powered personal finance platform built for the ET hackathon problem statement. It helps users understand their financial health, plan for retirement, analyze mutual fund portfolios, and receive personalized AI-driven insights.

## Problem Statement

95% of Indians do not have a financial plan. Traditional financial advisors are expensive and mostly serve high net-worth individuals. AI Money Mentor aims to make financial planning simple, affordable, and accessible for every Indian saver.

## What This Project Does

AI Money Mentor includes four main modules:

- **Money Health Score**  
  A guided onboarding flow that evaluates the user across 6 key financial dimensions:
  - Emergency preparedness
  - Insurance coverage
  - Investment diversification
  - Debt health
  - Tax efficiency
  - Retirement readiness

- **Retirement Plan / FIRE Path Planner**  
  Generates a personalized retirement roadmap with:
  - Emergency fund target
  - Target corpus
  - Suggested monthly SIP
  - Insurance gap analysis
  - Tax-saving suggestions
  - Month-by-month wealth growth
  - Asset allocation recommendations
  - FIRE progress tracking

- **Portfolio X-Ray**  
  Lets users analyze their mutual fund portfolio using:
  - Manual entry
  - PDF upload (CAMS / KFintech-style format)

  Outputs include:
  - Total invested amount
  - Current value
  - Gain / loss
  - True XIRR
  - Expense ratio drag
  - Portfolio concentration
  - Overlap analysis
  - Benchmark comparison
  - AI-generated rebalancing plan

- **AI Insights**  
  Combines planning and portfolio outputs into a mentor-style summary with:
  - Personalized action plan
  - Key strengths
  - Key risks / gaps
  - 30-day guidance
  - Priority actions
  - Roadmap and scenario analysis

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- Uvicorn

### AI / Logic
- Money scoring engine
- Retirement and FIRE planning engine
- Portfolio analysis engine
- LLM-based mentor summary Agent
- **Groq API** for LLM inference
  
---
## 🏗️ Architecture Overview

The project follows a **frontend-backend split architecture**:

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI Layer**: Groq-powered explanation layer for summary and insight generation
- **Finance Logic**: deterministic Python engines for scoring, FIRE math, XIRR, overlap, and recommendation generation

### High-level flow

```text
Frontend (React)
   -> sends profile data / uploads / scenario inputs
Backend (FastAPI)
   -> routes request to the correct workflow
Agents / Core Modules
   -> Planner workflow
   -> Portfolio workflow
   -> AI Insights workflow
Response
   -> frontend renders cards, charts, tables, and recommendations
```

## Project Structure

```bash
ET-AI-Hackathon-2026-AI-Money-Mentor/
├── Backend/
│   ├── agents/
│   │   ├── planner_agent.py
│   │   ├── portfolio_agent.py
│   │   └── explainer_agent.py
│   ├── engines/
│   │   ├── scoring.py
│   │   ├── fire_math.py
│   │   ├── fire_planner.py
│   │   ├── xirr.py
│   │   └── recommendations.py
│   ├── services/
│   │   ├── pdf_parser.py
│   │   └── llm_client.py
│   ├── main.py
│   └── requirements.txt
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── ...
│
├── README.md
├── architecture_document_final.pdf
└── impact_model_submission_v2.pdf
```
### Frontend Stack
The frontend is built with:

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI**
- **Recharts**
- **React Router**
- **React Context**
- **TanStack React Query**
- **React Hook Form**
- **Zod**
- **Vitest**
- **Playwright**

### Backend Stack
The backend is built with:

- **FastAPI**
- **Pydantic**
- **Python**
- **pdfplumber**
- is that "
Pythonfrom typing import Dict, Any, List


def generate_recommendations(
    profile: Dict[str, Any],
    scores: Dict[str, int],
    fire_projection: Dict[str, Any],
) -> List[str]:
    recommendations = []

    monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
    liquid_savings = profile.get("liquid_savings", 0)
    emergency_months = liquid_savings / monthly_expenses

    if emergency_months < 3:
        recommendations.append("Build an emergency fund of at least 3 months of expenses.")
    if emergency_months < 6:
        recommendations.append("Set up an auto-transfer each month to grow your emergency corpus toward 6 months.")

    if scores["insurance_coverage"] < 50:
        recommendations.append("Review your health and term insurance coverage to protect your family and goals.")

    if scores["debt_health"] < 60:
        recommendations.append("Reduce high-cost debt and lower EMI burden before increasing risky investments.")

    if scores["tax_efficiency"] < 60:
        recommendations.append("Use tax-saving instruments like EPF, PPF, ELSS, or NPS more efficiently.")

    if scores["retirement_readiness"] < 60:
        recommendations.append(
            f"Increase your monthly SIP toward approximately Rs. {int(fire_projection['recommended_monthly_sip'])} for retirement readiness."
        )

    if scores["investment_diversification"] < 60:
        recommendations.append("Diversify beyond one asset category by balancing equity, debt, and emergency liquidity.")

    return recommendations[:5]
 
" check if else statements. is that correct for recomendation?Yes, the if statements are syntactically correct — the code will run without errors.
However, the logic for generating recommendations is not ideal in a few places. Here's a clear breakdown:
What's Good

All conditions are simple and independent (which is fine for recommendations).
The final recommendations[:5] safely limits output to max 5 items.
Safe handling of monthly_expenses with max(..., 1) to avoid division by zero.
The retirement SIP message dynamically uses the projected value — nice touch.

Issues / Improvements Needed

Emergency fund logic is overlapping and can be confusingPythonif emergency_months < 3:
    ... "Build an emergency fund of at least 3 months..."
if emergency_months < 6:   # This will also trigger when < 3
    ... "Set up auto-transfer to grow toward 6 months..."Problem: When someone has only 1–2 months, they get both messages.
The first message is urgent, the second is milder. It's better to show only the most important one.Better version:Pythonif emergency_months < 3:
    recommendations.append("Build an emergency fund of at least 3 months of expenses. Prioritize this before other investments.")
elif emergency_months < 6:
    recommendations.append("Set up an auto-transfer each month to grow your emergency corpus toward 6 months.")
No prioritization
Right now, the order is fixed by the sequence of if statements.
But some issues are more critical than others (e.g., very low emergency fund or high-cost debt is usually more urgent than tax efficiency).Currently you just take the first 5 that trigger. This can hide important recommendations.
Minor improvements
Add a check if fire_projection actually has the key 'recommended_monthly_sip' (to avoid KeyError).
Consider making thresholds consistent (insurance uses <50, others use <60).


Recommended Improved Version
Pythonfrom typing import Dict, Any, List


def generate_recommendations(
    profile: Dict[str, Any],
    scores: Dict[str, int],
    fire_projection: Dict[str, Any],
) -> List[str]:
    recommendations = []

    monthly_expenses = max(profile.get("monthly_expenses", 0), 1)
    liquid_savings = profile.get("liquid_savings", 0)
    emergency_months = liquid_savings / monthly_expenses

    # Emergency fund - prioritized
    if emergency_months < 3:
        recommendations.append(
            "Build an emergency fund of at least 3 months of expenses. This is a top priority."
        )
    elif emergency_months < 6:
        recommendations.append(
            "Set up an auto-transfer each month to grow your emergency corpus toward 6 months."
        )

    # Other recommendations (in rough order of importance)
    if scores.get("insurance_coverage", 0) < 50:
        recommendations.append("Review your health and term insurance coverage to protect your family and goals.")

    if scores.get("debt_health", 0) < 60:
        recommendations.append("Reduce high-cost debt and lower EMI burden before increasing risky investments.")

    if scores.get("retirement_readiness", 0) < 60:
        recommended_sip = int(fire_projection.get("recommended_monthly_sip", 0))
        recommendations.append(
            f"Increase your monthly SIP toward approximately Rs. {recommended_sip} for retirement readiness."
        )

    if scores.get("tax_efficiency", 0) < 60:
        recommendations.append("Use tax-saving instruments like EPF, PPF, ELSS, or NPS more efficiently.")

    if scores.get("investment_diversification", 0) < 60:
        recommendations.append("Diversify beyond one asset category by balancing equity, debt, and emergency liquidity.")

    return recommendations[:5]
Summary

Your original code works, but the emergency fund part is a bit redundant.
Adding elif + slight reordering makes the recommendations clearer and more actionable.
Using .get() with default is safer.

Would you like me to also add priority scoring (so the most critical recommendations always come first, even if more than 5 conditions are true)?write that in README.md format for GITHub, so that I can copy paste directlyHere's a clean, well-formatted README.md version that you can directly copy and paste into your GitHub repository:
Markdown# Finance Planner

A modern personal finance planning application with intelligent recommendations, retirement planning, and portfolio analysis.

## 🚀 Tech Stack

### Frontend Stack
The frontend is built with:

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI**
- **Recharts**
- **React Router**
- **React Context**
- **TanStack React Query**
- **React Hook Form**
- **Zod**
- **Vitest**
- **Playwright**

### Backend Stack
The backend is built with:

- **FastAPI**
- **Pydantic**
- **Python**
- **pdfplumber**
- **Groq API**
- Custom finance engines for:
  - Scoring
  - Retirement math
  - XIRR
  - Overlap
  - Recommendations

## 🛠 Backend Workflows

### Planner Workflow
The planner workflow powers:

- Money Health Score
- Retirement Plan

**It uses:**
- `scoring.py`
- `fire_math.py`
- `fire_planner.py`
- `recommendations.py`
## Portfolio Workflow

The portfolio workflow powers:

- Portfolio X-Ray

**It uses:**
- `pdf_parser.py`
- `xirr.py`
- `portfolio_agent.py`

## AI Insights Workflow

The AI Insights workflow powers:

- Mentor summary
- Strengths/risks
- Action plan
- Scenario explanations
- Rebalancing explanations

**It uses:**
- `explainer_agent.py`
- `llm_client.py`

---

## 🔌API Endpoints

The backend currently exposes these endpoints:

### Available Endpoints

```http
GET  /
POST /money-health-score
POST /fire-path-planner
POST /portfolio-xray
POST /portfolio-xray/upload
POST /ai-mentor-summary
POST /scenario-analysis
```
## 1. Clone the repository
```bash
git clone https://github.com/<your-username>/ET-AI-Hackathon-2026-AI-Money-Mentor.git
cd ET-AI-Hackathon-2026-AI-Money-Mentor
```
## 2. Run the frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend will run at:
```bash
http://localhost:5173
```
## 3. Run the backend
```bash
cd Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend will run at:
```bash
http://127.0.0.1:8000
```
FastAPI docs will be available at:
```bash
http://127.0.0.1:8000/docs
```
## 4. Environment Variables
Create a **.env** file in the backend folder if you want LLM-powered summaries:
```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```
If the API key is not configured, the app can still work with rule-based fallback logic for several insight outputs.
