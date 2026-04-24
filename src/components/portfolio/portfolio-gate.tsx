"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ShieldCheck, Eye, ArrowRight } from "lucide-react";
import { NetWorthHero } from "@/components/portfolio/net-worth-hero";
import { AllocationDonut } from "@/components/portfolio/allocation-donut";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { FeatureCallouts } from "@/components/portfolio/feature-callouts";

export function PortfolioGate() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectGate />;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10 space-y-8">
      <section className="grid grid-cols-12 gap-6">
        <NetWorthHero />
        <AllocationDonut />
      </section>
      <HoldingsTable />
      <FeatureCallouts />
    </div>
  );
}

function ConnectGate() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        {/* Left — copy + CTA */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-6">
            <Wallet className="h-3 w-3" />
            Wallet required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05] pb-1 mb-5">
            Connect a wallet to
            <br />
            <span className="text-gradient-mint">
              see your portfolio.
            </span>
          </h1>
          <p className="text-base text-foreground/70 leading-relaxed max-w-[480px] mb-8">
            SHIFT is fully non-custodial — your portfolio is your wallet. Connect any
            WalletConnect-compatible wallet to see your net worth, holdings, allocation, and PnL
            across every SHIFT market.
          </p>

          <div className="mb-10">
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <button
                  onClick={openConnectModal}
                  disabled={!mounted}
                  className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 active:-translate-y-px transition-all shadow-[0_0_30px_rgba(38,200,184,0.3)] disabled:opacity-50"
                >
                  <Wallet className="h-4 w-4" />
                  Connect wallet
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </ConnectButton.Custom>
          </div>

          <ul className="space-y-4 max-w-[480px]">
            <Feature
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Non-custodial by default"
              body="We never take custody. Your private keys never leave your device."
            />
            <Feature
              icon={<Eye className="h-4 w-4" />}
              title="Read-only by default"
              body="Connecting a wallet only reads your public balances. No transaction is signed until you trade."
            />
          </ul>
        </div>

        {/* Right — preview placeholder */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="size-[440px] rounded-full bg-[radial-gradient(circle,_rgba(38,200,184,0.18)_0%,_transparent_60%)]" />
          </div>
          <div className="relative rounded-3xl border border-border bg-card/60 backdrop-blur p-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Total Net Worth
            </div>
            <div className="text-5xl font-bold tabular-nums tracking-tight text-foreground/30 blur-sm select-none mb-3">
              $—,———.——
            </div>
            <div className="h-2 w-32 rounded-full bg-secondary mb-8" />

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 border-t border-border first:border-t-0"
              >
                <div className="size-9 rounded-full bg-secondary" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-20 rounded-full bg-secondary" />
                  <div className="h-2 w-32 rounded-full bg-secondary/60" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-2.5 w-16 rounded-full bg-secondary ml-auto" />
                  <div className="h-2 w-12 rounded-full bg-secondary/60 ml-auto" />
                </div>
              </div>
            ))}

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-16 rounded-2xl bg-mint/15 border border-mint/40 backdrop-blur-md flex items-center justify-center">
                <Wallet className="h-7 w-7 text-mint" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="size-8 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center text-mint shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</div>
      </div>
    </li>
  );
}
