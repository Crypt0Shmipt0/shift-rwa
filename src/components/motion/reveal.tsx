"use client";

import React from "react";
import { m, type Variants } from "motion/react";
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
  /**
   * Visual variant. `"fade-up"` (default) — original behaviour.
   * `"blur-up"` — blur(8px)+y:20+opacity 0 → blur(0)+y:0+opacity 1, 700ms.
   */
  variant?: "fade-up" | "blur-up";
}

/**
 * Fade-up reveal on scroll. Uses `m.*` (lazy motion) primitives.
 * When motion is not permitted, renders children in final visible state immediately.
 */
export function Reveal({
  children,
  delay = 0,
  duration,
  y = 20,
  once = true,
  className,
  as = "div",
  variant = "fade-up",
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

  const isBlur = variant === "blur-up";
  const dur = duration ?? (isBlur ? 0.7 : 0.5);

  const initial = isBlur
    ? { opacity: 0, y, filter: "blur(8px)" }
    : { opacity: 0, y };
  const whileInView = isBlur
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 1, y: 0 };

  return (
    <Component
      initial={initial}
      whileInView={whileInView}
      viewport={{ once }}
      transition={{ duration: dur, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Stagger orchestrator — drop-in container that staggers any child
// implementing the `revealItemVariants` variant. Children opt in by
// rendering as `<RevealItem>` (or any motion node with `variants` matching
// the parent's `show` cascade).
// ─────────────────────────────────────────────────────────────────────────

const containerVariants = (staggerDelay: number, initialDelay: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const revealBlurUpVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

interface RevealStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
}

/**
 * RevealStagger — orchestrator that triggers a cascade animation on its
 * children when scrolled into view. Each `<RevealItem>` (or any node
 * carrying `variants` matching `revealItemVariants`) animates in offset by
 * `staggerDelay` (default 80ms).
 */
export function RevealStagger({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  once = true,
  className,
  as = "div",
}: RevealStaggerProps) {
  const motionOk = useMotionOk();
  const Container = m[as] as typeof m.div;

  if (!motionOk) {
    const StaticContainer = as;
    return <StaticContainer className={className}>{children}</StaticContainer>;
  }

  return (
    <Container
      className={className}
      variants={containerVariants(staggerDelay, initialDelay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
    >
      {children}
    </Container>
  );
}

interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span" | "p";
  /**
   * `"fade-up"` (default) or `"blur-up"`.
   */
  variant?: "fade-up" | "blur-up";
}

/**
 * RevealItem — child of `<RevealStagger>` that picks up the parent
 * orchestration. Use `variant="blur-up"` for the cinematic blur entrance.
 */
export function RevealItem({
  children,
  className,
  as = "div",
  variant = "fade-up",
}: RevealItemProps) {
  const motionOk = useMotionOk();

  if (!motionOk) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = m[as] as typeof m.div;
  const variants = variant === "blur-up" ? revealBlurUpVariants : revealItemVariants;

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SplitText — split-by-word reveal. Splits a string into <span>s wrapped
// in motion items; each word animates in on the parent's stagger cascade.
// Place inside a `<RevealStagger>` for the full cinematic effect, or use
// standalone (it instantiates its own mini-orchestrator).
// ─────────────────────────────────────────────────────────────────────────

interface SplitTextProps {
  text: string;
  className?: string;
  /**
   * Stagger between words in seconds. Default 0.06.
   */
  staggerDelay?: number;
  /**
   * If true, render its own stagger orchestrator. If false, expects a parent
   * `<RevealStagger>` ancestor. Default true.
   */
  standalone?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function SplitText({
  text,
  className,
  staggerDelay = 0.06,
  standalone = true,
  as = "span",
}: SplitTextProps) {
  const motionOk = useMotionOk();
  const Container = m[as] as typeof m.div;

  if (!motionOk) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(/(\s+)/);
  const items = words.map((w, i) => {
    if (/^\s+$/.test(w)) return <React.Fragment key={`s-${i}`}>{w}</React.Fragment>;
    return (
      <m.span
        key={`w-${i}`}
        variants={wordVariants}
        style={{ display: "inline-block", whiteSpace: "pre" }}
      >
        {w}
      </m.span>
    );
  });

  if (!standalone) {
    return <Container className={className}>{items}</Container>;
  }

  return (
    <Container
      className={className}
      variants={containerVariants(staggerDelay, 0)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {items}
    </Container>
  );
}
