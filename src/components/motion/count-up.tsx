"use client";

import { useRef, useEffect } from "react";
import { useMotionValue, useTransform, animate, useInView } from "motion/react";
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
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (v) => {
    const fixed = v.toFixed(decimals);
    return formatter ? formatter(Number(fixed)) : `${prefix}${fixed}${suffix}`;
  });

  useEffect(() => {
    if (!motionOk || !isInView) return;
    const controls = animate(motionValue, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [motionOk, isInView, motionValue, to, duration]);

  const formatFinal = () => {
    const fixed = to.toFixed(decimals);
    return formatter ? formatter(Number(fixed)) : `${prefix}${fixed}${suffix}`;
  };

  if (!motionOk) {
    return <span className={className}>{formatFinal()}</span>;
  }

  return (
    <m.span ref={ref} className={className}>
      {rounded}
    </m.span>
  );
}
