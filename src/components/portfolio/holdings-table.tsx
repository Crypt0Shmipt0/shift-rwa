"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HOLDINGS, ASSETS, FORMATTERS } from "@/lib/mock";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
    <Card className="bg-card border-border rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">Portfolio Holdings</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter Assets"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 bg-secondary border-0 w-[200px] sm:w-[260px] h-11"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 border-border bg-secondary"
            onClick={() => setSort("change")}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
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
                      <Image src={r.image} alt={r.symbol} width={36} height={36} className="size-9 rounded-full object-cover" />
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
                      {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
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

      {/* Mobile card list */}
      <ul className="md:hidden flex flex-col divide-y divide-border">
        {rows.map((r) => {
          const positive = r.change24h >= 0;
          const gainPositive = r.totalGain >= 0;
          return (
            <li key={r.symbol}>
              <Link href={`/trade/${r.symbol}`} className="flex items-center gap-3 py-4">
                <Image src={r.image} alt={r.symbol} width={40} height={40} className="size-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold truncate">{r.symbol}</span>
                    <span className="font-semibold tabular-nums">{FORMATTERS.usd(r.totalValue)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-1">
                    <span className="truncate">{FORMATTERS.num(r.qty)} @ {FORMATTERS.usd(r.price)}</span>
                    <span className={`flex items-center gap-0.5 shrink-0 ${positive ? "text-mint" : "text-destructive"}`}>
                      {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {FORMATTERS.pct(r.change24h)}
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 ${gainPositive ? "text-mint" : "text-destructive"}`}>
                    {gainPositive ? "+" : ""}{FORMATTERS.usd(r.totalGain)} total
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
