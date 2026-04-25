"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useKonami } from "@/hooks/use-konami";
import { useScrollMilestones } from "@/hooks/use-scroll-milestones";
import { CursorTrail } from "@/components/whimsy/cursor-trail";

/**
 * Mounts whimsy listeners that decorate the landing page:
 *   • Cursor sparkler trail inside the hero zone
 *   • Konami code easter egg (toggles `data-bull-mode` on <html>)
 *   • Scroll milestones — subtle XP-style toasts at major sections
 *
 * The Konami trigger flips a global flag rather than reaching into the
 * thesis-sequence directly: that component reads the same flag and goes
 * vertical when it's set, keeping the contract loose.
 */
export function LandingWhimsy() {
  // Konami code → 2026 BULL MODE
  useKonami(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-bull-mode", "1");

    // Auto-scroll to the thesis chart so the parabolic payoff is visible.
    // Without this, users who trigger Konami from the hero see only the toast.
    const thesis = document.querySelector("[data-milestone='thesis']");
    if (thesis) {
      thesis.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Console signature for finders.
    const SHIFT_LOGO = `
   ███████╗██╗  ██╗██╗███████╗████████╗
   ██╔════╝██║  ██║██║██╔════╝╚══██╔══╝
   ███████╗███████║██║█████╗     ██║
   ╚════██║██╔══██║██║██╔══╝     ██║
   ███████║██║  ██║██║██║        ██║
   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝
        2 0 2 6   B U L L   M O D E
`;
    // eslint-disable-next-line no-console
    console.log("%c" + SHIFT_LOGO, "color:#26C8B8; font-family:monospace");
    // eslint-disable-next-line no-console
    console.log("📡 you found us. dm @SHIFTfin for an early-trader role.");

    // Banner toast at top.
    toast("📈 2026 BULL MODE", {
      description: "Konami unlocked. Charts going parabolic.",
      duration: 6000,
      position: "top-center",
      className:
        "!bg-mint !text-primary-foreground !border-mint font-bold uppercase tracking-[0.2em]",
    });

    // Hold bull mode long enough for the user to scroll, screenshot, brag.
    window.setTimeout(() => {
      document.documentElement.removeAttribute("data-bull-mode");
    }, 7000);
  });

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
