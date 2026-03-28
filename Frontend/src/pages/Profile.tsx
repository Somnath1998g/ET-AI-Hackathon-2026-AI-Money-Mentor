import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, User, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchMoneyHealthScore,
  fetchAiMentorSummary,
  fetchFirePathPlanner,
} from "@/services/api";
import { getUserData, saveUserData } from "@/utils/userStorage";

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

const defaultForm: FormData = {
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
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const existing = getUserData(user.email);
    if (existing?.profileForm) {
      setForm(existing.profileForm);
    }
  }, [user]);

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value as FormData[keyof FormData],
      }));
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

  const handleSave = async () => {
    try {
      if (!user?.email) return;

      setSaving(true);

      const payload = buildPayload();

      const [moneyHealthResult, firePlanResult, mentorSummaryResult] =
        await Promise.all([
          fetchMoneyHealthScore(payload),
          fetchFirePathPlanner(payload),
          fetchAiMentorSummary(payload),
        ]);

      saveUserData(user.email, {
        profileForm: form,
        profilePayload: payload,
        moneyHealthResult,
        firePlanResult,
        mentorSummaryResult,
      });
      window.dispatchEvent(new Event("user-data-updated"));
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="text-muted-foreground gap-1 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Your Profile
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {user?.email || "guest@example.com"}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                value={form.age}
                onChange={set("age")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Monthly Income (₹)</Label>
              <Input
                type="number"
                value={form.monthly_income}
                onChange={set("monthly_income")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Monthly Expenses (₹)</Label>
              <Input
                type="number"
                value={form.monthly_expenses}
                onChange={set("monthly_expenses")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Liquid Savings (₹)</Label>
              <Input
                type="number"
                value={form.liquid_savings}
                onChange={set("liquid_savings")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Current Investment Corpus (₹)</Label>
              <Input
                type="number"
                value={form.current_investment_corpus}
                onChange={set("current_investment_corpus")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Monthly SIP (₹)</Label>
              <Input
                type="number"
                value={form.monthly_sip}
                onChange={set("monthly_sip")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Monthly EMI (₹)</Label>
              <Input
                type="number"
                value={form.monthly_emi}
                onChange={set("monthly_emi")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Credit Card Outstanding (₹)</Label>
              <Input
                type="number"
                value={form.credit_card_outstanding}
                onChange={set("credit_card_outstanding")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Health Insurance Cover (₹)</Label>
              <Input
                type="number"
                value={form.health_insurance_cover}
                onChange={set("health_insurance_cover")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Term Insurance Cover (₹)</Label>
              <Input
                type="number"
                value={form.term_insurance_cover}
                onChange={set("term_insurance_cover")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Dependents</Label>
              <Input
                type="number"
                value={form.dependents}
                onChange={set("dependents")}
                className="mt-1.5"
              />
            </div>
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
            <div>
              <Label>Equity Investments (₹)</Label>
              <Input
                type="number"
                value={form.equity_investments}
                onChange={set("equity_investments")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Debt Investments (₹)</Label>
              <Input
                type="number"
                value={form.debt_investments}
                onChange={set("debt_investments")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Gold Investments (₹)</Label>
              <Input
                type="number"
                value={form.gold_investments}
                onChange={set("gold_investments")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>EPF Annual (₹)</Label>
              <Input
                type="number"
                value={form.epf_annual}
                onChange={set("epf_annual")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>PPF Annual (₹)</Label>
              <Input
                type="number"
                value={form.ppf_annual}
                onChange={set("ppf_annual")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>ELSS Annual (₹)</Label>
              <Input
                type="number"
                value={form.elss_annual}
                onChange={set("elss_annual")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>NPS Annual (₹)</Label>
              <Input
                type="number"
                value={form.nps_annual}
                onChange={set("nps_annual")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Retirement Age Goal</Label>
              <Input
                type="number"
                value={form.retirement_age_goal}
                onChange={set("retirement_age_goal")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Expected Annual Return</Label>
              <Input
                type="number"
                step="0.01"
                value={form.expected_annual_return}
                onChange={set("expected_annual_return")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Inflation Rate</Label>
              <Input
                type="number"
                step="0.01"
                value={form.inflation_rate}
                onChange={set("inflation_rate")}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground gap-2"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
