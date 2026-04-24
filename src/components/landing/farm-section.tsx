"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { TOKENS } from "@/data/tokens";
import { CountUp } from "@/components/motion/count-up";
import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

export function LandingFarm() {
  const sectionRef = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: translate up to 20% of blob height (1100px * 0.2 = 220px)
  const blobY = useTransform(scrollYProgress, [0, 1], [110, -110]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-border/60">
      {/* Mint atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        {motionOk ? (
          <m.div
            className="absolute left-1/2 top-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(38,200,184,0.18)_0%,_rgba(38,200,184,0.05)_30%,_transparent_60%)]"
            style={{ y: blobY }}
          />
        ) : (
          <div className="absolute left-1/2 top-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(38,200,184,0.18)_0%,_rgba(38,200,184,0.05)_30%,_transparent_60%)]" />
        )}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(38,200,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(38,200,184,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          {/* LEFT — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-mint/15 border border-mint/40 text-mint text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
              <span className="size-1.5 rounded-full bg-mint animate-pulse" />
              Now Live · Farm Incentives
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-1 mb-6">
              Trade today.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
              >
                Earn $SHFT tomorrow.
              </span>
            </h2>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-8 max-w-[520px]">
              Every trade, every position, every referral earns farm points that convert to $SHFT
              tokens at TGE. The earlier you trade, the bigger your allocation in the protocol&apos;s
              foundation.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Link
                href="/rewards"
                className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 active:-translate-y-px transition-all shadow-[0_0_30px_rgba(38,200,184,0.3)]"
              >
                Join the rewards program
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <StatAnimated label="Seed raised" prefix="$" to={2} suffix="M" />
              <StatAnimated label="Liquidity raised" prefix="$" to={40} suffix="M+" />
              <Stat label="Network" value="Solana" />
            </div>
          </div>

          {/* RIGHT — glowing token visualization */}
          <div className="relative aspect-square max-w-[420px] sm:max-w-[520px] mx-auto w-full">
            {/* Concentric rings */}
            {[1, 2, 3, 4, 5].map((r) => (
              <div
                key={r}
                className={`absolute inset-0 rounded-full border border-mint/15 shift-orbit-${r}`}
                style={{
                  transform: `scale(${1 - r * 0.13})`,
                  opacity: 1 - r * 0.13,
                  borderColor: `rgba(38,200,184,${0.25 - r * 0.04})`,
                }}
              />
            ))}

            {/* Center mint orb — the SHIFT token */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative size-48 md:size-56">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-mint blur-3xl opacity-60" />
                {/* Inner gradient */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-mint via-[#1FA79B] to-[#07638C] shadow-[0_0_120px_60px_rgba(38,200,184,0.45),inset_0_-20px_60px_rgba(0,0,0,0.4)]" />
                {/* SHIFT mark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/shift-mark-white.png" alt="SHIFT" className="w-3/5 h-auto opacity-95 drop-shadow-2xl" />
                </div>
                {/* Surface highlight */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Orbiting tiny token chips — CSS-animated orbits */}
            {[
              TOKENS[0].image,
              TOKENS[1].image,
              TOKENS[2].image,
              TOKENS[3].image,
              TOKENS[4].image,
            ].map((img, i) => (
              <div
                key={i}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-card border border-mint/40 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(38,200,184,0.4)] shift-chip-orbit-${i}`}
              >
                <Image src={img} alt="" width={48} height={48} className="size-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function StatAnimated({
  label,
  prefix,
  to,
  suffix,
}: {
  label: string;
  prefix?: string;
  to: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-2xl font-bold text-white tabular-nums">
        <CountUp to={to} prefix={prefix} suffix={suffix} duration={1.5} />
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
