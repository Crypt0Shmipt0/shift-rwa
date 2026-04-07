import type { Metadata } from "next";
import { PortfolioGate } from "@/components/portfolio/portfolio-gate";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Your SHIFT portfolio — net worth, asset allocation, holdings, and realized PnL. Updated in real time across all positions.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioGate />;
}
