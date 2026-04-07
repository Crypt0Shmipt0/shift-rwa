import Link from "next/link";
import { ArrowRight, Sparkles, Globe2 } from "lucide-react";

export function LandingFarm() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-24">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(38,200,184,0.10)_0%,_transparent_60%)]" />
      </div>

      {/* Center globe-style ring visual */}
      <div className="relative mx-auto w-full max-w-[700px] aspect-square mb-16">
        {/* Concentric rings */}
        {[1, 2, 3, 4].map((r) => (
          <div
            key={r}
            className="absolute inset-0 rounded-full border border-mint/20"
            style={{
              transform: `scale(${1 - r * 0.18})`,
              opacity: 1 - r * 0.18,
            }}
          />
        ))}
        {/* Center mint orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-44 rounded-full bg-gradient-to-br from-mint to-[#07638C] flex items-center justify-center shadow-[0_0_120px_rgba(38,200,184,0.5)]">
            <Globe2 className="h-20 w-20 text-primary-foreground" strokeWidth={1.4} />
          </div>
        </div>
        {/* Orbiting mini-tokens */}
        {[
          { top: "8%",  left: "50%", label: "TSL2s" },
          { top: "50%", left: "92%", label: "NVD3s" },
          { top: "92%", left: "50%", label: "SPY3s" },
          { top: "50%", left: "8%",  label: "TSLSs" },
        ].map((p) => (
          <div
            key={p.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 size-14 rounded-full bg-card border border-mint/40 flex items-center justify-center text-[10px] font-bold text-mint shadow-[0_0_30px_rgba(38,200,184,0.3)]"
            style={{ top: p.top, left: p.left }}
          >
            {p.label}
          </div>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mint mb-4">
          <Sparkles className="h-3 w-3" />
          Now live · Farm incentives
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
          Trade today.
          <br />
          <span className="text-mint">Earn SHIFT tomorrow.</span>
        </h2>
        <p className="text-base text-foreground/70 leading-relaxed mb-8">
          Every trade you place earns farm points that convert to SHIFT tokens at TGE. Active
          traders, LPs, and referrers all participate. The earlier you trade, the bigger your
          allocation.
        </p>
        <Link
          href="/rewards"
          className="group inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 transition-colors"
        >
          Join the rewards program
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
