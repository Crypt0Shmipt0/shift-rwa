"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShiftLogo } from "@/components/nav/shift-logo";

const LINKS = [
  { href: "/trade/TSL2s", label: "Trade" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/portfolio", label: "Portfolio" },
];

export function TopNav() {
  return (
    <header className="h-20 border-b border-border sticky top-0 z-30 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-6 md:gap-12 min-w-0">
          <Link href="/" aria-label="Shift home" className="shrink-0">
            <ShiftLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-foreground/80 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="shrink-0">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </div>
      {/* Mobile nav strip */}
      <nav className="md:hidden flex items-center justify-around h-10 border-t border-border text-xs text-foreground/80">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="px-3 py-1 hover:text-mint transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
