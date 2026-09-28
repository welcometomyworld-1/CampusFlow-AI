"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

export type AlexaState = 
  | "IDLE" 
  | "LISTENING" 
  | "TRANSCRIBING" 
  | "THINKING" 
  | "CALLING TOOLS" 
  | "RESPONDING" 
  | "COMPLETE";

interface AlexaVoiceVisualizerProps {
  state: AlexaState;
  onVoiceTrigger?: () => void;
  isListening?: boolean;
}

export default function AlexaVoiceVisualizer({
  state,
  onVoiceTrigger,
  isListening = false,
}: AlexaVoiceVisualizerProps) {
  const [pulseLevel, setPulseLevel] = useState(1);

  // Dynamic pulse simulation
  useEffect(() => {
    if (state === "LISTENING" || state === "CALLING TOOLS" || state === "RESPONDING") {
      const interval = setInterval(() => {
        setPulseLevel(Math.random() * 0.4 + 0.9);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setPulseLevel(1);
    }
  }, [state]);

  const getStateDetails = () => {
    switch (state) {
      case "LISTENING":
        return {
          label: "Listening to your academic request...",
          color: "from-cyan-400 to-blue-500",
          ringColor: "border-cyan-400",
          icon: Mic,
          badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        };
      case "TRANSCRIBING":
        return {
          label: "Transcribing voice input...",
          color: "from-blue-400 to-indigo-500",
          ringColor: "border-blue-400",
          icon: Sparkles,
          badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        };
      case "THINKING":
        return {
          label: "Amazon Bedrock reasoning & planning goal...",
          color: "from-purple-400 to-pink-500",
          ringColor: "border-purple-400",
          icon: Cpu,
          badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "CALLING TOOLS":
        return {
          label: "Executing Model Context Protocol (MCP) tools...",
          color: "from-amber-400 to-orange-500",
          ringColor: "border-amber-400",
          icon: Cpu,
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      case "RESPONDING":
        return {
          label: "Alexa+ synthesizing answer & action confirmations...",
          color: "from-emerald-400 to-teal-500",
          ringColor: "border-emerald-400",
          icon: Volume2,
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "COMPLETE":
        return {
          label: "Action completed successfully.",
          color: "from-cyan-400 to-emerald-400",
          ringColor: "border-emerald-400",
          icon: CheckCircle2,
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      default:
        return {
          label: "Tap microphone or choose a quick prompt to begin",
          color: "from-slate-600 to-slate-400",
          ringColor: "border-slate-700",
          icon: Mic,
          badgeBg: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  const details = getStateDetails();
  const Icon = details.icon;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Background glow orb */}
      <div 
        className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          state === "IDLE" ? "bg-slate-700" : "bg-cyan-500"
        }`} 
      />

      {/* Simulated Alexa Light Ring */}
      <div className="relative flex items-center justify-center my-3">
        {/* Outer concentric pulsing ring */}
        <div 
          className={`absolute rounded-full border-2 transition-all duration-300 ${details.ringColor} ${
            state !== "IDLE" ? "opacity-60 scale-125 animate-ping" : "opacity-10 scale-100"
          }`}
          style={{ width: "110px", height: "110px" }}
        />

        {/* Middle interactive ring */}
        <div 
          className={`absolute rounded-full border border-white/20 transition-transform duration-300 ${
            state !== "IDLE" ? "scale-110" : "scale-100"
          }`}
          style={{ 
            width: "95px", 
            height: "95px",
            transform: `scale(${pulseLevel * 1.05})`
          }}
        />

        {/* Central Orb Button */}
        <button
          onClick={onVoiceTrigger}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            state !== "IDLE" ? "alexa-orb-active scale-105" : "hover:scale-105"
          } bg-gradient-to-tr ${details.color} p-[2px]`}
          title={isListening ? "Listening... click to stop" : "Click to speak with simulated Alexa+"}
        >
          <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <Icon className={`w-8 h-8 text-white transition-all ${state === "LISTENING" ? "animate-pulse scale-110" : ""}`} />
          </div>
        </button>
      </div>

      {/* State Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${details.badgeBg} flex items-center gap-1.5`}>
          <span className={`w-2 h-2 rounded-full ${state === "IDLE" ? "bg-slate-400" : "bg-cyan-400 animate-ping"}`} />
          {state}
        </span>
      </div>

      {/* State Caption */}
      <p className="mt-2 text-xs text-slate-400 text-center font-medium max-w-sm">
        {details.label}
      </p>

      {/* Architecture Disclaimer */}
      <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1">
        <span>Simulated Alexa+ Interface</span>
        <span>•</span>
        <span>Bedrock Agent & MCP Streamable HTTP</span>
      </div>
    </div>
  );
}
