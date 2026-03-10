"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Orbiting data fragment
function DataFragment({
  radius,
  speed,
  offset,
  size,
}: {
  radius: number;
  speed: number;
  offset: number;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * radius * 0.3;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.x = t * 2;
    ref.current.rotation.y = t * 1.5;
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[size, 0]} />
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Orbital ring
function OrbitalRing({
  radius,
  tilt,
  rotationSpeed,
  color,
  opacity,
}: {
  radius: number;
  tilt: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.elapsedTime * rotationSpeed;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// Neural network connections
function NeuralNetwork() {
  const ref = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities, linePositions, lineColors } = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2.5;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const maxLines = 200;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    return { positions, velocities, linePositions, lineColors };
  }, []);

  const pointsGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    geom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    return geom;
  }, [linePositions, lineColors]);

  useFrame(({ clock }) => {
    if (!ref.current || !linesRef.current) return;

    const posAttr = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = clock.elapsedTime;
    const count = posArray.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] + Math.sin(time * 0.5 + i) * 0.001;
      posArray[i3 + 1] +=
        velocities[i3 + 1] + Math.cos(time * 0.3 + i) * 0.001;
      posArray[i3 + 2] += velocities[i3 + 2];

      // Keep in bounds
      const dist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      );
      if (dist > 5) {
        const scale = 4.5 / dist;
        posArray[i3] *= scale;
        posArray[i3 + 1] *= scale;
        posArray[i3 + 2] *= scale;
      }
    }
    posAttr.needsUpdate = true;

    // Draw connections
    let lineIndex = 0;
    const maxLines = 200;
    for (let i = 0; i < count && lineIndex < maxLines; i++) {
      for (let j = i + 1; j < count && lineIndex < maxLines; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.5) {
          const alpha = (1 - dist / 1.5) * 0.3;
          const li = lineIndex * 6;
          linePositions[li] = posArray[i * 3];
          linePositions[li + 1] = posArray[i * 3 + 1];
          linePositions[li + 2] = posArray[i * 3 + 2];
          linePositions[li + 3] = posArray[j * 3];
          linePositions[li + 4] = posArray[j * 3 + 1];
          linePositions[li + 5] = posArray[j * 3 + 2];
          lineColors[li] = 0.39 * alpha * 3;
          lineColors[li + 1] = 0.4 * alpha * 3;
          lineColors[li + 2] = 0.95 * alpha * 3;
          lineColors[li + 3] = 0.55 * alpha * 3;
          lineColors[li + 4] = 0.36 * alpha * 3;
          lineColors[li + 5] = 0.95 * alpha * 3;
          lineIndex++;
        }
      }
    }

    for (let i = lineIndex * 6; i < linePositions.length; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    const lineGeom = linesRef.current.geometry;
    (lineGeom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (lineGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    lineGeom.setDrawRange(0, lineIndex * 2);
  });

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03,
        color: "#818cf8",
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <>
      <points ref={ref} geometry={pointsGeometry} material={pointsMat} />
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        material={lineMat}
      />
    </>
  );
}

// Main cyber figure — the "entity" that represents you
export default function CyberFigure() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useFrame(({ pointer, clock }) => {
    const t = clock.elapsedTime;

    // Smooth mouse follow
    mouseTarget.current.x = pointer.x * viewport.width * 0.15;
    mouseTarget.current.y = pointer.y * viewport.height * 0.15;
    mouseCurrent.current.x +=
      (mouseTarget.current.x - mouseCurrent.current.x) * 0.03;
    mouseCurrent.current.y +=
      (mouseTarget.current.y - mouseCurrent.current.y) * 0.03;

    // Main group rotation — follows cursor like it's "looking" at you
    if (groupRef.current) {
      groupRef.current.rotation.y =
        mouseCurrent.current.x * 0.3 + Math.sin(t * 0.2) * 0.05;
      groupRef.current.rotation.x =
        -mouseCurrent.current.y * 0.2 + Math.cos(t * 0.15) * 0.03;
    }

    // Core breathing
    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 1.5) * 0.05;
      coreRef.current.scale.setScalar(breathe);
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.rotation.x = t * 0.2;
    }

    // Eye follows cursor more aggressively
    if (eyeRef.current) {
      eyeRef.current.position.x = mouseCurrent.current.x * 0.15;
      eyeRef.current.position.y = mouseCurrent.current.y * 0.15 + 0.15;
      const eyeScale = 1 + Math.sin(t * 3) * 0.1;
      eyeRef.current.scale.setScalar(eyeScale);
    }

    // Inner glow pulses
    if (innerGlowRef.current) {
      const pulse = 0.6 + Math.sin(t * 2) * 0.15;
      innerGlowRef.current.scale.setScalar(pulse);
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 2) * 0.04;
    }

    // Shell rotation
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.15;
      shellRef.current.rotation.z = t * 0.1;
    }
  });

  const fragments = useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        radius: 1.8 + Math.random() * 1.5,
        speed: 0.3 + Math.random() * 0.4,
        offset: (Math.PI * 2 * i) / 12,
        size: 0.03 + Math.random() * 0.04,
      });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Inner glow sphere */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core — icosahedron wireframe */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial
          color="#818cf8"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner solid core */}
      <mesh>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Eye/sensor — bright point that follows cursor */}
      <mesh ref={eyeRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.9} />
      </mesh>

      {/* Eye glow */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </mesh>

      {/* Outer shell — larger dodecahedron */}
      <mesh ref={shellRef}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Orbital rings */}
      <OrbitalRing
        radius={1.5}
        tilt={Math.PI * 0.35}
        rotationSpeed={0.2}
        color="#6366f1"
        opacity={0.15}
      />
      <OrbitalRing
        radius={1.8}
        tilt={Math.PI * 0.55}
        rotationSpeed={-0.15}
        color="#8b5cf6"
        opacity={0.1}
      />
      <OrbitalRing
        radius={2.2}
        tilt={Math.PI * 0.25}
        rotationSpeed={0.1}
        color="#a78bfa"
        opacity={0.06}
      />

      {/* Orbiting data fragments */}
      {fragments.map((f, i) => (
        <DataFragment key={i} {...f} />
      ))}

      {/* Neural network */}
      <NeuralNetwork />
    </group>
  );
}
