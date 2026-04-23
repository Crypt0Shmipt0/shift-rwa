import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Compete in weekly trading competitions on SHIFT. Ranked by realized PnL, win rate, and trade volume. Top traders earn $SHFT rewards.",
  alternates: { canonical: "/leaderboard" },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
