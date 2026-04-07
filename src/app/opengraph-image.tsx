import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "SHIFT Finance — trade tokenized stocks, 24/7";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function OG() {
  return renderOg({
    eyebrow: "SHIFT Finance",
    title: "Trade tokenized stocks, 24/7.",
    subtitle:
      "Permissionless access to Stocks & ETFs value across top DEXs and dApps. Leveraged, on-chain, non-custodial.",
  });
}
