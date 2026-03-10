"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BlurFade } from "../magicui/blur-fade";
import { HyperText } from "../magicui/hyper-text";
import { Meteors } from "../magicui/meteors";

const Scene = dynamic(() => import("../three/Scene"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Aurora gradient background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[128px] animate-pulse-glow [animation-delay:1s]" />
      </div>

      {/* Meteors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Meteors number={15} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 grid lg:grid-cols-2 items-center gap-8 lg:gap-4">
        {/* Left: Text content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <BlurFade delay={0.2}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-700 dark:text-zinc-400 backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Founding Engineer at Thesys
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <HyperText
              className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl py-1"
              duration={1200}
              delay={600}
              animateOnHover
            >
              HRIJUL
            </HyperText>
            <HyperText
              className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent sm:text-6xl lg:text-7xl py-1"
              duration={1200}
              delay={900}
              animateOnHover
            >
              BHATNAGAR
            </HyperText>
          </BlurFade>

          <BlurFade delay={0.7}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg lg:mx-0 mx-auto">
              Building the future of{" "}
              <span className="text-zinc-900 dark:text-white font-semibold">
                generative UI
              </span>{" "}
              — turning LLM outputs into live, interactive interfaces.
              Engineer, cybersecurity enthusiast, and maker of things.
            </p>
          </BlurFade>

          <BlurFade delay={0.9}>
            <div className="mt-8 flex flex-wrap items-center gap-4 lg:justify-start justify-center">
              <a
                href="#projects"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-7 text-sm font-medium text-white dark:text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2 transition-colors group-hover:text-white">
                  View my work
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 dark:border-white/[0.1] bg-white/90 dark:bg-white/[0.04] px-7 text-sm font-medium text-zinc-900 dark:text-zinc-200 backdrop-blur-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                Get in touch
              </a>
            </div>
          </BlurFade>

          {/* Terminal-style status line */}
          <BlurFade delay={1.1}>
            <div className="mt-10 inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-white/[0.06] bg-white/90 dark:bg-white/[0.02] px-4 py-2 backdrop-blur-xl font-mono text-xs text-zinc-600 dark:text-zinc-600 shadow-sm">
              <span className="text-emerald-500">$</span>
              <span>
                location:{" "}
                <span className="text-zinc-700 dark:text-zinc-400">
                  bengaluru
                </span>{" "}
                | stack:{" "}
                <span className="text-zinc-700 dark:text-zinc-400">
                  ts, react, llms
                </span>{" "}
                | status:{" "}
                <span className="text-emerald-500">building</span>
              </span>
              <span className="animate-pulse">_</span>
            </div>
          </BlurFade>
        </div>

        {/* Right: 3D Cyber Figure */}
        <div className="relative order-1 lg:order-2 h-[350px] sm:h-[420px] lg:h-[550px]">
          <Scene />
          {/* Glow behind the figure */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/8 blur-[80px]" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
            Scroll
          </span>
          <svg
            className="h-4 w-4 text-zinc-400 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
