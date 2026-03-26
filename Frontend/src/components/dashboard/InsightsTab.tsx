import { PiggyBank, Shield, CreditCard, Sparkles } from "lucide-react";

const insights = [
  {
    icon: PiggyBank,
    title: "Increase Your Savings Rate",
    description: "You're saving 15% of income. Boost to 30% by cutting discretionary spending by ₹12,000/month. This could add ₹50L+ to your retirement corpus.",
    priority: "High",
    color: "finance-orange",
  },
  {
    icon: Shield,
    title: "Build an Emergency Fund",
    description: "You have 2 months of expenses saved. Aim for 6 months (₹2.4L). Set up an auto-transfer of ₹8,000/month to a liquid fund.",
    priority: "High",
    color: "finance-red",
  },
  {
    icon: CreditCard,
    title: "Reduce High-Interest Debt",
    description: "Your credit card debt costs 36% p.a. Prioritize clearing it before increasing investments. Consider a balance transfer at lower rates.",
    priority: "Medium",
    color: "finance-blue",
  },
];

export default function InsightsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-base font-semibold">AI Recommendations</h3>
      </div>

      {insights.map((item) => (
        <div key={item.title} className="glass-card rounded-2xl p-5 hover:bg-secondary/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl bg-[hsl(var(--${item.color})/0.15)] flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-5 h-5 text-[hsl(var(--${item.color}))]`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{item.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.priority === "High" 
                    ? "bg-[hsl(var(--finance-red)/0.15)] text-[hsl(var(--finance-red))]" 
                    : "bg-primary/15 text-primary"
                }`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
