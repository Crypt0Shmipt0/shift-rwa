"use client";

/**
 * 3D WebGL token orb — the SHIFT token as a metallic mint sphere with 5-7
 * orbiting token chips rendered from real token artwork. Uses
 * @react-three/fiber + drei. Parent lazy-loads this via dynamic(..., { ssr: false }).
 *
 * Fallback: if prefers-reduced-motion OR the Canvas errors out (e.g. no WebGL),
 * render a static CSS version matching the previous orbital chip layout.
 */

import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { TOKENS } from "@/data/tokens";
import { useMotionOk } from "@/hooks/use-motion-ok";

/** SHIFT token at the center — metallic mint sphere with a subtle emissive core. */
function ShiftCore({ pointer }: { pointer: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Constant y-axis rotation + subtle parallax toward the pointer
    ref.current.rotation.y += delta * 0.35;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      pointer.y * 0.18,
      0.06,
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -pointer.x * 0.1,
      0.06,
    );
  });

  return (
    <group>
      {/* Volumetric glow — additive sprite halos */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.32, 32, 32]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core metallic mint sphere */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          color="#26C8B8"
          metalness={0.85}
          roughness={0.22}
          emissive="#0A4A44"
          emissiveIntensity={0.55}
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
}: {
  texture: THREE.Texture;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const faceRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t + phase) * tilt;
    if (ref.current) ref.current.position.set(x, y, z);
    // Billboard the face so the logo always looks at the camera
    if (faceRef.current) faceRef.current.lookAt(camera.position);
  });

  return (
    <group ref={ref}>
      <mesh ref={faceRef}>
        {/* Circular disc */}
        <circleGeometry args={[size, 48]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      {/* Soft mint ring around the chip */}
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

      {/* Center mint orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative size-48 md:size-56">
          <div className="absolute inset-0 rounded-full bg-mint blur-3xl opacity-60" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-mint via-[#1FA79B] to-[#07638C] shadow-[0_0_120px_60px_rgba(38,200,184,0.45),inset_0_-20px_60px_rgba(0,0,0,0.4)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/shift-mark-white.png"
              alt="SHIFT"
              className="w-3/5 h-auto opacity-95 drop-shadow-2xl"
            />
          </div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />
        </div>
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
