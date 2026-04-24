"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { useMotionOk } from "@/hooks/use-motion-ok";

/** The 4 stat nodes shared between desktop and marquee layouts */
function StatNodes() {
  return (
    <>
      <Reveal delay={0}>
        <TractionStatAnimated countTo={2} prefix="$" suffix="M" label="Seed Closed" />
      </Reveal>
      <Divider />
      <Reveal delay={0.08}>
        <TractionStatAnimated countTo={40} prefix="$" suffix="M+" label="Liquidity Raised" />
      </Reveal>
      <Divider />
      <TractionStat value="24/7" label="Permissionless" />
      <Divider />
      <TractionStat value="Chainlink" label="Proof-of-Reserves" />
    </>
  );
}

export function LandingTractionStrip() {
  const motionOk = useMotionOk();

  return (
    <section className="border-b border-border/60 bg-background/60 backdrop-blur-sm overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 py-5">
        {/* Desktop / tablet — static flex row */}
        <div className="hidden sm:flex items-center justify-center gap-x-8 gap-y-4 text-sm flex-wrap">
          <StatNodes />
        </div>

        {/* Mobile — marquee when motion is ok, static stack otherwise */}
        {motionOk ? (
          <div className="sm:hidden relative overflow-hidden">
            {/* Two copies for seamless loop */}
            <div
              className="flex items-center gap-10 text-sm whitespace-nowrap"
              style={{ animation: "traction-scroll 20s linear infinite", width: "max-content" }}
            >
              <StatNodes />
              {/* duplicate */}
              <TractionStatAnimated countTo={2} prefix="$" suffix="M" label="Seed Closed" />
              <Divider />
              <TractionStatAnimated countTo={40} prefix="$" suffix="M+" label="Liquidity Raised" />
              <Divider />
              <TractionStat value="24/7" label="Permissionless" />
              <Divider />
              <TractionStat value="Chainlink" label="Proof-of-Reserves" />
            </div>
          </div>
        ) : (
          <div className="sm:hidden flex flex-col gap-4 text-sm">
            <TractionStatAnimated countTo={2} prefix="$" suffix="M" label="Seed Closed" />
            <TractionStatAnimated countTo={40} prefix="$" suffix="M+" label="Liquidity Raised" />
            <TractionStat value="24/7" label="Permissionless" />
            <TractionStat value="Chainlink" label="Proof-of-Reserves" />
          </div>
        )}
      </div>
    </section>
  );
}

function TractionStatAnimated({
  countTo,
  prefix,
  suffix,
  label,
}: {
  countTo: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-bold text-white text-base">
        <CountUp to={countTo} prefix={prefix} suffix={suffix} duration={1.5} />
      </span>
      <span className="text-foreground/60 text-xs uppercase tracking-wider">{label}</span>
    </span>
  );
}

function TractionStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-bold text-white text-base">{value}</span>
      <span className="text-foreground/60 text-xs uppercase tracking-wider">{label}</span>
    </span>
  );
}

function Divider() {
  return <span className="size-1 rounded-full bg-border hidden sm:block" />;
}
