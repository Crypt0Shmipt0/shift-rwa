"use client";

/**
 * HERO 3D PARALLAX DEPTH SCENE
 *
 * Renders behind the landing hero copy. Layers, in z-order from far to near:
 *  1. Tron-style perspective grid floor extending to horizon (mint glow lines,
 *     subtle horizon scroll so the grid pulls toward the viewer).
 *  2. Volumetric drifting "token chip" particles — many small additive discs,
 *     bigger/brighter when near the camera, smaller + bokeh-blurred when far.
 *  3. A soft horizon glow disc + a couple of distant bloom halos for depth.
 *
 * Interaction:
 *  - Mouse parallax: camera tilts ±0.4 rad on XY following pointer (eased).
 *  - Scroll dolly: camera pulls back as user scrolls past the hero so the
 *    perspective opens up.
 *
 * Post-processing:
 *  - Bloom on the mint emissive lines for the brand glow.
 *
 * Performance:
 *  - dpr clamped [1, 1.75]
 *  - Particle count tuned for 60fps on mid laptops (~140 chips)
 *  - InstancedMesh for chip particles to keep draw calls low
 *  - frameloop="always" but cheap shaders, no shadows
 *
 * Render guards (handled by parent's dynamic import + props): only mounts when
 * desktop + motion OK + WebGL available. Renders a transparent canvas so the
 * existing CSS gradient/grid is the SSR fallback.
 */

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";

// Brand
const MINT = new THREE.Color("#26C8B8");
const TIDAL = new THREE.Color("#07638C");

/* ------------------------------------------------------------------ */
/* GRID FLOOR — Tron-style perspective grid                            */
/* ------------------------------------------------------------------ */

function GridFloor() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader: emissive grid lines that pulse slowly + scroll toward viewer.
  // Output is mint and gets fed to bloom.
  const shader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColorNear: { value: MINT.clone() },
        uColorFar: { value: TIDAL.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        uniform float uTime;
        uniform vec3 uColorNear;
        uniform vec3 uColorFar;

        // Anti-aliased grid line
        float gridLine(float coord, float spacing, float thickness) {
          float c = coord / spacing;
          float f = abs(fract(c - 0.5) - 0.5) / fwidth(c);
          return 1.0 - smoothstep(0.0, thickness, f);
        }

        void main() {
          // Use world-space xz so the grid feels stable in 3D
          float scroll = uTime * 1.6;
          float lx = gridLine(vWorldPos.x, 2.0, 1.0);
          float lz = gridLine(vWorldPos.z + scroll, 2.0, 1.0);
          float lines = max(lx, lz);

          // Fade near horizon and beneath camera
          float distFromCam = length(vWorldPos.xz);
          float horizonFade = 1.0 - smoothstep(20.0, 60.0, distFromCam);
          float nearFade = smoothstep(0.5, 4.0, distFromCam);

          // Subtle wider "major" lines every 5 units
          float maj = max(
            gridLine(vWorldPos.x, 10.0, 1.4),
            gridLine(vWorldPos.z + scroll, 10.0, 1.4)
          ) * 0.5;

          float intensity = (lines + maj) * horizonFade * nearFade;

          vec3 col = mix(uColorFar, uColorNear, horizonFade);
          // Boost emissive for bloom
          col *= (1.6 + 0.4 * sin(uTime * 0.6));

          if (intensity < 0.001) discard;
          gl_FragColor = vec4(col * intensity, intensity * 0.95);
        }
      `,
    };
  }, []);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, -8]}>
      <planeGeometry args={[140, 140, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* PARTICLES — drifting token chips with depth bokeh                   */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 140;

type ParticleSeed = {
  x: number;
  y: number;
  z: number;
  speed: number;
  scale: number;
  phase: number;
  drift: number;
  hue: number; // 0 = mint, 1 = tidal
};

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Generate seeds once
  const seeds = useMemo<ParticleSeed[]>(() => {
    const arr: ParticleSeed[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across a large frustum-shaped volume in front of camera
      const z = -Math.random() * 50 - 4; // depth: -4 to -54
      const spreadX = 24 + Math.abs(z) * 0.3;
      const spreadY = 14 + Math.abs(z) * 0.18;
      arr.push({
        x: (Math.random() - 0.5) * spreadX,
        y: (Math.random() - 0.5) * spreadY,
        z,
        speed: 0.15 + Math.random() * 0.5,
        scale: 0.05 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.4,
        hue: Math.random(),
      });
    }
    return arr;
  }, []);

  // Init colors per-instance
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    seeds.forEach((s, i) => {
      tmpColor.copy(MINT).lerp(TIDAL, s.hue * 0.55);
      // Far particles dimmer
      const depthFactor = THREE.MathUtils.clamp(
        1.0 - Math.abs(s.z) / 60,
        0.25,
        1.0,
      );
      tmpColor.multiplyScalar(0.6 + depthFactor * 1.3);
      mesh.setColorAt(i, tmpColor);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [seeds, tmpColor]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      // Upward drift + slight x-axis sway
      const upY = ((s.y + t * s.speed) % 18) - 9;
      const swayX = s.x + Math.sin(t * 0.4 + s.phase) * s.drift;
      const z = s.z;

      // Bokeh: scale the *visual* size larger when far so it appears as a soft
      // out-of-focus blob. We compensate by lowering opacity through color
      // (already dimmed at init) — the bloom pass handles the rest.
      const depthFactor = THREE.MathUtils.clamp(
        1.0 - Math.abs(z) / 60,
        0.2,
        1.0,
      );
      // Pulse
      const pulse = 1.0 + Math.sin(t * 1.2 + s.phase) * 0.08;
      const visualScale = s.scale * (0.7 + (1 - depthFactor) * 1.6) * pulse;

      dummy.position.set(swayX, upY, z);
      // Always face camera-ish — using identity rotation is fine for circles
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(visualScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      {/* Small disc — circle geometry rendered with additive blending so it
          composites like a bokeh light. */}
      <circleGeometry args={[1, 24]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* HORIZON GLOW — soft bloom-fed disc at the horizon line              */
/* ------------------------------------------------------------------ */

function HorizonGlow() {
  return (
    <group position={[0, -1.6, -40]}>
      {/* Wide warm horizon line */}
      <mesh>
        <planeGeometry args={[120, 4]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Punchy core */}
      <mesh position={[0, -0.4, 0.1]}>
        <planeGeometry args={[80, 0.6]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Distant tidal halo offset slightly */}
      <mesh position={[8, 1.5, -2]}>
        <circleGeometry args={[6, 48]} />
        <meshBasicMaterial
          color="#07638C"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-12, 2.8, -3]}>
        <circleGeometry args={[4.5, 48]} />
        <meshBasicMaterial
          color="#26C8B8"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* CAMERA RIG — mouse parallax + scroll dolly                          */
/* ------------------------------------------------------------------ */

type Pointer = { x: number; y: number };
type Scroll = { current: number };

function CameraRig({
  pointerRef,
  scrollRef,
}: {
  pointerRef: React.MutableRefObject<Pointer>;
  scrollRef: React.MutableRefObject<Scroll>;
}) {
  const { camera } = useThree();

  // base position
  const basePos = useMemo(() => new THREE.Vector3(0, 0.6, 6), []);
  const target = useMemo(() => new THREE.Vector3(0, 0, -10), []);

  useFrame(() => {
    const p = pointerRef.current;
    const s = scrollRef.current.current; // 0..1

    // Mouse parallax — translate the camera slightly + look-at offset
    const tiltX = p.x * 0.6; // x translate
    const tiltY = p.y * 0.4; // y translate

    // Scroll dolly — pull back z and lift y a touch
    const dollyZ = s * 4.5;
    const dollyY = s * 1.2;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      basePos.x + tiltX,
      0.06,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      basePos.y + tiltY + dollyY,
      0.06,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      basePos.z + dollyZ,
      0.06,
    );

    // Slight rotational sway via lookAt offset
    target.set(p.x * 0.4, -0.2 + p.y * 0.2, -10);
    camera.lookAt(target);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* SCENE                                                                */
/* ------------------------------------------------------------------ */

function Scene({
  pointerRef,
  scrollRef,
}: {
  pointerRef: React.MutableRefObject<Pointer>;
  scrollRef: React.MutableRefObject<Scroll>;
}) {
  return (
    <>
      <CameraRig pointerRef={pointerRef} scrollRef={scrollRef} />
      <ambientLight intensity={0.35} />
      <GridFloor />
      <HorizonGlow />
      <Particles />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.35}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.85}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* WEBGL DETECTION HOOK                                                 */
/* ------------------------------------------------------------------ */

function useHasWebGL(): boolean {
  const [ok] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
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

/* ------------------------------------------------------------------ */
/* PUBLIC COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function HeroScene() {
  const pointerRef = useRef<Pointer>({ x: 0, y: 0 });
  const scrollRef = useRef<Scroll>({ current: 0 });
  const hostRef = useRef<HTMLDivElement>(null);
  const hasWebGL = useHasWebGL();
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop gate — match: pointer:fine + min-width 768
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (pointer: fine)",
    );
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mouse parallax — listen on window for full-bleed responsiveness
  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = -ny; // invert so up = up
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop]);

  // Scroll progress 0..1 over first viewport height
  useEffect(() => {
    if (!isDesktop) return;
    const onScroll = () => {
      const h = window.innerHeight || 800;
      scrollRef.current.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  if (!isDesktop || !hasWebGL) {
    // Render nothing — parent's CSS gradient stays as-is.
    return null;
  }

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ contain: "strict" }}
    >
      <Canvas
        camera={{ position: [0, 0.6, 6], fov: 55, near: 0.1, far: 200 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene pointerRef={pointerRef} scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
