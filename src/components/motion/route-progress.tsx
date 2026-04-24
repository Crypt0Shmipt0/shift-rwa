"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

/**
 * Top progress bar that animates on route transitions.
 * Detects route changes via `usePathname`, sweeps scaleX 0→1 over 400ms then fades.
 * Renders nothing when motion is not permitted.
 */
export function RouteProgress() {
  const motionOk = useMotionOk();
  const pathname = usePathname();
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setKey((k) => k + 1);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!motionOk) return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key={key}
          className="fixed top-0 left-0 right-0 h-0.5 bg-mint z-[60] origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}
