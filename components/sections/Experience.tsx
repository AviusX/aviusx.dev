"use client";

import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import { BlurFade } from "../magicui/blur-fade";
import { MagicCard } from "../magicui/magic-card";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="relative py-32 px-6 section-grid overflow-hidden">
      <div className="glow-line" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Experience" title="Where I've worked" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-white/10 to-transparent md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12 md:space-y-24">
            {experiences.map((exp, i) => (
              <BlurFade key={i} delay={i * 0.1} direction="up">
                <div className="relative grid gap-8 md:grid-cols-2">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 md:left-1/2 md:-translate-x-1/2 z-10">
                    <motion.div
                      className="relative"
                      whileInView={{ scale: [0, 1] }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.1 + 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <div className="h-3 w-3 rounded-full border-2 border-indigo-500 bg-white dark:bg-zinc-950" />
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-indigo-500/30 animate-ping" />
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`pl-8 md:pl-0 ${
                      i % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:col-start-2 md:pl-12"
                    }`}
                  >
                    <MagicCard
                      className="rounded-2xl"
                      gradientSize={300}
                      gradientColor="rgba(99,102,241,0.12)"
                      gradientFrom="#6366f1"
                      gradientTo="#a855f7"
                      gradientOpacity={0.2}
                    >
                      <div className="p-5 sm:p-6">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {exp.period}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            exp.company
                          )}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
                          {exp.description}
                        </p>
                        <div
                          className={`mt-4 flex flex-wrap gap-2 ${
                            i % 2 === 0 ? "md:justify-end" : ""
                          }`}
                        >
                          {exp.tags.map((tag) => (
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
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
