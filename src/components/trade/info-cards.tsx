import Image from "next/image";
import { INTELLIGENCE } from "@/lib/mock";
import { ArrowRight } from "lucide-react";

export function EducationCard() {
  return (
    <div className="bg-card rounded-3xl p-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-foreground">What is Direxion TSLL (TSL2s)?</h3>
        <a href="#" className="flex items-center gap-2 text-mint text-xs hover:opacity-80 transition-opacity">
          Read More <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      <div className="h-px bg-border mb-6" />
      <p className="text-sm text-foreground/80 leading-relaxed">
        Direxion TSLL is the Direxion Daily TSLA Bull 2X ETF. It is a leveraged single-stock ETF
        that aims to deliver 200% of Tesla&apos;s daily move, before fees and expenses. So if Tesla
        rises 1% in a day, TSLL is designed to rise about 2%; if Tesla falls 1%, TSLL is designed
        to fall about 2%.
      </p>
    </div>
  );
}

export function MarketNewsCard() {
  return (
    <div className="bg-card rounded-3xl p-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-foreground">Risk Disclosure</h3>
        <a href="#" className="flex items-center gap-2 text-mint text-xs hover:opacity-80 transition-opacity">
          Full Disclosure <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      <div className="h-px bg-border mb-6" />
      <p className="text-sm text-foreground/80 leading-relaxed">
        The important part: these products target daily returns, not long-term returns. Because of
        daily reset and compounding, holding them for more than one day can produce results that
        differ a lot from simply &ldquo;2x Tesla&rdquo; or &ldquo;-2x Tesla.&rdquo; Direxion explicitly warns that longer
        holding periods and higher volatility can materially affect performance.
      </p>
    </div>
  );
}

export function IntelligenceCard() {
  return (
    <div className="bg-card rounded-3xl p-8 h-full">
      <h3 className="text-lg text-foreground mb-8">Intelligence</h3>
      <ul className="space-y-6">
        {INTELLIGENCE.map((item, i) => (
          <li key={item.title}>
            <a href="#" className="flex gap-3 group">
              <Image
                src={item.image}
                alt=""
                width={68}
                height={68}
                className="size-[68px] rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-base leading-snug text-white group-hover:text-mint transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>{item.source}</span>
                  <span className="uppercase">{item.time}</span>
                </div>
              </div>
            </a>
            {i < INTELLIGENCE.length - 1 && <div className="h-px bg-border mt-6" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
