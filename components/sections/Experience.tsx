"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../SectionHeading";
import { experiences } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
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
        const slides = gsap.utils.toArray<HTMLElement>(".exp-slide", stage);
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
        gsap.set(".exp-progress", { autoAlpha: 1 });

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
          const company = slide.querySelector(".exp-company");
          const detail = slide.querySelectorAll(".exp-detail");

          // Overlapping crossfade: the incoming slide starts before the
          // outgoing one finishes, so the stage is never empty.
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
        // Keep the timeline's full duration so the last slide holds
        tl.to({}, { duration: 0.4 }, count - 0.4);

        tl.to(
          ".exp-bar",
          { scaleX: 1, ease: "none", duration: count },
          0
        );

        return () => {
          gsap.set(stage, { clearProps: "height" });
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <SectionHeading
          index="02"
          label="Experience"
          title="Where I've worked"
        />

        <div ref={stageRef} className="relative">
          {experiences.map((exp, i) => (
            <article
              key={exp.company}
              className="exp-slide border-t border-line py-12 first:border-t-0 lg:flex lg:items-center"
            >
              <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className="relative">
                  <span
                    aria-hidden
                    className="display text-outline pointer-events-none absolute -top-10 left-0 -z-10 text-[clamp(5rem,11vw,11rem)] opacity-50 select-none lg:-top-16"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="label mb-4">{exp.period}</p>
                  <h3 className="exp-company display text-[clamp(2.2rem,4.8vw,5.2rem)] uppercase leading-[0.95] text-foreground">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="exp-detail serif-accent mt-3 text-[clamp(1.4rem,2.2vw,2.2rem)] text-muted">
                    {exp.role}
                  </p>
                </div>

                <div>
                  <p className="exp-detail max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                    {exp.description}
                  </p>
                  <ul className="exp-detail mt-6 flex flex-wrap gap-2">
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
          <div className="exp-progress invisible absolute bottom-0 left-0 right-0 hidden items-center gap-5 opacity-0 lg:flex">
            <span className="label !text-accent">
              <span ref={counterRef}>01</span> / {String(experiences.length).padStart(2, "0")}
            </span>
            <span className="relative h-px grow bg-line">
              <span className="exp-bar absolute inset-0 origin-left scale-x-0 bg-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
