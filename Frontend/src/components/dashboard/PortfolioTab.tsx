import { useState, useRef } from "react";
import { Upload, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const allocationData = [
  { name: "Equity", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Debt", value: 25, color: "hsl(160, 84%, 39%)" },
  { name: "Gold", value: 15, color: "hsl(25, 95%, 53%)" },
  { name: "Cash", value: 15, color: "hsl(262, 83%, 58%)" },
];

const performanceData = [
  { name: "Large Cap", returns: 14.2 },
  { name: "Mid Cap", returns: 18.5 },
  { name: "Small Cap", returns: 22.1 },
  { name: "Debt", returns: 7.3 },
  { name: "Gold", returns: 11.8 },
];

export default function PortfolioTab() {
  const [hasData, setHasData] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setHasData(true);
    }
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2">No portfolio data yet</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          Upload your portfolio or use demo data to see AI-powered analysis.
        </p>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx,.xls,.pdf,.json" className="hidden" />
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Upload Portfolio
          </Button>
          <Button onClick={() => setHasData(true)} className="bg-primary text-primary-foreground gap-2">
            <Play className="w-4 h-4" /> Use Demo Data
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
          <Upload className="w-4 h-4" /> {fileName || "Upload Portfolio"}
        </Button>
        <Button variant="outline" onClick={() => setHasData(true)} className="gap-2 text-sm">
          <Play className="w-4 h-4" /> Using Demo Data
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Asset Allocation</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {allocationData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Fund Performance (1Y Returns)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={performanceData} barSize={24}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="returns" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Avg. Expense Ratio</p>
          <span className="text-sm font-medium text-accent">0.45%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: "22%" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Below industry average of 1.5%</p>
      </div>

      <div className="glass-card rounded-2xl p-5 border-l-4 border-l-[hsl(var(--finance-orange))]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">AI Insight</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Your portfolio is <span className="text-[hsl(var(--finance-orange))] font-medium">not well diversified</span> — 45% is concentrated in equity. Consider adding international funds and REITs for better risk-adjusted returns.
        </p>
      </div>
    </div>
  );
}



// import { useState } from "react";
// import { Upload, Play, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const allocationData = [
//   { name: "Equity", value: 45, color: "hsl(217, 91%, 60%)" },
//   { name: "Debt", value: 25, color: "hsl(160, 84%, 39%)" },
//   { name: "Gold", value: 15, color: "hsl(25, 95%, 53%)" },
//   { name: "Cash", value: 15, color: "hsl(262, 83%, 58%)" },
// ];

// const performanceData = [
//   { name: "Large Cap", returns: 14.2 },
//   { name: "Mid Cap", returns: 18.5 },
//   { name: "Small Cap", returns: 22.1 },
//   { name: "Debt", returns: 7.3 },
//   { name: "Gold", returns: 11.8 },
// ];

// export default function PortfolioTab() {
//   const [hasData, setHasData] = useState(false);

//   if (!hasData) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
//         <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
//           <Upload className="w-8 h-8 text-muted-foreground" />
//         </div>
//         <h3 className="font-heading text-lg font-semibold mb-2">No portfolio data yet</h3>
//         <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
//           Upload your portfolio or use demo data to see AI-powered analysis.
//         </p>
//         <div className="flex gap-3">
//           <Button variant="outline" className="gap-2">
//             <Upload className="w-4 h-4" /> Upload Portfolio
//           </Button>
//           <Button onClick={() => setHasData(true)} className="bg-primary text-primary-foreground gap-2">
//             <Play className="w-4 h-4" /> Use Demo Data
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex gap-3">
//         <Button variant="outline" className="gap-2 text-sm">
//           <Upload className="w-4 h-4" /> Upload Portfolio
//         </Button>
//         <Button variant="outline" onClick={() => setHasData(true)} className="gap-2 text-sm">
//           <Play className="w-4 h-4" /> Using Demo Data
//         </Button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-4">
//         <div className="glass-card rounded-2xl p-6">
//           <p className="text-sm text-muted-foreground mb-4">Asset Allocation</p>
//           <div className="flex items-center gap-6">
//             <ResponsiveContainer width={160} height={160}>
//               <PieChart>
//                 <Pie data={allocationData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
//                   {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="space-y-2">
//               {allocationData.map((d) => (
//                 <div key={d.name} className="flex items-center gap-2 text-sm">
//                   <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
//                   <span className="text-muted-foreground">{d.name}</span>
//                   <span className="font-medium ml-auto">{d.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="glass-card rounded-2xl p-6">
//           <p className="text-sm text-muted-foreground mb-4">Fund Performance (1Y Returns)</p>
//           <ResponsiveContainer width="100%" height={180}>
//             <BarChart data={performanceData} barSize={24}>
//               <XAxis dataKey="name" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
//               <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
//               <Bar dataKey="returns" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="glass-card rounded-2xl p-5">
//         <div className="flex items-center justify-between mb-2">
//           <p className="text-sm text-muted-foreground">Avg. Expense Ratio</p>
//           <span className="text-sm font-medium text-accent">0.45%</span>
//         </div>
//         <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
//           <div className="h-full bg-accent rounded-full" style={{ width: "22%" }} />
//         </div>
//         <p className="text-xs text-muted-foreground mt-1">Below industry average of 1.5%</p>
//       </div>

//       <div className="glass-card rounded-2xl p-5 border-l-4 border-l-[hsl(var(--finance-orange))]">
//         <div className="flex items-center gap-2 mb-1">
//           <Sparkles className="w-4 h-4 text-primary" />
//           <p className="text-sm font-medium">AI Insight</p>
//         </div>
//         <p className="text-sm text-muted-foreground">
//           Your portfolio is <span className="text-[hsl(var(--finance-orange))] font-medium">not well diversified</span> — 45% is concentrated in equity. Consider adding international funds and REITs for better risk-adjusted returns.
//         </p>
//       </div>
//     </div>
//   );
// }
