"use client";

import { useRef, useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface RowData {
  label: string;
  spot: string | boolean;
  perps: string | boolean;
  shift: string | boolean;
  tooltip?: string;
}

const ROWS: RowData[] = [
  { label: "Leverage", spot: "1×", perps: "Up to 100×", shift: "2× & 3×" },
  {
    label: "Short side",
    spot: false,
    perps: true,
    shift: true,
    tooltip: "SHIFT issues inverse tokens (e.g. TSL1S) so you can go short without a margin account or borrowing fees.",
  },
  {
    label: "Liquidation risk",
    spot: false,
    perps: true,
    shift: false,
    tooltip: "No liquidation engine — a perp position can be wiped out on a 5% wick; your SHIFT token just reprices its NAV.",
  },
  {
    label: "Funding fees",
    spot: false,
    perps: true,
    shift: false,
    tooltip: "Perps charge continuous funding rates that erode your edge overnight. SHIFT tokens have no funding mechanism.",
  },
  {
    label: "Forced close",
    spot: false,
    perps: true,
    shift: false,
    tooltip: "Forced close: a 5% overnight gap hits before US open. Perps blow you out; SHIFT's token just reprices.",
  },
  { label: "Wallet-native token", spot: true, perps: false, shift: true },
  { label: "24/7 permissionless", spot: false, perps: true, shift: true },
  { label: "DeFi composable", spot: false, perps: false, shift: true },
];

type CellValue = string | boolean;

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className={`inline-flex items-center justify-center size-6 rounded-full ${highlight ? "bg-mint/20 text-mint" : "bg-mint/10 text-mint"}`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-destructive/10 text-destructive/70">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className={`text-sm font-semibold ${highlight ? "text-mint" : "text-foreground/70"}`}>
      {value}
    </span>
  );
}

export function LandingComparisonTable() {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = tbodyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative mx-auto max-w-[1000px] px-6 py-16">
      <Reveal>
        <div className="text-center mb-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint">
            Why not perps?
          </span>
        </div>
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-2 mb-10">
          Three ways to get leverage.
          <br />
          <span className="text-gradient-mint">
            Only one keeps you in the trade.
          </span>
        </h2>
      </Reveal>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <TooltipProvider>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left px-3 sm:px-5 py-4 text-foreground/50 font-semibold text-xs uppercase tracking-wider w-[40%]">
                  Feature
                </th>
                <th className="px-3 sm:px-5 py-4 text-center text-foreground/50 font-semibold text-xs uppercase tracking-wider">
                  Spot stocks
                </th>
                <th className="px-3 sm:px-5 py-4 text-center text-foreground/50 font-semibold text-xs uppercase tracking-wider">
                  Perps
                </th>
                <th className="px-3 sm:px-5 py-4 text-center font-semibold text-xs uppercase tracking-wider bg-mint/5 text-mint border-l border-mint/20">
                  SHIFT
                </th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className={inView ? "vt-rows-in" : ""}>
              {ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-border/60 last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card/40"} ${inView ? "vt-row-animate" : "opacity-0"}`}
                  style={{ "--row-index": i } as React.CSSProperties}
                >
                  <th
                    scope="row"
                    className="px-3 sm:px-5 py-3.5 text-foreground/80 font-medium text-left font-normal"
                  >
                    {row.tooltip ? (
                      <Tooltip>
                        <TooltipTrigger
                          aria-label={`${row.label} — ${row.tooltip}`}
                          className="underline decoration-dotted decoration-foreground/30 cursor-help text-left inline-flex bg-transparent border-0 p-0 font-inherit text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded-sm"
                        >
                          {row.label}
                        </TooltipTrigger>
                        <TooltipContent>
                          {row.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      row.label
                    )}
                  </th>
                  <td className="px-3 sm:px-5 py-3.5 text-center">
                    <div className="flex justify-center"><Cell value={row.spot} /></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3.5 text-center">
                    <div className="flex justify-center"><Cell value={row.perps} /></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3.5 text-center bg-mint/[0.03] border-l border-mint/20">
                    <div className="flex justify-center"><Cell value={row.shift} highlight /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TooltipProvider>
      </div>
    </section>
  );
}
