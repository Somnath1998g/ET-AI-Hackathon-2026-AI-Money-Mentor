import { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const strengths = [
  "Debt burden is under reasonable control.",
  "Investment mix is reasonably diversified.",
];

const risks = [
  "Emergency fund is below ideal safety level.",
  "Insurance coverage gap may expose long-term goals.",
  "Tax-saving opportunities are underutilized.",
  "Retirement corpus is below target trajectory.",
  "Portfolio is underperforming the selected benchmark.",
];

const actionItems = [
  "Build an emergency fund of at least 3 months of expenses.",
  "Set up an auto-transfer each month to grow your emergency corpus toward 6 months.",
  "Review your health and term insurance coverage to protect your family and goals.",
  "Use tax-saving instruments like EPF, PPF, ELSS, or NPS more efficiently.",
  "Increase your monthly SIP toward approximately Rs. 73,196 for retirement readiness.",
  "Review whether current fund mix matches benchmark and goals.",
];

const weeklyPlan = [
  { week: "Week 1-2", action: "Start building your emergency fund by setting up an auto-transfer of a fixed amount each month. Even a small, consistent amount is a good start." },
  { week: "Week 3", action: "Review your current insurance policies (health and term) and compare them with recommended coverage levels. Begin the process of enhancing your coverage if necessary." },
  { week: "Week 4", action: "Analyze your investment portfolio in detail, focusing on concentration, overlap, and expense ratios. Consider consulting a financial advisor to get personalized advice." },
];

const combinedScores = [
  { name: "Money Health\nScore", current: 43, projected: 62 },
  { name: "FIRE\nReadiness", current: 5, projected: 35 },
  { name: "Portfolio\nHealth", current: 75, projected: 88 },
];

const roadmap = [
  { timeline: "Next 3 Months", action: "Build emergency fund discipline, review insurance, reduce high-cost debt." },
  { timeline: "Next 6 Months", action: "Increase SIP, optimize tax-saving allocation, improve diversification." },
  { timeline: "Next 12 Months", action: "Rebalance portfolio, track benchmark performance, move closer to FIRE target." },
];

const priorityRanking = [
  { name: "Increase SIP for retirement", score: 95 },
  { name: "Improve Insurance", score: 88 },
  { name: "Improve portfolio vs benchmark", score: 85 },
  { name: "Improve tax-saving allocation", score: 80 },
  { name: "Build emergency fund", score: 75 },
];

export default function InsightsTab() {
  const [sipIncrease, setSipIncrease] = useState(5000);
  const [altRetireAge, setAltRetireAge] = useState(55);

  const baseGap = 52218079;
  const scenarioGap = baseGap + sipIncrease * 12 * 25 * 0.6;
  const scenarioSip = 73197 - sipIncrease * 0.35;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Mentor Summary Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold">AI Mentor Summary</h3>
      </div>

      {/* Personalized Action Plan + Strengths/Risks */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-heading text-base font-semibold mb-3">Personalized Action Plan</h4>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              <span className="text-primary font-semibold">Short Mentor-Style Summary:</span> Your current financial health score is 43, indicating a fair overall financial situation. The key areas of concern include low emergency preparedness, inadequate insurance coverage, inefficient tax planning, and a significant gap in retirement readiness.
            </p>
            <div>
              <p className="font-medium text-foreground mb-2">Top 3 Actions:</p>
              <ol className="list-decimal list-inside space-y-1.5">
                <li><span className="font-medium text-foreground">Build an Emergency Fund:</span> Aim to save at least 3 months' worth of expenses to cushion against unexpected financial shocks.</li>
                <li><span className="font-medium text-foreground">Review and Enhance Insurance Coverage:</span> Ensure you have adequate health and term insurance to protect your family and goals.</li>
                <li><span className="font-medium text-foreground">Optimize Investment Portfolio:</span> Consider diversifying your investments, reducing concentration in a few funds, and exploring options with lower expense ratios.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h4 className="font-heading text-sm font-semibold mb-3">Key Strengths</h4>
            <div className="space-y-2">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3 bg-accent/10 border-l-3 border-l-accent">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                  <p className="text-sm text-accent">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h4 className="font-heading text-sm font-semibold mb-3">Key Risks / Gaps</h4>
            <div className="space-y-2">
              {risks.map((r, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3 bg-[hsl(var(--finance-red)/.08)] border-l-3 border-l-[hsl(var(--finance-red))]">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--finance-red))]" />
                  <p className="text-sm text-[hsl(var(--finance-red))]">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What to Do in the Next 30 Days */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h4 className="font-heading text-base font-semibold">What to Do in the Next 30 Days</h4>
        </div>
        <div className="space-y-3">
          {weeklyPlan.map((w) => (
            <div key={w.week} className="glass-card rounded-xl p-4">
              <p className="text-sm font-semibold text-primary mb-1">{w.week}</p>
              <p className="text-sm text-muted-foreground">{w.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-3">Priority Action Items</h4>
        <div className="space-y-2">
          {actionItems.map((item, i) => (
            <div key={i} className="rounded-xl p-3 bg-accent/10 border-l-3 border-l-accent">
              <p className="text-sm text-accent">{i + 1}. {item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Score Dashboard + Before vs After */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Combined Score Dashboard</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={combinedScores}>
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="current" name="Current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar dataKey="projected" name="Projected" fill="hsl(217, 91%, 60%)" fillOpacity={0.5} radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Strengths vs Risks vs Priority Areas</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { name: "Strengths", count: 2 },
              { name: "Risks", count: 5 },
              { name: "Priority Areas", count: 5 },
            ]} layout="vertical" barSize={28}>
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 6, 6, 0]} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Ranking */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Priority Ranking</h4>
        <div className="space-y-3">
          {priorityRanking.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-56 flex-shrink-0">{p.name}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.score}%` }} />
              </div>
              <span className="text-sm font-medium w-10 text-right">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Roadmap</h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
          <div className="space-y-4">
            {roadmap.map((r, i) => (
              <div key={i} className="flex items-start gap-4 pl-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
                <div className="glass-card rounded-xl p-4 flex-1">
                  <p className="text-sm font-semibold text-primary mb-1">{r.timeline}</p>
                  <p className="text-sm text-muted-foreground">{r.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before vs After Comparison */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Before vs After Comparison</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={combinedScores} barGap={4}>
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="current" name="Current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={36} />
            <Bar dataKey="projected" name="Projected" fill="hsl(199, 89%, 76%)" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Analysis */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Scenario Analysis</h4>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Increase SIP by</p>
              <span className="text-sm font-medium text-primary">₹{sipIncrease.toLocaleString()}</span>
            </div>
            <input type="range" min={0} max={50000} step={1000} value={sipIncrease} onChange={(e) => setSipIncrease(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Alternative Retirement Age</p>
              <span className="text-sm font-medium text-primary">{altRetireAge}</span>
            </div>
            <input type="range" min={40} max={70} value={altRetireAge} onChange={(e) => setAltRetireAge(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Base Gap</p>
            <p className="text-lg font-bold mt-1">₹{(baseGap / 10000000).toFixed(1)}Cr</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Scenario Gap</p>
            <p className="text-lg font-bold mt-1">₹{(scenarioGap / 10000000).toFixed(1)}Cr</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Scenario SIP</p>
            <p className="text-lg font-bold mt-1">₹{Math.round(scenarioSip).toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-xl p-4 bg-accent/10 border-l-3 border-l-accent">
          <p className="text-sm text-accent">
            This scenario does not materially improve the retirement outlook. Suggested SIP changes from ₹73,197 to ₹{Math.round(scenarioSip).toLocaleString()}.
          </p>
        </div>
      </div>
    </div>
  );
}
