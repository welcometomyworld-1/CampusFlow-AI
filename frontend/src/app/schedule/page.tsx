"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function SchedulePage() {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.getTimetable();
      setTimetable(res.timetable);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = timetable.filter(
    (t) => t.day_of_week.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Academic Timetable &amp; Schedule</h1>
        <p className="text-xs text-slate-400 mt-1">
          Fall 2026 Semester 5 &bull; B.Tech Computer Science &bull; Apex Technical University
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedDay === day
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "glass-card text-slate-300 hover:text-white"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Class Schedule Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading schedule...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center text-slate-400">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No scheduled lectures for {selectedDay}</h3>
          <p className="text-xs text-slate-500 mt-1">Use this free time for assignment completion and exam revision.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                  {item.subject_code}
                </span>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {item.start_time} &ndash; {item.end_time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{item.subject_name}</h3>
                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.faculty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-300 font-medium">{item.room}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
