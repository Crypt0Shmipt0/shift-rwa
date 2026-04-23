export type TokenDirection = "long" | "short";

export type Token = {
  shiftTicker: string;    // user-facing canonical ticker, e.g. "TSL2L"
  name: string;           // display name, e.g. "TSLA long 2"
  underlying: string;     // Alpaca/Direxion underlying ticker, e.g. "TSLL"
  isin: string;           // 12-char ISIN
  direction: TokenDirection;
  leverage: 1 | 2 | 3;
  image: string;          // public-root-relative path
};

export const TOKENS: readonly Token[] = [
  {
    shiftTicker: "TSL2L",
    name: "TSLA long 2",
    underlying: "TSLL",
    isin: "US25460G2865",
    direction: "long",
    leverage: 2,
    image: "/trade/tsl2l.png",
  },
  {
    shiftTicker: "TSL1S",
    name: "TSLA short",
    underlying: "TSLS",
    isin: "US25460G2600",
    direction: "short",
    leverage: 1,
    image: "/trade/tsl1s.png",
  },
  {
    shiftTicker: "SOX3L",
    name: "Semiconductor long 3",
    underlying: "SOXL",
    isin: "US25459W4583",
    direction: "long",
    leverage: 3,
    image: "/trade/sox3l.png",
  },
  {
    shiftTicker: "SOX3S",
    name: "Semiconductor short 3",
    underlying: "SOXS",
    isin: "US25461H5726",
    direction: "short",
    leverage: 3,
    image: "/trade/sox3s.png",
  },
  {
    shiftTicker: "SPX3L",
    name: "S&P 500 long 3",
    underlying: "SPXL",
    isin: "US25459W8626",
    direction: "long",
    leverage: 3,
    image: "/trade/spx3l.png",
  },
  {
    shiftTicker: "SPX3S",
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
