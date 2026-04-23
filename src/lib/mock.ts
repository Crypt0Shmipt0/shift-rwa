import { TOKENS } from "@/data/tokens";

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
  /** Public path to the asset's coin image */
  image: string;
};

// TODO: real market data
const MARKET_DATA: Record<
  string,
  { price: number; change24h: number; color: string }
> = {
  TSx2:   { price: 175.60,  change24h:  2.41,  color: "#00cccc" },
  TSS:    { price: 42.77,   change24h: -2.41,  color: "#f6ad55" },
  SOXx3:  { price: 142.18,  change24h: -2.15,  color: "#7cc4ff" },
  SOXx3S: { price: 38.45,   change24h:  1.87,  color: "#fc8181" },
  "S&Px3":  { price: 563.22,  change24h:  0.84,  color: "#b794f4" },
  "S&Px3S": { price: 89.33,   change24h: -0.74,  color: "#fbb6ce" },
};

export const ASSETS: Asset[] = TOKENS.map((t) => {
  const md = MARKET_DATA[t.shiftTicker] ?? { price: 100, change24h: 0, color: "#888888" };
  const leverageNum = t.direction === "short" ? -t.leverage : t.leverage;
  return {
    symbol: t.shiftTicker,
    name: t.name,
    price: md.price,
    change24h: md.change24h,
    color: md.color,
    underlying: t.underlying,
    leverage: leverageNum,
    image: t.image,
  };
});

export function getAsset(symbol: string): Asset {
  return ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
}

export type Holding = {
  symbol: string;
  qty: number;
  totalValue: number;
  totalGain: number;
};

export const HOLDINGS: Holding[] = [
  { symbol: "TSx2",   qty: 235.35, totalValue: 41324.55, totalGain:  4871.25 },
  { symbol: "SOXx3",  qty: 118.50, totalValue: 16848.33, totalGain:  -871.25 },
  { symbol: "S&Px3",  qty:  18.75, totalValue: 10560.38, totalGain:  1240.00 },
  { symbol: "TSS",    qty: 432.10, totalValue: 18484.92, totalGain:  -871.25 },
];

export const NET_WORTH = {
  total: HOLDINGS.reduce((s, h) => s + h.totalValue, 0),
  change24hPct: 2.41,
  change24hAbs: HOLDINGS.reduce((s, h) => s + h.totalGain, 0),
};

export const ALLOCATION = HOLDINGS.map((h) => {
  const asset = getAsset(h.symbol);
  const total = HOLDINGS.reduce((s, x) => s + x.totalValue, 0);
  return {
    symbol: h.symbol,
    value: +((h.totalValue / total) * 100).toFixed(1),
    color: asset.color,
  };
});

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
