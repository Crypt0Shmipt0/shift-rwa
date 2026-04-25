"use client";

import { useEffect, useState } from "react";
import { Runner, HISCORE_KEY, padScore } from "./konami-game/runner";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-screen overlay shell for SHIFT Runner.
 *
 * Owns the chrome (title, score, instructions, mute toggle, close button)
 * and respects `prefers-reduced-motion` by gating the live game behind a
 * splash screen. The canvas itself is in `<Runner />`.
 */
export function KonamiOverlay({ open, onClose }: Props) {
  const [muted, setMuted] = useState(true);
  const [hiscore, setHiscore] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [splashAccepted, setSplashAccepted] = useState(false);

  // Detect reduced-motion preference at mount.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Read hiscore for the HUD whenever the overlay opens.
  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem(HISCORE_KEY);
      const hi = raw ? parseInt(raw, 10) : 0;
      if (!Number.isNaN(hi)) setHiscore(hi);
    } catch {
      // ignore
    }
    // Poll lightly so the HUD reflects in-game updates without prop drilling.
    const id = window.setInterval(() => {
      try {
        const raw = window.localStorage.getItem(HISCORE_KEY);
        const hi = raw ? parseInt(raw, 10) : 0;
        if (!Number.isNaN(hi)) setHiscore(hi);
      } catch {
        // ignore
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  // ESC closes; also reset splash so reduced-motion re-shows next time.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "m" || e.key === "M") {
        setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset splash gate when closed so reduced-motion users see it again next time.
  useEffect(() => {
    if (!open) setSplashAccepted(false);
  }, [open]);

  if (!open) return null;

  const showSplash = reducedMotion && !splashAccepted;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#021C24]/90 backdrop-blur-sm animate-konami-in"
      role="dialog"
      aria-modal="true"
      aria-label="SHIFT Runner"
    >
      <style>{`
        @keyframes konamiIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-konami-in { animation: konamiIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
      <div className="relative flex h-full w-full max-w-[1100px] flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
        {/* Mint glow border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded-2xl border border-mint/30 shadow-[0_0_60px_rgba(38,200,184,0.25)_inset]"
        />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-mint sm:text-base">
            ▲ ▲ ▼ ▼ ◄ ► ◄ ► B A · <span className="text-white">SHIFT RUNNER</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80 sm:text-sm">
            <span>HI · {padScore(hiscore, 5)}</span>
            <button
              onClick={() => setMuted((m) => !m)}
              className="rounded border border-mint/40 px-2 py-1 text-mint hover:bg-mint/10 transition-colors"
              aria-pressed={!muted}
              title="Toggle sound (M)"
            >
              {muted ? "SOUND OFF" : "SOUND ON"}
            </button>
            <button
              onClick={onClose}
              className="rounded border border-red-500/60 px-2 py-1 text-red-400 hover:bg-red-500/10 transition-colors"
              title="Close (Esc)"
              aria-label="Close mini-game"
            >
              ESC ✕
            </button>
          </div>
        </div>

        {/* Game area */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="w-full max-w-[900px]">
            {showSplash ? (
              <div className="flex aspect-[800/300] w-full flex-col items-center justify-center rounded-md border border-mint/30 bg-[#021C24] px-6 text-center">
                <div className="font-mono text-sm uppercase tracking-[0.3em] text-mint">
                  Konami unlocked
                </div>
                <div className="mt-4 font-mono text-2xl text-white sm:text-3xl">
                  SHIFT RUNNER
                </div>
                <p className="mt-3 max-w-md text-sm text-white/70">
                  We noticed you prefer reduced motion. The game runs at 60fps
                  with parallax. Want to play anyway?
                </p>
                <button
                  onClick={() => setSplashAccepted(true)}
                  className="mt-6 rounded-md bg-mint px-5 py-2 font-mono text-sm uppercase tracking-[0.25em] text-[#021C24] hover:bg-mint/90 transition-colors"
                >
                  ▶ Click to play
                </button>
              </div>
            ) : (
              <Runner muted={muted} />
            )}
          </div>
        </div>

        {/* Footer instructions */}
        <div className="relative z-10 flex flex-col items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 sm:flex-row sm:text-xs">
          <div>SPACE / ↑ jump · ↓ duck · ESC close · R restart</div>
          <div className="flex items-center gap-3">
            {/* Mobile-only tap-to-jump button. Touch on canvas also works. */}
            <button
              className="rounded-full border border-mint/50 bg-mint/10 px-4 py-2 text-mint sm:hidden"
              onTouchStart={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: " " }),
                );
              }}
              aria-label="Jump"
            >
              ▲ JUMP
            </button>
            <span className="hidden sm:inline">
              Built with caffeine + perp candles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
