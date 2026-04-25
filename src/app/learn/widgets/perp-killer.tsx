"use client";

/**
 * PerpKiller — same-leverage stress test
 *
 * 30-day comparison of a 3× perp vs SHIFT TSL3L (also 3×) on the *same*
 * underlying path. Same leverage, same volatility — different infrastructure.
 *
 * The perp tracks the underlying linearly until cumulative loss × leverage
 * reaches −100% NAV, then it's liquidated and frozen at −100% (forced close,
 * margin gone). SHIFT compounds 3× exposure with daily rebalancing — it
 * suffers the drawdown but survives, then rides the recovery into positive
 * territory. NO liquidation engine, NO forced close.
 *
 * Reduced motion: renders the static final state without the looping draw.
 */

import { useMemo } from "react";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { ShieldX, ShieldCheck } from "lucide-react";

const MINT = "#26C8B8";
const DANGER = "#FF4D6A";
const OFF_WHITE = "#EDEEEE";

const W = 800;
const H = 320;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 24;
const PAD_B = 36;

const LEVERAGE = 3;
const LIQ_NAV = -100;

/* ── Underlying path: 31 daily points (day 0 → day 30) ────────────────────
 * Realistic stress scenario: gentle uptrend, sharp drawdown to −34% (deep
 * enough to liquidate a 3× perp at the bottom), choppy recovery, strong
 * finish at +26%. Ends NET POSITIVE so SHIFT — which compounds daily —
 * can recover and outperform. */
const UNDERLYING_PCT: number[] = [
  0.0, 0.6, 1.5, 2.5, 3.4, 4.0, 4.6, 5.0,           // d0–7: uptrend → +5%
  3.5, 1.5, -3.0, -8.0, -15.0, -22.0, -29.0, -34.0, // d8–15: drawdown to −34%
  -28.0, -22.0, -15.0, -9.0, -3.0,                  // d16–20: bouncing back
  1.0, 4.5, 8.0, 12.0, 15.0,                        // d21–25: rally
  18.0, 21.0, 23.5, 25.0, 26.0,                     // d26–30: finish +26%
];

interface Series {
  perp: number[];   // % from start
  shift: number[];  // % from start
  perpLiqDay: number | null;
}

function compute(): Series {
  const perp: number[] = [0];
  const shift: number[] = [0];
  let perpLiqDay: number | null = null;
  let shiftNav = 1; // multiplier

  for (let d = 1; d < UNDERLYING_PCT.length; d++) {
    // PERP: linear leverage on underlying, freeze at -100 once liquidated
    if (perpLiqDay !== null) {
      perp.push(LIQ_NAV);
    } else {
      const nav = UNDERLYING_PCT[d] * LEVERAGE;
      if (nav <= LIQ_NAV) {
        perp.push(LIQ_NAV);
        perpLiqDay = d;
      } else {
        perp.push(nav);
      }
    }

    // SHIFT: daily-rebalanced 3× compounding
    const r =
      (1 + UNDERLYING_PCT[d] / 100) / (1 + UNDERLYING_PCT[d - 1] / 100) - 1;
    shiftNav *= Math.max(0, 1 + LEVERAGE * r);
    shift.push((shiftNav - 1) * 100);
  }
  return { perp, shift, perpLiqDay };
}

function buildPath(values: number[], yMin: number, yMax: number): string {
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const range = yMax - yMin || 1;
  return values
    .map((v, i) => {
      const x = PAD_L + (i / (values.length - 1)) * innerW;
      const y = PAD_T + innerH - ((v - yMin) / range) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function PerpKiller() {
  const motionOk = useMotionOk();
  const series = useMemo(() => compute(), []);
  const finalPerp = series.perp[series.perp.length - 1];
  const finalShift = series.shift[series.shift.length - 1];
  const finalUnderlying = UNDERLYING_PCT[UNDERLYING_PCT.length - 1];

  // Y-range to show all 3 series + a little headroom
  const all = [...UNDERLYING_PCT, ...series.perp, ...series.shift];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.06;
  const yMin = lo - pad;
  const yMax = hi + pad;

  const underlyingPath = buildPath(UNDERLYING_PCT, yMin, yMax);
  const perpPath = buildPath(series.perp, yMin, yMax);
  const shiftPath = buildPath(series.shift, yMin, yMax);

  // Liquidation marker x-position
  const innerW = W - PAD_L - PAD_R;
  const liqX =
    series.perpLiqDay !== null
      ? PAD_L + (series.perpLiqDay / (UNDERLYING_PCT.length - 1)) * innerW
      : null;

  // Grid
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const innerH = H - PAD_T - PAD_B;
    const y = PAD_T + innerH * t;
    const v = yMax - (yMax - yMin) * t;
    const pct = Math.round(v);
    return { y, label: `${pct >= 0 ? "+" : ""}${pct}%` };
  });

  // Zero line position
  const innerH = H - PAD_T - PAD_B;
  const zeroY = PAD_T + innerH - ((0 - yMin) / (yMax - yMin)) * innerH;

  return (
    <section
      className="relative rounded-3xl border border-border bg-card overflow-hidden"
      aria-label="Perp killer comparison"
    >
      <header className="px-5 md:px-7 pt-6 pb-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mint mb-1">
          Same 3× leverage. Same path. Different outcomes.
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          The perp dies at the bottom. SHIFT survives and rides the recovery.
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[640px]">
          Both positions take 3× exposure to the same underlying over 30 days. A 3× perp gets liquidated when cumulative drawdown forces NAV to −100%. SHIFT TSL3L has no liquidation engine — it draws down with the wick, then compounds daily on the way back up.
        </p>
      </header>

      {/* Stat row */}
      <div className="flex flex-wrap gap-2 px-5 md:px-7 pb-4">
        <Stat
          label="Underlying · 30d"
          value={finalUnderlying}
          accent="off"
          icon={null}
        />
        <Stat
          label="3× Perp · 30d"
          value={finalPerp}
          accent="danger"
          tag={series.perpLiqDay !== null ? `Liquidated day ${series.perpLiqDay}` : undefined}
          icon={<ShieldX className="h-3 w-3" />}
        />
        <Stat
          label="SHIFT TSL3L · 30d"
          value={finalShift}
          accent="mint"
          tag="Survived & recovered"
          icon={<ShieldCheck className="h-3 w-3" />}
        />
      </div>

      {/* Chart */}
      <div className="relative px-5 md:px-7 pb-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[280px] md:h-[340px]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`30-day comparison: 3× perp ends at ${finalPerp.toFixed(0)}% (liquidated), SHIFT TSL3L ends at ${finalShift.toFixed(0)}% (survived).`}
        >
          <defs>
            <linearGradient id="pk-shift-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.32" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
            <filter id="pk-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Grid */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={g.y}
                y2={g.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray={i === gridLines.length - 1 ? "0" : "2 4"}
              />
              <text
                x={PAD_L - 8}
                y={g.y + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="ui-monospace,SFMono-Regular,monospace"
                fill="rgba(237,238,238,0.45)"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* Zero baseline */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={zeroY}
            y2={zeroY}
            stroke="rgba(237,238,238,0.22)"
            strokeWidth="1"
          />

          {/* Liquidation vertical marker */}
          {liqX !== null && (
            <g>
              <line
                x1={liqX}
                x2={liqX}
                y1={PAD_T}
                y2={H - PAD_B}
                stroke={DANGER}
                strokeOpacity="0.4"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <text
                x={liqX + 6}
                y={PAD_T + 12}
                fontSize="10"
                fontFamily="ui-monospace,SFMono-Regular,monospace"
                fill={DANGER}
                fontWeight={700}
                letterSpacing="1"
              >
                LIQ DAY {series.perpLiqDay}
              </text>
            </g>
          )}

          {/* SHIFT area fill */}
          <m.path
            d={`${shiftPath} L${W - PAD_R},${H - PAD_B} L${PAD_L},${H - PAD_B} Z`}
            fill="url(#pk-shift-fill)"
            initial={false}
            animate={{ opacity: 1 }}
          />

          {/* Underlying line */}
          {motionOk ? (
            <m.path
              d={underlyingPath}
              fill="none"
              stroke={OFF_WHITE}
              strokeOpacity="0.5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
            />
          ) : (
            <path
              d={underlyingPath}
              fill="none"
              stroke={OFF_WHITE}
              strokeOpacity="0.5"
              strokeWidth="2"
            />
          )}

          {/* Perp line — red, dashes once liquidated */}
          {motionOk ? (
            <m.path
              d={perpPath}
              fill="none"
              stroke={DANGER}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
            />
          ) : (
            <path
              d={perpPath}
              fill="none"
              stroke={DANGER}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow)"
            />
          )}

          {/* SHIFT line — mint, glowing */}
          {motionOk ? (
            <m.path
              d={shiftPath}
              fill="none"
              stroke={MINT}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
            />
          ) : (
            <path
              d={shiftPath}
              fill="none"
              stroke={MINT}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow)"
            />
          )}

          {/* End-of-series dots */}
          {(() => {
            const xEnd = PAD_L + innerW;
            const yU = PAD_T + innerH - ((finalUnderlying - yMin) / (yMax - yMin)) * innerH;
            const yP = PAD_T + innerH - ((finalPerp - yMin) / (yMax - yMin)) * innerH;
            const yS = PAD_T + innerH - ((finalShift - yMin) / (yMax - yMin)) * innerH;
            return (
              <>
                <circle cx={xEnd} cy={yU} r="3.5" fill={OFF_WHITE} fillOpacity="0.7" />
                <circle cx={xEnd} cy={yP} r="4" fill={DANGER} />
                <circle cx={xEnd} cy={yS} r="5" fill={MINT} />
                <circle cx={xEnd} cy={yS} r="9" fill={MINT} fillOpacity="0.25" />
              </>
            );
          })()}

          {/* Day axis labels */}
          <text x={PAD_L} y={H - 10} fontSize="10" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="rgba(237,238,238,0.4)">
            DAY 0
          </text>
          <text x={W - PAD_R} y={H - 10} textAnchor="end" fontSize="10" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="rgba(237,238,238,0.4)">
            DAY 30
          </text>
        </svg>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-[0.12em]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: MINT, boxShadow: `0 0 10px ${MINT}` }} />
            <span className="text-mint">SHIFT TSL3L · 3×</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: DANGER }} />
            <span className="text-[#FF4D6A]">3× Perp</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: OFF_WHITE, opacity: 0.55 }} />
            <span className="text-foreground/55">Underlying · spot</span>
          </span>
        </div>
      </div>

      <footer className="px-5 md:px-7 py-4 bg-[#021921] text-[11px] text-foreground/55 leading-relaxed">
        <span className="font-mono uppercase tracking-[0.14em] text-foreground/40 mr-2">Note</span>
        Both positions use the same 3× leverage on the same daily path.
        Perp 3× liquidates when the cumulative drawdown × leverage hits −100%
        NAV. SHIFT TSL3L compounds 3× daily — illustrative scenario, not
        indicative of future returns.
      </footer>
    </section>
  );
}

interface StatProps {
  label: string;
  value: number;
  accent: "mint" | "danger" | "off";
  tag?: string;
  icon?: React.ReactNode;
}

function Stat({ label, value, accent, tag, icon }: StatProps) {
  const sign = value >= 0 ? "+" : "";
  const color =
    accent === "mint"
      ? "text-mint"
      : accent === "danger"
        ? "text-[#FF4D6A]"
        : "text-foreground/70";
  const bg =
    accent === "mint"
      ? "bg-mint/10 border-mint/30"
      : accent === "danger"
        ? "bg-[#FF4D6A]/10 border-[#FF4D6A]/30"
        : "bg-white/5 border-white/15";
  const tagColor =
    accent === "mint" ? "text-mint" : accent === "danger" ? "text-[#FF4D6A]" : "text-foreground/55";
  return (
    <div className={`flex-1 min-w-[150px] rounded-xl border ${bg} px-3 py-2`}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-xl md:text-2xl font-bold tabular-nums ${color}`}>
        {sign}
        {value.toFixed(0)}%
      </div>
      {tag && (
        <div className={`text-[10px] font-mono uppercase tracking-[0.14em] mt-0.5 ${tagColor}`}>
          {tag}
        </div>
      )}
    </div>
  );
}
