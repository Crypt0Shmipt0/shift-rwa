import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getAsset, FORMATTERS } from "@/lib/mock";

export const alt = "SHIFT — Trade";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function TradeOG({ params }: { params: { symbol: string } }) {
  const asset = getAsset(params.symbol);
  const positive = asset.change24h >= 0;
  return renderOg({
    eyebrow: `${asset.underlying} · ${asset.leverage > 0 ? `${asset.leverage}× long` : `${Math.abs(asset.leverage)}× short`}`,
    title: `${asset.symbol}`,
    subtitle: `${asset.name} — trade leveraged ${asset.underlying} on-chain. Daily-targeted ${asset.leverage > 0 ? "bull" : "bear"} exposure.`,
    bigNumber: FORMATTERS.usd(asset.price),
    chips: [
      { label: "24h change", value: FORMATTERS.pct(asset.change24h), positive },
      { label: "Leverage", value: `${asset.leverage > 0 ? "+" : ""}${asset.leverage}×` },
      { label: "Network", value: "Base" },
    ],
  });
}
