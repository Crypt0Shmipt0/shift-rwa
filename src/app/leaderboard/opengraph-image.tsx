import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "SHIFT Leaderboard";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function LeaderboardOG() {
  return renderOg({
    eyebrow: "Leaderboard",
    title: "Top traders this season.",
    subtitle:
      "Ranked by realized PnL, trade count, and win rate. Updated every 5 minutes. Connect a wallet to enter.",
    chips: [
      { label: "Top PnL", value: "+$12,450", positive: true },
      { label: "Avg win rate", value: "67.3%" },
      { label: "Traders", value: "1,284" },
    ],
  });
}
