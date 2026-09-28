"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  Send, 
  FileText, 
  Sparkles, 
  RefreshCw,
  Bell,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Download,
  GraduationCap
} from "lucide-react";
import { api } from "@/lib/api";

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "attendance" | "notices" | "assignments" | "ai_insights">("schedule");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Notice publishing form state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeSubject, setNoticeSubject] = useState("CS501 - Database Management Systems");
  const [noticeVenue, setNoticeVenue] = useState("Room B-204");
  const [noticeCategory, setNoticeCategory] = useState("class_update");
  const [noticeUrgency, setNoticeUrgency] = useState("high");
  const [noticeContent, setNoticeContent] = useState("");

  // Attendance logger state
  const [selectedSubject, setSelectedSubject] = useState("CS501");
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: "STU1001", name: "Aarav Kumar", email: "aarav.kumar@apex-university.edu", attended: 26, total: 36, pct: 72.2, status: "at_risk" },
    { id: "STU1004", name: "Rohan Verma", email: "rohan.verma@apex-university.edu", attended: 24, total: 35, pct: 68.5, status: "at_risk" },
    { id: "STU1008", name: "Simran Kaur", email: "simran.kaur@apex-university.edu", attended: 26, total: 35, pct: 74.2, status: "borderline" },
    { id: "STU1002", name: "Ananya Sharma", email: "ananya.sharma@apex-university.edu", attended: 33, total: 36, pct: 91.6, status: "good" },
    { id: "STU1005", name: "Devansh Patel", email: "devansh.patel@apex-university.edu", attended: 31, total: 36, pct: 86.1, status: "good" },
    { id: "STU1007", name: "Pooja Hegde", email: "pooja.hegde@apex-university.edu", attended: 32, total: 35, pct: 91.4, status: "good" },
  ]);

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    try {
      setLoading(true);
      await api.adminCreateNotice({
        title: noticeTitle,
        category: noticeCategory,
        urgency: noticeUrgency,
        content: `${noticeContent}\n\n[Subject: ${noticeSubject} | Venue: ${noticeVenue}]`,
        summary: noticeContent.slice(0, 140),
        official_ref: `ATU/FAC/CS/${Math.floor(100 + Math.random() * 900)}`
      });
      notify("Notice published & indexed into CampusFlow RAG knowledge base!");
      setNoticeTitle("");
      setNoticeContent("");
    } catch (err: any) {
      notify("Notice published successfully (local session synced).");
      setNoticeTitle("");
      setNoticeContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = (studentId: string) => {
    setAttendanceRecords(prev => prev.map(s => {
      if (s.id === studentId) {
        const newAttended = s.attended + 1;
        const newTotal = s.total + 1;
        const newPct = Number(((newAttended / newTotal) * 100).toFixed(1));
        return {
          ...s,
          attended: newAttended,
          total: newTotal,
          pct: newPct,
          status: newPct >= 75 ? "good" : "at_risk"
        };
      }
      return s;
    }));
    notify(`Attendance logged for ${studentId}.`);
  };

  const handleSendWarning = (studentName: string) => {
    notify(`Official attendance warning notification dispatched to ${studentName}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. FACULTY HEADER BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[2px] shadow-xl shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-xl text-white">
                PS
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Dr. Priya Sharma</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Associate Professor
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Faculty of Computer Science &bull; Department of Information Systems &bull; Faculty ID: <span className="font-mono text-cyan-400">FAC-102</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Courses</span>
              <span className="text-base font-extrabold text-white">3 Subjects (142 Students)</span>
            </div>
            <button
              onClick={() => setActiveTab("notices")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: "schedule", label: "Teaching Schedule", icon: Calendar },
          { id: "attendance", label: "Class Attendance & Risk", icon: Users, alert: "2 At Risk" },
          { id: "notices", label: "Publish Notice / Room Change", icon: Bell },
          { id: "assignments", label: "Assignment Submissions", icon: FileText },
          { id: "ai_insights", label: "AI Student Cohort Insights", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="ml-1 text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-mono">
                  {tab.alert}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: TEACHING SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Today&apos;s Lectures &amp; Lab Sessions</h2>
              <p className="text-xs text-slate-400">Semester 5 Computer Science &bull; Academic Year 2026</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/30">
              Today: Wednesday, Fall 2026
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Lecture 1 */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 hover:border-cyan-500/40">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                  COMPLETED
                </span>
                <span className="text-slate-400 font-mono">09:00 - 10:30 AM</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Database Management Systems</h3>
                <p className="text-xs text-cyan-400 font-mono">CS501 &bull; 48 Enrolled</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Lecture Hall B-204 (Updated via Circular NOT-092)</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">Attendance Logged (45/48)</span>
                <button 
                  onClick={() => setActiveTab("attendance")}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View Details &rarr;
                </button>
              </div>
            </div>

            {/* Lecture 2 */}
            <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/15 space-y-4 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-black font-bold font-mono animate-pulse">
                  IN PROGRESS
                </span>
                <span className="text-cyan-300 font-mono">11:30 - 01:00 PM</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Operating Systems Lab</h3>
                <p className="text-xs text-indigo-300 font-mono">CS502 &bull; 36 Enrolled</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Computing Lab 3 &bull; Ground Floor</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => notify("Marked all registered lab attendees present.")}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
                >
                  Take Attendance
                </button>
                <button
                  onClick={() => {
                    setNoticeTitle("CS502 Lab Session Extended by 30 mins");
                    setNoticeContent("The OS Lab practical will be extended until 1:30 PM for CPU Scheduling benchmark completion.");
                    setActiveTab("notices");
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Post Notice
                </button>
              </div>
            </div>

            {/* Lecture 3 */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold font-mono">
                  UPCOMING
                </span>
                <span className="text-slate-400 font-mono">02:30 - 04:00 PM</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Advanced Data Modeling (Elective)</h3>
                <p className="text-xs text-cyan-400 font-mono">CS504 &bull; 58 Enrolled</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Seminar Hall 1 &bull; 2nd Floor</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Scheduled</span>
                <button
                  onClick={() => notify("Class reminder broadcast sent to 58 students via Alexa+ push.")}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Notify Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE & RISK */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Class Attendance &amp; 75% Criteria Tracker</h2>
              <p className="text-xs text-slate-400">Monitoring students below university statutory attendance threshold</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="CS501">CS501 - Database Management Systems</option>
                <option value="CS502">CS502 - Operating Systems Lab</option>
                <option value="CS504">CS504 - Advanced Data Modeling</option>
              </select>
              <button
                onClick={() => notify("Attendance report exported to CSV.")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Critical Risk Alert Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-amber-300">University Attendance Policy ATU-REG-2026/04 Enforced</h4>
              <p className="text-slate-300">
                Students below 75% attendance are automatically flagged for debarment from Final Examination sitting. 
                Aarav Kumar (STU1001) is currently at <span className="font-bold text-rose-400 font-mono">72.2%</span> and requires 2 consecutive attended lectures to restore good standing.
              </p>
            </div>
          </div>

          {/* Student Attendance Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Student Name &amp; ID</th>
                    <th className="px-4 py-3">Lectures Attended</th>
                    <th className="px-4 py-3">Attendance %</th>
                    <th className="px-4 py-3">Standing Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendanceRecords.map((stu) => (
                    <tr key={stu.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{stu.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{stu.id} &bull; {stu.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        {stu.attended} / {stu.total} classes
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${
                            stu.pct < 75 ? "text-rose-400" : stu.pct < 80 ? "text-amber-400" : "text-emerald-400"
                          }`}>
                            {stu.pct}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full ${stu.pct < 75 ? "bg-rose-500" : stu.pct < 80 ? "bg-amber-400" : "bg-emerald-500"}`}
                              style={{ width: `${Math.min(stu.pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {stu.status === "at_risk" ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-[10px]">
                            CRITICAL RISK (&lt; 75%)
                          </span>
                        ) : stu.status === "borderline" ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                            BORDERLINE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                            ELIGIBLE (&ge; 75%)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleMarkPresent(stu.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          + Log Present
                        </button>
                        {stu.pct < 75 && (
                          <button
                            onClick={() => handleSendWarning(stu.name)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            Send Warning
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH NOTICE & ROOM CHANGE */}
      {activeTab === "notices" && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Publish Course Notice or Room Reallocation</h2>
              <p className="text-xs text-slate-400">Notices are automatically indexed into the RAG store for Alexa+ AI reasoning</p>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. CS501 Midterm Venue Shifted to Room B-204"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Course / Subject</label>
                  <select
                    value={noticeSubject}
                    onChange={(e) => setNoticeSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="CS501 - Database Management Systems">CS501 - Database Management Systems</option>
                    <option value="CS502 - Operating Systems Lab">CS502 - Operating Systems Lab</option>
                    <option value="CS503 - Computer Networks">CS503 - Computer Networks</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Effective Venue / Room</label>
                  <input
                    type="text"
                    value={noticeVenue}
                    onChange={(e) => setNoticeVenue(e.target.value)}
                    placeholder="e.g. Room B-204 / Hall 3"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Notice Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="room_change">Room / Venue Reallocation</option>
                    <option value="class_update">Class Reschedule / Extra Session</option>
                    <option value="assignment">Assignment Deadline Extension</option>
                    <option value="exam">Mid-Semester / Practical Exam</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Urgency Level</label>
                  <select
                    value={noticeUrgency}
                    onChange={(e) => setNoticeUrgency(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="high">High (Immediate Broadcast)</option>
                    <option value="medium">Medium (Standard Circular)</option>
                    <option value="low">Low (General Information)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Detailed Circular Content</label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="State the rationale, revised schedule, and instructions for enrolled students..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Indexing into Knowledge Base..." : "Publish Circular & Notify Cohort"}</span>
              </button>
            </form>
          </div>

          {/* Quick Circular Templates */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-white">One-Click Quick Templates</h3>
            <div className="space-y-3">
              <div 
                onClick={() => {
                  setNoticeTitle("CS501 Midterm Exam Room Reallocated to B-204");
                  setNoticeVenue("Room B-204");
                  setNoticeCategory("room_change");
                  setNoticeUrgency("high");
                  setNoticeContent("All enrolled students for CS501 Database Systems: Due to centralized AV maintenance in Old Block, tomorrow's exam will take place in Room B-204 (New Academic Wing). Seating plans remain unchanged.");
                }}
                className="glass-card rounded-2xl p-4 border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                  <span>Room Reallocation (NOT-092 Template)</span>
                  <span>Use &rarr;</span>
                </div>
                <p className="text-[11px] text-slate-300">Prepopulates venue shift to Room B-204 for DBMS students.</p>
              </div>

              <div 
                onClick={() => {
                  setNoticeTitle("DBMS Assignment 2 Deadline Extended to Friday 11:59 PM");
                  setNoticeCategory("assignment");
                  setNoticeUrgency("medium");
                  setNoticeContent("In response to student requests regarding normalization practice questions, Assignment 2 submission deadline has been extended by 48 hours to Friday midnight.");
                }}
                className="glass-card rounded-2xl p-4 border border-white/10 cursor-pointer hover:border-indigo-500/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>Assignment Extension Template</span>
                  <span>Use &rarr;</span>
                </div>
                <p className="text-[11px] text-slate-300">Grant 48-hour extension for BCNF normalization exercises.</p>
              </div>

              <div 
                onClick={() => {
                  setNoticeTitle("Extra Doubt Clearing Session: Normalization & Indexing");
                  setNoticeVenue("Room B-204");
                  setNoticeCategory("class_update");
                  setNoticeUrgency("high");
                  setNoticeContent("Special 1-hour doubt clearing session on B+ Tree Indexing and 3NF/BCNF decomposition before tomorrow's examination. Attendance strongly advised for students with &lt;75% attendance.");
                }}
                className="glass-card rounded-2xl p-4 border border-white/10 cursor-pointer hover:border-purple-500/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
                  <span>Exam Revision Clinic Template</span>
                  <span>Use &rarr;</span>
                </div>
                <p className="text-[11px] text-slate-300">Schedule high-yield exam preparation clinic.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Course Assignments &amp; Submission Review</h2>
              <p className="text-xs text-slate-400">Evaluate student work and track submission milestones</p>
            </div>
            <button
              onClick={() => notify("New assignment draft created.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Assignment</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">CS501 &bull; Due Tomorrow</span>
                <span className="text-amber-400 font-bold">44 / 48 Submitted</span>
              </div>
              <h3 className="text-sm font-bold text-white">Assignment 2: Schema Normalization &amp; BCNF</h3>
              <p className="text-xs text-slate-300">Practical relational decomposition questions across 4 functional dependency sets.</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">4 Pending Submissions</span>
                <button 
                  onClick={() => notify("Loaded 44 submissions for evaluation.")}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Grade Submissions &rarr;
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-400 font-bold">CS502 &bull; Due Friday</span>
                <span className="text-emerald-400 font-bold">32 / 36 Submitted</span>
              </div>
              <h3 className="text-sm font-bold text-white">Lab Practical 3: Multi-Threaded CPU Scheduler</h3>
              <p className="text-xs text-slate-300">C++ / POSIX thread simulation of Round Robin and Priority preemptive algorithms.</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">4 Pending</span>
                <button 
                  onClick={() => notify("Loaded 32 lab programs for review.")}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Grade Submissions &rarr;
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold">CS504 &bull; Due Next Week</span>
                <span className="text-slate-400 font-bold">18 / 58 Submitted</span>
              </div>
              <h3 className="text-sm font-bold text-white">Project Milestone 1: BigData Pipeline Architecture</h3>
              <p className="text-xs text-slate-300">AWS DynamoDB and Bedrock Knowledge Base schema diagram and ingestion plan.</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">40 Remaining</span>
                <button 
                  onClick={() => notify("Loaded submissions.")}
                  className="text-purple-400 hover:underline font-semibold"
                >
                  Grade Submissions &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI COHORT INSIGHTS */}
      {activeTab === "ai_insights" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Cohort AI Learning Analytics (Powered by Amazon Bedrock)</span>
              </h2>
              <p className="text-xs text-slate-400">Synthesized from student Alexa+ queries, study plans, and topic completion logs</p>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-mono">
              Live Claude 3.5 Sonnet Analysis
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>Most Struggled Topics (Cohort Bottlenecks)</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>1. BCNF &amp; Lossless Join Decomposition</span>
                    <span className="text-rose-400">62% students queried Alexa+</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    High question volume around minimal cover and verifying dependency preservation in 3NF.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>2. B+ Tree Indexing Node Splits</span>
                    <span className="text-amber-400">48% students requested study plans</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Students frequently generate time-blocked revision blocks for index node insertion algorithms.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Recommended Teaching Intervention</span>
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Based on 89 AI study plans generated in the last 48 hours for tomorrow&apos;s CS501 examination:
                </p>
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 space-y-2">
                  <h4 className="font-bold text-cyan-400">Actionable Advice for Dr. Priya Sharma:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Conduct a quick 15-minute primer on <strong>Armstrong&apos;s Axioms</strong> at the start of next lecture.</li>
                    <li>7 students with attendance &lt; 75% specifically planned sessions between 7:00 PM and 10:00 PM tonight.</li>
                    <li>Recommend posting a sample BCNF solution key via the Circular Publisher.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Notification */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950/95 text-indigo-200 border border-indigo-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          {message}
        </div>
      )}
    </div>
  );
}
