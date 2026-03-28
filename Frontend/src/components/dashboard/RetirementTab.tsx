import { Shield, Target, Banknote } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData } from "@/utils/userStorage";
import { useUserData } from "@/hooks/useUserData";

function formatCurrency(value: number | undefined) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function RetirementTab() {
  const { user } = useAuth();
  const userData = useUserData(user?.email);
  const data = userData?.firePlanResult?.data;

  const fireProjection = data?.fire_projection;
  const firePlan = data?.fire_plan;

  const emergencyFundTarget = firePlan?.emergency_fund_target ?? 0;
  const targetCorpus = fireProjection?.target_corpus ?? 0;
  const suggestedMonthlySip = fireProjection?.recommended_monthly_sip ?? 0;

  const insuranceGap = firePlan?.insurance_gap ?? {};
  const taxSuggestions = firePlan?.tax_suggestions ?? [];
  const wealthData = firePlan?.monthly_corpus_growth ?? [];
  const sipGoals = firePlan?.sip_by_goal ?? [];
  const allocationData = firePlan?.allocation_shift ?? [];
  const recommendedAllocation = firePlan?.asset_allocation ?? [];
  const fireProgress = firePlan?.fire_progress ?? {};

  const progressPct = fireProgress?.progress_pct ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--finance-red)/.12)] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-[hsl(var(--finance-red))]" />
          </div>
          <p className="text-xs text-muted-foreground">Emergency Fund Target</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(emergencyFundTarget)}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Target Corpus</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(targetCorpus)}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/12 flex items-center justify-center mx-auto mb-3">
            <Banknote className="w-5 h-5 text-accent" />
          </div>
          <p className="text-xs text-muted-foreground">Suggested Monthly SIP</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(suggestedMonthlySip)}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Insurance Gap Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recommended Health Cover</span>
              <span className="font-medium">{formatCurrency(insuranceGap?.recommended_health_cover)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Health Cover</span>
              <span className="font-medium">{formatCurrency(insuranceGap?.current_health_cover)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Health Gap</span>
              <span className="font-medium text-[hsl(var(--finance-red))]">
                {formatCurrency(insuranceGap?.health_gap)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recommended Term Cover</span>
              <span className="font-medium">{formatCurrency(insuranceGap?.recommended_term_cover)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Term Cover</span>
              <span className="font-medium">{formatCurrency(insuranceGap?.current_term_cover)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Term Gap</span>
              <span className="font-medium text-[hsl(var(--finance-red))]">
                {formatCurrency(insuranceGap?.term_gap)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-3">Tax-Saving Suggestions</h3>
        <div className="space-y-3">
          {taxSuggestions.map((item: string, index: number) => (
            <div key={index} className="rounded-xl p-4 bg-accent/10 border-l-3 border-l-accent">
              <p className="text-sm text-accent">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Month-by-Month Wealth Growth</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={wealthData}>
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
              formatter={(v: number) => [formatCurrency(v), "Corpus"]}
            />
            <Line type="monotone" dataKey="corpus" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">SIP Amount Per Goal</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sipGoals} barSize={40}>
            <XAxis dataKey="goal" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
              formatter={(v: number) => [formatCurrency(v), "SIP"]}
            />
            <Bar dataKey="sip" name="SIP (₹)" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} fillOpacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Asset Allocation Shift Over Time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={allocationData}>
            <XAxis dataKey="age" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Equity" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Debt" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Gold" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Cash" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-3">Progress Toward FIRE Target</h3>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="text-sm text-muted-foreground">
          Current Corpus: <span className="font-medium">{formatCurrency(fireProgress?.current_corpus)}</span> | Target Corpus:{" "}
          <span className="font-medium">{formatCurrency(fireProgress?.target_corpus)}</span> | Progress:{" "}
          <span className="font-medium text-primary">{progressPct}%</span>
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Recommended Asset Allocation</h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium w-12"></th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Asset</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Value (%)</th>
              </tr>
            </thead>
            <tbody>
              {recommendedAllocation.map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                  <td className="py-2 px-3">{row.asset}</td>
                  <td className="py-2 px-3 text-right font-medium">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={recommendedAllocation} barSize={60}>
            <XAxis dataKey="asset" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar dataKey="value" name="Allocation %" fill="hsl(199, 89%, 76%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}