"use client";

/**
 * Live ticker-tape with animated sparklines — gives the landing page the
 * "trading terminal" energy. Each cell shows a symbol, a smoothly morphing
 * SVG sparkline (path animated via framer-motion), and a pulsing % change.
 * The row marquees horizontally; hover pauses the animation and highlights
 * the cell in mint. Respects prefers-reduced-motion.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "motion/react";
import { TOKENS } from "@/data/tokens";
import { useMotionOk } from "@/hooks/use-motion-ok";

const POINTS = 24;           // number of sparkline points
const TICK_MS = 2000;        // refresh cadence
const SPARK_W = 60;
const SPARK_H = 20;

const MINT = "#26C8B8";
const RED = "#FF4D6A";

type TickerRow = {
  symbol: string;
  series: number[];
  change: number;
  basePrice: number;
};

function seeded(hash: number): () => number {
  // Mulberry32-style deterministic PRNG for stable SSR hydrate seed
  let a = hash || 1;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSymbol(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeInitialRow(symbol: string, direction: "long" | "short"): TickerRow {
  const rand = seeded(hashSymbol(symbol));
  const basePrice = 20 + rand() * 180;
  const series: number[] = [];
  let v = 50 + rand() * 20;
  for (let i = 0; i < POINTS; i++) {
    v += (rand() - 0.5) * 6;
    v = Math.max(10, Math.min(90, v));
    series.push(v);
  }
  // Seed change with direction-biased sign so long tokens trend green more often
  const bias = direction === "long" ? 0.15 : -0.15;
  const change = (rand() - 0.5 + bias) * 6;
  return { symbol, series, change, basePrice };
}

function pushPoint(series: number[], rand: () => number): number[] {
  const last = series[series.length - 1] ?? 50;
  const next = Math.max(10, Math.min(90, last + (rand() - 0.5) * 7));
  return [...series.slice(1), next];
}

function toPath(series: number[]): string {
  if (series.length === 0) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = Math.max(0.001, max - min);
  const stepX = SPARK_W / (series.length - 1);
  return series
    .map((v, i) => {
      const x = i * stepX;
      const y = SPARK_H - ((v - min) / range) * SPARK_H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function TickerCell({ row, motionOk }: { row: TickerRow; motionOk: boolean }) {
  const up = row.change >= 0;
  const stroke = up ? MINT : RED;
  const path = useMemo(() => toPath(row.series), [row.series]);

  return (
    <div className="group/cell flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-mint/5 hover:shadow-[0_0_24px_rgba(38,200,184,0.2)] transition-colors duration-300 cursor-default">
      <span className="font-mono text-[13px] font-bold text-white tracking-wider tabular-nums">
        {row.symbol}
      </span>
      <svg
        width={SPARK_W}
        height={SPARK_H}
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        className="overflow-visible shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient id={`spark-fill-${row.symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {motionOk ? (
          <m.path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ d: path }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 3px ${stroke}55)` }}
          />
        ) : (
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <m.span
        key={row.change.toFixed(2)}
        initial={motionOk ? { scale: 1.25, opacity: 0.7 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="font-mono text-[12px] font-semibold tabular-nums"
        style={{ color: stroke }}
      >
        {up ? "+" : ""}
        {row.change.toFixed(2)}%
      </m.span>
    </div>
  );
}

export function LandingMarketPulse() {
  const motionOk = useMotionOk();

  const [rows, setRows] = useState<TickerRow[]>(() =>
    TOKENS.map((t) => makeInitialRow(t.shiftTicker, t.direction)),
  );

  // Stable per-symbol PRNG refs so tick deltas feel continuous
  const randsRef = useRef<Map<string, () => number>>(new Map());
  useEffect(() => {
    const m = new Map<string, () => number>();
    rows.forEach((r, i) => m.set(r.symbol, seeded(hashSymbol(r.symbol) ^ (i + 1))));
    randsRef.current = m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    const id = window.setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const rnd = randsRef.current.get(r.symbol) ?? Math.random;
          const nextSeries = pushPoint(r.series, rnd);
          const delta = (rnd() - 0.5) * 0.8;
          const nextChange = Math.max(-12, Math.min(12, r.change + delta));
          return { ...r, series: nextSeries, change: nextChange };
        }),
      );
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [motionOk]);

  // Duplicate for a seamless marquee loop
  const loop = useMemo(() => [...rows, ...rows], [rows]);

  return (
    <section
      aria-label="Live market pulse"
      className="relative border-b border-border/60 bg-background/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Edge fades so cells scroll in/out smoothly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="flex items-center gap-3 px-6 py-3">
        <span className="hidden sm:inline-flex items-center gap-2 shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          Live
        </span>

        <div className="relative flex-1 overflow-hidden group/track">
          {motionOk ? (
            <div
              className="flex items-center gap-2 whitespace-nowrap will-change-transform [animation-play-state:running] group-hover/track:[animation-play-state:paused]"
              style={{
                animation: "market-pulse-scroll 55s linear infinite",
                width: "max-content",
              }}
            >
              {loop.map((r, i) => (
                <TickerCell key={`${r.symbol}-${i}`} row={r} motionOk={motionOk} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              {rows.map((r) => (
                <TickerCell key={r.symbol} row={r} motionOk={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes market-pulse-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="market-pulse-scroll"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
