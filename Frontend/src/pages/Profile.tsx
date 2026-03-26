import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, LogOut, User, Mail } from "lucide-react";
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

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState<FormData>({
    age: "", income: "", expenses: "", savings: "", sip: "", loans: "", retirementAge: "60",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("onboarding");
    if (data) setForm(JSON.parse(data));
  }, []);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    localStorage.setItem("onboarding", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-muted-foreground gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
          {/* User info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Your Profile</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {user?.email || "guest@example.com"}
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div><Label>Age</Label><Input type="number" value={form.age} onChange={set("age")} className="mt-1.5" /></div>
            <div><Label>Monthly Income (₹)</Label><Input type="number" value={form.income} onChange={set("income")} className="mt-1.5" /></div>
            <div><Label>Monthly Expenses (₹)</Label><Input type="number" value={form.expenses} onChange={set("expenses")} className="mt-1.5" /></div>
            <div><Label>Total Savings (₹)</Label><Input type="number" value={form.savings} onChange={set("savings")} className="mt-1.5" /></div>
            <div><Label>Monthly SIP (₹)</Label><Input type="number" value={form.sip} onChange={set("sip")} className="mt-1.5" /></div>
            <div><Label>Loans / EMI (₹)</Label><Input type="number" value={form.loans} onChange={set("loans")} className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Retirement Age</Label><Input type="number" value={form.retirementAge} onChange={set("retirementAge")} className="mt-1.5" /></div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {/* <Button variant="destructive" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button> */}
            <Button onClick={handleSave} className="bg-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> {saved ? "Saved ✓" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
