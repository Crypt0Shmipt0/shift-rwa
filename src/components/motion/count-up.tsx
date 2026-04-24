"use client";

import { useEffect } from "react";
import { useMotionValue, useTransform, animate } from "motion/react";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (n: number) => string;
}

/**
 * Animates a number from `from` to `to` when it enters the viewport.
 * Uses useMotionValue + useTransform + animate from motion/react.
 * When motion is not permitted, renders the final formatted value as static text.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  formatter,
}: CountUpProps) {
  const motionOk = useMotionOk();
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (v) => {
    const fixed = v.toFixed(decimals);
    return formatter ? formatter(Number(fixed)) : `${prefix}${fixed}${suffix}`;
  });

  // Animate on mount once motion is permitted.
  // Previously gated on useInView — but useInView never fired reliably for
  // above-the-fold stats (already intersecting at mount), leaving counters
  // stuck at `from`. Dropping the gate: a 1.5s animate is cheap and correct.
  useEffect(() => {
    if (!motionOk) return;
    const controls = animate(motionValue, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [motionOk, motionValue, to, duration]);

  const formatFinal = () => {
    const fixed = to.toFixed(decimals);
    return formatter ? formatter(Number(fixed)) : `${prefix}${fixed}${suffix}`;
  };

  if (!motionOk) {
    return <span className={className}>{formatFinal()}</span>;
  }

  return <m.span className={className}>{rounded}</m.span>;
}
