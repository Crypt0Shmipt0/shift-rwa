"use client";

import { useScroll, useSpring, m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

/**
 * Fixed-top 2px mint progress bar driven by scroll position.
 * Renders nothing when motion is not permitted.
 */
export function ScrollProgress() {
  const motionOk = useMotionOk();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!motionOk) return null;

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-mint z-[60] origin-left"
      style={{ scaleX }}
    />
  );
}
