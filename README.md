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

---

## Project Structure

```bash
AI-Money-Mentor/
│
├── Frontend/         # React frontend
├── Backend/          # FastAPI backend
└── README.md
