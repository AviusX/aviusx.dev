"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 300,
  gradientColor,
  gradientOpacity = 0.25,
  gradientFrom = "#6366f1",
  gradientTo = "#a855f7",
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = mouseX.get();
    const y = mouseY.get();
    const distances = {
      left: x,
      right: rect.width - x,
      top: y,
      bottom: rect.height - y,
    };
    const closestEdge = Object.entries(distances).reduce(
      (closest, [edge, distance]) =>
        distance < closest.distance ? { edge, distance } : closest,
      { edge: "left", distance: distances.left }
    ).edge;
    switch (closestEdge) {
      case "left":
        return animate(mouseX, -gradientSize);
      case "right":
        return animate(mouseX, rect.width + gradientSize);
      case "top":
        return animate(mouseY, -gradientSize);
      case "bottom":
        return animate(mouseY, rect.height + gradientSize);
      default:
        animate(mouseX, -gradientSize);
        animate(mouseY, -gradientSize);
    }
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const handleOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset();
    };
    const handleVis = () => {
      if (document.visibilityState !== "visible") reset();
    };
    window.addEventListener("pointerout", handleOut);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", handleVis);
    return () => {
      window.removeEventListener("pointerout", handleOut);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", handleVis);
    };
  }, [reset]);

  const spotlightColor = gradientColor || "rgba(99,102,241,0.2)";

  const borderGradient = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      transparent 100%
    )
  `;

  const spotlight = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 100%)
  `;

  return (
    <div className={cn("group relative rounded-2xl", className)}>
      {/* Animated border glow on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: borderGradient,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Card body */}
      <div
        ref={ref}
        onPointerMove={(e) => {
          handlePointerMove(e);
          setIsHovering(true);
        }}
        onPointerLeave={() => {
          reset();
          setIsHovering(false);
        }}
        className="relative overflow-hidden rounded-[inherit] border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm shadow-zinc-900/5 dark:shadow-black/20"
      >
        {/* Spotlight overlay - visible on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: spotlight,
            opacity: isHovering ? gradientOpacity : 0,
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
