import type { Metadata } from "next";
import { TradingViewChart } from "@/components/trade/trading-view-chart";
import { SwapCard } from "@/components/trade/swap-card";
import { EducationCard, MarketNewsCard } from "@/components/trade/info-cards";
import { IntelligenceCard } from "@/components/trade/intelligence-card";
import { getAsset, FORMATTERS, ASSETS } from "@/lib/mock";

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const asset = getAsset(symbol);
  const title = `${asset.symbol} · ${asset.name}`;
  const dir = asset.leverage > 0 ? `${asset.leverage}× long` : `${Math.abs(asset.leverage)}× short`;
  const description = `${asset.symbol} — ${dir} ${asset.underlying}, tokenized. Zero liquidation risk, on-chain settlement. ${FORMATTERS.usd(asset.price)} (${FORMATTERS.pct(asset.change24h)} 24h).`;
  return {
    title,
    description,
    alternates: { canonical: `/trade/${asset.symbol}` },
    openGraph: {
      title: `${title} · SHIFT`,
      description,
      url: `/trade/${asset.symbol}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · SHIFT`,
      description,
    },
  };
}

export function generateStaticParams() {
  return ASSETS.map((a) => ({ symbol: a.symbol }));
}

export default async function TradePage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-[72px] py-10 flex flex-col gap-10">
      {/* Main row: chart + swap */}
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-[60px] justify-center">
        <div className="flex flex-col items-start lg:shrink-0 w-full lg:w-[700px]">
          <TradingViewChart symbol={symbol} />
        </div>
        <div className="w-full lg:w-[480px] lg:shrink-0">
          <SwapCard symbol={symbol} />
        </div>
      </section>

      {/* Bottom row: education + intelligence */}
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-[60px] justify-center">
        <div className="flex flex-col gap-6 w-full lg:max-w-[700px]">
          <EducationCard />
          <MarketNewsCard />
        </div>
        <div className="w-full lg:w-[480px] lg:shrink-0">
          <IntelligenceCard symbol={symbol} />
        </div>
      </section>
    </div>
  );
}
