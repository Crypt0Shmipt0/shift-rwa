import Link from "next/link";
import Image from "next/image";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Every 3× and 2× bi-directional tokenized stock on SHIFT. Long or short TSLA, SOX, S&P 500 — no liquidation risk, on-chain settlement, 24/7 trading.",
  alternates: { canonical: "/markets" },
};

// TODO: real market data
const MOCK_VOLUME: Record<string, number> = {
  "TSx2":   8_420_000,
  "TSS":    1_940_000,
  "SOXx3":  6_210_000,
  "SOXx3S": 2_150_000,
  "S&Px3":  3_870_000,
  "S&Px3S": 1_480_000,
};

// TODO: real market data
const MOCK_7D: Record<string, number> = {
  "TSx2":   7.84,
  "TSS":   -5.33,
  "SOXx3": -4.62,
  "SOXx3S": 3.41,
  "S&Px3":  2.18,
  "S&Px3S":-1.95,
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-[72px] py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white mb-2">Markets</h1>
        <p className="text-sm text-muted-foreground">
          Every SHIFT market ships a long and an inverse side — 3× and 2× leveraged, zero liquidation. Tap a market to trade.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="hidden md:flex items-center px-6 py-4 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="flex-1 min-w-0">Asset</div>
          <div className="w-28 text-right">Price</div>
          <div className="w-28 text-right">24h</div>
          <div className="w-28 text-right">7d</div>
          <div className="w-36 text-right">24h Volume</div>
          <div className="w-24 text-right">Leverage</div>
          <div className="w-10" />
        </div>
        <ul className="divide-y divide-border">
          {ASSETS.map((a) => {
            const pos24 = a.change24h >= 0;
            const seven = MOCK_7D[a.symbol] ?? 0;
            const pos7 = seven >= 0;
            return (
              <li key={a.symbol}>
                <Link
                  href={`/trade/${a.symbol}`}
                  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 px-6 py-4 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Image src={a.image} alt={a.symbol} width={40} height={40} className="size-10 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold truncate flex items-center gap-2">
                        {a.symbol}
                        <span className="text-[10px] font-bold text-mint bg-mint/10 border border-mint/30 px-1.5 py-0.5 rounded">
                          {a.leverage > 0 ? `${a.leverage}×` : `${Math.abs(a.leverage)}× short`}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {a.name} · underlying {a.underlying}
                      </div>
                    </div>
                  </div>

                  {/* Mobile stats row */}
                  <div className="md:hidden flex items-center justify-between text-xs">
                    <span className="tabular-nums">{FORMATTERS.usd(a.price)}</span>
                    <span className={pos24 ? "text-mint" : "text-destructive"}>
                      {FORMATTERS.pct(a.change24h)}
                    </span>
                  </div>

                  {/* Desktop cells */}
                  <div className="hidden md:block w-28 text-right tabular-nums">{FORMATTERS.usd(a.price)}</div>
                  <div className="hidden md:flex w-28 justify-end">
                    <span className={`flex items-center gap-1 text-sm ${pos24 ? "text-mint" : "text-destructive"}`}>
                      {pos24 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {FORMATTERS.pct(a.change24h)}
                    </span>
                  </div>
                  <div className="hidden md:flex w-28 justify-end">
                    <span className={`text-sm ${pos7 ? "text-mint" : "text-destructive"}`}>
                      {FORMATTERS.pct(seven)}
                    </span>
                  </div>
                  <div className="hidden md:block w-36 text-right text-sm text-muted-foreground tabular-nums">
                    {FORMATTERS.usdShort(MOCK_VOLUME[a.symbol] ?? 0)}
                  </div>
                  <div className="hidden md:block w-24 text-right text-sm text-muted-foreground">
                    {a.leverage > 0 ? `${a.leverage}× long` : `${Math.abs(a.leverage)}× short`}
                  </div>
                  <div className="hidden md:flex w-10 justify-end text-muted-foreground group-hover:text-mint transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6">
        More markets launching soon. Submit a ticker request in <Link href="/learn" className="text-mint hover:underline">the Learn hub</Link>.
      </p>
    </div>
  );
}
