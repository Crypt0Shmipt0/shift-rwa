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
import { ShieldX, ShieldCheck, ArrowDownToLine } from "lucide-react";

const MINT = "#26C8B8";
const STEEL = "#4FC8E8"; // SOX3S inverse
const DANGER = "#FF4D6A";
const OFF_WHITE = "#EDEEEE";

const W = 800;
const H = 320;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 24;
const PAD_B = 36;

const LEVERAGE = 3;
// Visual + narrative floor: even the perp's "liquidated" state caps at −90%.
// Keeps the chart honest about the no-liquidation pitch on SHIFT and prevents
// a giant red line escaping to −100%.
const FLOOR = -90;

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
  perp: number[];    // % from start — 3× perp (liquidates and freezes at FLOOR)
  long: number[];    // % from start — SHIFT SOX3L (3× long, daily rebalanced)
  inverse: number[]; // % from start — SHIFT SOX3S (3× short, daily rebalanced)
  perpLiqDay: number | null;
}

function compute(): Series {
  const perp: number[] = [0];
  const long: number[] = [0];
  const inverse: number[] = [0];
  let perpLiqDay: number | null = null;
  let longNav = 1;
  let inverseNav = 1;

  for (let d = 1; d < UNDERLYING_PCT.length; d++) {
    // 3× PERP — linear leverage; once cumulative drawdown × leverage ≤ FLOOR,
    // it's effectively liquidated. Freeze the line at the FLOOR.
    if (perpLiqDay !== null) {
      perp.push(FLOOR);
    } else {
      const nav = UNDERLYING_PCT[d] * LEVERAGE;
      if (nav <= FLOOR) {
        perp.push(FLOOR);
        perpLiqDay = d;
      } else {
        perp.push(nav);
      }
    }

    // SHIFT SOX3L — daily-rebalanced 3× LONG, NAV-floored at the chart floor
    const r =
      (1 + UNDERLYING_PCT[d] / 100) / (1 + UNDERLYING_PCT[d - 1] / 100) - 1;
    longNav *= 1 + LEVERAGE * r;
    longNav = Math.max(longNav, 1 + FLOOR / 100);
    long.push((longNav - 1) * 100);

    // SHIFT SOX3S — daily-rebalanced 3× SHORT (inverse), same NAV floor
    inverseNav *= 1 - LEVERAGE * r;
    inverseNav = Math.max(inverseNav, 1 + FLOOR / 100);
    inverse.push((inverseNav - 1) * 100);
  }
  return { perp, long, inverse, perpLiqDay };
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
  const finalLong = series.long[series.long.length - 1];
  const finalInverse = series.inverse[series.inverse.length - 1];
  const finalUnderlying = UNDERLYING_PCT[UNDERLYING_PCT.length - 1];

  // Y-range to show all 4 series + a little headroom
  const all = [...UNDERLYING_PCT, ...series.perp, ...series.long, ...series.inverse];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.06;
  const yMin = lo - pad;
  const yMax = hi + pad;

  const underlyingPath = buildPath(UNDERLYING_PCT, yMin, yMax);
  const perpPath = buildPath(series.perp, yMin, yMax);
  const longPath = buildPath(series.long, yMin, yMax);
  const inversePath = buildPath(series.inverse, yMin, yMax);

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
          The perp dies at the bottom. SHIFT survives — long or short.
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[680px]">
          All three take 3× exposure to SOXX over 30 days. A 3× perp gets liquidated mid-drawdown. SHIFT SOX3L (3× long) and SOX3S (3× short) have no liquidation engine — they ride the same volatility from opposite sides and stay alive through the cycle.
        </p>
      </header>

      {/* Stat row */}
      <div className="flex flex-wrap gap-2 px-5 md:px-7 pb-4">
        <Stat
          label="SOXX · 30d"
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
          label="SOX3L · 30d"
          value={finalLong}
          accent="mint"
          tag="Survived"
          icon={<ShieldCheck className="h-3 w-3" />}
        />
        <Stat
          label="SOX3S · 30d"
          value={finalInverse}
          accent="steel"
          tag="3× short"
          icon={<ArrowDownToLine className="h-3 w-3" />}
        />
      </div>

      {/* Chart */}
      <div className="relative px-5 md:px-7 pb-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[280px] md:h-[340px]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`30-day comparison: 3× perp ends at ${finalPerp.toFixed(0)}% (liquidated), SHIFT SOX3L ends at ${finalLong.toFixed(0)}%, SHIFT SOX3S ends at ${finalInverse.toFixed(0)}%.`}
        >
          <defs>
            <linearGradient id="pk-long-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={MINT} stopOpacity="0" />
            </linearGradient>
            <filter id="pk-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="pk-glow-steel" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2.5" />
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

          {/* SOX3L area fill */}
          <m.path
            d={`${longPath} L${W - PAD_R},${H - PAD_B} L${PAD_L},${H - PAD_B} Z`}
            fill="url(#pk-long-fill)"
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

          {/* SOX3L (long) — mint, glowing */}
          {motionOk ? (
            <m.path
              d={longPath}
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
              d={longPath}
              fill="none"
              stroke={MINT}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow)"
            />
          )}

          {/* SOX3S (inverse short) — steel-blue, glowing */}
          {motionOk ? (
            <m.path
              d={inversePath}
              fill="none"
              stroke={STEEL}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow-steel)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
            />
          ) : (
            <path
              d={inversePath}
              fill="none"
              stroke={STEEL}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pk-glow-steel)"
            />
          )}

          {/* End-of-series dots */}
          {(() => {
            const xEnd = PAD_L + innerW;
            const yU = PAD_T + innerH - ((finalUnderlying - yMin) / (yMax - yMin)) * innerH;
            const yP = PAD_T + innerH - ((finalPerp - yMin) / (yMax - yMin)) * innerH;
            const yL = PAD_T + innerH - ((finalLong - yMin) / (yMax - yMin)) * innerH;
            const yI = PAD_T + innerH - ((finalInverse - yMin) / (yMax - yMin)) * innerH;
            return (
              <>
                <circle cx={xEnd} cy={yU} r="3.5" fill={OFF_WHITE} fillOpacity="0.7" />
                <circle cx={xEnd} cy={yP} r="4" fill={DANGER} />
                <circle cx={xEnd} cy={yL} r="5" fill={MINT} />
                <circle cx={xEnd} cy={yL} r="9" fill={MINT} fillOpacity="0.25" />
                <circle cx={xEnd} cy={yI} r="4" fill={STEEL} />
                <circle cx={xEnd} cy={yI} r="8" fill={STEEL} fillOpacity="0.22" />
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
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-[0.12em]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: MINT, boxShadow: `0 0 10px ${MINT}` }} />
            <span className="text-mint">SOX3L · 3× long</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: STEEL, boxShadow: `0 0 10px ${STEEL}` }} />
            <span style={{ color: STEEL }}>SOX3S · 3× short</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: DANGER }} />
            <span className="text-[#FF4D6A]">3× Perp · liquidated</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: OFF_WHITE, opacity: 0.55 }} />
            <span className="text-foreground/55">SOXX · spot</span>
          </span>
        </div>
      </div>

      <footer className="px-5 md:px-7 py-4 bg-[#021921] text-[11px] text-foreground/55 leading-relaxed">
        <span className="font-mono uppercase tracking-[0.14em] text-foreground/40 mr-2">Note</span>
        Same 3× leverage on the same daily SOXX path. The 3× perp liquidates
        on the deepest drawdown (forced close, frozen at −90%). SHIFT SOX3L
        and SOX3S compound 3× exposure daily in opposite directions — both
        survive the cycle. Illustrative scenario, not indicative of future returns.
      </footer>
    </section>
  );
}

interface StatProps {
  label: string;
  value: number;
  accent: "mint" | "danger" | "off" | "steel";
  tag?: string;
  icon?: React.ReactNode;
}

function Stat({ label, value, accent, tag, icon }: StatProps) {
  const sign = value >= 0 ? "+" : "";
  const color =
    accent === "mint"
      ? "text-mint"
      : accent === "steel"
        ? "text-[#4FC8E8]"
        : accent === "danger"
          ? "text-[#FF4D6A]"
          : "text-foreground/70";
  const bg =
    accent === "mint"
      ? "bg-mint/10 border-mint/30"
      : accent === "steel"
        ? "bg-[#4FC8E8]/10 border-[#4FC8E8]/30"
        : accent === "danger"
          ? "bg-[#FF4D6A]/10 border-[#FF4D6A]/30"
          : "bg-white/5 border-white/15";
  const tagColor =
    accent === "mint"
      ? "text-mint"
      : accent === "steel"
        ? "text-[#4FC8E8]"
        : accent === "danger"
          ? "text-[#FF4D6A]"
          : "text-foreground/55";
  return (
    <div className={`flex-1 min-w-[140px] rounded-xl border ${bg} px-3 py-2`}>
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
