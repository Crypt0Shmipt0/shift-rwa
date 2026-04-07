"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight, ArrowLeftRight, Home, Wallet, BarChart3, Settings, TrendingUp } from "lucide-react";

const ASSET_CARDS = [
  { name: "Tesla x2", symbol: "TSL2s", img: "/phone/coin-ethereum.png", rotate: "-27.9deg" },
  { name: "Nvidia x3", symbol: "NVD3s", img: "/phone/coin-cardano.png", rotate: "45deg" },
  { name: "SPY x3",   symbol: "SPY3s", img: "/phone/coin-bitcoin.png",  rotate: "15deg" },
];

const TOP_MOVERS = [
  { symbol: "TSL2s", name: "Tesla x2 SHIFT", change: "+32.54%", price: "$432.64", chart: "/phone/chart-1.svg" },
  { symbol: "NVD3s", name: "Nvidia x3 SHIFT", change: "+84.29%", price: "$135.83", chart: "/phone/chart-2.svg" },
];

export function PhoneHome() {
  return (
    <div className="mx-auto max-w-md md:max-w-lg px-6 py-10 pb-32 md:pb-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Hello Tomer,</h1>
        <h2 className="text-4xl font-bold text-mint">Welcome Back!</h2>
      </div>

      {/* Balance card */}
      <div className="relative bg-secondary rounded-3xl p-6 mb-8 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-mint text-sm font-medium mb-2">
            <TrendingUp className="h-4 w-4" />
            6.90% Today
          </div>
          <div className="text-5xl font-bold text-white tabular-nums tracking-tight">
            $25,151.39
          </div>
          <button className="mt-6 h-14 w-14 rounded-full bg-mint flex items-center justify-center shadow-lg shadow-mint/30 hover:scale-105 transition-transform">
            <Plus className="h-7 w-7 text-primary-foreground" strokeWidth={3} />
          </button>
        </div>
        <Image
          src="/phone/calculator.png"
          alt=""
          width={220}
          height={260}
          className="absolute -right-6 -top-2 w-[160px] h-auto pointer-events-none select-none"
          style={{ filter: "brightness(1.1) hue-rotate(150deg) saturate(4)" }}
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
              alt={a.name}
              width={400}
              height={400}
              className="absolute -top-6 -right-4 w-[170px] h-[170px] object-contain pointer-events-none select-none mix-blend-screen"
              style={{ transform: `rotate(${a.rotate})`, filter: "brightness(1.3) contrast(1.1)" }}
            />
            <div className="relative z-10 flex items-center justify-between text-white">
              <span className="font-bold text-lg">{a.name}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Top Movers */}
      <h3 className="text-2xl font-bold text-white mb-4">Top Movers</h3>
      <div className="grid grid-cols-2 gap-4">
        {TOP_MOVERS.map((m) => (
          <Link
            key={m.symbol}
            href={`/trade/${m.symbol}`}
            className="bg-secondary rounded-2xl p-4 relative overflow-hidden hover:bg-secondary/80 transition-colors"
          >
            <div className="text-mint font-bold text-xl mb-1">{m.change}</div>
            <div className="text-xs text-muted-foreground">{m.symbol} {m.price}</div>
            <Image src={m.chart} alt="" width={120} height={40} className="absolute right-2 bottom-2 opacity-80 pointer-events-none" />
          </Link>
        ))}
      </div>

      {/* Mobile bottom bar (hidden on md+) */}
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

function BottomItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${active ? "text-mint" : "text-muted-foreground"}`}>
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </button>
  );
}
