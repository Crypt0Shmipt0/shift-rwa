"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { m } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import type { BlogTag } from "@/data/blog-posts";

const FILTERS: { label: string; value: BlogTag | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Signal", value: "signal" },
  { label: "Academy", value: "academy" },
  { label: "RWA Market", value: "general" },
];

// Mint pill is the brand-canonical "active" treatment for `all` and `signal`;
// academy and general get accent variants. Pill colour swaps via Tailwind
// classes — the layoutId animation is colour-blind, just morphs the shape.
const PILL_ACTIVE_BG: Record<BlogTag | "all", string> = {
  all: "bg-mint",
  signal: "bg-mint",
  academy: "bg-[#4CC8E8]",
  general: "bg-white",
};

const PILL_ACTIVE_TEXT: Record<BlogTag | "all", string> = {
  all: "text-primary-foreground",
  signal: "text-primary-foreground",
  academy: "text-[#021C24]",
  general: "text-[#021C24]",
};

const PILL_INACTIVE =
  "text-foreground/55 border border-border/50 hover:border-foreground/40 hover:text-foreground/80";

export function TagFilter({ active }: { active: BlogTag | "all" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const motionOk = useMotionOk();

  function handleClick(value: BlogTag | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("tag");
    } else {
      params.set("tag", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            aria-pressed={isActive}
            className={`relative text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-150 ${
              isActive ? PILL_ACTIVE_TEXT[value] : PILL_INACTIVE
            }`}
          >
            {/* Shared-layout active pill — morphs between filter buttons. */}
            {isActive && motionOk ? (
              <m.span
                layoutId="tag-pill"
                className={`absolute inset-0 rounded-full ${PILL_ACTIVE_BG[value]}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : isActive ? (
              <span
                aria-hidden
                className={`absolute inset-0 rounded-full ${PILL_ACTIVE_BG[value]}`}
              />
            ) : null}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
