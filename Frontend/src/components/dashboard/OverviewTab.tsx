import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import ScoreRing from "./ScoreRing";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";

const dimensions = [
  { name: "Emergency", fullName: "Emergency Preparedness", score: 35, ideal: 80 },
  { name: "Insurance", fullName: "Insurance Coverage", score: 20, ideal: 80 },
  { name: "Diversification", fullName: "Investment Diversification", score: 75, ideal: 90 },
  { name: "Debt", fullName: "Debt Health", score: 90, ideal: 80 },
  { name: "Tax", fullName: "Tax Efficiency", score: 35, ideal: 80 },
  { name: "Retirement", fullName: "Retirement Readiness", score: 15, ideal: 80 },
];

const radarData = dimensions.map(d => ({ subject: d.name, score: d.score, ideal: d.ideal }));
const barData = dimensions.map(d => ({ name: d.name, current: d.score, ideal: d.ideal }));

const recommendations = [
  "Build an emergency fund of at least 3 months of expenses.",
  "Set up an auto-transfer each month to grow your emergency corpus toward 6 months.",
  "Review your health and term insurance coverage to protect your family and goals.",
  "Use tax-saving instruments like EPF, PPF, ELSS, or NPS more efficiently.",
  "Increase your monthly SIP toward approximately Rs. 73,196 for retirement readiness.",
];

const recColors = [
  "hsl(var(--finance-green))",
  "hsl(var(--finance-blue))",
  "hsl(var(--finance-orange))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
];

function getScoreColor(score: number) {
  if (score >= 70) return "text-accent";
  if (score >= 40) return "text-[hsl(var(--finance-orange))]";
  return "text-[hsl(var(--finance-red))]";
}

export default function OverviewTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top: Score + AI Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-3">Overall Money Health Score</p>
          <ScoreRing score={43} />
        </div>

        <div className="glass-card rounded-2xl p-6 col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">AI Assessment</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your overall financial health is <span className="text-[hsl(var(--finance-orange))] font-medium">fair with a score of 43</span>.
            The most important next steps are: Build an emergency fund of at least 3 months of expenses.
            Set up an auto-transfer each month to grow your emergency corpus toward 6 months.
          </p>
        </div>
      </div>

      {/* 6 Dimension Scores */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">6 Dimension Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dimensions.map((d) => (
            <div key={d.name} className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{d.fullName}</p>
              <p className={`text-2xl font-bold ${getScoreColor(d.score)}`}>{d.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Radar + Bar side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Score Radar</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Your Score" dataKey="score" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Ideal" dataKey="ideal" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.08} strokeWidth={1} strokeDasharray="4 4" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Current vs Ideal Score</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="current" name="Current Score" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="ideal" name="Ideal Score" fill="hsl(217, 91%, 60%)" fillOpacity={0.3} radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Improvement Recommendations */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Key Improvement Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: `${recColors[i % recColors.length]}10`, borderLeft: `3px solid ${recColors[i % recColors.length]}` }}
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: recColors[i % recColors.length] }} />
              <p className="text-sm" style={{ color: recColors[i % recColors.length] }}>
                {i + 1}. {rec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
