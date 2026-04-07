"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { ArrowDown, ChevronDown, Wallet } from "lucide-react";
import { AssetPicker } from "@/components/trade/asset-picker";

type Side = "buy" | "sell";

export function SwapCard({ symbol = "TSL2s" }: { symbol?: string }) {
  const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
  const [side, setSide] = useState<Side>("buy");
  const [usd, setUsd] = useState("124032.00");
  const tokens = (parseFloat(usd || "0") / asset.price).toFixed(4);

  // Reset on asset change
  useEffect(() => {
    setUsd("124032.00");
  }, [symbol]);

  return (
    <div className="w-full">
      {/* Buy / Sell tabs (plain buttons — no Base UI Tabs) */}
      <div className="flex items-center gap-1 mb-3 ml-3">
        <button
          onClick={() => setSide("buy")}
          className={`px-3 py-1 text-base font-semibold rounded-2xl transition-colors ${
            side === "buy" ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`px-3 py-1 text-base font-semibold rounded-2xl transition-colors ${
            side === "sell" ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {/* From */}
      <div className="bg-card rounded-3xl px-8 py-6 border-2 border-mint">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{side === "buy" ? "Sell" : "Sell"}</span>
          <div className="flex items-center gap-2 text-xs text-mist">
            <Wallet className="h-3 w-3" />
            {side === "buy" ? "124,278.92" : "4,278.92"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          {side === "buy" ? (
            <UsdcChip />
          ) : (
            <AssetPicker symbol={asset.symbol} />
          )}
          <input
            value={side === "buy" ? usd : tokens}
            onChange={(e) => setUsd(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="0.00"
            className="bg-transparent text-right text-3xl font-semibold text-white outline-none w-full max-w-[260px] placeholder:text-muted-foreground tabular-nums"
          />
        </div>
      </div>

      {/* Switcher */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={() => setSide(side === "buy" ? "sell" : "buy")}
          className="size-10 rounded-full bg-card border-[3px] border-background flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Switch direction"
        >
          <ArrowDown className="h-4 w-4 text-mint" />
        </button>
      </div>

      {/* To */}
      <div className="bg-card rounded-3xl px-8 py-6 border-2 border-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{side === "buy" ? "Buy" : "Buy"}</span>
          <div className="flex items-center gap-2 text-xs text-mist">
            <Wallet className="h-3 w-3" />
            {side === "buy" ? "4,278.92" : "124,278.92"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          {side === "buy" ? (
            <AssetPicker symbol={asset.symbol} />
          ) : (
            <UsdcChip />
          )}
          <span className="text-3xl font-semibold text-white tabular-nums">
            {side === "buy" ? tokens : usd}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Button className="w-full h-14 mt-2 bg-mint text-primary-foreground hover:bg-mint/90 text-xl font-semibold rounded-2xl">
        {side === "buy" ? "Buy" : "Sell"} {asset.symbol}
      </Button>

      {/* Rate */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs">
        <span className="text-mist">Rate</span>
        <span className="text-foreground/80">{asset.price.toFixed(2)} USDC = 1 {asset.symbol}</span>
      </div>
    </div>
  );
}

function UsdcChip() {
  return (
    <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-secondary">
      <span className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">$</span>
      <span className="text-base text-foreground">USDC</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </div>
  );
}
