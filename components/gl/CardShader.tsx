"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cssColor, onThemeChange, GL_NOISE, GL_VERTEX, type RGB } from "@/lib/gl";

const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform float uSeed;
uniform float uHover;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uAccent;

varying vec2 vUv;

${GL_NOISE}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float speed = 0.06 + uHover * 0.10;
  float t = uTime * speed + uSeed * 43.7;

  // Flowing accent field, unique per seed
  float f = fbm(p * (1.8 + uSeed * 0.6) + vec2(t, -t * 0.7));
  float f2 = fbm(p * 2.6 - vec2(t * 0.8, t * 0.4) + uSeed * 11.0);

  float blob = smoothstep(0.42, 0.9, f + 0.22 * uHover);
  float bands = abs(fract(f2 * 9.0) - 0.5);
  float line = smoothstep(0.09, 0.0, bands);

  vec3 col = uBg;
  col = mix(col, uAccent, blob * (0.55 + 0.45 * uHover));
  col = mix(col, uInk, line * 0.14 * (1.0 - blob));

  float g = hash(uv * uRes + mod(uTime, 100.0));
  col += (g - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function CardShader({
  seed,
  hovered,
}: {
  seed: number;
  hovered: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(hovered);

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
        alpha: false,
        antialias: false,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    wrap.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const readColors = () => ({
      bg: cssColor("--surface", [0.98, 0.97, 0.96]),
      ink: cssColor("--foreground", [0.08, 0.07, 0.06]),
      accent: cssColor("--accent-vivid", [0.08, 0.72, 0.65]),
    });

    let target = readColors();
    const current: { bg: RGB; ink: RGB; accent: RGB } = {
      bg: [...target.bg],
      ink: [...target.ink],
      accent: [...target.accent],
    };

    const program = new Program(gl, {
      vertex: GL_VERTEX,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uSeed: { value: seed },
        uHover: { value: 0 },
        uBg: { value: current.bg },
        uInk: { value: current.ink },
        uAccent: { value: current.accent },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const stopThemeWatch = onThemeChange(() => {
      target = readColors();
    });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const lerp3 = (a: RGB, b: RGB, t: number) => {
      a[0] += (b[0] - a[0]) * t;
      a[1] += (b[1] - a[1]) * t;
      a[2] += (b[2] - a[2]) * t;
    };

    let revealed = false;
    const tick = (time: number) => {
      if (!visible || document.hidden) return;

      const h = program.uniforms.uHover.value as number;
      program.uniforms.uHover.value =
        h + ((hoverRef.current ? 1 : 0) - h) * 0.07;

      lerp3(current.bg, target.bg, 0.08);
      lerp3(current.ink, target.ink, 0.08);
      lerp3(current.accent, target.accent, 0.08);

      program.uniforms.uTime.value = time;
      renderer.render({ scene: mesh });

      if (!revealed) {
        revealed = true;
        wrap.style.opacity = "1";
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      stopThemeWatch();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [seed]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="h-full w-full opacity-0 transition-opacity duration-700 ease-out"
    />
  );
}
