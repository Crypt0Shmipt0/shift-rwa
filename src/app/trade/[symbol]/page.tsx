import { PriceChart } from "@/components/trade/price-chart";
import { SwapCard } from "@/components/trade/swap-card";
import { BalanceStrip } from "@/components/trade/balance-strip";
import { EducationCard, MarketNewsCard, IntelligenceCard } from "@/components/trade/info-cards";

export default async function TradePage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      <section className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 h-[560px]">
          <PriceChart symbol={symbol} />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <SwapCard symbol={symbol} />
          <BalanceStrip symbol={symbol} />
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <EducationCard />
          <MarketNewsCard />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <IntelligenceCard />
        </div>
      </section>
    </div>
  );
}
