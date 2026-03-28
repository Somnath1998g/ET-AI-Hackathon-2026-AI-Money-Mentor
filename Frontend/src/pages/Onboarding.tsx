import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMoneyHealthScore } from "@/services/api";

interface FormData {
  age: string;
  monthly_income: string;
  monthly_expenses: string;
  liquid_savings: string;
  current_investment_corpus: string;
  monthly_sip: string;
  monthly_emi: string;
  credit_card_outstanding: string;
  health_insurance_cover: string;
  term_insurance_cover: string;
  dependents: string;
  equity_investments: string;
  debt_investments: string;
  gold_investments: string;
  epf_annual: string;
  ppf_annual: string;
  elss_annual: string;
  nps_annual: string;
  retirement_age_goal: string;
  expected_annual_return: string;
  inflation_rate: string;
  risk_profile: "conservative" | "moderate" | "aggressive";
}

const steps = ["Basics", "Protection", "Investments", "Goals"];

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    age: "",
    monthly_income: "",
    monthly_expenses: "",
    liquid_savings: "",
    current_investment_corpus: "",
    monthly_sip: "",
    monthly_emi: "",
    credit_card_outstanding: "0",
    health_insurance_cover: "0",
    term_insurance_cover: "0",
    dependents: "0",
    equity_investments: "0",
    debt_investments: "0",
    gold_investments: "0",
    epf_annual: "0",
    ppf_annual: "0",
    elss_annual: "0",
    nps_annual: "0",
    retirement_age_goal: "60",
    expected_annual_return: "0.10",
    inflation_rate: "0.07",
    risk_profile: "moderate",
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  const set =
    (key: keyof FormData) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value as FormData[keyof FormData] }));
    };

  const buildPayload = () => ({
    age: Number(form.age),
    monthly_income: Number(form.monthly_income),
    monthly_expenses: Number(form.monthly_expenses),
    liquid_savings: Number(form.liquid_savings),
    current_investment_corpus: Number(form.current_investment_corpus),
    monthly_sip: Number(form.monthly_sip),
    monthly_emi: Number(form.monthly_emi),
    credit_card_outstanding: Number(form.credit_card_outstanding),
    health_insurance_cover: Number(form.health_insurance_cover),
    term_insurance_cover: Number(form.term_insurance_cover),
    dependents: Number(form.dependents),
    equity_investments: Number(form.equity_investments),
    debt_investments: Number(form.debt_investments),
    gold_investments: Number(form.gold_investments),
    epf_annual: Number(form.epf_annual),
    ppf_annual: Number(form.ppf_annual),
    elss_annual: Number(form.elss_annual),
    nps_annual: Number(form.nps_annual),
    retirement_age_goal: Number(form.retirement_age_goal),
    expected_annual_return: Number(form.expected_annual_return),
    inflation_rate: Number(form.inflation_rate),
    risk_profile: form.risk_profile,
  });

  const validateStep = () => {
    if (step === 0) {
      return form.age && form.monthly_income && form.monthly_expenses && form.liquid_savings;
    }
    if (step === 1) {
      return form.monthly_emi !== "" && form.health_insurance_cover !== "" && form.term_insurance_cover !== "" && form.dependents !== "";
    }
    if (step === 2) {
      return form.current_investment_corpus !== "" && form.monthly_sip !== "" && form.equity_investments !== "" && form.debt_investments !== "" && form.gold_investments !== "";
    }
    if (step === 3) {
      return form.retirement_age_goal && form.expected_annual_return && form.inflation_rate && form.risk_profile;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = buildPayload();

      const result = await fetchMoneyHealthScore(payload);

      localStorage.setItem("onboarding", JSON.stringify(form));
      localStorage.setItem("moneyHealthPayload", JSON.stringify(payload));
      localStorage.setItem("moneyHealthResult", JSON.stringify(result));

      navigate("/dashboard");
    } catch (error) {
      console.error("API error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!validateStep()) {
      alert("Please fill all required fields in this step.");
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold text-foreground">AI Money Mentor</span>
      </div>

      <div className="flex items-center gap-3 mb-8 flex-wrap justify-center">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i < step
                  ? "bg-accent text-accent-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground animate-pulse-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)] animate-scale-in">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Basic details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Age</Label><Input type="number" value={form.age} onChange={set("age")} className="mt-1.5" /></div>
              <div><Label>Monthly Income (₹)</Label><Input type="number" value={form.monthly_income} onChange={set("monthly_income")} className="mt-1.5" /></div>
              <div><Label>Monthly Expenses (₹)</Label><Input type="number" value={form.monthly_expenses} onChange={set("monthly_expenses")} className="mt-1.5" /></div>
              <div><Label>Liquid Savings (₹)</Label><Input type="number" value={form.liquid_savings} onChange={set("liquid_savings")} className="mt-1.5" /></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Protection & liabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Monthly EMI (₹)</Label><Input type="number" value={form.monthly_emi} onChange={set("monthly_emi")} className="mt-1.5" /></div>
              <div><Label>Credit Card Outstanding (₹)</Label><Input type="number" value={form.credit_card_outstanding} onChange={set("credit_card_outstanding")} className="mt-1.5" /></div>
              <div><Label>Health Insurance Cover (₹)</Label><Input type="number" value={form.health_insurance_cover} onChange={set("health_insurance_cover")} className="mt-1.5" /></div>
              <div><Label>Term Insurance Cover (₹)</Label><Input type="number" value={form.term_insurance_cover} onChange={set("term_insurance_cover")} className="mt-1.5" /></div>
              <div><Label>Dependents</Label><Input type="number" value={form.dependents} onChange={set("dependents")} className="mt-1.5" /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Investments & tax savings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Current Investment Corpus (₹)</Label><Input type="number" value={form.current_investment_corpus} onChange={set("current_investment_corpus")} className="mt-1.5" /></div>
              <div><Label>Monthly SIP (₹)</Label><Input type="number" value={form.monthly_sip} onChange={set("monthly_sip")} className="mt-1.5" /></div>
              <div><Label>Equity Investments (₹)</Label><Input type="number" value={form.equity_investments} onChange={set("equity_investments")} className="mt-1.5" /></div>
              <div><Label>Debt Investments (₹)</Label><Input type="number" value={form.debt_investments} onChange={set("debt_investments")} className="mt-1.5" /></div>
              <div><Label>Gold Investments (₹)</Label><Input type="number" value={form.gold_investments} onChange={set("gold_investments")} className="mt-1.5" /></div>
              <div><Label>EPF Annual (₹)</Label><Input type="number" value={form.epf_annual} onChange={set("epf_annual")} className="mt-1.5" /></div>
              <div><Label>PPF Annual (₹)</Label><Input type="number" value={form.ppf_annual} onChange={set("ppf_annual")} className="mt-1.5" /></div>
              <div><Label>ELSS Annual (₹)</Label><Input type="number" value={form.elss_annual} onChange={set("elss_annual")} className="mt-1.5" /></div>
              <div><Label>NPS Annual (₹)</Label><Input type="number" value={form.nps_annual} onChange={set("nps_annual")} className="mt-1.5" /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Goal settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Retirement Age Goal</Label><Input type="number" value={form.retirement_age_goal} onChange={set("retirement_age_goal")} className="mt-1.5" /></div>
              <div><Label>Expected Annual Return</Label><Input type="number" step="0.01" value={form.expected_annual_return} onChange={set("expected_annual_return")} className="mt-1.5" /></div>
              <div><Label>Inflation Rate</Label><Input type="number" step="0.01" value={form.inflation_rate} onChange={set("inflation_rate")} className="mt-1.5" /></div>
              <div>
                <Label>Risk Profile</Label>
                <select
                  value={form.risk_profile}
                  onChange={set("risk_profile")}
                  className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We will use these values to generate your overall Money Health Score dashboard.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
            className="text-muted-foreground gap-1"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button onClick={next} className="bg-primary text-primary-foreground gap-1 px-6" disabled={loading}>
            {loading ? "Loading..." : step === steps.length - 1 ? "View Dashboard" : "Continue"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}