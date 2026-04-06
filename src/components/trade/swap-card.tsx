"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { ArrowDown, ChevronDown } from "lucide-react";
import { AssetPicker } from "@/components/trade/asset-picker";

type Side = "buy" | "sell";

export function SwapCard({ symbol = "TSL2s" }: { symbol?: string }) {
  const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
  const [side, setSide] = useState<Side>("buy");
  const [usd, setUsd] = useState("124032.00");
  const tokens = (parseFloat(usd || "0") / asset.price).toFixed(4);

  return (
    <Card className="bg-card border-border p-6 rounded-2xl">
      <Tabs value={side} onValueChange={(v) => setSide(v as Side)} className="w-full">
        <TabsList className="bg-transparent p-0 h-auto gap-6 mb-6">
          <TabsTrigger
            value="buy"
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground text-2xl font-semibold px-0 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-[-8px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-mint"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground text-2xl font-semibold px-0 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-[-8px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-mint"
          >
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="mt-2 space-y-3">
          <FieldRow
            label="From"
            symbol={side === "buy" ? "USD" : asset.symbol}
            value={side === "buy" ? usd : tokens}
            onChange={setUsd}
            editable={side === "buy"}
            picker={side === "buy" ? null : <AssetPicker symbol={asset.symbol} />}
          />
          <div className="flex justify-center -my-1 relative z-10">
            <div className="rounded-full bg-mint/10 border border-mint/30 p-2">
              <ArrowDown className="h-4 w-4 text-mint" />
            </div>
          </div>
          <FieldRow
            label="To"
            symbol={side === "buy" ? asset.symbol : "USD"}
            value={side === "buy" ? tokens : usd}
            onChange={setUsd}
            editable={side === "sell"}
            picker={side === "buy" ? <AssetPicker symbol={asset.symbol} /> : null}
          />

          <div className="flex justify-between text-xs text-muted-foreground pt-3">
            <span>1 {asset.symbol} ≈ {FORMATTERS.usd(asset.price)}</span>
            <span>Slippage 0.5% · Fee 0.1%</span>
          </div>

          <Button className="w-full h-12 mt-4 bg-mint text-primary-foreground hover:bg-mint/90 text-base font-semibold rounded-xl">
            {side === "buy" ? "Buy" : "Sell"} {asset.symbol}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function FieldRow({
  label, symbol, value, onChange, editable, picker,
}: {
  label: string; symbol: string; value: string; onChange: (v: string) => void; editable: boolean;
  picker: React.ReactNode;
}) {
  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {picker ?? (
          <div className="flex items-center gap-1 text-sm bg-background rounded-full px-3 py-1.5">
            <span className="h-5 w-5 rounded-full bg-foreground/30" />
            <span className="font-semibold">{symbol}</span>
            <ChevronDown className="h-3 w-3 opacity-0" />
          </div>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!editable}
        className="w-full bg-transparent text-3xl font-semibold outline-none tabular-nums"
      />
    </div>
  );
}
