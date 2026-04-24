"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TEAM, type TeamMember } from "@/data/team";
import { StaggerChildren, RevealChild } from "@/components/motion/stagger-children";

export function LandingTeam() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-20">
      <div className="text-center mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint">
          Leadership
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
      <p className="text-center text-foreground/60 text-base max-w-2xl mx-auto mb-12">
        Capital markets veterans, serial entrepreneurs, and regulatory experts.
        Built, operated, and exited in both TradFi and Web3.
      </p>

      <StaggerChildren staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {TEAM.map((member) => (
          <RevealChild key={member.name}>
            <TeamCard member={member} />
          </RevealChild>
        ))}
      </StaggerChildren>

      <div className="mt-10 text-center">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-mint hover:text-mint/80 font-semibold transition-colors"
        >
          Full team + advisors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const displayName = member.namePrefix ? `${member.namePrefix} ${member.name}` : member.name;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background p-5 hover:border-mint/40 transition-colors group flex flex-col">
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
      <div className="relative flex flex-col flex-1">
        {/* Avatar — photo if available, initials fallback */}
        {member.photo ? (
          <div className="size-20 rounded-2xl overflow-hidden mb-4 ring-1 ring-mint/20">
            <Image
              src={member.photo}
              alt={displayName}
              width={160}
              height={160}
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div
            className="size-20 rounded-2xl flex items-center justify-center mb-4 text-xl font-bold text-[#021C24] select-none"
            style={{ background: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
          >
            {member.initials}
          </div>
        )}
        <div className="text-xs font-bold uppercase tracking-wider text-mint mb-1">
          {member.role}
        </div>
        <div className="font-semibold text-white text-sm mb-2">{displayName}</div>
        <p className="text-xs text-foreground/60 leading-relaxed mb-4 flex-1">
          {member.bioShort}
        </p>
        {member.credentials.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-border/40">
            {member.credentials.slice(0, 2).map((c) => (
              <span
                key={c}
                className="text-[9px] font-medium tracking-tight text-foreground/70 bg-white/[0.04] border border-border/60 rounded-full px-1.5 py-0.5"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
