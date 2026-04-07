import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

const LEADERS = [
  { rank: 1, address: "7xKp...3mN2", pnl: 12450.32, trades: 342, winRate: 78.2 },
  { rank: 2, address: "4fRe...9bQ1", pnl: 9832.15,  trades: 256, winRate: 72.5 },
  { rank: 3, address: "2fs5...5Fx4", pnl: 8721.40,  trades: 198, winRate: 69.8 },
  { rank: 4, address: "9mLk...2wP7", pnl: 6543.21,  trades: 167, winRate: 65.3 },
  { rank: 5, address: "3jHn...8tR5", pnl: 5231.89,  trades: 145, winRate: 62.1 },
  { rank: 6, address: "8vCx...1qZ9", pnl: 4321.55,  trades: 132, winRate: 60.6 },
  { rank: 7, address: "5dEr...7yU3", pnl: 3987.10,  trades: 118, winRate: 58.4 },
  { rank: 8, address: "1aSw...4kL6", pnl: 3412.66,  trades: 102, winRate: 56.8 },
];

const RANK_ICON: Record<number, React.ReactNode> = {
  1: <Trophy className="h-4 w-4 text-yellow-400" />,
  2: <Medal className="h-4 w-4 text-slate-300" />,
  3: <Award className="h-4 w-4 text-amber-600" />,
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[1024px] px-6 md:px-[60px] py-10">
      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top traders by realized PnL this season.</p>
        </div>
        <div className="flex items-center gap-2 bg-card rounded-full p-1 text-xs font-medium">
          {["24H", "7D", "30D", "ALL"].map((r, i) => (
            <button
              key={r}
              className={`px-4 py-2 rounded-full transition-colors ${
                i === 2 ? "bg-mint text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-card border-border rounded-3xl overflow-hidden p-0">
        <div className="hidden sm:flex items-center px-8 py-6 text-xs text-muted-foreground uppercase tracking-wider">
          <div className="w-20">Rank</div>
          <div className="flex-1">Trader</div>
          <div className="w-44 text-right">PnL (USDC)</div>
          <div className="w-32 text-right">Trades</div>
          <div className="w-28 text-right">Win Rate</div>
        </div>
        <div className="border-t border-border">
          {LEADERS.map((l, i) => (
            <div
              key={l.rank}
              className={`flex items-center gap-4 sm:gap-0 px-6 sm:px-8 py-5 hover:bg-secondary/40 transition-colors ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="w-12 sm:w-20 flex items-center gap-2 text-white font-semibold tabular-nums">
                {RANK_ICON[l.rank] ?? <span className="text-muted-foreground">#</span>}
                <span>{l.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-mint text-sm font-mono truncate">{l.address}</div>
                <div className="sm:hidden text-xs text-muted-foreground tabular-nums mt-1">
                  +${l.pnl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · {l.trades} trades · {l.winRate}%
                </div>
              </div>
              <div className="hidden sm:block w-44 text-right text-mint text-sm font-semibold tabular-nums">
                +${l.pnl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="hidden sm:block w-32 text-right text-white text-sm tabular-nums">{l.trades}</div>
              <div className="hidden sm:block w-28 text-right text-white text-sm tabular-nums">{l.winRate}%</div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Rankings update every 5 minutes. Connect a wallet to enter.
      </p>
    </div>
  );
}
