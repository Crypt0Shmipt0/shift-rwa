"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Sparkles, LineChart, ShieldCheck, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    icon: Sparkles,
    title: "Welcome to Shift",
    body: "Trade leveraged tokens tied to real-world assets — stocks, ETFs, commodities — on-chain. No brokerage account, no settlement delays.",
  },
  {
    icon: LineChart,
    title: "How it works",
    body: "Each Shift token tracks a daily leveraged or inverse return against its underlying. TSL2s moves roughly 2× Tesla's daily change. Rebalance is automatic, on-chain.",
  },
  {
    icon: ShieldCheck,
    title: "Know the risks",
    body: "Leveraged products target daily returns, not long-term returns. Compounding over multiple days can produce outcomes that differ materially from the underlying. Only trade what you can afford to lose.",
  },
];

export function WelcomeModal() {
  const [seen, setSeen] = useLocalStorage("shift:welcomeSeen", false);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [seen]);

  const slide = SLIDES[idx];
  const Icon = slide.icon;
  const last = idx === SLIDES.length - 1;

  const next = () => {
    if (last) {
      setSeen(true);
      setOpen(false);
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSeen(true); setOpen(v); }}>
      <DialogContent className="bg-card border-border sm:max-w-md p-0 overflow-hidden">
        <div className="p-8">
          <div className="size-14 rounded-2xl bg-mint/15 border border-mint/30 flex items-center justify-center mb-6">
            <Icon className="h-6 w-6 text-mint" />
          </div>
          <DialogHeader className="text-left space-y-3">
            <DialogTitle className="text-2xl font-semibold">{slide.title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {slide.body}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-mint" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
            <Button onClick={next} className="bg-mint text-primary-foreground hover:bg-mint/90">
              {last ? "Start trading" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
