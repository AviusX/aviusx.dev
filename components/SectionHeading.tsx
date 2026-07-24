"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SectionHeading({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(titleRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
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
      gsap.from(".sh-rule", {
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
        <span className="label !text-accent">{index}</span>
        <span className="sh-rule h-px w-16 bg-accent" />
        <span className="label">{label}</span>
      </div>
      <h2
        ref={titleRef}
        className="display text-[clamp(2.75rem,7.5vw,7.5rem)] uppercase text-foreground"
      >
        {title}
      </h2>
    </div>
  );
}
