"use client";

import { socialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-200/60 dark:border-white/[0.04] py-8 px-6 mb-20 sm:mb-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} Hrijul Bhatnagar
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
