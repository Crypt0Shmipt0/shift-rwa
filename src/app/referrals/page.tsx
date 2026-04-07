"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Users, Coins, Copy, Check, Mail } from "lucide-react";

export default function ReferralsPage() {
  const [link] = useState("https://shift.finance/r/7xKp3mN2");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const tweet = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Trade tokenized stocks 24/7 on @SHIFTfinance — use my link to get a fee rebate on your first trade.",
      )}&url=${encodeURIComponent(link)}`,
      "_blank",
    );

  const mailto = () => (window.location.href = `mailto:?subject=Trade%20on%20SHIFT&body=${encodeURIComponent(link)}`);

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-[72px] py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white mb-2">Referrals</h1>
        <p className="text-sm text-muted-foreground">
          Share SHIFT with a friend. When they trade, you both earn a rebate.
        </p>
      </div>

      {/* Your link */}
      <Card className="bg-card border-border rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
          <Share2 className="h-3 w-3" />
          Your referral link
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input readOnly value={link} className="bg-secondary border-0 h-12 font-mono text-sm" />
          <Button onClick={copy} className="bg-mint text-primary-foreground hover:bg-mint/90 h-12 px-6">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" className="border-border bg-secondary" onClick={tweet}>
            <Share2 className="h-4 w-4" />
            Share on X
          </Button>
          <Button variant="outline" className="border-border bg-secondary" onClick={mailto}>
            <Mail className="h-4 w-4" />
            Send via email
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Invited" value="12" />
        <StatCard icon={Users} label="Converted" value="4" />
        <StatCard icon={Coins} label="Earned (USDC)" value="$284.50" />
        <StatCard icon={Coins} label="Claimable" value="$42.12" />
      </div>

      {/* How it works */}
      <Card className="bg-card border-border rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Step n="01" title="Share your link" body="Copy your unique referral link and post it anywhere — X, Telegram, email, in-person." />
          <Step n="02" title="They trade" body="Your invitee connects a wallet and completes at least one trade on SHIFT." />
          <Step n="03" title="You both earn" body="You receive 25% of their protocol fees for 90 days. They get a 10% rebate on their first 10 trades." />
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="bg-card border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-mint" />
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
    </Card>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-mono text-mint mb-3">{n}</div>
      <div className="font-semibold text-white mb-2">{title}</div>
      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
    </div>
  );
}
