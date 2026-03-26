import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, PieChart, ArrowRight, BarChart3, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const features = [
  {
    icon: TrendingUp,
    title: "Money Health Score",
    description: "Get a comprehensive score across 6 key financial pillars — emergency, insurance, investment, debt, tax, and retirement.",
    color: "from-[hsl(var(--finance-blue))] to-[hsl(var(--finance-teal))]",
  },
  {
    icon: BarChart3,
    title: "Retirement Planner",
    description: "Visualize your wealth trajectory and see how small changes today create big differences for your future.",
    color: "from-[hsl(var(--finance-green))] to-[hsl(var(--finance-teal))]",
  },
  {
    icon: PieChart,
    title: "Portfolio X-Ray",
    description: "Upload your portfolio and get instant AI-powered analysis of diversification, risk, and performance.",
    color: "from-[hsl(var(--finance-purple))] to-[hsl(var(--finance-blue))]",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">AI Money Mentor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors">
            {theme === "light" ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
          </button>
          <Button variant="outline" onClick={() => navigate("/auth")} className="border-primary/30 text-primary hover:bg-primary/5">
            Login / Sign Up
          </Button>
        </div>
      </nav>

            {/* Hero Section - Reduced bottom padding */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-6 pb-10 md:pt-10 md:pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          AI-Powered Financial Intelligence
        </div>
        
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-3xl leading-tight">
          AI Money <span className="text-gradient">Mentor</span>
        </h1>
        
        <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-xl">
          Plan your financial future in minutes. Get AI-powered insights across savings, investments, debt and retirement.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button size="lg" onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gap-2 shadow-lg hover:shadow-xl transition-all">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="border-primary/20 text-primary hover:bg-primary/5 px-8">
            Try for Free
          </Button>
        </div>
      </section>

      {/* Features Section - Reduced top and bottom padding */}
      <section className="relative z-10 px-6 md:px-12 pb-16 md:pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-card border border-border p-6 hover:shadow-[var(--shadow-elevated)] transition-all duration-300"
              style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: "backwards" }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
