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
    <main className="mx-auto max-w-[1000px] px-6 py-24 md:py-32">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-4 block">
          The team
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] mb-6">
          Built by operators,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
          >
            not just builders.
          </span>
        </h1>
        <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto leading-relaxed">
          SHIFT is built by people who have run regulated financial institutions, scaled DeFi
          infrastructure, and shipped capital-markets products at institutional scale. We know what
          breaks in TradFi — and we know how to fix it on-chain.
        </p>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TEAM.map((member) => (
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
                    alt={member.name}
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
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-mint mb-1">
                  {member.role}
                </div>
                <div className="font-bold text-white text-lg mb-2">{member.name}</div>
                <p className="text-sm text-foreground/65 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-foreground/40 text-xs mt-12">
        Extended bios coming soon. Reach out at{" "}
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
