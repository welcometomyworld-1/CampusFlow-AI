"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Cloud,
  Terminal,
  Clock,
  Zap,
  Target
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 -z-10 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand Icon Showcase */}
        <div className="w-20 h-20 rounded-3xl overflow-hidden p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-2xl shadow-cyan-500/30 mb-6 hover:scale-105 transition-transform">
          <img src="/logo.jpg" alt="CampusFlow AI Logo" className="w-full h-full object-cover rounded-[22px]" />
        </div>

        {/* Product Release Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Next-Gen Academic Operating System &bull; Autonomous AI Agent</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-mono">v2.4 Production Release</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            One Goal. One Conversation.
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Every Academic Action.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
          Turn scattered academic information into personalized actions, study plans, reminders, and decisions through an MCP-powered autonomous agent.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/assistant"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
          >
            <Mic className="w-4 h-4" />
            Launch Alexa+ Assistant
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm glass-card text-slate-200 hover:text-white hover:border-slate-500 transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Explore Student Dashboard
          </Link>
        </div>

        {/* Hero Interactive Terminal Mockup */}
        <div className="w-full max-w-4xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 text-left overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">CampusFlow AI • Simulated Alexa+ Session</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Protocol: MCP Streamable HTTP
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">AK</span>
              <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-white/5 text-slate-200">
                &ldquo;Prepare me for tomorrow.&rdquo;
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-black shrink-0">AI</div>
              <div className="bg-slate-900/90 p-4 rounded-2xl rounded-tl-none border border-cyan-500/30 text-slate-200 space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                  <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> get_exam_schedule (DBMS 10:00 AM)
                  </span>
                  <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> search_college_notices (Room B-204)
                  </span>
                  <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> create_study_plan (7–9 PM)
                  </span>
                </div>
                <p className="font-semibold text-white">
                  You have your DBMS exam tomorrow at 10:00 AM in Room B-204 (updated via official circular).
                </p>
                <p className="text-slate-300 text-xs">
                  I prioritized your 3 incomplete topics (<span className="text-cyan-300">Normalization, Transactions, Indexing</span>) into a 2-hour study plan tonight starting at 7:00 PM. Would you like me to set a reminder?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE REAL PROBLEM STATEMENT */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">The Real Challenge</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            Information Is Scattered. Context Is Disconnected.
          </h3>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Students manage academic data across isolated portals. Answering a simple question isn&apos;t enough—the system must connect context and act.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Traditional Chatbot Failure */}
          <div className="glass-card p-6 rounded-2xl border-rose-500/20 bg-rose-950/10">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-3">
              <AlertTriangle className="w-4 h-4" /> Traditional Chatbot (Question &rarr; Answer)
            </div>
            <p className="text-xs text-slate-300 mb-3">
              <strong>Student:</strong> &ldquo;I have my DBMS exam tomorrow. Prepare me.&rdquo;
            </p>
            <div className="bg-black/40 p-3 rounded-xl border border-rose-500/20 text-xs text-slate-400 font-mono">
              &ldquo;Make sure to get a good night sleep, review your textbook chapters, make flashcards, and arrive 15 minutes early! Good luck!&rdquo;
            </div>
            <p className="text-[11px] text-rose-300/80 mt-3">
              &times; No awareness of exam room update<br />
              &times; Doesn&apos;t know student&apos;s pending topics<br />
              &times; Ignores 72% attendance threshold<br />
              &times; Cannot take real action or set reminders
            </p>
          </div>

          {/* CampusFlow AI Advantage */}
          <div className="glass-card p-6 rounded-2xl border-cyan-500/30 bg-cyan-950/10">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-3">
              <Zap className="w-4 h-4" /> CampusFlow AI (Goal &rarr; Context &rarr; Action)
            </div>
            <p className="text-xs text-slate-300 mb-3">
              <strong>Student:</strong> &ldquo;Prepare me for tomorrow.&rdquo;
            </p>
            <div className="bg-black/40 p-3 rounded-xl border border-cyan-500/30 text-xs text-cyan-200 font-mono">
              &ldquo;Analyzed timetable, 72% attendance alert, circular NOT-092 (Room B-204), and 3 incomplete syllabus topics. Generated 7:00 PM study plan and reminder.&rdquo;
            </div>
            <p className="text-[11px] text-cyan-300/80 mt-3">
              &check; Discovers exam relocated to Room B-204 via RAG<br />
              &check; Pinpoints Normalization, Transactions, B+ Trees<br />
              &check; Warns on attendance condonation requirements<br />
              &check; Creates real reminders &amp; tasks via MCP tools
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: THE 6-STEP AGENT ENGINE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Autonomous Reasoning Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            From Natural Language to Real Academic Action
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { step: "01", name: "GOAL", desc: "User expresses natural high-level objective ('Prepare me for tomorrow').", color: "from-cyan-500 to-blue-500" },
            { step: "02", name: "CONTEXT", desc: "Retrieves student identity, timetable, course registrations, and preferences.", color: "from-blue-500 to-indigo-500" },
            { step: "03", name: "REASONING", desc: "Amazon Bedrock evaluates deadlines, weightages, and urgency factors.", color: "from-indigo-500 to-purple-500" },
            { step: "04", name: "MCP TOOLS", desc: "Invokes Streamable HTTP tools for exams, syllabus, progress, and notices.", color: "from-purple-500 to-pink-500" },
            { step: "05", name: "ACTION", desc: "Generates time-blocked study plans, schedules reminders, and creates tasks.", color: "from-pink-500 to-amber-500" },
            { step: "06", name: "CONFIRM", desc: "Provides transparent explainable rationale and voice confirmation.", color: "from-amber-500 to-emerald-500" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500">{item.step}</span>
                <h4 className="text-sm font-extrabold text-white mt-1 tracking-tight">{item.name}</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${item.color} mt-4`} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. MCP ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Model Context Protocol</span>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">
              Real MCP Server over Streamable HTTP
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Compliant with the official MCP 2024-11-05 specification. Supports Server-Sent Events (SSE) streaming sessions, JSON-RPC 2.0 tool discovery, input validation schemas, and remote accessibility.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 font-mono">18 Standardized MCP Tools</span>
                <p className="text-slate-400">
                  Student profiles, timetable, exams, attendance, syllabus, notice retrieval, reminders, and study plans.
                </p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-purple-300 font-mono">Streamable HTTP Transport</span>
                <p className="text-slate-400">
                  Live SSE stream (/sse) and JSON-RPC dispatch (/messages) ready for Alexa+ integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AWS ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Cloud Infrastructure</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            Enterprise Cloud Architecture
          </h3>
          <p className="text-slate-400 text-sm mt-3">
            Architected for institutional high-availability, sub-second latency, and bank-grade data isolation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border-white/10">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Amazon Bedrock</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Claude 3.5 Sonnet performs natural language understanding, multi-tool planning, and grounded synthesis without hallucination.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Amazon DynamoDB</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Provides millisecond persistence for student profiles, attendance records, study plans, reminders, and tool execution logs.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Cloud className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Bedrock KB &amp; S3</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              S3 bucket stores official circulars and syllabi, indexed by Bedrock Knowledge Bases for high-precision RAG citations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Amazon Cognito</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              OAuth 2.0 / PKCE authentication architecture enforcing strict per-student isolation and token validation.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-slate-950 flex flex-col items-center">
          <Sparkles className="w-10 h-10 text-cyan-400 mb-4 animate-bounce" />
          <h3 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mb-4">
            Experience the Future of Academic Productivity.
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mb-8">
            Experience real AI-driven academic action orchestration. Convert high-level goals into personalized schedules and reminders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/assistant"
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all"
            >
              Open CampusFlow Assistant
            </Link>
            <Link
              href="/admin"
              className="px-6 py-4 rounded-xl font-bold text-sm glass-card text-slate-300 hover:text-white"
            >
              University Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-8 max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
        <p>&copy; {new Date().getFullYear()} CampusFlow AI &bull; All Rights Reserved &bull; Powered by Amazon Bedrock &amp; Model Context Protocol</p>
        <p className="text-[11px] text-slate-600">Enterprise AI Academic Operating System. Built with Next.js, FastAPI, and Streamable HTTP MCP.</p>
      </footer>

    </div>
  );
}
