"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/**
 * Divine hero scene for the god theme (devoke.dev), rendered with
 * react-three-fiber. Loaded only on the god route via next/dynamic, so
 * three.js never enters any other theme's bundle.
 *
 * Layers (back to front):
 *   1. Nebula — fullscreen cosmic shader with god rays and a central glow
 *   2. Mandala — procedural sacred-geometry line work, counter-rotating
 *   3. Halo — orbiting golden particles that flare toward the pointer
 *   4. Embers — slow saffron sparks rising through the scene
 *   5. Core — the pulsing third-eye energy source behind the title
 */

const GOLD = new THREE.Color("#f0c24b");
const SAFFRON = new THREE.Color("#ff7a1a");

/**
 * Shared pointer state, smoothed once per frame by PointerRig. Module
 * scope keeps it out of React's render data flow (the canvas mounts once).
 */
const pointerState = { x: 0, y: 0, tx: 0, ty: 0 };

/** Deterministic PRNG (mulberry32) so particle layout is render-pure. */
function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------- nebula --------------------------------- */

const NEBULA_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uPointer;
uniform float uAspect;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
  vec2 drift = uPointer * 0.05;
  float t = uTime * 0.02;

  float n1 = fbm(p * 2.1 + drift + vec2(t, -t * 0.7));
  float n2 = fbm(p * 4.4 - drift * 1.6 + vec2(-t * 0.6, t * 0.4) + n1);

  vec3 voidCol = vec3(0.024, 0.012, 0.036);
  vec3 violet = vec3(0.17, 0.08, 0.33);
  vec3 gold = vec3(0.94, 0.76, 0.29);
  vec3 saffron = vec3(1.0, 0.48, 0.10);

  vec3 col = voidCol;
  col = mix(col, violet, smoothstep(0.35, 0.92, n1) * 0.5);
  col = mix(col, saffron * 0.45, smoothstep(0.58, 0.95, n2) * 0.28);

  // God rays radiating from the divine center
  float ang = atan(p.y, p.x);
  float rad = length(p);
  float rays = pow(abs(sin(ang * 9.0 + t * 3.0)), 24.0);
  rays *= smoothstep(0.95, 0.12, rad) * 0.15;
  col += gold * rays;

  // Central glow
  float core = exp(-rad * 3.1);
  col += gold * core * 0.2 + saffron * core * core * 0.16;

  // Vignette into the void
  col *= 1.0 - smoothstep(0.55, 1.15, rad) * 0.62;

  // Dither grain to avoid banding
  float g = hash(vUv * 913.7 + mod(uTime, 90.0));
  col += (g - 0.5) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`;

function Nebula() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, camera } = useThree();

  // The plane sits at z=-1, behind the focal plane that `viewport` is
  // measured at, so it must be sized for its own depth — otherwise it
  // leaves an uncovered black border around the scene (glaring on
  // portrait screens, where the vignette doesn't reach the edges).
  const planeCenter = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const planeViewport = viewport.getCurrentViewport(camera, planeCenter);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uAspect.value = viewport.width / viewport.height;
    mat.uniforms.uPointer.value.set(pointerState.x, pointerState.y);
  });

  return (
    <mesh
      scale={[planeViewport.width * 1.02, planeViewport.height * 1.02, 1]}
      position={[0, 0, -1]}
    >
      <planeGeometry />
      <shaderMaterial
        ref={material}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={NEBULA_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* --------------------------------- mandala --------------------------------- */

function circlePoints(radius: number, segments = 128): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
}

/** Lotus-petal scallop: a rose-modulated circle. */
function rosePoints(
  radius: number,
  petals: number,
  depth: number,
  segments = 360
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radius * (1 - depth + depth * Math.abs(Math.cos((petals / 2) * a)));
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return pts;
}

function polygonPoints(radius: number, sides: number, rotation = 0): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
}

function loop(
  points: THREE.Vector3[],
  color: THREE.Color,
  opacity: number
): THREE.LineLoop {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.LineLoop(geometry, material);
}

function Mandala() {
  const groupRef = useRef<THREE.Group>(null);

  const layers = useMemo(() => {
    const R = 1.72;

    // Outer lotus rings
    const outer = new THREE.Group();
    outer.add(loop(rosePoints(R, 24, 0.045), GOLD, 0.4));
    outer.add(loop(rosePoints(R * 0.94, 12, 0.06), GOLD, 0.28));
    outer.userData.spin = 0.02;

    // Mid geometry: interlocking triangles (Sri Yantra energy) + hexagon
    const mid = new THREE.Group();
    mid.add(loop(polygonPoints(R * 0.72, 3, Math.PI / 2), GOLD, 0.5));
    mid.add(loop(polygonPoints(R * 0.72, 3, -Math.PI / 2), SAFFRON, 0.42));
    mid.add(loop(polygonPoints(R * 0.55, 3, Math.PI / 2 + Math.PI / 6), GOLD, 0.3));
    mid.add(loop(polygonPoints(R * 0.55, 3, -Math.PI / 2 + Math.PI / 6), GOLD, 0.3));
    mid.add(loop(polygonPoints(R * 0.78, 6, 0), GOLD, 0.22));
    mid.userData.spin = -0.035;

    // Inner flower-of-life seed: six circles around one
    const inner = new THREE.Group();
    const r = R * 0.17;
    inner.add(loop(circlePoints(r, 72), SAFFRON, 0.35));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const c = loop(circlePoints(r, 72), GOLD, 0.28);
      c.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      inner.add(c);
    }
    inner.add(loop(circlePoints(r * 2.05, 96), GOLD, 0.24));
    inner.userData.spin = 0.05;

    return [outer, mid, inner];
  }, []);

  useEffect(() => {
    return () => {
      layers.forEach((layer) =>
        layer.children.forEach((child) => {
          const line = child as THREE.LineLoop;
          line.geometry.dispose();
          (line.material as THREE.Material).dispose();
        })
      );
    };
  }, [layers]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.children.forEach((layer) => {
      layer.rotation.z += delta * (layer.userData.spin as number);
    });
    // Breathing
    const breathe = 1 + Math.sin(t * 0.5) * 0.018;
    group.scale.setScalar(breathe);
    // Gentle pointer parallax
    group.position.x += (pointerState.x * 0.16 - group.position.x) * 0.04;
    group.position.y += (pointerState.y * 0.12 - group.position.y) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <primitive key={i} object={layer} />
      ))}
    </group>
  );
}

/* ------------------------------ halo particles ----------------------------- */

const HALO_VERTEX = /* glsl */ `
attribute float aAngle;
attribute float aRadius;
attribute float aSeed;
uniform float uTime;
uniform vec2 uPointerW;
uniform float uPixelRatio;
varying float vGlow;
varying float vSeed;

void main() {
  float ang = aAngle + uTime * (0.03 + aSeed * 0.05);
  vec3 pos = vec3(
    cos(ang) * aRadius,
    sin(ang) * aRadius * 0.92,
    sin(uTime * (0.2 + aSeed * 0.5) + aSeed * 40.0) * 0.22
  );

  // Anime aura: particles near the pointer flare outward and brighten
  float d = distance(pos.xy, uPointerW);
  float flare = smoothstep(0.85, 0.0, d);
  vec2 away = normalize(pos.xy - uPointerW + vec2(0.0001));
  pos.xy += away * flare * 0.3;
  vGlow = flare;
  vSeed = aSeed;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float twinkle = 0.65 + 0.35 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 90.0);
  gl_PointSize = (2.2 + aSeed * 2.6) * twinkle * (1.0 + flare * 1.6) * uPixelRatio * (5.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const HALO_FRAGMENT = /* glsl */ `
precision highp float;
varying float vGlow;
varying float vSeed;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float alpha = smoothstep(0.5, 0.05, d);
  vec3 gold = vec3(0.94, 0.76, 0.29);
  vec3 saffron = vec3(1.0, 0.48, 0.10);
  vec3 col = mix(gold, saffron, vSeed);
  col = mix(col, vec3(1.0, 0.95, 0.8), vGlow * 0.8);
  gl_FragColor = vec4(col, alpha * (0.55 + vGlow * 0.45));
}
`;

function Halo({ count = 1300 }: { count?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const { positions, angles, radii, seeds } = useMemo(() => {
    const rng = createRng(0xde0 ^ count);
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      angles[i] = rng() * Math.PI * 2;
      // Bias particles into a ring around the mandala with scattered outliers
      radii[i] = rng() < 0.75 ? 1.35 + rng() * 1.15 : 0.4 + rng() * 2.6;
      seeds[i] = rng();
    }
    return { positions, angles, radii, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointerW: { value: new THREE.Vector2(99, 99) },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    mat.uniforms.uPointerW.value.set(
      (pointerState.x * viewport.width) / 2,
      (pointerState.y * viewport.height) / 2
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={HALO_VERTEX}
        fragmentShader={HALO_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------- rising embers ----------------------------- */

const EMBER_VERTEX = /* glsl */ `
attribute vec3 aStart;
attribute float aSeed;
uniform float uTime;
uniform float uHeight;
uniform float uPixelRatio;
varying float vLife;

void main() {
  float speed = 0.12 + aSeed * 0.2;
  float y = mod(aStart.y + uTime * speed, uHeight) - uHeight * 0.5;
  float sway = sin(uTime * (0.4 + aSeed) + aSeed * 50.0) * 0.14;
  vec3 pos = vec3(aStart.x + sway, y, aStart.z);
  vLife = 1.0 - (y + uHeight * 0.5) / uHeight;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (1.4 + aSeed * 2.0) * uPixelRatio * (5.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const EMBER_FRAGMENT = /* glsl */ `
precision highp float;
varying float vLife;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float alpha = smoothstep(0.5, 0.08, length(c)) * (0.18 + vLife * 0.5);
  vec3 col = mix(vec3(1.0, 0.37, 0.23), vec3(0.94, 0.76, 0.29), vLife * 0.6);
  gl_FragColor = vec4(col, alpha);
}
`;

function Embers({ count = 240 }: { count?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const { positions, starts, seeds } = useMemo(() => {
    const rng = createRng(0xe4be2 ^ count);
    const positions = new Float32Array(count * 3);
    const starts = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      starts[i * 3] = (rng() - 0.5) * 9;
      starts[i * 3 + 1] = rng() * 6;
      starts[i * 3 + 2] = -0.5 + rng();
      seeds[i] = rng();
    }
    return { positions, starts, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeight: { value: 6 },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uHeight.value = viewport.height * 1.3;
    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[starts, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={EMBER_VERTEX}
        fragmentShader={EMBER_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------ third-eye core ----------------------------- */

const CORE_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;

void main() {
  float d = length(vUv - 0.5) * 2.0;
  float pulse = 0.85 + 0.15 * sin(uTime * 1.6);
  float core = exp(-d * 5.5) * pulse;
  float ring = smoothstep(0.03, 0.0, abs(d - 0.52 - 0.03 * sin(uTime * 0.8)));

  vec3 ember = vec3(1.0, 0.37, 0.23);
  vec3 gold = vec3(0.94, 0.76, 0.29);
  vec3 col = ember * core * 1.3 + gold * core * 0.7 + gold * ring * 0.3;
  float alpha = clamp(core * 1.5 + ring * 0.3, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`;

function Core() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, 0.1]} scale={[1.5, 1.5, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={material}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={CORE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* --------------------------------- wrapper --------------------------------- */

/** Smooths raw pointer input once per frame for every layer to read. */
function PointerRig() {
  useFrame(() => {
    pointerState.x += (pointerState.tx - pointerState.x) * 0.06;
    pointerState.y += (pointerState.ty - pointerState.y) * 0.06;
  });
  return null;
}

export default function GodHeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [ready, setReady] = useState(false);

  const dpr = useMemo(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onPointer = (e: PointerEvent) => {
      pointerState.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Pause rendering when the hero is off-screen or the tab is hidden
    let visible = true;
    const update = () => {
      setFrameloop(visible && !document.hidden ? "always" : "never");
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    io.observe(wrap);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", update);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={() => setReady(true)}
      >
        <PointerRig />
        <Nebula />
        <Mandala />
        <Halo />
        <Embers />
        <Core />
      </Canvas>
    </div>
  );
}
