"use client";

/**
 * RebalanceClock
 *
 * A 24h clock-face graphic. The hand sweeps; at 4:00 PM ET each day the
 * leverage resets. The "current leverage" digit drifts with the hand
 * (illustrating how price drift moves the effective multiple between
 * resets) then snaps back to 3.00× at the 4 PM mark with a mint pulse.
 *
 * Time model
 *  - 1 simulated day = 8 real seconds.
 *  - Hand position = (elapsed % cycle) / cycle.
 *  - 4 PM ET on a 24h clock = the 16-hour mark = 16/24 = 0.6667 of the cycle.
 *  - Current leverage drifts between resets with a small sinusoid bounded
 *    in [2.78, 3.22]. At reset it snaps cleanly to 3.00.
 */

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { Clock } from "lucide-react";

const MINT = "#26C8B8";
const CYCLE_MS = 8000; // 1 simulated day per 8s
const RESET_FRAC = 16 / 24; // 4PM mark on 24h face

const W = 320;
const H = 320;
const CX = 160;
const CY = 160;
const R_OUTER = 140;
const R_INNER = 124;
const R_TICK = 132;

export function RebalanceClock() {
  const motionOk = useMotionOk();
  const [phase, setPhase] = useState(0); // 0..1 within the day
  const [pulseKey, setPulseKey] = useState(0);
  const lastReset = useRef(false);
  const startRef = useRef<number | null>(null);

  // Drive a simple rAF loop.
  useEffect(() => {
    if (!motionOk) {
      // Static state: park hand at 3 PM, 2.94×.
      setPhase((15 / 24) - 0.001);
      return;
    }
    let rafId = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = (t - startRef.current) % CYCLE_MS;
      const p = elapsed / CYCLE_MS;
      // Detect reset crossing — fire pulse exactly once per cycle as we
      // pass the 4 PM mark.
      const justCrossed = lastReset.current === false && p >= RESET_FRAC && p < RESET_FRAC + 0.05;
      if (justCrossed) {
        setPulseKey((k) => k + 1);
        lastReset.current = true;
      }
      // Reset detector when we pass back through 0.
      if (lastReset.current && p < 0.05) {
        lastReset.current = false;
      }
      setPhase(p);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [motionOk]);

  // Compute leverage display.
  // Drift is a smooth sinusoid in [-0.22, +0.22] across the day with a
  // discontinuity at RESET_FRAC where it snaps to 0 (= 3.00×).
  const isPostReset = phase >= RESET_FRAC;
  const driftPhase = isPostReset ? phase - RESET_FRAC : phase + (1 - RESET_FRAC);
  const drift = 0.22 * Math.sin(driftPhase * Math.PI * 1.4);
  const leverage = 3 + drift;

  // Hand angle: 0 phase = top (12am), rotate clockwise.
  const angleDeg = phase * 360 - 90;

  // 4 PM mark angle.
  const resetAngleDeg = RESET_FRAC * 360 - 90;
  const resetX = CX + Math.cos((resetAngleDeg * Math.PI) / 180) * R_TICK;
  const resetY = CY + Math.sin((resetAngleDeg * Math.PI) / 180) * R_TICK;

  // Hand tip
  const handX = CX + Math.cos((angleDeg * Math.PI) / 180) * (R_INNER - 8);
  const handY = CY + Math.sin((angleDeg * Math.PI) / 180) * (R_INNER - 8);

  // Hour ticks (every 3h)
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];

  // Status copy
  const statusLabel = isPostReset ? "Drifting from 3.00×" : "Approaching reset";
  const minutesToReset = isPostReset
    ? Math.round((1 - phase + RESET_FRAC) * 24 * 60) % (24 * 60)
    : Math.round((RESET_FRAC - phase) * 24 * 60);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-7 overflow-hidden" aria-label="Daily rebalance clock">
      <header className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-mint mb-1">
            <Clock className="h-3 w-3" />
            Daily rebalance · 4 PM ET
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Leverage drifts. The protocol snaps it back, every day.
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[480px]">
            Between rebalances, price moves nudge the effective multiple off
            target. At 4 PM ET the smart contract resets the underlying
            exposure so the token tracks 3× the next day&apos;s underlying again.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center">
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px] md:max-w-[320px] aspect-square" role="img" aria-label="24-hour clock face showing daily rebalance at 4 PM ET">
            <defs>
              <radialGradient id="rb-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0A2E38" stopOpacity="1" />
                <stop offset="100%" stopColor="#021921" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="rb-pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={MINT} stopOpacity="0.7" />
                <stop offset="100%" stopColor={MINT} stopOpacity="0" />
              </radialGradient>
              <filter id="rb-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* face */}
            <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#rb-bg)" stroke="rgba(38,200,184,0.18)" strokeWidth="1" />
            <circle cx={CX} cy={CY} r={R_OUTER - 6} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Mint pulse on reset */}
            {motionOk && (
              <m.circle
                key={pulseKey}
                cx={CX}
                cy={CY}
                r={R_OUTER}
                fill="url(#rb-pulse)"
                initial={{ opacity: 0.0, scale: 0.85 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.85, 1.18, 1.25] }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            )}

            {/* Tick marks (skip 15 — replaced by the 16:00 mint marker) */}
            {hours.filter((h) => h !== 15).map((h) => {
              const a = ((h / 24) * 360 - 90) * (Math.PI / 180);
              const x1 = CX + Math.cos(a) * (R_OUTER - 12);
              const y1 = CY + Math.sin(a) * (R_OUTER - 12);
              const x2 = CX + Math.cos(a) * (R_OUTER - 4);
              const y2 = CY + Math.sin(a) * (R_OUTER - 4);
              const lx = CX + Math.cos(a) * (R_OUTER - 24);
              const ly = CY + Math.sin(a) * (R_OUTER - 24);
              return (
                <g key={h}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(237,238,238,0.3)"
                    strokeWidth={1}
                  />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="ui-monospace,SFMono-Regular,monospace"
                    fill="rgba(237,238,238,0.45)"
                  >
                    {h.toString().padStart(2, "0")}
                  </text>
                </g>
              );
            })}

            {/* 4 PM (16:00 ET) marker — replaces the 15 tick */}
            <g>
              {/* tick line */}
              {(() => {
                const a = (RESET_FRAC * 360 - 90) * (Math.PI / 180);
                const x1 = CX + Math.cos(a) * (R_OUTER - 14);
                const y1 = CY + Math.sin(a) * (R_OUTER - 14);
                const x2 = CX + Math.cos(a) * (R_OUTER - 2);
                const y2 = CY + Math.sin(a) * (R_OUTER - 2);
                return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MINT} strokeWidth={2.5} />;
              })()}
              <circle cx={resetX} cy={resetY} r="7" fill={MINT} filter="url(#rb-glow)" opacity="0.45" />
              <circle cx={resetX} cy={resetY} r="4" fill={MINT} />
              <text
                x={resetX + 14}
                y={resetY - 6}
                textAnchor="start"
                fontSize="9"
                fontFamily="ui-monospace,SFMono-Regular,monospace"
                fill={MINT}
                fontWeight={700}
                letterSpacing="1"
              >
                16:00 ET
              </text>
            </g>

            {/* Hand */}
            <g style={{ transition: motionOk ? "none" : undefined }}>
              <line
                x1={CX}
                y1={CY}
                x2={handX}
                y2={handY}
                stroke={MINT}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx={handX} cy={handY} r="4" fill={MINT} />
              <circle cx={CX} cy={CY} r="6" fill="#021C24" stroke={MINT} strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* Live readout */}
        <div className="flex flex-col gap-3 min-w-0 md:min-w-[200px]">
          <div className="rounded-2xl border border-mint/30 bg-mint/5 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 mb-1">
              Current leverage
            </div>
            <div className="text-3xl md:text-4xl font-bold tabular-nums text-mint">
              {leverage.toFixed(2)}×
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-foreground/50 mt-1">
              Target · 3.00×
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-[#02191F] p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 mb-1">
              {statusLabel}
            </div>
            <div className="text-base font-semibold text-white">
              {isPostReset ? "Reset complete" : "Snap to 3.00×"}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-foreground/50 mt-1 tabular-nums">
              {Math.floor(minutesToReset / 60)}h {minutesToReset % 60}m {isPostReset ? "until next" : "to reset"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
