"use client";

/**
 * Hero band for /markets — eyebrow + headline + sub. Uses Reveal+SplitText
 * for cinematic entrance and a faint pulsing mint dot to underscore "live".
 */

import { Reveal, SplitText } from "@/components/motion/reveal";

export function MarketsHero() {
  return (
    <header className="relative">
      <Reveal as="div" duration={0.5} y={12}>
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-mint mb-4">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          Markets · Live
        </div>
      </Reveal>
      <SplitText
        as="h1"
        text="Every SHIFT market. Long and short."
        className="block text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05] mb-3 md:mb-4"
      />
      <Reveal as="p" delay={0.15} duration={0.55} y={12}>
        <span className="text-sm md:text-base text-foreground/70 max-w-2xl block">
          3× and 2× leveraged, bi-directional, zero liquidation. Tap any market to
          trade — settlement runs on-chain, 24/7.
        </span>
      </Reveal>
    </header>
  );
}
