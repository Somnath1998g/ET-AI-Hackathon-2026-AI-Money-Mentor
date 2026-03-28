import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Table2,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { postPortfolioXray, uploadPortfolioXrayPdf } from "@/lib/api";

type RiskPreference = "conservative" | "moderate" | "aggressive";
type EntryMode = "choice" | "pdf" | "manual";

type ManualHoldingRow = {
  scheme_name: string;
  asset_class: string;
  category: string;
  invested_amount: number | "";
  current_value: number | "";
  expense_ratio: number | "";
};

type PortfolioApiData = {
  holdings: Array<{
    scheme_name: string;
    asset_class: string;
    category?: string;
    invested_amount: number;
    current_value: number;
    expense_ratio: number;
    transactions: Array<{ date: string; amount: number }>;
  }>;
  totals: {
    total_invested: number;
    total_current_value: number;
    gain_loss: number;
    absolute_return_pct: number;
  };
  portfolio_xirr: number;
  weighted_expense_ratio: number;
  expense_drag: number;
  concentration: Array<{
    scheme_name: string;
    weight_pct: number;
  }>;
  overlap: Array<{
    fund_1: string;
    fund_2: string;
    overlap_pct: number;
  }>;
  benchmark_comparison: {
    portfolio_xirr: number;
    benchmark_return: number;
    alpha: number;
    status: string;
  };
  risk_flags: string[];
  ai_rebalancing_plan: string;
  category_allocation: Array<{
    category: string;
    value: number;
  }>;
  expense_drag_by_fund: Array<{
    scheme_name: string;
    expense_drag: number;
  }>;
  portfolio_vs_benchmark: Array<{
    period: string;
    portfolio_value: number;
    benchmark_value: number;
  }>;
};

const STORAGE_KEY = "portfolio_xray_state";

function formatCurrency(value?: number) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function getAlphaColor(alpha: number) {
  return alpha >= 0 ? "text-accent" : "text-[hsl(var(--finance-red))]";
}

const pieColors = [
  "hsl(217, 91%, 60%)",
  "hsl(160, 84%, 39%)",
  "hsl(25, 95%, 53%)",
  "hsl(280, 80%, 60%)",
  "hsl(340, 82%, 52%)",
  "hsl(190, 90%, 45%)",
];

const emptyHoldingRow = (): ManualHoldingRow => ({
  scheme_name: "",
  asset_class: "Equity",
  category: "",
  invested_amount: "",
  current_value: "",
  expense_ratio: "",
});

export default function PortfolioTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<EntryMode>("choice");
  const [hasData, setHasData] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [benchmarkReturn, setBenchmarkReturn] = useState(12);
  const [riskPreference, setRiskPreference] = useState<RiskPreference>("moderate");
  const [portfolioData, setPortfolioData] = useState<PortfolioApiData | null>(null);
  const [manualRows, setManualRows] = useState<ManualHoldingRow[]>([emptyHoldingRow()]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setMode(parsed.mode ?? "choice");
      setHasData(parsed.hasData ?? false);
      setFileName(parsed.fileName ?? "");
      setBenchmarkReturn(parsed.benchmarkReturn ?? 12);
      setRiskPreference(parsed.riskPreference ?? "moderate");
      setPortfolioData(parsed.portfolioData ?? null);
      setManualRows(parsed.manualRows?.length ? parsed.manualRows : [emptyHoldingRow()]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        hasData,
        fileName,
        benchmarkReturn,
        riskPreference,
        portfolioData,
        manualRows,
      })
    );
  }, [mode, hasData, fileName, benchmarkReturn, riskPreference, portfolioData, manualRows]);

  const resetAll = () => {
    setMode("choice");
    setHasData(false);
    setPortfolioData(null);
    setError("");
    setFileName("");
    setManualRows([emptyHoldingRow()]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addManualRow = () => {
    setManualRows((prev) => [...prev, emptyHoldingRow()]);
  };

  const removeManualRow = (index: number) => {
    setManualRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateManualRow = (
    index: number,
    field: keyof ManualHoldingRow,
    value: string
  ) => {
    setManualRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]:
                field === "invested_amount" ||
                field === "current_value" ||
                field === "expense_ratio"
                  ? value === ""
                    ? ""
                    : Number(value)
                  : value,
            }
          : row
      )
    );
  };

  const handleManualSubmit = async () => {
    try {
      setError("");

      const validRows = manualRows.filter(
        (row) =>
          row.scheme_name.trim() &&
          row.asset_class.trim() &&
          Number(row.invested_amount) > 0 &&
          Number(row.current_value) >= 0 &&
          Number(row.expense_ratio) >= 0
      );

      if (validRows.length === 0) {
        setError("Please add at least one valid holding.");
        return;
      }

      setIsLoading(true);

      const payload = {
        holdings: validRows.map((row) => ({
          scheme_name: row.scheme_name.trim(),
          asset_class: row.asset_class.trim(),
          category: row.category.trim() || row.asset_class.trim(),
          invested_amount: Number(row.invested_amount),
          current_value: Number(row.current_value),
          expense_ratio: Number(row.expense_ratio),
        })),
        benchmark_return: benchmarkReturn,
        risk_preference: riskPreference,
      };

      const response = await postPortfolioXray(payload as any);
      setPortfolioData(response.data);
      setHasData(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Manual portfolio analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError("");
      setFileName(file.name);

      const response = await uploadPortfolioXrayPdf({
        file,
        benchmark_return: benchmarkReturn,
        risk_preference: riskPreference,
      });

      setPortfolioData(response.data);
      setHasData(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fundWise = useMemo(() => {
    if (!portfolioData?.holdings) return [];
    return portfolioData.holdings.map((fund) => ({
      name: fund.scheme_name,
      invested: fund.invested_amount,
      current: fund.current_value,
    }));
  }, [portfolioData]);

  if (!hasData && mode === "choice") {
    return (
      <div className="max-w-5xl mx-auto py-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-2xl font-semibold mb-2">Portfolio X-Ray</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose how you want to analyze your portfolio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode("pdf")}
            className="glass-card rounded-2xl p-8 text-left hover:border-primary transition-all border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
            <p className="text-sm text-muted-foreground">
              Upload CAMS or KFintech PDF and analyze portfolio from the statement.
            </p>
          </button>

          <button
            onClick={() => setMode("manual")}
            className="glass-card rounded-2xl p-8 text-left hover:border-primary transition-all border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Table2 className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Manual Entry</h4>
            <p className="text-sm text-muted-foreground">
              Enter holdings manually in a simple table and analyze instantly.
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (!hasData && mode === "pdf") {
    return (
      <div className="max-w-3xl mx-auto py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-heading text-2xl font-semibold">Upload Portfolio PDF</h3>
          <Button variant="ghost" onClick={resetAll} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Benchmark Return (%)</label>
              <input
                type="number"
                value={benchmarkReturn}
                onChange={(e) => setBenchmarkReturn(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Risk Preference</label>
              <select
                value={riskPreference}
                onChange={(e) => setRiskPreference(e.target.value as RiskPreference)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePdfUpload}
            accept=".pdf"
            className="hidden"
          />

          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Upload only PDF statement
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {fileName || "Choose PDF"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  if (!hasData && mode === "manual") {
    return (
      <div className="max-w-7xl mx-auto py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-heading text-2xl font-semibold">Manual Portfolio Entry</h3>
          <Button variant="ghost" onClick={resetAll} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Benchmark Return (%)</label>
              <input
                type="number"
                value={benchmarkReturn}
                onChange={(e) => setBenchmarkReturn(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Risk Preference</label>
              <select
                value={riskPreference}
                onChange={(e) => setRiskPreference(e.target.value as RiskPreference)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-secondary/40">
                <tr>
                  <th className="text-left p-3">Scheme Name</th>
                  <th className="text-left p-3">Asset Class</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Invested Amount</th>
                  <th className="text-left p-3">Current Value</th>
                  <th className="text-left p-3">Expense Ratio (%)</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {manualRows.map((row, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-3">
                      <input
                        value={row.scheme_name}
                        onChange={(e) => updateManualRow(index, "scheme_name", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                        placeholder="Axis Bluechip Fund"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={row.asset_class}
                        onChange={(e) => updateManualRow(index, "asset_class", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                      >
                        <option value="Equity">Equity</option>
                        <option value="Debt">Debt</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Gold">Gold</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        value={row.category}
                        onChange={(e) => updateManualRow(index, "category", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                        placeholder="Large Cap"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={row.invested_amount}
                        onChange={(e) => updateManualRow(index, "invested_amount", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                        placeholder="120000"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={row.current_value}
                        onChange={(e) => updateManualRow(index, "current_value", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                        placeholder="145000"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.01"
                        value={row.expense_ratio}
                        onChange={(e) => updateManualRow(index, "expense_ratio", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2"
                        placeholder="1.60"
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeManualRow(index)}
                        disabled={manualRows.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={addManualRow} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Holding
            </Button>

            <Button onClick={handleManualSubmit} disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Analyze Portfolio
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  if (!portfolioData) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-semibold">Portfolio Analysis</h3>
        <Button variant="outline" onClick={resetAll} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: formatCurrency(portfolioData.totals.total_invested) },
          { label: "Current Value", value: formatCurrency(portfolioData.totals.total_current_value) },
          { label: "Gain / Loss", value: formatCurrency(portfolioData.totals.gain_loss), highlight: true },
          { label: "True XIRR", value: `${portfolioData.portfolio_xirr}%` },
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
          <p className="text-lg font-bold mt-1">{portfolioData.weighted_expense_ratio}%</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Expense Ratio Drag</p>
          <p className="text-lg font-bold mt-1 text-[hsl(var(--finance-red))]">
            {formatCurrency(portfolioData.expense_drag)}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-base font-semibold">AI-Generated Rebalancing Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {portfolioData.ai_rebalancing_plan}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Portfolio Allocation by Category</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={portfolioData.category_allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  nameKey="category"
                  strokeWidth={0}
                >
                  {portfolioData.category_allocation.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 flex-1">
              {portfolioData.category_allocation.map((d, i) => (
                <div key={d.category} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                  />
                  <span className="text-muted-foreground">{d.category}</span>
                  <span className="font-medium ml-auto">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Expense Ratio Drag by Fund</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={portfolioData.expense_drag_by_fund} barSize={40}>
              <XAxis dataKey="scheme_name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toLocaleString()}`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Expense Drag"]} />
              <Bar dataKey="expense_drag" name="Expense Drag" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Fund-wise Investment vs Current Value</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={fundWise} barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="invested" name="Invested" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="current" name="Current Value" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
              {portfolioData.overlap.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 px-3">{row.fund_1}</td>
                  <td className="py-2 px-3">{row.fund_2}</td>
                  <td className={`py-2 px-3 text-right font-medium ${row.overlap_pct > 20 ? "text-[hsl(var(--finance-red))]" : ""}`}>
                    {row.overlap_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">Portfolio Return vs Benchmark</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={portfolioData.portfolio_vs_benchmark}>
            <XAxis dataKey="period" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="benchmark_value" name="Benchmark" strokeWidth={2} />
            <Line type="monotone" dataKey="portfolio_value" name="Portfolio" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold mb-4">Benchmark Comparison</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Portfolio XIRR</p>
            <p className="text-lg font-bold mt-1">{portfolioData.benchmark_comparison.portfolio_xirr}%</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Benchmark Return</p>
            <p className="text-lg font-bold mt-1">{portfolioData.benchmark_comparison.benchmark_return}%</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className={`text-lg font-bold mt-1 ${getAlphaColor(portfolioData.benchmark_comparison.alpha)}`}>
              {portfolioData.benchmark_comparison.alpha}%
            </p>
            <p className="text-xs text-muted-foreground">Alpha</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className={`text-lg font-bold mt-1 ${portfolioData.benchmark_comparison.status === "Underperformed" ? "text-[hsl(var(--finance-red))]" : "text-accent"}`}>
              {portfolioData.benchmark_comparison.status}
            </p>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--finance-orange))]" />
          <h3 className="font-heading text-base font-semibold">Risk Flags</h3>
        </div>

        <div className="space-y-2">
          {portfolioData.risk_flags.length > 0 ? (
            portfolioData.risk_flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 bg-[hsl(var(--finance-orange)/.08)] border-l-3 border-l-[hsl(var(--finance-orange))]"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--finance-orange))]" />
                <p className="text-sm text-[hsl(var(--finance-orange))]">{flag}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No major risk flags detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}