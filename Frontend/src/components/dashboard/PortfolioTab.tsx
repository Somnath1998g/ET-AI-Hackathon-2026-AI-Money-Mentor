import { useState, useRef } from "react";
import { Upload, Play, Sparkles, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

const allocationByCategory = [
  { name: "Large Cap", value: 145000, color: "hsl(217, 91%, 60%)" },
  { name: "Flexi Cap", value: 130000, color: "hsl(160, 84%, 39%)" },
  { name: "Debt", value: 86000, color: "hsl(25, 95%, 53%)" },
];


const fundWise = [
  { name: "Axis Bluechip Fund", invested: 120000, current: 145000 },
  { name: "HDFC Short Term...", invested: 80000, current: 86000 },
  { name: "Parag Parikh Flexi...", invested: 100000, current: 130000 },
];

const overlapData = [
  { fund1: "Axis Bluechip Fund", fund2: "Parag Parikh Flexi Cap", overlap: 35 },
  { fund1: "Axis Bluechip Fund", fund2: "HDFC Short Term Debt Fund", overlap: 10 },
  { fund1: "Parag Parikh Flexi Cap", fund2: "HDFC Short Term Debt Fund", overlap: 10 },
];

const benchmarkReturn = [
  { name: "Current", portfolio_value: 361000, benchmark_value: 336000 },
  { name: "Start", portfolio_value: 300000, benchmark_value: 300000 },
];

const riskFlags = [
  "High concentration in 2 equity funds (76% of portfolio)",
  "35% overlap between Axis Bluechip and Parag Parikh Flexi Cap",
  "Expense ratio 1.37% is above optimal range",
  "Underperforming benchmark by 3.36%",
];

export default function PortfolioTab() {
  const [hasData, setHasData] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setHasData(true); }
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2">Portfolio X-Ray</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          Upload your CAMS / KFintech statement or use demo data for AI-powered analysis.
        </p>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx,.xls,.pdf,.json" className="hidden" />
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Browse Files
          </Button>
          <Button onClick={() => setHasData(true)} className="bg-primary text-primary-foreground gap-2">
            <Play className="w-4 h-4" /> Run Demo Portfolio X-Ray
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx,.xls,.pdf,.json" className="hidden" />
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 text-sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4" /> {fileName || "Upload Statement"}
        </Button>
        <Button variant="outline" onClick={() => setHasData(true)} className="gap-2 text-sm">
          <Play className="w-4 h-4" /> Using Demo Data
        </Button>
      </div>

      {/* Key Portfolio Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: "₹3,00,000" },
          { label: "Current Value", value: "₹3,61,000" },
          { label: "Gain / Loss", value: "₹61,000", highlight: true },
          { label: "True XIRR", value: "8.64%" },
        ].map((m) => (
          <div key={m.label} className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className={`text-lg font-bold mt-1 ${m.highlight ? "text-accent" : ""}`}>{m.value}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Weighted Expense Ratio</p>
          <p className="text-lg font-bold mt-1">1.37%</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Expense Ratio Drag</p>
          <p className="text-lg font-bold mt-1 text-[hsl(var(--finance-red))]">₹4,946</p>
        </div>
      </div>

      {/* AI-Generated Rebalancing Plan */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-base font-semibold">AI-Generated Rebalancing Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Your portfolio has a total value of ₹3,61,000, with a gain of ₹61,000 (20.33% return). The current XIRR is 8.64%, which is lower than the benchmark return of 12%. As a conservative investor, your portfolio is underperforming the benchmark.
        </p>
        <div className="space-y-3">
          {[
            { title: "Concentration", desc: "Portfolio is heavily concentrated in two equity funds: Axis Bluechip Fund (40.17%) and Parag Parikh Flexi Cap (36.01%)." },
            { title: "Overlap", desc: "35% significant overlap between Axis Bluechip and Parag Parikh Flexi Cap — reducing diversification benefit." },
            { title: "Cost", desc: "Weighted expense ratio is 1.37%, resulting in an expense drag of ₹4,946 annually." },
            { title: "Underperformance", desc: "Portfolio has underperformed the benchmark (Nifty 50), indicating suboptimal allocation for your risk preference." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 text-sm">
              <span className="text-primary font-semibold flex-shrink-0">{item.title}:</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation by Category + Asset Allocation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Portfolio Allocation by Category</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={allocationByCategory} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {allocationByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {allocationByCategory.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium ml-auto">₹{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Expense Ratio Drag by Fund</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: "Axis Bluechip Fund", drag: 2100 },
              { name: "HDFC Short Term...", drag: 650 },
              { name: "Parag Parikh Flexi...", drag: 1950 },
            ]} barSize={50}>
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toLocaleString()}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Drag"]} />
              <Bar dataKey="drag" name="Expense Drag (₹)" fill="hsl(199, 89%, 76%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fund-wise Investment vs Current Value */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Fund-wise Investment vs Current Value</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={fundWise} barGap={4}>
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="invested" name="Invested" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="current" name="Current Value" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overlap Analysis */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Overlap Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Fund 1</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Fund 2</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Overlap %</th>
              </tr>
            </thead>
            <tbody>
              {overlapData.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 px-3">{row.fund1}</td>
                  <td className="py-2 px-3">{row.fund2}</td>
                  <td className={`py-2 px-3 text-right font-medium ${row.overlap > 20 ? "text-[hsl(var(--finance-red))]" : ""}`}>{row.overlap}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Return vs Benchmark */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Portfolio Return vs Benchmark</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={benchmarkReturn}>
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="benchmark_value" name="Benchmark (Nifty 50)" stroke="hsl(217, 91%, 60%)" strokeWidth={2} />
            <Line type="monotone" dataKey="portfolio_value" name="Portfolio" stroke="hsl(160, 84%, 39%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Benchmark Comparison */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Benchmark Comparison</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Portfolio XIRR</p>
            <p className="text-lg font-bold mt-1">8.64%</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Benchmark Return</p>
            <p className="text-lg font-bold mt-1">12%</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Alpha</p>
            <p className="text-lg font-bold mt-1 text-[hsl(var(--finance-red))]">-3.36</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-lg font-bold mt-1 text-[hsl(var(--finance-red))]">Underperformed</p>
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--finance-orange))]" />
          <h3 className="font-heading text-base font-semibold">Risk Flags</h3>
        </div>
        <div className="space-y-2">
          {riskFlags.map((flag, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-3 bg-[hsl(var(--finance-orange)/.08)] border-l-3 border-l-[hsl(var(--finance-orange))]">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--finance-orange))]" />
              <p className="text-sm text-[hsl(var(--finance-orange))]">{flag}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
