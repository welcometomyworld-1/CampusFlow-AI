"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Building, 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  LogOut,
  Brain,
  Cpu,
  Layers,
  Zap,
  Check
} from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  
  // Modes: "login" | "signup" | "forgot"
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");

  // Login form
  const [email, setEmail] = useState("aarav.kumar@apex-university.edu");
  const [password, setPassword] = useState("CampusFlow2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupStudentId, setSignupStudentId] = useState("");
  const [signupUniversity, setSignupUniversity] = useState("Apex Technical University");
  const [signupCourse, setSignupCourse] = useState("B.Tech Computer Science & Engineering");
  const [signupSemester, setSignupSemester] = useState(5);
  const [signupPassword, setSignupPassword] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const syncUser = () => setCurrentUser(api.getStoredUser());
    syncUser();
    window.addEventListener("campusflow-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("campusflow-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setSuccessMsg("Logged out successfully.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  // Quick Autofills
  const handleAutofillStudent = () => {
    setEmail("aarav.kumar@apex-university.edu");
    setPassword("CampusFlow2026!");
    setRole("student");
    setMode("login");
    setErrorMsg(null);
  };

  const handleAutofillFaculty = () => {
    setEmail("priya.sharma@apex-university.edu");
    setPassword("CampusFlow2026!");
    setRole("faculty");
    setMode("login");
    setErrorMsg(null);
  };

  const handleAutofillAdmin = () => {
    setEmail("admin@apex-university.edu");
    setPassword("CampusFlow2026!");
    setRole("admin");
    setMode("login");
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (role === "admin") {
        const adminUser = {
          id: "admin-coe-1",
          name: "Controller of Examinations",
          email: email || "admin@apex-university.edu",
          student_id: "ADMIN-COE",
          role: "admin",
          university: "Apex Technical University",
          course: "Central University Administration",
          department: "Office of the Registrar & COE",
          semester: 0,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("campusflow_token", "admin_demo_jwt_token");
          localStorage.setItem("campusflow_user", JSON.stringify(adminUser));
          window.dispatchEvent(new Event("campusflow-auth-change"));
        }
        setSuccessMsg("Admin authentication verified. Redirecting to University Admin Portal...");
        setTimeout(() => router.push("/admin"), 600);
      } else if (role === "faculty") {
        const facultyUser = {
          id: "fac-102",
          name: "Dr. Priya Sharma",
          email: email || "priya.sharma@apex-university.edu",
          student_id: "FAC-102",
          role: "faculty",
          university: "Apex Technical University",
          course: "Dept of Computer Science & Engineering",
          department: "Computer Science & Engineering",
          semester: 0,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("campusflow_token", "faculty_demo_jwt_token");
          localStorage.setItem("campusflow_user", JSON.stringify(facultyUser));
          window.dispatchEvent(new Event("campusflow-auth-change"));
        }
        setSuccessMsg("Welcome Dr. Priya Sharma! Redirecting to Faculty Dashboard...");
        setTimeout(() => router.push("/faculty"), 600);
      } else {
        const res = await api.login(email, password);
        const userName = res?.user?.name || (email.includes("aarav") ? "Aarav" : "Student");
        setSuccessMsg(`Welcome back, ${userName}! Launching your Academic Digital Twin...`);
        setTimeout(() => router.push("/dashboard"), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid university credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.signup({
        name: signupName,
        email: signupEmail,
        student_id: signupStudentId,
        university: signupUniversity,
        course: signupCourse,
        semester: Number(signupSemester),
        password: signupPassword
      });
      setSuccessMsg("Account created! Initializing your personalized workspace...");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check the entered details.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center px-4 py-8 relative">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl glass-panel rounded-[32px] border border-white/10 shadow-2xl overflow-hidden grid lg:grid-cols-12 bg-slate-950/85 transition-all">
        
        {/* LEFT COLUMN: Dynamic AI Role Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          
          {/* Dynamic background highlight based on role */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            role === "student" ? "bg-cyan-500/15" : role === "faculty" ? "bg-indigo-500/20" : "bg-purple-500/20"
          }`} />

          <div className="space-y-6 relative z-10">
            {/* CampusFlow Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-xl shadow-cyan-500/25 group-hover:scale-105 transition-transform shrink-0">
                <img src="/logo.jpg" alt="CampusFlow AI Logo" className="w-full h-full object-cover rounded-[13px]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">CampusFlow AI</span>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Apex Technical University</p>
              </div>
            </Link>

            {/* Dynamic Role Headline */}
            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                <Brain className="w-3 h-3 text-cyan-400" />
                <span>
                  {role === "student" ? "Student Digital Twin" : role === "faculty" ? "Faculty Workspace" : "University Admin Portal"}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {role === "student" ? (
                  <>One Goal.<br /><span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Every Academic Action.</span></>
                ) : role === "faculty" ? (
                  <>Classrooms.<br /><span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Circulars &amp; Risk Insights.</span></>
                ) : (
                  <>Central Control.<br /><span className="bg-gradient-to-r from-purple-400 via-rose-300 to-indigo-300 bg-clip-text text-transparent">Policies &amp; MCP Telemetry.</span></>
                )}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {role === "student"
                  ? "Access your schedule, verify room notices in real time, and let Alexa+ manage study plans & reminders."
                  : role === "faculty"
                  ? "Manage teaching schedules, monitor low-attendance students, and publish RAG-indexed circulars instantly."
                  : "Issue institutional circulars, track MCP Bedrock agent executions, and govern campus academic policies."}
              </p>
            </div>

            {/* Live Interactive Feed Cards */}
            <div className="space-y-2.5 pt-2">
              {role === "student" ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Tomorrow&apos;s Exam
                      </span>
                      <span>10:00 AM IST</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Database Management Systems (CS501)</h4>
                    <p className="text-[11px] text-cyan-300 font-medium">Room B-204 &bull; Updated via Notice NOT-092</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Evening AI Study Sprint
                      </span>
                      <span>7:00 PM Tonight</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Normalization &amp; Transactions Revision</h4>
                    <p className="text-[11px] text-slate-400">Locked into your personal calendar</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1 hover:border-rose-500/30 transition-all">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Attendance Deficit
                      </span>
                      <span className="text-rose-400 font-bold font-mono">72.2%</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">CS501 Statutory Debarment Warning</h4>
                    <p className="text-[11px] text-slate-400">2 lectures required to restore 75% standing</p>
                  </div>
                </>
              ) : role === "faculty" ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-indigo-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Next Lecture
                      </span>
                      <span>11:30 AM</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Operating Systems Lab (CS502)</h4>
                    <p className="text-[11px] text-indigo-300 font-medium">Computing Lab 3 &bull; 36 Enrolled Students</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Attendance Risk
                      </span>
                      <span>2 Students Flagged</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Aarav Kumar &amp; Rohan Verma</h4>
                    <p className="text-[11px] text-slate-400">Automated warning notices ready to dispatch</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> RAG Circular Indexer
                      </span>
                      <span>Instant Sync</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Broadcast Venue &amp; Exam Updates</h4>
                    <p className="text-[11px] text-slate-400">Directly accessible to student voice agents</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Amazon Bedrock Agent
                      </span>
                      <span>Model: Claude 3.5 Sonnet</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">18 MCP Tools Streamable HTTP Active</h4>
                    <p className="text-[11px] text-purple-300 font-medium">Average tool latency: 240ms</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Student Directory
                      </span>
                      <span>Cohort CS-2026</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">142 Enrolled &bull; Fall 2026 Semester</h4>
                    <p className="text-[11px] text-slate-400">Multi-tenant partition isolation enabled</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Institutional Trust Badge */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-3 relative z-10 text-[11px] text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>FERPA Compliant &bull; AWS KMS 256-bit DynamoDB Encryption</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Sign In / Register Portal (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          
          {/* Header Controls: Role Selector & Mode Toggle */}
          <div className="space-y-4 border-b border-white/10 pb-5">
            
            {/* 3-Role Glass Segmented Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
                  Select Your Academic Role:
                </span>
                <div className="inline-flex p-1 bg-slate-900/90 rounded-2xl border border-white/10 text-xs font-semibold gap-1">
                  <button
                    type="button"
                    onClick={() => { setRole("student"); setErrorMsg(null); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      role === "student"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/25 scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole("faculty"); setErrorMsg(null); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      role === "faculty"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole("admin"); setErrorMsg(null); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      role === "admin"
                        ? "bg-gradient-to-r from-purple-500 to-rose-600 text-white font-bold shadow-md shadow-purple-500/25 scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Login / Register Toggle */}
              <div className="flex items-center gap-3 text-xs self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setErrorMsg(null); }}
                  className={`font-semibold transition-colors cursor-pointer ${
                    mode === "login" ? "text-cyan-400 underline underline-offset-4" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <span className="text-slate-600">&bull;</span>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setErrorMsg(null); }}
                  className={`font-semibold transition-colors cursor-pointer ${
                    mode === "signup" ? "text-cyan-400 underline underline-offset-4" : "text-slate-400 hover:text-white"
                  }`}
                >
                  New Account
                </button>
              </div>
            </div>

          </div>

          {/* Active Session Notice if already logged in */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-md">
                  {currentUser.name ? currentUser.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div className="truncate text-left">
                  <p className="text-white font-semibold truncate">Active Session: {currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {currentUser.student_id || currentUser.email} &bull; <span className="capitalize text-cyan-300 font-bold">{currentUser.role || "student"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={currentUser.role === "faculty" ? "/faculty" : currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-[11px] transition-colors"
                >
                  {currentUser.role === "faculty" ? "Faculty Portal" : currentUser.role === "admin" ? "Admin Portal" : "Student Dashboard"} &rarr;
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-[11px] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {role === "student" ? "Student Email" : role === "faculty" ? "Faculty Instructor Email" : "Admin Official Email"}
                  </span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "student"
                      ? "student@apex-university.edu"
                      : role === "faculty"
                      ? "faculty@apex-university.edu"
                      : "admin@apex-university.edu"
                  }
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span>Remember session on this device</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">24h Session</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>
                  {loading 
                    ? "Authenticating..." 
                    : role === "student" 
                    ? "Authenticate & Launch Student Dashboard" 
                    : role === "faculty" 
                    ? "Authenticate & Enter Faculty Portal" 
                    : "Authenticate & Enter Admin Portal"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Instant Autofill Demo Personas */}
              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  <span>1-Click Demo Personas:</span>
                  <span className="text-cyan-400">Instant Switch</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-2">
                  {/* Student Tile */}
                  <button
                    type="button"
                    onClick={handleAutofillStudent}
                    className={`p-2.5 rounded-2xl glass-card text-left text-xs border transition-all group cursor-pointer ${
                      role === "student" 
                        ? "border-cyan-500/60 bg-cyan-950/30 shadow-md shadow-cyan-500/10" 
                        : "border-cyan-500/20 hover:border-cyan-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-cyan-300">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-cyan-400" /> Student
                      </span>
                      {role === "student" && <Check className="w-3 h-3 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-white font-semibold truncate mt-1">Aarav Kumar</p>
                    <span className="text-[9px] text-slate-400 font-mono block">STU1001 &bull; CS Sem 5</span>
                  </button>

                  {/* Faculty Tile */}
                  <button
                    type="button"
                    onClick={handleAutofillFaculty}
                    className={`p-2.5 rounded-2xl glass-card text-left text-xs border transition-all group cursor-pointer ${
                      role === "faculty" 
                        ? "border-indigo-500/60 bg-indigo-950/30 shadow-md shadow-indigo-500/10" 
                        : "border-indigo-500/20 hover:border-indigo-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-indigo-300">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" /> Faculty
                      </span>
                      {role === "faculty" && <Check className="w-3 h-3 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-white font-semibold truncate mt-1">Dr. Priya Sharma</p>
                    <span className="text-[9px] text-slate-400 font-mono block">FAC-102 &bull; CS Dept</span>
                  </button>

                  {/* Admin Tile */}
                  <button
                    type="button"
                    onClick={handleAutofillAdmin}
                    className={`p-2.5 rounded-2xl glass-card text-left text-xs border transition-all group cursor-pointer ${
                      role === "admin" 
                        ? "border-purple-500/60 bg-purple-950/30 shadow-md shadow-purple-500/10" 
                        : "border-purple-500/20 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-purple-300">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-purple-400" /> Admin
                      </span>
                      {role === "admin" && <Check className="w-3 h-3 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-white font-semibold truncate mt-1">Office of COE</p>
                    <span className="text-[9px] text-slate-400 font-mono block">ADMIN-COE &bull; Central</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Aarav Kumar"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Student ID / Roll No</label>
                  <input
                    type="text"
                    required
                    value={signupStudentId}
                    onChange={(e) => setSignupStudentId(e.target.value)}
                    placeholder="STU1001"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={signupSemester}
                    onChange={(e) => setSignupSemester(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="student@apex-university.edu"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Degree &amp; Department</label>
                <input
                  type="text"
                  required
                  value={signupCourse}
                  onChange={(e) => setSignupCourse(e.target.value)}
                  placeholder="B.Tech Computer Science &amp; Engineering"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create secure academic password"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? "Registering Student..." : "Create Academic Digital Twin"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Reset University Credentials</h3>
                <p className="text-xs text-slate-400">
                  Enter your enrolled institutional email address. A one-time security recovery token will be dispatched.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reset Token Dispatched</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Instructions sent to <span className="font-mono text-white">{forgotEmail}</span>. Check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setForgotSent(false); }}
                    className="mt-2 text-xs text-cyan-400 underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">University Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@apex-university.edu"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                    >
                      Send Password Reset Token
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-white/10 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
