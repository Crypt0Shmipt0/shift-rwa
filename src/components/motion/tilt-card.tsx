"use client";

import React, { useRef } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

export interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;   // degrees, default 8
  scale?: number;     // hover scale, default 1.02
  glare?: boolean;    // default true — mint radial-gradient on pointer position
  className?: string;
}

/**
 * Mouse-tracked 3-D tilt card with optional mint glare.
 * Falls back to a plain div when reduced-motion is preferred.
 */
export function TiltCard({
  children,
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  className,
}: TiltCardProps) {
  const motionOk = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse-position motion values in the range [-1, 1]
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Springy interpolations
  const springCfg = { stiffness: 300, damping: 30 };
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-maxTilt, maxTilt]), springCfg);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [maxTilt, -maxTilt]), springCfg);
  const springScale = useSpring(1, springCfg);

  if (!motionOk) {
    return <div className={className}>{children}</div>;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseEnter() {
    springScale.set(scale);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    glareX.set(50);
    glareY.set(50);
    springScale.set(1);
  }

  return (
    <m.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{
        rotateX,
        rotateY,
        scale: springScale,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <m.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(38,200,184,0.18) 0%, transparent 60%)`,
            ),
          }}
        />
      )}
    </m.div>
  );
}
