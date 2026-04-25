import Link from "next/link";
import { ASSETS } from "@/lib/mock";
import { ArrowUpRight } from "lucide-react";

import type { Metadata } from "next";

import { MarketsHero } from "./widgets/markets-hero";
import { Scoreboard } from "./widgets/scoreboard";
import { MarketsPulseStrip } from "./widgets/pulse-strip";
import { MarketsDashboard } from "./widgets/markets-dashboard";
import { ComingSoon } from "./widgets/coming-soon";
import AmbientMistLazy from "./widgets/ambient-mist-lazy";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Every 3× and 2× bi-directional tokenized stock on SHIFT. Long or short TSLA, SOX, S&P 500 — no liquidation risk, on-chain settlement, 24/7 trading.",
  alternates: { canonical: "/markets" },
};

// TODO: real market data
const MOCK_VOLUME: Record<string, number> = {
  TSL2L: 8_420_000,
  TSL1S: 1_940_000,
  SOX3L: 6_210_000,
  SOX3S: 2_150_000,
  SPX3L: 3_870_000,
  SPX3S: 1_480_000,
  URA2L: 2_420_000,
};

export default function MarketsPage() {
  const totalVolume = ASSETS.reduce(
    (sum, a) => sum + (MOCK_VOLUME[a.symbol] ?? 0),
    0,
  );

  return (
    <div className="relative">
      {/* Ambient backdrop — drifts behind everything but stays out of focus. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(38,200,184,0.08) 0%, rgba(7,99,140,0.04) 30%, rgba(2,28,36,0) 65%)",
          }}
        />
        <AmbientMistLazy density={0.5} maxAlpha={0.35} />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-[72px] py-10 md:py-14 space-y-10 md:space-y-12">
        <MarketsHero />

        <Scoreboard assets={ASSETS} totalVolume={totalVolume} />

        <MarketsPulseStrip assets={ASSETS} />

        <MarketsDashboard assets={ASSETS} volumes={MOCK_VOLUME} />

        <ComingSoon />

        <div className="flex flex-col items-center text-center pt-6 border-t border-border/40">
          <p className="text-xs text-foreground/55 mb-3">
            Want a market we don&apos;t have? Submit a ticker request.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mint text-background text-sm font-semibold hover:bg-mint/90 transition-colors hover:shadow-[0_0_24px_rgba(38,200,184,0.45)]"
          >
            Visit the Learn hub
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
