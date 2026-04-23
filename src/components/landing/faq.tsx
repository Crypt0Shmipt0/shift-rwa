import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = [
  {
    q: "What is SHIFT actually solving?",
    a: "Two problems Web3 traders hit every day. Spot tokenized stocks move 1% — too boring for active traders. Leveraged perps blow you up on routine 5% wicks. SHIFT is the bi-directional 3× / 2× leveraged tokenized stocks, ETFs, and ETNs protocol that solves both — real volatility, zero liquidation risk.",
  },
  {
    q: "How can leverage exist with zero liquidation risk?",
    a: "Because SHIFT positions are SPL tokens on Solana, not collateralized margin positions. There is literally no liquidation engine in the protocol. No price feed or oracle dependence, protecting you from liquidation — you can never lose more than you put in, and you can never be force-closed at the bottom of a wick.",
  },
  {
    q: "What does bi-directional mean?",
    a: "Every market has both a long and an inverse side. TSx2 gives you 2× Tesla upside; TSS is the corresponding short. You don't need a margin account to switch direction — you just trade between two SPL tokens in your wallet.",
  },
  {
    q: "Which assets are tradable today?",
    a: "Tesla (TSx2, TSS), Semiconductors (SOXx3, SOXx3S), and S&amp;P 500 (S&amp;Px3, S&amp;Px3S). We publish a new listing roughly every two weeks — the next batch includes ORCL, COIN, and MSTR. Browse the Markets page for the live list.",
  },
  {
    q: "How is the daily 2× or 3× target maintained?",
    a: "Through an on-chain rebalancing mechanism that adjusts the protocol's underlying exposure once per trading day. Over multiple days, compounding can cause divergence from a simple 2× / 3× calc — this is called decay, and it's documented in the Risk Disclaimer.",
  },
  {
    q: "Is SHIFT custodial? Do I need to KYC?",
    a: "No and no. SHIFT is fully non-custodial — your wallet, your keys, your tokens. We don't run KYC because we never take custody. Restricted geographies are blocked at the interface level (see the Disclaimer).",
  },
  {
    q: "What fees do you charge?",
    a: "0.10% protocol fee per trade. Network gas is paid in SOL (fractions of a cent on Solana). Other chains Coming Soon! Rewards-badge holders get up to 50% fee rebates.",
  },
];

export function LandingFaq() {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-24">
      <div className="text-center mb-12">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-mint mb-3">
          FAQ
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Frequently asked.
        </h2>
      </div>
      <div className="rounded-3xl border border-border bg-card px-8 py-2">
        <Accordion className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-mint hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
