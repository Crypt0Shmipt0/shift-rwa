export type Asset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number; // percent
  color: string;
  /** Underlying ticker on Yahoo Finance */
  underlying: string;
  /** Leverage multiplier vs underlying (negative = inverse) */
  leverage: number;
};

export const ASSETS: Asset[] = [
  { symbol: "TSL2s", name: "Tesla x2 SHIFT",      price: 175.6, change24h: 2.41,  color: "#00cccc", underlying: "TSLA", leverage: 2 },
  { symbol: "NVD3s", name: "Nvidia x3 SHIFT",     price: 175.6, change24h: -2.15, color: "#7cc4ff", underlying: "NVDA", leverage: 3 },
  { symbol: "SPY3s", name: "SPY x3 SHIFT",        price: 175.6, change24h: -2.15, color: "#b794f4", underlying: "SPY",  leverage: 3 },
  { symbol: "TSLSs", name: "Tesla Short SHIFT",   price: 175.6, change24h: -2.15, color: "#f6ad55", underlying: "TSLA", leverage: -1 },
  { symbol: "SOX3s", name: "Semis x3 SHIFT",      price: 89.4,  change24h: 1.12,  color: "#68d391", underlying: "SOXX", leverage: 3 },
  { symbol: "URAAs", name: "Uranium SHIFT",       price: 42.1,  change24h: 0.34,  color: "#fbb6ce", underlying: "URA",  leverage: 1 },
];

export type Holding = {
  symbol: string;
  qty: number;
  totalValue: number;
  totalGain: number;
};

export const HOLDINGS: Holding[] = [
  { symbol: "TSL2s", qty: 235.35, totalValue: 4390, totalGain: 871.25 },
  { symbol: "NVD3s", qty: 235.35, totalValue: 4390, totalGain: -871.25 },
  { symbol: "SPY3s", qty: 235.35, totalValue: 4390, totalGain: -871.25 },
  { symbol: "TSLSs", qty: 235.35, totalValue: 4390, totalGain: -871.25 },
];

export const NET_WORTH = {
  total: 54230.12,
  change24hPct: 2.41,
  change24hAbs: 1273.4,
};

export const ALLOCATION = [
  { symbol: "TSL2s", value: 52.4, color: "#00cccc" },
  { symbol: "SOX3s", value: 28.1, color: "#006666" },
  { symbol: "URAAs", value: 19.5, color: "#365f5f" },
];

// Generate a smooth-ish performance series for the hero chart.
export function generateSeries(points = 48, base = 50000, vol = 800): { t: number; v: number }[] {
  const out: { t: number; v: number }[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (Math.sin(i / 4) + (i % 7) / 10 - 0.3) * vol;
    out.push({ t: i, v: Math.round(v) });
  }
  return out;
}

export const INTELLIGENCE = [
  { title: "Tesla Reveals introduced its latest robot, expanding its long-term robotics.", source: "Forbes",    time: "1 DAY AGO",  image: "/news/news-1.png" },
  { title: "Nvidia Expands Its Lead in AI Chips, signing agreement with Capitol Hill",     source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-2.png" },
  { title: "Apple Launches Revolutionary Augmented Reality Glasses",                       source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-3.png" },
  { title: "Uranium Gains as growing support for nuclear energy driving renewed interest.", source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-4.png" },
];

export const FORMATTERS = {
  usd: (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
  usdShort: (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  pct: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`,
  num: (n: number, d = 3) => n.toLocaleString("en-US", { maximumFractionDigits: d }),
};
