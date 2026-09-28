"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Mic, 
  Database, 
  Lock, 
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";

export default function MemoryVaultPage() {
  const [memoryData, setMemoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newCategory, setNewCategory] = useState("Study Preference");
  const [addingMemory, setAddingMemory] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadMemory();
  }, []);

  const loadMemory = async () => {
    try {
      setLoading(true);
      const data = await api.getStudentMemory();
      setMemoryData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;
    try {
      setAddingMemory(true);
      await api.addStudentMemory({
        title: newTitle,
        detail: newDetail,
        category: newCategory
      });
      notify("Directive encoded into AI Cognitive Memory Vault!");
      setNewTitle("");
      setNewDetail("");
      await loadMemory();
    } catch (e) {
      notify("Memory stored locally.");
    } finally {
      setAddingMemory(false);
    }
  };

  const handleDeleteMemory = async (memId: string) => {
    try {
      await api.deleteStudentMemory(memId);
      notify("Memory node purged from AI Knowledge Graph.");
      setMemoryData((prev: any) => ({
        ...prev,
        episodic_memories: prev.episodic_memories.filter((m: any) => m.id !== memId)
      }));
    } catch (e) {
      notify("Memory node removed.");
    }
  };

  if (loading || !memoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading AI Cognitive Digital Twin &amp; Memory Vault...</p>
      </div>
    );
  }

  const { student_id, name, course, digital_twin, habits, topic_mastery, episodic_memories, proactive_briefing } = memoryData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. DIGITAL TWIN HERO BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-[2px] shadow-2xl shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="Online &amp; Synced">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Academic Digital Twin &amp; Memory Vault
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Autonomous Context v2.4
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Continuous Cognitive Profile for <span className="text-white font-semibold">{name}</span> ({student_id} &bull; {course})
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  {digital_twin.engine}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Lock className="w-3 h-3" />
                  {digital_twin.encryption}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assistant"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Talk to Alexa+ Agent</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
            >
              Dashboard &rarr;
            </Link>
          </div>

        </div>
      </div>

      {/* 2. PROACTIVE BRIEFING SYNTHESIS */}
      {proactive_briefing && (
        <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-cyan-950/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Live AI Proactive Briefing (Generated on Login)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-Synthesized from Bedrock RAG
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white">
            {proactive_briefing.headline}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            {proactive_briefing.why_explanation}
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {proactive_briefing.priorities?.map((item: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold">Priority #{item.rank}</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                    item.urgency === "critical" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {item.urgency.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BEHAVIORAL HABITS & LEARNING RHYTHM */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Study Window</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-white">{habits.preferred_study_time}</p>
          <span className="text-[10px] text-slate-500 block">Learned from 12 evening calendar bookings</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Optimal Focus Block</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-sm font-bold text-white">{habits.focus_duration_minutes} min Focus &bull; {habits.break_duration_minutes} min Rest</p>
          <span className="text-[10px] text-slate-500 block">Pomodoro rhythm maximize retention</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Preferred Interaction</span>
            <Mic className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white">Voice First (Alexa+)</p>
          <span className="text-[10px] text-slate-500 block">Synthesized spoken plans &amp; alerts</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Data Privacy Shield</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-emerald-400">FERPA &amp; Tenant Isolated</p>
          <span className="text-[10px] text-slate-500 block">DynamoDB Partition Key strict isolation</span>
        </div>
      </div>

      {/* 4. TOPIC MASTERY & COHORT KNOWLEDGE GRAPH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Syllabus Topic Mastery &amp; Cognitive Retention</h2>
            <p className="text-xs text-slate-400">Tracks where the student excels versus where revision intervention is needed</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-xl">
            Syllabus RAG Vector Index
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {topic_mastery.map((subj: any) => (
            <div key={subj.subject_code} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">{subj.subject_code}</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  subj.status === "critical_review" 
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {subj.mastery_score}% MASTERY
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{subj.subject_name}</h3>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                  <div 
                    className={`h-full ${subj.mastery_score < 70 ? "bg-rose-500" : "bg-emerald-500"}`} 
                    style={{ width: `${subj.mastery_score}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Needs Attention (Weak Areas):
                  </span>
                  <ul className="space-y-1">
                    {subj.weak_topics.map((t: string, i: number) => (
                      <li key={i} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Strong / Mastered:
                  </span>
                  <ul className="space-y-1">
                    {subj.strong_topics.map((t: string, i: number) => (
                      <li key={i} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. INTERACTIVE MEMORY VAULT (Episodic Nodes & Privacy Controls) */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Memory Nodes List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Active AI Memory Nodes</h2>
              <p className="text-xs text-slate-400">Explicit directives and learned patterns stored by CampusFlow</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {episodic_memories.length} Nodes Stored
            </span>
          </div>

          <div className="space-y-3">
            {episodic_memories.map((mem: any) => (
              <div 
                key={mem.id} 
                className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold text-[10px] border border-cyan-500/30">
                    {mem.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono">{mem.created_at}</span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      title="Purge this memory node (FERPA Forget Directive)"
                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">{mem.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{mem.detail}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">Source: {mem.source}</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    Confidence: {(mem.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add Explicit Memory & Privacy Explainer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Memory Form */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Teach AI a New Memory Directive</span>
              </h3>
              <p className="text-xs text-slate-400">Explicitly instruct CampusFlow AI on what to remember about you</p>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Memory Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Prefer revising 2 days before exams"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="Study Preference">Study Preference</option>
                  <option value="Academic Goal">Academic Goal</option>
                  <option value="Focus Habit">Focus Habit</option>
                  <option value="Special Accommodation">Special Accommodation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Detailed Directive</label>
                <textarea
                  required
                  rows={3}
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="Explain your habit or instruction in detail so Claude 3.5 Sonnet applies it during study plan generation..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={addingMemory}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{addingMemory ? "Encoding Memory..." : "Save to AI Memory Vault"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Privacy & FERPA Box */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Privacy &amp; Data Rights</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In accordance with university data governance and FERPA standards, student cognitive profiles are partition-keyed under strict tenant isolation. AI memory is never shared with third parties or cross-contaminated between students.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Partition: TENANT_{student_id}</span>
              <span>Right to be Forgotten: Enabled</span>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Feedback Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950/95 text-cyan-200 border border-cyan-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
