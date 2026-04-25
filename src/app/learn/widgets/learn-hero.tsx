"use client";

/**
 * LearnHero
 *
 * The /learn page hero. Replaces the previous text-only hero with a
 * visual-first composition:
 *   - tightened H1 + eyebrow + intro copy on the left
 *   - animated SVG "circuit" on the right showing the protocol in
 *     motion: a mint pulse loops through a stylized custody → oracle →
 *     contract → wallet → DeFi ring while a SHIFT token logo sits at
 *     the center.
 *
 * Lightweight (no WebGL boot), respects reduced motion, mobile-friendly
 * (the visual sits below the copy on small screens).
 */

import Link from "next/link";
import Image from "next/image";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { BookOpen } from "lucide-react";

const MINT = "#26C8B8";

export function LearnHero() {
  const motionOk = useMotionOk();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-mint/20 bg-gradient-to-br from-[#04242F] via-[#02181F] to-[#021921] mb-8 md:mb-12">
      {/* Ambient grid */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(38,200,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(38,200,184,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        }}
      />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-mint/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-[#07638C]/20 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-10 items-center px-6 md:px-10 py-10 md:py-14">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-5">
            <BookOpen className="h-3 w-3" />
            Learn hub
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4">
            How SHIFT actually{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${MINT} 0%, #14A6C8 100%)` }}
            >
              works.
            </span>
          </h1>
          <p className="text-sm md:text-base text-foreground/75 leading-relaxed mb-5">
            Tokenized leveraged stocks with daily-reset multiples and zero
            liquidation risk. Below: a live simulator, a perp-vs-SHIFT side-by-side,
            the rebalance clock, and the protocol architecture — followed by{" "}
            <Link
              href="https://shift-stocks.gitbook.io/learn"
              target="_blank"
              rel="noreferrer"
              className="text-mint hover:underline"
            >
              the full Gitbook
            </Link>{" "}
            for protocol-level detail.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.16em]">
            <Pill>Non-custodial</Pill>
            <Pill>SPL native</Pill>
            <Pill>24/7 trading</Pill>
            <Pill>0 liquidations</Pill>
          </div>
        </div>

        {/* Visual: animated SVG circuit */}
        <div className="relative aspect-square w-full max-w-[420px] mx-auto md:max-w-none">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            role="img"
            aria-label="SHIFT protocol diagram: mint pulses circulating between custody, oracle, contract, wallet, and DeFi nodes"
          >
            <defs>
              <radialGradient id="lh-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={MINT} stopOpacity="0.45" />
                <stop offset="100%" stopColor={MINT} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lh-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={MINT} stopOpacity="0.6" />
                <stop offset="100%" stopColor="#14A6C8" stopOpacity="0.25" />
              </linearGradient>
              <filter id="lh-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* outer slow ring */}
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(38,200,184,0.12)" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="url(#lh-ring)" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(38,200,184,0.18)" strokeWidth="1" />

            {/* core glow */}
            <circle cx="200" cy="200" r="80" fill="url(#lh-core)" />

            {/* nodes around the ring */}
            {NODES.map((n, i) => {
              const angle = ((i / NODES.length) * 2 - 0.5) * Math.PI;
              const x = 200 + Math.cos(angle) * 140;
              const y = 200 + Math.sin(angle) * 140;
              return (
                <g key={n.label}>
                  <circle cx={x} cy={y} r="14" fill="#02191F" stroke={MINT} strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="14" fill={MINT} fillOpacity="0.08" />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="ui-monospace,SFMono-Regular,monospace"
                    fontWeight="700"
                    fill={MINT}
                  >
                    {n.code}
                  </text>
                  <text
                    x={x}
                    y={y + 32}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="ui-monospace,SFMono-Regular,monospace"
                    fill="rgba(237,238,238,0.55)"
                    letterSpacing="0.6"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* traveling pulses on the ring */}
            {motionOk &&
              [0, 1, 2].map((p) => (
                <m.circle
                  key={p}
                  r="4"
                  fill={MINT}
                  filter="url(#lh-glow)"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: p * 2,
                  }}
                  style={{ originX: "200px", originY: "200px", transformOrigin: "200px 200px" }}
                  cx="340"
                  cy="200"
                />
              ))}

            {/* slow rotating outer dashed ring */}
            {motionOk && (
              <m.g
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "200px 200px" }}
              >
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(38,200,184,0.12)" strokeWidth="1" strokeDasharray="6 12" />
              </m.g>
            )}
          </svg>

          {/* Center logo overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-mint/20 blur-2xl" />
              <Image
                src="/brand/shift-mark-gradient.png"
                alt=""
                aria-hidden
                width={96}
                height={96}
                className="relative size-16 md:size-24 drop-shadow-[0_0_24px_rgba(38,200,184,0.55)]"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const NODES = [
  { code: "C", label: "Custody" },
  { code: "O", label: "Oracle" },
  { code: "S", label: "SHIFT" },
  { code: "W", label: "Wallet" },
  { code: "D", label: "DeFi" },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-mint/10 border border-mint/30 text-mint px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}
