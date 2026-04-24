"use client";

import { LazyMotion, domAnimation } from "motion/react";

/**
 * Wraps children in Framer Motion's LazyMotion with domAnimation features.
 * Use `m.div` / `m.span` etc. (not `motion.div`) for tree-shaken lazy loading.
 */
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
