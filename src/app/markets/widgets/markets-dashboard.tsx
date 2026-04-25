"use client";

/**
 * MarketsDashboard — interactive shell that wires up:
 *   · Search input (live ticker / underlying / direction match)
 *   · Filter chips (All / Long / Short / 2× / 3×) with shared layoutId
 *   · Sort dropdown (Volume / 24h / Alpha)
 *   · Grid ↔ Heatmap view toggle
 *   · Renders <PairCard>s grouped-by-underlying OR <Heatmap>
 *
 * All state is local to this component — no global store needed. SSR-safe:
 * the filter pill animation and search debounce only kick in after mount.
 */

import { useDeferredValue, useMemo, useState } from "react";
import { LayoutGroup, m } from "motion/react";
import { Search, LayoutGrid, Grid3x3, ChevronDown } from "lucide-react";
import type { Asset } from "@/lib/mock";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { PairCard } from "./pair-card";
import { Heatmap } from "./heatmap";

type FilterKey = "all" | "long" | "short" | "2x" | "3x";
type SortKey = "volume" | "change" | "alpha";
type ViewKey = "grid" | "heatmap";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "long", label: "Long" },
  { key: "short", label: "Short" },
  { key: "2x", label: "2×" },
  { key: "3x", label: "3×" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "volume", label: "Volume" },
  { key: "change", label: "24h change" },
  { key: "alpha", label: "Alphabetical" },
];

interface DashboardProps {
  assets: Asset[];
  volumes: Record<string, number>;
}

function applyFilter(asset: Asset, filter: FilterKey): boolean {
  switch (filter) {
    case "all":
      return true;
    case "long":
      return asset.leverage > 0;
    case "short":
      return asset.leverage < 0;
    case "2x":
      return Math.abs(asset.leverage) === 2;
    case "3x":
      return Math.abs(asset.leverage) === 3;
  }
}

function applySearch(asset: Asset, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase().trim();
  if (!needle) return true;
  if (asset.symbol.toLowerCase().includes(needle)) return true;
  if (asset.underlying.toLowerCase().includes(needle)) return true;
  if (asset.name.toLowerCase().includes(needle)) return true;
  if ("long".startsWith(needle) && asset.leverage > 0) return true;
  if ("short".startsWith(needle) && asset.leverage < 0) return true;
  return false;
}

function applySort(a: Asset, b: Asset, sort: SortKey, vol: Record<string, number>): number {
  switch (sort) {
    case "volume":
      return (vol[b.symbol] ?? 0) - (vol[a.symbol] ?? 0);
    case "change":
      return b.change24h - a.change24h;
    case "alpha":
      return a.symbol.localeCompare(b.symbol);
  }
}

/**
 * Derive a "pair key" from the SHIFT ticker by stripping leverage + direction.
 * TSL2L / TSL1S → "TSL". SOX3L / SOX3S → "SOX". URA2L → "URA".
 */
function pairKey(symbol: string): string {
  const match = /^([A-Z]+)\d+[LS]$/.exec(symbol);
  return match?.[1] ?? symbol;
}

const PAIR_LABELS: Record<string, string> = {
  TSL: "TSLA",
  SOX: "SOX",
  SPX: "S&P 500",
  URA: "Uranium",
  NVD: "NVDA",
  GLD: "Gold",
  BTC: "BTC",
  QQQ: "QQQ",
};

function pairLabel(symbol: string): string {
  const key = pairKey(symbol);
  return PAIR_LABELS[key] ?? key;
}

/** Group assets by pair key — TSL2L + TSL1S land in the same bucket. */
function groupByUnderlying(
  assets: Asset[],
): { key: string; label: string; long?: Asset; short?: Asset }[] {
  const order: string[] = [];
  const buckets = new Map<
    string,
    { key: string; label: string; long?: Asset; short?: Asset }
  >();
  for (const a of assets) {
    const key = pairKey(a.symbol);
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: pairLabel(a.symbol) });
      order.push(key);
    }
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (a.leverage > 0) bucket.long = bucket.long ?? a;
    else bucket.short = bucket.short ?? a;
  }
  return order.map(
    (k) => buckets.get(k) as { key: string; label: string; long?: Asset; short?: Asset },
  );
}

export function MarketsDashboard({ assets, volumes }: DashboardProps) {
  const motionOk = useMotionOk();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("volume");
  const [view, setView] = useState<ViewKey>("grid");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const list = assets.filter((a) => applyFilter(a, filter) && applySearch(a, deferredQuery));
    return [...list].sort((a, b) => applySort(a, b, sort, volumes));
  }, [assets, filter, deferredQuery, sort, volumes]);

  const groups = useMemo(() => groupByUnderlying(filtered), [filtered]);

  return (
    <section aria-label="Markets dashboard" className="space-y-5">
      {/* Filter + search + view toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="markets-filters">
          <div
            role="tablist"
            aria-label="Market filters"
            className="flex items-center gap-1.5 p-1 rounded-full border border-border bg-card/60 self-start"
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    active ? "text-background" : "text-foreground/70 hover:text-white"
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="markets-filter-pill"
                      className="absolute inset-0 rounded-full bg-mint shadow-[0_0_18px_rgba(38,200,184,0.45)]"
                      transition={{
                        type: "spring",
                        stiffness: motionOk ? 380 : 0,
                        damping: 28,
                      }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40 pointer-events-none" />
            <input
              type="search"
              placeholder="Search ticker, underlying…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full text-xs bg-card/60 border border-border text-white placeholder:text-foreground/40 focus:outline-none focus:border-mint/60 focus:shadow-[0_0_18px_rgba(38,200,184,0.25)] transition-all font-mono"
              aria-label="Search markets"
            />
          </label>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none pl-3 pr-8 py-2 rounded-full text-xs bg-card/60 border border-border text-white focus:outline-none focus:border-mint/60 transition-colors cursor-pointer"
              aria-label="Sort markets"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40 pointer-events-none" />
          </div>

          <div
            role="group"
            aria-label="View mode"
            className="flex items-center gap-1 p-1 rounded-full border border-border bg-card/60"
          >
            <button
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                view === "grid"
                  ? "bg-mint text-background"
                  : "text-foreground/70 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              <span className="hidden sm:inline">Pairs</span>
            </button>
            <button
              onClick={() => setView("heatmap")}
              aria-pressed={view === "heatmap"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                view === "heatmap"
                  ? "bg-mint text-background"
                  : "text-foreground/70 hover:text-white"
              }`}
            >
              <Grid3x3 className="h-3 w-3" />
              <span className="hidden sm:inline">Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result body */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
          <p className="text-sm text-foreground/60">
            No markets match{query ? ` "${query}"` : " those filters"}.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {groups.map((g) => (
            <PairCard
              key={g.key}
              underlying={g.label}
              long={g.long}
              short={g.short}
              longVolume={g.long ? volumes[g.long.symbol] : undefined}
              shortVolume={g.short ? volumes[g.short.symbol] : undefined}
            />
          ))}
        </div>
      ) : (
        <Heatmap assets={filtered} volumes={volumes} />
      )}
    </section>
  );
}
