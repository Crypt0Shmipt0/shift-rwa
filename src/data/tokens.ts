export type TokenDirection = "long" | "short";

export type Token = {
  shiftTicker: string;    // user-facing canonical ticker, e.g. "TSx2"
  name: string;           // display name, e.g. "TSLA long 2"
  underlying: string;     // Alpaca/Direxion underlying ticker, e.g. "TSLL"
  isin: string;           // 12-char ISIN
  direction: TokenDirection;
  leverage: 1 | 2 | 3;
  image: string;          // public-root-relative path
};

export const TOKENS: readonly Token[] = [
  {
    shiftTicker: "TSx2",
    name: "TSLA long 2",
    underlying: "TSLL",
    isin: "US25460G2865",
    direction: "long",
    leverage: 2,
    image: "/trade/tsx2.png",
  },
  {
    shiftTicker: "TSS",
    name: "TSLA short",
    underlying: "TSLS",
    isin: "US25460G2600",
    direction: "short",
    leverage: 1,
    image: "/trade/tss.png",
  },
  {
    shiftTicker: "SOXx3",
    name: "Semiconductor long 3",
    underlying: "SOXL",
    isin: "US25459W4583",
    direction: "long",
    leverage: 3,
    image: "/trade/soxx3.png",
  },
  {
    shiftTicker: "SOXx3S",
    name: "Semiconductor short 3",
    underlying: "SOXS",
    isin: "US25461H5726",
    direction: "short",
    leverage: 3,
    image: "/trade/soxx3s.png",
  },
  {
    shiftTicker: "S&Px3",
    name: "S&P 500 long 3",
    underlying: "SPXL",
    isin: "US25459W8626",
    direction: "long",
    leverage: 3,
    image: "/trade/spx3.png",
  },
  {
    shiftTicker: "S&Px3S",
    name: "S&P 500 short 3",
    underlying: "SPXS",
    isin: "US09064L2025", // TODO: verify — public Direxion value provided by controller
    direction: "short",
    leverage: 3,
    image: "/trade/spx3s.png",
  },
] as const;

export function getTokenByTicker(ticker: string): Token | undefined {
  return TOKENS.find((t) => t.shiftTicker === ticker);
}
