"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";

const CyberFigure = lazy(() => import("./CyberFigure"));

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <CyberFigure />
        </Suspense>
      </Canvas>
    </div>
  );
}
