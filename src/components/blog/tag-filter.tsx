"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { BlogTag } from "@/data/blog-posts";

const FILTERS: { label: string; value: BlogTag | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Signal", value: "signal" },
  { label: "Academy", value: "academy" },
  { label: "General", value: "general" },
];

const PILL_ACTIVE: Record<BlogTag | "all", string> = {
  all: "bg-mint text-primary-foreground border-mint",
  signal: "bg-mint text-primary-foreground border-mint",
  academy: "bg-[#4CC8E8] text-[#021C24] border-[#4CC8E8]",
  general: "bg-white text-[#021C24] border-white",
};

const PILL_INACTIVE =
  "bg-transparent text-foreground/55 border-border/50 hover:border-foreground/40 hover:text-foreground/80";

export function TagFilter({ active }: { active: BlogTag | "all" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors duration-150 ${
            active === value ? PILL_ACTIVE[value] : PILL_INACTIVE
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
