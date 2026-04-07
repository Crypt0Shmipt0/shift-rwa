import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, PlayCircle, FileText, ArrowUpRight, Lightbulb, ShieldCheck, Wallet, TrendingUp } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Guides, tutorials, and FAQs on leveraged tokens, daily rebalancing, and on-chain execution. Designed for traders who want to understand the math.",
  alternates: { canonical: "/learn" },
};

const GUIDES = [
  {
    icon: Lightbulb,
    title: "Why 3× & 2× leveraged tokens?",
    body: "Spot stocks move too slow for active traders. Perps blow you up on 5% wicks. SHIFT tokens deliver a daily multiple of the underlying — long or short — with no margin account and no liquidation.",
    href: "#",
    read: "4 min read",
  },
  {
    icon: TrendingUp,
    title: "Bi-directional: long + short, same market",
    body: "Every SHIFT market ships a long and an inverse side. Buy TSL2s for 2× upside; buy TSLSs to short Tesla. Switch directions without closing positions in a margin account.",
    href: "#",
    read: "5 min read",
  },
  {
    icon: ShieldCheck,
    title: "Zero liquidation risk, explained",
    body: "Because SHIFT tokens are ERC-20s, not collateralized margin positions, there is no liquidation engine. The worst case is the token's net asset value going to zero — never a forced close with losses beyond your entry.",
    href: "#",
    read: "5 min read",
  },
  {
    icon: TrendingUp,
    title: "Daily rebalancing & decay",
    body: "The protocol rebalances once a day to reset the leverage target. Over multiple days, compounding means returns can diverge from a simple 2× or 3× calc — this is decay. Understand it before holding long term.",
    href: "#",
    read: "6 min read",
  },
  {
    icon: Wallet,
    title: "Funding your wallet",
    body: "Bridge USDC to Base, Arbitrum, or Optimism. Any wallet supporting WalletConnect works — MetaMask, Rainbow, Zerion, Privy-embedded, and more.",
    href: "#",
    read: "3 min read",
  },
  {
    icon: Lightbulb,
    title: "Tax basics",
    body: "Leveraged token trades are generally treated as taxable events per trade in most jurisdictions. Export your activity for your accountant from the Portfolio page.",
    href: "#",
    read: "8 min read",
  },
];

const VIDEOS = [
  { title: "Your first trade on SHIFT", dur: "2:14" },
  { title: "Reading the trading view chart", dur: "3:48" },
  { title: "Portfolio and PnL accounting", dur: "4:22" },
  { title: "Managing slippage and fees", dur: "2:56" },
];

const FAQ = [
  {
    q: "What problem does SHIFT actually solve?",
    a: "Two problems Web3 traders hit every day. One: spot stocks move 1% a day — boring for active traders used to crypto volatility. Two: leveraged perps blow you up on routine 5% wicks. SHIFT is the bi-directional leveraged RWA protocol that solves both — 3× and 2× tokenized stocks, ETFs, and ETNs with daily-reset leverage and zero liquidation risk. You can hold a 3× long or a 2× short without ever being forced to close.",
  },
  {
    q: "Is SHIFT custodial?",
    a: "No. SHIFT is fully non-custodial. Your tokens sit in your wallet; the protocol never takes custody. All trades happen via smart contracts on Base, Arbitrum, or Optimism.",
  },
  {
    q: "Which underlyings are supported?",
    a: "Currently Tesla (TSLA), Nvidia (NVDA), S&P 500 (SPY), and Tesla Short. We publish new markets monthly — see the Markets page for the current list.",
  },
  {
    q: "What happens if the underlying stock market is closed?",
    a: "Our on-chain markets trade 24/7. During US market closure, prices are set by our oracle and may diverge slightly from the reference underlying until US open.",
  },
  {
    q: "How is the 2× or 3× multiple maintained?",
    a: "Through a daily on-chain rebalancing mechanism. The protocol adjusts the token's underlying exposure at 4:00 PM ET each trading day to reset the leverage target.",
  },
  {
    q: "What are the fees?",
    a: "Protocol fee is 0.10% per trade. Network gas is paid in the native token of the chain. Rewards tier holders get up to 50% fee rebates.",
  },
  {
    q: "Is SHIFT available in my country?",
    a: "SHIFT is geofenced from several restricted jurisdictions including the US, UK, and sanctioned regions. See the Disclaimer for the full list.",
  },
  {
    q: "How do I request a new listing?",
    a: "Ping us on X @SHIFTfinance with the ticker and underlying rationale, or email markets@shift.finance. We prioritize tickers with clear on-chain oracle support.",
  },
];

export default function LearnPage() {
  return (
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
          Stocks are too slow. Perps blow you up. SHIFT is the bi-directional leveraged RWA protocol
          that solves both — 3× and 2× tokenized stocks, ETFs, and ETNs with zero liquidation risk.
          These guides cover the mechanics, the math, and the edge cases.
        </p>
      </div>

      {/* Guides */}
      <h2 className="text-lg font-semibold text-white mb-4">Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {GUIDES.map((g) => {
          const Icon = g.icon;
          return (
            <Link key={g.title} href={g.href} className="group">
              <Card className="bg-card border-border rounded-2xl p-6 h-full hover:border-mint/40 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-mint" />
                  </div>
                  <span className="text-xs text-muted-foreground">{g.read}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-mint transition-colors">
                  {g.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.body}</p>
                <div className="flex items-center gap-1 text-xs text-mint mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read <ArrowUpRight className="h-3 w-3" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Videos */}
      <h2 className="text-lg font-semibold text-white mb-4">Video tutorials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {VIDEOS.map((v) => (
          <Card key={v.title} className="bg-card border-border rounded-2xl p-5 hover:border-mint/40 transition-colors cursor-pointer group">
            <div className="aspect-video bg-secondary rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PlayCircle className="h-9 w-9 text-mint relative" />
            </div>
            <div className="font-medium text-sm text-white mb-1">{v.title}</div>
            <div className="text-xs text-muted-foreground">{v.dur}</div>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-mint" />
        <h2 className="text-lg font-semibold text-white">Frequently asked</h2>
      </div>
      <Card className="bg-card border-border rounded-2xl px-6 py-2">
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
    </div>
  );
}
