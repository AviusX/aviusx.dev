"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";

// ============================================================
// HOOKS
// ============================================================

function useScrollData() {
  const ref = useRef({ progress: 0, velocity: 0 });
  useEffect(() => {
    let prev = window.scrollY;
    let prevT = performance.now();
    let ticking = false;
    const update = () => {
      const now = performance.now();
      const dt = Math.max((now - prevT) / 1000, 0.016);
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current.progress = max > 0 ? sy / max : 0;
      ref.current.velocity = (sy - prev) / dt;
      prev = sy;
      prevT = now;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

function useMouseNormalized() {
  const ref = useRef(new THREE.Vector2(0.5, 0.5));
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ref.current.x = e.clientX / window.innerWidth;
      ref.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return ref;
}

function useDarkMode() {
  const ref = useRef(1.0);
  useEffect(() => {
    const check = () => {
      ref.current = document.documentElement.classList.contains("dark")
        ? 1.0
        : 0.0;
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ============================================================
// NETWORK GENERATION
// ============================================================

interface NetworkData {
  nodePositions: Float32Array; // xyz per node
  nodeSizes: Float32Array;
  nodePhases: Float32Array;
  nodeLayers: Float32Array;
  nodeCount: number;
  edgeIndices: Uint16Array; // from/to pairs as node indices
  edgeOpacities: Float32Array;
  edgeCount: number;
  edgesByFrom: Map<number, number[]>; // nodeIdx → edgeIdx[]
}

function generateNetwork(lite = false): NetworkData {
  const LAYER_DEFS = lite
    ? [
        { count: 8, z: 0, radius: 7 },
        { count: 14, z: 14, radius: 11 },
        { count: 20, z: 28, radius: 14 },
        { count: 24, z: 44, radius: 16 },
        { count: 20, z: 58, radius: 14 },
        { count: 14, z: 72, radius: 11 },
        { count: 8, z: 88, radius: 7 },
      ]
    : [
        { count: 12, z: 0, radius: 7 },
        { count: 22, z: 14, radius: 11 },
        { count: 30, z: 28, radius: 14 },
        { count: 36, z: 44, radius: 16 },
        { count: 30, z: 58, radius: 14 },
        { count: 22, z: 72, radius: 11 },
        { count: 12, z: 88, radius: 7 },
      ];

  const totalNodes = LAYER_DEFS.reduce((s, l) => s + l.count, 0);
  const positions = new Float32Array(totalNodes * 3);
  const sizes = new Float32Array(totalNodes);
  const phases = new Float32Array(totalNodes);
  const layers = new Float32Array(totalNodes);

  let idx = 0;
  const layerOffsets: number[] = [];

  for (let l = 0; l < LAYER_DEFS.length; l++) {
    const def = LAYER_DEFS[l];
    layerOffsets.push(idx);

    for (let n = 0; n < def.count; n++) {
      const angle =
        (n / def.count) * Math.PI * 2 + l * 0.45 + Math.random() * 0.3;
      const r = def.radius * (0.35 + Math.random() * 0.65);
      const spread = 3;

      positions[idx * 3] =
        Math.cos(angle) * r + (Math.random() - 0.5) * spread;
      positions[idx * 3 + 1] =
        Math.sin(angle) * r + (Math.random() - 0.5) * spread;
      positions[idx * 3 + 2] = def.z + (Math.random() - 0.5) * 5;

      sizes[idx] =
        l === 0 || l === LAYER_DEFS.length - 1
          ? 2.2
          : 0.8 + Math.random() * 1.8;
      phases[idx] = Math.random() * Math.PI * 2;
      layers[idx] = l;
      idx++;
    }
  }

  // Edges: connect each node to K random nodes in the next layer
  const K = lite ? 3 : 5;
  const edgePairs: { from: number; to: number; opacity: number }[] = [];

  for (let l = 0; l < LAYER_DEFS.length - 1; l++) {
    const fromStart = layerOffsets[l];
    const fromEnd = fromStart + LAYER_DEFS[l].count;
    const toStart = layerOffsets[l + 1];
    const toCount = LAYER_DEFS[l + 1].count;

    for (let f = fromStart; f < fromEnd; f++) {
      const used = new Set<number>();
      for (let k = 0; k < K; k++) {
        const t = toStart + Math.floor(Math.random() * toCount);
        if (used.has(t)) continue;
        used.add(t);
        edgePairs.push({
          from: f,
          to: t,
          opacity: 0.4 + Math.random() * 0.6,
        });
      }
    }
  }

  // Skip connections (layer+2) — desktop only
  if (!lite) {
    for (let l = 0; l < LAYER_DEFS.length - 2; l++) {
      const fromStart = layerOffsets[l];
      const toStart = layerOffsets[l + 2];
      const toCount = LAYER_DEFS[l + 2].count;
      for (let s = 0; s < 5; s++) {
        edgePairs.push({
          from: fromStart + Math.floor(Math.random() * LAYER_DEFS[l].count),
          to: toStart + Math.floor(Math.random() * toCount),
          opacity: 0.2 + Math.random() * 0.3,
        });
      }
    }
  }

  const edgeCount = edgePairs.length;
  const edgeIndices = new Uint16Array(edgeCount * 2);
  const edgeOpacities = new Float32Array(edgeCount);
  const edgesByFrom = new Map<number, number[]>();

  for (let e = 0; e < edgeCount; e++) {
    edgeIndices[e * 2] = edgePairs[e].from;
    edgeIndices[e * 2 + 1] = edgePairs[e].to;
    edgeOpacities[e] = edgePairs[e].opacity;

    const arr = edgesByFrom.get(edgePairs[e].from) ?? [];
    arr.push(e);
    edgesByFrom.set(edgePairs[e].from, arr);
  }

  return {
    nodePositions: positions,
    nodeSizes: sizes,
    nodePhases: phases,
    nodeLayers: layers,
    nodeCount: totalNodes,
    edgeIndices,
    edgeOpacities,
    edgeCount,
    edgesByFrom,
  };
}

// ============================================================
// SHADERS
// ============================================================

const nodeVert = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aLayer;

uniform float uTime;
uniform float uDarkMode;
uniform float uScroll;

varying float vAlpha;
varying float vLayer;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  float dist = -mvPos.z;

  // Organic pulsing per node
  float pulse = sin(uTime * 1.5 + aPhase * 6.28) * 0.5 + 0.5;

  // Nodes near current scroll "layer" glow brighter
  float scrollLayer = uScroll * 6.0;
  float layerProximity = 1.0 - smoothstep(0.0, 2.5, abs(aLayer - scrollLayer));
  float activeBrightness = 0.5 + layerProximity * 0.5;

  gl_PointSize = aSize * (220.0 / max(dist, 1.0)) * (0.7 + 0.3 * pulse) * (0.8 + 0.4 * layerProximity);
  gl_Position = projectionMatrix * mvPos;

  vAlpha = smoothstep(90.0, 8.0, dist) * smoothstep(0.5, 4.0, dist)
         * mix(0.08, activeBrightness * 1.1, uDarkMode) * (0.5 + 0.5 * pulse);
  vLayer = aLayer;
}
`;

const nodeFrag = /* glsl */ `
precision highp float;
varying float vAlpha;
varying float vLayer;
uniform float uScroll;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float core = smoothstep(0.1, 0.0, d);
  float glow = exp(-d * 5.0);
  float alpha = (core * 0.6 + glow * 0.4) * vAlpha;

  // Color shifts through indigo→violet→cyan as you scroll
  float hue = uScroll + vLayer * 0.08;
  vec3 color = mix(
    vec3(0.38, 0.33, 0.92),
    vec3(0.55, 0.38, 0.98),
    fract(hue)
  );
  color += core * vec3(0.3, 0.25, 0.4);

  gl_FragColor = vec4(color, alpha);
}
`;

const edgeVert = /* glsl */ `
attribute float aOpacity;
uniform float uDarkMode;
uniform float uScroll;

varying float vOpacity;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float dist = -mvPos.z;
  float distFade = smoothstep(90.0, 5.0, dist) * smoothstep(0.5, 4.0, dist);

  // Scroll-based activation: edges near current depth glow more
  float scrollZ = uScroll * 90.0;
  float zProximity = 1.0 - smoothstep(0.0, 25.0, abs(position.z - scrollZ));
  float activeGlow = 0.5 + zProximity * 1.5;

  vOpacity = aOpacity * distFade * mix(0.02, 0.14 * activeGlow, uDarkMode);
}
`;

const edgeFrag = /* glsl */ `
precision highp float;
varying float vOpacity;
uniform float uScroll;

void main() {
  vec3 color = mix(vec3(0.35, 0.30, 0.78), vec3(0.50, 0.35, 0.88), uScroll);
  gl_FragColor = vec4(color, vOpacity);
}
`;

const pulseVert = /* glsl */ `
attribute float aAlpha;
uniform float uDarkMode;

varying float vAlpha;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  float dist = -mvPos.z;

  gl_PointSize = 6.0 * (200.0 / max(dist, 1.0));
  gl_Position = projectionMatrix * mvPos;

  vAlpha = aAlpha * smoothstep(90.0, 5.0, dist) * smoothstep(0.5, 3.0, dist)
         * mix(0.08, 0.9, uDarkMode);
}
`;

const pulseFrag = /* glsl */ `
precision highp float;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float brightness = exp(-d * 6.0);
  vec3 color = vec3(0.72, 0.65, 1.0);
  gl_FragColor = vec4(color * brightness, brightness * vAlpha);
}
`;

// ============================================================
// NETWORK SCENE
// ============================================================

interface SharedRefs {
  scroll: React.RefObject<{ progress: number; velocity: number }>;
  mouse: React.RefObject<THREE.Vector2>;
  dark: React.RefObject<number>;
}

function NetworkScene({
  shared,
  lite,
}: {
  shared: SharedRefs;
  lite: boolean;
}) {
  const { camera } = useThree();

  const pulseCount = lite ? 30 : 80;

  // Generate network once
  const network = useMemo(() => generateNetwork(lite), [lite]);

  // Breathing amplitude (reduced on mobile)
  const breathAmp = lite ? { x: 0.3, y: 0.3, z: 0.2 } : { x: 0.6, y: 0.6, z: 0.4 };

  // Mutable state refs
  const smooth = useRef({ scroll: 0, mouseX: 0.5, mouseY: 0.5 });

  // Base positions (never mutated)
  const basePositions = useRef(new Float32Array(network.nodePositions));

  // ---- Node geometry ----
  const nodeGeoRef = useRef<THREE.BufferGeometry>(null);
  const nodeMatRef = useRef<THREE.ShaderMaterial>(null);

  const nodeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(network.nodePositions),
        3,
      ),
    );
    geo.setAttribute(
      "aSize",
      new THREE.BufferAttribute(network.nodeSizes, 1),
    );
    geo.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(network.nodePhases, 1),
    );
    geo.setAttribute(
      "aLayer",
      new THREE.BufferAttribute(network.nodeLayers, 1),
    );
    return geo;
  }, [network]);

  // ---- Edge geometry ----
  const edgeGeoRef = useRef<THREE.BufferGeometry>(null);
  const edgeMatRef = useRef<THREE.ShaderMaterial>(null);

  const edgeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Pre-allocate edge vertex positions (2 vertices per edge)
    const edgePos = new Float32Array(network.edgeCount * 6);
    const edgeOp = new Float32Array(network.edgeCount * 2);
    for (let e = 0; e < network.edgeCount; e++) {
      edgeOp[e * 2] = network.edgeOpacities[e];
      edgeOp[e * 2 + 1] = network.edgeOpacities[e];
    }
    geo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(edgeOp, 1));
    // Pre-set bounding sphere to avoid NaN warnings from zero-initialized positions
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 44), 100);
    return geo;
  }, [network]);

  // ---- Pulse state ----
  const pulseState = useMemo(() => {
    const edges = [];
    for (let i = 0; i < pulseCount; i++) {
      edges.push(Math.floor(Math.random() * network.edgeCount));
    }
    return {
      edge: new Int32Array(edges),
      progress: Float32Array.from(
        { length: pulseCount },
        () => Math.random(),
      ),
      speed: Float32Array.from(
        { length: pulseCount },
        () => 0.25 + Math.random() * 0.6,
      ),
    };
  }, [network, pulseCount]);

  const pulseGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3),
    );
    geo.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(new Float32Array(pulseCount), 1),
    );
    // Pre-set bounding sphere to avoid NaN warnings from zero-initialized positions
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 44), 100);
    return geo;
  }, [pulseCount]);

  // ---- FRAME LOOP ----
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const s = smooth.current;

    // Smooth interpolation
    s.scroll += (shared.scroll.current.progress - s.scroll) * 0.04;
    s.mouseX += (shared.mouse.current.x - s.mouseX) * 0.03;
    s.mouseY += (shared.mouse.current.y - s.mouseY) * 0.03;

    const darkMode = shared.dark.current;

    // ── Camera path ──
    const camZ = -8 + s.scroll * 80;
    const camX = Math.sin(s.scroll * Math.PI * 0.6) * 4 + (s.mouseX - 0.5) * 3;
    const camY = Math.sin(s.scroll * Math.PI) * 3 + (s.mouseY - 0.5) * 2;
    camera.position.set(camX, camY, camZ);
    (camera as THREE.PerspectiveCamera).lookAt(camX * 0.3, camY * 0.3, camZ + 25);

    // ── Update node positions (base + breathing) ──
    const nodePos = nodeGeo.attributes.position.array as Float32Array;
    const base = basePositions.current;

    for (let i = 0; i < network.nodeCount; i++) {
      const i3 = i * 3;
      const ph = network.nodePhases[i];
      nodePos[i3] = base[i3] + Math.sin(time * 0.4 + ph) * breathAmp.x;
      nodePos[i3 + 1] = base[i3 + 1] + Math.cos(time * 0.35 + ph * 1.3) * breathAmp.y;
      nodePos[i3 + 2] = base[i3 + 2] + Math.sin(time * 0.25 + ph * 0.7) * breathAmp.z;
    }
    (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // ── Update edge positions ──
    const edgePos = edgeGeo.attributes.position.array as Float32Array;
    for (let e = 0; e < network.edgeCount; e++) {
      const fi = network.edgeIndices[e * 2] * 3;
      const ti = network.edgeIndices[e * 2 + 1] * 3;
      const e6 = e * 6;
      edgePos[e6] = nodePos[fi];
      edgePos[e6 + 1] = nodePos[fi + 1];
      edgePos[e6 + 2] = nodePos[fi + 2];
      edgePos[e6 + 3] = nodePos[ti];
      edgePos[e6 + 4] = nodePos[ti + 1];
      edgePos[e6 + 5] = nodePos[ti + 2];
    }
    (edgeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // ── Update pulses ──
    const pPos = pulseGeo.attributes.position.array as Float32Array;
    const pAlpha = pulseGeo.attributes.aAlpha.array as Float32Array;
    const ps = pulseState;

    for (let i = 0; i < pulseCount; i++) {
      ps.progress[i] += ps.speed[i] * dt;

      if (ps.progress[i] >= 1) {
        // Follow to next edge
        const endNode = network.edgeIndices[ps.edge[i] * 2 + 1];
        const outgoing = network.edgesByFrom.get(endNode);
        if (outgoing && outgoing.length > 0) {
          ps.edge[i] = outgoing[Math.floor(Math.random() * outgoing.length)];
        } else {
          ps.edge[i] = Math.floor(Math.random() * network.edgeCount);
        }
        ps.progress[i] = 0;
      }

      const t = ps.progress[i];
      const fi = network.edgeIndices[ps.edge[i] * 2] * 3;
      const ti = network.edgeIndices[ps.edge[i] * 2 + 1] * 3;

      pPos[i * 3] = nodePos[fi] + (nodePos[ti] - nodePos[fi]) * t;
      pPos[i * 3 + 1] =
        nodePos[fi + 1] + (nodePos[ti + 1] - nodePos[fi + 1]) * t;
      pPos[i * 3 + 2] =
        nodePos[fi + 2] + (nodePos[ti + 2] - nodePos[fi + 2]) * t;

      // Fade in/out at edge endpoints
      pAlpha[i] = Math.sin(t * Math.PI);
    }
    (pulseGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (pulseGeo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;

    // ── Update uniforms ──
    if (nodeMatRef.current) {
      nodeMatRef.current.uniforms.uTime.value = time;
      nodeMatRef.current.uniforms.uScroll.value = s.scroll;
      nodeMatRef.current.uniforms.uDarkMode.value = darkMode;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.uniforms.uScroll.value = s.scroll;
      edgeMatRef.current.uniforms.uDarkMode.value = darkMode;
    }
    if (pulseMatRef.current) {
      pulseMatRef.current.uniforms.uTime.value = time;
      pulseMatRef.current.uniforms.uDarkMode.value = darkMode;
    }
  });

  const pulseMatRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <>
      {/* Edges (behind) */}
      <lineSegments renderOrder={0} frustumCulled={false}>
        <primitive object={edgeGeo} attach="geometry" ref={edgeGeoRef} />
        <shaderMaterial
          ref={edgeMatRef}
          vertexShader={edgeVert}
          fragmentShader={edgeFrag}
          transparent
          depthWrite={false}
          uniforms={{
            uDarkMode: { value: 1 },
            uScroll: { value: 0 },
          }}
        />
      </lineSegments>

      {/* Nodes */}
      <points renderOrder={1} frustumCulled={false}>
        <primitive object={nodeGeo} attach="geometry" ref={nodeGeoRef} />
        <shaderMaterial
          ref={nodeMatRef}
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          transparent
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uDarkMode: { value: 1 },
          }}
        />
      </points>

      {/* Energy pulses (on top, additive) */}
      <points renderOrder={2} frustumCulled={false}>
        <primitive object={pulseGeo} attach="geometry" />
        <shaderMaterial
          ref={pulseMatRef}
          vertexShader={pulseVert}
          fragmentShader={pulseFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uDarkMode: { value: 1 },
          }}
        />
      </points>
    </>
  );
}

// ============================================================
// WRAPPER
// ============================================================

function SceneWrapper({ lite }: { lite: boolean }) {
  const shared: SharedRefs = {
    scroll: useScrollData(),
    mouse: useMouseNormalized(),
    dark: useDarkMode(),
  };
  return <NetworkScene shared={shared} lite={lite} />;
}

export default function ScrollBackground() {
  const [config, setConfig] = useState<{
    mobile: boolean;
    reducedMotion: boolean;
  } | null>(null);

  useEffect(() => {
    const mobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setConfig({ mobile, reducedMotion });
  }, []);

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const progress = max > 0 ? window.scrollY / max : 0;
          // Fade from 1 → 0 between 0% and 15% scroll progress
          setOpacity(Math.max(0, 1 - progress / 0.15));
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SSR / initial render — show nothing (prevents hydration flash)
  if (config === null) return null;

  // Reduced motion — render a static gradient fallback instead of WebGL
  if (config.reducedMotion) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.08), transparent 70%)",
          opacity,
          transition: "opacity 0.1s ease-out",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.1s ease-out",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, -8], fov: 60, near: 0.1, far: 120 }}
        dpr={config.mobile ? [0.5, 1] : [0.75, 1.5]}
        gl={{
          alpha: true,
          antialias: !config.mobile,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneWrapper lite={config.mobile} />
      </Canvas>
    </div>
  );
}
