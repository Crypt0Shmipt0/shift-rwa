"use client";

import { useCallback, useEffect, useState } from "react";
import { useKonami } from "@/hooks/use-konami";
import { useShake } from "@/hooks/use-shake";
import { KonamiOverlay } from "./konami-overlay";

/**
 * Site-wide SHIFT Runner unlock. Lives in the root layout so triggers
 * work on every route. Three unlock paths:
 *   1. Konami code on keyboard (↑↑↓↓←→←→BA)
 *   2. Shake the phone 3× (mobile)
 *   3. Custom event "shift:open-runner" — dispatched by the
 *      orbiting-token "pop all 6" easter egg in token-orb.tsx
 * ESC closes (handled by the overlay).
 */
export function KonamiListener() {
  const [open, setOpen] = useState(false);

  const onTrigger = useCallback((source: string) => {
    setOpen(true);
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log(
        `%c⬆⬆⬇⬇⬅➡⬅➡BA  SHIFT RUNNER unlocked  · ${source}`,
        "color:#26C8B8;font-family:monospace;font-weight:bold",
      );
    }
  }, []);

  useKonami(() => onTrigger("konami"));
  useShake(() => onTrigger("shake"));

  // Custom event so any component (e.g. the token-orb pop game) can
  // open the overlay without knowing about this file.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => onTrigger("event");
    window.addEventListener("shift:open-runner", handler);
    return () => window.removeEventListener("shift:open-runner", handler);
  }, [onTrigger]);

  return <KonamiOverlay open={open} onClose={() => setOpen(false)} />;
}
