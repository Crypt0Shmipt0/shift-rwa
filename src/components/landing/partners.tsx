const PARTNERS = [
  "Chainlink",
  "Solana",
  "Jupiter",
  "Meteora",
  "Kamino",
  "SNZ",
  "Orca",
  "BNB",
  "CT Accelerator",
];

export function LandingPartners() {
  return (
    <section className="border-y border-border/60 bg-background/40">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Backed and powered by
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {PARTNERS.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="text-base md:text-lg font-semibold text-foreground/55 hover:text-foreground transition-colors tracking-tight"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
