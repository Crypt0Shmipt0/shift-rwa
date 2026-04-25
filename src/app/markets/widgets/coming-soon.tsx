"use client";

/**
 * ComingSoonStrip — locked placeholder cards teasing upcoming markets.
 * Faint mint border + lock icon + Q-tag. Generates anticipation; static (no
 * interactivity) so it's just a visual hook.
 */

import { Lock } from "lucide-react";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

interface Pending {
  ticker: string;
  underlying: string;
  description: string;
  eta: string;
}

const PENDING: Pending[] = [
  { ticker: "NVD3L", underlying: "NVDA", description: "Nvidia long 3", eta: "Q3 2026" },
  { ticker: "NVD3S", underlying: "NVDA", description: "Nvidia short 3", eta: "Q3 2026" },
  { ticker: "GLD2L", underlying: "GOLD", description: "Gold long 2", eta: "Q3 2026" },
  { ticker: "BTC2L", underlying: "BTC", description: "Bitcoin long 2", eta: "Q4 2026" },
  { ticker: "QQQ3L", underlying: "QQQ", description: "Nasdaq 100 long 3", eta: "Q4 2026" },
];

export function ComingSoon() {
  const motionOk = useMotionOk();
  return (
    <section aria-label="Upcoming markets">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-mint mb-1.5">
            Roadmap
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Coming soon
          </h2>
        </div>
        <p className="text-xs text-foreground/55 hidden sm:block">
          Vote with a ticker request in the Learn hub.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {PENDING.map((p, i) => (
          <m.div
            key={p.ticker}
            initial={motionOk ? { opacity: 0, y: 12 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
            className="relative rounded-2xl border border-mint/15 bg-card/30 p-4 overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 size-20 rounded-full bg-mint/8 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.16em] text-mint/70">
                <Lock className="h-3 w-3" />
                Locked
              </span>
              <span className="text-[9px] font-mono text-foreground/45 uppercase tracking-[0.14em]">
                {p.eta}
              </span>
            </div>
            <div className="font-mono font-bold text-base text-white tracking-wider mb-0.5">
              {p.ticker}
            </div>
            <div className="text-[11px] text-foreground/55">
              {p.description}
            </div>
            <div className="text-[10px] font-mono text-foreground/40 mt-2 uppercase tracking-wider">
              {p.underlying}
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
}
