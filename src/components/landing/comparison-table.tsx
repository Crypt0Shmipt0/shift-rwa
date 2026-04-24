"use client";

import { Check, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const ROWS = [
  { label: "Leverage", spot: "1×", perps: "Up to 100×", shift: "2× & 3×" },
  { label: "Short side", spot: false, perps: true, shift: true },
  { label: "Liquidation risk", spot: false, perps: true, shift: false },
  { label: "Funding fees", spot: false, perps: true, shift: false },
  { label: "Forced close", spot: false, perps: true, shift: false },
  { label: "Wallet-native token", spot: true, perps: false, shift: true },
  { label: "24/7 permissionless", spot: false, perps: true, shift: true },
  { label: "DeFi composable", spot: false, perps: false, shift: true },
];

type CellValue = string | boolean;

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className={`inline-flex items-center justify-center size-6 rounded-full ${highlight ? "bg-mint/20 text-mint" : "bg-mint/10 text-mint"}`}>
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
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
          >
            Only one keeps you in the trade.
          </span>
        </h2>
      </Reveal>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="text-left px-5 py-4 text-foreground/50 font-semibold text-xs uppercase tracking-wider w-[40%]">
                Feature
              </th>
              <th className="px-5 py-4 text-center text-foreground/50 font-semibold text-xs uppercase tracking-wider">
                Spot stocks
              </th>
              <th className="px-5 py-4 text-center text-foreground/50 font-semibold text-xs uppercase tracking-wider">
                Perps
              </th>
              <th className="px-5 py-4 text-center font-semibold text-xs uppercase tracking-wider bg-mint/5 text-mint border-l border-mint/20">
                SHIFT
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={`border-b border-border/60 last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card/40"}`}
              >
                <td className="px-5 py-3.5 text-foreground/80 font-medium">{row.label}</td>
                <td className="px-5 py-3.5 text-center">
                  <div className="flex justify-center"><Cell value={row.spot} /></div>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <div className="flex justify-center"><Cell value={row.perps} /></div>
                </td>
                <td className="px-5 py-3.5 text-center bg-mint/[0.03] border-l border-mint/20">
                  <div className="flex justify-center"><Cell value={row.shift} highlight /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
