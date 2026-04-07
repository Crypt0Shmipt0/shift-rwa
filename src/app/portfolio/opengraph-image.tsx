import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { NET_WORTH, FORMATTERS } from "@/lib/mock";

export const alt = "SHIFT Portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function PortfolioOG() {
  return renderOg({
    eyebrow: "Portfolio",
    title: "Your net worth, on-chain.",
    subtitle:
      "Net worth, allocation, and realized PnL across every SHIFT position in one view. Updated in real time.",
    bigNumber: FORMATTERS.usd(NET_WORTH.total),
    chips: [
      { label: "24h PnL", value: FORMATTERS.pct(NET_WORTH.change24hPct), positive: NET_WORTH.change24hPct >= 0 },
      { label: "Change", value: `+${FORMATTERS.usd(NET_WORTH.change24hAbs)}`, positive: true },
      { label: "Positions", value: "4" },
    ],
  });
}
