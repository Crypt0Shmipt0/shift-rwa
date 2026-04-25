"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

/**
 * Watches for the user reaching the end of a blog post and slides up a
 * small dismissible mint ribbon. One-shot per slug per browser, stored
 * in localStorage so re-reading the same post doesn't nag.
 */
export function BlogCompletionRibbon({
  slug,
  sentinelSelector = "[data-blog-end]",
}: {
  slug: string;
  sentinelSelector?: string;
}) {
  const [open, setOpen] = useState(false);
  const storageKey = `shift:blog-ribbon:${slug}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(storageKey) === "1") return;
    } catch {
      // ignore
    }

    // Default sentinel: pick the last <p> inside the article body.
    let sentinel = document.querySelector(sentinelSelector) as HTMLElement | null;
    if (!sentinel) {
      const paras = document.querySelectorAll("article p");
      sentinel = paras[paras.length - 1] as HTMLElement | null;
    }
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setOpen(true);
            try {
              window.localStorage.setItem(storageKey, "1");
            } catch {
              // ignore
            }
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [storageKey, sentinelSelector]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="status"
          aria-live="polite"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[92vw]"
        >
          <div className="flex items-center gap-3 rounded-full border border-mint/40 bg-mint/15 backdrop-blur-md text-mint px-4 py-2.5 shadow-[0_10px_40px_rgba(38,200,184,0.25)]">
            <span className="text-base" aria-hidden="true">
              📖
            </span>
            <span className="text-xs sm:text-sm font-medium leading-snug">
              You read the whole thing. Founders read this and think &ldquo;finally someone
              gets it.&rdquo;{" "}
              <a
                href="https://x.com/shiftfinance"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                DM @SHIFTfin
              </a>
              .
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss"
              className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-mint/80 hover:text-mint hover:bg-mint/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
