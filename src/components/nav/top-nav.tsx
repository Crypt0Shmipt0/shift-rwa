"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShiftLogo } from "@/components/nav/shift-logo";

export function TopNav() {
  return (
    <header className="h-20 border-b border-border">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" aria-label="Shift home">
            <ShiftLogo />
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/trade/TSL2s" className="text-mint hover:opacity-80 transition-opacity">Trade</Link>
            <Link href="#" className="text-foreground/80 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/portfolio" className="text-foreground/80 hover:text-white transition-colors">Portfolio</Link>
          </nav>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </div>
    </header>
  );
}
