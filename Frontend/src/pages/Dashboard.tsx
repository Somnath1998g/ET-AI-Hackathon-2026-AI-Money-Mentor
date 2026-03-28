import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, PieChart, TrendingUp, Lightbulb, Sparkles, User, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import OverviewTab from "@/components/dashboard/OverviewTab";
import PortfolioTab from "@/components/dashboard/PortfolioTab";
import RetirementTab from "@/components/dashboard/RetirementTab";
import InsightsTab from "@/components/dashboard/InsightsTab";

const tabs = [
  { id: "overview", label: "Money Health Score", icon: LayoutDashboard },
  { id: "portfolio", label: "Portfolio X-Ray", icon: PieChart },
  { id: "retirement", label: "Retirement Plan", icon: TrendingUp },
  { id: "insights", label: "AI Insights", icon: Lightbulb },
] as const;

type TabId = typeof tabs[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      <aside className="w-16 md:w-56 h-screen sticky top-0 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-bold hidden md:block">AI Money Mentor</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-2 py-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <h1 className="font-heading text-lg font-semibold">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-secondary transition-colors"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "retirement" && <RetirementTab />}
          {activeTab === "insights" && <InsightsTab />}
        </main>
      </div>
    </div>
  );
}