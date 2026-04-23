import { LandingHero } from "@/components/landing/hero";
import { LandingTractionStrip } from "@/components/landing/traction-strip";
import { LandingPartners } from "@/components/landing/partners";
import { LandingWhy } from "@/components/landing/why-shift";
import { LandingComparisonTable } from "@/components/landing/comparison-table";
import { LandingTeam } from "@/components/landing/team-section";
import { LandingMarketsGrid } from "@/components/landing/markets-grid";
import { LandingFarm } from "@/components/landing/farm-section";
import { LandingBlogFeatured } from "@/components/landing/blog-featured";
import { LandingConnect } from "@/components/landing/connect-section";
import { LandingFaq } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingTractionStrip />
      <LandingPartners />
      <LandingWhy />
      <LandingComparisonTable />
      <LandingTeam />
      <LandingMarketsGrid />
      <LandingFarm />
      <LandingBlogFeatured />
      <LandingConnect />
      <LandingFaq />
    </>
  );
}
