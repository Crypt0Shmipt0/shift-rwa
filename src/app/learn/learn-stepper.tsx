"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  CircleCheck,
  Coins,
  ArrowLeftRight,
  ArrowUpFromLine,
} from "lucide-react";

const STEPS = [
  {
    icon: ShieldCheck,
    title: "Back",
    body: "Direxion ETF (TSLL) is purchased and custodied via Alpaca Markets.",
    extended:
      "The underlying ETF is held in a fully regulated brokerage account at Alpaca. Chainlink Proof-of-Reserves runs continuously to verify the collateral on-chain, every block.",
  },
  {
    icon: CircleCheck,
    title: "Verify",
    body: "Chainlink Proof-of-Reserves confirms 1:1 backing, on-chain.",
    extended:
      "A Chainlink oracle job reads Alpaca's custodied balance and posts it to Solana every 60 seconds. Any discrepancy pauses minting automatically — you never hold an unbacked token.",
  },
  {
    icon: Coins,
    title: "Mint",
    body: "SHIFT smart contract mints the SPL token (TSL2L) on Solana.",
    extended:
      "The SHIFT program mints a standard SPL token that lives in your wallet. No special wallet required — it works with Phantom, Backpack, Solflare, and any SPL-compatible wallet.",
  },
  {
    icon: ArrowLeftRight,
    title: "Trade",
    body: "Buy / sell / LP / lend TSL2L across Jupiter, Meteora, Kamino, Orca — 24/7, permissionless.",
    extended:
      "Because SHIFT tokens are standard SPL, every DeFi primitive works out of the box. Swap on Jupiter with 1-click, provide liquidity on Meteora, or post as collateral on Kamino.",
  },
  {
    icon: ArrowUpFromLine,
    title: "Redeem",
    body: "Burn TSL2L on-chain → underlying ETF value is redeemed 24/5 via Alpaca rails → USDC to your wallet.",
    extended:
      "Redemption burns the SPL token, triggers an off-chain settlement via Alpaca's brokerage API, and routes the USD proceeds back to your wallet as USDC — typically within minutes on trading days.",
  },
];

export function LearnStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [userClicked, setUserClicked] = useState(false);

  const advance = useCallback(() => {
    setActiveStep((s) => (s + 1) % STEPS.length);
  }, []);

  // Auto-advance every 5 seconds unless user has clicked
  useEffect(() => {
    if (userClicked) return;
    const id = setInterval(advance, 5000);
    return () => clearInterval(id);
  }, [userClicked, advance]);

  function handleStepClick(i: number) {
    setActiveStep(i);
    setUserClicked(true);
  }

  return (
    <div>
      {/* Step cards row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <div key={step.title} className="relative flex flex-col">
              <button
                type="button"
                onClick={() => handleStepClick(i)}
                className="text-left w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded-2xl"
              >
                <Card
                  className={[
                    "bg-card border-border rounded-2xl p-5 flex-1 transition-all duration-300",
                    isActive
                      ? "border-mint/60 shadow-[0_0_20px_rgba(38,200,184,0.18)] scale-[1.03]"
                      : "hover:border-mint/30",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={[
                        "flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors",
                        isActive
                          ? "bg-mint text-[#021C24]"
                          : isPast
                            ? "bg-mint/30 text-mint"
                            : "bg-mint/15 text-mint",
                      ].join(" ")}
                    >
                      {i + 1}
                    </div>
                    <step.icon
                      className={`h-4 w-4 transition-colors ${isActive ? "text-mint" : "text-mint/60"}`}
                    />
                  </div>
                  <div
                    className={`text-sm font-semibold mb-1 transition-colors ${isActive ? "text-white" : "text-white/70"}`}
                  >
                    {step.title}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
                </Card>
              </button>

              {/* Connector arrow — glow mint if past, muted if future */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center size-4">
                  <svg viewBox="0 0 16 16" className={`h-3 w-3 fill-current transition-colors ${isPast || isActive ? "text-mint" : "text-mint/30"}`}>
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded description */}
      <div
        key={activeStep}
        className="mt-6 rounded-2xl border border-mint/30 bg-mint/5 px-6 py-4 text-sm text-foreground/80 leading-relaxed"
        style={{ animation: "vt-row-in 280ms ease both" }}
      >
        <span className="font-semibold text-mint mr-2">{STEPS[activeStep].title}:</span>
        {STEPS[activeStep].extended}
      </div>

      {/* Step dots for mobile */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {STEPS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleStepClick(i)}
            className={`size-2 rounded-full transition-colors ${i === activeStep ? "bg-mint" : "bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
