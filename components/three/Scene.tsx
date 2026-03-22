"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

const CyberFigure = lazy(() => import("./CyberFigure"));

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        frameloop={visible ? "always" : "never"}
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
