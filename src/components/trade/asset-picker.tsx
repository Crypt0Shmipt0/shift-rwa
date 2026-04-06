"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

export function AssetPicker({ symbol }: { symbol: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-1 text-sm bg-background rounded-full px-3 py-1.5 hover:bg-background/60 transition-colors">
        <span className="h-5 w-5 rounded-full bg-mint" />
        <span className="font-semibold">{current.symbol}</span>
        <ChevronDown className="h-3 w-3" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1 bg-card border-border" align="end">
        {ASSETS.map((a) => {
          const positive = a.change24h >= 0;
          return (
            <button
              key={a.symbol}
              onClick={() => {
                setOpen(false);
                router.push(`/trade/${a.symbol}`);
              }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-mint/15 flex items-center justify-center text-mint text-xs font-bold">
                  {a.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{a.symbol}</div>
                  <div className="text-xs text-muted-foreground">{a.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm tabular-nums">{FORMATTERS.usd(a.price)}</div>
                <div className={`text-xs flex items-center justify-end gap-0.5 ${positive ? "text-mint" : "text-destructive"}`}>
                  {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {FORMATTERS.pct(a.change24h)}
                </div>
              </div>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
