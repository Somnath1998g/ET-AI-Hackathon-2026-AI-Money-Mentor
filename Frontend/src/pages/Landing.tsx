import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Sun, Moon, TrendingUp, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import landingBg from "@/assets/landing-bg.jpeg";

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full background image */}
      <div className="absolute inset-0">
        {/* <img src={landingBg} alt="" className={`w-full h-full object-cover ${isDark ? "opacity-40" : "opacity-45"}`} />
        <div className={`absolute inset-0 ${isDark ? "bg-black/60" : "bg-white/50"}`} /> */}
        <img src={landingBg} alt="" className={`w-full h-full object-cover ${isDark ? "opacity-40" : "opacity-50"}`} />
<div className={`absolute inset-0 ${isDark ? "bg-black/60" : "bg-black/45"}`} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={`font-heading text-xl font-bold ${isDark ? "text-white" : "text-foreground"}`}>AI Money Mentor</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
              isDark ? "border-white/20 bg-white/10 hover:bg-white/20" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className={isDark ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "border-primary/30 text-primary hover:bg-primary/10"}
          >
            Login / Sign Up
          </Button>
        </div>
      </nav>

    
      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-12 md:pt-24 md:pb-20" style={isDark ? {} : { textShadow: "0 1px 3px rgba(255,255,255,0.45)" }}>
        <h1
  className={`font-heading text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-[1.1] ${
    isDark ? "text-white" : "text-foreground"
  }`}
>
  Build your{" "}
  <span className="relative inline-flex items-center px-4 py-2 md:px-5 md:py-3 rounded-2xl overflow-hidden align-middle">
    <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-accent opacity-90 rounded-2xl" />
    <span className="absolute inset-[1.5px] rounded-2xl bg-white/10 backdrop-blur-md" />
    <span className="relative bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-sm">
      financial future
    </span>
  </span>
</h1>



        <p className={`mt-6 text-xl md:text-2xl max-w-xl font-medium ${isDark ? "text-white/80" : "text-foreground"}`}>
          with your own <span className={`font-bold ${isDark ? "text-white" : "text-foreground"}`}>AI financial adviser.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          <Button size="lg" onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gap-2 shadow-lg hover:shadow-xl transition-all text-lg">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
          
        </div>
      </section>

      {/* Bottom features */}
      <section className="relative z-10 mt-auto px-6 md:px-12 pb-12 max-w-5xl mx-auto">
  <div className="grid md:grid-cols-3 gap-8 text-center">
    {[
      { icon: Users, title: "Trust our", bold: "experienced AI advisor" },
      { icon: TrendingUp, title: "The most effective", bold: "financial strategies" },
      { icon: Target, title: "We are focused on", bold: "your needs." },
    ].map((item) => (
      <div key={item.bold} className="flex flex-col items-center gap-3">
        <div
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
            isDark ? "border-white/30" : "border-black/70 bg-white/40"
          }`}
        >
          <item.icon className={`w-7 h-7 ${isDark ? "text-white" : "text-black"}`} />
        </div>

        <p
          className={`text-sm ${
            isDark ? "text-white/80" : "text-black"
          }`}
        >
          {item.title}{" "}
          <span className={`font-bold block ${isDark ? "text-white" : "text-black"}`}>
            {item.bold}
          </span>
        </p>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
