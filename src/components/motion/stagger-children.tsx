"use client";

import { m, type Variants } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

type ContainerTag = "div" | "section" | "ul";

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  as?: ContainerTag;
}

const containerVariants = (staggerDelay: number, initialDelay: number): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

const childVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut" as const, duration: 0.4 } },
});

/**
 * Stagger-animates immediate children as they enter the viewport.
 * Each immediate child should be a `<RevealChild>`.
 * Exports `<RevealChild>` sub-component for the child variant.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.06,
  initialDelay = 0,
  y = 16,
  once = true,
  className,
  as = "div",
}: StaggerChildrenProps) {
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

interface RevealChildProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "tr";
  y?: number;
}

/**
 * Child wrapper for use inside `<StaggerChildren>`.
 * Picks up the parent's stagger variant automatically.
 */
export function RevealChild({ children, className, as = "div", y = 16 }: RevealChildProps) {
  const motionOk = useMotionOk();

  if (!motionOk) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = m[as] as typeof m.div;
  return (
    <Component className={className} variants={childVariants(y)}>
      {children}
    </Component>
  );
}
