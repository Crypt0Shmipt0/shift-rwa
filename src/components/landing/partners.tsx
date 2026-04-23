import Image from "next/image";
import { BACKERS, INTEGRATIONS, type Partner } from "@/lib/partners-data";

export function LandingPartners() {
  return (
    <section className="relative border-y border-border/60 bg-background/40">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-24 space-y-16">
        <LogoWall
          eyebrow="Backed by"
          headline="The capital and conviction behind SHIFT."
          partners={BACKERS}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <LogoWall
          eyebrow="Live integrations"
          headline="Plugged into where capital already flows."
          partners={INTEGRATIONS}
          footnote="Custody via Alpaca Markets — 24/5 mint-and-burn rails backing every token."
        />
      </div>
    </section>
  );
}

function LogoWall({
  eyebrow,
  headline,
  partners,
  footnote,
}: {
  eyebrow: string;
  headline: string;
  partners: readonly Partner[];
  footnote?: string;
}) {
  return (
    <div>
      {/* Section header */}
      <div className="text-center mb-10">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint mb-3">
          {eyebrow}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight max-w-2xl mx-auto">
          {headline}
        </h3>
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {partners.map((p) => (
          <PartnerCard key={`${p.slug}-${p.name}`} partner={p} />
        ))}
      </div>

      {footnote && (
        <p className="text-center text-sm text-foreground/55 mt-8 max-w-xl mx-auto">
          {footnote}
        </p>
      )}
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const { name, logo, url, label } = partner;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label ? `${label} of ${name}` : name}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-white/[0.03] hover:bg-white/[0.06] hover:border-mint/40 transition-all duration-200 px-5 py-7 min-h-[140px]"
    >
      {/* Logo (or text fallback) */}
      <div className="relative h-12 w-full flex items-center justify-center">
        {logo ? (
          <Image
            src={logo}
            alt={name}
            height={48}
            width={160}
            className="h-12 w-auto max-w-[140px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <span className="text-xl font-bold tracking-tight text-foreground/70 group-hover:text-white transition-colors">
            {name}
          </span>
        )}
      </div>

      {/* Name + optional label */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-sm font-semibold text-foreground/80 group-hover:text-white transition-colors">
          {name}
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-[0.15em] text-mint/80 font-bold">
            {label}
          </span>
        )}
      </div>
    </a>
  );
}
