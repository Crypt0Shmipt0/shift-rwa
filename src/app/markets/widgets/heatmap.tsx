"use client";

/**
 * Heatmap — bento-style grid of all SHIFT markets.
 *  · Color-coded mint (positive) ↔ red (negative) by 24h %.
 *  · Cell size proportional to 24h volume — high-vol markets dominate.
 *  · Hover for inline tooltip of full stats; click to /trade/SYMBOL.
 *
 * Layout uses CSS-grid `gridColumn: span N` / `gridRow: span N` so cells can
 * grow without breaking responsive flow. On mobile we collapse to a uniform
 * grid (no spans) so everything fits at 375px.
 */

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { Asset } from "@/lib/mock";
import { FORMATTERS } from "@/lib/mock";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { pctToColor } from "./_shared";

interface HeatmapProps {
  assets: Asset[];
  volumes: Record<string, number>;
}

interface Cell {
  asset: Asset;
  spanCol: number;
  spanRow: number;
  volume: number;
}

/** Bucket assets by volume into span sizes (1, 2, or 3 columns wide). */
function computeCells(assets: Asset[], volumes: Record<string, number>): Cell[] {
  if (assets.length === 0) return [];
  const vols = assets.map((a) => volumes[a.symbol] ?? 0);
  const maxVol = Math.max(1, ...vols);
  return assets.map((a) => {
    const v = volumes[a.symbol] ?? 0;
    const ratio = v / maxVol;
    const spanCol = ratio > 0.7 ? 2 : 1;
    const spanRow = ratio > 0.85 ? 2 : 1;
    return { asset: a, volume: v, spanCol, spanRow };
  });
}

export function Heatmap({ assets, volumes }: HeatmapProps) {
  const motionOk = useMotionOk();
  const cells = useMemo(() => computeCells(assets, volumes), [assets, volumes]);

  return (
    <section
      aria-label="Markets heatmap"
      className="grid gap-2 md:gap-3 grid-cols-2 md:grid-cols-4 auto-rows-[minmax(120px,auto)] md:auto-rows-[minmax(110px,auto)]"
    >
      {cells.map((c, i) => {
        const positive = c.asset.change24h >= 0;
        const fill = pctToColor(c.asset.change24h, 3);
        return (
          <m.div
            key={c.asset.symbol}
            initial={motionOk ? { opacity: 0, scale: 0.94 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
            style={{
              gridColumn: `span ${c.spanCol}`,
              gridRow: `span ${c.spanRow}`,
            }}
            className="md:contents-none"
          >
            <Link
              href={`/trade/${c.asset.symbol}`}
              className="group relative block h-full rounded-2xl border border-border overflow-hidden p-3 md:p-4 transition-all hover:-translate-y-0.5 hover:border-mint/40 hover:shadow-[0_0_28px_rgba(38,200,184,0.18)]"
              style={{ backgroundColor: fill }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/40 pointer-events-none" />
              <div className="relative flex flex-col h-full justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Image
                      src={c.asset.image}
                      alt={c.asset.symbol}
                      width={28}
                      height={28}
                      className="size-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-xs md:text-sm text-white tracking-wider">
                        {c.asset.symbol}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-white/65 truncate font-mono">
                        {c.asset.underlying}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-[10px] md:text-xs font-bold tabular-nums px-1.5 py-0.5 rounded ${
                      positive
                        ? "bg-mint/30 text-mint border border-mint/40"
                        : "bg-destructive/30 text-destructive border border-destructive/40"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {FORMATTERS.pct(c.asset.change24h)}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-base md:text-xl font-bold text-white tabular-nums leading-none">
                    {FORMATTERS.usd(c.asset.price)}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-white/60 font-mono uppercase tracking-wider">
                    Vol {FORMATTERS.usdShort(c.volume)}
                  </div>
                </div>
              </div>
            </Link>
          </m.div>
        );
      })}
    </section>
  );
}
