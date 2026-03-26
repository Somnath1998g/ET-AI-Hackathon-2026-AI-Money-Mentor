import { useState } from "react";
import { Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function generateProjection(sip: number, retireAge: number) {
  const data = [];
  const currentAge = 30;
  let currentWealth = 500000;
  let improvedWealth = 500000;
  for (let age = currentAge; age <= 70; age++) {
    data.push({ age, current: Math.round(currentWealth / 100000), improved: Math.round(improvedWealth / 100000) });
    currentWealth *= 1.1;
    currentWealth += sip * 12;
    improvedWealth *= 1.12;
    improvedWealth += (sip + 5000) * 12;
  }
  return data;
}

export default function RetirementTab() {
  const [sip, setSip] = useState(10000);
  const [retireAge, setRetireAge] = useState(55);
  const data = generateProjection(sip, retireAge);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Wealth Projection (₹ Lakhs)</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <XAxis dataKey="age" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="current" name="Current Plan" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="improved" name="Improved Plan" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={false} strokeDasharray="6 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Monthly SIP</p>
            <span className="text-sm font-medium text-primary">₹{sip.toLocaleString()}</span>
          </div>
          <input
            type="range" min={1000} max={100000} step={1000} value={sip}
            onChange={(e) => setSip(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Retirement Age</p>
            <span className="text-sm font-medium text-primary">{retireAge}</span>
          </div>
          <input
            type="range" min={40} max={70} value={retireAge}
            onChange={(e) => setRetireAge(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 border-l-4 border-l-accent">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">AI Insight</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Increase your SIP by <span className="text-accent font-medium">₹5,000/month</span> to potentially retire 3 years earlier with 40% more corpus.
        </p>
      </div>
    </div>
  );
}
