"use client";

import { BlurFade } from "../magicui/blur-fade";
import { MagicCard } from "../magicui/magic-card";
import SectionHeading from "../ui/SectionHeading";
import { interests, subdomains } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  camera: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  ),
  music: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  ),
  dumbbell: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  shield: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

export default function About() {
  return (
    <section
      id="about"
      className="relative py-32 px-6 section-dots overflow-hidden"
    >
      <div className="glow-line" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="About" title="A bit about me" />

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <BlurFade delay={0.1}>
              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-400">
                I&apos;m a software engineer who thrives at the intersection of
                AI and frontend craft. As a Founding Engineer at{" "}
                <a
                  href="https://thesys.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold underline decoration-indigo-500/30 underline-offset-4 hover:decoration-indigo-500 transition-colors"
                >
                  Thesys
                </a>
                , I build generative UI infrastructure that makes AI agents
                actually useful — turning raw LLM outputs into real, interactive
                interfaces people can use.
              </p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="mt-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-400">
                Beyond engineering, I&apos;m deeply curious. I co-founded a
                cybersecurity community, shoot photos when the light is right,
                play guitar to decompress, and believe in building with
                intention.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-3">
                {subdomains.map((sub) => (
                  <a
                    key={sub.title}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/[0.1] bg-white/95 dark:bg-zinc-950/50 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-300 backdrop-blur-2xl backdrop-saturate-150 shadow-sm transition-all hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5 ${
                      sub.comingSoon ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${sub.gradient}`} />
                    {sub.title}
                    {sub.comingSoon && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Soon</span>
                    )}
                    <svg className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                ))}
              </div>
            </BlurFade>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {interests.map((interest, i) => (
              <BlurFade key={interest.label} delay={0.15 + i * 0.1}>
                <MagicCard className="h-full">
                  <div className="flex h-full flex-col p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {iconMap[interest.icon]}
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {interest.label}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                      {interest.description}
                    </p>
                    {interest.link && (
                      <a
                        href={interest.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {interest.linkLabel}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
