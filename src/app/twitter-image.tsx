import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "SHIFT — 3× & 2× bi-directional tokenized stocks, no liquidations";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function TwitterImage() {
  return renderOg({
    eyebrow: "SHIFT Finance",
    title: "3× & 2× tokenized stocks. No liquidations.",
    subtitle:
      "The first bi-directional leveraged RWA protocol. Trade Tesla, Nvidia, SPY — long or short — with zero liquidation risk.",
  });
}
