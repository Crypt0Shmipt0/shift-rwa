"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ShieldOff, Layers, Repeat } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { TOKENS } from "@/data/tokens";
import { TiltCard } from "@/components/motion/tilt-card";

const ROW_2 = TOKENS.map((t) => ({
  ticker: t.shiftTicker,
  img: t.image,
  sub: t.direction === "long" ? `${t.leverage}× long` : `${t.leverage}× short`,
}));

/* ── SVG sparklines ─────────────────────────────────────────────────── */

function FlatLine() {
  return (
    <svg viewBox="0 0 240 60" className="w-full max-w-xs mx-auto h-12 opacity-60" fill="none">
      <polyline
        points="0,30 40,32 80,29 120,31 160,30 200,31 240,30"
        stroke="#26C8B8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WickLine() {
  return (
    <svg viewBox="0 0 240 80" className="w-full max-w-xs mx-auto h-16 opacity-80" fill="none">
      <polyline
        points="0,20 40,18 80,22 120,19 140,20"
        stroke="#26C8B8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sharp spike down */}
      <polyline
        points="140,20 155,70 170,25 200,23 240,22"
        stroke="#FF4D6A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Beat panels ─────────────────────────────────────────────────────── */

function Beat1() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-8">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-destructive/80 mb-4">
        1× spot stocks
      </div>
      <h3 className="text-5xl md:text-7xl font-bold text-white tracking-[-0.04em] mb-3">Boring.</h3>
      <FlatLine />
      <p className="text-lg md:text-xl text-foreground/60 max-w-md mt-4 leading-relaxed">
        Tesla moves 1.4% a day. That&apos;s not a market.
        <br />
        <span className="text-foreground/40">That&apos;s a savings account.</span>
      </p>
    </div>
  );
}

function Beat2() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-8">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-destructive/80 mb-4">
        Perps &amp; margin
      </div>
      <h3 className="text-5xl md:text-7xl font-bold text-white tracking-[-0.04em] mb-3">
        Liquidating.
      </h3>
      <WickLine />
      <p className="text-lg md:text-xl text-foreground/60 max-w-md mt-4 leading-relaxed">
        One 5% wick. Gone.
        <br />
        <span className="text-foreground/40">Perps blow you out at the exact bottom.</span>
      </p>
    </div>
  );
}

function Beat3() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
      <div className="text-center mb-6">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-mint mb-4">SHIFT</div>
        <h3 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] mb-2">
          <span className="text-gradient-mint">
            SHIFT fixes both.
          </span>
        </h3>
        <p className="text-base text-foreground/60 max-w-sm mx-auto">
          Leveraged tokens you hold. No liquidation engine. No funding fees.
        </p>
      </div>

      {/* Token tiles mini-grid */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 w-full max-w-lg mb-4">
        {ROW_2.map((tile, i) => (
          <TiltCard key={`${tile.ticker}-${i}`} maxTilt={6} glare={true}>
            <div className="relative aspect-square rounded-2xl border border-mint/20 bg-gradient-to-br from-mint/[0.04] via-card to-card p-2 overflow-hidden hover:border-mint/50 transition-colors group">
              <div className="relative h-full flex flex-col items-center justify-center text-center gap-1">
                <Image
                  src={tile.img}
                  alt={tile.ticker}
                  width={40}
                  height={40}
                  className="size-8 md:size-10 rounded-full object-cover drop-shadow-[0_0_12px_rgba(38,200,184,0.4)]"
                />
                <div className="text-[9px] font-bold text-white leading-none">{tile.ticker}</div>
                <div className="text-[8px] text-mint">{tile.sub}</div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { icon: <Repeat className="h-3 w-3" />, label: "Long" },
          { icon: <Layers className="h-3 w-3" />, label: "Short" },
          { icon: <ShieldOff className="h-3 w-3" />, label: "No liquidation" },
        ].map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-1.5 bg-mint/10 border border-mint/30 text-mint text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            {b.icon}
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Animated (motion-ok) version ─────────────────────────────────────── */

function AnimatedSequence() {
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Beat 1: 0% → 33%
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.4], [1, 1, 0, 0]);
  const beat1Y = useTransform(scrollYProgress, [0.25, 0.4], [0, -40]);

  // Beat 2: 33% → 66%
  const beat2Opacity = useTransform(scrollYProgress, [0.27, 0.37, 0.57, 0.67], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.27, 0.37, 0.57, 0.67], [30, 0, 0, -40]);

  // Beat 3: 66% → 100%
  const beat3Opacity = useTransform(scrollYProgress, [0.6, 0.72, 1], [0, 1, 1]);
  const beat3Y = useTransform(scrollYProgress, [0.6, 0.72], [30, 0]);

  return (
    <div ref={outerRef} style={{ height: "300vh" }} className="relative">
      {/* Sticky viewport */}
      <div
        className="sticky overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 to-background"
        style={{ top: "20vh", height: "60vh" }}
      >
        {/* Beat 1 */}
        <m.div
          className="absolute inset-0"
          style={{ opacity: beat1Opacity, y: beat1Y }}
        >
          <Beat1 />
        </m.div>

        {/* Beat 2 */}
        <m.div
          className="absolute inset-0"
          style={{ opacity: beat2Opacity, y: beat2Y }}
        >
          <Beat2 />
        </m.div>

        {/* Beat 3 */}
        <m.div
          className="absolute inset-0"
          style={{ opacity: beat3Opacity, y: beat3Y }}
        >
          <Beat3 />
        </m.div>
      </div>
    </div>
  );
}

/* ── Static fallback ──────────────────────────────────────────────────── */

function StaticSequence() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Beat 1 */}
      <div className="relative overflow-hidden rounded-3xl border border-destructive/25 bg-gradient-to-br from-destructive/10 via-card to-card p-8 text-center">
        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-destructive/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-destructive/80 mb-3">1× spot stocks</div>
          <div className="text-4xl font-bold text-white mb-3">Boring.</div>
          <FlatLine />
          <p className="text-sm text-foreground/65 leading-relaxed mt-3">
            Tesla moves 1.4% a day. That&apos;s not a market — that&apos;s a savings account.
          </p>
        </div>
      </div>

      {/* Beat 2 */}
      <div className="relative overflow-hidden rounded-3xl border border-destructive/25 bg-gradient-to-br from-destructive/10 via-card to-card p-8 text-center">
        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-destructive/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-destructive/80 mb-3">Perps &amp; margin</div>
          <div className="text-4xl font-bold text-white mb-3">Liquidating.</div>
          <WickLine />
          <p className="text-sm text-foreground/65 leading-relaxed mt-3">
            One 5% wick. Gone. Perps blow you out at the exact bottom.
          </p>
        </div>
      </div>

      {/* Beat 3 */}
      <div className="relative overflow-hidden rounded-3xl border border-mint/25 bg-gradient-to-br from-mint/10 via-card to-card p-8 text-center">
        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-mint/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-mint mb-3">SHIFT</div>
          <div className="text-4xl font-bold mb-3">
            <span className="text-gradient-mint">
              Fixes both.
            </span>
          </div>
          <p className="text-sm text-foreground/65 leading-relaxed">
            Leveraged tokens you hold in your wallet. No liquidation. No funding fees.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Public export ────────────────────────────────────────────────────── */

export function ThesisSequence() {
  const motionOk = useMotionOk();
  return motionOk ? <AnimatedSequence /> : <StaticSequence />;
}
