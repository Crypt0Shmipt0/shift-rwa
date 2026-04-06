"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HOLDINGS, ASSETS, FORMATTERS } from "@/lib/mock";
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

type SortKey = "asset" | "price" | "qty" | "change" | "value";

export function HoldingsTable() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("value");

  const rows = useMemo(() => {
    const joined = HOLDINGS.map((h) => {
      const a = ASSETS.find((x) => x.symbol === h.symbol)!;
      return { ...h, ...a };
    });
    const filtered = joined.filter(
      (r) =>
        r.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        r.name.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      switch (sort) {
        case "asset": return a.symbol.localeCompare(b.symbol);
        case "price": return b.price - a.price;
        case "qty": return b.qty - a.qty;
        case "change": return b.change24h - a.change24h;
        default: return b.totalValue - a.totalValue;
      }
    });
  }, [filter, sort]);

  return (
    <Card className="bg-card border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Portfolio Holdings</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter Assets"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 bg-secondary border-0 w-[260px] h-11"
            />
          </div>
          <Button variant="outline" className="h-11 border-border bg-secondary" onClick={() => setSort("change")}>
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-semibold py-3 px-2">Asset</th>
              <th className="text-left font-semibold py-3 px-2">Price</th>
              <th className="text-left font-semibold py-3 px-2">Token Holdings</th>
              <th className="text-left font-semibold py-3 px-2">24h Change</th>
              <th className="text-right font-semibold py-3 px-2">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const positive = r.change24h >= 0;
              const gainPositive = r.totalGain >= 0;
              return (
                <tr key={r.symbol} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-5 px-2">
                    <Link href={`/trade/${r.symbol}`} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-mint/15 flex items-center justify-center text-mint text-xs font-bold">
                        {r.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{r.symbol}</div>
                        <div className="text-xs text-muted-foreground">{r.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-5 px-2 tabular-nums">{FORMATTERS.usd(r.price)}</td>
                  <td className="py-5 px-2 tabular-nums">{FORMATTERS.num(r.qty)}</td>
                  <td className="py-5 px-2">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${positive ? "text-mint" : "text-destructive"}`}>
                      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {FORMATTERS.pct(r.change24h)}
                    </span>
                  </td>
                  <td className="py-5 px-2 text-right">
                    <div className="font-semibold tabular-nums">{FORMATTERS.usd(r.totalValue)}</div>
                    <div className={`text-xs tabular-nums ${gainPositive ? "text-mint" : "text-destructive"}`}>
                      {gainPositive ? "+" : ""}{FORMATTERS.usd(r.totalGain)} TOTAL
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
