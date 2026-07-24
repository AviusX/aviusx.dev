"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionHeading from "../SectionHeading";
import Magnetic from "../Magnetic";
import { interests, subdomains } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, SplitText);

const icons: Record<string, React.ReactNode> = {
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
  const sectionRef = useRef<HTMLElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let proseSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      gsap.from(".about-chip", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".about-chips",
          start: "top 88%",
          once: true,
        },
      });

      // Interest cards: staggered entrance + opposing column parallax
      gsap.from(".about-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".about-cards",
          start: "top 85%",
          once: true,
        },
      });
      gsap.to(".about-col-a", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-cards",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(".about-col-b", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-cards",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    // The word-split "kinetic read" effect dims text and rewrites the DOM,
    // so only set it up once the section approaches the viewport: the
    // initial page stays accessible and the split work is deferred.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || proseSplit) return;
        io.disconnect();
        ctx.add(() => {
          proseSplit = SplitText.create(proseRef.current, {
            type: "words",
            aria: "none",
          });
          gsap.from(proseSplit.words, {
            opacity: 0.12,
            stagger: 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: proseRef.current,
              start: "top 78%",
              end: "bottom 45%",
              scrub: 0.5,
            },
          });
        });
      },
      { rootMargin: "0px 0px 15% 0px" }
    );
    if (proseRef.current) io.observe(proseRef.current);

    return () => {
      io.disconnect();
      proseSplit?.revert();
      ctx.revert();
    };
  }, []);

  const colA = interests.filter((_, i) => i % 2 === 0);
  const colB = interests.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="cv-auto relative border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <SectionHeading index="01" label="About" title="A bit about me" />

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-24">
          <div>
            <div
              ref={proseRef}
              className="space-y-6 text-xl leading-relaxed text-foreground sm:text-2xl"
            >
              <p>
                I&apos;m a software engineer who thrives at the intersection of
                AI and frontend craft. As a Founding Engineer at{" "}
                <a
                  href="https://thesys.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serif-accent text-[1.1em] text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Thesys
                </a>
                , I build generative UI infrastructure that makes AI agents
                actually useful — turning raw LLM outputs into real,
                interactive interfaces people can use.
              </p>
              <p>
                Beyond engineering, I&apos;m deeply curious. I co-founded a
                cybersecurity community, shoot photos when the light is right,
                play guitar to decompress, and believe in building with
                intention.
              </p>
            </div>

            <div className="about-chips mt-12 flex flex-wrap gap-3">
              {subdomains.map((sub) => (
                <a
                  key={sub.title}
                  href={sub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`about-chip group inline-flex items-center gap-2.5 border border-line bg-surface px-5 py-2.5 transition-colors hover:border-accent ${
                    sub.comingSoon ? "pointer-events-none opacity-55" : ""
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {sub.title}
                  </span>
                  {sub.comingSoon && <span className="label">Soon</span>}
                  <svg
                    className="h-3 w-3 -translate-x-1 text-accent opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="about-cards grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
            {[colA, colB].map((col, ci) => (
              <div
                key={ci}
                className={`space-y-4 ${ci === 0 ? "about-col-a" : "about-col-b min-[480px]:mt-10"}`}
              >
                {col.map((interest) => (
                  <Magnetic key={interest.label} strength={0.12}>
                    <div className="about-card group border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent sm:p-6">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-line text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                        {icons[interest.icon]}
                      </div>
                      <h3 className="display wrap-anywhere text-lg uppercase text-foreground">
                        {interest.label}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted">
                        {interest.description}
                      </p>
                      {interest.link && (
                        <a
                          href={interest.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label wrap-anywhere mt-4 inline-flex items-center gap-1.5 !text-accent hover:underline"
                        >
                          {interest.linkLabel}
                          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </Magnetic>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
