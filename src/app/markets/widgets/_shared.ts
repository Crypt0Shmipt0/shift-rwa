/**
 * Shared helpers for the /markets dashboard widgets.
 *
 * Deterministic seeded RNGs so SSR markup === first client paint (no hydration
 * mismatch), plus tiny utilities for path-rendering sparklines and inverse
 * series for long/short pair charts. All pure — safe to import in either RSC
 * context or "use client" components.
 */

export const MINT = "#26C8B8";
export const STEEL = "#4FC8E8";
export const STEEL_DEEP = "#07638C";
export const RED = "#FF4D6A";
export const BG = "#021C24";

export type DirectionKind = "long" | "short";

export function seeded(hash: number): () => number {
  let a = hash || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Generate a smooth, biased sparkline series. */
export function makeSeries(symbol: string, points = 32, bias = 0): number[] {
  const rand = seeded(hashString(symbol));
  const out: number[] = [];
  let v = 50 + rand() * 20;
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.5) * 6 + bias * (i / points);
    v += drift;
    v = Math.max(8, Math.min(92, v));
    out.push(v);
  }
  return out;
}

/** Mirror a series around its midpoint — used to fake an inverse short curve. */
export function mirrorSeries(series: number[]): number[] {
  if (series.length === 0) return [];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const mid = (min + max) / 2;
  return series.map((v) => 2 * mid - v);
}

export function toSparklinePath(
  series: number[],
  width: number,
  height: number,
): string {
  if (series.length === 0) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = Math.max(0.001, max - min);
  const stepX = width / (series.length - 1);
  return series
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * Convert a series into a closed area path for filled sparklines.
 * Adds two anchor points at the bottom corners.
 */
export function toAreaPath(
  series: number[],
  width: number,
  height: number,
): string {
  if (series.length === 0) return "";
  const linePath = toSparklinePath(series, width, height);
  return `${linePath} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
}

/** Map a 24h pct (-x..+x) to a mint↔red blended color. */
export function pctToColor(pct: number, range = 5): string {
  const clamped = Math.max(-1, Math.min(1, pct / range));
  if (clamped >= 0) {
    // mint scaled by intensity
    const a = 0.18 + clamped * 0.55;
    return `rgba(38, 200, 184, ${a.toFixed(3)})`;
  }
  const a = 0.18 + Math.abs(clamped) * 0.55;
  return `rgba(255, 77, 106, ${a.toFixed(3)})`;
}
