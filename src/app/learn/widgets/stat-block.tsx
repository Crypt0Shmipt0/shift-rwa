"use client";

/**
 * StatBlock
 *
 * Four big animated counters: fees · redemption · trading hours · liquidations.
 * Numbers are factually pinned to the FAQ:
 *   - 0.10% fee per trade
 *   - 60s redemption (typical, illustrative — Alpaca rails)
 *   - 24/7 trading
 *   - 0 liquidations (architectural — no liquidation engine)
 *
 * Uses the existing CountUp helper for numeric animation.
 */

import { CountUp } from "@/components/motion/count-up";
import { Percent, Timer, Activity, ShieldOff } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";

const STATS = [
  {
    icon: Percent,
    value: 0.1,
    decimals: 2,
    suffix: "%",
    label: "Protocol fee",
    sub: "Per trade. Up to 50% rebate with rewards badge.",
  },
  {
    icon: Timer,
    value: 60,
    decimals: 0,
    suffix: "s",
    label: "Redemption",
    sub: "Burn → USDC, typical settlement on trading days.",
  },
  {
    icon: Activity,
    value: 24,
    decimals: 0,
    suffix: "/7",
    label: "Trading",
    sub: "On-chain, permissionless, never closed.",
  },
  {
    icon: ShieldOff,
    value: 0,
    decimals: 0,
    suffix: "",
    label: "Liquidations",
    sub: "No liquidation engine. NAV can drop, never auto-close.",
  },
];

export function StatBlock() {
  return (
    <section aria-label="Protocol stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <TiltCard key={i} maxTilt={6} scale={1.03} className="rounded-2xl">
              <div className="rounded-2xl border border-border bg-card p-4 md:p-5 h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 size-24 rounded-full bg-mint/10 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-3 relative">
                  <div className="size-8 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-mint" />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55">
                    {s.label}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-mint tabular-nums leading-none mb-2 relative">
                  <CountUp
                    to={s.value}
                    decimals={s.decimals}
                    suffix={s.suffix}
                    duration={1.2}
                  />
                </div>
                <p className="text-[11px] md:text-xs text-foreground/55 leading-relaxed relative">
                  {s.sub}
                </p>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
