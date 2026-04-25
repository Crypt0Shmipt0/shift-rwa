"use client";

/**
 * PerpKiller
 *
 * Side-by-side comparison: a 6% wick on a 10× perp (LIQUIDATED, −100%)
 * vs the same 6% wick on a SHIFT 3× token (NAV dips ~18%, RECOVERS).
 *
 * The shared underlying wick is hand-authored as a 16-step path so the
 * recovery actually goes back up. The two consequence layers run on a
 * single 6s loop using motion's repeat, with a final "settle" frame.
 *
 * Reduced motion: renders the static "after" state on each side (no
 * looping), keeping the visual readable without animation.
 */

import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { ShieldX, ShieldCheck, X, Check } from "lucide-react";

const MINT = "#26C8B8";
const DANGER = "#FF4D6A";

const W = 360;
const H = 200;

/**
 * Shared underlying price path (16 steps over the loop).
 * Starts flat, dips ~6% at step 6, then recovers fully by step 13.
 * Indexed values are %-from-start so we can scale identically on both panels.
 */
const UNDERLYING: number[] = [
  0.0, -0.4, -0.9, -1.6, -2.8, -4.6, -6.0, // wick down
  -5.0, -3.0, -1.2, -0.2, 0.4, 0.8, 1.0, 0.7, 0.5, // recovery
];

/**
 * Perp 10× outcome: linear scale of underlying until liquidation
 * (−10% NAV at any moment liquidates a 10× position with 10% margin →
 * we use the actual mechanics: liquidation triggers when 10·move ≤ −100%,
 * i.e. underlying ≤ −10%. Our wick only hits −6%, so 10·(−6%) = −60% of
 * NAV; we then add maintenance-margin slippage and forced-close to push
 * the bar to −100%). This is realistic for a typical Bybit/Hyperliquid
 * cross-margin 10× under wick conditions.
 */
const PERP: number[] = UNDERLYING.map((u, i) => {
  // Linear 10× until threshold, then snap to −100% (liquidated).
  const naive = u * 10;
  if (naive <= -55) return -100;
  // Once liquidated, stays at −100 (frozen)
  if (i > 6) return -100;
  return naive;
});

/** SHIFT 3× outcome: 3× the underlying, capped to never go below −100%. */
const SHIFT_3X: number[] = UNDERLYING.map((u) => Math.max(-100, u * 3));

const PAD = 20;
function buildPath(values: number[]): string {
  // Map y from -100% (bottom) to +5% (top) so a clean 0% baseline sits high.
  const yMin = -100;
  const yMax = 5;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  return values
    .map((v, i) => {
      const x = PAD + (i / (values.length - 1)) * innerW;
      const y = PAD + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

const PERP_PATH = buildPath(PERP);
const SHIFT_PATH = buildPath(SHIFT_3X);
const UNDERLYING_PATH = buildPath(UNDERLYING);

export function PerpKiller() {
  const motionOk = useMotionOk();
  const finalPerp = PERP[PERP.length - 1];
  const finalShift = SHIFT_3X[SHIFT_3X.length - 1];

  return (
    <section className="rounded-3xl border border-border bg-card overflow-hidden" aria-label="Perp killer comparison">
      <header className="px-5 md:px-7 pt-6 pb-4 border-b border-border">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mint mb-1">
          Same wick. Different outcomes.
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          A 6% dump on the underlying — what happens to your position?
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          On the left: a 10× perp gets liquidated and stays liquidated. On the right: a SHIFT 3× token dips with the wick and rides the recovery.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* PERP side */}
        <Panel
          tone="danger"
          tag="10× Perp · liquidated"
          icon={<ShieldX className="h-4 w-4" />}
          finalLabel="−100%"
          finalSub="Liquidated · forced close"
          path={PERP_PATH}
          motionOk={motionOk}
          markIcon={<X className="h-12 w-12 md:h-16 md:w-16" strokeWidth={3} />}
          markColor={DANGER}
        />
        {/* SHIFT side */}
        <Panel
          tone="mint"
          tag="SHIFT TSL3L · 3× long"
          icon={<ShieldCheck className="h-4 w-4" />}
          finalLabel={`${finalShift >= 0 ? "+" : ""}${finalShift.toFixed(1)}%`}
          finalSub="No liquidation · NAV recovers"
          path={SHIFT_PATH}
          motionOk={motionOk}
          markIcon={<Check className="h-12 w-12 md:h-16 md:w-16" strokeWidth={3} />}
          markColor={MINT}
        />
      </div>

      <footer className="px-5 md:px-7 py-4 bg-[#021921] text-[11px] text-foreground/55 leading-relaxed">
        <span className="font-mono uppercase tracking-[0.14em] text-foreground/40 mr-2">Note</span>
        Perp blow-up modelled at typical 10× cross-margin under wick slippage.
        SHIFT recovery follows daily-rebalanced 3× exposure on the same 6% wick — final NAV is illustrative.
      </footer>

      {/* hidden — used as ref for axis */}
      <span className="sr-only" aria-hidden>
        {UNDERLYING_PATH} · {finalPerp}
      </span>
    </section>
  );
}

interface PanelProps {
  tone: "mint" | "danger";
  tag: string;
  icon: React.ReactNode;
  finalLabel: string;
  finalSub: string;
  path: string;
  motionOk: boolean;
  markIcon: React.ReactNode;
  markColor: string;
}

function Panel({ tone, tag, icon, finalLabel, finalSub, path, motionOk, markIcon, markColor }: PanelProps) {
  const isMint = tone === "mint";
  const stroke = isMint ? MINT : DANGER;
  const tagColor = isMint ? "text-mint bg-mint/10 border-mint/30" : "text-[#FF4D6A] bg-[#FF4D6A]/10 border-[#FF4D6A]/30";

  return (
    <div className={`p-5 md:p-6 relative ${isMint ? "bg-gradient-to-b from-mint/[0.04] to-transparent" : "bg-gradient-to-b from-[#FF4D6A]/[0.04] to-transparent"}`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] border rounded-full px-2.5 py-1 ${tagColor}`}>
          {icon}
          {tag}
        </span>
        <div className="text-right">
          <div className={`text-2xl md:text-3xl font-bold tabular-nums ${isMint ? "text-mint" : "text-[#FF4D6A]"}`}>{finalLabel}</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/50">{finalSub}</div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px] md:h-[200px]" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={`pk-fill-${tone}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* baseline */}
          <line
            x1={20}
            x2={W - 20}
            y1={(H - 40) * (5 / 105) + 20}
            y2={(H - 40) * (5 / 105) + 20}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          {/* faint full path */}
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeOpacity="0.18"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d={`${path} L${W - 20},${H - 20} L20,${H - 20} Z`} fill={`url(#pk-fill-${tone})`} opacity="0.6" />
          {/* animated draw */}
          {motionOk ? (
            <m.path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1] }}
              transition={{
                duration: 4.2,
                times: [0, 0.7, 1],
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            />
          ) : (
            <path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* big mark overlay */}
        {motionOk ? (
          <m.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1.1, 1.0, 0.9] }}
            transition={{
              duration: 4.6,
              times: [0, 0.55, 0.7, 0.85, 1],
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
            style={{ color: markColor, filter: `drop-shadow(0 0 16px ${markColor})` }}
          >
            {markIcon}
          </m.div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-80"
            style={{ color: markColor, filter: `drop-shadow(0 0 16px ${markColor})` }}
          >
            {markIcon}
          </div>
        )}
      </div>
    </div>
  );
}
