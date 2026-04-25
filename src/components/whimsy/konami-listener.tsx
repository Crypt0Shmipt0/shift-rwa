"use client";

import { useCallback, useState } from "react";
import { useKonami } from "@/hooks/use-konami";
import { KonamiOverlay } from "./konami-overlay";

/**
 * Site-wide Konami code mount. Lives in the root layout so the
 * ↑↑↓↓←→←→BA sequence works on every route. When triggered, it
 * pops open the SHIFT Runner overlay. Escape (handled in the overlay)
 * closes it.
 */
export function KonamiListener() {
  const [open, setOpen] = useState(false);

  const onKonami = useCallback(() => {
    setOpen(true);
    if (typeof console !== "undefined") {
      // Console signature for finders.
      // eslint-disable-next-line no-console
      console.log(
        "%c⬆⬆⬇⬇⬅➡⬅➡BA  SHIFT RUNNER unlocked",
        "color:#26C8B8;font-family:monospace;font-weight:bold",
      );
    }
  }, []);

  useKonami(onKonami);

  return <KonamiOverlay open={open} onClose={() => setOpen(false)} />;
}
