import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, CheckCircle2, Layers, ArrowRightCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Airdrop",
  description:
    "The SHIFT airdrop campaign rewards early traders and community builders with $SHFT allocation. Full details coming soon.",
  alternates: { canonical: "/airdrop" },
};

export default function AirdropPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-12 md:py-16">
      {/* Hero */}
      <div className="mb-10 md:mb-12 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
          <Sparkles className="h-3 w-3" />
          Coming Soon!
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4">
          The SHIFT Airdrop.
        </h1>
        <p className="text-base text-foreground/70 leading-relaxed mb-6">
          Early traders, farm participants, and community builders will share the $SHFT airdrop at
          TGE. Eligibility, point multipliers, and claim instructions publish 30 days before TGE —
          start earning farm points now.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:bg-mint/90 transition-colors shadow-[0_0_24px_rgba(38,200,184,0.3)]"
          >
            Join the rewards program
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 border border-border text-foreground/80 font-semibold text-sm px-6 py-3 rounded-full hover:text-white hover:border-mint/40 transition-colors"
          >
            Browse markets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <Card className="bg-card border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="size-11 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-5 w-5 text-mint" />
          </div>
          <div className="text-base font-semibold text-white mb-1">Eligibility</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trading volume, farm points, and referrals all count toward $SHFT allocation. Full table
            publishes 30 days before TGE.
          </p>
        </Card>
        <Card className="bg-card border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="size-11 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center mb-3">
            <Layers className="h-5 w-5 text-mint" />
          </div>
          <div className="text-base font-semibold text-white mb-1">Point multipliers</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Active traders qualify for 2×–5× multipliers. The earlier your activity, the higher
            your tier.
          </p>
        </Card>
        <Card className="bg-card border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="size-11 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center mb-3">
            <ArrowRightCircle className="h-5 w-5 text-mint" />
          </div>
          <div className="text-base font-semibold text-white mb-1">Claim flow</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At TGE: connect your Solana wallet, verify eligibility, and claim $SHFT directly — no
            broker, no intermediary.
          </p>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-10">
        Airdrop parameters are not final. Terms, eligibility windows, and allocations may change
        before launch. {/* CONTENT: awaiting Arpit/Deepak for final campaign details */}
      </p>
    </div>
  );
}
