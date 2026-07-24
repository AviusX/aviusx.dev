"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../SectionHeading";
import LazyMount from "../gl/LazyMount";
import CardShader from "../gl/CardShader";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const wraps = gsap.utils.toArray<HTMLElement>(
        ".proj-wrap",
        sectionRef.current
      );

      // The wraps are position:sticky, so their bounding rects are unreliable
      // whenever ScrollTrigger refreshes mid-scroll (the element may be
      // measured in its "stuck" position). Derive trigger points from static
      // layout offsets instead, which sticky positioning never affects.
      const layoutTop = (el: HTMLElement) => {
        let y = 0;
        let node: HTMLElement | null = el;
        while (node) {
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return y;
      };

      wraps.forEach((wrap, i) => {
        const card = wrap.querySelector(".proj-card");

        // Transform-only entrance: the card must never change opacity, so it
        // can never be caught invisible regardless of scroll direction.
        gsap.from(card, {
          y: 60,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            start: () => layoutTop(wrap) - window.innerHeight * 0.94,
            end: () => layoutTop(wrap) - window.innerHeight * 0.94 + 1,
            once: true,
          },
        });

        // Recede via scale only while the next card slides over. The card
        // stays fully opaque: fading it would let the text of deeper cards
        // in the stack bleed through its background.
        if (i < wraps.length - 1) {
          const next = wraps[i + 1];
          gsap.to(card, {
            scale: 0.955,
            ease: "none",
            scrollTrigger: {
              start: () => layoutTop(next) - window.innerHeight * 0.65,
              end: () => layoutTop(next) - window.innerHeight * 0.18,
              scrub: 0.4,
            },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <SectionHeading
          index="03"
          label="Projects"
          title="Things I've built"
        />

        <div>
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="proj-wrap md:sticky"
              style={{ top: `calc(13vh + ${i * 1.75}rem)` }}
            >
              <div
                className="proj-card mb-10 origin-top border border-line bg-surface will-change-transform md:mb-[16vh]"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                  <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-14">
                    <div>
                      <div className="mb-8 flex items-center justify-between">
                        <span className="label !text-accent">
                          {String(i + 1).padStart(2, "0")}
                          {project.featured ? " / Featured" : ""}
                        </span>
                        <span className="label hidden sm:block">
                          {project.tags[0]}
                        </span>
                      </div>
                      <h3 className="display text-[clamp(2rem,4.8vw,4.8rem)] uppercase leading-[0.95] text-foreground transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-6">
                      <ul className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="label border border-line px-3 py-1.5 !text-foreground/70"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-6">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group label inline-flex items-center gap-1.5 !text-accent"
                          >
                            Visit site
                            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                              <ArrowIcon />
                            </span>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group label inline-flex items-center gap-1.5 !text-foreground"
                          >
                            GitHub
                            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                              <ArrowIcon />
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden min-h-[420px] border-l border-line md:block">
                    {project.featured ? (
                      <LazyMount className="absolute inset-0">
                        <CardShader seed={i + 1} hovered={hovered === i} />
                      </LazyMount>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span
                          aria-hidden
                          className="display text-outline select-none text-[10rem]"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
