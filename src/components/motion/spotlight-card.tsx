"use client";

import React, { useRef } from "react";
import { useMotionOk } from "@/hooks/use-motion-ok";

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Mint spotlight intensity at hover centre. 0–1. Default 0.18.
   */
  intensity?: number;
  /**
   * Spotlight radius as percentage of card width. Default 40.
   */
  radius?: number;
  /**
   * Render-as element. Default `div`. Use `article`/`section` where semantic.
   */
  as?: "div" | "article" | "section";
}

/**
 * SpotlightCard — wraps children in a relative-positioned surface with a
 * radial-gradient overlay that follows the cursor. Updates `--spot-x` /
 * `--spot-y` on `pointermove`. Reduced-motion or coarse-pointer (touch) users
 * get the static surface unchanged.
 *
 * The gradient sits in an absolutely-positioned aria-hidden child so card
 * content stays fully interactive and unaffected. Drop this around any
 * styled card and it just adds the mint spotlight on top — no global CSS
 * contract required.
 */
export function SpotlightCard({
  children,
  className,
  intensity = 0.18,
  radius = 40,
  as = "div",
}: SpotlightCardProps) {
  const motionOk = useMotionOk();
  const ref = useRef<HTMLElement>(null);

  function isFinePointer() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!motionOk || !isFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
    el.style.setProperty("--spot-opacity", "1");
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot-opacity", "0");
  }

  const cls = `relative isolate overflow-hidden ${className ?? ""}`;
  const style = {
    "--spot-x": "50%",
    "--spot-y": "50%",
    "--spot-opacity": "0",
  } as React.CSSProperties;

  const inner = (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity, 0)",
          background: `radial-gradient(circle ${radius}% at var(--spot-x) var(--spot-y), rgba(38, 200, 184, ${intensity}), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {children}
    </>
  );

  // Concrete branches keep ref + handler types tight under strict TS.
  if (as === "article") {
    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cls}
        style={style}
      >
        {inner}
      </article>
    );
  }
  if (as === "section") {
    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cls}
        style={style}
      >
        {inner}
      </section>
    );
  }
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cls}
      style={style}
    >
      {inner}
    </div>
  );
}
