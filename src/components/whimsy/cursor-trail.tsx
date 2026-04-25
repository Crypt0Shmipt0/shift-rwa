"use client";

import { useEffect, useRef } from "react";
import { useMotionOk } from "@/hooks/use-motion-ok";

/**
 * Mint sparkler trail behind the cursor while inside a target region
 * (default: the hero section identified by `data-cursor-trail-zone`).
 *
 * Uses a single absolute-positioned canvas overlay sized to the zone,
 * not the viewport — so we don't trigger layout shifts and we don't paint
 * over modals, command palettes, or sticky nav.
 *
 * Skipped entirely when `prefers-reduced-motion` is set.
 */
export function CursorTrail({
  zoneSelector = "[data-cursor-trail-zone]",
}: {
  zoneSelector?: string;
}) {
  const motionOk = useMotionOk();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!motionOk) return;
    if (typeof window === "undefined") return;

    const zone = document.querySelector(zoneSelector) as HTMLElement | null;
    if (!zone) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "5";
    canvasRef.current = canvas;

    // Ensure the zone can host an absolute child.
    const prevPosition = zone.style.position;
    if (!prevPosition) zone.style.position = "relative";
    zone.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      zone.removeChild(canvas);
      if (!prevPosition) zone.style.position = "";
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = zone.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(zone);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    };

    const particles: Particle[] = [];
    let active = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = zone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      // Spawn 1-2 particles per move event (cheap).
      const n = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 0.3 + Math.random() * 0.4,
          life: 0,
          maxLife: 380 + Math.random() * 200,
        });
      }
      // Cap to avoid runaway memory.
      if (particles.length > 120) particles.splice(0, particles.length - 120);
      active = true;
    };

    const onLeave = () => {
      // let particles drain naturally
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        const t = 1 - p.life / p.maxLife;
        const radius = 1.6 * t + 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(38, 200, 184, ${0.55 * t})`;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (active || particles.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const ensureRunning = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onMoveWrapped = (e: MouseEvent) => {
      onMove(e);
      ensureRunning();
    };

    zone.addEventListener("mousemove", onMoveWrapped);
    zone.addEventListener("mouseleave", onLeave);

    return () => {
      zone.removeEventListener("mousemove", onMoveWrapped);
      zone.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (canvas.parentNode === zone) zone.removeChild(canvas);
      if (!prevPosition) zone.style.position = "";
    };
  }, [motionOk, zoneSelector]);

  return null;
}
