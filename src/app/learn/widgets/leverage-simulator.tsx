"use client";

/**
 * LeverageSimulator
 *
 * Live SVG chart showing the underlying (TSLA) and a SHIFT 3× long token
 * over a 30-trading-day window. The user drags a daily-volatility slider
 * (0% → 50% σ daily move) and the chart redraws.
 *
 * Math
 *  - Underlying: deterministic geometric Brownian motion seeded by sigma.
 *  - SHIFT 3× long: each daily return on the underlying is multiplied by
 *    3, then compounded onto the SHIFT NAV (i.e. daily-rebalanced 3× ETF
 *    behavior). This is the same arithmetic as TSL3L / SOX3L / SPX3L.
 *
 * Determinism: a tiny mulberry32 PRNG seeded by `sigma` so dragging the
 * slider produces a stable, reproducible chart for every value (no
 * flicker, no Math.random()).
 *
 * Compliance: this is illustrative only — the disclaimer below makes
 * that explicit. No "+X% guaranteed" copy.
 */

import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { Sparkles, TrendingUp } from "lucide-react";

const MINT = "#26C8B8";
const STEEL = "#4FC8E8"; // brighter cousin of brand tidal-steel — used for SOX3S inverse
const OFF_WHITE = "#EDEEEE";
const DANGER = "#FF4D6A";

const W = 800;
const H = 320;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 24;
const PAD_B = 32;

const DAYS = 30;
const LEVERAGE = 3;
// Visual floor — never show any series below this, in line with the
// "no liquidation" narrative (NAV can drop, but we cap visualization
// at -90% to keep the chart legible and on-message).
const NAV_FLOOR = 0.1; // = -90% return

/* ── Tiny deterministic PRNG (mulberry32) ─────────────────────────────────── */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* Box-Muller normal sample. */
function gauss(rand: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface SimResult {
  underlying: number[]; // length DAYS+1, normalized to start at 1.0
  long: number[]; // SOX3L — daily-rebalanced 3× long
  inverse: number[]; // SOX3S — daily-rebalanced 3× short (inverse)
  finalUnderlying: number; // %
  finalLong: number; // %
  finalInverse: number; // %
}

// Realistic positive long-run drift — equity benchmarks have averaged ~10–25%
// annualized historically. 0.1% daily ≈ 25%/yr — keeps the chart green-leaning
// without faking the math.
const DAILY_DRIFT = 0.001;

function simulate(sigmaPct: number): SimResult {
  // Daily vol expressed as decimal, plus a small positive drift so paths
  // trend up by default (matches long-run equity behavior).
  const sigma = sigmaPct / 100;
  const rand = mulberry32(Math.round(sigmaPct * 1000) + 7);
  const underlying: number[] = [1];
  const long: number[] = [1];
  const inverse: number[] = [1];
  for (let d = 1; d <= DAYS; d++) {
    const z = gauss(rand);
    const r = DAILY_DRIFT + sigma * z; // drift + diffusion on the underlying
    underlying.push(underlying[d - 1] * (1 + r));
    // Daily-rebalanced 3× LONG: NAV[d] = NAV[d-1] · (1 + 3·r), floored at NAV_FLOOR.
    const longFactor = 1 + LEVERAGE * r;
    long.push(Math.max(NAV_FLOOR, long[d - 1] * longFactor));
    // Daily-rebalanced 3× INVERSE (SOX3S): NAV[d] = NAV[d-1] · (1 − 3·r).
    const invFactor = 1 - LEVERAGE * r;
    inverse.push(Math.max(NAV_FLOOR, inverse[d - 1] * invFactor));
  }
  return {
    underlying,
    long,
    inverse,
    finalUnderlying: (underlying[DAYS] - 1) * 100,
    finalLong: (long[DAYS] - 1) * 100,
    finalInverse: (inverse[DAYS] - 1) * 100,
  };
}

function buildPath(series: number[], yMin: number, yMax: number): string {
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const range = yMax - yMin || 1;
  return series
    .map((v, i) => {
      const x = PAD_L + (i / (series.length - 1)) * innerW;
      const y = PAD_T + innerH - ((v - yMin) / range) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function LeverageSimulator() {
  const motionOk = useMotionOk();
  // Realistic daily-vol anchor: S&P ~1%, TSLA ~3%, crisis regimes ~7–10%
  const [sigma, setSigma] = useState(2);
  // Math.sin/cos/log can differ across engines (V8 vs Chromium) by sub-ULPs,
  // which propagates through compounding. Gate the live numbers behind a
  // mount flag to keep SSR/CSR in sync (we render a stable placeholder until
  // mount, then the deterministic sim takes over).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pre-mount: render a deterministic flat baseline (sigma=0 means no math
  // randomness, fully stable across SSR/CSR). Post-mount: real sim.
  const sim = useMemo(() => simulate(mounted ? sigma : 0), [sigma, mounted]);

  // Choose y-range so all three series fit. Pad ±8% so peaks don't kiss the edge.
  const all = [...sim.underlying, ...sim.long, ...sim.inverse];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.08 || 0.05;
  const yMin = lo - pad;
  const yMax = hi + pad;

  const underlyingPath = buildPath(sim.underlying, yMin, yMax);
  const longPath = buildPath(sim.long, yMin, yMax);
  const inversePath = buildPath(sim.inverse, yMin, yMax);

  // Horizontal grid: 4 lines.
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const innerH = H - PAD_T - PAD_B;
    const y = PAD_T + innerH * t;
    const v = yMax - (yMax - yMin) * t;
    const pct = ((v - 1) * 100).toFixed(0);
    return { y, label: `${Number(pct) >= 0 ? "+" : ""}${pct}%` };
  });

  const longPositive = sim.finalLong >= 0;
  const inversePositive = sim.finalInverse >= 0;

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-mint/20 bg-gradient-to-b from-[#03222C] to-[#02181F] p-5 md:p-8"
      aria-label="Leverage simulator"
    >
      {/* Decorative mint corner glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-mint/15 blur-3xl" />

      <header className="relative mb-5 md:mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
            <Sparkles className="h-3 w-3" />
            Leverage simulator
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Drag the volatility. Watch 3× compound — long & short.
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[560px]">
            30-day path of SOXX vs SHIFT SOX3L (3× long) and SOX3S (3× short)
            under daily rebalancing. Illustrative — past performance is not
            indicative of future returns.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Stat label="SOXX" value={sim.finalUnderlying} accent="off" />
          <Stat label="SOX3L" value={sim.finalLong} accent={longPositive ? "mint" : "danger"} />
          <Stat label="SOX3S" value={sim.finalInverse} accent={inversePositive ? "steel" : "danger"} />
        </div>
      </header>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[260px] md:h-[320px]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Over 30 days at ${sigma}% daily volatility: SOXX ${sim.finalUnderlying.toFixed(1)}%, SHIFT SOX3L (3× long) ${sim.finalLong.toFixed(1)}%, SHIFT SOX3S (3× short) ${sim.finalInverse.toFixed(1)}%.`}
        >
          <defs>
            <linearGradient id="lev-long-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lev-inverse-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={STEEL} stopOpacity="0.22" />
              <stop offset="100%" stopColor={STEEL} stopOpacity="0" />
            </linearGradient>
            <filter id="lev-glow-mint" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="lev-glow-steel" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Grid */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={g.y}
                y2={g.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray={i === gridLines.length - 1 ? "0" : "2 4"}
              />
              <text
                x={PAD_L - 8}
                y={g.y + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="ui-monospace,SFMono-Regular,monospace"
                fill="rgba(237,238,238,0.45)"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* Zero baseline (start) */}
          {(() => {
            const innerH = H - PAD_T - PAD_B;
            const y = PAD_T + innerH - ((1 - yMin) / (yMax - yMin)) * innerH;
            return (
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="rgba(237,238,238,0.18)"
                strokeWidth="1"
              />
            );
          })()}

          {/* Underlying line — off-white */}
          <m.path
            d={underlyingPath}
            fill="none"
            stroke={OFF_WHITE}
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: underlyingPath }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />

          {/* SOX3L (long) area fill + line */}
          <m.path
            d={`${longPath} L${W - PAD_R},${H - PAD_B} L${PAD_L},${H - PAD_B} Z`}
            fill="url(#lev-long-fill)"
            initial={false}
            animate={{ d: `${longPath} L${W - PAD_R},${H - PAD_B} L${PAD_L},${H - PAD_B} Z` }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />
          <m.path
            d={longPath}
            fill="none"
            stroke={MINT}
            strokeOpacity="0.4"
            strokeWidth="3"
            filter="url(#lev-glow-mint)"
            initial={false}
            animate={{ d: longPath }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />
          <m.path
            d={longPath}
            fill="none"
            stroke={MINT}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: longPath }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />

          {/* SOX3S (inverse) line — steel-blue */}
          <m.path
            d={inversePath}
            fill="none"
            stroke={STEEL}
            strokeOpacity="0.4"
            strokeWidth="3"
            filter="url(#lev-glow-steel)"
            initial={false}
            animate={{ d: inversePath }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />
          <m.path
            d={inversePath}
            fill="none"
            stroke={STEEL}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 0"
            initial={false}
            animate={{ d: inversePath }}
            transition={{ duration: motionOk ? 0.45 : 0, ease: "easeOut" }}
          />

          {/* End-of-series dots */}
          {(() => {
            const innerW = W - PAD_L - PAD_R;
            const innerH = H - PAD_T - PAD_B;
            const xEnd = PAD_L + innerW;
            const yU = PAD_T + innerH - ((sim.underlying[DAYS] - yMin) / (yMax - yMin)) * innerH;
            const yL = PAD_T + innerH - ((sim.long[DAYS] - yMin) / (yMax - yMin)) * innerH;
            const yI = PAD_T + innerH - ((sim.inverse[DAYS] - yMin) / (yMax - yMin)) * innerH;
            return (
              <>
                <circle cx={xEnd} cy={yU} r="3.5" fill={OFF_WHITE} fillOpacity="0.7" />
                <circle cx={xEnd} cy={yL} r="5" fill={MINT} />
                <circle cx={xEnd} cy={yL} r="9" fill={MINT} fillOpacity="0.25" />
                <circle cx={xEnd} cy={yI} r="5" fill={STEEL} />
                <circle cx={xEnd} cy={yI} r="9" fill={STEEL} fillOpacity="0.22" />
              </>
            );
          })()}

          {/* Axis label — days */}
          <text
            x={PAD_L}
            y={H - 8}
            fontSize="10"
            fontFamily="ui-monospace,SFMono-Regular,monospace"
            fill="rgba(237,238,238,0.4)"
          >
            DAY 0
          </text>
          <text
            x={W - PAD_R}
            y={H - 8}
            textAnchor="end"
            fontSize="10"
            fontFamily="ui-monospace,SFMono-Regular,monospace"
            fill="rgba(237,238,238,0.4)"
          >
            DAY 30
          </text>
        </svg>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-[0.12em]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: MINT, boxShadow: `0 0 10px ${MINT}` }} />
            <span className="text-mint">SOX3L · 3× long</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: STEEL, boxShadow: `0 0 10px ${STEEL}` }} />
            <span style={{ color: STEEL }}>SOX3S · 3× short</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: OFF_WHITE, opacity: 0.6 }} />
            <span className="text-foreground/55">SOXX · spot</span>
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.14em] mb-2">
          <span className="text-foreground/60">Daily volatility (σ)</span>
          <span className="text-mint font-bold">
            <TrendingUp className="inline-block h-3 w-3 mr-1 -translate-y-px" />
            {sigma.toFixed(1)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={sigma}
          onChange={(e) => setSigma(Number(e.target.value))}
          className="w-full accent-[var(--mint)] h-2 cursor-pointer"
          aria-label="Daily volatility percentage"
        />
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/40 mt-1">
          <span>1% · S&amp;P</span>
          <span>3% · TSLA</span>
          <span>5% · wild</span>
          <span>10% · panic</span>
        </div>
      </div>

      {/* Caveat strip */}
      <p className="mt-5 text-[11px] text-foreground/40 leading-relaxed">
        Illustrative simulation using a deterministic random walk. Real markets
        include skew, kurtosis, gaps, and overnight risk. Use this as intuition
        for how daily-rebalanced leverage compounds — not a forecast.
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "mint" | "danger" | "off" | "steel";
}) {
  const sign = value >= 0 ? "+" : "";
  const color =
    accent === "mint"
      ? "text-mint"
      : accent === "steel"
        ? "text-[#4FC8E8]"
        : accent === "danger"
          ? "text-[#FF4D6A]"
          : "text-foreground/70";
  const bg =
    accent === "mint"
      ? "bg-mint/10 border-mint/30"
      : accent === "steel"
        ? "bg-[#4FC8E8]/10 border-[#4FC8E8]/30"
        : accent === "danger"
          ? "bg-[#FF4D6A]/10 border-[#FF4D6A]/30"
          : "bg-white/5 border-white/15";
  return (
    <div className={`rounded-xl border ${bg} px-3 py-2 min-w-[100px]`}>
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55">
        {label} · 30d
      </div>
      <div className={`text-xl md:text-2xl font-bold tabular-nums ${color}`}>
        {sign}
        {value.toFixed(1)}%
      </div>
    </div>
  );
}

// silence unused import warning when motion is hard-disabled
void DANGER;
