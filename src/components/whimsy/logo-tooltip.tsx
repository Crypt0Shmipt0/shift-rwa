"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";

const MESSAGES = [
  "hey there",
  "buy the dip",
  "no liq, no problem",
  "long & strong",
  "bear or bull?",
  "ngmi without us",
  "size up, sleep tight",
];

/**
 * Wrap the SHIFT logo. After the user hovers for >2s a tiny mint speech
 * bubble slides in next to it with a random message. Picks a fresh
 * message each time it opens. Pointer-events disabled so it never
 * intercepts the underlying link click.
 */
export function LogoTooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const cancelTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    cancelTimer();
    timerRef.current = window.setTimeout(() => {
      // pick a non-repeat message
      let next = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      if (lastMessageRef.current && MESSAGES.length > 1) {
        let guard = 0;
        while (next === lastMessageRef.current && guard < 6) {
          next = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
          guard++;
        }
      }
      lastMessageRef.current = next;
      setMessage(next);
      setOpen(true);
    }, 2000);
  };

  const handleEnter = () => startTimer();
  const handleLeave = () => {
    cancelTimer();
    setOpen(false);
  };

  useEffect(() => () => cancelTimer(), []);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      <AnimatePresence>
        {open && message && (
          <m.span
            key={message}
            initial={{ opacity: 0, x: -6, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.92 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-full bg-mint text-primary-foreground text-[11px] font-semibold px-2.5 py-1 shadow-[0_4px_18px_rgba(38,200,184,0.45)]"
            aria-hidden="true"
          >
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 size-2 rotate-45 bg-mint" />
            {message}
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
}
