import React from "react";
import Image from "next/image";
import { ShieldOff, Repeat, Layers, Wallet, ArrowLeftRight, Clock } from "lucide-react";
import { TOKENS } from "@/data/tokens";

const ROW_1 = [
  { icon: Wallet,         label: "Wallet-native",     sub: "SPL tokens you hold in any Solana wallet" },
  { icon: ArrowLeftRight, label: "Bi-directional",    sub: "Long & short on every market" },
  { icon: Layers,         label: "DeFi composable",   sub: "LP, lend, or transfer — standard SPL" },
  { icon: Clock,          label: "24/7 permissionless", sub: "Settles in seconds, always on-chain" },
];

const ROW_2 = TOKENS.map((t) => ({
  ticker: t.shiftTicker,
  img: t.image,
  sub: t.direction === "long" ? `${t.leverage}× long` : `${t.leverage}× short`,
}));

export function LandingWhy() {
  return (
    <section className="relative mx-auto max-w-[1280px] px-6 py-28">
      {/* Section eyebrow */}
      <div className="text-center mb-3">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint">
          Permissionless · 24/7 Trade · Fully Transparent
        </span>
      </div>
      <h2 className="text-center text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-2 mb-16">
        Two broken extremes.
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
        >
          One product that fixes both.
        </span>
      </h2>

      {/* The problem strip (red) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        <ProblemCard
          icon={<ShieldOff className="h-5 w-5" />}
          tag="1× spot stocks"
          title="Boring"
          body="Tesla moves 1.4% on a typical day. SPY moves 0.8%. For traders coming from crypto volatility, that's not a market — that's a savings account."
        />
        <ProblemCard
          icon={<ShieldOff className="h-5 w-5" />}
          tag="Perps & margin"
          title="Liquidating"
          body="A 3× perp on TSLA gets blown out by a routine 5% wick. Funding rates eat your edge. The brokerage equivalent margin-calls you at the worst moment."
        />
      </div>

      {/* Concept tile grid — row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {ROW_1.map((tile) => (
          <ConceptTile key={tile.label} icon={tile.icon} label={tile.label} sub={tile.sub} />
        ))}
      </div>

      {/* Concept tile grid — row 2 (token tickers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {ROW_2.map((tile, i) => (
          <TokenTile key={`${tile.ticker}-${i}`} {...tile} />
        ))}
      </div>

      {/* Features grid — Long / Short / No liquidation */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <FeatureCard icon={<Repeat className="h-5 w-5" />} title="Long" body="2× and 3× tokenized exposure to major indices, sectors, and single names." />
        <FeatureCard icon={<Layers className="h-5 w-5" />} title="Short" body="Inverse tokens on every market — take the other side without a margin account." />
        <FeatureCard icon={<ShieldOff className="h-5 w-5" />} title="No liquidation" body="No liquidation engine. No forced close. Your token NAV is your worst case." />
      </div>
    </section>
  );
}

function ProblemCard({
  icon, tag, title, body,
}: { icon: React.ReactNode; tag: string; title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-destructive/25 bg-gradient-to-br from-destructive/10 via-card to-card p-8">
      <div className="absolute -top-20 -right-20 size-60 rounded-full bg-destructive/10 blur-3xl" />
      <div className="relative flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive/80">
          {tag}
        </span>
      </div>
      <div className="relative text-3xl font-bold text-white mb-3">{title}</div>
      <p className="relative text-sm text-foreground/65 leading-relaxed">{body}</p>
    </div>
  );
}

function ConceptTile({ icon: Icon, label, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; sub: string }) {
  return (
    <div className="relative aspect-square rounded-3xl border border-border bg-gradient-to-b from-card to-background p-6 overflow-hidden hover:border-mint/40 transition-colors group">
      {/* Mint corner glow */}
      <div className="absolute -bottom-16 -right-16 size-40 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
      <div className="relative h-full flex flex-col items-center justify-between text-center">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="size-14 rounded-2xl bg-mint/10 border border-mint/30 flex items-center justify-center group-hover:bg-mint/20 transition-colors">
            <Icon className="h-7 w-7 text-mint" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
        </div>
      </div>
      {/* Mint border accent on hover */}
      <div className="absolute inset-0 rounded-3xl border border-mint/0 group-hover:border-mint/30 transition-colors pointer-events-none" />
    </div>
  );
}

function TokenTile({ ticker, img, sub }: { ticker: string; img: string; sub: string }) {
  return (
    <div className="relative aspect-square rounded-3xl border border-mint/20 bg-gradient-to-br from-mint/[0.04] via-card to-card p-6 overflow-hidden hover:border-mint/50 transition-colors group">
      <div className="absolute -bottom-20 -right-20 size-48 rounded-full bg-mint/8 blur-3xl group-hover:bg-mint/15 transition-colors" />
      <div className="relative h-full flex flex-col items-center justify-center text-center gap-4">
        <Image src={img} alt={ticker} width={96} height={96} className="size-20 md:size-24 rounded-full object-cover drop-shadow-[0_0_30px_rgba(38,200,184,0.4)]" />
        <div>
          <div className="text-xl font-bold text-white">{ticker}</div>
          <div className="text-[11px] text-mint mt-0.5">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/10 via-card to-card p-6 backdrop-blur">
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-mint/10 blur-2xl" />
      <div className="relative">
        <div className="size-10 rounded-xl bg-mint/20 border border-mint/40 flex items-center justify-center text-mint mb-4">
          {icon}
        </div>
        <div className="font-bold text-white text-2xl mb-2 tracking-tight">{title}</div>
        <p className="text-sm text-foreground/70 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
