"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WarpGridConfig {
  mobile: boolean;
  reducedMotion: boolean;
  cols: number;
  rows: number;
}

export default function WarpGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<WarpGridConfig | null>(null);

  // Detect environment once on mount
  useEffect(() => {
    const mobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setConfig({
      mobile,
      reducedMotion,
      cols: mobile ? 20 : 32,
      rows: mobile ? 14 : 22,
    });
  }, []);

  // Mutable refs for mouse, scroll, dark mode — no re-renders
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const darkRef = useRef(1.0);
  const rafRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const drawRef = useRef<(() => void) | null>(null);
  const timeRef = useRef(0);
  const dprRef = useRef(1);

  // Track mouse position
  useEffect(() => {
    if (config?.mobile) return; // No mouse tracking on mobile
    const onMove = (e: MouseEvent) => {
      // Use the same capped DPR as the canvas to keep coordinates aligned
      mouseRef.current.x = e.clientX * dprRef.current;
      mouseRef.current.y = e.clientY * dprRef.current;
    };
    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [config?.mobile]);

  // Track scroll position and restart RAF when WarpGrid becomes visible
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          scrollRef.current = window.scrollY;
          // Restart the animation loop if WarpGrid should be visible
          if (!isRunningRef.current && drawRef.current) {
            const heroHeight = window.innerHeight;
            const scrollAlpha = Math.min(1, Math.max(0, (scrollRef.current - heroHeight * 0.3) / (heroHeight * 0.5)));
            if (scrollAlpha >= 0.01) {
              isRunningRef.current = true;
              rafRef.current = requestAnimationFrame(drawRef.current);
            }
          }
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track dark mode
  useEffect(() => {
    const check = () => {
      darkRef.current = document.documentElement.classList.contains("dark")
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

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, config?.mobile ? 1 : 2);
    dprRef.current = dpr;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, [config?.mobile]);

  // Main animation loop
  useEffect(() => {
    if (!config || config.reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    handleResize();
    window.addEventListener("resize", handleResize);

    const { cols, rows, mobile } = config;
    const warpRadius = mobile ? 0 : 300;
    const warpStrength = 60;
    const lineAlphaBase = 0.10;
    const lineAlphaPulse = 0.03;
    const dotAlpha = 0.12;
    const dotSize = 1.8;
    const centerGlowAlpha = 0.03;

    function draw() {
      timeRef.current += 0.004;
      const t = timeRef.current;
      const w = canvas!.width;
      const h = canvas!.height;
      const scroll = scrollRef.current;
      const mouse = mouseRef.current;
      const isDark = darkRef.current > 0.5;

      ctx!.clearRect(0, 0, w, h);

      // Fade in after hero section — invisible at top, fully visible once scrolled past hero
      const heroHeight = window.innerHeight;
      const scrollAlpha = Math.min(1, Math.max(0, (scroll - heroHeight * 0.3) / (heroHeight * 0.5)));
      if (scrollAlpha < 0.01) {
        // Stop the loop entirely — the scroll listener will restart it
        isRunningRef.current = false;
        return;
      }
      ctx!.globalAlpha = scrollAlpha;

      // --- Light mode: much more subtle ---
      const modeAlphaScale = isDark ? 1.0 : 0.5;

      // Center glow
      if (isDark) {
        const grd = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
        grd.addColorStop(0, `rgba(99, 102, 241, ${centerGlowAlpha})`);
        grd.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx!.fillStyle = grd;
        ctx!.fillRect(0, 0, w, h);
      }

      const cellW = w / cols;
      const cellH = h / rows;
      const vanishX = w * 0.5 + Math.sin(scroll * 0.001) * w * 0.1;
      const vanishY = h * 0.45 + Math.cos(scroll * 0.0015) * h * 0.05;

      // Cache all grid points
      const points: { x: number; y: number; mDist: number }[][] = [];
      for (let i = 0; i <= cols; i++) {
        points[i] = [];
        for (let j = 0; j <= rows; j++) {
          let x = i * cellW;
          let y = j * cellH;

          // Perspective warp
          const dx0 = x - vanishX;
          const dy0 = y - vanishY;
          const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
          const maxDist = Math.sqrt(w * w + h * h) * 0.5;
          const perspective = 0.18 * (1 - dist0 / maxDist);
          x += dx0 * perspective;
          y += dy0 * perspective;

          // Mouse warp
          let mDist = 9999;
          if (!mobile && mouse.x > -1000) {
            const mdx = x - mouse.x;
            const mdy = y - mouse.y;
            mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < warpRadius) {
              const force = Math.pow((warpRadius - mDist) / warpRadius, 2);
              x += (mdx / mDist) * force * warpStrength;
              y += (mdy / mDist) * force * warpStrength;
            }
          }

          // Wave
          x += Math.sin(j * 0.25 + t * 1.8) * 2;
          y += Math.cos(i * 0.25 + t * 1.4) * 2;

          points[i][j] = { x, y, mDist };
        }
      }

      // Vertical lines (indigo)
      for (let i = 0; i <= cols; i++) {
        ctx!.beginPath();
        for (let j = 0; j <= rows; j++) {
          const p = points[i][j];
          if (j === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
        const pulse = Math.sin(i * 0.15 + t * 1.5) * lineAlphaPulse;
        const alpha = (lineAlphaBase + pulse) * modeAlphaScale;
        ctx!.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      // Horizontal lines (violet)
      for (let j = 0; j <= rows; j++) {
        ctx!.beginPath();
        for (let i = 0; i <= cols; i++) {
          const p = points[i][j];
          if (i === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
        const pulse = Math.cos(j * 0.15 + t * 1.2) * lineAlphaPulse;
        const alpha = (lineAlphaBase + pulse) * modeAlphaScale;
        ctx!.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      // Mouse proximity brightening
      if (!mobile && mouse.x > -1000) {
        const brightenRadius = warpRadius * 1.2;
        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            const p = points[i][j];
            if (p.mDist < brightenRadius) {
              const brightness = Math.pow(1 - p.mDist / brightenRadius, 2);
              if (i < cols) {
                const p2 = points[i + 1][j];
                ctx!.beginPath();
                ctx!.moveTo(p.x, p.y);
                ctx!.lineTo(p2.x, p2.y);
                ctx!.strokeStyle = `rgba(139, 92, 246, ${brightness * 0.5 * modeAlphaScale})`;
                ctx!.lineWidth = 2.2;
                ctx!.stroke();
              }
              if (j < rows) {
                const p2 = points[i][j + 1];
                ctx!.beginPath();
                ctx!.moveTo(p.x, p.y);
                ctx!.lineTo(p2.x, p2.y);
                ctx!.strokeStyle = `rgba(99, 102, 241, ${brightness * 0.5 * modeAlphaScale})`;
                ctx!.lineWidth = 2.2;
                ctx!.stroke();
              }
            }
          }
        }
      }

      // Intersection dots — batched into a single path for non-boosted dots
      ctx!.beginPath();
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const p = points[i][j];
          // Skip dots near mouse — they get individual styling below
          if (!mobile && mouse.x > -1000 && p.mDist < warpRadius) continue;
          ctx!.moveTo(p.x + dotSize, p.y);
          ctx!.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        }
      }
      ctx!.fillStyle = `rgba(167, 139, 250, ${dotAlpha * 0.8 * modeAlphaScale})`;
      ctx!.fill();

      // Mouse-boosted dots drawn individually for per-dot alpha
      if (!mobile && mouse.x > -1000) {
        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            const p = points[i][j];
            if (p.mDist >= warpRadius) continue;
            const alpha = dotAlpha * modeAlphaScale + (1 - p.mDist / warpRadius) * 0.6;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx!.fill();
          }
        }
      }

      ctx!.globalAlpha = 1; // Reset for next frame's clearRect
      rafRef.current = requestAnimationFrame(draw);
    }

    drawRef.current = draw;
    isRunningRef.current = true;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      drawRef.current = null;
      isRunningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [config, handleResize]);

  if (!config) return null;

  // Reduced motion: static faint grid via CSS
  if (config.reducedMotion) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -3,
        pointerEvents: "none",
      }}
    />
  );
}
