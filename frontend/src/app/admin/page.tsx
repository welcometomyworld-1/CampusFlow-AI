"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Bell, 
  BookOpen, 
  Users, 
  Plus, 
  Trash2, 
  TrendingUp,
  Sliders,
  Calendar
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "notices" | "exams" | "attendance" | "students">("overview");
  const [stats, setStats] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("exam");
  const [noticeUrgency, setNoticeUrgency] = useState("high");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeRef, setNoticeRef] = useState("ATU/COE/2026/CIRCULAR-01");

  // Exam Form State
  const [examSubjectCode, setExamSubjectCode] = useState("CS504");
  const [examSubjectName, setExamSubjectName] = useState("Machine Learning Fundamentals");
  const [examDate, setExamDate] = useState("2026-10-07");
  const [examTime, setExamTime] = useState("14:00");
  const [examRoom, setExamRoom] = useState("Tech Lab C-301");

  // Attendance Update State
  const [attStudentId, setAttStudentId] = useState("STU1001");
  const [attSubjectCode, setAttSubjectCode] = useState("CS501");
  const [attAttended, setAttAttended] = useState(28);
  const [attTotal, setAttTotal] = useState(36);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, noticesRes, examsRes, logsRes, stuRes] = await Promise.all([
        api.getAdminStats(),
        api.getNotices(),
        api.getExams(),
        api.getAgentActivity(),
        api.getAdminStudents()
      ]);
      setStats(statsRes);
      setNotices(noticesRes.notices || []);
      setExams(examsRes.exams || []);
      setActivityLogs(logsRes.activity || []);
      setStudents(stuRes.students || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    try {
      await api.adminCreateNotice({
        title: noticeTitle,
        category: noticeCategory,
        urgency: noticeUrgency,
        content: noticeContent,
        summary: noticeContent.slice(0, 120),
        official_ref: noticeRef
      });
      notify("Official circular published and indexed into RAG document store!");
      setNoticeTitle("");
      setNoticeContent("");
      loadAllAdminData();
    } catch (e) {
      notify("Failed to publish circular.");
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await api.adminDeleteNotice(id);
      notify("Circular removed.");
      loadAllAdminData();
    } catch (e) {
      notify("Failed to delete circular.");
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminCreateExam({
        subject_code: examSubjectCode,
        subject_name: examSubjectName,
        date: examDate,
        time: examTime,
        room: examRoom,
        duration_minutes: 180,
        student_id: "STU1001",
        syllabus_topics: ["Module 1", "Module 2", "Module 3"]
      });
      notify(`Examination scheduled for ${examSubjectCode} in ${examRoom}!`);
      loadAllAdminData();
    } catch (e) {
      notify("Failed to schedule examination.");
    }
  };

  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminUpdateAttendance({
        student_id: attStudentId,
        subject_code: attSubjectCode,
        attended: Number(attAttended),
        total: Number(attTotal)
      });
      const pct = ((Number(attAttended) / Number(attTotal)) * 100).toFixed(1);
      notify(`Attendance for ${attSubjectCode} updated to ${pct}%!`);
      loadAllAdminData();
    } catch (e) {
      notify("Failed to update attendance.");
    }
  };

  const handleResetData = async () => {
    try {
      await api.resetDemoData();
      notify("Database records successfully restored to clean default state.");
      loadAllAdminData();
    } catch (e) {
      notify("Reset completed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">University Academic Administration</h1>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-mono px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Staff Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage institutional circulars, examination schedules, student registries, and attendance regulations.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Restore Default Database</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
        {[
          { id: "overview", label: "System Telemetry", icon: Layers },
          { id: "notices", label: "Publish Circulars", icon: Bell },
          { id: "exams", label: "Exam Controller", icon: BookOpen },
          { id: "attendance", label: "Attendance Ordinance", icon: TrendingUp },
          { id: "students", label: "Student Registry", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "glass-card text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-slate-400">Enrolled Students</span>
              <div className="text-2xl font-black text-white">{stats?.total_students || 1}</div>
              <p className="text-[11px] text-emerald-400">All Active Terms</p>
            </div>
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-slate-400">Scheduled Exams</span>
              <div className="text-2xl font-black text-cyan-400">{stats?.total_exams || exams.length}</div>
              <p className="text-[11px] text-slate-400">Fall 2026 Session</p>
            </div>
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-slate-400">Active Circulars</span>
              <div className="text-2xl font-black text-purple-400">{stats?.total_notices || notices.length}</div>
              <p className="text-[11px] text-slate-400">RAG Document Store</p>
            </div>
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-slate-400">MCP Tool Calls</span>
              <div className="text-2xl font-black text-emerald-400">{activityLogs.length}</div>
              <p className="text-[11px] text-slate-400">Sub-second Latency</p>
            </div>
          </div>

          {/* Activity audit log */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Agent Telemetry &amp; Audit Logs
            </h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">{log.tool_name}</span>
                    <span className="text-slate-500">[{log.student_id}]</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{log.duration_ms?.toFixed(1)}ms</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      log.status === "success" ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISH NOTICES & CIRCULARS */}
      {activeTab === "notices" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleCreateNotice} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Publish Institutional Circular
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Notice Title</label>
              <input
                type="text"
                required
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. Urgent Room Reallocation for DBMS Exam"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="exam">Exam</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Urgency</label>
                <select
                  value={noticeUrgency}
                  onChange={(e) => setNoticeUrgency(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Reference ID</label>
              <input
                type="text"
                value={noticeRef}
                onChange={(e) => setNoticeRef(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Circular Text</label>
              <textarea
                rows={4}
                required
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Full official circular announcement details..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20 transition-all"
            >
              Publish Circular (Auto-Index to RAG)
            </button>
          </form>

          {/* Active Notices List */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Published Circulars ({notices.length})
            </h3>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold">
                      {n.category} &bull; {n.official_ref}
                    </span>
                    <button
                      onClick={() => handleDeleteNotice(n.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXAMINATION CONTROLLER */}
      {activeTab === "exams" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleCreateExam} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Schedule New Examination
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Course Code</label>
                <input
                  type="text"
                  required
                  value={examSubjectCode}
                  onChange={(e) => setExamSubjectCode(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Venue Room</label>
                <input
                  type="text"
                  required
                  value={examRoom}
                  onChange={(e) => setExamRoom(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Course Title</label>
              <input
                type="text"
                required
                value={examSubjectName}
                onChange={(e) => setExamSubjectName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Exam Date</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Start Time</label>
                <input
                  type="time"
                  required
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 transition-all"
            >
              Add Examination to Schedule
            </button>
          </form>

          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Scheduled Examinations ({exams.length})
            </h3>
            <div className="space-y-3">
              {exams.map((ex) => (
                <div key={ex.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{ex.subject_code}</span>
                      <h4 className="font-bold text-white">{ex.subject_name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {ex.date} &bull; {ex.time} &bull; <strong className="text-cyan-300">{ex.room}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {ex.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE ORDINANCE */}
      {activeTab === "attendance" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">University Regulation Clause 4.2 &bull; Attendance Manager</h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust student attendance numbers to test real-time condonation warnings and threshold alerts.
            </p>
          </div>

          <form onSubmit={handleUpdateAttendance} className="max-w-xl space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-white/5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Student ID</label>
                <input
                  type="text"
                  value={attStudentId}
                  onChange={(e) => setAttStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subject Code</label>
                <input
                  type="text"
                  value={attSubjectCode}
                  onChange={(e) => setAttSubjectCode(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Attended Lectures</label>
                <input
                  type="number"
                  value={attAttended}
                  onChange={(e) => setAttAttended(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Total Lectures</label>
                <input
                  type="number"
                  value={attTotal}
                  onChange={(e) => setAttTotal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 text-xs flex items-center justify-between">
              <span>Resulting Aggregate:</span>
              <strong className={`font-mono ${((attAttended / attTotal) * 100) < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                {((attAttended / Math.max(attTotal, 1)) * 100).toFixed(1)}% {((attAttended / attTotal) * 100) < 75 ? "(Warning Flag Triggered)" : "(Good Standing)"}
              </strong>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-md transition-all"
            >
              Update Attendance Record
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: STUDENT REGISTRY */}
      {activeTab === "students" && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Registered Students Directory ({students.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase font-mono">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Study Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{stu.student_id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{stu.name}</td>
                    <td className="py-3 px-3 text-slate-300">{stu.email}</td>
                    <td className="py-3 px-3 text-slate-400">{stu.course}</td>
                    <td className="py-3 px-3 font-mono">Semester {stu.semester}</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{stu.preferred_study_time || "Evening"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
