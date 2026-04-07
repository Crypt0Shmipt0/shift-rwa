import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wallet, Zap, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Bring any wallet",
    body: "MetaMask, Rainbow, Zerion, embedded — anything WalletConnect-compatible. We never custody your funds.",
  },
  {
    icon: Zap,
    title: "Trade in two clicks",
    body: "Pick a 3× or 2× direction, set the size, sign once. Settled on Base in seconds with sub-cent gas.",
  },
  {
    icon: ShieldCheck,
    title: "Sleep through wicks",
    body: "No margin call. No funding rate surprise. No 4 AM liquidation. Your token NAV is your worst case.",
  },
];

export function LandingConnect() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        {/* Phone visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(38,200,184,0.18)_0%,_transparent_60%)] -z-10" />
          <div className="relative mx-auto w-full max-w-[420px] aspect-[420/520] rounded-[40px] border border-mint/25 bg-gradient-to-b from-card to-background overflow-hidden p-7 shadow-[0_30px_120px_-30px_rgba(38,200,184,0.4)]">
            {/* Top: status row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-5">
              <span>9:41</span>
              <span className="flex items-center gap-1 text-mint">
                <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                live
              </span>
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Total Net Worth
            </div>
            <div className="text-5xl font-bold text-white tabular-nums tracking-tight mb-1">
              $87,218.18
            </div>
            <div className="flex items-center gap-2 text-mint text-sm font-semibold mb-6">
              <span className="bg-mint/15 border border-mint/30 px-2 py-0.5 rounded-full text-xs">
                +2.41%
              </span>
              <span className="text-muted-foreground text-xs">+$4,368 today</span>
            </div>

            {/* Mini holdings */}
            <div className="space-y-3">
              {[
                { sym: "TSL2s", img: "/trade/tsl2s.png", val: "$41,324", pct: "+2.41%", up: true },
                { sym: "NVD3s", img: "/trade/nvd3s.png", val: "$16,848", pct: "-2.15%", up: false },
                { sym: "SPY3s", img: "/trade/spy3s.png", val: "$10,560", pct: "+0.84%", up: true },
                { sym: "TSLSs", img: "/trade/tslss.png", val: "$18,484", pct: "-2.41%", up: false },
              ].map((h) => (
                <div
                  key={h.sym}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border"
                >
                  <Image src={h.img} alt={h.sym} width={32} height={32} className="size-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{h.sym}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white tabular-nums">{h.val}</div>
                    <div
                      className={`text-[11px] tabular-nums ${
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

        {/* Right: copy */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-mint mb-4">
            Connect your wallet
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
            Trade leveraged stocks
            <br />
            <span className="text-mint">like a crypto native.</span>
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
            className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 transition-colors"
          >
            Connect wallet
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
