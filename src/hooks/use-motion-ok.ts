"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` if animations are permitted.
 * Respects BOTH:
 *  - OS-level `prefers-reduced-motion: reduce` media query
 *  - App-level `localStorage["shift:reducedMotion"]` (set by /settings page)
 *
 * Most restrictive wins. SSR-safe: returns `false` during SSR and first render.
 * Subscribes to `matchMedia` change events so OS toggles update at runtime.
 */
export function useMotionOk(): boolean {
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const compute = () => {
      const osReduced = mq.matches;
      let appReduced = false;
      try {
        const raw = localStorage.getItem("shift:reducedMotion");
        if (raw !== null) {
          appReduced = JSON.parse(raw) === true;
        }
      } catch {
        // ignore parse errors
      }
      setMotionOk(!osReduced && !appReduced);
    };

    compute();
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  return motionOk;
}
