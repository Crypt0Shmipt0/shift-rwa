const BACKED_BY = [
  "SNZ Holding",
  "Chainlink",
  "PRIM3 VC",
  "GMX founder",
  "dAppRadar founder",
  "Hello Labs founder",
  "CVEX founder",
  "ChainGPT",
];

const LIVE_INTEGRATIONS = [
  "Solana",
  "Jupiter",
  "Meteora",
  "Phantom",
  "OKX Wallet",
  "Kamino",
  "Orca",
  "Birdeye",
  "BNB Chain",
  "Thena",
  "Chainlink",
  "Alpaca",
];

export function LandingPartners() {
  return (
    <section className="border-y border-border/60 bg-background/40">
      <div className="mx-auto max-w-[1200px] px-6 py-10 space-y-8">
        {/* Backed by */}
        <div>
          <div className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Backed by
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BACKED_BY.map((p, i) => (
              <span
                key={`backed-${p}-${i}`}
                className="text-base md:text-lg font-semibold text-foreground/55 hover:text-foreground transition-colors tracking-tight"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-border/40" />

        {/* Live integrations */}
        <div>
          <div className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Live integrations
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LIVE_INTEGRATIONS.map((p, i) => (
              <span
                key={`integration-${p}-${i}`}
                className="text-base md:text-lg font-semibold text-foreground/55 hover:text-foreground transition-colors tracking-tight"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-center text-[11px] text-foreground/40 mt-4">
            Custody via Alpaca Markets — 24/5 mint-and-burn rails backing every token.
          </p>
        </div>
      </div>
    </section>
  );
}
