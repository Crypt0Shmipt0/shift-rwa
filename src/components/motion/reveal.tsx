"use client";

import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

type AllowedTag = "div" | "section" | "span" | "h1" | "h2" | "h3" | "p" | "li";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
  as?: AllowedTag;
}

/**
 * Fade-up reveal on scroll. Uses `m.*` (lazy motion) primitives.
 * When motion is not permitted, renders children in final visible state immediately.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  className,
  as = "div",
}: RevealProps) {
  const motionOk = useMotionOk();

  const Component = m[as] as typeof m.div;

  if (!motionOk) {
    return (
      <Component
        initial={false}
        className={className}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}
