import { ArrowRight } from "lucide-react";

export function EducationCard() {
  return (
    <div className="bg-card rounded-3xl p-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-foreground">What is Direxion TSLL (TSx2)?</h3>
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

