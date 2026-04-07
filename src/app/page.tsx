import { LandingHero } from "@/components/landing/hero";
import { LandingPartners } from "@/components/landing/partners";
import { LandingWhy } from "@/components/landing/why-shift";
import { LandingMarketsGrid } from "@/components/landing/markets-grid";
import { LandingFarm } from "@/components/landing/farm-section";
import { LandingConnect } from "@/components/landing/connect-section";
import { LandingFaq } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingPartners />
      <LandingWhy />
      <LandingMarketsGrid />
      <LandingFarm />
      <LandingConnect />
      <LandingFaq />
    </>
  );
}
