"use client";

import { useEffect, useRef } from "react";
import { ASSETS } from "@/lib/mock";

declare global {
  interface Window {
    TradingView: { widget: new (config: Record<string, unknown>) => unknown };
  }
}

const CONTAINER_ID = "tradingview-widget";

export function TradingViewChart({ symbol = "TSL2s" }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
  const tvSymbol = `NASDAQ:${asset.underlying}`;

  useEffect(() => {
    const init = () => {
      if (!containerRef.current || !window.TradingView) return;
      // Clear children safely (no innerHTML)
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      new window.TradingView.widget({
        symbol: tvSymbol,
        interval: "D",
        timezone: "America/New_York",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#141414",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: CONTAINER_ID,
        autosize: true,
        backgroundColor: "#141414",
        gridColor: "#1f1f1f",
        hide_volume: false,
        allow_symbol_change: false,
        details: false,
        hotlist: false,
        calendar: false,
        studies: [],
        overrides: {
          "paneProperties.background": "#141414",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "#1f1f1f",
          "paneProperties.horzGridProperties.color": "#1f1f1f",
          "paneProperties.separatorColor": "#141414",
          "scalesProperties.backgroundColor": "#141414",
          "scalesProperties.textColor": "#555",
          "scalesProperties.lineColor": "#141414",
          "scalesProperties.borderColor": "#141414",
          "mainSeriesProperties.candleStyle.upColor": "#0cc",
          "mainSeriesProperties.candleStyle.downColor": "#ff4d6a",
          "mainSeriesProperties.candleStyle.borderUpColor": "#0cc",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ff4d6a",
          "mainSeriesProperties.candleStyle.wickUpColor": "#0cc",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ff4d6a",
          volumePaneSize: "small",
        },
        loading_screen: { backgroundColor: "#141414", foregroundColor: "#0cc" },
      });
    };

    if (window.TradingView) {
      init();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://s3.tradingview.com/tv.js"]');
    if (existing) {
      existing.addEventListener("load", init);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [tvSymbol]);

  return (
    <div className="bg-card rounded-[32px] w-full h-[583px] overflow-hidden relative">
      <div
        id={CONTAINER_ID}
        ref={containerRef}
        className="w-full h-full [&_iframe]:rounded-[32px] [&_iframe]:border-none"
      />
      <div className="absolute top-0 right-[54px] w-[2px] h-full bg-card pointer-events-none z-10" />
    </div>
  );
}
