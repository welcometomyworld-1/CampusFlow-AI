"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from "lucide-react";

interface PomodoroTimerProps {
  topic?: string;
  defaultMinutes?: number;
  reason?: string;
  onComplete?: () => void;
}

export default function PomodoroTimer({
  topic = "Normalization & BCNF Lossless Decomposition",
  defaultMinutes = 40,
  reason,
  onComplete
}: PomodoroTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlightPulse, setHighlightPulse] = useState(false);

  // Sync state when topic or defaultMinutes changes (e.g. when user clicks "Load")
  useEffect(() => {
    setSecondsLeft(defaultMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
    setHighlightPulse(true);
    const t = setTimeout(() => setHighlightPulse(false), 2000);
    return () => clearTimeout(t);
  }, [topic, defaultMinutes]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      stopAmbientSound();
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onComplete]);

  // Ambient focus tone synthesis (binaural 432Hz focus hum using Web Audio API)
  const startAmbientSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(216, ctx.currentTime); // Gentle harmonic root

      gain.gain.setValueAtTime(0.04, ctx.currentTime); // Soft volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsMuted(false);
    } catch (e) {
      // Audio fallback
    }
  };

  const stopAmbientSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch (e) {
      // Audio fallback
    }
    oscillatorRef.current = null;
    audioCtxRef.current = null;
    setIsMuted(true);
  };

  const toggleSound = () => {
    if (isMuted) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning && !isMuted) {
      startAmbientSound();
    } else if (isRunning) {
      stopAmbientSound();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(defaultMinutes * 60);
    setIsCompleted(false);
    stopAmbientSound();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((defaultMinutes * 60 - secondsLeft) / (defaultMinutes * 60)) * 100;

  return (
    <div 
      id="pomodoro-timer-container"
      className={`glass-panel p-6 rounded-3xl border transition-all duration-500 space-y-4 ${
        highlightPulse 
          ? "border-cyan-400 bg-cyan-950/30 ring-4 ring-cyan-500/30 scale-[1.01]" 
          : "border-purple-500/30 bg-purple-950/20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 text-purple-400 ${isRunning ? "animate-spin" : ""}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Active Study Execution Session
          </h3>
          {highlightPulse && (
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/40 animate-pulse">
              Topic Loaded!
            </span>
          )}
        </div>
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
            !isMuted 
              ? "bg-purple-500/30 text-purple-300 border border-purple-400" 
              : "bg-slate-800 text-slate-400"
          }`}
          title="Toggle ambient 432Hz focus hum"
        >
          {!isMuted ? <Volume2 className="w-3 h-3 text-purple-300" /> : <VolumeX className="w-3 h-3" />}
          <span>{!isMuted ? "Focus Sound ON" : "Sound Muted"}</span>
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-white">{topic}</h4>
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            {defaultMinutes} Mins Target
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {reason || `High-yield ${defaultMinutes}-minute focus block prioritized for tomorrow's exam.`}
        </p>
      </div>

      {/* Clock Display */}
      <div className="text-center py-2">
        <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-white">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 transition-all"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? "Pause Focus" : "Start Session"}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {isCompleted && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Session Complete! Topic Marked as Mastered.
          </span>
          <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
            +15% Readiness
          </span>
        </div>
      )}
    </div>
  );
}
