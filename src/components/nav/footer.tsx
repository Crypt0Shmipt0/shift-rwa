import Link from "next/link";
import { X, MessageCircle, Send, Video, Globe } from "lucide-react";

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

const SOCIALS = [
  { href: "https://x.com/shiftfinance", label: "X / Twitter", Icon: X },
  { href: "https://discord.gg/shift", label: "Discord", Icon: MessageCircle },
  { href: "https://t.me/shiftfinance", label: "Telegram", Icon: Send },
  { href: "https://youtube.com/@shiftfinance", label: "YouTube", Icon: Video },
  { href: "https://linkedin.com/company/shift-finance", label: "LinkedIn", Icon: Globe },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-[72px] py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-white mb-3">SHIFT Finance</div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px] mb-6">
            Bi-directional 3× &amp; 2× tokenized stocks, ETFs, and ETNs. On-chain. Zero liquidation risk.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-3 flex-wrap">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="size-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-mint hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
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
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block py-2 text-sm text-foreground/80 hover:text-mint transition-colors -ml-1 px-1 rounded">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
