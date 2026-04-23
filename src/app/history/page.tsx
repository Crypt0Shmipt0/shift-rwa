import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAsset } from "@/lib/mock";
import { Download, Filter } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description:
    "Every trade your wallet has executed on SHIFT — timestamps, prices, totals, tx hashes. Export to CSV for accounting.",
  alternates: { canonical: "/history" },
};

type Tx = {
  id: string;
  type: "Buy" | "Sell";
  symbol: string;
  amount: number;
  price: number;
  total: number;
  time: string;
  hash: string;
};

const TX: Tx[] = [
  { id: "1", type: "Buy",  symbol: "TSx2",   amount: 12.5, price: 175.60, total: 2195.00,  time: "2 hours ago", hash: "0x8f2a...3e91" },
  { id: "2", type: "Sell", symbol: "SOXx3",  amount: 5.0,  price: 142.18, total: 710.90,   time: "5 hours ago", hash: "0x1c6b...9a24" },
  { id: "3", type: "Buy",  symbol: "S&Px3",  amount: 20.0, price: 563.22, total: 11264.40, time: "1 day ago",   hash: "0x74d9...5f08" },
  { id: "4", type: "Sell", symbol: "TSx2",   amount: 8.25, price: 168.40, total: 1389.30,  time: "2 days ago",  hash: "0x3e12...b7c5" },
  { id: "5", type: "Buy",  symbol: "TSS",    amount: 50.0, price: 42.77,  total: 2138.50,  time: "3 days ago",  hash: "0xae48...2109" },
  { id: "6", type: "Buy",  symbol: "SOXx3S", amount: 14.2, price: 38.45,  total: 545.99,   time: "4 days ago",  hash: "0x92af...6e83" },
  { id: "7", type: "Sell", symbol: "S&Px3S", amount: 3.0,  price: 89.33,  total: 267.99,   time: "5 days ago",  hash: "0xdc55...7b41" },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">History</h1>
          <p className="text-sm text-muted-foreground">Every trade your wallet has executed on SHIFT.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border bg-secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="border-border bg-secondary">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border rounded-3xl overflow-hidden p-0">
        {/* Desktop header */}
        <div className="hidden md:flex items-center px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="w-20">Type</div>
          <div className="flex-1">Asset</div>
          <div className="w-28 text-right">Amount</div>
          <div className="w-32 text-right">Price</div>
          <div className="w-32 text-right">Total</div>
          <div className="w-28 text-right">Tx</div>
          <div className="w-28 text-right">Time</div>
        </div>

        <ul className="divide-y divide-border">
          {TX.map((t) => {
            const a = getAsset(t.symbol);
            const isBuy = t.type === "Buy";
            return (
              <li key={t.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                {/* Desktop row */}
                <div className="hidden md:flex items-center">
                  <div className="w-20">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isBuy ? "bg-mint/10 text-mint" : "bg-destructive/10 text-destructive"}`}>
                      {t.type}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <Image src={a.image} alt={a.symbol} width={32} height={32} className="size-8 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-medium">{a.symbol}</div>
                      <div className="text-xs text-muted-foreground">{a.name}</div>
                    </div>
                  </div>
                  <div className="w-28 text-right text-sm tabular-nums">{t.amount}</div>
                  <div className="w-32 text-right text-sm tabular-nums">${t.price.toFixed(2)}</div>
                  <div className="w-32 text-right text-sm font-semibold tabular-nums">${t.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="w-28 text-right text-xs text-mint font-mono truncate">{t.hash}</div>
                  <div className="w-28 text-right text-xs text-muted-foreground">{t.time}</div>
                </div>

                {/* Mobile row */}
                <div className="md:hidden flex items-center gap-3">
                  <Image src={a.image} alt={a.symbol} width={40} height={40} className="size-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isBuy ? "bg-mint/10 text-mint" : "bg-destructive/10 text-destructive"}`}>
                          {t.type.toUpperCase()}
                        </span>
                        <span className="font-semibold text-sm truncate">{a.symbol}</span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">${t.total.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-1">
                      <span>{t.amount} @ ${t.price.toFixed(2)}</span>
                      <span>{t.time}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
