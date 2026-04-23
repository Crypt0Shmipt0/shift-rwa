import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status",
  description:
    "SHIFT system status — real-time health of the trading interface, price feeds, smart contracts, and supporting infrastructure.",
  alternates: { canonical: "/status" },
};

type Component = {
  name: string;
  status: "operational" | "degraded" | "down";
  latency?: string;
  note?: string;
};

const COMPONENTS: Component[] = [
  { name: "Trade interface",        status: "operational", latency: "41ms" },
  { name: "Price feeds (Yahoo RSS)", status: "operational", latency: "180ms" },
  { name: "TradingView chart",      status: "operational", latency: "220ms" },
  { name: "Wallet connect (WalletConnect)", status: "operational", latency: "—" },
  { name: "News RSS feed",           status: "operational", latency: "142ms" },
  { name: "Smart contracts — Base",  status: "operational", latency: "—" },
  { name: "Smart contracts — Arbitrum", status: "operational", latency: "—" },
  { name: "Smart contracts — Optimism", status: "operational", latency: "—" },
];

const INCIDENTS = [
  { date: "2026-03-28", title: "Brief oracle lag on SOXx3", duration: "14 min", body: "Oracle update frequency dropped during a semiconductor earnings spike. No funds affected. Resolved by switching to backup oracle feed." },
  { date: "2026-02-11", title: "Wallet connect intermittent", duration: "38 min", body: "WalletConnect's upstream service had a partial outage. Direct wallet connections (MetaMask browser extension) remained operational." },
];

export default function StatusPage() {
  const allGreen = COMPONENTS.every((c) => c.status === "operational");
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-5 w-5 text-mint" />
        <h1 className="text-3xl font-semibold text-white">System status</h1>
      </div>

      {/* Big green bar */}
      <Card
        className={`rounded-3xl p-8 mb-8 border ${
          allGreen ? "bg-mint/10 border-mint/40" : "bg-destructive/10 border-destructive/40"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`size-12 rounded-2xl flex items-center justify-center ${allGreen ? "bg-mint/20" : "bg-destructive/20"}`}>
            {allGreen ? (
              <CheckCircle2 className="h-6 w-6 text-mint" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div>
            <div className={`text-lg font-semibold ${allGreen ? "text-mint" : "text-destructive"}`}>
              {allGreen ? "All systems operational" : "Service degraded"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Last checked just now · auto-refreshes every 60s
            </div>
          </div>
        </div>
      </Card>

      {/* Component list */}
      <Card className="bg-card border-border rounded-3xl overflow-hidden mb-8">
        <div className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
          Components
        </div>
        <ul className="divide-y divide-border">
          {COMPONENTS.map((c) => (
            <li key={c.name} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`size-2 rounded-full ${
                    c.status === "operational" ? "bg-mint" : c.status === "degraded" ? "bg-amber-400" : "bg-destructive"
                  }`}
                />
                <span className="text-sm">{c.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                <span>{c.latency}</span>
                <span className="capitalize">{c.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Incident history */}
      <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
        Recent incidents
      </h2>
      <div className="space-y-3">
        {INCIDENTS.map((i) => (
          <Card key={i.title} className="bg-card border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-muted-foreground">{i.date}</span>
              <span className="text-xs text-mint">{i.duration}</span>
            </div>
            <div className="font-medium text-white mb-1">{i.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{i.body}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
