"use client";

import { Cpu, Database, BookOpen, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

interface MultiAgentGraphProps {
  activeAgent?: string;
}

export default function MultiAgentGraph({ activeAgent }: MultiAgentGraphProps) {
  const agents = [
    {
      id: "orchestrator",
      name: "Goal Planner Agent",
      role: "Intent Parsing & Bedrock Claude 3.5 Sonnet",
      icon: Cpu,
      color: "border-cyan-400 text-cyan-300 bg-cyan-950/40",
      status: "Orchestrating"
    },
    {
      id: "scheduler",
      name: "Academic Scheduler",
      role: "Timetables, Exams & Deadlines (MCP)",
      icon: Clock,
      color: "border-blue-400 text-blue-300 bg-blue-950/40",
      status: "Active"
    },
    {
      id: "syllabus",
      name: "Syllabus & Progress",
      role: "Weightages & Mastery Scoring (MCP)",
      icon: BookOpen,
      color: "border-purple-400 text-purple-300 bg-purple-950/40",
      status: "Active"
    },
    {
      id: "rag",
      name: "Institutional RAG",
      role: "Official Circulars & Policies (Bedrock KB)",
      icon: Database,
      color: "border-amber-400 text-amber-300 bg-amber-950/40",
      status: "Active"
    },
    {
      id: "dispatcher",
      name: "Action Dispatcher",
      role: "Study Plans, Reminders & Tasks (MCP)",
      icon: CheckCircle2,
      color: "border-emerald-400 text-emerald-300 bg-emerald-950/40",
      status: "Active"
    }
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Multi-Agent Collaboration Architecture
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
          Bedrock Agents Orchestration
        </span>
      </div>

      <div className="grid sm:grid-cols-5 gap-2.5">
        {agents.map((ag) => {
          const Icon = ag.icon;
          return (
            <div 
              key={ag.id} 
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${ag.color} hover:scale-105`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold leading-tight text-white">{ag.name}</h4>
                <p className="text-[10px] text-slate-300 mt-1 leading-normal font-sans opacity-90">{ag.role}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
                <span>Status:</span>
                <span className="font-bold text-white">{ag.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
