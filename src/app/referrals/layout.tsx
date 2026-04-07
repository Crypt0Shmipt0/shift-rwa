import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals",
  description:
    "Share SHIFT with a friend. When they trade, you both earn a rebate — 25% of their protocol fees for 90 days.",
  alternates: { canonical: "/referrals" },
};

export default function ReferralsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
