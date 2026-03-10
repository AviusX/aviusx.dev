"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import { BlurFade } from "../magicui/blur-fade";
import { MagicCard } from "../magicui/magic-card";
import { BorderBeam } from "../magicui/border-beam";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setStatus("sent");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 section-grid section-blob-left overflow-hidden">
      <div className="glow-line" />
      <div className="glow-line-bloom" />
      {/* Decorative floating accents */}
      <div className="pointer-events-none absolute top-10 right-[20%] w-60 h-60 rounded-full bg-gradient-to-bl from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/5 dark:to-violet-500/5 blur-3xl animate-orb-float" />
      <div className="pointer-events-none absolute bottom-16 left-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-purple-500/8 to-indigo-500/8 dark:from-purple-500/4 dark:to-indigo-500/4 blur-3xl animate-orb-float-reverse" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Contact" title="Let's work together" />

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <BlurFade>
              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-400">
                Have an idea, a project, or just want to chat? I&apos;d love to
                hear from you. Drop me a message and I&apos;ll get back to you
                as soon as I can.
              </p>
            </BlurFade>

            <BlurFade delay={0.1}>
              <div className="mt-10 space-y-4">
                {[
                  {
                    href: "mailto:hrijulbhatnagar@protonmail.com",
                    label: "hrijulbhatnagar@protonmail.com",
                    icon: (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://github.com/AviusX",
                    label: "github.com/AviusX",
                    external: true,
                    icon: (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://linkedin.com/in/hrijulbhatnagar",
                    label: "linkedin.com/in/hrijulbhatnagar",
                    external: true,
                    icon: (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.06] group-hover:bg-indigo-500/10 transition-colors">
                      <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.icon}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </a>
                ))}
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.15}>
            <div className="relative rounded-2xl">
              <BorderBeam
                size={100}
                duration={12}
                colorFrom="#6366f1"
                colorTo="#a855f7"
                borderWidth={1}
              />
              <MagicCard
                className="rounded-2xl"
                gradientSize={350}
                gradientColor="rgba(99,102,241,0.12)"
                gradientFrom="#6366f1"
                gradientTo="#a855f7"
                gradientOpacity={0.2}
              >
                <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40"
                      placeholder="What's on your mind?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 dark:bg-white px-6 text-sm font-medium text-white dark:text-zinc-900 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative z-10 transition-colors group-hover:text-white flex items-center gap-2">
                      {status === "sending"
                        ? "Sending..."
                        : status === "sent"
                          ? "Sent!"
                          : status === "error"
                            ? "Failed — try again"
                            : "Send message"}
                      <AnimatePresence mode="wait">
                        {status === "sent" && (
                          <motion.svg
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="h-4 w-4 text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </form>
              </MagicCard>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
