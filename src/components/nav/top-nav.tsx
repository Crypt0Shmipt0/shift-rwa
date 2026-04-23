"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShiftLogo } from "@/components/nav/shift-logo";

const LINKS = [
  { href: "/markets", label: "Markets", match: ["/trade", "/markets"] },
  { href: "/portfolio", label: "Portfolio", match: ["/portfolio", "/history"] },
  { href: "/leaderboard", label: "Leaderboard", match: ["/leaderboard"] },
  { href: "/rewards", label: "Rewards", match: ["/rewards"] },
  { href: "/learn", label: "Learn", match: ["/learn"] },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const isActive = (match: string[]) => match.some((m) => pathname.startsWith(m));

  return (
    <header className="border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-6 md:gap-12 min-w-0">
          <Link href="/" aria-label="SHIFT home" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded">
            <ShiftLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {LINKS.map((l) => {
              const active = isActive(l.match);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative px-3 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                    active ? "text-mint" : "text-foreground/75 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-[22px] h-0.5 bg-mint rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-mint text-primary-foreground text-sm font-semibold hover:bg-mint/90 transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
      {/* Mobile strip */}
      <nav className="md:hidden flex items-center justify-around h-10 border-t border-border text-xs">
        {LINKS.map((l) => {
          const active = isActive(l.match);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1 transition-colors ${active ? "text-mint" : "text-foreground/75"}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
