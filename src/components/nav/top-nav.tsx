"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TopNav() {
  return (
    <header className="h-20 border-b border-border">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl font-semibold tracking-tight"
              style={{
                background: "linear-gradient(90deg, #00cccc, #7cc4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SHIFT
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/trade/TSL2s" className="hover:text-foreground transition-colors">Buy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          </nav>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </div>
    </header>
  );
}
