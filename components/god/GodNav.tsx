"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { NavContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger);

export default function GodNav({ content }: { content: NavContent }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const st = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: "max",
        scrub: 0.4,
      },
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div
        ref={progressRef}
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent"
      />
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[110rem] items-center justify-between px-5 sm:px-8"
      >
        <a href="#top" className="god-deva flex items-baseline gap-2 text-lg">
          <span className="text-accent">{content.logoAccent}</span>
          <span className="hidden text-foreground sm:inline">
            {content.logoText}
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {content.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group label flex items-baseline gap-1.5 !text-foreground/70 transition-colors hover:!text-foreground"
              >
                <span className="god-deva text-[0.7rem] text-accent">
                  {link.index}
                </span>
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <span className="label hidden xl:block">{content.location}</span>
          {content.externalLink && (
            <a
              href={content.externalLink.href}
              className="group inline-flex items-center gap-2 border border-accent/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-accent transition-all duration-300 hover:bg-accent hover:text-accent-ink hover:shadow-[0_0_24px_rgba(240,194,75,0.35)]"
            >
              {content.externalLink.label}
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
