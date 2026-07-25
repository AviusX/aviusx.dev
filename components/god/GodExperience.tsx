"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GodSectionHeading from "./GodSectionHeading";
import type { ExperienceContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger);

export default function GodExperience({
  content,
}: {
  content: ExperienceContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Pinned scrub deck on desktop; mobile and reduced-motion get the
    // plain stacked list that is already in the markup.
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const stage = stageRef.current;
        if (!stage) return;
        const slides = gsap.utils.toArray<HTMLElement>(".gexp-slide", stage);
        const count = slides.length;

        gsap.set(stage, { height: "72vh" });
        gsap.set(slides, {
          position: "absolute",
          inset: 0,
          borderTopWidth: 0,
          paddingTop: 0,
          paddingBottom: 0,
        });
        gsap.set(slides.slice(1), { autoAlpha: 0 });
        gsap.set(".gexp-progress", { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 18%",
            end: `+=${count * 90}%`,
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const active = Math.min(
                count - 1,
                Math.floor(self.progress * count)
              );
              if (counterRef.current) {
                counterRef.current.textContent = String(active + 1).padStart(2, "0");
              }
            },
          },
        });

        slides.forEach((slide, i) => {
          const company = slide.querySelector(".gexp-company");
          const detail = slide.querySelectorAll(".gexp-detail");

          if (i > 0) {
            tl.fromTo(
              slide,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.3 },
              i - 0.18
            );
            tl.fromTo(
              company,
              { yPercent: 55, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
              i - 0.16
            );
            tl.fromTo(
              detail,
              { y: 44, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.06 },
              i - 0.08
            );
          }
          if (i < count - 1) {
            tl.to(
              slide,
              { autoAlpha: 0, y: -30, duration: 0.26, ease: "power2.in" },
              i + 0.74
            );
          }
        });
        tl.to({}, { duration: 0.4 }, count - 0.4);

        tl.to(".gexp-bar", { scaleX: 1, ease: "none", duration: count }, 0);

        return () => {
          gsap.set(stage, { clearProps: "height" });
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="eras"
      ref={sectionRef}
      className="relative border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <GodSectionHeading content={content.heading} />

        <div ref={stageRef} className="relative">
          {content.items.map((exp, i) => (
            <article
              key={exp.company}
              className="gexp-slide border-t border-line py-12 first:border-t-0 lg:flex lg:items-center"
            >
              <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className="relative">
                  <span
                    aria-hidden
                    className="god-deva pointer-events-none absolute -top-10 left-0 -z-10 select-none text-[clamp(5rem,11vw,11rem)] leading-none text-accent/10 lg:-top-16"
                  >
                    {["०१", "०२", "०३", "०४", "०५", "०६"][i] ??
                      String(i + 1).padStart(2, "0")}
                  </span>
                  {exp.era && (
                    <p className="label mb-2 !normal-case !tracking-[0.14em] !text-saffron">
                      {exp.era}
                    </p>
                  )}
                  <p className="label mb-4">{exp.period}</p>
                  <h3 className="gexp-company god-display god-gradient-text text-[clamp(2rem,4.2vw,4.6rem)] uppercase leading-[1]">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:opacity-80"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="gexp-detail mt-3 text-[clamp(1.2rem,1.9vw,1.9rem)] italic text-muted">
                    {exp.role}
                  </p>
                </div>

                <div>
                  <p className="gexp-detail max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                    {exp.description}
                  </p>
                  <ul className="gexp-detail mt-6 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <li
                        key={tag}
                        className="label border border-line px-3 py-1.5 !text-foreground/70"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}

          {/* Desktop scrub progress, revealed by JS only */}
          <div className="gexp-progress invisible absolute bottom-0 left-0 right-0 hidden items-center gap-5 opacity-0 lg:flex">
            <span className="label !text-accent">
              <span ref={counterRef}>01</span> / {String(content.items.length).padStart(2, "0")}
            </span>
            <span className="relative h-px grow bg-line">
              <span className="gexp-bar absolute inset-0 origin-left scale-x-0 bg-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
