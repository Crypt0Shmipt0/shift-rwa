import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards — Earn $SHFT · SHIFT Finance",
  description:
    "Trade SHIFT leveraged tokens and earn on-chain XP, fee rebates, and $SHFT allocation. Early traders get a 2× multiplier at TGE.",
  alternates: { canonical: "/rewards" },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
