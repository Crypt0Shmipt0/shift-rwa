"use client";

import Image from "next/image";
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
      <PopoverTrigger className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#333] hover:bg-mint/15 hover:border-mint border border-transparent transition-all">
        <Image src={current.image} alt={current.symbol} width={32} height={32} className="size-8 rounded-full object-cover" />
        <span className="font-semibold text-base text-foreground">{current.symbol}</span>
        <ChevronDown className="h-3 w-3 text-[#d9d9d9]" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1 bg-[#1a1a1a] border-border" align="end">
        {ASSETS.map((a) => {
          const positive = a.change24h >= 0;
          return (
            <button
              key={a.symbol}
              onClick={() => {
                setOpen(false);
                router.push(`/trade/${a.symbol}`);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-[#333] transition-colors text-left ${
                a.symbol === current.symbol ? "bg-[#333]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Image src={a.image} alt={a.symbol} width={32} height={32} className="size-8 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-sm text-foreground">{a.symbol}</div>
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
