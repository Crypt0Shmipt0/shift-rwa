"use client";

/**
 * Data-mist — a CPU-driven `<canvas>` that draws 200-400 tiny mint-tinted
 * particles drifting upward + sideways with a fade-in/out cycle. Used as an
 * ambient backdrop for sections where a full WebGL pass is overkill.
 *
 * Cheap by design:
 *  - Single 2D context, no path stroking — `fillRect` (or arc) + globalAlpha.
 *  - Particle count adapts to viewport: 400 desktop / 200 mobile.
 *  - Devicepixelratio capped at 2 to keep fragment cost down on retina.
 *  - prefers-reduced-motion → static frame, no rAF loop.
 *  - Visibility-driven: rAF only runs while the canvas is in the viewport
 *    (IntersectionObserver) and tab is focused (Page Visibility API).
 *
 * No shaders, no WebGL — works everywhere a 2D canvas does. If the canvas
 * context can't be acquired (very old browser), we silently render nothing
 * and the section's ordinary background shows through unchanged.
 */

import { useEffect, useRef } from "react";
import { useMotionOk } from "@/hooks/use-motion-ok";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** life in [0, 1] — drives alpha fade in/out via sin curve */
  life: number;
  /** total lifespan in seconds */
  lifespan: number;
  /** age in seconds */
  age: number;
  /** hue tint 0..1 — interpolates between mint (0) and steel (1) */
  hue: number;
}

export interface DataMistProps {
  className?: string;
  /** Density factor — multiplies the base particle count. Default 1. */
  density?: number;
  /** Max alpha for any single particle. Default 0.55. */
  maxAlpha?: number;
}

/* ─── Brand colors as RGB triples (parsed once at module load) ───────────── */
const MINT_RGB = [38, 200, 184] as const;
const STEEL_RGB = [7, 99, 140] as const;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function makeParticle(w: number, h: number, fresh = false): Particle {
  // When the canvas resizes, fresh=true recycles a particle from a random
  // y position; otherwise we spawn near the bottom and let it drift up.
  return {
    x: Math.random() * w,
    y: fresh ? Math.random() * h : h + Math.random() * 60,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -0.25 - Math.random() * 0.45,
    r: 0.6 + Math.random() * 1.6,
    life: 0,
    lifespan: 6 + Math.random() * 8,
    age: 0,
    hue: Math.random(),
  };
}

export default function DataMist({
  className = "",
  density = 1,
  maxAlpha = 0.55,
}: DataMistProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionOk = useMotionOk();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return; // graceful: render nothing

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let inView = true;
    let visible = !document.hidden;
    let rafId = 0;
    let lastT = performance.now();

    const baseCount = window.innerWidth < 640 ? 200 : 400;
    const targetCount = Math.round(baseCount * density);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-seed particle pool — sparse if we just lost a bunch, full if first
      // mount.
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () =>
          makeParticle(width, height, true),
        );
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(makeParticle(width, height, true));
        }
      }
    };

    const drawFrame = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (motionOk) {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          p.age += dt;
        }

        // Recycle when out of bounds or expired
        if (p.age > p.lifespan || p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[i] = makeParticle(width, height, false);
          continue;
        }

        // Fade in/out via a sine over the lifespan — 0 at edges, 1 mid-life
        const t = p.age / p.lifespan;
        const fade = Math.sin(t * Math.PI);
        const alpha = fade * maxAlpha;

        // Mix mint → steel by hue
        const r = lerp(MINT_RGB[0], STEEL_RGB[0], p.hue * 0.5);
        const g = lerp(MINT_RGB[1], STEEL_RGB[1], p.hue * 0.5);
        const b = lerp(MINT_RGB[2], STEEL_RGB[2], p.hue * 0.5);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000); // clamp big tab-switch deltas
      lastT = now;
      drawFrame(dt);
      if (motionOk && inView && visible) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (rafId) return;
      lastT = performance.now();
      if (motionOk && inView && visible) {
        rafId = requestAnimationFrame(loop);
      } else {
        // Static frame — render once and stop.
        drawFrame(0);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    resize();
    startLoop();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          if (inView) startLoop();
          else stopLoop();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [motionOk, density, maxAlpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        // Subtle screen blend so the dots glow over the dark bg without
        // looking like opaque pixels.
        mixBlendMode: "screen",
      }}
    />
  );
}
