"use client";

import { useEffect, useRef } from "react";

interface ShakeOptions {
  /** Acceleration magnitude (m/s²) above gravity to count as one shake */
  threshold?: number;
  /** How many shakes within `windowMs` to fire the callback */
  shakeCount?: number;
  /** Sliding window for counting shakes */
  windowMs?: number;
  /** Refractory period after firing — avoids re-trigger spam */
  cooldownMs?: number;
}

/**
 * Mobile shake-to-trigger via DeviceMotionEvent.
 * Best-effort: iOS 13+ Safari requires `requestPermission()` before motion
 * events fire. We don't request proactively (intrusive) — listener stays
 * dormant on iOS until some other code (e.g. an explicit "Enable shake"
 * button) calls `DeviceMotionEvent.requestPermission()`. Android & Chrome
 * iOS get it for free.
 */
export function useShake(callback: () => void, opts: ShakeOptions = {}) {
  const { threshold = 22, shakeCount = 3, windowMs = 1500, cooldownMs = 5000 } = opts;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) return;

    const shakes: number[] = [];
    let lastFire = 0;

    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const mag = Math.sqrt(x * x + y * y + z * z);

      if (mag > threshold) {
        const now = Date.now();
        if (now - lastFire < cooldownMs) return;
        shakes.push(now);
        while (shakes.length && shakes[0] < now - windowMs) shakes.shift();
        if (shakes.length >= shakeCount) {
          shakes.length = 0;
          lastFire = now;
          callbackRef.current();
        }
      }
    };

    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [threshold, shakeCount, windowMs, cooldownMs]);
}
