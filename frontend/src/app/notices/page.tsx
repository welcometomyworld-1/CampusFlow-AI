"use client";

import { useEffect, useState } from "react";
import { Bell, Search, FileText, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async (query?: string) => {
    try {
      setLoading(true);
      const res = await api.getNotices(query);
      setNotices(res.notices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadNotices(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Institutional Notices &amp; Circulars</h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded official university documentation indexed for Amazon Bedrock RAG retrieval.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars e.g., 'exam room'..."
              className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading institutional circulars...</div>
      ) : notices.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center text-slate-400">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No notices matched your query</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching for &ldquo;room&rdquo;, &ldquo;attendance&rdquo;, or &ldquo;exam&rdquo;.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, idx) => {
            const isHigh = notice.urgency === "high";
            return (
              <div 
                key={idx}
                className={`glass-panel p-6 rounded-3xl border space-y-3 transition-all ${
                  isHigh 
                    ? "border-amber-500/40 bg-amber-950/10 shadow-lg shadow-amber-500/5"
                    : "border-white/10 hover:border-cyan-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isHigh
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-slate-800 text-slate-300 border-white/10"
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300">
                      Ref: {notice.official_ref}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{notice.date_posted}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {notice.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Source Document: {notice.source_document || "RAG Ingestion"}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bedrock Grounded
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
