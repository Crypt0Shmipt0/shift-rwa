import { ShieldX, TrendingUp, Repeat, Layers } from "lucide-react";

const PROBLEMS = [
  {
    icon: TrendingUp,
    label: "1× spot stocks",
    title: "Boring",
    body: "Tesla moves 1.4% on a typical day. SPY moves 0.8%. For traders coming from crypto volatility, that's not a market — that's a savings account.",
  },
  {
    icon: ShieldX,
    label: "Perps & margin",
    title: "Liquidating",
    body: "Open a 3× perp on TSLA, and a routine 5% wick wipes you out. Funding rates eat your edge. The brokerage equivalent margin-calls you at the worst moment.",
  },
];

const SOLUTIONS = [
  {
    icon: Repeat,
    title: "Bi-directional from day one",
    body: "Every market ships a long AND an inverse side. TSL2s for 2× upside, TSLSs to short — same chain, same wallet, no margin account.",
  },
  {
    icon: Layers,
    title: "Tokenized, not collateralized",
    body: "SHIFT positions are ERC-20 tokens, not leveraged margin positions. There is literally no liquidation engine — the worst case is the token NAV approaching zero.",
  },
  {
    icon: TrendingUp,
    title: "Real volatility, professionally managed",
    body: "3× and 2× daily-targeted exposure across stocks, ETFs, and ETNs. Active rebalancing, tight oracle pricing, on-chain settlement on Base/Arbitrum/Optimism.",
  },
];

export function LandingWhy() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      {/* Section header */}
      <div className="max-w-2xl mb-16">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-mint mb-4">
          The Web3 stock problem
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-6">
          Two broken extremes.
          <br />
          <span className="text-mint">One revolutionary fix.</span>
        </h2>
        <p className="text-base text-foreground/70 leading-relaxed">
          Web3 stock adoption has been stuck for years between two unusable options. SHIFT closes
          the gap.
        </p>
      </div>

      {/* The problems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {PROBLEMS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="relative rounded-3xl border border-destructive/25 bg-destructive/5 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-destructive" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive/80">
                  {p.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">{p.title}</div>
              <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
            </div>
          );
        })}
      </div>

      {/* The solution intro */}
      <div className="text-center my-14">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mint font-semibold">
          <span className="h-px w-12 bg-mint/30" />
          The SHIFT pivot
          <span className="h-px w-12 bg-mint/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SOLUTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="relative rounded-3xl border border-mint/25 bg-gradient-to-b from-mint/5 to-transparent p-8 hover:border-mint/50 transition-colors"
            >
              <div className="size-11 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center mb-5">
                <Icon className="h-5 w-5 text-mint" />
              </div>
              <div className="text-lg font-bold text-white mb-2">{s.title}</div>
              <p className="text-sm text-foreground/70 leading-relaxed">{s.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
