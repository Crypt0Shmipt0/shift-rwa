import type { Metadata } from "next";
import Image from "next/image";
// lucide-react v1.x lacks brand icons; reuse Globe (LinkedIn) and X (Twitter/X)
// for the same visual treatment we use in the site footer.
import { Globe, X } from "lucide-react";
import { TEAM, ADVISORS, type TeamMember } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the SHIFT team — operators and builders from Fireblocks, Flow Traders, Israel Securities Authority, PayBase, and the Web3 frontier.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-4 block">
          Leadership
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05] mb-5">
          The team behind
          <br />
          <span className="text-gradient-mint">
            the technology.
          </span>
        </h1>
        <p className="text-sm md:text-base text-foreground/65 max-w-2xl mx-auto leading-relaxed">
          Capital markets veterans, serial entrepreneurs, and regulatory experts. We have built,
          operated, and exited in both traditional finance and Web3. We know what breaks in TradFi —
          and we know how to fix it on-chain.
        </p>
      </div>

      {/* Core team */}
      <MemberGrid members={TEAM} />

      {/* Advisors */}
      <div className="mt-20 mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-3 block">
          Advisors & Extended Leadership
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em]">
          The deep bench.
        </h2>
      </div>
      <MemberGrid members={ADVISORS} />

      {/* Philosophy */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-mint mb-3 block">
            How we build
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em]">
            Built on experience,
            <br />
            not assumptions.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
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
              className="rounded-2xl border border-border bg-card p-5 hover:border-mint/40 transition-colors"
            >
              <div className="text-xs text-mint font-mono mb-2">{pillar.n}</div>
              <div className="text-lg font-bold text-white mb-2">{pillar.title}</div>
              <p className="text-sm text-foreground/65 leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-foreground/40 text-xs mt-12">
        Reach out at{" "}
        <a
          href="mailto:hello@shift.finance"
          className="text-mint hover:text-mint/80 transition-colors"
        >
          hello@shift.finance
        </a>
      </p>
    </div>
  );
}

function MemberGrid({ members }: { members: readonly TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {members.map((member) => {
        const displayName = member.namePrefix
          ? `${member.namePrefix} ${member.name}`
          : member.name;
        return (
          <div
            key={member.name}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background p-5 md:p-6 hover:border-mint/40 transition-colors group"
          >
            <div className="absolute -top-16 -right-16 size-40 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
            <div className="relative flex gap-4 items-start">
              {member.photo ? (
                <div className="size-16 md:size-20 rounded-2xl overflow-hidden shrink-0 ring-1 ring-mint/20">
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
                  className="size-16 md:size-20 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold text-[#021C24] shrink-0 select-none"
                  style={{ background: "linear-gradient(135deg, #26C8B8 0%, #14A6C8 100%)" }}
                >
                  {member.initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-mint mb-1">
                  {member.role}
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="font-bold text-white text-base md:text-lg">{displayName}</div>
                  <MemberSocials member={member} />
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed mb-3">{member.bioFull}</p>
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
  );
}

function MemberSocials({ member }: { member: TeamMember }) {
  const displayName = member.namePrefix ? `${member.namePrefix} ${member.name}` : member.name;
  if (!member.linkedin && !member.x) return null;
  return (
    <div className="flex items-center gap-0.5 -my-2">
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${displayName} on LinkedIn`}
          className="inline-flex items-center justify-center size-9 rounded-lg text-foreground/40 hover:text-mint hover:bg-secondary/40 transition-colors"
        >
          <Globe className="h-4 w-4" />
        </a>
      )}
      {member.x && (
        <a
          href={member.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${displayName} on X`}
          className="inline-flex items-center justify-center size-9 rounded-lg text-foreground/40 hover:text-mint hover:bg-secondary/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
