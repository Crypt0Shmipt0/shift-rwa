"use client";

/**
 * Ambient GLSL shader plane — a fullscreen quad rendering a custom fragment
 * shader for ambient section backdrops. Designed to live behind content (z-10
 * negative) and provide a "data ocean" feel — layered grid + soft mint pulse
 * + subtle chromatic refraction at the edges.
 *
 * Tech: @react-three/fiber Canvas with a single PlaneGeometry sized to the
 * viewport, `ShaderMaterial` with hand-rolled GLSL. Uniforms: uTime, uResolution,
 * uMouse, uColorMint, uColorSteel, uOpacity.
 *
 * Performance:
 *  - dpr clamped [1, 1.5] — even on retina we cap at 1.5x to keep fragment cost
 *    sane. Mobile lands at 1.0x via the lower bound.
 *  - frameloop="always" — needs to animate, but the canvas auto-pauses when
 *    not in viewport via R3F's intersection observer integration when
 *    `frameloop="demand"` is selected; we use "always" for visible smoothness.
 *  - prefers-reduced-motion: time uniform is frozen at t=0 so the field is
 *    static (still beautiful, just not moving).
 *
 * Fallback: parent lazy-loads via `next/dynamic({ ssr:false })`. If the canvas
 * fails to mount (no WebGL), an error boundary swaps in a CSS gradient that
 * approximates the look — never blank.
 */

import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionOk } from "@/hooks/use-motion-ok";

/* ─── Brand uniforms ─────────────────────────────────────────────────────── */
const COLOR_MINT = new THREE.Color("#26C8B8");
const COLOR_STEEL = new THREE.Color("#07638C");
const COLOR_BG = new THREE.Color("#021C24");

/* ─── Shaders ────────────────────────────────────────────────────────────── */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Fragment shader: layered "data ocean" effect.
 *
 *  1. Two grid layers at different frequencies, parallax-scrolled at different
 *     speeds, blended additively → creates the depth/grid-on-grid feel.
 *  2. A radial mint pulse from the center, breathing on a slow sine wave →
 *     gives the section a heartbeat without being noisy.
 *  3. A low-frequency value-noise field warps the grid's UVs subtly → the
 *     "data points" don't sit on perfect lines, they drift.
 *  4. Edge vignette with a hint of chromatic offset between channels → the
 *     holographic refraction read at the corners.
 *
 *  All colors are mixed between uColorMint and uColorSteel so the entire
 *  surface stays on-brand even at peak luminance.
 */
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec3  uColorMint;
  uniform vec3  uColorSteel;
  uniform vec3  uColorBg;
  uniform float uOpacity;

  // 2D hash → cheap pseudo-random
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Smooth value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // A single grid layer — soft anti-aliased line at integer cell boundaries.
  // freq controls cell size, thickness controls how thick the lines are.
  float grid(vec2 uv, float freq, float thickness) {
    vec2 g = abs(fract(uv * freq - 0.5) - 0.5) / fwidth(uv * freq);
    float line = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, thickness, line);
  }

  void main() {
    // Aspect-corrected UV centered at 0
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    // Subtle noise warp on the UVs so grid points wobble slightly
    float n = noise(uv * 2.5 + uTime * 0.05);
    vec2 warped = uv + vec2(n - 0.5) * 0.04;

    // Two grid layers, scrolling at different speeds (parallax depth)
    vec2 g1 = warped + vec2(uTime * 0.012, uTime * 0.008);
    vec2 g2 = warped * 0.5 + vec2(-uTime * 0.006, uTime * 0.004);

    float gridA = grid(g1, 18.0, 1.6);
    float gridB = grid(g2, 7.0, 1.2);

    // Soft pointwise dots at grid intersections — denser pattern read
    float dots = 0.0;
    {
      vec2 cell = fract(g1 * 18.0) - 0.5;
      float d = length(cell);
      dots = smoothstep(0.10, 0.04, d);
    }

    // Radial mint pulse from center, slow sine breathe
    float dist = length(uv);
    float pulse = exp(-dist * 1.3) * (0.55 + 0.45 * sin(uTime * 0.45));

    // Mouse-attracted hot-spot — adds local glow when the user moves around
    vec2 mouseUv = uMouse - 0.5;
    mouseUv.x *= uResolution.x / uResolution.y;
    float mouseGlow = exp(-length(uv - mouseUv) * 2.5) * 0.35;

    // Vignette — darken edges so the section feels framed
    float vig = smoothstep(1.1, 0.2, dist);

    // ── Color composition ────────────────────────────────────────────────
    // Base: pure background.
    vec3 col = uColorBg;

    // Add the steel grid (deep, structural)
    col += uColorSteel * gridB * 0.18;
    // Add the mint grid on top (closer, brighter)
    col += uColorMint * gridA * 0.30;
    // Bright dots at intersections — punch
    col += uColorMint * dots * 0.45;
    // Pulse + mouse glow tinted mint
    col += uColorMint * (pulse * 0.18 + mouseGlow);

    // Chromatic-aberration edge tint: shift R/B slightly outward → holographic
    float edge = smoothstep(0.55, 1.05, dist);
    col.r += edge * 0.025;
    col.b -= edge * 0.015;

    // Vignette multiply
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

/* ─── Plane mesh that owns the shader material ───────────────────────────── */

function ShaderPlane({
  motionOk,
  opacity,
}: {
  motionOk: boolean;
  opacity: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorMint: { value: COLOR_MINT },
      uColorSteel: { value: COLOR_STEEL },
      uColorBg: { value: COLOR_BG },
      uOpacity: { value: opacity },
    }),
    // size changes are pushed via useFrame below to avoid full material rebuilds
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    if (motionOk) {
      u.uTime.value = state.clock.elapsedTime;
    }
    // Push current canvas resolution every frame (cheap; vec2)
    u.uResolution.value.set(state.size.width, state.size.height);
    // Smooth mouse follow — R3F gives us normalized pointer in [-1, 1]
    const targetX = (state.pointer.x + 1) * 0.5;
    const targetY = (state.pointer.y + 1) * 0.5;
    mouseRef.current[0] += (targetX - mouseRef.current[0]) * 0.08;
    mouseRef.current[1] += (targetY - mouseRef.current[1]) * 0.08;
    u.uMouse.value.set(mouseRef.current[0], mouseRef.current[1]);
    u.uOpacity.value = opacity;
  });

  return (
    <mesh frustumCulled={false}>
      {/* A 2x2 plane in clip-space coords — vertex shader writes position
       * directly so geometry size is irrelevant. */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ─── CSS fallback (no WebGL or canvas mount fail) ───────────────────────── */

function CssFallback({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at center, rgba(38,200,184,0.18) 0%, rgba(7,99,140,0.10) 35%, rgba(2,28,36,0) 70%), linear-gradient(180deg, rgba(2,28,36,0) 0%, rgba(7,50,63,0.4) 100%)",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Error boundary so a WebGL fail downgrades cleanly ──────────────────── */

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ambient-grid-shader] WebGL boundary caught:", err);
    }
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/* ─── Public component ───────────────────────────────────────────────────── */

export interface AmbientGridShaderProps {
  /** Container className — applied to the absolute-positioned wrapper */
  className?: string;
  /** Final alpha multiplier on the shader output. Default 0.85. */
  opacity?: number;
}

/**
 * Drop-in ambient backdrop. Parent should be `position: relative`.
 *
 * For server-component callers, import via the `AmbientGridShaderLazy`
 * client wrapper (see `./ambient-grid-shader-lazy.tsx`) which handles the
 * `next/dynamic({ ssr:false })` indirection so the WebGL chunk stays out of
 * the server bundle.
 */
export default function AmbientGridShader({
  className = "",
  opacity = 0.85,
}: AmbientGridShaderProps) {
  const motionOk = useMotionOk();

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <WebGLBoundary fallback={<CssFallback />}>
        <Suspense fallback={<CssFallback />}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
            }}
            camera={{ position: [0, 0, 1] }}
            style={{ position: "absolute", inset: 0 }}
            // Always render — the section sits behind copy and we want the
            // pulse + scroll to feel continuous. R3F still pauses the loop
            // when the canvas is occluded by the OS / tab is hidden.
            frameloop="always"
          >
            <ShaderPlane motionOk={motionOk} opacity={opacity} />
          </Canvas>
        </Suspense>
      </WebGLBoundary>
    </div>
  );
}
