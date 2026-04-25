"use client";

/**
 * Markets scoreboard — 4 hero stat tiles at top of the page.
 *  · Total markets live (CountUp)
 *  · Total 24h volume (CountUp, $-formatted)
 *  · Top gainer (largest +%) with sparkline
 *  · Top loser (largest -%) with sparkline
 *
 * Each tile is a TiltCard wrapping a SpotlightCard for that traders-terminal
 * feel. Mint glow on positive, steel/red glow on negative.
 */

import { m } from "motion/react";
import { Activity, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { TiltCard } from "@/components/motion/tilt-card";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import type { Asset } from "@/lib/mock";
import { FORMATTERS } from "@/lib/mock";
import {
  MINT,
  RED,
  makeSeries,
  toSparklinePath,
  toAreaPath,
} from "./_shared";

const SPARK_W = 140;
const SPARK_H = 36;

/**
 * Compact USD format that fits in a narrow tile: $26.5M, $1.2B, $850K.
 * For values < 1K just shows the dollar amount with no suffix.
 */
function formatVolumeCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

interface ScoreboardProps {
  assets: Asset[];
  totalVolume: number;
}

function MiniSpark({ symbol, positive }: { symbol: string; positive: boolean }) {
  const series = makeSeries(symbol, 28, positive ? 6 : -6);
  const stroke = positive ? MINT : RED;
  const linePath = toSparklinePath(series, SPARK_W, SPARK_H);
  const areaPath = toAreaPath(series, SPARK_W, SPARK_H);
  const gradId = `score-${symbol}`;
  return (
    <svg
      width="100%"
      height={SPARK_H}
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      preserveAspectRatio="none"
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${stroke}88)` }}
      />
    </svg>
  );
}

interface TileProps {
  label: string;
  children: React.ReactNode;
  glow?: "mint" | "red";
  index: number;
}

function Tile({ label, children, glow = "mint", index }: TileProps) {
  const glowClass =
    glow === "mint"
      ? "before:bg-mint/20 hover:border-mint/40"
      : "before:bg-[#FF4D6A]/20 hover:border-[#FF4D6A]/40";
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
    >
      <TiltCard maxTilt={5} scale={1.02} className="rounded-2xl h-full">
        <SpotlightCard
          intensity={0.22}
          radius={50}
          className={`group relative rounded-2xl border border-border bg-card p-4 md:p-5 h-full transition-colors before:absolute before:-top-12 before:-right-12 before:size-28 before:rounded-full before:blur-3xl before:pointer-events-none ${glowClass}`}
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 mb-3 relative z-10">
            {label}
          </div>
          <div className="relative z-10">{children}</div>
        </SpotlightCard>
      </TiltCard>
    </m.div>
  );
}

export function Scoreboard({ assets, totalVolume }: ScoreboardProps) {
  const sorted = [...assets].sort((a, b) => b.change24h - a.change24h);
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];

  return (
    <section aria-label="Market overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Tile label="Markets live" index={0} glow="mint">
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl md:text-4xl font-bold text-mint tabular-nums leading-none">
            <CountUp to={assets.length} duration={1.2} />
          </div>
          <Activity className="h-5 w-5 text-mint/70 shrink-0" />
        </div>
        <p className="text-[11px] text-foreground/55 mt-2">Long + short, 1× to 3× leverage</p>
      </Tile>

      <Tile label="24h volume" index={1} glow="mint">
        <div className="flex items-end justify-between gap-2">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tabular-nums leading-none truncate">
            <CountUp
              to={totalVolume}
              duration={1.5}
              formatter={(n) => formatVolumeCompact(n)}
            />
          </div>
          <BarChart3 className="h-5 w-5 text-mint/70 shrink-0" />
        </div>
        <p className="text-[11px] text-foreground/55 mt-2">Across every SHIFT market</p>
      </Tile>

      <Tile label="Top gainer" index={2} glow="mint">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <div className="font-mono font-bold text-base md:text-lg text-white tracking-wider">
            {topGainer.symbol}
          </div>
          <div className="flex items-center gap-1 text-mint font-semibold text-sm tabular-nums">
            <TrendingUp className="h-3.5 w-3.5" />
            {FORMATTERS.pct(topGainer.change24h)}
          </div>
        </div>
        <MiniSpark symbol={topGainer.symbol} positive />
      </Tile>

      <Tile label="Top loser" index={3} glow="red">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <div className="font-mono font-bold text-base md:text-lg text-white tracking-wider">
            {topLoser.symbol}
          </div>
          <div className="flex items-center gap-1 text-destructive font-semibold text-sm tabular-nums">
            <TrendingDown className="h-3.5 w-3.5" />
            {FORMATTERS.pct(topLoser.change24h)}
          </div>
        </div>
        <MiniSpark symbol={topLoser.symbol} positive={false} />
      </Tile>
    </section>
  );
}
