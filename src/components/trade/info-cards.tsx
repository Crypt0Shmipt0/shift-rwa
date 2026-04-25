import { ArrowRight } from "lucide-react";
import { getTokenByTicker } from "@/data/tokens";

function getEducationCopy(shiftTicker: string) {
  const token = getTokenByTicker(shiftTicker);
  if (!token) {
    return {
      title: `What is ${shiftTicker}?`,
      subtitle: "A SHIFT tokenized leveraged position, on-chain.",
      body: `${shiftTicker} is a SHIFT token: wallet-native, proof-of-reserve via Chainlink, and composable in DeFi. Redeemable 24/7 against the underlying ETF custody held by Alpaca Markets. These tokens target daily returns — holding longer than one day introduces compounding drift. Read the full risk disclosure before trading.`,
    };
  }

  const dirLabel = token.direction === "short" ? "inverse" : `${token.leverage}×`;
  const underlyingDesc =
    token.underlying === "TSLL"
      ? "Direxion's TSLL — 2× daily TSLA exposure"
      : token.underlying === "TSLS"
        ? "Direxion's TSLS — 1× inverse TSLA exposure"
        : token.underlying === "SOXL"
          ? "Direxion's SOXL — 3× daily semiconductor exposure"
          : token.underlying === "SOXS"
            ? "Direxion's SOXS — 3× inverse semiconductor exposure"
            : token.underlying === "SPXL"
              ? "Direxion's SPXL — 3× daily S&P 500 exposure"
              : token.underlying === "SPXS"
                ? "Direxion's SPXS — 3× inverse S&P 500 exposure"
                : token.underlying === "URAA"
                  ? "a 2× daily uranium/nuclear energy ETF"
                  : `${token.underlying} by Direxion`;

  return {
    title: `What is ${shiftTicker}?`,
    subtitle: `Backed by ${underlyingDesc}, on-chain.`,
    body: `${shiftTicker} is a SHIFT token — a ${dirLabel} position on ${token.underlying}, tokenized on Solana. Hold it in any wallet, use it as collateral in DeFi, or redeem it 24/7 against the underlying ETF. Custody is held by Alpaca Markets; reserves are verified continuously via Chainlink Proof of Reserves. Like all leveraged products, ${shiftTicker} targets daily returns — compounding over multiple days can diverge significantly from the simple multiple. Not investment advice.`,
  };
}

export function EducationCard({ symbol = "TSL2L" }: { symbol?: string }) {
  const copy = getEducationCopy(symbol);
  return (
    <div className="bg-card rounded-3xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-foreground">{copy.title}</h3>
      </div>
      <div className="h-px bg-border mb-4" />
      <p className="text-xs text-muted-foreground mb-3">{copy.subtitle}</p>
      <p className="text-sm text-foreground/80 leading-relaxed">{copy.body}</p>
    </div>
  );
}

export function MarketNewsCard() {
  return (
    <div className="bg-card rounded-3xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-foreground">Risk Disclosure</h3>
        <a href="/disclaimer" className="flex items-center gap-2 text-mint text-xs hover:opacity-80 transition-opacity">
          Full Disclosure <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      <div className="h-px bg-border mb-4" />
      <p className="text-sm text-foreground/80 leading-relaxed">
        The important part: these products target daily returns, not long-term returns. Because of
        daily reset and compounding, holding them for more than one day can produce results that
        differ a lot from simply &ldquo;2x Tesla&rdquo; or &ldquo;-2x Tesla.&rdquo; Direxion explicitly warns that longer
        holding periods and higher volatility can materially affect performance.
      </p>
    </div>
  );
}
