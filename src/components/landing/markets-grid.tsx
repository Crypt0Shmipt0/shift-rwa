import Image from "next/image";
import Link from "next/link";
import { ASSETS, FORMATTERS } from "@/lib/mock";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

export function LandingMarketsGrid() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24">
      <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-mint mb-3">
            Live markets
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Trade the names
            <br />
            <span className="text-mint">that actually move.</span>
          </h2>
        </div>
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 text-sm text-mint hover:text-mint/80 font-semibold"
        >
          See all markets <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ASSETS.map((a) => {
          const positive = a.change24h >= 0;
          return (
            <Link
              key={a.symbol}
              href={`/trade/${a.symbol}`}
              className="group relative rounded-3xl border border-border bg-card p-6 hover:border-mint/40 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-6">
                <Image
                  src={a.image}
                  alt={a.symbol}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-mint bg-mint/10 border border-mint/30 px-2 py-1 rounded-full">
                  {a.leverage > 0 ? `${a.leverage}× long` : `${Math.abs(a.leverage)}× short`}
                </span>
              </div>
              <div className="font-bold text-lg text-white mb-1">{a.symbol}</div>
              <div className="text-xs text-muted-foreground mb-4 truncate">{a.name}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {FORMATTERS.usd(a.price)}
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    positive ? "text-mint" : "text-destructive"
                  }`}
                >
                  {positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {FORMATTERS.pct(a.change24h)}
                </span>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-mint" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
