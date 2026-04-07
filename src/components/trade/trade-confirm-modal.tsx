"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Asset } from "@/lib/mock";
import { FORMATTERS } from "@/lib/mock";
import { ArrowDown, Info, Loader2, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  side: "buy" | "sell";
  asset: Asset;
  usdAmount: number;
  tokenAmount: number;
  slippage: number;
  rate: number;
};

export function TradeConfirmModal({
  open, onOpenChange, side, asset, usdAmount, tokenAmount, slippage, rate,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const feePct = 0.1;
  const feeUsd = usdAmount * (feePct / 100);
  const priceImpactPct = Math.min(5, Math.max(0.02, usdAmount / 2_000_000 * 100));
  const minReceived = tokenAmount * (1 - slippage / 100);

  const handleConfirm = async () => {
    setSubmitting(true);
    // Simulate wallet sign + on-chain
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    onOpenChange(false);
    toast.success(`${side === "buy" ? "Bought" : "Sold"} ${FORMATTERS.num(tokenAmount)} ${asset.symbol}`, {
      description: `Settled ${FORMATTERS.usd(usdAmount)} at ${FORMATTERS.usd(rate)} / ${asset.symbol}`,
      action: {
        label: "View tx",
        onClick: () => window.open("https://basescan.org", "_blank"),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Review trade</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Confirm the details below before signing.
          </DialogDescription>
        </DialogHeader>

        {/* Two-box summary */}
        <div className="mt-4 space-y-1">
          <SummaryBox
            label={side === "buy" ? "You pay" : "You sell"}
            symbol={side === "buy" ? "USDC" : asset.symbol}
            image={side === "buy" ? "/trade/usdc.png" : asset.image}
            amount={side === "buy" ? FORMATTERS.usd(usdAmount) : FORMATTERS.num(tokenAmount)}
          />
          <div className="flex justify-center -my-1 relative z-10">
            <div className="size-8 rounded-full bg-card border-4 border-background flex items-center justify-center">
              <ArrowDown className="h-3.5 w-3.5 text-mint" />
            </div>
          </div>
          <SummaryBox
            label={side === "buy" ? "You receive" : "You receive"}
            symbol={side === "buy" ? asset.symbol : "USDC"}
            image={side === "buy" ? asset.image : "/trade/usdc.png"}
            amount={side === "buy" ? FORMATTERS.num(tokenAmount) : FORMATTERS.usd(usdAmount)}
          />
        </div>

        {/* Detail rows */}
        <div className="mt-5 space-y-2.5 text-sm">
          <Row label="Rate">1 {asset.symbol} = {FORMATTERS.usd(rate)}</Row>
          <Row
            label="Price impact"
            value={`${priceImpactPct.toFixed(2)}%`}
            valueClass={priceImpactPct > 1 ? "text-destructive" : "text-mint"}
            tip="Estimated price movement this trade will cause against available liquidity."
          />
          <Row
            label="Slippage tolerance"
            value={`${slippage}%`}
            tip="Maximum price movement you'll accept between quote and execution."
          />
          <Row label="Min received">
            {FORMATTERS.num(minReceived)} {side === "buy" ? asset.symbol : "USDC"}
          </Row>
          <Row label="Protocol fee">{FORMATTERS.usd(feeUsd)} ({feePct}%)</Row>
          <Row label="Network">Base</Row>
        </div>

        {priceImpactPct > 1 && (
          <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-xs text-destructive flex gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>High price impact. Consider splitting this trade into smaller orders.</span>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-border bg-secondary"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 bg-mint text-primary-foreground hover:bg-mint/90"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm {side}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryBox({
  label, symbol, image, amount,
}: { label: string; symbol: string; image: string; amount: string }) {
  return (
    <div className="bg-secondary rounded-2xl px-5 py-4">
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Image src={image} alt={symbol} width={28} height={28} className="size-7 rounded-full object-cover" />
          <span className="font-semibold">{symbol}</span>
        </div>
        <span className="text-xl font-semibold tabular-nums">{amount}</span>
      </div>
    </div>
  );
}

function Row({
  label, value, tip, children, valueClass,
}: {
  label: string;
  value?: string;
  tip?: string;
  children?: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground flex items-center gap-1">
        {label}
        {tip && (
          <Tooltip>
            <TooltipTrigger
              aria-label={`${label} info`}
              className="text-muted-foreground/60 hover:text-muted-foreground inline-flex"
            >
              <Info className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-xs">{tip}</TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className={`tabular-nums ${valueClass ?? "text-foreground"}`}>
        {value ?? children}
      </span>
    </div>
  );
}
