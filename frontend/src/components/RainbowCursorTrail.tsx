"use client";

import React, { useEffect, useRef, useState } from "react";

export default function RainbowCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check local storage for preference
    const saved = localStorage.getItem("campusflow_particle_trail");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }

    // Listen to custom toggle events if triggered elsewhere
    const handleToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setIsEnabled(e.detail.enabled);
    };
    window.addEventListener("toggle-particle-trail" as any, handleToggle);
    return () => {
      window.removeEventListener("toggle-particle-trail" as any, handleToggle);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = {
      x: -100,
      y: -100,
      prevX: -100,
      prevY: -100,
      active: false,
    };

    let globalHue = 0;
    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      hue: number;
      vx: number;
      vy: number;
      size: number;
      initialSize: number;
      decay: number;
      life: number;

      constructor(x: number, y: number, hue: number) {
        this.x = x;
        this.y = y;
        this.hue = hue;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.15; // Gentle upward drift

        this.size = Math.random() * 2.6 + 1.6; // Small, delicate particle
        this.initialSize = this.size;
        this.decay = Math.random() * 0.032 + 0.022; // Dissolves quickly and smoothly
        this.life = 1.0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.life -= this.decay;
        this.size = Math.max(0, this.initialSize * this.life);
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();

        // Soft, non-glaring opacity (max 40%)
        const alpha = Math.max(0, this.life * 0.42);
        
        // Gentle, soft bloom
        c.shadowBlur = 6;
        c.shadowColor = `hsla(${this.hue}, 75%, 55%, ${alpha * 0.7})`;

        // Outer soft rainbow circle
        c.fillStyle = `hsla(${this.hue}, 80%, 60%, ${alpha})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();

        // Subtle soft spark center (not harsh white)
        c.fillStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        c.fill();

        c.restore();
      }
    }

    // Spawn interpolated particles between mouse moves to prevent gaps
    const spawnParticles = (cx: number, cy: number, px: number, py: number) => {
      const dx = cx - px;
      const dy = cy - py;
      const dist = Math.hypot(dx, dy);

      // Only interpolate if mouse moved a reasonable distance
      if (dist > 500) return; // Ignore large jumps

      const steps = Math.min(Math.max(Math.floor(dist / 7), 1), 16);

      for (let i = 0; i < steps; i++) {
        const factor = i / steps;
        const x = px + dx * factor;
        const y = py + dy * factor;

        globalHue = (globalHue + 0.8) % 360;

        particles.push(
          new Particle(
            x + (Math.random() - 0.5) * 3,
            y + (Math.random() - 0.5) * 3,
            globalHue
          )
        );
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouse.active) {
        mouse.x = mouse.prevX = e.clientX;
        mouse.y = mouse.prevY = e.clientY;
        mouse.active = true;
        return;
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      spawnParticles(mouse.x, mouse.y, mouse.prevX, mouse.prevY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (!mouse.active) {
          mouse.x = mouse.prevX = touch.clientX;
          mouse.y = mouse.prevY = touch.clientY;
          mouse.active = true;
          return;
        }
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;

        spawnParticles(mouse.x, mouse.y, mouse.prevX, mouse.prevY);
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const animate = () => {
      // Clear overlay canvas transparently so UI remains 100% visible
      ctx.clearRect(0, 0, width, height);

      // Soft screen blend mode for gentle, elegant glow without blinding over-exposure
      ctx.globalCompositeOperation = "screen";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      ctx.globalCompositeOperation = "source-over";
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] w-full h-full"
      style={{
        pointerEvents: "none",
      }}
    />
  );
}
