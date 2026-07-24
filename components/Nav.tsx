"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeToggle from "./ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

const links = [
  { href: "#about", label: "About", index: "01" },
  { href: "#experience", label: "Experience", index: "02" },
  { href: "#projects", label: "Projects", index: "03" },
  { href: "#contact", label: "Contact", index: "04" },
];

export default function Nav() {
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
        <a
          href="#top"
          className="display text-lg tracking-tight text-foreground"
        >
          HB<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group label flex items-baseline gap-1.5 !text-foreground/70 transition-colors hover:!text-foreground"
              >
                <span className="text-[0.55rem] text-accent">{link.index}</span>
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="label hidden lg:block">Bengaluru, IN</span>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
