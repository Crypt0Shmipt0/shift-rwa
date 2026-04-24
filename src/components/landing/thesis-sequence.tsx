"use client";

/**
 * ThesisSequence — redesigned Apr 2026
 *
 * Concept: "Three Takes" — a single live chart canvas with three overlaid
 * price lines sharing one time axis:
 *
 *   • Spot 1×     (gray)  — "boring" — barely wiggles
 *   • Perp Nx     (red)   — "liquidating" — jagged, spikes down, gets stamped LIQUIDATED
 *   • SHIFT 3×    (mint)  — "resolved" — rides volatility, compounds, no liquidation
 *
 * All three draw simultaneously. The chart is idle-animated so it lives even
 * without scroll ("moving stock market" feel). A leverage dial (1× → 100×)
 * lets the user exaggerate the two failure modes. A SHIFT-mode toggle
 * desaturates the two failures and glows the mint line as the answer.
 *
 * Reduced-motion: a static three-track chart renders instead, with the same
 * thesis legible purely from the shapes + labels.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ShieldOff, Layers, Repeat, Zap, TrendingDown, Minus, Sparkles } from "lucide-react";
import { m, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { TOKENS } from "@/data/tokens";

/* ── Brand palette (inline — SVG strokes don't read Tailwind tokens) ─────── */
const MINT = "#26C8B8";
const MINT_SOFT = "#14A6C8";
const DANGER = "#FF4D6A";
const MIST = "#98A2B3";
const MIDNIGHT = "#021C24";

/* ── Chart geometry ──────────────────────────────────────────────────────── */
const W = 1000;           // viewBox width
const H = 380;            // viewBox height
const MID = H / 2;        // price-zero baseline
const N = 120;            // sample count
const PAD_X = 24;         // horizontal inset
const STEP = (W - PAD_X * 2) / (N - 1);

/* ── Deterministic pseudo-random (SSR-safe) ──────────────────────────────── */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Series generators ───────────────────────────────────────────────────── */
type Series = { points: Array<[number, number]>; liquidatedAt: number | null };

/** Shared "market" — a gentle meandering underlying we'll compound against. */
function buildMarket(seed: number): number[] {
  const rnd = mulberry32(seed);
  const out: number[] = [];
  let p = 0;
  for (let i = 0; i < N; i++) {
    // drift + sinusoid + small noise
    const drift = 0.04;
    const wave = Math.sin(i / 9) * 0.35 + Math.sin(i / 23 + 1.2) * 0.25;
    const shock = (rnd() - 0.5) * 0.4;
    p += drift * 0.01 + wave * 0.015 + shock * 0.02;
    out.push(p); // fractional return
  }
  return out;
}

function seriesSpot(market: number[], frame: number): Series {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < N; i++) {
    const t = (i + frame * 0.05) % N;
    const base = market[Math.floor(t) % N];
    // Boring: damp to ~25% of market move.
    const y = MID - base * 60;
    pts.push([PAD_X + i * STEP, y]);
  }
  return { points: pts, liquidatedAt: null };
}

function seriesPerp(market: number[], frame: number, leverage: number): Series {
  // Higher leverage → faster liquidation, bigger wicks.
  const pts: Array<[number, number]> = [];
  let cumulative = 0;
  let liquidated: number | null = null;
  const rnd = mulberry32(7 + Math.floor(frame / 40));
  for (let i = 0; i < N; i++) {
    const t = (i + frame * 0.05) % N;
    const base = market[Math.floor(t) % N];
    // Amplify market move by leverage and inject occasional sharp spikes down.
    const spike = rnd() < 0.04 ? -(0.02 + rnd() * 0.05) * leverage * 0.6 : 0;
    cumulative = base * leverage + spike + cumulative * 0.6;
    let y = MID - cumulative * 120;
    // Liquidation: line snaps to bottom and flatlines there.
    if (liquidated === null && y > MID + 140) {
      liquidated = i;
    }
    if (liquidated !== null) y = MID + 150;
    pts.push([PAD_X + i * STEP, y]);
  }
  return { points: pts, liquidatedAt: liquidated };
}

function seriesShift(market: number[], frame: number): Series {
  // SHIFT 3×: compounding, no wipeouts. Amplifies upside, soft-floors downside.
  const pts: Array<[number, number]> = [];
  let nav = 1;
  for (let i = 0; i < N; i++) {
    const t = (i + frame * 0.05) % N;
    const base = market[Math.floor(t) % N] - market[Math.max(0, Math.floor(t) - 1) % N];
    nav *= 1 + base * 3; // daily rebal 3×
    // NAV floor — can approach zero but never cross (conceptual, not zero-liq literally)
    if (nav < 0.2) nav = 0.2;
    const y = MID - (nav - 1) * 220;
    pts.push([PAD_X + i * STEP, y]);
  }
  return { points: pts, liquidatedAt: null };
}

function toPath(pts: Array<[number, number]>): string {
  if (!pts.length) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/* ── Small animated counter ──────────────────────────────────────────────── */
function FlickerPct({
  value,
  active,
  color,
  prefix = "",
  suffix = "%",
  decimals = 1,
}: {
  value: number;
  active: boolean;
  color: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value.toFixed(decimals));

  useEffect(() => {
    if (!active) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [value, active, decimals, mv]);

  return (
    <span className="font-mono tabular-nums" style={{ color }}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── Animated version ────────────────────────────────────────────────────── */

type ModeKey = "all" | "spot" | "perp" | "shift";

function AnimatedSequence() {
  const [frame, setFrame] = useState(0);
  const [leverage, setLeverage] = useState(25);
  const [mode, setMode] = useState<ModeKey>("all");
  const [shiftMode, setShiftMode] = useState(false);

  // Idle ticker — drives "live market" motion
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      if (t - last > 90) {
        setFrame((f) => (f + 1) % 10_000);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rebuild market slowly so the lines stay coherent but keep drifting
  const market = useMemo(() => buildMarket(42 + Math.floor(frame / 200)), [frame]);

  const spot = useMemo(() => seriesSpot(market, frame), [market, frame]);
  const perp = useMemo(() => seriesPerp(market, frame, leverage), [market, frame, leverage]);
  const shift = useMemo(() => seriesShift(market, frame), [market, frame]);

  const spotPath = useMemo(() => toPath(spot.points), [spot]);
  const perpPath = useMemo(() => toPath(perp.points), [perp]);
  const shiftPath = useMemo(() => toPath(shift.points), [shift]);

  // Per-line end values for the stat chips (derived from last point Y)
  const spotPct = useMemo(() => -((spot.points[N - 1][1] - MID) / 60) * 100, [spot]);
  const perpPct = useMemo(
    () => (perp.liquidatedAt !== null ? -100 : -((perp.points[N - 1][1] - MID) / 120) * 100),
    [perp],
  );
  const shiftPct = useMemo(() => -((shift.points[N - 1][1] - MID) / 220) * 100, [shift]);

  // Dimming logic — SHIFT mode wins over hover
  const emphShift = shiftMode || mode === "shift";
  const emphPerp = !shiftMode && mode === "perp";
  const emphSpot = !shiftMode && mode === "spot";
  const anyEmph = emphShift || emphPerp || emphSpot;

  function lineOpacity(which: "spot" | "perp" | "shift"): number {
    if (shiftMode) return which === "shift" ? 1 : 0.22;
    if (!anyEmph) return 1;
    if (which === "spot" && emphSpot) return 1;
    if (which === "perp" && emphPerp) return 1;
    if (which === "shift" && emphShift) return 1;
    return 0.22;
  }

  // Smooth spring for the leverage readout
  const levSpring = useSpring(leverage, { stiffness: 220, damping: 28 });
  useEffect(() => {
    levSpring.set(leverage);
  }, [leverage, levSpring]);
  const levText = useTransform(levSpring, (v) => `${Math.round(v)}×`);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#031f29] via-card to-background shadow-[0_0_0_1px_rgba(18,54,66,0.6)]">
      {/* Ambient mint glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-mint/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[520px] rounded-full bg-[#FF4D6A]/10 blur-[120px]" />

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-5 md:px-8 pt-6 md:pt-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-mint/80 mb-2 flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-mint animate-pulse" />
            Live · same trade, three outcomes
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05]">
            Boring. Liquidating.{" "}
            <span className="text-gradient-mint">SHIFT.</span>
          </h3>
        </div>

        {/* SHIFT-mode resolve button */}
        <button
          type="button"
          onClick={() => setShiftMode((v) => !v)}
          aria-pressed={shiftMode}
          className={`group relative inline-flex items-center gap-2 self-start sm:self-auto rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            shiftMode
              ? "bg-mint text-[#021C24] border-mint shadow-[0_0_32px_rgba(38,200,184,0.55)]"
              : "bg-mint/10 text-mint border-mint/40 hover:bg-mint/20 hover:border-mint"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {shiftMode ? "SHIFT mode on" : "Resolve with SHIFT"}
        </button>
      </div>

      {/* ── Chart canvas ───────────────────────────────────────────────── */}
      <div className="relative px-3 md:px-6 pt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block w-full h-[240px] md:h-[340px]"
          role="img"
          aria-label="Three-line chart comparing 1× spot, a leveraged perp that liquidates, and a SHIFT 3× leveraged token"
        >
          <defs>
            <linearGradient id="shiftFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.35" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="perpFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={DANGER} stopOpacity="0" />
              <stop offset="100%" stopColor={DANGER} stopOpacity="0.28" />
            </linearGradient>
            <filter id="mintGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <g stroke="#123642" strokeWidth="1" opacity="0.55">
            {[0.2, 0.4, 0.6, 0.8].map((p) => (
              <line key={p} x1={PAD_X} x2={W - PAD_X} y1={H * p} y2={H * p} />
            ))}
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((p) => (
              <line
                key={p}
                x1={PAD_X + (W - PAD_X * 2) * p}
                x2={PAD_X + (W - PAD_X * 2) * p}
                y1={16}
                y2={H - 16}
                opacity="0.35"
              />
            ))}
          </g>

          {/* Zero baseline */}
          <line
            x1={PAD_X}
            x2={W - PAD_X}
            y1={MID}
            y2={MID}
            stroke="#1b4c5d"
            strokeDasharray="3 5"
            strokeWidth="1"
          />

          {/* Perp area + line */}
          <g
            style={{
              opacity: lineOpacity("perp"),
              transition: "opacity 300ms ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => !shiftMode && setMode("perp")}
            onMouseLeave={() => !shiftMode && setMode("all")}
            onFocus={() => !shiftMode && setMode("perp")}
            onBlur={() => !shiftMode && setMode("all")}
            tabIndex={0}
            aria-label="Perpetual futures line"
          >
            <path d={`${perpPath} L ${W - PAD_X} ${H - 16} L ${PAD_X} ${H - 16} Z`} fill="url(#perpFill)" />
            <path
              d={perpPath}
              stroke={DANGER}
              strokeWidth={emphPerp ? 3 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Liquidation stamp */}
            {perp.liquidatedAt !== null && (
              <g
                transform={`translate(${PAD_X + perp.liquidatedAt * STEP}, ${MID - 40})`}
                style={{ pointerEvents: "none" }}
              >
                <rect
                  x={-56}
                  y={-14}
                  width={112}
                  height={22}
                  rx={4}
                  fill={DANGER}
                  opacity={0.9}
                />
                <text
                  x={0}
                  y={1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="ui-monospace,monospace"
                  fontSize="11"
                  fontWeight="700"
                  fill="#fff"
                  letterSpacing="1"
                >
                  LIQUIDATED
                </text>
                <line x1={0} y1={8} x2={0} y2={36} stroke={DANGER} strokeWidth={1.5} strokeDasharray="2 3" />
              </g>
            )}
          </g>

          {/* Spot line (boring) */}
          <g
            style={{
              opacity: lineOpacity("spot"),
              transition: "opacity 300ms ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => !shiftMode && setMode("spot")}
            onMouseLeave={() => !shiftMode && setMode("all")}
            onFocus={() => !shiftMode && setMode("spot")}
            onBlur={() => !shiftMode && setMode("all")}
            tabIndex={0}
            aria-label="1x spot line"
          >
            <path
              d={spotPath}
              stroke={MIST}
              strokeWidth={emphSpot ? 2.5 : 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={emphSpot ? "0" : "0"}
            />
          </g>

          {/* SHIFT line (the hero) */}
          <g
            style={{
              opacity: lineOpacity("shift"),
              transition: "opacity 300ms ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => !shiftMode && setMode("shift")}
            onMouseLeave={() => !shiftMode && setMode("all")}
            onFocus={() => !shiftMode && setMode("shift")}
            onBlur={() => !shiftMode && setMode("all")}
            tabIndex={0}
            aria-label="SHIFT leveraged token line"
          >
            <path
              d={`${shiftPath} L ${W - PAD_X} ${H - 16} L ${PAD_X} ${H - 16} Z`}
              fill="url(#shiftFill)"
              opacity={emphShift ? 1 : 0.7}
            />
            <path
              d={shiftPath}
              stroke={MINT}
              strokeWidth={emphShift ? 3.5 : 2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter={emphShift ? "url(#mintGlow)" : undefined}
            />
            {/* Leading dot on SHIFT line */}
            {(() => {
              const [x, y] = shift.points[N - 1];
              return (
                <g>
                  <circle cx={x} cy={y} r={emphShift ? 8 : 5} fill={MINT} opacity={0.2} />
                  <circle cx={x} cy={y} r={emphShift ? 4 : 3} fill={MINT} />
                </g>
              );
            })()}
          </g>

          {/* SHIFT-mode slam caption */}
          <AnimatePresence>
            {shiftMode && (
              <m.g
                key="resolve-caption"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35 }}
              >
                <rect
                  x={W / 2 - 180}
                  y={H - 60}
                  width={360}
                  height={34}
                  rx={17}
                  fill={MINT}
                  opacity={0.12}
                  stroke={MINT}
                  strokeOpacity={0.55}
                />
                <text
                  x={W / 2}
                  y={H - 38}
                  textAnchor="middle"
                  fontFamily="ui-monospace,monospace"
                  fontSize="13"
                  fontWeight="700"
                  fill={MINT}
                  letterSpacing="1.4"
                >
                  NO WICKS · NO FLATLINES · NO LIQUIDATION
                </text>
              </m.g>
            )}
          </AnimatePresence>
        </svg>

        {/* ── Floating stat chips ─────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {/* Spot chip — left */}
          <m.div
            animate={{ opacity: lineOpacity("spot") }}
            transition={{ duration: 0.3 }}
            className="absolute left-6 top-5"
          >
            <LegendChip
              label="1× Spot"
              sub="Savings account"
              stat={<FlickerPct value={Number(spotPct.toFixed(2))} active color={MIST} prefix={spotPct >= 0 ? "+" : ""} />}
              color={MIST}
              icon={<Minus className="h-3 w-3" />}
            />
          </m.div>

          {/* Perp chip — middle-right */}
          <m.div
            animate={{ opacity: lineOpacity("perp") }}
            transition={{ duration: 0.3 }}
            className="absolute right-6 top-5"
          >
            <LegendChip
              label={`Perp ${leverage}×`}
              sub={perp.liquidatedAt !== null ? "Liquidated" : "One wick away"}
              stat={
                perp.liquidatedAt !== null ? (
                  <span className="font-mono" style={{ color: DANGER }}>
                    −100%
                  </span>
                ) : (
                  <FlickerPct value={Number(perpPct.toFixed(1))} active color={DANGER} prefix={perpPct >= 0 ? "+" : ""} />
                )
              }
              color={DANGER}
              icon={<TrendingDown className="h-3 w-3" />}
            />
          </m.div>

          {/* SHIFT chip — bottom right, the hero */}
          <m.div
            animate={{
              opacity: lineOpacity("shift"),
              scale: emphShift ? 1.04 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="absolute right-6 bottom-6"
          >
            <LegendChip
              label="SHIFT 3×"
              sub="No liquidation"
              stat={<FlickerPct value={Number(shiftPct.toFixed(1))} active color={MINT} prefix={shiftPct >= 0 ? "+" : ""} />}
              color={MINT}
              icon={<Zap className="h-3 w-3" />}
              emphasized
            />
          </m.div>
        </div>
      </div>

      {/* ── Mobile legend row (chips don't float on mobile) ─────────────── */}
      <div className="relative grid grid-cols-3 gap-2 px-4 pt-3 md:hidden">
        <MobileChip
          color={MIST}
          label="1× Spot"
          value={`${spotPct >= 0 ? "+" : ""}${spotPct.toFixed(1)}%`}
          active={mode === "spot" || (!shiftMode && mode === "all")}
          onTap={() => setMode(mode === "spot" ? "all" : "spot")}
        />
        <MobileChip
          color={DANGER}
          label={`Perp ${leverage}×`}
          value={perp.liquidatedAt !== null ? "−100%" : `${perpPct >= 0 ? "+" : ""}${perpPct.toFixed(1)}%`}
          active={mode === "perp" || (!shiftMode && mode === "all")}
          onTap={() => setMode(mode === "perp" ? "all" : "perp")}
        />
        <MobileChip
          color={MINT}
          label="SHIFT 3×"
          value={`${shiftPct >= 0 ? "+" : ""}${shiftPct.toFixed(1)}%`}
          active={mode === "shift" || shiftMode || (!shiftMode && mode === "all")}
          onTap={() => setMode(mode === "shift" ? "all" : "shift")}
          emphasized
        />
      </div>

      {/* ── Leverage dial ──────────────────────────────────────────────── */}
      <div className="relative px-5 md:px-8 pt-5 md:pt-6 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/60">
              Perp leverage
            </span>
            <m.span
              className="text-base md:text-lg font-bold font-mono tabular-nums"
              style={{ color: leverage >= 50 ? DANGER : leverage >= 20 ? "#FFB347" : MIST }}
            >
              <m.span>{levText}</m.span>
            </m.span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
            <span>1× flat</span>
            <span className="text-foreground/30">→</span>
            <span style={{ color: DANGER }}>100× insta-liq</span>
          </div>
        </div>
        <div className="mt-2 relative">
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            aria-label="Simulated perp leverage"
            className="shift-range w-full"
            style={
              {
                // CSS custom prop consumed by the <style> block below
                "--pct": `${((leverage - 1) / 99) * 100}%`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* ── Token row footer (the "answer") ─────────────────────────────── */}
      <AnimatePresence>
        {shiftMode && (
          <m.div
            key="token-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden"
          >
            <div className="px-5 md:px-8 pb-6 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                {[
                  { icon: <Repeat className="h-3 w-3" />, label: "Long" },
                  { icon: <Layers className="h-3 w-3" />, label: "Short" },
                  { icon: <ShieldOff className="h-3 w-3" />, label: "No liquidation" },
                ].map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/40 text-mint text-[11px] font-semibold px-3 py-1 rounded-full"
                  >
                    {b.icon}
                    {b.label}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-w-3xl mx-auto">
                {TOKENS.map((t) => (
                  <div
                    key={t.shiftTicker}
                    className="relative aspect-square rounded-xl border border-mint/30 bg-gradient-to-br from-mint/[0.08] via-card to-card p-1.5 overflow-hidden"
                  >
                    <div className="relative h-full flex flex-col items-center justify-center text-center gap-0.5">
                      <Image
                        src={t.image}
                        alt={t.shiftTicker}
                        width={36}
                        height={36}
                        className="size-7 sm:size-8 rounded-full object-cover drop-shadow-[0_0_10px_rgba(38,200,184,0.45)]"
                      />
                      <div className="text-[9px] font-bold text-white leading-none">{t.shiftTicker}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Component-scoped styling for the native range input.
          Kept inline so this file stays self-contained. */}
      <style>{`
        .shift-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            ${MIST} 0%,
            ${MIST} var(--pct, 25%),
            #123642 var(--pct, 25%),
            #123642 100%
          );
          outline: none;
        }
        .shift-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: ${MINT};
          border: 2px solid ${MIDNIGHT};
          box-shadow: 0 0 0 2px ${MINT}, 0 0 24px rgba(38,200,184,0.55);
          cursor: pointer;
          transition: transform 120ms ease;
        }
        .shift-range::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .shift-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: ${MINT};
          border: 2px solid ${MIDNIGHT};
          box-shadow: 0 0 0 2px ${MINT}, 0 0 24px rgba(38,200,184,0.55);
          cursor: pointer;
        }
        .shift-range:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px ${MINT}, 0 0 0 6px rgba(38,200,184,0.35);
        }
      `}</style>
    </div>
  );
}

/* ── Legend chip (desktop floating) ─────────────────────────────────────── */
function LegendChip({
  label,
  sub,
  stat,
  color,
  icon,
  emphasized = false,
}: {
  label: string;
  sub: string;
  stat: React.ReactNode;
  color: string;
  icon: React.ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div
      className="pointer-events-auto inline-flex flex-col rounded-2xl border backdrop-blur-md px-3 py-2 shadow-lg"
      style={{
        background: `color-mix(in oklab, ${color} 10%, rgba(2,28,36,0.82))`,
        borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
        boxShadow: emphasized
          ? `0 0 32px ${color}55, 0 4px 14px rgba(0,0,0,0.35)`
          : "0 4px 14px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color }}>
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold leading-none mt-1">{stat}</div>
      <div className="text-[10px] text-foreground/55 mt-0.5">{sub}</div>
    </div>
  );
}

/* ── Mobile legend chip ──────────────────────────────────────────────────── */
function MobileChip({
  color,
  label,
  value,
  active,
  onTap,
  emphasized = false,
}: {
  color: string;
  label: string;
  value: string;
  active: boolean;
  onTap: () => void;
  emphasized?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="flex flex-col items-start rounded-xl border px-2.5 py-2 text-left transition-all"
      style={{
        background: active ? `color-mix(in oklab, ${color} 14%, rgba(2,28,36,0.9))` : "rgba(2,28,36,0.4)",
        borderColor: active ? `color-mix(in oklab, ${color} 55%, transparent)` : "#123642",
        opacity: active ? 1 : 0.55,
        boxShadow: emphasized && active ? `0 0 18px ${color}55` : "none",
      }}
      aria-pressed={active}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {label}
      </span>
      <span className="text-sm font-bold font-mono tabular-nums text-white mt-0.5">{value}</span>
    </button>
  );
}

/* ── Static (reduced-motion) fallback ───────────────────────────────────── */

function StaticSequence() {
  // Pre-rendered, non-moving version of the same three-line chart.
  const market = useMemo(() => buildMarket(42), []);
  const spot = useMemo(() => seriesSpot(market, 0), [market]);
  const perp = useMemo(() => seriesPerp(market, 0, 25), [market]);
  const shift = useMemo(() => seriesShift(market, 0), [market]);

  const spotPath = toPath(spot.points);
  const perpPath = toPath(perp.points);
  const shiftPath = toPath(shift.points);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#031f29] via-card to-background">
      <div className="px-5 md:px-8 pt-6 md:pt-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-mint/80 mb-2">
          Same trade · three outcomes
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05]">
          Boring. Liquidating. <span className="text-gradient-mint">SHIFT.</span>
        </h3>
      </div>

      <div className="px-3 md:px-6 pt-4 pb-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block w-full h-[220px] md:h-[320px]"
          role="img"
          aria-label="Static chart: flat 1x spot line, jagged perp line that liquidates, mint SHIFT line that compounds"
        >
          <defs>
            <linearGradient id="s-shiftFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.3" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="#123642" strokeWidth="1" opacity="0.5">
            {[0.25, 0.5, 0.75].map((p) => (
              <line key={p} x1={PAD_X} x2={W - PAD_X} y1={H * p} y2={H * p} />
            ))}
          </g>
          <line x1={PAD_X} x2={W - PAD_X} y1={MID} y2={MID} stroke="#1b4c5d" strokeDasharray="3 5" />
          <path d={perpPath} stroke={DANGER} strokeWidth={2} fill="none" />
          <path d={spotPath} stroke={MIST} strokeWidth={1.6} fill="none" />
          <path d={`${shiftPath} L ${W - PAD_X} ${H - 16} L ${PAD_X} ${H - 16} Z`} fill="url(#s-shiftFill)" />
          <path d={shiftPath} stroke={MINT} strokeWidth={2.6} fill="none" />
          {perp.liquidatedAt !== null && (
            <g transform={`translate(${PAD_X + perp.liquidatedAt * STEP}, ${MID - 40})`}>
              <rect x={-56} y={-14} width={112} height={22} rx={4} fill={DANGER} />
              <text
                x={0}
                y={1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="ui-monospace,monospace"
                fontSize="11"
                fontWeight="700"
                fill="#fff"
                letterSpacing="1"
              >
                LIQUIDATED
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 md:px-8 pb-6">
        <StaticLegend
          color={MIST}
          label="1× Spot"
          headline="Boring."
          copy="Tesla moves 1.4% a day. That's a savings account."
        />
        <StaticLegend
          color={DANGER}
          label="Perp · 25×"
          headline="Liquidating."
          copy="One 5% wick and the position is gone — forced close at the exact bottom."
        />
        <StaticLegend
          color={MINT}
          label="SHIFT 3×"
          headline="Fixes both."
          copy="Leveraged tokens you hold. No liquidation. No funding fees."
          emphasized
        />
      </div>
    </div>
  );
}

function StaticLegend({
  color,
  label,
  headline,
  copy,
  emphasized = false,
}: {
  color: string;
  label: string;
  headline: string;
  copy: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        background: `color-mix(in oklab, ${color} 8%, rgba(2,28,36,0.7))`,
        borderColor: `color-mix(in oklab, ${color} ${emphasized ? 45 : 30}%, transparent)`,
        boxShadow: emphasized ? `0 0 24px ${color}33` : "none",
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color }}>
        {label}
      </div>
      <div className="text-xl font-bold text-white mb-1">{headline}</div>
      <p className="text-xs text-foreground/65 leading-relaxed">{copy}</p>
    </div>
  );
}

/* ── Public export (same signature as before) ───────────────────────────── */

export function ThesisSequence() {
  const motionOk = useMotionOk();
  return motionOk ? <AnimatedSequence /> : <StaticSequence />;
}
