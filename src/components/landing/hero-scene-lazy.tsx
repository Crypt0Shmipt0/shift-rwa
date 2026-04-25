"use client";

/**
 * Client-side lazy wrapper for the WebGL parallax hero scene.
 *
 * Why this file exists: Next.js 16 disallows `next/dynamic({ ssr: false })`
 * inside Server Components, and `hero.tsx` (the landing hero) is a Server
 * Component. Without this indirection a static import from `hero.tsx` would
 * pull three.js, @react-three/fiber, @react-three/postprocessing and the
 * shader sources into the landing route's INITIAL client chunk — breaking
 * our < 350 KB gz initial-payload budget by ~700 KB. Wrapping in
 * `dynamic({ ssr: false })` here produces a separate, lazily-fetched chunk
 * loaded only on the client, only on desktop pointer-fine viewports (the
 * inner `HeroScene` self-gates via matchMedia + WebGL check).
 *
 * The loading fallback is `null` — the parent already paints a CSS radial
 * gradient + grid as the zero-CLS SSR backdrop, so we want NOTHING to
 * appear in the slot until the WebGL scene mounts. That keeps CLS = 0 on
 * the swap-in.
 */

import dynamic from "next/dynamic";

const HeroSceneInner = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HeroScene() {
  return <HeroSceneInner />;
}

export default HeroScene;
