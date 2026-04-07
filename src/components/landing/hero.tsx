import Link from "next/link";
import { ArrowRight, ShieldOff } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient + grid */}
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
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-mint/10 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-8">
          <ShieldOff className="h-3 w-3" />
          The first liquidation-free leveraged RWA protocol
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[112px] font-bold tracking-[-0.04em] leading-[0.92] text-white mb-8">
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

        <p className="text-base md:text-xl text-foreground/80 leading-relaxed max-w-[760px] mx-auto mb-10">
          Boring spot stocks crawl 1% a day. Perps blow you up on a wick. SHIFT is the
          revolutionary <span className="text-mint font-semibold">3× & 2× bi-directional leveraged
          tokenized stocks, ETFs, and ETNs</span> protocol — real volatility, zero liquidation risk,
          long or short, fully on-chain.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app"
            className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 h-13 py-3.5 rounded-full hover:bg-mint/90 active:-translate-y-px transition-all shadow-[0_0_30px_rgba(38,200,184,0.25)]"
          >
            Launch App
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 border border-border bg-secondary/40 backdrop-blur text-foreground font-medium text-base px-7 h-13 py-3.5 rounded-full hover:border-mint/40 transition-colors"
          >
            How it works
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
          <Trust label="Zero liquidation risk" />
          <span className="hidden sm:block size-1 rounded-full bg-border" />
          <Trust label="Bi-directional 3× & 2×" />
          <span className="hidden sm:block size-1 rounded-full bg-border" />
          <Trust label="Non-custodial" />
          <span className="hidden sm:block size-1 rounded-full bg-border" />
          <Trust label="24/7 settlement" />
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
