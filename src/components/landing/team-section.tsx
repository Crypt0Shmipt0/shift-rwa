import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEAM } from "@/data/team";

export function LandingTeam() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-20">
      <div className="text-center mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint">
          The team
        </span>
      </div>
      <h2 className="text-center text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05] pb-2 mb-4">
        Built by operators,
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
        >
          not just builders.
        </span>
      </h2>
      <p className="text-center text-foreground/60 text-base max-w-xl mx-auto mb-12">
        Regulation, capital markets, and DeFi infrastructure — covered.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TEAM.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-mint hover:text-mint/80 font-semibold transition-colors"
        >
          View full team
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: (typeof TEAM)[number] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background p-6 hover:border-mint/40 transition-colors group">
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
      <div className="relative">
        {/* Avatar bubble */}
        <div
          className="size-14 rounded-2xl flex items-center justify-center mb-4 text-lg font-bold text-[#021C24] select-none"
          style={{ background: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
        >
          {member.initials}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-mint mb-1">
          {member.role}
        </div>
        <div className="font-semibold text-white text-base mb-2">{member.name}</div>
        <p className="text-sm text-foreground/60 leading-relaxed">{member.bio}</p>
      </div>
    </div>
  );
}
