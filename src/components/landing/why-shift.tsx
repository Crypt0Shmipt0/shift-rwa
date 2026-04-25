import React from "react";
import Image from "next/image";
import { ShieldOff, Repeat, Layers, Wallet, ArrowLeftRight, Clock } from "lucide-react";
import { TOKENS } from "@/data/tokens";
import { TiltCard } from "@/components/motion/tilt-card";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ThesisSequence } from "@/components/landing/thesis-sequence";

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
    <section className="relative mx-auto max-w-[1200px] px-6 py-24">
      {/* Section eyebrow */}
      <div className="text-center mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint">
          Permissionless · 24/7 Trade · Fully Transparent
        </span>
      </div>
      <h2 className="text-center text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-2 mb-16">
        Two broken extremes.
        <br />
        <span className="text-gradient-mint">
          One product that fixes both.
        </span>
      </h2>

      {/* 3-beat thesis sequence — sticky scrollytelling on motion-ok, static on reduced */}
      <div className="mb-16">
        <ThesisSequence />
      </div>

      {/* Concept tile grid — row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5">
        {ROW_1.map((tile) => (
          <TiltCard key={tile.label} maxTilt={6} glare={false}>
            <ConceptTile icon={tile.icon} label={tile.label} sub={tile.sub} />
          </TiltCard>
        ))}
      </div>

      {/* Concept tile grid — row 2 (token tickers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {ROW_2.map((tile, i) => (
          <TiltCard key={`${tile.ticker}-${i}`} maxTilt={8} glare={true}>
            <TokenTile {...tile} />
          </TiltCard>
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


function ConceptTile({ icon: Icon, label, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; sub: string }) {
  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-b from-card to-background p-5 overflow-hidden hover:border-mint/40 transition-colors group flex items-center gap-4 min-h-[112px]">
      <div className="absolute -bottom-12 -right-12 size-32 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
      <div className="relative size-11 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center shrink-0 group-hover:bg-mint/20 transition-colors">
        <Icon className="h-5 w-5 text-mint" />
      </div>
      <div className="relative">
        <div className="text-sm font-semibold text-white leading-tight">{label}</div>
        <div className="text-xs text-muted-foreground mt-1 leading-snug">{sub}</div>
      </div>
    </div>
  );
}

function TokenTile({ ticker, img, sub }: { ticker: string; img: string; sub: string }) {
  return (
    <div className="relative rounded-2xl border border-mint/20 bg-gradient-to-br from-mint/[0.04] via-card to-card p-4 overflow-hidden hover:border-mint/50 transition-colors group">
      <div className="absolute -bottom-12 -right-12 size-32 rounded-full bg-mint/8 blur-3xl group-hover:bg-mint/15 transition-colors" />
      <div className="relative flex flex-col items-center justify-center text-center gap-2">
        <Image src={img} alt={ticker} width={72} height={72} className="size-12 md:size-14 rounded-full object-cover drop-shadow-[0_0_20px_rgba(38,200,184,0.35)]" />
        <div>
          <div className="text-base font-bold text-white">{ticker}</div>
          <div className="text-[11px] text-mint mt-0.5">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <SpotlightCard className="rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/10 via-card to-card p-5 backdrop-blur">
      <div className="absolute -top-10 -right-10 size-28 rounded-full bg-mint/10 blur-2xl" />
      <div className="relative">
        <div className="size-9 rounded-lg bg-mint/20 border border-mint/40 flex items-center justify-center text-mint mb-3">
          {icon}
        </div>
        <div className="font-bold text-white text-lg mb-1.5 tracking-tight">{title}</div>
        <p className="text-sm text-foreground/70 leading-relaxed">{body}</p>
      </div>
    </SpotlightCard>
  );
}
