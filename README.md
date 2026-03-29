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
