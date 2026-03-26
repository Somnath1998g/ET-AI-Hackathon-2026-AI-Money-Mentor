import { CheckCircle2, Circle, Lock, AlertTriangle, Sparkles } from "lucide-react";
import ScoreRing from "./ScoreRing";

const pillars = [
  { name: "Emergency", status: "done" },
  { name: "Insurance", status: "done" },
  { name: "Investment", status: "active" },
  { name: "Debt", status: "locked" },
  { name: "Tax", status: "locked" },
  { name: "Retirement", status: "locked" },
] as const;

export default function OverviewTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center col-span-1">
          <p className="text-sm text-muted-foreground mb-3">Money Health Score</p>
          <div className="relative">
            <ScoreRing score={68} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 col-span-2">
          <p className="text-sm text-muted-foreground mb-4">Health Pillars</p>
          <div className="flex flex-wrap gap-4">
            {pillars.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  p.status === "done" ? "bg-accent/15" :
                  p.status === "active" ? "bg-primary/15 animate-pulse-glow" :
                  "bg-secondary"
                }`}>
                  {p.status === "done" && <CheckCircle2 className="w-5 h-5 text-accent" />}
                  {p.status === "active" && <Circle className="w-5 h-5 text-primary" />}
                  {p.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">AI Summary</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You are <span className="text-[hsl(var(--finance-orange))] font-medium">moderately prepared</span> financially. 
          Your emergency fund and insurance are in good shape, but you need to improve your investment diversification 
          and start planning actively for retirement.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 border-l-4 border-l-[hsl(var(--finance-orange))]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[hsl(var(--finance-orange))]" />
          <p className="font-medium text-sm">Biggest Issue: Low savings rate</p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          You're saving only 15% of your income. Aim for at least 30% to build long-term wealth.
        </p>
      </div>
    </div>
  );
}
