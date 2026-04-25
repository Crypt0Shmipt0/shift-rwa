"use client";

/**
 * 3D WebGL token orb — the SHIFT token as a metallic mint sphere with 5-7
 * orbiting token chips rendered from real token artwork. Uses
 * @react-three/fiber + drei. Parent lazy-loads this via dynamic(..., { ssr: false }).
 *
 * Fallback: if prefers-reduced-motion OR the Canvas errors out (e.g. no WebGL),
 * render a static CSS version matching the previous orbital chip layout.
 */

import { Component, Suspense, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { TOKENS } from "@/data/tokens";
import { useMotionOk } from "@/hooks/use-motion-ok";

/** SHIFT mark at the center — transparent-PNG texture on a billboarded plane,
 * wrapped in additive-blended mint halos so the "orb" glow still reads. */
function ShiftCore({ pointer }: { pointer: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const logoTexture = useLoader(THREE.TextureLoader, "/brand/shift-mark-gradient.png");
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  logoTexture.anisotropy = 8;

  useFrame(() => {
    if (!ref.current) return;
    // Subtle parallax tilt toward the pointer — no continuous spin so the
    // logo stays legible while still feeling "alive".
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * 0.35,
      0.06,
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -pointer.y * 0.25,
      0.06,
    );
  });

  return (
    <group>
      {/* Halo glow behind the mark — flat camera-facing planes with additive
       * blending so it reads as light radiating from behind the logo, not as
       * a 3D ball. Two stacked passes give a soft inner-to-outer falloff. */}
      <mesh position={[0, 0, -0.4]}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <circleGeometry args={[2.0, 64]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* SHIFT mark — the center subject (gradient logomark, 70% scale) */}
      <mesh ref={ref}>
        <planeGeometry args={[1.96, 1.96]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** A single orbiting token chip — textured plane following a tilted ring. */
function TokenChip({
  texture,
  radius,
  speed,
  phase,
  tilt,
  size = 0.42,
  onPop,
}: {
  texture: THREE.Texture;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size?: number;
  onPop?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const faceRef = useRef<THREE.Group>(null);
  const popStartRef = useRef<number | null>(null);
  const poppingRef = useRef(false);
  const [removed, setRemoved] = useState(false);
  const POP_DURATION = 0.35;

  useFrame(({ clock, camera }) => {
    // Orbit the chip around the SHIFT mark
    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t + phase) * tilt;
    if (ref.current) ref.current.position.set(x, y, z);
    if (faceRef.current) faceRef.current.lookAt(camera.position);

    // Pop animation: rebase the start time on the first frame after click
    // so we use the R3F clock consistently rather than mixing time sources.
    if (poppingRef.current && popStartRef.current === null) {
      popStartRef.current = clock.getElapsedTime();
    }
    if (popStartRef.current !== null && ref.current) {
      const elapsed = clock.getElapsedTime() - popStartRef.current;
      const p = Math.min(elapsed / POP_DURATION, 1);
      // Quick burst up then collapse to zero
      const s = p < 0.4 ? 1 + p * 1.5 : Math.max(0, 1.6 - (p - 0.4) * 2.7);
      ref.current.scale.setScalar(s);
      if (p >= 1) setRemoved(true);
    }
  });

  if (removed) return null;

  const handlePop = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (poppingRef.current) return;
    poppingRef.current = true;
    onPop?.();
  };

  return (
    <group ref={ref}>
      <group ref={faceRef}>
        {/* Halo behind chip — additive mint disc */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[size * 1.9, 48]} />
          <meshBasicMaterial
            color="#26C8B8"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Token icon disc — pointer target */}
        <mesh onPointerDown={handlePop}>
          <circleGeometry args={[size, 48]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} />
        </mesh>
      </group>
      {/* Soft mint ring outline */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 1.05, 0.015, 16, 48]} />
        <meshBasicMaterial color="#26C8B8" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function OrbitingChips() {
  const texturePaths = useMemo(
    () => [
      TOKENS[0].image, // TSL2L
      TOKENS[1].image, // TSL1S
      TOKENS[2].image, // SOX3L
      TOKENS[4].image, // SPX3L
      TOKENS[5].image, // SPX3S
      TOKENS[6].image, // URA2L
    ],
    [],
  );

  const textures = useLoader(THREE.TextureLoader, texturePaths);

  // Configure each texture once
  textures.forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  });

  const chips = useMemo(
    () =>
      textures.map((tex, i) => {
        const count = textures.length;
        const radius = 2.3 + (i % 3) * 0.35;
        const speed = 0.25 + (i % 3) * 0.12 + (i % 2 === 0 ? 0 : 0.08);
        const direction = i % 2 === 0 ? 1 : -1;
        const phase = (i / count) * Math.PI * 2;
        const tilt = 0.35 + (i % 2) * 0.2;
        return { tex, radius, speed: speed * direction, phase, tilt };
      }),
    [textures],
  );

  // "Pop the tokens" easter egg: tap each orbiting chip; popping all of
  // them within 12 seconds dispatches `shift:open-runner` to launch the
  // SHIFT Runner overlay. Resets after 12s of no progress.
  const poppedRef = useRef<Set<number>>(new Set());
  const lastPopRef = useRef<number>(0);
  const firedRef = useRef(false);

  const handlePop = useCallback(
    (i: number) => {
      const now = Date.now();
      // Reset if too long between pops
      if (lastPopRef.current && now - lastPopRef.current > 12000) {
        poppedRef.current = new Set();
        firedRef.current = false;
      }
      lastPopRef.current = now;
      poppedRef.current.add(i);

      if (
        poppedRef.current.size >= chips.length &&
        !firedRef.current &&
        typeof window !== "undefined"
      ) {
        firedRef.current = true;
        window.dispatchEvent(new CustomEvent("shift:open-runner"));
      }
    },
    [chips.length],
  );

  return (
    <>
      {chips.map((c, i) => (
        <TokenChip
          key={i}
          texture={c.tex}
          radius={c.radius}
          speed={c.speed}
          phase={c.phase}
          tilt={c.tilt}
          onPop={() => handlePop(i)}
        />
      ))}
    </>
  );
}

function Scene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    // Map from clip space (-1..1) — e.pointer is already normalized
    setPointer({ x: e.pointer.x, y: e.pointer.y });
  };
  const onLeave = () => setPointer({ x: 0, y: 0 });

  return (
    <group onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* Invisible plane to receive pointer events across the whole canvas */}
      <mesh position={[0, 0, -3]} visible={false}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#EDEEEE" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#26C8B8" />
      <pointLight position={[4, 3, -3]} intensity={0.5} color="#07638C" />

      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.3}>
        <ShiftCore pointer={pointer} />
      </Float>

      <Suspense fallback={null}>
        <OrbitingChips />
      </Suspense>

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </group>
  );
}

/** Static CSS fallback — matches the prior orbital chip look for reduced motion. */
function CssFallback() {
  return (
    <div className="relative aspect-square w-full">
      {/* Concentric rings */}
      {[1, 2, 3, 4, 5].map((r) => (
        <div
          key={r}
          className={`absolute inset-0 rounded-full border shift-orbit-${r}`}
          style={{
            transform: `scale(${1 - r * 0.13})`,
            opacity: 1 - r * 0.13,
            borderColor: `rgba(38,200,184,${0.18 - r * 0.03})`,
          }}
        />
      ))}

      {/* Center SHIFT mark — no orb, no halos, just the symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/shift-mark-gradient.png"
          alt="SHIFT"
          className="w-[8.4rem] md:w-[9.8rem] h-auto drop-shadow-[0_0_32px_rgba(38,200,184,0.55)]"
        />
      </div>

      {/* CSS orbiting chips */}
      {[
        TOKENS[0].image,
        TOKENS[1].image,
        TOKENS[2].image,
        TOKENS[3].image,
        TOKENS[4].image,
      ].map((img, i) => (
        <div
          key={i}
          className={`absolute top-1/2 left-1/2 -ml-5 -mt-5 sm:-ml-6 sm:-mt-6 size-10 sm:size-12 rounded-full bg-card border border-mint/40 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(38,200,184,0.4)] shift-chip-orbit-${i}`}
        >
          <Image src={img} alt="" width={48} height={48} className="size-full object-cover" />
        </div>
      ))}
    </div>
  );
}

type BoundaryProps = { children: ReactNode; fallback: ReactNode };
type BoundaryState = { hasError: boolean };

class ThreeErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[TokenOrb] WebGL scene failed, falling back to CSS:", err);
    }
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/** Detect whether WebGL is available at runtime. The parent already guards
 * with `dynamic(..., { ssr: false })`, so this runs client-side only — we can
 * use a lazy `useState` initializer and avoid setState-in-effect. */
function useHasWebGL(): boolean {
  const [ok] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  });
  return ok;
}

export function LandingTokenOrb() {
  const motionOk = useMotionOk();
  const hasWebGL = useHasWebGL();

  if (!motionOk || !hasWebGL) {
    return <CssFallback />;
  }

  return (
    <div className="relative aspect-square w-full">
      <ThreeErrorBoundary fallback={<CssFallback />}>
        <Canvas
          camera={{ position: [0, 0.4, 6.5], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

export default LandingTokenOrb;
