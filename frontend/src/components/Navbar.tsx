"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Bell, 
  Mic, 
  ShieldCheck, 
  RefreshCw, 
  Layers,
  Sun,
  Moon,
  LogOut,
  LogIn,
  ChevronDown,
  Users,
  FileText,
  Brain
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api, StudentProfile } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("campusflow_theme");
      const isLight = savedTheme === "light" || document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    }
  }, []);

  // Sync logged in user & role
  useEffect(() => {
    const syncUser = () => {
      setUser(api.getStoredUser());
    };
    syncUser();
    window.addEventListener("campusflow-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("campusflow-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("campusflow_theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
    setMessage(`Switched to ${nextTheme === "light" ? "Light" : "Dark"} Mode`);
    setTimeout(() => setMessage(null), 1500);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.resetDemoData();
      setMessage("Demo data reset to initial state!");
      setTimeout(() => {
        setMessage(null);
        window.location.reload();
      }, 1200);
    } catch (e) {
      setMessage("Reset completed.");
      setTimeout(() => setMessage(null), 1200);
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setUserMenuOpen(false);
    setMessage("Logged out successfully");
    setTimeout(() => {
      setMessage(null);
      router.push("/login");
    }, 700);
  };

  // Role-based Navigation Links
  const getNavLinks = () => {
    if (!user) {
      // Guest / Visitor
      return [
        { href: "/", label: "Home", icon: Sparkles },
        { href: "/assistant", label: "Alexa+ Agent", icon: Mic, highlight: true },
        { href: "/schedule", label: "Schedule", icon: Calendar },
        { href: "/notices", label: "Notices", icon: Bell },
      ];
    }

    if (user.role === "faculty") {
      // Faculty / Teacher Role
      return [
        { href: "/faculty", label: "Faculty Portal", icon: BookOpen },
        { href: "/memory", label: "AI Memory Vault", icon: Brain },
        { href: "/assistant", label: "Alexa+ Agent", icon: Mic, highlight: true },
        { href: "/schedule", label: "Master Schedule", icon: Calendar },
        { href: "/notices", label: "Circulars", icon: Bell },
      ];
    }

    if (user.role === "admin") {
      // University Admin / Exam Controller
      return [
        { href: "/admin", label: "Admin Portal", icon: ShieldCheck },
        { href: "/memory", label: "AI Memory Vault", icon: Brain },
        { href: "/faculty", label: "Faculty Portal", icon: BookOpen },
        { href: "/dashboard", label: "Student View", icon: Layers },
        { href: "/assistant", label: "Alexa+ Agent", icon: Mic, highlight: true },
      ];
    }

    // Default: Student Role
    return [
      { href: "/dashboard", label: "Dashboard", icon: Layers },
      { href: "/memory", label: "AI Memory", icon: Brain },
      { href: "/assistant", label: "Alexa+ Agent", icon: Mic, highlight: true },
      { href: "/schedule", label: "Schedule", icon: Calendar },
      { href: "/exams", label: "Exams", icon: BookOpen },
      { href: "/tasks", label: "Tasks & Plans", icon: CheckSquare },
      { href: "/notices", label: "Notices", icon: Bell },
    ];
  };

  const navLinks = getNavLinks();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
            <img src="/logo.jpg" alt="CampusFlow AI Logo" className="w-full h-full object-cover rounded-[9px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                CampusFlow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                AI Operating System
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">One Goal. One Conversation. Every Academic Action.</p>
          </div>
        </Link>

        {/* Navigation items (Role-based) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-semibold"
                    : link.highlight
                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-white/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Theme Toggle, Reset Demo button & Role-based Auth Pill */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform hover:rotate-45" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-500 transition-transform hover:-rotate-12" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Quick Database Seeder */}
          <button
            onClick={handleReset}
            disabled={resetting}
            title="Restore sample academic data"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${resetting ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* AUTH SECTION */}
          {user ? (
            /* Logged In: Role-Aware Profile Pill + Dropdown + Prominent Logout Button */
            <div className="relative flex items-center gap-2 pl-2 border-l border-white/10" ref={menuRef}>
              {/* Profile button that triggers dropdown */}
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer text-left ${
                  user.role === "faculty"
                    ? "bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-500/30"
                    : user.role === "admin"
                    ? "bg-purple-950/40 hover:bg-purple-900/50 border-purple-500/30"
                    : "bg-slate-800/60 hover:bg-slate-700/70 border-white/10"
                }`}
                aria-expanded={userMenuOpen}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-inner shrink-0 ${
                  user.role === "faculty"
                    ? "bg-gradient-to-tr from-indigo-500 to-purple-600"
                    : user.role === "admin"
                    ? "bg-gradient-to-tr from-purple-500 to-rose-600"
                    : "bg-gradient-to-tr from-cyan-400 to-indigo-600"
                }`}>
                  {userInitials}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                      user.role === "faculty"
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                        : user.role === "admin"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {user.role === "faculty" ? "FACULTY" : user.role === "admin" ? "ADMIN" : user.student_id || "STU"}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dedicated Prominent Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign Out / Logout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-600 hover:text-white border border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/10 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:text-white shrink-0" />
                <span>Logout</span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-panel bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-3 border-b border-white/10 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md ${
                      user.role === "faculty"
                        ? "bg-gradient-to-tr from-indigo-500 to-purple-600"
                        : user.role === "admin"
                        ? "bg-gradient-to-tr from-purple-500 to-rose-600"
                        : "bg-gradient-to-tr from-cyan-400 to-indigo-600"
                    }`}>
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          user.role === "faculty"
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold"
                            : user.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }`}>
                          {user.role ? user.role.toUpperCase() : "STUDENT"}: {user.student_id || "STU1001"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    {user.role === "faculty" ? (
                      <>
                        <Link
                          href="/faculty"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Faculty Portal</span>
                        </Link>
                        <Link
                          href="/schedule"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Teaching Schedule</span>
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Administration Tools</span>
                        </Link>
                        <Link
                          href="/memory"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 rounded-lg transition-colors font-medium"
                        >
                          <Brain className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI Memory &amp; Cognitive Profile</span>
                        </Link>
                      </>
                    ) : user.role === "admin" ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Admin Portal &amp; Telemetry</span>
                        </Link>
                        <Link
                          href="/faculty"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Faculty Class Overview</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Student View</span>
                        </Link>
                        <Link
                          href="/memory"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 rounded-lg transition-colors font-medium"
                        >
                          <Brain className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI Memory &amp; Digital Twin</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Academic Dashboard</span>
                        </Link>
                        <Link
                          href="/memory"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 rounded-lg transition-colors font-medium"
                        >
                          <Brain className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI Memory &amp; Digital Twin</span>
                        </Link>
                        <Link
                          href="/tasks"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Study Plans &amp; Tasks</span>
                        </Link>
                        <Link
                          href="/schedule"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          <span>Schedule &amp; Exams</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5 text-white" />
                      <span>Sign Out / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not Logged In: Clean "Sign In" button */
            <div className="pl-2 border-l border-white/10">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {message && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          {message}
        </div>
      )}
    </header>
  );
}
