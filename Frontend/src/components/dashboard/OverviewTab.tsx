import { Sparkles, CheckCircle2 } from "lucide-react";
import ScoreRing from "./ScoreRing";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData } from "@/utils/userStorage";
import { useUserData } from "@/hooks/useUserData";

function getScoreColor(score: number) {
  if (score >= 70) return "text-accent";
  if (score >= 40) return "text-[hsl(var(--finance-orange))]";
  return "text-[hsl(var(--finance-red))]";
}

function formatDimensionName(key: string) {
  const map: Record<string, string> = {
    emergency_preparedness: "Emergency Preparedness",
    insurance_coverage: "Insurance Coverage",
    investment_diversification: "Investment Diversification",
    debt_health: "Debt Health",
    tax_efficiency: "Tax Efficiency",
    retirement_readiness: "Retirement Readiness",
  };
  return map[key] || key;
}

function shortDimensionName(key: string) {
  const map: Record<string, string> = {
    emergency_preparedness: "Emergency",
    insurance_coverage: "Insurance",
    investment_diversification: "Diversification",
    debt_health: "Debt",
    tax_efficiency: "Tax",
    retirement_readiness: "Retirement",
  };
  return map[key] || key;
}

function getIdealScore(key: string) {
  const idealMap: Record<string, number> = {
    emergency_preparedness: 80,
    insurance_coverage: 80,
    investment_diversification: 90,
    debt_health: 80,
    tax_efficiency: 80,
    retirement_readiness: 80,
  };
  return idealMap[key] || 80;
}

export default function OverviewTab() {
  const { user } = useAuth();
  const userData = useUserData(user?.email);
  const data = userData?.moneyHealthResult?.data;

  const overallScore = data?.overall_score ?? 0;
  const overallSummary = data?.overall_summary ?? "No assessment available.";
  const dimensionScores = data?.dimension_scores ?? {};
  const recommendations = data?.top_recommendations ?? [];

  const dimensions = Object.entries(dimensionScores).map(([key, value]) => ({
    key,
    name: shortDimensionName(key),
    fullName: formatDimensionName(key),
    score: Number(value),
    ideal: getIdealScore(key),
  }));

  const radarData = dimensions.map((d) => ({
    subject: d.name,
    score: d.score,
    ideal: d.ideal,
  }));

  const barData = dimensions.map((d) => ({
    name: d.name,
    current: d.score,
    ideal: d.ideal,
  }));

  const recColors = [
    "hsl(var(--finance-green))",
    "hsl(var(--finance-blue))",
    "hsl(var(--finance-orange))",
    "hsl(var(--accent))",
    "hsl(var(--primary))",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-3">Overall Money Health Score</p>
          <ScoreRing score={overallScore} />
        </div>

        <div className="glass-card rounded-2xl p-6 col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">AI Assessment</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {overallSummary}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">6 Dimension Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dimensions.map((d) => (
            <div key={d.key} className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{d.fullName}</p>
              <p className={`text-2xl font-bold ${getScoreColor(d.score)}`}>{d.score}</p>
            </div>
          ))}
        </div>
      </div>

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
              <Bar dataKey="current" name="Current Score" fill="hsl(217, 64%, 53%)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="ideal" name="Ideal Score" fill="hsl(164, 82%, 54%)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Key Improvement Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                background: `${recColors[i % recColors.length]}10`,
                borderLeft: `3px solid ${recColors[i % recColors.length]}`,
              }}
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