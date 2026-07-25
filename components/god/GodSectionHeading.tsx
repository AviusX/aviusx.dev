"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { SectionHeadingContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function GodSectionHeading({
  content,
}: {
  content: SectionHeadingContent;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Each split line carries its own gradient: background-clip:text on
      // the h2 would not survive the animated line layers in Chromium.
      const split = SplitText.create(titleRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "god-gradient-text",
      });
      gsap.from(split.lines, {
        yPercent: 112,
        rotate: 2,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          once: true,
        },
      });
      gsap.from(".gsh-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mb-16 sm:mb-20">
      <div className="mb-6 flex items-center gap-4">
        <span className="god-deva text-sm !text-accent">{content.index}</span>
        <span className="gsh-rule h-px w-16 bg-accent" />
        <span className="label">{content.label}</span>
        <span aria-hidden className="god-deva text-sm text-accent/60">
          ॥
        </span>
      </div>
      <h2
        ref={titleRef}
        className="god-display god-gradient-text text-[clamp(2.5rem,7vw,7rem)] uppercase"
      >
        {content.title}
      </h2>
    </div>
  );
}
