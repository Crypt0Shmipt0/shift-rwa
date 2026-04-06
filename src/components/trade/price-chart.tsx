"use client";

import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { generateSeries, FORMATTERS } from "@/lib/mock";
import { useEffect, useMemo, useState } from "react";

const RANGES = ["1H", "24H", "1W", "1M", "1Y", "ALL"] as const;
type Range = (typeof RANGES)[number];

type Point = { t: number; v: number };
type ApiResponse = { price: number; change24h: number; series: Point[] };

export function PriceChart({ symbol = "TSL2s" }: { symbol?: string }) {
  const [range, setRange] = useState<Range>("24H");
  const [data, setData] = useState<Point[] | null>(null);
  const [meta, setMeta] = useState<{ price: number; change24h: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fallback = useMemo(
    () => generateSeries(60, 175, 8).map((d) => ({ t: d.t, v: d.v })),
    []
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/prices/${symbol}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((j: ApiResponse) => {
        if (cancelled) return;
        setData(j.series);
        setMeta({ price: j.price, change24h: j.change24h });
      })
      .catch(() => {
        if (cancelled) return;
        setData(fallback);
        setMeta({ price: fallback[fallback.length - 1].v, change24h: 0 });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [symbol, fallback]);

  const series = data ?? fallback;
  const positive = (meta?.change24h ?? 0) >= 0;

  return (
    <Card className="bg-card border-border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{symbol} / USD</div>
          <div className="text-3xl font-semibold tabular-nums">
            {meta ? FORMATTERS.usd(meta.price) : loading ? "—" : "$0.00"}
          </div>
          <div className={`text-sm mt-1 ${positive ? "text-mint" : "text-destructive"}`}>
            {meta ? `${FORMATTERS.pct(meta.change24h)} Last 24h` : "Loading…"}
          </div>
        </div>
        <div className="flex gap-1 bg-secondary rounded-full p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                range === r ? "bg-mint text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#006666" />
                <stop offset="100%" stopColor="#00cccc" />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 8, fontSize: 12 }}
              labelFormatter={() => ""}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
            />
            <Line type="monotone" dataKey="v" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
