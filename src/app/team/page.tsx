import type { Metadata } from "next";
import Image from "next/image";
import { TEAM } from "@/data/team";

export const metadata: Metadata = {
  title: "Team | SHIFT",
  description:
    "Meet the SHIFT team — operators and builders from Fireblocks, Flow Traders, Israel Securities Authority, and the Web3 frontier.",
  alternates: {
    canonical: "/team",
  },
};

export default function TeamPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-24 md:py-32">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-4 block">
          Leadership
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] mb-6">
          The team behind
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
          >
            the technology.
          </span>
        </h1>
        <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto leading-relaxed">
          Capital markets veterans, serial entrepreneurs, and regulatory experts. We have built,
          operated, and exited in both traditional finance and Web3. We know what breaks in TradFi —
          and we know how to fix it on-chain.
        </p>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM.map((member) => {
          const displayName = member.namePrefix
            ? `${member.namePrefix} ${member.name}`
            : member.name;
          return (
            <div
              key={member.name}
              className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background p-8 hover:border-mint/40 transition-colors group"
            >
              <div className="absolute -top-16 -right-16 size-40 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
              <div className="relative flex gap-5 items-start">
                {/* Avatar — photo if available, initials fallback */}
                {member.photo ? (
                  <div className="size-24 rounded-2xl overflow-hidden shrink-0 ring-1 ring-mint/20">
                    <Image
                      src={member.photo}
                      alt={displayName}
                      width={200}
                      height={200}
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="size-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-[#021C24] shrink-0 select-none"
                    style={{ background: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
                  >
                    {member.initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-mint mb-1">
                    {member.role}
                  </div>
                  <div className="font-bold text-white text-lg mb-3">{displayName}</div>
                  <p className="text-sm text-foreground/65 leading-relaxed mb-4">{member.bioFull}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.credentials.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-medium tracking-tight text-foreground/70 bg-white/[0.04] border border-border/60 rounded-full px-2 py-0.5"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Philosophy — the 3-pillar pattern from the Strait site, adapted */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-3 block">
            How we build
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em]">
            Built on experience,
            <br />
            not assumptions.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              n: "01",
              title: "Understand first",
              body: "Every trading system exists within a specific market structure, regulatory environment, and operational context. We spend time understanding yours before writing a line of code.",
            },
            {
              n: "02",
              title: "Simplicity is a feature",
              body: "Complex systems fail in complex ways. We favor straightforward architectures, well-defined interfaces, and components that can be reasoned about independently.",
            },
            {
              n: "03",
              title: "Own the outcome",
              body: "We do not hand off code and disappear. We support what we build, document what we deliver, and remain available when the system encounters something unexpected.",
            },
          ].map((pillar) => (
            <div
              key={pillar.n}
              className="rounded-2xl border border-border bg-card p-6 hover:border-mint/40 transition-colors"
            >
              <div className="text-xs text-mint font-mono mb-3">{pillar.n}</div>
              <div className="text-lg font-bold text-white mb-2">{pillar.title}</div>
              <p className="text-sm text-foreground/65 leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-foreground/40 text-xs mt-16">
        Reach out at{" "}
        <a
          href="mailto:hello@shift.finance"
          className="text-mint hover:text-mint/80 transition-colors"
        >
          hello@shift.finance
        </a>
      </p>
    </main>
  );
}
