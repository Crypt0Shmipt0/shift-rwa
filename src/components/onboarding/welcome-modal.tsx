"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Sparkles, LineChart, ShieldCheck, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    icon: Sparkles,
    title: "Stocks on-chain, finally worth trading.",
    body: "Spot stocks move 1% a day — boring. Perps liquidate you on a 5% wick — terrifying. SHIFT fixes both: 3× and 2× leveraged tokens that give you real volatility without liquidation risk.",
  },
  {
    icon: LineChart,
    title: "Bi-directional, professionally tokenized.",
    body: "Every market ships with a long AND a short side. Buy TSL2s for 2× Tesla upside, or TSLSs to short. No margin account, no funding rate surprises, no liquidation cascades. Professional tokenized ETFs and ETNs, on-chain.",
  },
  {
    icon: ShieldCheck,
    title: "Daily-targeted, decay-aware.",
    body: "Returns target the daily move of the underlying. Over many days, compounding can diverge from a simple 2× or 3× calculation. Read the Risk Disclaimer before trading.",
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
