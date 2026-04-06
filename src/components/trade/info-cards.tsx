import { Card } from "@/components/ui/card";
import { INTELLIGENCE } from "@/lib/mock";
import { ArrowUpRight, BookOpen, Newspaper, Sparkles } from "lucide-react";

export function EducationCard() {
  return (
    <Card className="bg-card border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-mint" />
          <h3 className="font-semibold">Where is Education Tab / TSL2s?</h3>
        </div>
        <a href="#" className="text-xs text-mint flex items-center gap-1">Explore <ArrowUpRight className="h-3 w-3" /></a>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Learn how leveraged tokenized assets work, what risks are involved, and how SHIFT
        rebalances exposure on chain to track the underlying.
      </p>
    </Card>
  );
}

export function MarketNewsCard() {
  return (
    <Card className="bg-card border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-mint" />
          <h3 className="font-semibold">Did: Electronic</h3>
        </div>
        <a href="#" className="text-xs text-mint flex items-center gap-1">Read more <ArrowUpRight className="h-3 w-3" /></a>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Tesla beats delivery estimates as the EV maker pushes deeper into autonomy. Wall
        Street sets fresh price targets ahead of next earnings call.
      </p>
    </Card>
  );
}

export function IntelligenceCard() {
  return (
    <Card className="bg-card border-border rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-5 w-5 text-mint" />
        <h3 className="font-semibold">Intelligence</h3>
      </div>
      <ul className="space-y-4">
        {INTELLIGENCE.map((item) => (
          <li key={item.title} className="flex gap-3 group cursor-pointer">
            <div className="h-12 w-12 rounded-lg bg-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug group-hover:text-mint transition-colors line-clamp-2">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.source}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
