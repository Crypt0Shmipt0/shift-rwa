"use client";

/**
 * ArchitectureDiagram
 *
 * Layered SVG showing the data flow from custody to DeFi:
 *   Alpaca custody → Chainlink PoR → SHIFT contract → SPL token → DeFi
 *
 * Mint pulses travel along the path on a 3s loop. Click a node to expand
 * a detail card below the diagram.
 *
 * Layout: 5 nodes laid out horizontally on desktop, stacked vertically on
 * mobile with chevrons between. Same data, different geometry.
 */

import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import {
  Building2,
  ShieldCheck,
  Cpu,
  Wallet,
  Workflow,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const MINT = "#26C8B8";

interface Node {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  detail: string;
}

const NODES: Node[] = [
  {
    id: "alpaca",
    title: "Alpaca custody",
    subtitle: "Regulated brokerage",
    icon: Building2,
    detail:
      "The underlying ETF (e.g. Direxion TSLL) is bought and custodied at Alpaca Markets, a FINRA-registered, SEC-regulated broker-dealer. Holdings sit in segregated brokerage accounts, not on the protocol's balance sheet.",
  },
  {
    id: "chainlink",
    title: "Chainlink PoR",
    subtitle: "Proof-of-Reserves oracle",
    icon: ShieldCheck,
    detail:
      "A Chainlink Proof-of-Reserves oracle reads Alpaca's custodied balance and posts it to Solana every ~60 seconds. If the on-chain attested balance falls below the minted SPL supply, minting pauses automatically.",
  },
  {
    id: "shift",
    title: "SHIFT contract",
    subtitle: "Solana program",
    icon: Cpu,
    detail:
      "The SHIFT smart contract on Solana mints the SPL token, runs the daily 4 PM ET rebalance, and handles the burn-to-redeem path. No price-feed dependency for liquidations because there are no liquidations.",
  },
  {
    id: "wallet",
    title: "SPL token",
    subtitle: "In your wallet",
    icon: Wallet,
    detail:
      "TSL2L, SOX3L, SPX3L and the rest land in your wallet as standard SPL tokens — Phantom, Backpack, Solflare, any SPL-compatible wallet. No special integration required.",
  },
  {
    id: "defi",
    title: "DeFi rails",
    subtitle: "Jupiter · Meteora · Kamino · Orca",
    icon: Workflow,
    detail:
      "Because they're plain SPL tokens, every Solana DeFi primitive works out of the box: swap on Jupiter, LP on Meteora or Orca, post as collateral on Kamino, or wrap into a vault. 24/7, permissionless.",
  },
];

export function ArchitectureDiagram() {
  const motionOk = useMotionOk();
  const [activeId, setActiveId] = useState<string>(NODES[0].id);
  const active = NODES.find((n) => n.id === activeId) ?? NODES[0];

  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-7" aria-label="SHIFT protocol architecture">
      <header className="mb-5 md:mb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mint mb-1">
          Architecture
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          From custody to your wallet, in one path.
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Tap any node to expand. Mint pulses show how each block of state propagates.
        </p>
      </header>

      {/* Desktop: horizontal flow with animated pulses */}
      <div className="hidden md:block relative">
        <svg
          viewBox="0 0 1000 100"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[100px] pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="arch-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.15" />
              <stop offset="50%" stopColor={MINT} stopOpacity="0.6" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0.15" />
            </linearGradient>
            <filter id="arch-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <line x1="40" y1="50" x2="960" y2="50" stroke="url(#arch-line)" strokeWidth="2" />
          {/* Three traveling mint pulses, staggered */}
          {motionOk &&
            [0, 1, 2].map((i) => (
              <m.circle
                key={i}
                r="5"
                cy="50"
                fill={MINT}
                filter="url(#arch-glow)"
                initial={{ cx: 40 }}
                animate={{ cx: [40, 960] }}
                transition={{
                  duration: 3,
                  delay: i * 1.0,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
        </svg>

        <div className="relative grid grid-cols-5 gap-2">
          {NODES.map((node) => (
            <NodeButton
              key={node.id}
              node={node}
              active={node.id === activeId}
              onClick={() => setActiveId(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden flex flex-col gap-2">
        {NODES.map((node, i) => (
          <div key={node.id}>
            <NodeButton
              node={node}
              active={node.id === activeId}
              onClick={() => setActiveId(node.id)}
              compact
            />
            {i < NODES.length - 1 && (
              <div className="flex justify-center py-1.5">
                <ChevronDown className="h-4 w-4 text-mint/50" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <m.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="mt-5 md:mt-6 rounded-2xl border border-mint/30 bg-mint/5 px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 size-9 rounded-full bg-mint/15 border border-mint/30 flex items-center justify-center">
              <active.icon className="h-4 w-4 text-mint" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-semibold text-white">{active.title}</span>
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-mint/80">
                  {active.subtitle}
                </span>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed mt-1">{active.detail}</p>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </section>
  );
}

interface NodeButtonProps {
  node: Node;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}

function NodeButton({ node, active, onClick, compact }: NodeButtonProps) {
  const Icon = node.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative w-full text-left rounded-2xl border bg-[#02191F] transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-mint",
        compact ? "p-3" : "p-3 md:p-4",
        active
          ? "border-mint/60 shadow-[0_0_24px_rgba(38,200,184,0.18)]"
          : "border-border hover:border-mint/40",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={[
            "shrink-0 size-9 rounded-full flex items-center justify-center transition-colors",
            active ? "bg-mint text-[#021C24]" : "bg-mint/10 text-mint",
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-white truncate">{node.title}</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/50 truncate">
            {node.subtitle}
          </div>
        </div>
        {compact && <ChevronRight className="h-4 w-4 text-foreground/30 shrink-0" />}
      </div>
    </button>
  );
}
