"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Zap, Trophy, Gift, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren, RevealChild } from "@/components/motion/stagger-children";

const BADGES = [
  { name: "Navigator",  min: 0,      perks: ["Market execution", "Standard fees", "1× XP"] },
  { name: "Operator",   min: 10_000, perks: ["Tighter spreads", "-10% fees", "2× XP", "Early features"] },
  { name: "Strategist", min: 50_000, perks: ["Priority fills", "-25% fees", "3× XP", "Direct desk access"] },
  { name: "Sovereign",  min: 250_000, perks: ["VIP fills + OTC desk", "-50% fees", "5× XP", "Custom OTC", "Private chat"] },
];

export default function RewardsPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const reactId = useId();
  const emailId = `rewards-email-${reactId}`;
  const helpId = `rewards-email-help-${reactId}`;

  const join = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setJoined(true);
    toast.success("You're on the list", { description: "We'll ping you at TGE." });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      {/* Hero */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-mint/15 border border-mint/30 text-mint text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            <Sparkles className="h-3 w-3" />
            Now live · Waitlist open
          </span>
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Earn from every <span className="text-mint">shift</span>.
            </h1>
          </Reveal>
          <p className="text-base text-muted-foreground max-w-[520px] leading-relaxed mb-8">
            Every trade earns on-chain XP. XP unlocks fee rebates, tighter spreads, and a bigger
            $SHFT allocation at TGE. The earlier you start, the more you earn.
          </p>
          {joined ? (
            <div className="flex items-center gap-2 text-mint text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              You&apos;re on the waitlist.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <label htmlFor={emailId} className="sr-only">
                Email address
              </label>
              <Input
                id={emailId}
                type="email"
                placeholder="you@wallet.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={helpId}
                className="bg-secondary border-0 h-12"
              />
              <p id={helpId} className="sr-only">
                We&apos;ll notify you at TGE about your $SHFT allocation and rewards program access.
              </p>
              <Button onClick={join} className="bg-mint text-primary-foreground hover:bg-mint/90 h-12 px-6">
                Notify me at TGE
              </Button>
            </div>
          )}
        </div>
        <Card className="bg-gradient-to-br from-[#07638C]/40 via-card to-card border-mint/30 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 rounded-full bg-mint/20 blur-3xl" />
          <div className="relative">
            <Trophy className="h-10 w-10 text-mint mb-4" />
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Farm status</div>
            <div className="text-2xl font-bold text-white mb-4">Points accruing now</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Full redemption program launches Q3 2026. Early traders get 2× XP and first access to
              the OTC desk.
            </div>
          </div>
        </Card>
      </div>

      {/* Badges */}
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-4 w-4 text-mint" />
        <h2 className="text-xl font-semibold text-white">Badges</h2>
      </div>
      <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {BADGES.map((t, i) => (
          <RevealChild key={t.name}>
            <Card
              className={`bg-card border rounded-2xl p-4 md:p-6 relative overflow-hidden h-full ${
                i === 0 ? "border-border" : "border-border hover:border-mint/30 transition-colors"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-muted-foreground font-mono">BADGE {String(i + 1).padStart(2, "0")}</div>
                <Gift className="h-4 w-4 text-mint/60" />
              </div>
              <div className="text-xl font-bold text-white mb-1">{t.name}</div>
              <div className="text-xs text-muted-foreground mb-5">
                {t.min === 0 ? "Start here" : `${t.min.toLocaleString()}+ XP`}
              </div>
              <ul className="space-y-2">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="h-3 w-3 text-mint mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </RevealChild>
        ))}
      </StaggerChildren>

      <p className="text-xs text-muted-foreground text-center mt-10">
        Program parameters are not final. Badges, XP rates, and rebates may change before launch.
      </p>
    </div>
  );
}
