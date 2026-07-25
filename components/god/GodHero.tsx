"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rich from "../Rich";
import type { HeroContent } from "@/lib/site/types";

gsap.registerPlugin(ScrollTrigger);

const GodHeroCanvas = dynamic(() => import("./gl/GodHeroCanvas"), {
  ssr: false,
});

function Chars({
  text,
  base = 0,
  step = 0.05,
  charClass = "",
}: {
  text: string;
  base?: number;
  step?: number;
  charClass?: string;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={i} className="hero-mask">
          <span
            className={`hero-char ${charClass}`}
            style={{ "--d": `${base + i * step}s` } as CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </>
  );
}

export default function GodHero({ content }: { content: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showGL, setShowGL] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Mount the WebGL scene only once the browser is idle so the SSR'd
    // divine text (and CSS halo) always paint first.
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
      gsap.to(centerRef.current, {
        yPercent: -12,
        scale: 0.96,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: scrub,
      });
      gsap.to(bottomRef.current, {
        yPercent: 40,
        opacity: 0,
        ease: "none",
        scrollTrigger: scrub,
      });
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
      {showGL && <GodHeroCanvas />}

      {/* SSR-painted divine halo: glows before any JS loads */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="god-halo divine-pulse h-[72vmin] w-[72vmin]" />
        <div className="god-halo-ring absolute left-1/2 top-1/2 h-[84vmin] w-[84vmin] -translate-x-1/2 -translate-y-1/2" />
        <div className="god-halo-ring god-halo-ring--reverse absolute left-1/2 top-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div
        ref={centerRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl grow flex-col items-center justify-center px-5 pb-32 pt-28 text-center sm:px-8"
      >
        {/* Badge */}
        <div className="hero-fade" style={{ "--d": "0.15s" } as CSSProperties}>
          <span className="inline-flex max-w-full items-center gap-2 border border-line bg-surface/60 px-3 py-2 backdrop-blur-sm sm:gap-2.5 sm:px-4">
            <span className="relative flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent text-accent ping-dot" />
            <span className="label !text-[0.6rem] !tracking-[0.14em] !text-foreground/85 sm:!text-[0.6875rem] sm:!tracking-[0.22em]">
              {content.badge}
            </span>
          </span>
        </div>

        {/* Crown flourish */}
        {content.crown && (
          <p
            aria-hidden
            className="god-deva hero-fade mt-10 text-[clamp(1.3rem,3vw,2.4rem)] text-accent"
            style={{ "--d": "0.35s" } as CSSProperties}
          >
            {content.crown}
          </p>
        )}

        {/* Divine name */}
        <h1 className="god-display mt-4 select-none">
          <span className="sr-only">
            {content.titleLine1} {content.titleLine2} — Devo ke Dev, the god
            form of Hrijul Bhatnagar (AviusX)
          </span>
          {/* Gradient is applied per character: background-clip:text does
              not survive animated descendant layers in Chromium. */}
          <span
            aria-hidden
            className="block text-[clamp(4rem,16vw,13rem)] leading-[0.95]"
          >
            <span className="block">
              <Chars
                text={content.titleLine1}
                base={0.25}
                charClass="god-gradient-text"
              />
            </span>
            <span className="block">
              <Chars
                text={content.titleLine2}
                base={0.55}
                charClass="god-gradient-text"
              />
            </span>
          </span>
        </h1>

        {/* Mortal identity */}
        <div
          aria-hidden
          className="hero-fade mt-8 flex w-full max-w-2xl items-center gap-5"
          style={{ "--d": "1.1s" } as CSSProperties}
        >
          <span
            className="hero-rule h-px w-6 shrink-0 bg-accent/40 sm:w-auto sm:grow"
            style={{ "--d": "1.15s" } as CSSProperties}
          />
          <span className="god-ink-shadow text-[clamp(0.95rem,1.9vw,1.35rem)] italic text-foreground/80">
            {content.akaPre}
            <span className="not-italic text-accent">
              {content.akaHighlight}
            </span>
          </span>
          <span
            className="hero-rule h-px w-6 shrink-0 bg-accent/40 sm:w-auto sm:grow"
            style={{ "--d": "1.15s" } as CSSProperties}
          />
        </div>

        {/* Tagline */}
        <p
          className="god-ink-shadow hero-fade mt-7 max-w-2xl text-lg leading-relaxed text-foreground/75 sm:text-xl"
          style={{ "--d": "1.25s" } as CSSProperties}
        >
          <Rich
            segments={content.tagline}
            styles={{
              em: "god-deva not-italic text-[1.05em] text-foreground",
              accent: "god-display text-[0.95em] tracking-wide text-accent",
            }}
          />
        </p>

        {/* CTAs */}
        <div
          className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-6"
          style={{ "--d": "1.4s" } as CSSProperties}
        >
          <a
            href={content.primaryCta.href}
            className="god-btn group inline-flex h-13 items-center gap-2 whitespace-nowrap bg-accent px-5 text-xs font-semibold uppercase tracking-[0.08em] text-accent-ink transition-all duration-300 hover:shadow-[0_0_36px_rgba(240,194,75,0.45)] sm:gap-3 sm:px-8 sm:text-sm sm:tracking-[0.14em]"
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

      {/* Bottom strip: sacred scroll, descend, easter egg */}
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-5 z-10 flex items-end justify-between gap-6 px-5 sm:px-8"
      >
        <div
          className="hero-fade hidden font-mono text-xs text-muted md:block"
          style={{ "--d": "1.55s" } as CSSProperties}
        >
          <div className="border border-line bg-surface/60 px-4 py-3 backdrop-blur-sm">
            <span className="text-accent">ॐ</span>{" "}
            {content.terminal.map((part, i) => (
              <Fragment key={part.label}>
                {i > 0 && " ॥ "}
                {part.label}:{" "}
                <span
                  className={
                    part.accentValue ? "text-saffron" : "text-foreground"
                  }
                >
                  {part.value}
                </span>
              </Fragment>
            ))}
            <span className="caret ml-1 inline-block h-3 w-[7px] translate-y-0.5 bg-accent" />
          </div>
        </div>

        <div
          className="hero-fade absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ "--d": "1.7s" } as CSSProperties}
        >
          <div className="scroll-nudge flex flex-col items-center gap-1.5">
            <span className="label !text-[0.55rem]">{content.scrollLabel}</span>
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </div>

        {content.easterEgg && (
          <p
            className="hero-fade hidden font-mono text-[0.65rem] italic text-muted/70 md:block"
            style={{ "--d": "1.85s" } as CSSProperties}
          >
            “{content.easterEgg}”
          </p>
        )}
      </div>
    </section>
  );
}
