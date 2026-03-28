import { useEffect, useMemo, useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import {
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
import { fetchScenarioAnalysis } from "@/services/api";
import { useUserData } from "@/hooks/useUserData";

function formatCurrency(value: number | undefined) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function InsightsTab() {
  const { user } = useAuth();
  const userData = useUserData(user?.email);
  const data = userData?.mentorSummaryResult?.data;
  const profilePayload = userData?.profilePayload;

    const profilePayloadKey = useMemo(
    () => JSON.stringify(profilePayload || {}),
    [profilePayload]
  );

  const mentorSummary = data?.mentor_summary ?? "No mentor summary available.";
  const strengths = data?.strengths_and_risks?.strengths ?? [];
  const risks = data?.strengths_and_risks?.risks ?? [];
  const priorityActions = data?.strengths_and_risks?.priority_actions ?? [];
  const actionItems = data?.personalized_action_plan ?? [];
  const combinedScoresRaw = data?.combined_scores ?? {};
  const beforeAfter = data?.before_after_projection ?? [];
  const roadmap = data?.roadmap ?? [];

  const combinedScores = Object.entries(combinedScoresRaw).map(([name, current]) => ({
    name,
    current: Number(current),
    projected:
      beforeAfter.find((item: any) => item.metric === name)?.projected ?? Number(current),
  }));

  const [sipIncrease, setSipIncrease] = useState(5000);
  const [altRetireAge, setAltRetireAge] = useState(
    profilePayload?.retirement_age_goal || 55
  );
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

 useEffect(() => {
  const runScenario = async () => {
    if (!profilePayload) return;

    try {
      setScenarioLoading(true);
      const result = await fetchScenarioAnalysis(
        profilePayload,
        sipIncrease,
        altRetireAge
      );
      setScenarioData(result?.data);
    } catch (error) {
      console.error("Scenario analysis failed", error);
    } finally {
      setScenarioLoading(false);
    }
  };

  runScenario();
}, [sipIncrease, altRetireAge, profilePayloadKey]);
  const baseGap = scenarioData?.base_projection?.gap ?? 0;
  const scenarioGap = scenarioData?.scenario_projection?.gap ?? 0;
  const scenarioSip = scenarioData?.scenario_projection?.recommended_monthly_sip ?? 0;
  const scenarioSummary = scenarioData?.scenario_summary ?? "Scenario analysis not available.";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold">AI Mentor Summary</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-heading text-base font-semibold mb-3">Personalized Action Plan</h4>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              <span className="text-primary font-semibold">Short Mentor-Style Summary:</span>{" "}
              {mentorSummary}
            </p>

            <div>
              <p className="font-medium text-foreground mb-2">Top Actions:</p>
              <ol className="list-decimal list-inside space-y-1.5">
                {actionItems.slice(0, 3).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h4 className="font-heading text-sm font-semibold mb-3">Key Strengths</h4>
            <div className="space-y-2">
              {strengths.map((s: string, i: number) => (
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
              {risks.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3 bg-[hsl(var(--finance-red)/.08)] border-l-3 border-l-[hsl(var(--finance-red))]">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--finance-red))]" />
                  <p className="text-sm text-[hsl(var(--finance-red))]">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h4 className="font-heading text-base font-semibold">What to Do in the Next 30 Days</h4>
        </div>
        <div className="space-y-3">
          {roadmap.map((item: any, idx: number) => (
            <div key={idx} className="glass-card rounded-xl p-4">
              <p className="text-sm font-semibold text-primary mb-1">{item.timeline}</p>
              <p className="text-sm text-muted-foreground">{item.action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-3">Priority Action Items</h4>
        <div className="space-y-2">
          {actionItems.map((item: string, i: number) => (
            <div key={i} className="rounded-xl p-3 bg-accent/10 border-l-3 border-l-accent">
              <p className="text-sm text-accent">
                {i + 1}. {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Combined Score Dashboard</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={combinedScores}>
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="current" name="Current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar dataKey="projected" name="Projected" fill="hsl(217, 91%, 60%)" fillOpacity={0.5} radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Strengths vs Risks vs Priority Areas</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[
                { name: "Strengths", count: strengths.length },
                { name: "Risks", count: risks.length },
                { name: "Priority Areas", count: priorityActions.length },
              ]}
              layout="vertical"
              barSize={28}
            >
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 6, 6, 0]} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Priority Ranking</h4>
        <div className="space-y-3">
          {priorityActions.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-56 flex-shrink-0">{item[0]}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item[1]}%` }} />
              </div>
              <span className="text-sm font-medium w-10 text-right">{item[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Roadmap</h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
          <div className="space-y-4">
            {roadmap.map((r: any, i: number) => (
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

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Before vs After Comparison</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={beforeAfter} barGap={4}>
            <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="current" name="Current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={36} />
            <Bar dataKey="projected" name="Projected" fill="hsl(199, 89%, 76%)" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-base font-semibold mb-4">Scenario Analysis</h4>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Increase SIP by</p>
              <span className="text-sm font-medium text-primary">₹{sipIncrease.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={sipIncrease}
              onChange={(e) => setSipIncrease(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Alternative Retirement Age</p>
              <span className="text-sm font-medium text-primary">{altRetireAge}</span>
            </div>
            <input
              type="range"
              min={Math.max((profilePayload?.age || 25) + 1, 40)}
              max={70}
              value={altRetireAge}
              onChange={(e) => setAltRetireAge(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Base Gap</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(baseGap)}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Scenario Gap</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(scenarioGap)}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Scenario SIP</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(scenarioSip)}</p>
          </div>
        </div>

        <div className="rounded-xl p-4 bg-accent/10 border-l-3 border-l-accent">
          <p className="text-sm text-accent">
            {scenarioLoading ? "Updating scenario..." : scenarioSummary}
          </p>
        </div>
      </div>
    </div>
  );
}