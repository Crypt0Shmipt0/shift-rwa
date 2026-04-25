"use client";

import React, { useRef } from "react";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

export interface MagneticProps {
  children: React.ReactNode;
  /**
   * 0–1 — fraction of cursor delta to translate the child by. 0.3 = subtle.
   */
  strength?: number;
  /**
   * Radius (px) of the magnetic field beyond the bounding box. The cursor only
   * starts pulling once it enters this expanded box.
   */
  radius?: number;
  /**
   * If true, the inner element snaps back to centre on every pointermove that
   * falls outside the field. Default: false (only resets on pointerleave).
   */
  reset?: boolean;
  /**
   * Disable the trailing mint glow. Default: false (glow ON).
   */
  noGlow?: boolean;
  className?: string;
}

/**
 * Magnetic — pulls the child slightly toward the cursor on hover, springs back
 * on leave. Adds a soft mint glow that intensifies as the cursor approaches
 * centre. Touch devices and reduced-motion users get an inert pass-through.
 *
 * Usage:
 *   <Magnetic strength={0.35}>
 *     <a className="btn-primary" href="/app">Launch App</a>
 *   </Magnetic>
 *
 * The wrapper is `inline-block` so it never disrupts surrounding layout. The
 * child is translated via `transform: translate3d(...)` so layout-related
 * properties (width, baseline, line-height) stay stable.
 */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 24,
  reset = false,
  noGlow = false,
  className,
}: MagneticProps) {
  const motionOk = useMotionOk();
  const ref = useRef<HTMLSpanElement>(null);

  // Raw cursor offset from element centre, in pixels.
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);

  // Spring the offset for that buttery follow.
  const springCfg = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(dx, springCfg);
  const y = useSpring(dy, springCfg);

  // 0 → 1 proximity to centre, used to fade in the glow.
  const proximity = useMotionValue(0);
  const glowOpacity = useSpring(proximity, { stiffness: 180, damping: 22 });
  const glowScale = useTransform(glowOpacity, [0, 1], [0.85, 1.15]);

  function isFinePointer() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  }

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (!isFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distX = e.clientX - cx;
    const distY = e.clientY - cy;

    // Reject if outside the magnetic field. Distance from center to nearest
    // edge plus `radius` gives the active envelope.
    const halfW = rect.width / 2 + radius;
    const halfH = rect.height / 2 + radius;
    const insideX = Math.abs(distX) <= halfW;
    const insideY = Math.abs(distY) <= halfH;
    if (!insideX || !insideY) {
      if (reset) {
        dx.set(0);
        dy.set(0);
        proximity.set(0);
      }
      return;
    }

    dx.set(distX * strength);
    dy.set(distY * strength);

    // Proximity: 1 at centre → 0 at the field edge.
    const nx = Math.min(1, Math.abs(distX) / halfW);
    const ny = Math.min(1, Math.abs(distY) / halfH);
    const dist = Math.min(1, Math.hypot(nx, ny));
    proximity.set(1 - dist);
  }

  function onPointerLeave() {
    dx.set(0);
    dy.set(0);
    proximity.set(0);
  }

  if (!motionOk) {
    return (
      <span className={className} style={{ display: "inline-block" }}>
        {children}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", position: "relative" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {!noGlow && (
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(38,200,184,0.55) 0%, rgba(38,200,184,0.18) 35%, transparent 70%)",
            filter: "blur(18px)",
            opacity: glowOpacity,
            scale: glowScale,
          }}
        />
      )}
      <m.span style={{ x, y, display: "inline-block", willChange: "transform" }}>
        {children}
      </m.span>
    </span>
  );
}
