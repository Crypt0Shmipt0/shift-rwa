"use client";

/**
 * Client-side lazy wrapper for the GLSL ambient grid shader.
 *
 * Why this file exists: Next.js 16 disallows `next/dynamic({ ssr: false })`
 * inside Server Components. The landing sections that mount this effect
 * (e.g. `connect-section.tsx`) are Server Components, so we need a thin
 * Client Component shim that owns the dynamic import. This keeps Three +
 * R3F out of the server bundle while letting Server Components drop the
 * effect in as if it were a normal component.
 */

import dynamic from "next/dynamic";
import type { AmbientGridShaderProps } from "./ambient-grid-shader";

const AmbientGridShader = dynamic(
  () => import("./ambient-grid-shader"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(38,200,184,0.18) 0%, rgba(7,99,140,0.10) 35%, rgba(2,28,36,0) 70%)",
        }}
      />
    ),
  },
);

export default function AmbientGridShaderLazy(props: AmbientGridShaderProps) {
  return <AmbientGridShader {...props} />;
}
