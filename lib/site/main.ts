import type { SiteContent } from "./types";

/** Primary theme content — served on aviusx.dev. Locale: en. */

const siteUrl = "https://aviusx.dev";
const title = "Hrijul Bhatnagar — Founding Engineer at Thesys";
const description =
  "Hrijul Bhatnagar (AviusX) is a software engineer building generative UI at Thesys. Turning LLM outputs into live, interactive interfaces.";
const email = "hrijulbhatnagar@protonmail.com";

const socialLinks = [
  {
    label: "GitHub",
    url: "https://github.com/AviusX",
    handle: "github.com/AviusX",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/hrijulbhatnagar",
    handle: "linkedin.com/in/hrijulbhatnagar",
  },
  {
    label: "Instagram",
    url: "https://instagram.com/aviusgx",
    handle: "@aviusgx",
  },
  {
    label: "Email",
    url: `mailto:${email}`,
    handle: email,
  },
];

export const mainContent: SiteContent = {
  meta: {
    siteUrl,
    title,
    description,
    keywords: [
      "Hrijul",
      "Hrijul Bhatnagar",
      "AviusX",
      "Founding Engineer",
      "Thesys",
      "Generative UI",
      "Software Engineer",
      "LLMs",
      "React",
      "TypeScript",
      "Bengaluru",
    ],
    authorName: "Hrijul Bhatnagar",
    twitterCreator: "@AviusX",
    themeColor: "#0d0c0a",
    locale: "en_US",
  },

  nav: {
    logoText: "HB",
    logoAccent: ".",
    links: [
      { href: "#about", label: "About", index: "01" },
      { href: "#experience", label: "Experience", index: "02" },
      { href: "#projects", label: "Projects", index: "03" },
      { href: "#contact", label: "Contact", index: "04" },
    ],
    location: "Bengaluru, IN",
  },

  hero: {
    badge: "Founding Engineer at Thesys",
    titleLine1: "HRIJUL",
    titleLine2: "BHATNAGAR",
    akaPre: "also known online as ",
    akaHighlight: "AviusX",
    tagline: [
      { text: "Building the future of " },
      { text: "generative UI", style: "em" },
      {
        text: " — turning LLM outputs into live, interactive interfaces. Engineer, cybersecurity enthusiast, and maker of things.",
      },
    ],
    primaryCta: { href: "#projects", label: "View my work" },
    secondaryCta: { href: "#contact", label: "Get in touch" },
    terminal: [
      { label: "location", value: "bengaluru" },
      { label: "stack", value: "ts, react, llms" },
      { label: "status", value: "building", accentValue: true },
    ],
    scrollLabel: "Scroll",
  },

  about: {
    heading: { index: "01", label: "About", title: "A bit about me" },
    paragraphs: [
      [
        {
          text: "I'm a software engineer who thrives at the intersection of AI and frontend craft. As a Founding Engineer at ",
        },
        { text: "Thesys", style: "em", href: "https://thesys.dev" },
        {
          text: ", I build generative UI infrastructure that makes AI agents actually useful — turning raw LLM outputs into real, interactive interfaces people can use.",
        },
      ],
      [
        {
          text: "Beyond engineering, I'm deeply curious. I co-founded a cybersecurity community, shoot photos when the light is right, play guitar to decompress, and believe in building with intention.",
        },
      ],
    ],
    subdomains: [
      {
        title: "Music",
        description:
          "A curated collection of music recommendations, filterable by mood and genre. Eventually a home for original compositions.",
        url: "https://music.aviusx.dev",
        comingSoon: false,
      },
      {
        title: "Photography",
        description:
          "A dedicated space to showcase photography beyond Instagram. Coming soon.",
        url: "https://photography.aviusx.dev",
        comingSoon: true,
      },
    ],
    interests: [
      {
        label: "Photography",
        description: "Capturing moments through the lens",
        icon: "camera",
        link: "https://instagram.com/aviusgx",
        linkLabel: "@aviusgx",
      },
      {
        label: "Music",
        description: "Curating & playing guitar",
        icon: "music",
        link: "https://music.aviusx.dev",
        linkLabel: "music.aviusx.dev",
      },
      {
        label: "Fitness",
        description: "Discipline through training",
        icon: "dumbbell",
        link: null,
        linkLabel: null,
      },
      {
        label: "Cybersecurity",
        description: "Co-founded FrigidSec at VIT",
        icon: "shield",
        link: "https://frigidsec.github.io",
        linkLabel: "FrigidSec",
      },
    ],
  },

  marquee: {
    label: "Technologies I work with",
    separator: "✳",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "LLMs",
      "Generative UI",
      "Three.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
      "GraphQL",
      "Express.js",
      "Electron",
      "WebSockets",
      "REST APIs",
    ],
  },

  experience: {
    heading: { index: "02", label: "Experience", title: "Where I've worked" },
    items: [
      {
        role: "Founding Engineer",
        company: "Thesys",
        companyUrl: "https://thesys.dev",
        period: "2024 — Present",
        description:
          "Own the Agent Builder end-to-end — product lifecycle, engineering, marketing funnel optimizations, user research via PostHog session analysis, and feature prioritization. Contributed to building the C1 Generative UI API, Crayon SDK, and their documentation. Work deeply with LLMs daily, building generative UI infrastructure that turns model outputs into live, interactive interfaces.",
        tags: [
          "Generative UI",
          "LLMs",
          "React",
          "TypeScript",
          "Product Engineering",
        ],
      },
      {
        role: "Software Engineer",
        company: "Upswing Financial Technologies",
        companyUrl: null,
        period: "2023 — 2024",
        description:
          "Built and maintained the API platform enabling consumer companies to offer financial products. Worked on scalable backend services powering fintech integrations.",
        tags: ["Node.js", "APIs", "Fintech", "Backend"],
      },
      {
        role: "Associate Software Engineer",
        company: "Aasthy",
        companyUrl: null,
        period: "2022 — 2023",
        description:
          "Developed features for a fractional real estate investments platform. Worked across the stack on the product from early-stage through growth.",
        tags: ["Full Stack", "React", "Real Estate", "Startups"],
      },
      {
        role: "Frontend Engineer",
        company: "Hybrowlabs Technologies",
        companyUrl: null,
        period: "2022",
        description:
          "Built web applications and eCommerce solutions for a global development agency. Focused on responsive, performant frontends.",
        tags: ["React", "eCommerce", "Frontend", "Web Development"],
      },
      {
        role: "Full Stack Developer",
        company: "Atom EI",
        companyUrl: null,
        period: "2021 — 2022",
        description:
          "Developed the frontend of a widget-based cross-platform Electron application within a business intelligence software environment.",
        tags: ["Electron", "React", "Cross-Platform", "BI"],
      },
    ],
  },

  projects: {
    heading: { index: "03", label: "Projects", title: "Things I've built" },
    linkLabels: { visit: "Visit site", github: "GitHub" },
    items: [
      {
        title: "Thesys Agent Builder",
        description:
          "End-to-end ownership of a product that lets users design, visualize, and prototype AI agents. Built with generative UI, handling the full product lifecycle from engineering to user research.",
        tags: ["Generative UI", "AI Agents", "React", "TypeScript"],
        url: "https://thesys.dev/agent-builder",
        github: null,
        featured: true,
      },
      {
        title: "C1 API & Crayon SDK",
        description:
          "Contributed to building the first Generative UI API that turns LLM responses into live, adaptive user interfaces in real-time, and its companion React SDK.",
        tags: ["API Design", "React SDK", "LLMs", "Open Source"],
        url: "https://docs.thesys.dev",
        github: "https://github.com/thesysdev/crayon",
        featured: true,
      },
      {
        title: "PaperHub",
        description:
          "A wallpaper catalog and sharing platform. Browse, discover, and share high-quality wallpapers with a clean, modern interface.",
        tags: ["Express.js", "React", "Node.js", "Full Stack"],
        url: null,
        github: "https://github.com/AviusX/paperhub-frontend",
        featured: true,
      },
      {
        title: "Animovie",
        description:
          "A minimal IMDb-like website to look up movies. Clean UI for browsing and discovering movie information.",
        tags: ["Node.js", "Express", "API Integration"],
        url: null,
        github: "https://github.com/AviusX/animovie",
        featured: false,
      },
    ],
  },

  contact: {
    heading: { index: "04", label: "Contact", title: "Let's work together" },
    prose:
      "Have an idea, a project, or just want to chat? I'd love to hear from you. Drop me a message and I'll get back to you as soon as I can.",
    emailLabel: "Write to me at",
    email,
    socialLinks,
  },

  footer: {
    copyrightName: "Hrijul Bhatnagar",
    akaPre: "also known online as ",
    akaHighlight: "AviusX",
    socialLinks,
  },

  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Hrijul Bhatnagar",
      alternateName: "AviusX",
      url: siteUrl,
      jobTitle: "Founding Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Thesys",
        url: "https://thesys.dev",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Vellore Institute of Technology",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      email: `mailto:${email}`,
      knowsAbout: [
        "Generative UI",
        "Large Language Models",
        "React",
        "TypeScript",
        "NestJS",
        "Frontend Engineering",
        "Cybersecurity",
      ],
      sameAs: [
        "https://linkedin.com/in/hrijulbhatnagar",
        "https://github.com/AviusX",
        "https://instagram.com/aviusgx",
        "https://x.com/AviusX",
        "https://music.aviusx.dev",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hrijul Bhatnagar",
      description,
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};
