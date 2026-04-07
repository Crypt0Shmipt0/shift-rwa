import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { ASSETS } from "@/lib/mock";

export const alt = "SHIFT Markets";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function MarketsOG() {
  const gainers = ASSETS.filter((a) => a.change24h > 0).length;
  return renderOg({
    eyebrow: "Markets",
    title: "Every market. One chain.",
    subtitle:
      "Leveraged tokens for Tesla, Nvidia, SPY, and more. Daily-targeted exposure, on-chain settlement, 24/7 trading.",
    chips: [
      { label: "Assets", value: String(ASSETS.length) },
      { label: "Gainers 24h", value: String(gainers), positive: gainers > 0 },
      { label: "Chains", value: "3" },
    ],
  });
}
