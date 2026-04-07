"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShiftLogo } from "@/components/nav/shift-logo";
import { CommandPalette } from "@/components/nav/command-palette";
import { Search } from "lucide-react";

const LINKS = [
  { href: "/trade/TSL2s", label: "Trade", match: ["/trade", "/markets"] },
  { href: "/leaderboard", label: "Leaderboard", match: ["/leaderboard"] },
  { href: "/portfolio", label: "Portfolio", match: ["/portfolio", "/history"] },
  { href: "/learn", label: "Learn", match: ["/learn"] },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const isActive = (match: string[]) => match.some((m) => pathname.startsWith(m));

  return (
    <header className="h-20 border-b border-border sticky top-0 z-30 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 gap-4">
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
          <CmdButton />
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
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
      <CommandPalette />
    </header>
  );
}

function CmdButton() {
  return (
    <button
      onClick={() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
      }}
      className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-mint/40 transition-colors"
      aria-label="Open command palette"
    >
      <Search className="h-3.5 w-3.5" />
      <span>Search</span>
      <kbd className="hidden lg:inline font-mono bg-card px-1.5 py-0.5 rounded border border-border text-[10px]">⌘K</kbd>
    </button>
  );
}
