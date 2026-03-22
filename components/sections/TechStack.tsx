"use client";

import { Marquee } from "../magicui/marquee";
import { BlurFade } from "../magicui/blur-fade";

const techStack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "LLMs",
  "Generative UI",
  "Three.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "GraphQL",
  "Express.js",
  "Electron",
  "WebSockets",
  "REST APIs",
];

function TechPill({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/[0.08] bg-white/95 dark:bg-zinc-900/80 px-5 py-2.5 shadow-sm shadow-zinc-900/5 dark:shadow-black/10 mx-2">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function TechStack() {
  const half = Math.ceil(techStack.length / 2);
  const firstRow = techStack.slice(0, half);
  const secondRow = techStack.slice(half);

  return (
    <section className="relative py-24 overflow-hidden section-dots section-blob-right">
      <div className="glow-line" />
      <div className="glow-line-bloom" />
      <div className="mx-auto max-w-6xl px-6 mb-12">
        <BlurFade delay={0.1}>
          <p className="text-center text-sm font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-500">
            Technologies I work with
          </p>
        </BlurFade>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[var(--background)] to-transparent" />

        <Marquee pauseOnHover className="[--duration:30s] [--gap:1.25rem] mb-4">
          {firstRow.map((tech) => (
            <TechPill key={tech} name={tech} />
          ))}
        </Marquee>
        <Marquee
          pauseOnHover
          reverse
          className="[--duration:35s] [--gap:1.25rem]"
        >
          {secondRow.map((tech) => (
            <TechPill key={tech} name={tech} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
