"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { ShiftLogo } from "@/components/nav/shift-logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

const LINKS = [
  { href: "/markets", label: "Markets", match: ["/trade", "/markets"] },
  { href: "/portfolio", label: "Portfolio", match: ["/portfolio", "/history"] },
  { href: "/leaderboard", label: "Leaderboard", match: ["/leaderboard"] },
  { href: "/rewards", label: "Rewards", match: ["/rewards"] },
  { href: "/learn", label: "Learn", match: ["/learn"] },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const motionOk = useMotionOk();
  const isActive = (match: string[]) => match.some((m) => pathname.startsWith(m));

  return (
    <header className="border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-6 md:gap-12 min-w-0">
          <Link href="/" aria-label="SHIFT home" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded">
            <ShiftLogo />
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 text-sm">
            {LINKS.map((l) => {
              const active = isActive(l.match);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                    active ? "text-mint" : "text-foreground/75 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active && motionOk ? (
                    <m.span
                      className="absolute left-3 right-3 -bottom-[22px] h-0.5 bg-mint rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      style={{ transformOrigin: "left" }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    />
                  ) : active ? (
                    <span className="absolute left-3 right-3 -bottom-[22px] h-0.5 bg-mint rounded-full" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/app"
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-mint text-primary-foreground text-sm font-semibold hover:bg-mint/90 transition-colors"
          >
            Launch App
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center size-11 -mr-1 rounded-lg text-foreground/75 hover:text-white hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-haspopup="dialog"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent id="mobile-nav" side="right" className="w-full max-w-xs bg-background border-border p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <Link href="/" onClick={() => setMobileOpen(false)} aria-label="SHIFT home">
              <ShiftLogo />
            </Link>
          </SheetHeader>

          <nav aria-label="Mobile navigation" className="flex-1 flex flex-col px-4 py-6 gap-1">
            {LINKS.map((l) => {
              const active = isActive(l.match);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "bg-mint/10 text-mint"
                      : "text-foreground/75 hover:text-white hover:bg-secondary/60"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-6">
            <Link
              href="/app"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center h-11 w-full rounded-full bg-mint text-primary-foreground text-sm font-semibold hover:bg-mint/90 transition-colors"
            >
              Launch App
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
