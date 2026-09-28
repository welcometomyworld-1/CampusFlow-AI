"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

interface WhyThisPanelProps {
  explanation?: string;
  insights?: string[];
}

export default function WhyThisPanel({ explanation, insights = [] }: WhyThisPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!explanation && (!insights || insights.length === 0)) return null;

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 overflow-hidden my-2.5 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-indigo-900/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-200">
            Why this recommendation?
          </span>
          <span className="text-[10px] px-2 py-0.2 bg-indigo-500/20 text-indigo-300 rounded-full font-medium">
            Explainable AI
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-indigo-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3 pt-1 border-t border-indigo-500/10 text-xs text-slate-300 space-y-2">
          {explanation && (
            <p className="leading-relaxed text-indigo-100/90 font-medium">
              {explanation}
            </p>
          )}

          {insights.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Contributing Academic Signals:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                {insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
