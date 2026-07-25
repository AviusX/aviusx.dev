"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import GodSectionHeading from "./GodSectionHeading";
import Magnetic from "../Magnetic";
import Rich from "../Rich";
import type { AboutContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** God-flavored takes on the interest icons. */
const icons: Record<string, React.ReactNode> = {
  // The All-Seeing Eye
  camera: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  // Song of Creation
  music: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  ),
  // Tapasya — the sacred flame
  dumbbell: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  // Guardian of Realms — the trishul
  shield: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3c-.5 3.5 1.5 6 5 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 3c.5 3.5-1.5 6-5 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 22h5" />
    </svg>
  ),
};

export default function GodAbout({ content }: { content: AboutContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let proseSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      gsap.from(".gabout-chip", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".gabout-chips",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".gabout-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".gabout-cards",
          start: "top 85%",
          once: true,
        },
      });
      gsap.to(".gabout-col-a", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".gabout-cards",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(".gabout-col-b", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".gabout-cards",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    // Defer the word-split "kinetic read" until the section approaches
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

  const colA = content.interests.filter((_, i) => i % 2 === 0);
  const colB = content.interests.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="legend"
      ref={sectionRef}
      className="cv-auto relative border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <GodSectionHeading content={content.heading} />

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-24">
          <div>
            <div
              ref={proseRef}
              className="space-y-6 text-xl leading-relaxed text-foreground sm:text-2xl"
            >
              {content.paragraphs.map((paragraph, i) => (
                <p key={i}>
                  <Rich
                    segments={paragraph}
                    styles={{
                      em: "god-deva text-[1.05em] text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent",
                      accent: "text-accent",
                    }}
                  />
                </p>
              ))}
            </div>

            <div className="gabout-chips mt-12 flex flex-wrap gap-3">
              {content.subdomains.map((sub) => (
                <a
                  key={sub.title}
                  href={sub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`gabout-chip group inline-flex items-center gap-2.5 border border-line bg-surface px-5 py-2.5 transition-all hover:border-accent hover:shadow-[0_0_20px_rgba(240,194,75,0.18)] ${
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

          <div className="gabout-cards grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
            {[colA, colB].map((col, ci) => (
              <div
                key={ci}
                className={`space-y-4 ${ci === 0 ? "gabout-col-a" : "gabout-col-b min-[480px]:mt-10"}`}
              >
                {col.map((interest) => (
                  <Magnetic key={interest.label} strength={0.12}>
                    <div className="gabout-card group border border-line bg-surface p-5 transition-all duration-300 hover:border-accent hover:shadow-[0_0_28px_rgba(240,194,75,0.14)] sm:p-6">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-line text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                        {icons[interest.icon]}
                      </div>
                      <h3 className="god-display wrap-anywhere text-base uppercase tracking-wide text-foreground">
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
