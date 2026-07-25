"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rich from "../Rich";
import type { HeroContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas = dynamic(() => import("../gl/HeroCanvas"), { ssr: false });

function Chars({
  text,
  base = 0,
  step = 0.04,
}: {
  text: string;
  base?: number;
  step?: number;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={i} className="hero-mask">
          <span
            className="hero-char"
            style={{ "--d": `${base + i * step}s` } as CSSProperties}
          >
            {char}
          </span>
        </span>
      ))}
    </>
  );
}

export default function Hero({ content }: { content: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showGL, setShowGL] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Mount the WebGL background only after the browser is idle, so the
    // SSR'd hero text always paints first.
    const hasRic = "requestIdleCallback" in window;
    const id = hasRic
      ? window.requestIdleCallback(() => setShowGL(true))
      : window.setTimeout(() => setShowGL(true), 250);
    const cancel = (handle: number) =>
      hasRic ? window.cancelIdleCallback(handle) : clearTimeout(handle);

    const ctx = gsap.context(() => {
      const scrub = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      };
      gsap.to(line1Ref.current, { xPercent: -7, ease: "none", scrollTrigger: scrub });
      gsap.to(line2Ref.current, { xPercent: 7, ease: "none", scrollTrigger: scrub });
      gsap.to(bottomRef.current, { yPercent: 30, opacity: 0, ease: "none", scrollTrigger: scrub });
    }, sectionRef);

    return () => {
      cancel(id);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {showGL && <HeroCanvas />}

      <div className="relative z-10 mx-auto flex w-full max-w-[110rem] grow flex-col justify-between px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        {/* Badge */}
        <div className="hero-fade" style={{ "--d": "0.15s" } as CSSProperties}>
          <span className="inline-flex items-center gap-2.5 border border-line bg-surface/70 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5 rounded-full bg-accent text-accent ping-dot" />
            <span className="label !text-foreground/80">{content.badge}</span>
          </span>
        </div>

        {/* Kinetic name */}
        <div className="my-10">
          <h1 className="display select-none text-foreground">
            <span className="sr-only">
              {content.titleLine1} {content.titleLine2}
            </span>
            <span
              ref={line1Ref}
              aria-hidden
              className="flex justify-between text-[clamp(3.5rem,12.5vw,14.5rem)] will-change-transform"
            >
              <Chars text={content.titleLine1} base={0.1} />
            </span>

            <span
              aria-hidden
              className="hero-fade my-1 flex items-center gap-5 sm:my-2"
              style={{ "--d": "0.9s" } as CSSProperties}
            >
              <span className="hero-rule h-px grow bg-line" style={{ "--d": "1s" } as CSSProperties} />
              <span className="serif-accent text-[clamp(1.1rem,2.4vw,2rem)] text-muted">
                {content.akaPre}
                <span className="text-accent">{content.akaHighlight}</span>
                {content.akaPost}
              </span>
            </span>

            <span
              ref={line2Ref}
              aria-hidden
              className="flex justify-between text-[clamp(3.5rem,12.5vw,14.5rem)] will-change-transform"
            >
              <Chars text={content.titleLine2} base={0.3} />
            </span>
          </h1>
        </div>

        {/* Bottom grid */}
        <div
          ref={bottomRef}
          className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          <div>
            <p
              className="hero-fade max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
              style={{ "--d": "1.05s" } as CSSProperties}
            >
              <Rich
                segments={content.tagline}
                styles={{
                  em: "serif-accent text-[1.15em] text-foreground",
                  accent: "text-accent",
                }}
              />
            </p>

            <div
              className="hero-fade mt-8 flex flex-wrap items-center gap-6"
              style={{ "--d": "1.2s" } as CSSProperties}
            >
              <a
                href={content.primaryCta.href}
                className="group inline-flex h-12 items-center gap-3 bg-foreground px-7 text-sm font-medium text-background transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
              >
                {content.primaryCta.label}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={content.secondaryCta.href}
                className="group label relative !text-foreground"
              >
                {content.secondaryCta.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-foreground transition-colors group-hover:bg-accent" />
              </a>
            </div>
          </div>

          {/* Terminal status line */}
          <div
            className="hero-fade justify-self-start font-mono text-xs text-muted lg:justify-self-end"
            style={{ "--d": "1.35s" } as CSSProperties}
          >
            <div className="border border-line bg-surface/70 px-4 py-3 backdrop-blur-sm">
              <span className="text-accent">$</span>{" "}
              {content.terminal.map((part, i) => (
                <Fragment key={part.label}>
                  {i > 0 && " | "}
                  {part.label}:{" "}
                  <span
                    className={
                      part.accentValue ? "text-accent" : "text-foreground"
                    }
                  >
                    {part.value}
                  </span>
                </Fragment>
              ))}
              <span className="caret ml-1 inline-block h-3 w-[7px] translate-y-0.5 bg-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-fade absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
        style={{ "--d": "1.6s" } as CSSProperties}
      >
        <div className="scroll-nudge flex flex-col items-center gap-1.5">
          <span className="label !text-[0.55rem]">{content.scrollLabel}</span>
          <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
