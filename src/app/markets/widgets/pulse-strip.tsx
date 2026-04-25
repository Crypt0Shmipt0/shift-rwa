"use client";

/**
 * MarketsPulseStrip — full-width marquee ticker tape for /markets.
 * Richer than the landing version: shows ticker + price + sparkline + 24h %
 * with a deterministic price-tick that pulses mint (up) or red (down) every
 * 2-4 seconds. Hover pauses the scroll. Respects prefers-reduced-motion.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "motion/react";
import Link from "next/link";
import type { Asset } from "@/lib/mock";
import { FORMATTERS } from "@/lib/mock";
import { useMotionOk } from "@/hooks/use-motion-ok";
import {
  MINT,
  RED,
  hashString,
  makeSeries,
  seeded,
  toSparklinePath,
} from "./_shared";

const SPARK_W = 56;
const SPARK_H = 18;
const TICK_MS = 2400;

interface PulseRow {
  symbol: string;
  price: number;
  change: number;
  series: number[];
  flashSeed: number;
}

function PulseCell({ row, motionOk }: { row: PulseRow; motionOk: boolean }) {
  const up = row.change >= 0;
  const stroke = up ? MINT : RED;
  const path = useMemo(() => toSparklinePath(row.series, SPARK_W, SPARK_H), [row.series]);

  return (
    <Link
      href={`/trade/${row.symbol}`}
      className="group/cell flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-transparent hover:border-mint/30 hover:bg-mint/5 hover:shadow-[0_0_24px_rgba(38,200,184,0.18)] transition-colors"
    >
      <span className="font-mono text-[12px] font-bold text-white tracking-wider tabular-nums">
        {row.symbol}
      </span>
      <span className="font-mono text-[11px] text-foreground/60 tabular-nums hidden md:inline">
        {FORMATTERS.usd(row.price)}
      </span>
      <svg
        width={SPARK_W}
        height={SPARK_H}
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        className="overflow-visible shrink-0"
        aria-hidden
      >
        {motionOk ? (
          <m.path
            initial={false}
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ d: path }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 3px ${stroke}66)` }}
          />
        ) : (
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <m.span
        key={`${row.flashSeed}-${row.change.toFixed(2)}`}
        initial={motionOk ? { scale: 1.3, opacity: 0.6 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="font-mono text-[11px] font-semibold tabular-nums"
        style={{ color: stroke }}
      >
        {up ? "+" : ""}
        {row.change.toFixed(2)}%
      </m.span>
    </Link>
  );
}

interface MarketsPulseStripProps {
  assets: Asset[];
}

export function MarketsPulseStrip({ assets }: MarketsPulseStripProps) {
  const motionOk = useMotionOk();

  const [rows, setRows] = useState<PulseRow[]>(() =>
    assets.map((a) => ({
      symbol: a.symbol,
      price: a.price,
      change: a.change24h,
      series: makeSeries(a.symbol, 24, a.change24h),
      flashSeed: 0,
    })),
  );

  const randsRef = useRef<Map<string, () => number>>(new Map());
  useEffect(() => {
    const map = new Map<string, () => number>();
    rows.forEach((r, i) => map.set(r.symbol, seeded(hashString(r.symbol) ^ (i + 1))));
    randsRef.current = map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    const id = window.setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const rnd = randsRef.current.get(r.symbol) ?? Math.random;
          const last = r.series[r.series.length - 1] ?? 50;
          const next = Math.max(8, Math.min(92, last + (rnd() - 0.5) * 7));
          const nextSeries = [...r.series.slice(1), next];
          const delta = (rnd() - 0.5) * 0.7;
          const nextChange = Math.max(-12, Math.min(12, r.change + delta));
          const priceDelta = (rnd() - 0.5) * (r.price * 0.0025);
          const nextPrice = Math.max(0.01, r.price + priceDelta);
          return {
            ...r,
            series: nextSeries,
            change: nextChange,
            price: nextPrice,
            flashSeed: r.flashSeed + 1,
          };
        }),
      );
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [motionOk]);

  const loop = useMemo(() => [...rows, ...rows], [rows]);

  return (
    <section
      aria-label="Live market pulse"
      className="relative border border-border/60 rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-card to-transparent" />

      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="hidden sm:inline-flex items-center gap-2 shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          Live
        </span>

        <div className="relative flex-1 overflow-hidden group/track">
          {motionOk ? (
            <div
              className="flex items-center gap-1 whitespace-nowrap will-change-transform [animation-play-state:running] group-hover/track:[animation-play-state:paused]"
              style={{
                animation: "markets-pulse-scroll 60s linear infinite",
                width: "max-content",
              }}
            >
              {loop.map((r, i) => (
                <PulseCell key={`${r.symbol}-${i}`} row={r} motionOk={motionOk} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {rows.map((r) => (
                <PulseCell key={r.symbol} row={r} motionOk={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes markets-pulse-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="markets-pulse-scroll"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
