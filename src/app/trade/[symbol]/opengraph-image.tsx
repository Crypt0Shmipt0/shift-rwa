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
    eyebrow: `${asset.underlying} · ${asset.leverage > 0 ? `${asset.leverage}× long` : `${Math.abs(asset.leverage)}× short`} · no liquidation`,
    title: asset.symbol,
    subtitle: `${asset.name}. Professionally tokenized ${asset.underlying} with ${asset.leverage > 0 ? "bi-directional leveraged upside" : "inverse exposure"} and zero liquidation risk.`,
    bigNumber: FORMATTERS.usd(asset.price),
    chips: [
      { label: "24h change", value: FORMATTERS.pct(asset.change24h), positive },
      { label: "Leverage", value: `${asset.leverage > 0 ? "+" : ""}${asset.leverage}×` },
      { label: "Liquidation", value: "None", positive: true },
    ],
  });
}
