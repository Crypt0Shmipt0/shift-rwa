"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useScrollMilestones } from "@/hooks/use-scroll-milestones";
import { CursorTrail } from "@/components/whimsy/cursor-trail";

/**
 * Mounts whimsy listeners that decorate the landing page:
 *   • Cursor sparkler trail inside the hero zone
 *   • Scroll milestones — subtle XP-style toasts at major sections
 *
 * The Konami easter egg moved to the global `<KonamiListener />` mount in
 * `app/layout.tsx` — it now opens the SHIFT Runner mini-game overlay on
 * every route, not just the landing page.
 */
export function LandingWhimsy() {
  // Scroll milestones — fire once per visitor.
  useScrollMilestones([
    {
      id: "thesis-found",
      selector: "[data-milestone='thesis']",
      onReach: () =>
        toast("🎯 You found the thesis. +50 XP", {
          position: "bottom-right",
          duration: 2400,
        }),
    },
    {
      id: "partners-roster",
      selector: "[data-milestone='partners']",
      onReach: () =>
        toast("🤝 Solid roster. +100 XP", {
          position: "bottom-right",
          duration: 2400,
        }),
    },
    {
      id: "team-squad",
      selector: "[data-milestone='team']",
      onReach: () =>
        toast("👀 The squad. +75 XP", {
          position: "bottom-right",
          duration: 2400,
        }),
    },
    {
      id: "footer-bottom",
      selector: "[data-milestone='footer']",
      onReach: () =>
        toast("🏆 Bottom of the page. You're early. +500 XP", {
          position: "bottom-right",
          duration: 3200,
          className: "!border-mint/50",
        }),
    },
  ]);

  // Tag late-arriving milestone targets we can't decorate at the source
  // (partners.tsx is locked; the global footer lives in the layout).
  useEffect(() => {
    if (typeof document === "undefined") return;

    const footer = document.querySelector("footer");
    if (footer && !footer.hasAttribute("data-milestone")) {
      footer.setAttribute("data-milestone", "footer");
    }

    // Partners section: the only <section> with the bordered backers wall.
    const partnersHeading = Array.from(document.querySelectorAll("p,span,div")).find(
      (el) =>
        el.textContent?.trim().toLowerCase() === "backed by" &&
        (el.className || "").toString().includes("uppercase")
    );
    const partnersSection = partnersHeading?.closest("section");
    if (partnersSection && !partnersSection.hasAttribute("data-milestone")) {
      partnersSection.setAttribute("data-milestone", "partners");
    }
  }, []);

  return <CursorTrail />;
}
