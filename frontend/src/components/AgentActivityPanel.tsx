"use client";

import { ToolStep } from "@/lib/api";
import { CheckCircle2, Clock, AlertCircle, Terminal, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";

interface AgentActivityPanelProps {
  steps: ToolStep[];
  isStreaming?: boolean;
}

export default function AgentActivityPanel({ steps, isStreaming = false }: AgentActivityPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!steps || steps.length === 0) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
        <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
          <Terminal className="w-5 h-5 text-slate-400" />
        </div>
        <h4 className="text-xs font-semibold text-slate-200">Agent Activity Monitor</h4>
        <p className="text-[11px] text-slate-400 mt-1">
          MCP tool invocations and Bedrock execution telemetry will stream here in real time.
        </p>
      </div>
    );
  }

  const totalDuration = steps.reduce((acc, s) => acc + (s.duration_ms || 0), 0);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            MCP Tool Execution Trace
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{totalDuration.toFixed(1)}ms total</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
            {steps.length} tools
          </span>
        </div>
      </div>

      {/* Step List */}
      <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
        {steps.map((step, idx) => {
          const isExpanded = expandedIndex === idx;
          const isSuccess = step.status === "completed" || step.status === "success";
          const isDenied = step.status === "denied" || step.status === "unauthorized";

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all text-xs ${
                isDenied
                  ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                  : isSuccess
                  ? "bg-slate-900/70 border-white/5 hover:border-cyan-500/30 text-slate-300"
                  : "bg-amber-950/30 border-amber-500/30 text-amber-200"
              }`}
            >
              <div 
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isDenied ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                  )}
                  <span className="font-mono font-semibold text-[11px] text-white">
                    {step.tool_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {step.duration_ms?.toFixed(1) || "0.0"}ms
                  </span>
                  <ChevronRight 
                    className={`w-3 h-3 text-slate-500 transition-transform ${
                      isExpanded ? "rotate-90 text-cyan-400" : ""
                    }`} 
                  />
                </div>
              </div>

              {step.description && (
                <p className="text-[11px] text-slate-400 mt-1 pl-5">
                  {step.description}
                </p>
              )}

              {/* Collapsible raw parameters and result */}
              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-white/5 pl-5 text-[10px] font-mono space-y-1.5">
                  <div>
                    <span className="text-slate-400 uppercase font-bold">Input Parameters:</span>
                    <pre className="bg-black/40 p-2 rounded text-cyan-300 overflow-x-auto mt-0.5">
                      {JSON.stringify(step.parameters, null, 2)}
                    </pre>
                  </div>
                  {step.result && (
                    <div>
                      <span className="text-slate-400 uppercase font-bold">Result Data:</span>
                      <pre className="bg-black/40 p-2 rounded text-slate-300 overflow-x-auto mt-0.5">
                        {JSON.stringify(step.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
