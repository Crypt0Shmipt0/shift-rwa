import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Earn from every shift. Join the waitlist for SHIFT's 4-tier rewards program — fee rebates, XP, and priority execution.",
  alternates: { canonical: "/rewards" },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
