"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techStack } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function Row({
  items,
  outlined,
  trackClass,
}: {
  items: string[];
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
                  className={`display whitespace-nowrap px-6 text-[clamp(2.2rem,4.5vw,4.5rem)] uppercase sm:px-9 ${
                    outlined ? "text-outline-strong" : "text-foreground"
                  }`}
                >
                  {tech}
                </span>
                <span className="text-xl text-accent">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const t1 = gsap.to(".marquee-a", {
        xPercent: -50,
        ease: "none",
        duration: 42,
        repeat: -1,
      });
      const t2 = gsap.fromTo(
        ".marquee-b",
        { xPercent: -50 },
        { xPercent: 0, ease: "none", duration: 48, repeat: -1 }
      );

      // Scroll velocity feeds marquee speed and skew
      const skewTo = gsap.quickTo(".marquee-wrap", "skewX", {
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

  const half = Math.ceil(techStack.length / 2);

  return (
    <section
      ref={sectionRef}
      aria-label="Technologies I work with"
      className="cv-auto overflow-hidden border-t border-line py-20 sm:py-24"
    >
      <p className="label mb-12 px-5 text-center sm:px-8">
        Technologies I work with
      </p>
      <div className="marquee-wrap space-y-4 will-change-transform">
        <Row items={techStack.slice(0, half)} trackClass="marquee-a" />
        <Row items={techStack.slice(half)} outlined trackClass="marquee-b" />
      </div>
    </section>
  );
}
