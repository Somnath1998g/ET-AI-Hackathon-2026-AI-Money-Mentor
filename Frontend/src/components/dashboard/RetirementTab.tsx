import { Shield, Target, Banknote } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// Month-by-month wealth growth
function generateWealthGrowth() {
  const data = [];
  let wealth = 250000;
  for (let m = 0; m <= 24; m++) {
    data.push({ month: m, wealth: Math.round(wealth) });
    wealth = wealth * 1.008 + 5000;
  }
  return data;
}

const wealthData = generateWealthGrowth();

// SIP amount per goal
const sipGoals = [
  { name: "Emergency\nFund", sip: 800 },
  { name: "Retirement\nCorpus", sip: 900 },
  { name: "Insurance\nGap", sip: 2200 },
  { name: "Tax\nOptimization", sip: 500 },
];

// Asset allocation shift over time
function generateAllocationShift() {
  const data = [];
  for (let age = 30; age <= 50; age++) {
    data.push({
      age,
      Equity: 80 - (age - 30) * 1.2,
      Debt: 10 + (age - 30) * 0.8,
      Gold: 5 + (age - 30) * 0.3,
      Cash: 5 + (age - 30) * 0.1,
    });
  }
  return data;
}

const allocationData = generateAllocationShift();

export default function RetirementTab() {

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Planning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--finance-red)/.12)] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-[hsl(var(--finance-red))]" />
          </div>
          <p className="text-xs text-muted-foreground">Emergency Fund Target</p>
          <p className="text-xl font-bold mt-1">₹3,60,000</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Target Corpus</p>
          <p className="text-xl font-bold mt-1">₹5,77,28,438</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/12 flex items-center justify-center mx-auto mb-3">
            <Banknote className="w-5 h-5 text-accent" />
          </div>
          <p className="text-xs text-muted-foreground">Suggested Monthly SIP</p>
          <p className="text-xl font-bold mt-1">₹73,197</p>
        </div>
      </div>

      {/* Insurance Gap Analysis */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Insurance Gap Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Recommended Health Cover</span><span className="font-medium">₹10,00,000</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current Health Cover</span><span className="font-medium">₹3,00,000</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Health Gap</span><span className="font-medium text-[hsl(var(--finance-red))]">₹7,00,000</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Recommended Term Cover</span><span className="font-medium">₹1,20,00,000</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current Term Cover</span><span className="font-medium">₹0</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Term Gap</span><span className="font-medium text-[hsl(var(--finance-red))]">₹1,20,00,000</span></div>
          </div>
        </div>
      </div>

      {/* Tax-Saving Suggestions */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-3">Tax-Saving Suggestions</h3>
        <div className="space-y-3">
          <div className="rounded-xl p-4 bg-accent/10 border-l-3 border-l-accent">
            <p className="text-sm text-accent">Increase 80C usage through EPF, PPF, or ELSS up to Rs. 1.5 lakh.</p>
          </div>
          <div className="rounded-xl p-4 bg-accent/10 border-l-3 border-l-accent">
            <p className="text-sm text-accent">Consider additional NPS contribution for extra tax benefit under 80CCD(1B).</p>
          </div>
        </div>
      </div>

      {/* Month-by-Month Wealth Growth */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Month-by-Month Wealth Growth</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={wealthData}>
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Wealth"]} />
            <Line type="monotone" dataKey="wealth" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SIP Amount Per Goal */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">SIP Amount Per Goal</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sipGoals} barSize={40}>
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Bar dataKey="sip" name="SIP (₹)" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} fillOpacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Asset Allocation Shift Over Time */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Asset Allocation Shift Over Time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={allocationData}>
            <XAxis dataKey="age" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Equity" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Debt" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Gold" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Cash" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Toward FIRE Target */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-3">Progress Toward FIRE Target</h3>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: "0.43%" }} />
        </div>
        <p className="text-sm text-muted-foreground">
          Current Corpus: <span className="font-medium">₹2,50,000</span> | Target Corpus: <span className="font-medium">₹5,77,28,438</span> | Progress: <span className="font-medium text-primary">0.43%</span>
        </p>
      </div>

      {/* Recommended Asset Allocation */}
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
              {[
                { idx: 0, asset: "Equity", value: 65 },
                { idx: 1, asset: "Debt", value: 25 },
                { idx: 2, asset: "Gold", value: 5 },
                { idx: 3, asset: "Cash", value: 5 },
              ].map((row) => (
                <tr key={row.idx} className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">{row.idx}</td>
                  <td className="py-2 px-3">{row.asset}</td>
                  <td className="py-2 px-3 text-right font-medium">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={[
            { name: "Cash", value: 5 },
            { name: "Debt", value: 25 },
            { name: "Equity", value: 65 },
            { name: "Gold", value: 5 },
          ]} barSize={60}>
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Bar dataKey="value" name="Allocation %" fill="hsl(199, 89%, 76%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
