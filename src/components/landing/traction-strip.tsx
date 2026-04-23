export function LandingTractionStrip() {
  return (
    <section className="border-b border-border/60 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
          <TractionStat value="$2M" label="Seed Closed" />
          <Divider />
          <TractionStat value="$40M+" label="Liquidity Raised" />
          <Divider />
          <TractionStat value="24/7" label="Permissionless" />
          <Divider />
          <TractionStat value="Chainlink" label="Proof-of-Reserves" />
        </div>
      </div>
    </section>
  );
}

function TractionStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-bold text-white text-base">{value}</span>
      <span className="text-foreground/60 text-xs uppercase tracking-wider">{label}</span>
    </span>
  );
}

function Divider() {
  return <span className="size-1 rounded-full bg-border hidden sm:block" />;
}
