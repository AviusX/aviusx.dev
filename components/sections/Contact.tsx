"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../SectionHeading";
import Magnetic from "../Magnetic";
import { email, socialLinks } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // Per-character wave on the giant email address
      const chars = gsap.utils.toArray<HTMLElement>(
        ".email-char",
        emailRef.current
      );
      let wave: gsap.core.Timeline | null = null;
      const onEnter = () => {
        if (wave?.isActive()) return;
        wave = gsap
          .timeline()
          .to(chars, {
            yPercent: -24,
            duration: 0.24,
            ease: "power2.out",
            stagger: 0.012,
          })
          .to(
            chars,
            {
              yPercent: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.36)",
              stagger: 0.012,
            },
            0.18
          );
      };
      emailRef.current?.addEventListener("mouseenter", onEnter);
      return () => emailRef.current?.removeEventListener("mouseenter", onEnter);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="cv-auto relative border-t border-line px-5 pb-24 pt-28 sm:px-8 sm:pt-36"
    >
      <div className="mx-auto max-w-[110rem]">
        <SectionHeading
          index="04"
          label="Contact"
          title="Let's work together"
        />

        <p className="contact-reveal max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Have an idea, a project, or just want to chat? I&apos;d love to hear
          from you. Drop me a message and I&apos;ll get back to you as soon as
          I can.
        </p>

        <div className="contact-reveal mt-16 sm:mt-20">
          <p className="label mb-5">Write to me at</p>
          <a
            ref={emailRef}
            href={`mailto:${email}`}
            aria-label={`Email ${email}`}
            className="group inline-block"
          >
            <span
              aria-hidden
              className="display block whitespace-nowrap text-[clamp(0.8rem,4vw,4.6rem)] uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent"
            >
              {email.split("").map((char, i) => (
                <span key={i} className="email-char inline-block will-change-transform">
                  {char}
                </span>
              ))}
            </span>
            <span className="mt-2 block h-px w-full bg-line">
              <span className="block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
          </a>
        </div>

        <div className="contact-reveal mt-20 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {socialLinks.map((link) => (
            <Magnetic key={link.label} strength={0.1} className="bg-background">
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.url.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="group flex h-full flex-col justify-between gap-8 p-6 transition-colors duration-300 hover:bg-surface sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="label">{link.label}</span>
                  <span className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                </div>
                <span className="break-all text-sm font-medium text-foreground/85 transition-colors group-hover:text-foreground">
                  {link.handle}
                </span>
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
