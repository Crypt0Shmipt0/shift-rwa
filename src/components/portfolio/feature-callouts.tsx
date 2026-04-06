import { Card } from "@/components/ui/card";
import { Zap, Gift } from "lucide-react";

export function FeatureCallouts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-card border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-mint/15 flex items-center justify-center">
            <Zap className="h-6 w-6 text-mint" />
          </div>
          <h3 className="text-lg font-semibold">Boost Your Trading</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          RFQ available 24/7. Stay active to unlock improved execution and opportunities.
        </p>
      </Card>
      <Card className="bg-card border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-mint/15 flex items-center justify-center">
            <Gift className="h-6 w-6 text-mint" />
          </div>
          <h3 className="text-lg font-semibold">Upcoming Rewards</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our rewards program is launching soon. Trade, hold, and stay active to start earning.
        </p>
      </Card>
    </div>
  );
}
