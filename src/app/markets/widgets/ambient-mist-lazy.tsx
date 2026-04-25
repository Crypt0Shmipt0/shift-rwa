"use client";

/**
 * Client-only wrapper around <DataMist> so Server Components (like the
 * /markets page shell) can drop in the ambient particle layer without owning
 * the dynamic-import boundary themselves. Mirrors the pattern in
 * components/motion/ambient-grid-shader-lazy.tsx.
 */

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const DataMist = dynamic(() => import("@/components/motion/data-mist"), {
  ssr: false,
  loading: () => null,
});

type Props = ComponentProps<typeof DataMist>;

export default function AmbientMistLazy(props: Props) {
  return <DataMist {...props} />;
}
