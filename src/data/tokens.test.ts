import { describe, it, expect } from "vitest";
import { TOKENS, getTokenByTicker } from "@/data/tokens";

const KNOWN_UNDERLYINGS = new Set(["TSLL", "TSLS", "SOXL", "SOXS", "SPXL", "SPXS"]);
const VALID_DIRECTIONS = new Set(["long", "short"]);
const VALID_LEVERAGES = new Set([1, 2, 3]);
const ISIN_REGEX = /^US[0-9A-Z]{10}$/;

describe("TOKENS", () => {
  it("has exactly 6 entries", () => {
    expect(TOKENS).toHaveLength(6);
  });

  it("all entries have non-empty shiftTicker, name, underlying, isin, image", () => {
    for (const token of TOKENS) {
      expect(token.shiftTicker).toBeTruthy();
      expect(token.name).toBeTruthy();
      expect(token.underlying).toBeTruthy();
      expect(token.isin).toBeTruthy();
      expect(token.image).toBeTruthy();
    }
  });

  it("every direction is one of 'long' | 'short'", () => {
    for (const token of TOKENS) {
      expect(VALID_DIRECTIONS.has(token.direction)).toBe(true);
    }
  });

  it("every leverage is in the set {1, 2, 3}", () => {
    for (const token of TOKENS) {
      expect(VALID_LEVERAGES.has(token.leverage)).toBe(true);
    }
  });

  it("every underlying is one of the known Direxion ETF tickers", () => {
    for (const token of TOKENS) {
      expect(KNOWN_UNDERLYINGS.has(token.underlying)).toBe(true);
    }
  });

  it("every isin is exactly 12 chars, starts with US, all uppercase alphanumeric", () => {
    for (const token of TOKENS) {
      expect(token.isin).toHaveLength(12);
      expect(ISIN_REGEX.test(token.isin)).toBe(true);
    }
  });

  it("every image path starts with /trade/ and ends with .png", () => {
    for (const token of TOKENS) {
      expect(token.image.startsWith("/trade/")).toBe(true);
      expect(token.image.endsWith(".png")).toBe(true);
    }
  });

  it("shiftTicker values are unique", () => {
    const tickers = TOKENS.map((t) => t.shiftTicker);
    expect(new Set(tickers).size).toBe(tickers.length);
  });

  it("underlying values are unique", () => {
    const underlyings = TOKENS.map((t) => t.underlying);
    expect(new Set(underlyings).size).toBe(underlyings.length);
  });

  it("isin values are unique", () => {
    const isins = TOKENS.map((t) => t.isin);
    expect(new Set(isins).size).toBe(isins.length);
  });
});

describe("getTokenByTicker", () => {
  it("returns the matching token for a known shiftTicker", () => {
    const result = getTokenByTicker("TSx2");
    expect(result).toBeDefined();
    expect(result?.shiftTicker).toBe("TSx2");
    expect(result?.underlying).toBe("TSLL");
    expect(result?.direction).toBe("long");
  });

  it("returns undefined for 'nonexistent'", () => {
    expect(getTokenByTicker("nonexistent")).toBeUndefined();
  });

  it("is case-sensitive: 'tsx2' returns undefined", () => {
    expect(getTokenByTicker("tsx2")).toBeUndefined();
  });
});
