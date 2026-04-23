import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wallet, Zap, ShieldCheck, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Bring any wallet",
    body: "Phantom, Backpack, Solflare, or any Solana wallet. We never custody your funds.",
  },
  {
    icon: Zap,
    title: "Trade in two clicks",
    body: "Pick a 3× or 2× direction, set the size, sign once. Settled on Solana in seconds with sub-cent gas.",
  },
  {
    icon: ShieldCheck,
    title: "Sleep through wicks",
    body: "No margin call. No funding rate surprise. No 4 AM liquidation. Your token NAV is your worst case.",
  },
];

const HOLDINGS = [
  { sym: "TSL2L",  img: "/trade/tsl2l.png",  val: "$41,324", pct: "+2.41%", up: true },
  { sym: "SOX3L",  img: "/trade/sox3l.png",  val: "$16,848", pct: "-2.15%", up: false },
  { sym: "SPX3L",  img: "/trade/spx3l.png",  val: "$10,560", pct: "+0.84%", up: true },
  { sym: "TSL1S",  img: "/trade/tsl1s.png",  val: "$18,484", pct: "-2.41%", up: false },
];

export function LandingConnect() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">
        {/* Phone mockup */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="size-[500px] rounded-full bg-[radial-gradient(circle,_rgba(38,200,184,0.18)_0%,_transparent_60%)]" />
          </div>

          {/* Phone body */}
          <div className="relative w-[320px] h-[640px] rounded-[48px] bg-gradient-to-b from-[#1a3540] via-[#0a2730] to-[#021c24] p-3 shadow-[0_50px_120px_-30px_rgba(38,200,184,0.5),0_0_0_1px_rgba(38,200,184,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]">
            {/* Inner screen */}
            <div className="relative w-full h-full rounded-[36px] bg-background overflow-hidden">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black z-10" />

              {/* Status bar */}
              <div className="flex items-center justify-between px-7 pt-3 text-xs text-white/80 font-medium">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                  <span className="text-mint">Live</span>
                </span>
              </div>

              {/* App content */}
              <div className="px-6 pt-10">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                  Total Net Worth
                </div>
                <div className="text-[36px] font-bold text-white tabular-nums tracking-tight leading-none mb-2">
                  $87,218.18
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-mint/15 border border-mint/30 text-mint text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-2.5 w-2.5" />
                    +2.41%
                  </span>
                  <span className="text-xs text-muted-foreground">+$4,368.75 today</span>
                </div>

                {/* Mini chart */}
                <div className="relative h-16 mb-6">
                  <svg viewBox="0 0 280 64" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="phone-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#26C8B8" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#26C8B8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 C40,42 60,55 90,38 C120,22 150,28 180,18 C210,10 240,22 280,8 L280,64 L0,64 Z"
                      fill="url(#phone-grad)"
                    />
                    <path
                      d="M0,50 C40,42 60,55 90,38 C120,22 150,28 180,18 C210,10 240,22 280,8"
                      fill="none"
                      stroke="#26C8B8"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Holdings list */}
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Holdings
                </div>
                <div className="space-y-2">
                  {HOLDINGS.map((h) => (
                    <div
                      key={h.sym}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/60 border border-border/60"
                    >
                      <Image
                        src={h.img}
                        alt={h.sym}
                        width={28}
                        height={28}
                        className="size-7 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white">{h.sym}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white tabular-nums">{h.val}</div>
                        <div
                          className={`text-xs tabular-nums ${
                            h.up ? "text-mint" : "text-destructive"
                          }`}
                        >
                          {h.pct}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: copy */}
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-mint mb-4">
            Connect your wallet
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-1 mb-6">
            Trade leveraged stocks
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
            >
              like a crypto native.
            </span>
          </h2>
          <p className="text-base text-foreground/70 leading-relaxed mb-10 max-w-[480px]">
            No brokerage account. No KYC. No margin paperwork. Connect a wallet, fund with USDC, and
            you&apos;re trading 3× and 2× tokenized stocks in under a minute.
          </p>

          <ul className="space-y-5 mb-10">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex gap-4">
                  <div className="size-10 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-mint" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-0.5">{f.title}</div>
                    <p className="text-sm text-foreground/65 leading-relaxed">{f.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="/app"
            className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 transition-colors shadow-[0_0_30px_rgba(38,200,184,0.3)]"
          >
            Connect wallet
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
