"use client";

import { useEffect, useRef } from "react";

export type Milestone = {
  /** Stable id used as the localStorage key suffix. */
  id: string;
  /** CSS selector of the element the user must reach. */
  selector: string;
  /** Called once when the element first enters the viewport. */
  onReach: () => void;
};

const STORAGE_PREFIX = "shift:milestone:";

function hasFiredBefore(id: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

function markFired(id: string) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, "1");
  } catch {
    // ignore
  }
}

/**
 * Watches a list of DOM nodes and fires each milestone callback exactly
 * once per visitor (persisted via localStorage). Each milestone references
 * its target by CSS selector, so the consumer doesn't need refs.
 *
 * The hook ignores milestones whose targets aren't mounted yet but
 * re-resolves them after a short delay to handle late-mounting sections.
 */
export function useScrollMilestones(milestones: Milestone[]) {
  const milestonesRef = useRef(milestones);
  milestonesRef.current = milestones;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fired = new Set<string>();
    milestonesRef.current.forEach((m) => {
      if (hasFiredBefore(m.id)) fired.add(m.id);
    });

    if (fired.size === milestonesRef.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const targetId = (entry.target as HTMLElement).dataset.milestoneId;
          if (!targetId || fired.has(targetId)) continue;
          const milestone = milestonesRef.current.find((m) => m.id === targetId);
          if (!milestone) continue;
          fired.add(targetId);
          markFired(targetId);
          milestone.onReach();
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.15 }
    );

    const tryAttach = () => {
      milestonesRef.current.forEach((m) => {
        if (fired.has(m.id)) return;
        const el = document.querySelector(m.selector) as HTMLElement | null;
        if (!el) return;
        if (el.dataset.milestoneId === m.id) return;
        el.dataset.milestoneId = m.id;
        observer.observe(el);
      });
    };

    tryAttach();
    // Re-attach after late-mounting client components.
    const id = window.setTimeout(tryAttach, 1000);

    return () => {
      window.clearTimeout(id);
      observer.disconnect();
    };
  }, []);
}

/**
 * Manually fire a milestone (e.g. on an action like a button click).
 * Returns true if it fired (i.e., wasn't already recorded).
 */
export function fireMilestone(id: string, onFire: () => void) {
  if (hasFiredBefore(id)) return false;
  markFired(id);
  onFire();
  return true;
}
