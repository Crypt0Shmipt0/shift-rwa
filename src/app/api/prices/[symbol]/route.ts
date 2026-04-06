import { NextResponse } from "next/server";
import { ASSETS } from "@/lib/mock";

export const revalidate = 60;

type YahooChart = {
  chart: {
    result: Array<{
      meta: { regularMarketPrice: number; chartPreviousClose: number };
      timestamp: number[];
      indicators: { quote: Array<{ close: (number | null)[] }> };
    }> | null;
    error: { description: string } | null;
  };
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const asset = ASSETS.find((a) => a.symbol === symbol);
  if (!asset) return NextResponse.json({ error: "Unknown symbol" }, { status: 404 });

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${asset.underlying}?interval=15m&range=1d`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShiftRWA/1.0)" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`yahoo ${res.status}`);
    const data = (await res.json()) as YahooChart;
    const r = data.chart.result?.[0];
    if (!r) throw new Error("no result");

    const closes = r.indicators.quote[0].close;
    const ts = r.timestamp;
    const base = r.meta.chartPreviousClose;

    // Apply leverage to PERCENT moves from previous close.
    const series = ts
      .map((t, i) => {
        const c = closes[i];
        if (c == null) return null;
        const pct = (c - base) / base;
        const leveredPct = pct * asset.leverage;
        return { t: t * 1000, v: base * (1 + leveredPct) };
      })
      .filter((p): p is { t: number; v: number } => p !== null);

    const last = series[series.length - 1]?.v ?? base;
    const first = series[0]?.v ?? base;
    const change24h = ((last - first) / first) * 100;

    return NextResponse.json({
      symbol,
      underlying: asset.underlying,
      leverage: asset.leverage,
      price: last,
      change24h,
      series,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(err) },
      { status: 502 }
    );
  }
}
