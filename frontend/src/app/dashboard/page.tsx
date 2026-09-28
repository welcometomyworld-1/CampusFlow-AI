"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Bell, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Mic,
  Activity,
  Brain
} from "lucide-react";
import { api, DashboardData } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading student academic dashboard...</p>
      </div>
    );
  }

  const { student, urgent_items, classes_today, exams_upcoming, assignments_due, attendance_summary, recent_notices, active_reminders, active_tasks } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner: Student Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {student.name.split(" ")[0]}!
            </h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active Term
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {student.course} &bull; Semester {student.semester} &bull; {student.university}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/assistant"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Mic className="w-3.5 h-3.5" />
            Ask CampusFlow AI
          </Link>
          <Link
            href="/tasks"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium glass-card text-slate-200 hover:text-white"
          >
            <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
            Manage Tasks
          </Link>
          <Link
            href="/schedule"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium glass-card text-slate-200 hover:text-white"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Full Schedule
          </Link>
        </div>
      </div>

      {/* AI PRIORITY CARD (Urgent Academic Directive) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/20 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                AI Proactive Intelligence &bull; High Priority
              </span>
              <h2 className="text-lg font-bold text-white">
                {data.proactive_recommendation?.headline || "Urgent Items Today"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/memory"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Memory Vault</span>
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 ml-2"
            >
              Open in Alexa+ Assistant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Priority items list */}
        <div className="grid sm:grid-cols-3 gap-3">
          {urgent_items.map((item, idx) => (
            <div key={idx} className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                  Priority #{item.rank}
                </span>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{item.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* METRIC GRIDS: Classes, Exams, Assignments, Attendance */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Classes Today */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Classes Today</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{classes_today.length} Lectures</div>
          <div className="text-[11px] text-slate-400 space-y-1">
            {classes_today.slice(0, 2).map((cls, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-300 truncate">{cls.subject_name}</span>
                <span className="font-mono text-cyan-400">{cls.start_time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="glass-card p-5 rounded-2xl space-y-3 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">Next Examination</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          {exams_upcoming[0] ? (
            <div>
              <div className="text-lg font-black text-white truncate">{exams_upcoming[0].subject_name}</div>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                Tomorrow &bull; {exams_upcoming[0].time}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-2">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{exams_upcoming[0].room}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No scheduled exams</p>
          )}
        </div>

        {/* Pending Assignments */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Due Assignments</span>
            <CheckSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{assignments_due.length} Pending</div>
          <div className="text-[11px] text-slate-400 space-y-1">
            {assignments_due.slice(0, 2).map((asg, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-300 truncate max-w-[120px]">{asg.title}</span>
                <span className="font-mono text-rose-400">Due {asg.due_date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Watch */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Attendance Watch</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          {attendance_summary.find(a => a.is_low) ? (
            <div>
              <div className="text-2xl font-black text-rose-400">
                {attendance_summary.find(a => a.is_low)?.percentage.toFixed(1)}%
              </div>
              <p className="text-[11px] text-rose-300 font-medium">
                {attendance_summary.find(a => a.is_low)?.subject_name} &bull; Warning (&lt; 75%)
              </p>
            </div>
          ) : (
            <div className="text-2xl font-black text-emerald-400">Good Standing</div>
          )}
        </div>

      </div>

      {/* LOWER SECTION: Timetable, Notices, Tasks & Reminders */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Today's Schedule Timeline (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Today&apos;s Lecture &amp; Revision Schedule
              </h3>
            </div>
            <Link href="/schedule" className="text-xs text-cyan-400 hover:underline">
              View Week
            </Link>
          </div>

          <div className="space-y-3">
            {classes_today.map((cls, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex flex-col items-center justify-center font-mono text-[10px] text-cyan-300 font-bold">
                    <span>{cls.start_time}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{cls.subject_name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Faculty: {cls.faculty}</span>
                      <span>&bull;</span>
                      <span className="text-cyan-400 font-medium">{cls.room}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                  {cls.subject_code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Active Reminders (1 col) */}
        <div className="space-y-6">
          
          {/* Institutional Notices */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Official Circulars (RAG)
                </h3>
              </div>
              <Link href="/notices" className="text-[11px] text-cyan-400 hover:underline">All</Link>
            </div>

            <div className="space-y-2.5">
              {recent_notices.map((n, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-amber-400 uppercase font-bold">{n.category}</span>
                    <span>{n.date_posted}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-white line-clamp-1">{n.title}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Reminders */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Active Reminders
                </h3>
              </div>
              <Link href="/tasks" className="text-[11px] text-cyan-400 hover:underline">Manage</Link>
            </div>

            <div className="space-y-2">
              {active_reminders.map((rem, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-cyan-200">{rem.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rem.date} at {rem.time} IST</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
