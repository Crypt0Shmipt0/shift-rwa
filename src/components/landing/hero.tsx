import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
// HeroScene is loaded via a client-side `next/dynamic({ ssr: false })` shim
// (`./hero-scene-lazy`) so three.js + @react-three/fiber +
// @react-three/postprocessing land in their own deferred chunk instead of
// the landing route's initial client bundle. On mobile / reduced-motion /
// no-WebGL the inner component renders nothing, so the CSS gradient + grid
// below stay as the zero-CLS SSR fallback and the heavy WebGL bundle never
// downloads at all on phones.
import { HeroScene } from "./hero-scene-lazy";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden" data-cursor-trail-zone>
      {/* Background gradient + grid (CSS — always rendered, fallback for
          mobile / reduced-motion / no-WebGL). */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(38,200,184,0.18)_0%,_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(38,200,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(38,200,184,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at top, black 0%, transparent 70%)",
          }}
        />

        {/* WebGL parallax depth scene — desktop + motion-ok only. Renders
            ABOVE the CSS gradient (still inside the -z-10 stack) so the
            hero copy stays on top. */}
        <div className="absolute inset-0 overflow-hidden">
          <HeroScene />
        </div>

        {/* Legibility scrim — soft radial dark mask at the center where the
            H1 sits. Keeps mint glow loud at the edges, calms the busy grid
            behind the headline. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(2,28,36,0.78) 0%, rgba(2,28,36,0.55) 35%, rgba(2,28,36,0.0) 75%)",
          }}
        />
        {/* Bottom-edge fade so the scene blends into the next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,28,36,0) 0%, rgba(2,28,36,1) 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-mint/10 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-8">
          <ShieldCheck className="h-3 w-3" />
          The first liquidation-free leveraged RWA protocol
        </div>

        <Reveal delay={0}>
          <h1 className="text-[44px] sm:text-5xl md:text-7xl lg:text-[72px] font-bold tracking-[-0.04em] leading-[1.02] text-white mb-8 pb-1">
            Wall Street{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)",
              }}
            >
              For Crypto.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-[680px] mx-auto mb-10">
            Boring spot stocks crawl 1% a day. Perps blow you up on a wick. SHIFT sits between both:{" "}
            <span className="text-mint font-semibold">3× & 2× bi-directional leveraged
            tokenized stocks, ETFs, and ETNs</span> — real volatility, zero liquidation risk,
            long or short, fully on-chain.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic strength={0.35}>
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-6 h-12 rounded-full hover:bg-mint/90 active:-translate-y-px transition-all shadow-[0_0_30px_rgba(38,200,184,0.25)]"
            >
              Launch App
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.25} noGlow>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 border border-border bg-secondary/40 backdrop-blur text-foreground font-medium text-base px-6 h-12 rounded-full hover:border-mint/40 transition-colors"
            >
              How it works
            </Link>
          </Magnetic>
        </div>
        </Reveal>

        {/* Chain status badge */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-mint/10 border border-mint/30 text-mint text-xs font-semibold px-3 py-1 rounded-full">
            <span className="size-1.5 rounded-full bg-mint animate-pulse" />
            Live on Solana
          </span>
          <span className="inline-flex items-center gap-1.5 bg-foreground/5 border border-border text-foreground/50 text-xs font-semibold px-3 py-1 rounded-full">
            BNB Chain — coming soon
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#375BD2]/5 border border-[#375BD2]/25 text-[#7B9CF4]/70 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="h-3 w-3 shift-shield-pulse" />
            Proof-of-Reserves: coming with mainnet
          </span>
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground max-w-2xl mx-auto">
          <Trust label="Zero liquidation risk" />
          <span className="size-1 rounded-full bg-border" />
          <Trust label="Bi-directional 3× & 2×" />
          <span className="size-1 rounded-full bg-border" />
          <Trust label="Non-custodial" />
          <span className="size-1 rounded-full bg-border" />
          <Trust label="24/7 trade · 24/5 mint" />
        </div>
      </div>
    </section>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-mint" />
      {label}
    </span>
  );
}
