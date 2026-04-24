import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, FileText, ArrowUpRight, ShieldCheck, CircleCheck, Coins, ArrowLeftRight, ArrowUpFromLine } from "lucide-react";
import { ScrollProgress } from "@/components/motion/scroll-progress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "FAQs on leveraged tokens, daily rebalancing, and on-chain execution. For the full docs, see our Gitbook.",
  alternates: { canonical: "/learn" },
};

const FAQ = [
  {
    q: "What problem does SHIFT actually solve?",
    a: "Two problems Web3 traders hit every day. One: spot stocks move 1% a day — boring for active traders used to crypto volatility. Two: leveraged perps blow you up on routine 5% wicks. SHIFT is the bi-directional leveraged RWA protocol that solves both — 3× and 2× tokenized stocks, ETFs, and ETNs with daily-reset leverage and zero liquidation risk. You can hold a 3× long or a 2× short without ever being forced to close.",
  },
  {
    q: "Is SHIFT custodial?",
    a: "No. SHIFT is fully non-custodial. Your tokens sit in your wallet; the protocol never takes custody. All trades happen via smart contracts on Solana. Other chains Coming Soon!",
  },
  {
    q: "Which underlyings are supported?",
    a: "Currently Tesla (TSL2L, TSL1S), Semiconductors (SOX3L, SOX3S), S&P 500 (SPX3L, SPX3S), and Uranium (URA2L). We publish new markets monthly — see the Markets page for the current list.",
  },
  {
    q: "How can leverage exist with zero liquidation risk?",
    a: "Because SHIFT tokens are SPL tokens on Solana, not collateralized margin positions, there is no liquidation engine. No price feed or oracle dependence, protecting you from liquidation — the worst case is the token's net asset value going to zero, never a forced close with losses beyond your entry.",
  },
  {
    q: "What happens if the underlying stock market is closed?",
    a: "Our on-chain markets trade 24/7. During US market closure, prices are set by the Chainlink oracle and may diverge slightly from the reference underlying until US open.",
  },
  {
    q: "How is the 2× or 3× multiple maintained?",
    a: "Through a daily on-chain rebalancing mechanism. The protocol adjusts the token's underlying exposure at 4:00 PM ET each trading day to reset the leverage target.",
  },
  {
    q: "What are the fees?",
    a: "Protocol fee is 0.10% per trade. Network gas is paid in SOL (fractions of a cent on Solana). Rewards-badge holders get up to 50% fee rebates.",
  },
  {
    q: "Is SHIFT available in my country?",
    a: "SHIFT is geofenced from several restricted jurisdictions. See the Disclaimer for the full list.",
  },
  {
    q: "How do I request a new listing?",
    a: "Ping us on X @SHIFTfinance with the ticker and underlying rationale, or email markets@shift.finance. We prioritize tickers with clear on-chain oracle support.",
  },
];

export default function LearnPage() {
  return (
    <>
    <ScrollProgress />
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      {/* Hero */}
      <div className="mb-12 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          <BookOpen className="h-3 w-3" />
          Learn hub
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Why SHIFT, and how it works.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          SHIFT tokens are SPL-native, backed by tokenized equities with Chainlink Proof-of-Reserves.
          No liquidation engine. No KYC. No broker. This page explains the mechanics —{" "}
          <Link
            href="https://shift-stocks.gitbook.io/learn"
            target="_blank"
            rel="noreferrer"
            className="text-mint hover:underline"
          >
            or jump straight to the Gitbook
          </Link>{" "}
          for protocol-level detail.
        </p>
      </div>

      {/* FAQ */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-mint" />
        <h2 className="text-lg font-semibold text-white">Frequently asked</h2>
      </div>
      <Card className="bg-card border-border rounded-2xl px-6 py-2 mb-12">
        <Accordion className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-mint hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* How it works */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeftRight className="h-4 w-4 text-mint" />
          <h2 className="text-lg font-semibold text-white">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Back",
              body: "Direxion ETF (TSLL) is purchased and custodied via Alpaca Markets.",
            },
            {
              icon: CircleCheck,
              title: "Verify",
              body: "Chainlink Proof-of-Reserves confirms 1:1 backing, on-chain.",
            },
            {
              icon: Coins,
              title: "Mint",
              body: "SHIFT smart contract mints the SPL token (TSL2L) on Solana.",
            },
            {
              icon: ArrowLeftRight,
              title: "Trade",
              body: "Buy / sell / LP / lend TSL2L across Jupiter, Meteora, Kamino, Orca — 24/7, permissionless.",
            },
            {
              icon: ArrowUpFromLine,
              title: "Redeem",
              body: "Burn TSL2L on-chain → underlying ETF value is redeemed 24/5 via Alpaca rails → USDC to your wallet.",
            },
          ].map((step, i) => (
            <div key={step.title} className="relative flex flex-col">
              <Card className="bg-card border-border rounded-2xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center size-7 rounded-full bg-mint/15 text-mint text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <step.icon className="h-4 w-4 text-mint" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
              </Card>
              {i < 4 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center size-4">
                  <svg viewBox="0 0 16 16" className="h-3 w-3 text-mint/50 fill-current">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gitbook CTA */}
      <Card className="bg-gradient-to-br from-mint/10 via-card to-card border-mint/30 rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-52 rounded-full bg-mint/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-mint mb-2">
              Full documentation
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
              Read the deep-dive docs on Gitbook.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Protocol mechanics, rebalancing math, oracle architecture, risk disclosures, and
              builder guides — all kept up to date in our Gitbook.
            </p>
          </div>
          <Link
            href="https://shift-stocks.gitbook.io/learn"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:bg-mint/90 transition-colors shrink-0 shadow-[0_0_30px_rgba(38,200,184,0.25)]"
          >
            Open Gitbook
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </Card>
    </div>
    </>
  );
}
