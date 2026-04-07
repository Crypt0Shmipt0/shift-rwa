import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "SHIFT Learn";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function LearnOG() {
  return renderOg({
    eyebrow: "Learn",
    title: "Know what you're trading.",
    subtitle:
      "Guides, tutorials, and FAQs on leveraged tokens, daily rebalancing, and on-chain execution. Designed for traders who understand the math.",
  });
}
