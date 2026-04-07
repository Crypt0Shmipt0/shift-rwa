"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/lib/use-local-storage";
import { toast } from "sonner";
import { Cog, BellRing, Coins, ShieldCheck, Trash2 } from "lucide-react";

const SLIPPAGE_PRESETS = [0.1, 0.5, 1];

export default function SettingsPage() {
  const [slippage, setSlippage] = useLocalStorage<number>("shift:slippage", 0.5);
  const [currency, setCurrency] = useLocalStorage<string>("shift:currency", "USD");
  const [priceAlerts, setPriceAlerts] = useLocalStorage<boolean>("shift:alerts", true);
  const [newsDigest, setNewsDigest] = useLocalStorage<boolean>("shift:news", true);
  const [reducedMotion, setReducedMotion] = useLocalStorage<boolean>("shift:reducedMotion", false);

  const resetAll = () => {
    if (typeof window === "undefined") return;
    ["shift:welcomeSeen", "shift:slippage", "shift:currency", "shift:alerts", "shift:news", "shift:reducedMotion", "shift:riskAck"].forEach((k) =>
      window.localStorage.removeItem(k),
    );
    toast.success("Local settings reset", { description: "Reload the page to see the welcome flow again." });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences are stored locally on this device.</p>
      </div>

      <div className="space-y-6">
        <Section icon={Cog} title="Trade defaults">
          <Row label="Slippage tolerance" help="Max price movement between quote and fill.">
            <div className="flex items-center gap-2 flex-wrap">
              {SLIPPAGE_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSlippage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium tabular-nums transition-colors ${
                    slippage === p
                      ? "bg-mint/15 text-mint border border-mint"
                      : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  {p}%
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={slippage}
                  onChange={(e) =>
                    setSlippage(Math.min(50, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="w-24 bg-secondary rounded-lg px-3 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-mint"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </Row>

          <Row label="Display currency" help="Primary currency across balances and charts.">
            <Select value={currency} onValueChange={(v) => setCurrency(v ?? "USD")}>
              <SelectTrigger className="w-32 bg-secondary border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Section>

        <Section icon={BellRing} title="Notifications">
          <Row label="Price alerts" help="Toasts when watchlist assets hit a threshold.">
            <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
          </Row>
          <Row label="Daily news digest" help="Summary of RSS headlines per held asset.">
            <Switch checked={newsDigest} onCheckedChange={setNewsDigest} />
          </Row>
        </Section>

        <Section icon={ShieldCheck} title="Accessibility">
          <Row label="Reduce motion" help="Disables animated transitions and scroll effects.">
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </Row>
        </Section>

        <Section icon={Coins} title="Wallet">
          <p className="text-sm text-muted-foreground">
            Manage chains, connected wallets, and session in the Connect Wallet menu at the top right.
          </p>
        </Section>

        <Section icon={Trash2} title="Reset">
          <p className="text-sm text-muted-foreground mb-3">
            Clear all locally stored preferences. Your wallet connection and on-chain activity are unaffected.
          </p>
          <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={resetAll}>
            Reset local settings
          </Button>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card border-border rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-9 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center">
          <Icon className="h-4 w-4 text-mint" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}

function Row({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {help && <div className="text-xs text-muted-foreground mt-0.5">{help}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
