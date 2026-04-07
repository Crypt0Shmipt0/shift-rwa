import Link from "next/link";

const LEGAL = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
];

const PRODUCT = [
  { href: "/markets", label: "Markets" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/portfolio", label: "Portfolio" },
];

const RESOURCES = [
  { href: "/learn", label: "Learn" },
  { href: "/status", label: "Status" },
  { href: "/rewards", label: "Rewards" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-[72px] py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-white mb-3">SHIFT Finance</div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
            Bi-directional 3× & 2× tokenized stocks, ETFs, and ETNs. On-chain. Zero liquidation risk.
          </p>
        </div>
        <FooterCol title="Product" links={PRODUCT} />
        <FooterCol title="Resources" links={RESOURCES} />
        <FooterCol title="Legal" links={LEGAL} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-[72px] py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 SHIFT Finance. Trading involves risk. Not investment advice.</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-mint animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-foreground/80 hover:text-mint transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
