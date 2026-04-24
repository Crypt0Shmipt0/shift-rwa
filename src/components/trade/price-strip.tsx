"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface PriceStripProps {
  image: string;
  symbol: string;
  price: number;
  change24h: number;
  underlying: string;
  formattedPrice: string;
  formattedChange: string;
  positive: boolean;
}

/**
 * Client-side price strip with flash animation on price change.
 * Flash-up (mint) on price increase, flash-down (red) on decrease.
 * The CSS keyframes are defined in globals.css, gated behind prefers-reduced-motion.
 */
export function PriceStrip({
  image,
  symbol,
  price,
  change24h,
  underlying,
  formattedPrice,
  formattedChange,
  positive,
}: PriceStripProps) {
  const prevPrice = useRef(price);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (prevPrice.current === price) return;
    const direction = price > prevPrice.current ? "flash-up" : "flash-down";
    prevPrice.current = price;
    setFlashClass(direction);
    const t = setTimeout(() => setFlashClass(""), 300);
    return () => clearTimeout(t);
  }, [price]);

  return (
    <div
      className={`w-full bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-4 flex-wrap ${flashClass}`}
    >
      <Image
        src={image}
        alt={symbol}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover shrink-0"
        style={{ viewTransitionName: `asset-${symbol.toLowerCase()}` }}
      />
      <span
        className="font-semibold text-foreground tracking-tight"
        style={{ viewTransitionName: `asset-ticker-${symbol.toLowerCase()}` }}
      >
        {symbol}
      </span>
      <span className="font-mono tabular-nums text-foreground text-lg leading-none">
        {formattedPrice}
      </span>
      <span
        className={`font-mono tabular-nums text-sm font-medium ${
          positive ? "text-mint" : "text-destructive"
        }`}
      >
        {positive ? "▲" : "▼"} {formattedChange} 24h
      </span>
      <span className="text-xs text-muted-foreground">
        Underlying: <span className="text-foreground/75">{underlying}</span>
      </span>
      <span className="text-xs text-muted-foreground ml-auto">Chainlink oracle</span>
    </div>
  );
}
