"use client";

import { useEffect, useRef } from "react";

/**
 * Listens for the classic Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.
 * Fires `callback` once per successful entry. Resets on any
 * non-matching key. Ignores keypresses inside form fields so it
 * doesn't fight with normal input.
 */
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(callback: () => void) {
  const positionRef = useRef(0);
  const callbackRef = useRef(callback);

  // Keep latest callback without re-binding the listener.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const expected = KONAMI_SEQUENCE[positionRef.current];
      const key = expected.length === 1 ? e.key.toLowerCase() : e.key;

      if (key === expected) {
        positionRef.current += 1;
        if (positionRef.current === KONAMI_SEQUENCE.length) {
          positionRef.current = 0;
          callbackRef.current();
        }
      } else {
        // Allow the first arrow up to immediately re-start the sequence.
        // Compare against raw e.key (not the lowercased variant) since
        // KONAMI_SEQUENCE[0] is "ArrowUp", not "arrowup".
        positionRef.current = e.key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
