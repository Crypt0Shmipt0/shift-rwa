"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ALLOCATION } from "@/lib/mock";

export function AllocationDonut() {
  return (
    <Card className="bg-card border-border rounded-2xl p-6 col-span-12 lg:col-span-4 flex flex-col">
      <h3 className="font-semibold text-lg mb-2">Asset Allocation</h3>
      <div className="relative flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ALLOCATION}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
            >
              {ALLOCATION.map((a) => (
                <Cell key={a.symbol} fill={a.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-muted-foreground">Asset</div>
          <div className="text-sm font-semibold">Holdings</div>
        </div>
      </div>
      <ul className="space-y-2 mt-4">
        {ALLOCATION.map((a) => (
          <li key={a.symbol} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: a.color }} />
              {a.symbol}
            </span>
            <span className="tabular-nums text-muted-foreground">{a.value}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
