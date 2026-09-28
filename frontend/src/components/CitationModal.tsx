"use client";

import { X, ShieldCheck, FileText, CheckCircle2, Building, Calendar, MapPin, AlertCircle } from "lucide-react";
import { CitationItem } from "@/lib/api";

interface CitationModalProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export default function CitationModal({ citation, onClose }: CitationModalProps) {
  if (!citation) return null;

  const isRoomNotice = citation.official_ref?.includes("NOT-092") || citation.snippet?.includes("Room B-204");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel bg-slate-950/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded Verification
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Score: {(citation.relevance_score * 100).toFixed(0)}%
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                {citation.source_title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institutional Letterhead Simulated Document */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 font-serif text-slate-200">
          <div className="text-center border-b border-white/10 pb-4 font-sans space-y-0.5">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-300">
              APEX TECHNICAL UNIVERSITY
            </h4>
            <p className="text-[11px] text-slate-400">Office of the Controller of Examinations</p>
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-cyan-400 pt-1">
              <span>Ref: {citation.official_ref || "ATU/COE/FALL2026/NOT-092"}</span>
              <span>&bull;</span>
              <span>Date: September 26, 2026</span>
            </div>
          </div>

          {/* Highlighted Passage */}
          <div className="bg-cyan-950/40 border-l-4 border-cyan-400 p-4 rounded-r-xl space-y-2 font-sans text-xs">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
              Grounded Evidence Extracted by RAG:
            </span>
            <p className="text-white leading-relaxed font-medium">
              &ldquo;{citation.snippet}&rdquo;
            </p>
          </div>

          {/* Venue Reallocation Callout */}
          {isRoomNotice && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Original Venue</span>
                Hall A-101 (Block A) &bull; <strong className="text-white">Cancelled</strong>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Confirmed Venue</span>
                Room B-204 (Science &amp; Tech Block, 2nd Floor)
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-slate-400">
            <span>Verified by: Controller of Examinations</span>
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authentic Document
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>CampusFlow RAG &bull; Amazon Bedrock Knowledge Bases</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
