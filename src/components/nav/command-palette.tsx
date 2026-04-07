"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { ASSETS } from "@/lib/mock";
import {
  TrendingUp, Wallet, BookOpen, Settings, Trophy, Gift, Share2, Activity, FileText, History, ListTree,
} from "lucide-react";

const NAV = [
  { label: "Markets",     href: "/markets",     icon: ListTree },
  { label: "Portfolio",   href: "/portfolio",   icon: Wallet },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "History",     href: "/history",     icon: History },
  { label: "Rewards",     href: "/rewards",     icon: Gift },
  { label: "Referrals",   href: "/referrals",   icon: Share2 },
  { label: "Learn",       href: "/learn",       icon: BookOpen },
  { label: "Settings",    href: "/settings",    icon: Settings },
  { label: "Status",      href: "/status",      icon: Activity },
  { label: "Terms",       href: "/terms",       icon: FileText },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Jump to anywhere on SHIFT">
      <CommandInput placeholder="Type a command or search assets..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Markets">
          {ASSETS.map((a) => (
            <CommandItem key={a.symbol} onSelect={() => go(`/trade/${a.symbol}`)}>
              <TrendingUp className="h-4 w-4" />
              <span>{a.symbol}</span>
              <span className="text-xs text-muted-foreground ml-2 truncate">{a.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <CommandItem key={n.href} onSelect={() => go(n.href)}>
                <Icon className="h-4 w-4" />
                {n.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
