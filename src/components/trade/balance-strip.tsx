import { Card } from "@/components/ui/card";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { TrendingUp, TrendingDown } from "lucide-react";

export function BalanceStrip({ symbol = "TSL2s" }: { symbol?: string }) {
  const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
  const positive = asset.change24h >= 0;
  return (
    <Card className="bg-card border-border p-5 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-mint/20 flex items-center justify-center text-mint font-bold">
          {asset.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="font-semibold">{asset.symbol}</div>
          <div className="text-xs text-muted-foreground">{asset.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold tabular-nums">{FORMATTERS.usd(asset.price)}</div>
        <div className={`text-xs flex items-center justify-end gap-1 ${positive ? "text-mint" : "text-destructive"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {FORMATTERS.pct(asset.change24h)}
        </div>
      </div>
    </Card>
  );
}
