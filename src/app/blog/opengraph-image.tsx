import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "SHIFT Blog — Signals, Academy, and RWA deep-dives";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function OG() {
  return renderOg({
    eyebrow: "SHIFT Blog",
    title: "Read the SHIFT thesis.",
    subtitle:
      "The SHIFT Signal, Shift Academy, and long-form coverage of tokenized equities and on-chain capital markets.",
  });
}
