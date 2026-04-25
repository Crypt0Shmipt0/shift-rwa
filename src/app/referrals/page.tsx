"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Users, Coins, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HOW_IT_WORKS = [
  {
    Icon: Share2,
    title: "Share your link",
    body: "Copy your unique referral link and share it anywhere — X, Telegram, Discord, or in-person.",
  },
  {
    Icon: Users,
    title: "Friend trades",
    body: "Your referral connects a wallet and completes at least one trade on SHIFT.",
  },
  {
    Icon: Coins,
    title: "You both earn $SHFT",
    body: "You receive 25% of their protocol fees for 90 days. They get a 10% rebate + bonus XP on their first 10 trades.",
  },
];

export default function ReferralsPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const join = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setJoined(true);
    toast.success("You're on the list", {
      description: "We'll ping you when referrals go live.",
    });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      {/* Hero */}
      <div className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            <Share2 className="h-3 w-3" />
            Coming Soon!
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Earn for every friend<br />
            <span className="text-gradient-mint">
              you bring.
            </span>
          </h1>
          <p className="text-base text-muted-foreground max-w-[520px] leading-relaxed mb-6">
            Our referral program rewards you and your friends for growing the SHIFT community.
            Earn 25% of protocol fees + bonus $SHFT XP for every trade your referrals make.
          </p>
          {joined ? (
            <div className="flex items-center gap-2 text-mint text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              You&apos;re on the waitlist.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <Input
                type="email"
                placeholder="you@wallet.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-0 h-12"
              />
              <Button
                onClick={join}
                className="bg-mint text-primary-foreground hover:bg-mint/90 h-12 px-6"
              >
                Join waitlist
              </Button>
            </div>
          )}
        </div>

        <Card className="bg-gradient-to-br from-[#07638C]/40 via-card to-card border-mint/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 rounded-full bg-mint/20 blur-3xl" />
          <div className="relative">
            <div className="size-11 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-mint" />
            </div>
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Estimated launch
            </div>
            <div className="text-lg md:text-xl font-bold text-white mb-3">Q3 2026</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Early waitlist members unlock higher referral tiers and first access to the bonus XP pool.
            </div>
          </div>
        </Card>
      </div>

      {/* How it works */}
      <div className="mb-5 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-mint" />
        <h2 className="text-lg font-semibold text-white">How it works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {HOW_IT_WORKS.map(({ Icon, title, body }, i) => (
          <Card
            key={title}
            className="bg-card border-border rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="text-xs font-mono text-mint mb-2">{String(i + 1).padStart(2, "0")}</div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-mint" />
              <div className="font-semibold text-white text-base">{title}</div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Program parameters are not final. Referral rates and XP bonuses may change before launch.
      </p>
    </div>
  );
}
