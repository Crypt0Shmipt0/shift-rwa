"use client";

/**
 * PairCard — long/short twin card for a single underlying.
 * Splits into two halves: LEFT = long token (mint glow), RIGHT = short token
 * (steel-blue glow). Each half is a click-target → /trade/SYMBOL with a mini
 * inverse-correlated chart, 24h %, leverage badge, volume.
 *
 * If only one direction exists for an underlying, the other half renders a
 * faint "soon" placeholder so the symmetry still reads.
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp, Lock } from "lucide-react";
import type { Asset } from "@/lib/mock";
import { FORMATTERS } from "@/lib/mock";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import {
  MINT,
  STEEL,
  RED,
  makeSeries,
  mirrorSeries,
  toSparklinePath,
  toAreaPath,
} from "./_shared";

const W = 260;
const H = 56;

interface PairCardProps {
  underlying: string;
  long?: Asset;
  short?: Asset;
  longVolume?: number;
  shortVolume?: number;
}

interface HalfProps {
  asset?: Asset;
  side: "long" | "short";
  series: number[];
  volume?: number;
}

function leverageLabel(asset: Asset): string {
  return asset.leverage > 0 ? `${asset.leverage}× long` : `${Math.abs(asset.leverage)}× short`;
}

function Half({ asset, side, series, volume }: HalfProps) {
  if (!asset) {
    // empty placeholder (eg. URA has no short yet)
    const ringColor = side === "long" ? "border-mint/15" : "border-[#4FC8E8]/15";
    return (
      <div
        className={`relative flex flex-col gap-2 p-4 md:p-5 rounded-2xl border border-dashed ${ringColor} bg-card/40 text-foreground/40`}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            {side === "long" ? "Long · soon" : "Short · soon"}
          </span>
        </div>
        <p className="text-xs text-foreground/50">No matching pair yet.</p>
      </div>
    );
  }

  const positive = asset.change24h >= 0;
  const baseColor = side === "long" ? MINT : STEEL;
  const accentColor = positive ? baseColor : RED;
  const linePath = toSparklinePath(series, W, H);
  const areaPath = toAreaPath(series, W, H);
  const gradId = `pair-${asset.symbol}`;
  const ringClass =
    side === "long"
      ? "hover:border-mint/50 hover:shadow-[0_0_28px_rgba(38,200,184,0.22)]"
      : "hover:border-[#4FC8E8]/50 hover:shadow-[0_0_28px_rgba(79,200,232,0.22)]";

  return (
    <Link
      href={`/trade/${asset.symbol}`}
      className={`group/half relative flex flex-col gap-3 p-4 md:p-5 rounded-2xl border border-border bg-card/80 transition-all hover:-translate-y-0.5 ${ringClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={asset.image}
            alt={asset.symbol}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="font-mono font-bold text-sm text-white tracking-wider">
              {asset.symbol}
            </div>
            <div className="text-[10px] text-foreground/55 truncate">
              {leverageLabel(asset)}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded border"
          style={{
            color: baseColor,
            borderColor: `${baseColor}55`,
            backgroundColor: `${baseColor}14`,
          }}
        >
          {side === "long" ? "Long" : "Short"}
        </span>
      </div>

      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="overflow-visible -mx-1"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${accentColor}77)` }}
        />
      </svg>

      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-base md:text-lg font-bold text-white tabular-nums leading-none mb-1">
            {FORMATTERS.usd(asset.price)}
          </div>
          {volume !== undefined && (
            <div className="text-[10px] font-mono text-foreground/55 tabular-nums">
              Vol {FORMATTERS.usdShort(volume)}
            </div>
          )}
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${
            positive ? "text-mint" : "text-destructive"
          }`}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {FORMATTERS.pct(asset.change24h)}
        </span>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover/half:opacity-100 transition-opacity">
        <ArrowUpRight className="h-3.5 w-3.5 text-mint" />
      </div>
    </Link>
  );
}

export function PairCard({
  underlying,
  long,
  short,
  longVolume,
  shortVolume,
}: PairCardProps) {
  // Inverse-correlated curves: derive the long series, mirror it for the short.
  const longSeries = makeSeries(`${underlying}-long`, 32, long ? long.change24h : 4);
  const shortSeries = mirrorSeries(longSeries);

  const totalVol = (longVolume ?? 0) + (shortVolume ?? 0);

  return (
    <SpotlightCard
      intensity={0.18}
      radius={48}
      className="rounded-3xl border border-border bg-card/60 p-4 md:p-5"
      as="article"
    >
      <header className="flex items-baseline justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/55 mb-1">
            Underlying
          </div>
          <div className="text-xl md:text-3xl font-bold text-white tracking-tight font-mono leading-none truncate">
            {underlying}
          </div>
        </div>
        {totalVol > 0 && (
          <div className="text-right shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/55 mb-1">
              Pair vol
            </div>
            <div className="text-sm font-bold text-mint tabular-nums">
              {FORMATTERS.usdShort(totalVol)}
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Half asset={long} side="long" series={longSeries} volume={longVolume} />
        <Half asset={short} side="short" series={shortSeries} volume={shortVolume} />
      </div>
    </SpotlightCard>
  );
}
