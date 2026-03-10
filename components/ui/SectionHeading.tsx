"use client";

import { SplitText, FadeUp } from "./TextReveal";

interface SectionHeadingProps {
  label: string;
  title: string;
}

export default function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <div className="mb-16">
      <FadeUp>
        <span className="mb-3 inline-block text-sm font-medium tracking-wider uppercase text-indigo-500 dark:text-indigo-400">
          {label}
        </span>
      </FadeUp>
      <SplitText
        as="h2"
        className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
      >
        {title}
      </SplitText>
    </div>
  );
}
