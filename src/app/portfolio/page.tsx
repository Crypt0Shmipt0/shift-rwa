import type { Metadata } from "next";
import { NetWorthHero } from "@/components/portfolio/net-worth-hero";
import { AllocationDonut } from "@/components/portfolio/allocation-donut";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { FeatureCallouts } from "@/components/portfolio/feature-callouts";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Your SHIFT portfolio — net worth, asset allocation, holdings, and realized PnL. Updated in real time across all positions.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10 space-y-8">
      <section className="grid grid-cols-12 gap-6">
        <NetWorthHero />
        <AllocationDonut />
      </section>
      <HoldingsTable />
      <FeatureCallouts />
    </div>
  );
}
