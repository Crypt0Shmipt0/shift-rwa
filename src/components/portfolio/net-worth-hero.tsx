"use client";

import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { NET_WORTH, FORMATTERS, generateSeries } from "@/lib/mock";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

export function NetWorthHero() {
  const data = useMemo(() => generateSeries(48, 50000, 600).map((d, i) => ({ ...d, label: i })), []);
  const labels = ["08:00 AM", "12:00 PM", "04:00 PM", "CURRENT"];

  return (
    <Card className="bg-card border-border rounded-2xl p-5 md:p-6 col-span-12 lg:col-span-8">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Net Worth</div>
      <div className="text-3xl md:text-4xl font-semibold tabular-nums mb-3">{FORMATTERS.usd(NET_WORTH.total)}</div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="inline-flex items-center gap-1 bg-mint/15 text-mint text-xs font-semibold px-2.5 py-1 rounded-full">
          <TrendingUp className="h-3 w-3" />
          {FORMATTERS.pct(NET_WORTH.change24hPct)}
        </span>
        <span className="text-sm text-muted-foreground">
          Last 24 hours (+{FORMATTERS.usd(NET_WORTH.change24hAbs)})
        </span>
      </div>

      <div className="h-[200px] md:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00cccc" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00cccc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 8, fontSize: 12 }}
              labelFormatter={() => ""}
              formatter={(v) => [FORMATTERS.usd(Number(v)), "Net Worth"]}
            />
            <Area type="monotone" dataKey="v" stroke="#00cccc" strokeWidth={2.5} fill="url(#areaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-4 text-xs text-muted-foreground mt-2">
        {labels.map((l) => (
          <div key={l} className="text-center">{l}</div>
        ))}
      </div>
    </Card>
  );
}
