"use client";

import SectionHeading from "../ui/SectionHeading";
import { MagicCard } from "../magicui/magic-card";
import { BorderBeam } from "../magicui/border-beam";
import { BlurFade } from "../magicui/blur-fade";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 px-6 section-dots section-blob-left overflow-hidden">
      <div className="glow-line" />
      <div className="glow-line-bloom" />
      {/* Decorative floating accents */}
      <div className="pointer-events-none absolute top-16 left-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/[0.02] dark:to-purple-500/[0.02] blur-3xl animate-orb-float-reverse" />
      <div className="pointer-events-none absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-gradient-to-tl from-violet-500/8 to-indigo-500/8 dark:from-violet-500/[0.01] dark:to-indigo-500/[0.01] blur-3xl animate-orb-float" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Projects" title="Things I've built" />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <BlurFade
              key={project.title}
              delay={0.1 + i * 0.1}
              className={project.featured && i === 0 ? "md:col-span-2" : ""}
            >
              <div className="relative h-full rounded-2xl">
                {project.featured && (
                  <BorderBeam
                    size={150}
                    duration={10}
                    colorFrom="#6366f1"
                    colorTo="#a855f7"
                    borderWidth={1}
                  />
                )}
                <MagicCard
                  className="h-full rounded-2xl"
                  gradientSize={350}
                  gradientColor="rgba(99,102,241,0.12)"
                  gradientFrom="#6366f1"
                  gradientTo="#a855f7"
                  gradientOpacity={0.2}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {project.featured && (
                          <span className="mb-2 inline-block text-xs font-medium tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                            Featured
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 transition-all hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/[0.12] hover:scale-110 backdrop-blur-xl"
                            aria-label="View source"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 transition-all hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/[0.12] hover:scale-110 backdrop-blur-xl"
                            aria-label="View live"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-100 dark:bg-white/[0.05] px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-white/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </MagicCard>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
