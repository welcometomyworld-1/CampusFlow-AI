"use client";

import { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  color?: string;
  barsCount?: number;
}

export default function AudioWaveform({ 
  isActive, 
  color = "#38BDF8", 
  barsCount = 28 
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barsCount;
      const centerY = height / 2;

      for (let i = 0; i < barsCount; i++) {
        let barHeight = 4;
        if (isActive) {
          // Dynamic sine-modulated height
          const freq1 = Math.sin((i / 3) + phase);
          const freq2 = Math.cos((i / 2) - phase * 1.5);
          barHeight = Math.abs(freq1 * freq2) * (height * 0.75) + 6;
        }

        const x = i * barWidth + 2;
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, "#818CF8");
        gradient.addColorStop(1, "#C084FC");

        ctx.fillStyle = isActive ? gradient : "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 4, barHeight, 3);
        ctx.fill();
      }

      phase += 0.12;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, color, barsCount]);

  return (
    <div className="w-full flex items-center justify-center py-2">
      <canvas 
        ref={canvasRef} 
        width={280} 
        height={48} 
        className="w-full max-w-[280px] h-12"
      />
    </div>
  );
}
