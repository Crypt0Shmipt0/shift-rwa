"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const join = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setJoined(true);
    toast.success("You're on the list", {
      description: "We'll ping you when the leaderboard goes live.",
    });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      {/* Hero */}
      <div className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            <Trophy className="h-3 w-3" />
            Coming Soon!
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            The SHIFT Leaderboard
          </h1>
          <p className="text-base text-muted-foreground max-w-[520px] leading-relaxed mb-6">
            Compete in weekly trading competitions ranked by realized PnL, win rate, and trade volume.
            Top traders earn $SHFT rewards, badge upgrades, and bragging rights on-chain.
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
          <div className="mt-6">
            <Link
              href="/markets"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-mint transition-colors"
            >
              Explore markets →
            </Link>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-[#07638C]/40 via-card to-card border-mint/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 rounded-full bg-mint/20 blur-3xl" />
          <div className="relative">
            <div className="size-11 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center mb-3">
              <Trophy className="h-5 w-5 text-mint" />
            </div>
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Estimated launch
            </div>
            <div className="text-lg md:text-xl font-bold text-white mb-3">Q3 2026</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Weekly competitions with $SHFT prize pools. Connect a wallet to enter when live.
            </div>
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-10">
        Competition parameters are not final. Prize pools and rules may change before launch.
      </p>
    </div>
  );
}
