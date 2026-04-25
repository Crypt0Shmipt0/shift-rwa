"use client";

/**
 * ThesisSequence — "Boring. Liquidating." → "SHIFT It."
 *
 * One dramatic state toggle, not scrollytelling:
 *   • Unresolved (default): a red 10× perp chart dumps −100% on a jagged
 *     cliff, flagged LIQUIDATED. Big flashing mint RESOLVE button over it.
 *   • Resolved (after click): the headline morphs to "SHIFT It.", the red
 *     crash fades out and a green stable SHIFT curve fades in with +224%.
 *
 * Reduced motion renders both states without the loop animation; the
 * Resolve button still toggles state.
 */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Zap, ShieldOff, TrendingUp, RotateCcw } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { fireMilestone } from "@/hooks/use-scroll-milestones";

/* ── Brand palette (inline — SVG strokes don't read Tailwind tokens) ─────── */
const MINT = "#26C8B8";
const MINT_SOFT = "#14A6C8";
const DANGER = "#FF4D6A";

/* ── Chart geometry ──────────────────────────────────────────────────────── */
const W = 1000;
const H = 400;

/* Liquidation crash path: moderate red volatility, then a violent cliff
 * dump to the floor where the position gets liquidated and flatlines. */
const CRASH_POINTS: [number, number][] = [
  [0, 110], [50, 95], [100, 125], [150, 100], [200, 140],
  [250, 110], [300, 160], [350, 125], [400, 185], [450, 145],
  [500, 210], [550, 170], [600, 235], [640, 210], [680, 255],
  // cliff dump begins
  [710, 300], [735, 345], [755, 380], [770, 395],
  // liquidated — flatline at bottom
  [800, 398], [860, 399], [920, 400], [1000, 400],
];

/* SHIFT ascending path: smooth compounding line that rides real volatility
 * without blowing up. Gently trending up with organic wobble. */
const STABLE_POINTS: [number, number][] = [
  [0, 320], [60, 305], [120, 312], [180, 290], [240, 295],
  [300, 270], [360, 275], [420, 250], [480, 255], [540, 225],
  [600, 230], [660, 200], [720, 205], [780, 175], [840, 160],
  [900, 135], [960, 110], [1000, 95],
];

/* Konami "BULL MODE" path: starts flat, then goes parabolic and pierces the top. */
const PARABOLIC_POINTS: [number, number][] = [
  [0, 360], [80, 358], [160, 352], [240, 342], [320, 325],
  [400, 300], [480, 260], [560, 210], [640, 150], [720, 90],
  [800, 40], [870, 14], [940, 4], [1000, 0],
];

function toPath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
}

const CRASH_LINE = toPath(CRASH_POINTS);
const STABLE_LINE = toPath(STABLE_POINTS);
const PARABOLIC_LINE = toPath(PARABOLIC_POINTS);
const CRASH_AREA = `${CRASH_LINE} L${W},${H} L0,${H} Z`;
const STABLE_AREA = `${STABLE_LINE} L${W},${H} L0,${H} Z`;
const PARABOLIC_AREA = `${PARABOLIC_LINE} L${W},${H} L0,${H} Z`;

/* ── Component ───────────────────────────────────────────────────────────── */

export function ThesisSequence() {
  const motionOk = useMotionOk();
  const [resolved, setResolved] = useState(false);
  const [bullMode, setBullMode] = useState(false);
  const [burstAt, setBurstAt] = useState<{ x: number; y: number; key: number } | null>(
    null
  );
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Sync `data-bull-mode` flag from <html> (set by Konami listener).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const sync = () => setBullMode(root.getAttribute("data-bull-mode") === "1");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-bull-mode"] });
    return () => observer.disconnect();
  }, []);

  const handleResolve = () => {
    setResolved(true);

    // Capture the button center for the confetti burst origin.
    const rect = buttonRef.current?.getBoundingClientRect();
    const container = buttonRef.current?.closest(".relative")?.getBoundingClientRect();
    if (rect && container) {
      setBurstAt({
        x: rect.left + rect.width / 2 - container.left,
        y: rect.top + rect.height / 2 - container.top,
        key: Date.now(),
      });
      window.setTimeout(() => setBurstAt(null), 1100);
    }

    fireMilestone("thesis-resolve", () =>
      toast("⚡ SHIFT activated. +250 XP", {
        position: "bottom-right",
        duration: 2400,
      })
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-[#041E27] to-[#02171D] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
      data-milestone="thesis"
    >
      {/* Header: morphing headline + status chip */}
      <div className="relative z-10 px-6 pt-8 pb-4 text-center">
        <AnimatePresence mode="wait">
          {!resolved ? (
            <m.div
              key="crash-head"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#FF4D6A] bg-[#FF4D6A]/10 border border-[#FF4D6A]/30 rounded-full px-3 py-1 mb-4">
                <span className="size-1.5 rounded-full bg-[#FF4D6A] animate-pulse" />
                Perps · 10× Long · TSLA
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.0]">
                <span className="text-foreground/50">Boring.</span>{" "}
                <span className="text-[#FF4D6A]">Liquidating.</span>
              </h2>
            </m.div>
          ) : (
            <m.div
              key="shift-head"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-mint bg-mint/10 border border-mint/30 rounded-full px-3 py-1 mb-4">
                <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                SHIFT · 3× Long · TSL3L
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.0] flex items-center justify-center gap-2 md:gap-3">
                <Image
                  src="/brand/shift-lockup-light-logotype.png"
                  alt="SHIFT"
                  width={480}
                  height={120}
                  priority={false}
                  className="h-[0.75em] w-auto drop-shadow-[0_0_24px_rgba(38,200,184,0.35)]"
                />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${MINT} 0%, ${MINT_SOFT} 100%)`,
                  }}
                >
                  It.
                </span>
              </h2>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart canvas */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[320px] sm:h-[380px] md:h-[440px]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="thesis-grid"
              width="60"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.035)"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="thesis-crash-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={DANGER} stopOpacity="0.32" />
              <stop offset="100%" stopColor={DANGER} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="thesis-stable-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.32" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
            <filter id="thesis-glow-mint" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="thesis-glow-red" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          <rect width={W} height={H} fill="url(#thesis-grid)" />

          {/* Crash chart layer */}
          <m.g
            animate={{ opacity: bullMode ? 0 : resolved ? 0 : 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <path d={CRASH_AREA} fill="url(#thesis-crash-fill)" />
            <path
              d={CRASH_LINE}
              fill="none"
              stroke={DANGER}
              strokeWidth="2"
              strokeOpacity="0.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#thesis-glow-red)"
            />
            {motionOk ? (
              <m.path
                d={CRASH_LINE}
                fill="none"
                stroke={DANGER}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3.4,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.6,
                }}
              />
            ) : (
              <path
                d={CRASH_LINE}
                fill="none"
                stroke={DANGER}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* LIQUIDATED flag near cliff */}
            <g transform="translate(650, 20)">
              <rect x="0" y="0" width="200" height="44" rx="6" fill={DANGER} />
              <rect
                x="0"
                y="0"
                width="200"
                height="44"
                rx="6"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <text
                x="100"
                y="29"
                textAnchor="middle"
                fill="#FFF"
                fontSize="18"
                fontWeight="800"
                fontFamily="ui-monospace,SFMono-Regular,monospace"
                letterSpacing="1.5"
              >
                −100% LIQUIDATED
              </text>
            </g>
          </m.g>

          {/* Stable chart layer */}
          <m.g
            animate={{ opacity: resolved && !bullMode ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <path d={STABLE_AREA} fill="url(#thesis-stable-fill)" />
            <path
              d={STABLE_LINE}
              fill="none"
              stroke={MINT}
              strokeWidth="2"
              strokeOpacity="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#thesis-glow-mint)"
            />
            {motionOk ? (
              <m.path
                d={STABLE_LINE}
                fill="none"
                stroke={MINT}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3.4,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.6,
                }}
              />
            ) : (
              <path
                d={STABLE_LINE}
                fill="none"
                stroke={MINT}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

          </m.g>

          {/* Konami "BULL MODE" parabolic chart layer */}
          <m.g
            animate={{ opacity: bullMode ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <path d={PARABOLIC_AREA} fill="url(#thesis-stable-fill)" />
            <path
              d={PARABOLIC_LINE}
              fill="none"
              stroke={MINT}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#thesis-glow-mint)"
            />
            <path
              d={PARABOLIC_LINE}
              fill="none"
              stroke={MINT}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </m.g>
        </svg>

        {/* Flashing RESOLVE button (center overlay, pre-resolution only) */}
        <AnimatePresence>
          {!resolved && (
            <m.div
              key="resolve-overlay"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35 }}
            >
              {/* Outer pulse rings */}
              {motionOk && (
                <>
                  <m.span
                    aria-hidden
                    className="absolute h-28 w-56 md:h-32 md:w-72 rounded-full border-2 border-mint"
                    animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <m.span
                    aria-hidden
                    className="absolute h-28 w-56 md:h-32 md:w-72 rounded-full border-2 border-mint"
                    animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.9,
                    }}
                  />
                </>
              )}

              <m.button
                ref={buttonRef}
                type="button"
                onClick={handleResolve}
                className="pointer-events-auto relative inline-flex items-center gap-2.5 bg-mint text-primary-foreground font-bold text-base md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full uppercase tracking-[0.12em] shadow-[0_0_60px_rgba(38,200,184,0.55)]"
                animate={
                  motionOk
                    ? {
                        boxShadow: [
                          "0 0 40px rgba(38,200,184,0.45)",
                          "0 0 90px rgba(38,200,184,0.85)",
                          "0 0 40px rgba(38,200,184,0.45)",
                        ],
                      }
                    : undefined
                }
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-5 w-5 md:h-6 md:w-6" />
                Resolve
              </m.button>
            </m.div>
          )}
        </AnimatePresence>

        {/* Confetti / particle burst on RESOLVE */}
        {motionOk && burstAt && (
          <ConfettiBurst key={burstAt.key} x={burstAt.x} y={burstAt.y} />
        )}

        {/* Post-resolve feature badges — centered vertically over the chart */}
        <AnimatePresence>
          {resolved && (
            <m.div
              key="post-resolve"
              className="absolute inset-0 flex items-center justify-center pointer-events-none px-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <div className="flex flex-col items-center gap-3 md:gap-5">
                <Badge icon={<ShieldOff className="h-7 w-7 md:h-12 md:w-12" />} label="No liquidation" />
                <Badge icon={<TrendingUp className="h-7 w-7 md:h-12 md:w-12" />} label="Real volatility" />
                <Badge icon={<Zap className="h-7 w-7 md:h-12 md:w-12" />} label="24/7 trade · 24/5 mint" />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: replay link after resolve */}
      <div className="relative z-10 flex justify-center pb-5 pt-3">
        <AnimatePresence>
          {resolved && (
            <m.button
              key="replay"
              type="button"
              onClick={() => setResolved(false)}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/40 hover:text-foreground/70 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.9 }}
            >
              <RotateCcw className="h-3 w-3" />
              Replay
            </m.button>
          )}
        </AnimatePresence>
        {!resolved && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/35">
            Tap resolve to see SHIFT
          </span>
        )}
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-3 md:gap-5 bg-mint/15 border border-mint/40 text-mint text-2xl md:text-5xl font-semibold px-6 md:px-12 py-3 md:py-6 rounded-full backdrop-blur-sm">
      {icon}
      {label}
    </span>
  );
}

/* Lightweight CSS-only mint particle burst — no external lib. */
const BURST_PARTICLES = Array.from({ length: 18 }).map((_, i) => {
  const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
  const distance = 80 + Math.random() * 70;
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    delay: Math.random() * 0.05,
  };
});

function ConfettiBurst({ x, y }: { x: number; y: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: 0, height: 0 }}
    >
      {BURST_PARTICLES.map((p, i) => (
        <m.span
          key={i}
          className="absolute size-2 rounded-full bg-mint shadow-[0_0_10px_rgba(38,200,184,0.85)]"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.85, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
