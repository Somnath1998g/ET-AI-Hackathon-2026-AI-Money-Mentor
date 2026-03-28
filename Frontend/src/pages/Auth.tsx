import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      // Store credentials in localStorage for demo
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[email]) {
        setError("Account already exists. Please login.");
        return;
      }
      users[email] = password;
      localStorage.setItem("users", JSON.stringify(users));
      login(email);
      navigate("/onboarding");
    } else {
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (!users[email] || users[email] !== password) {
        setError("Invalid email or password");
        return;
      }
      login(email);
      const hasOnboarding = localStorage.getItem("onboarding");
      navigate(hasOnboarding ? "/dashboard" : "/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
      <Button variant="ghost" onClick={() => navigate("/")} className="absolute top-4 left-4 text-muted-foreground gap-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-heading text-xl font-bold text-foreground">AI Money Mentor</span>
      </div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isSignUp ? "Start your financial journey today" : "Log in to continue"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative mt-1.5">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {isSignUp && (
            <div>
              <Label>Confirm Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground">
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-primary font-medium hover:underline">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Sparkles, Eye, EyeOff } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";

// export default function Auth() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (isSignUp) {
//       if (password !== confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }
//       if (password.length < 6) {
//         setError("Password must be at least 6 characters");
//         return;
//       }
//       // Store credentials in localStorage for demo
//       const users = JSON.parse(localStorage.getItem("users") || "{}");
//       if (users[email]) {
//         setError("Account already exists. Please login.");
//         return;
//       }
//       users[email] = password;
//       localStorage.setItem("users", JSON.stringify(users));
//       login(email);
//       navigate("/onboarding");
//     } else {
//       const users = JSON.parse(localStorage.getItem("users") || "{}");
//       if (!users[email] || users[email] !== password) {
//         setError("Invalid email or password");
//         return;
//       }
//       login(email);
//       const hasOnboarding = localStorage.getItem("onboarding");
//       navigate(hasOnboarding ? "/dashboard" : "/onboarding");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
//       <div className="flex items-center gap-2 mb-8">
//         <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//           <Sparkles className="w-5 h-5 text-primary-foreground" />
//         </div>
//         <span className="font-heading text-xl font-bold text-foreground">AI Money Mentor</span>
//       </div>

//       <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
//         <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
//           {isSignUp ? "Create your account" : "Welcome back"}
//         </h2>
//         <p className="text-sm text-muted-foreground mb-6">
//           {isSignUp ? "Start your financial journey today" : "Log in to continue"}
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Email</Label>
//             <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
//           </div>
//           <div>
//             <Label>Password</Label>
//             <div className="relative mt-1.5">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>
//           {isSignUp && (
//             <div>
//               <Label>Confirm Password</Label>
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="mt-1.5"
//               />
//             </div>
//           )}

//           {error && <p className="text-sm text-destructive font-medium">{error}</p>}

//           <Button type="submit" className="w-full bg-primary text-primary-foreground">
//             {isSignUp ? "Sign Up" : "Log In"}
//           </Button>
//         </form>

//         <p className="text-sm text-muted-foreground text-center mt-6">
//           {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
//           <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-primary font-medium hover:underline">
//             {isSignUp ? "Log In" : "Sign Up"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
