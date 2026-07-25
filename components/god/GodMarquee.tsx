"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MarqueeContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger);

function Row({
  items,
  separator,
  outlined,
  trackClass,
}: {
  items: string[];
  separator: string;
  outlined?: boolean;
  trackClass: string;
}) {
  return (
    <div className="overflow-hidden">
      <div className={`${trackClass} flex w-max items-center will-change-transform`}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((tech) => (
              <span key={tech} className="flex items-center">
                <span
                  className={`god-display whitespace-nowrap px-6 text-[clamp(2rem,4.2vw,4.2rem)] uppercase sm:px-9 ${
                    outlined ? "god-outline-text" : "god-gradient-text"
                  }`}
                >
                  {tech}
                </span>
                <span className="god-deva text-xl text-saffron">
                  {separator}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GodMarquee({ content }: { content: MarqueeContent }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const t1 = gsap.to(".gmarquee-a", {
        xPercent: -50,
        ease: "none",
        duration: 42,
        repeat: -1,
      });
      const t2 = gsap.fromTo(
        ".gmarquee-b",
        { xPercent: -50 },
        { xPercent: 0, ease: "none", duration: 48, repeat: -1 }
      );

      // Scroll velocity feeds marquee speed and skew — anime speed lines
      const skewTo = gsap.quickTo(".gmarquee-wrap", "skewX", {
        duration: 0.4,
        ease: "power2.out",
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 900);
          gsap.to([t1, t2], {
            timeScale: boost,
            duration: 0.3,
            overwrite: true,
          });
          skewTo(gsap.utils.clamp(-5, 5, v / 350));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const half = Math.ceil(content.items.length / 2);

  return (
    <section
      ref={sectionRef}
      aria-label={content.label}
      className="cv-auto overflow-hidden border-t border-line py-20 sm:py-24"
    >
      <p className="label mb-12 px-5 text-center sm:px-8">{content.label}</p>
      <div className="gmarquee-wrap space-y-4 will-change-transform">
        <Row
          items={content.items.slice(0, half)}
          separator={content.separator}
          trackClass="gmarquee-a"
        />
        <Row
          items={content.items.slice(half)}
          separator={content.separator}
          outlined
          trackClass="gmarquee-b"
        />
      </div>
    </section>
  );
}
