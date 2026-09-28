"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, MapPin, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await api.getExams();
      setExams(res.exams);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-black text-white">End-Term Examination Schedule</h1>
        <p className="text-xs text-slate-400 mt-1">
          Fall 2026 &bull; Apex Technical University Controller of Examinations
        </p>
      </div>

      {/* Official Notice Alert Banner for DBMS */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-200 uppercase tracking-wider">
              Urgent Notice ATU/COE/FALL2026/NOT-092
            </span>
            <p className="text-slate-300 mt-0.5">
              Tomorrow&apos;s DBMS exam has been reallocated to <strong className="text-cyan-300">Room B-204</strong> (Science &amp; Tech Wing). Entry into Block A is strictly prohibited due to HVAC repairs.
            </p>
          </div>
        </div>
        <Link 
          href="/notices"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 shrink-0"
        >
          View Full Notice
        </Link>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading examination schedule...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((ex, idx) => {
            const isTomorrow = ex.date === "2026-09-28";
            return (
              <div 
                key={idx}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isTomorrow 
                    ? "border-cyan-500/50 bg-cyan-950/10 shadow-xl shadow-cyan-500/10" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-white/5">
                      {ex.subject_code}
                    </span>
                    {isTomorrow ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        Tomorrow
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">
                        {ex.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{ex.subject_name}</h3>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{ex.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ex.time} ({ex.duration_minutes} mins)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-white">{ex.room}</span>
                    </div>
                  </div>

                  {/* High weightage topics */}
                  {ex.syllabus_topics && ex.syllabus_topics.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        High Weightage Exam Topics:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {ex.syllabus_topics.map((top: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <Link
                    href="/assistant"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Generate Study Plan
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
