import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  age: string;
  income: string;
  expenses: string;
  savings: string;
  sip: string;
  loans: string;
  retirementAge: string;
}

const steps = ["Basics", "Finances", "Goals"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    age: "", income: "", expenses: "", savings: "", sip: "", loans: "", retirementAge: "60",
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const next = () => {
    if (step < 2) setStep(step + 1);
    else {
      localStorage.setItem("onboarding", JSON.stringify(form));
      navigate("/dashboard");
    }
  };

  // Redirect to auth if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold text-foreground">AI Money Mentor</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              i < step ? "bg-accent text-accent-foreground" :
              i === step ? "bg-primary text-primary-foreground animate-pulse-glow" :
              "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < 2 && <div className={`w-8 h-0.5 ${i < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)] animate-scale-in" key={step}>
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Tell us about yourself</h2>
            <div><Label>Age</Label><Input type="number" placeholder="e.g. 30" value={form.age} onChange={set("age")} className="mt-1.5" /></div>
            <div><Label>Monthly Income (₹)</Label><Input type="number" placeholder="e.g. 80000" value={form.income} onChange={set("income")} className="mt-1.5" /></div>
            <div><Label>Monthly Expenses (₹)</Label><Input type="number" placeholder="e.g. 40000" value={form.expenses} onChange={set("expenses")} className="mt-1.5" /></div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Your financial snapshot</h2>
            <div><Label>Total Savings (₹)</Label><Input type="number" placeholder="e.g. 500000" value={form.savings} onChange={set("savings")} className="mt-1.5" /></div>
            <div><Label>Monthly SIP (₹)</Label><Input type="number" placeholder="e.g. 10000" value={form.sip} onChange={set("sip")} className="mt-1.5" /></div>
            <div><Label>Total Loans / EMI (₹)</Label><Input type="number" placeholder="e.g. 15000" value={form.loans} onChange={set("loans")} className="mt-1.5" /></div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Your retirement goal</h2>
            <div><Label>Target Retirement Age</Label><Input type="number" placeholder="e.g. 55" value={form.retirementAge} onChange={set("retirementAge")} className="mt-1.5" /></div>
            <p className="text-sm text-muted-foreground">We'll create a personalized retirement plan based on your data.</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : navigate("/")} className="text-muted-foreground gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={next} className="bg-primary text-primary-foreground gap-1 px-6">
            {step === 2 ? "View Dashboard" : "Continue"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
