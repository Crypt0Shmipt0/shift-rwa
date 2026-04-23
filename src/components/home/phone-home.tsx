"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Home,
  Wallet,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react";

import { ASSETS, FORMATTERS } from "@/lib/mock";

const ASSET_CARDS = [
  { symbol: "TSx2",   label: "Tesla x2",       img: "/phone/coin-ethereum.png", rotate: "-27.9deg" },
  { symbol: "SOXx3",  label: "Semis x3",       img: "/phone/coin-cardano.png",  rotate: "45deg" },
  { symbol: "S&Px3",  label: "S&P 500 x3",     img: "/phone/coin-bitcoin.png",  rotate: "15deg" },
  { symbol: "TSS",    label: "Tesla Short",     img: "/phone/coin-cardano.png",  rotate: "8deg" },
];

const TOP_MOVERS = ASSETS
  .slice()
  .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
  .slice(0, 2);

export function PhoneHome() {
  return (
    <div className="mx-auto max-w-md md:max-w-lg px-6 py-10 pb-32 md:pb-10">
      {/* Hero — UVP */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
          <span className="size-1.5 rounded-full bg-mint animate-pulse" />
          Zero liquidation risk
        </div>
        <h1 className="text-3xl font-bold text-white leading-[1.05] tracking-tight">
          3× & 2× tokenized stocks.
        </h1>
        <h2 className="text-3xl font-bold text-mint leading-[1.05] tracking-tight">
          Long or short. On-chain.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Boring stocks move 1% a day. Perps liquidate you. SHIFT solves both with bi-directional
          leveraged tokens — real volatility, zero liquidation.
        </p>
      </div>

      {/* Balance card */}
      <div className="relative bg-secondary rounded-3xl p-6 mb-8 overflow-hidden min-h-[200px]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-mint text-sm font-medium mb-2">
            <TrendingUp className="h-4 w-4" />
            6.90% Today
          </div>
          <div className="text-5xl font-bold text-white tabular-nums tracking-tight">$25,151.39</div>
          <button className="mt-6 h-14 w-14 rounded-full bg-mint flex items-center justify-center shadow-lg shadow-mint/30 hover:scale-105 transition-transform">
            <Plus className="h-7 w-7 text-primary-foreground" strokeWidth={3} />
          </button>
        </div>
        <Image
          src="/phone/calculator.png"
          alt=""
          width={460}
          height={544}
          className="absolute -right-4 -top-2 w-[180px] h-auto pointer-events-none select-none"
          priority
        />
      </div>

      {/* Actions */}
      <h3 className="text-2xl font-bold text-white mb-4">Actions</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 mb-8 -mx-6 px-6 snap-x snap-mandatory scrollbar-none">
        {ASSET_CARDS.map((a) => (
          <Link
            key={a.symbol}
            href={`/trade/${a.symbol}`}
            className="snap-start flex-shrink-0 w-[160px] h-[200px] rounded-3xl bg-mint relative overflow-hidden p-5 flex flex-col justify-end group"
          >
            <Image
              src={a.img}
              alt={a.label}
              width={400}
              height={400}
              className="absolute -top-4 -right-4 w-[170px] h-[170px] object-contain pointer-events-none select-none drop-shadow-2xl"
              style={{ transform: `rotate(${a.rotate})` }}
            />
            <div className="relative z-10 flex items-center justify-between text-primary-foreground">
              <span className="font-bold text-lg">{a.label}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Top Movers */}
      <h3 className="text-2xl font-bold text-white mb-4">Top Movers</h3>
      <div className="grid grid-cols-2 gap-4">
        {TOP_MOVERS.map((m) => {
          const positive = m.change24h >= 0;
          return (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}`}
              className="bg-secondary rounded-2xl p-4 relative overflow-hidden hover:bg-secondary/80 transition-colors"
            >
              <div className={`font-bold text-xl mb-1 ${positive ? "text-mint" : "text-destructive"}`}>
                {FORMATTERS.pct(m.change24h)}
              </div>
              <div className="text-xs text-muted-foreground">
                {m.symbol} {FORMATTERS.usd(m.price)}
              </div>
              <Image
                src={positive ? "/phone/chart-1.svg" : "/phone/chart-2.svg"}
                alt=""
                width={120}
                height={40}
                className="absolute right-2 bottom-2 opacity-80 pointer-events-none"
              />
            </Link>
          );
        })}
      </div>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border h-20 flex items-center justify-around px-4">
        <BottomItem icon={<Home className="h-5 w-5" />} label="Home" active />
        <BottomItem icon={<Wallet className="h-5 w-5" />} label="Wallets" />
        <div className="-mt-10 h-14 w-14 rounded-full bg-mint flex items-center justify-center shadow-lg shadow-mint/40">
          <ArrowLeftRight className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <BottomItem icon={<BarChart3 className="h-5 w-5" />} label="Market" />
        <BottomItem icon={<Settings className="h-5 w-5" />} label="Settings" />
      </nav>
    </div>
  );
}

function BottomItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 ${active ? "text-mint" : "text-muted-foreground"}`}
    >
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </button>
  );
}
