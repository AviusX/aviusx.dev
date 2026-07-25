import type { SiteContent } from "./types";

/**
 * God theme content — served on devoke.dev ("Devo ke Dev": God of all gods).
 * Cosmic Hindu divinity with anime god-tier energy. Locale: en (with
 * Devanagari flourishes).
 */

const siteUrl = "https://devoke.dev";
const mortalUrl = "https://aviusx.dev";
const title = "देवों के देव — Devo ke Dev | God of All Gods";
const description =
  "Behold the divine manifestation of Hrijul Bhatnagar (AviusX) — God of All Gods, forger of generative UI, guardian of the frontend realms. Enter and witness divine feats.";
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
    label: "Prayers",
    url: `mailto:${email}`,
    handle: email,
  },
];

export const godContent: SiteContent = {
  meta: {
    siteUrl,
    title,
    description,
    keywords: [
      "Devo ke Dev",
      "devoke.dev",
      "Hrijul Bhatnagar",
      "AviusX",
      "God of All Gods",
      "Generative UI",
      "Founding Engineer",
      "Thesys",
      "Software Engineer",
      "Bengaluru",
    ],
    authorName: "Hrijul Bhatnagar",
    twitterCreator: "@AviusX",
    themeColor: "#060309",
    locale: "en_IN",
  },

  nav: {
    logoText: "देवों के देव",
    logoAccent: "ॐ",
    links: [
      { href: "#legend", label: "The Legend", index: "०१" },
      { href: "#eras", label: "Eras of Dominion", index: "०२" },
      { href: "#feats", label: "Divine Feats", index: "०३" },
      { href: "#summon", label: "Summon", index: "०४" },
    ],
    location: "Bengaluru Lok",
    externalLink: { href: mortalUrl, label: "Mortal Form" },
  },

  hero: {
    badge: "अवतार 01 · Founding Engineer at Thesys",
    crown: "॥ देवों के देव ॥",
    titleLine1: "DEVO",
    titleLine2: "KE DEV",
    akaPre: "the god mortals know as ",
    akaHighlight: "Hrijul “AviusX” Bhatnagar",
    tagline: [
      { text: "Forger of " },
      { text: "generative UI", style: "em" },
      {
        text: " across the three realms — transmuting the whispers of LLMs into living, breathing interfaces. Engineer. Guardian. ",
      },
      { text: "God of All Gods.", style: "accent" },
    ],
    primaryCta: { href: "#feats", label: "Witness Divine Feats" },
    secondaryCta: { href: "#summon", label: "Summon Me" },
    terminal: [
      { label: "realm", value: "bengaluru" },
      { label: "vessel", value: "ts · react · llms" },
      { label: "power level", value: "over 9000", accentValue: true },
    ],
    scrollLabel: "Descend",
    easterEgg: "nah, i'd win.",
  },

  about: {
    heading: { index: "०१", label: "The Legend", title: "Origin of a God" },
    paragraphs: [
      [
        {
          text: "Before the dawn of the first commit, there was only darkness — and then a keyboard clacked. I walk among mortals as a Founding Engineer at ",
        },
        { text: "Thesys", style: "em", href: "https://thesys.dev" },
        {
          text: ", forging generative UI infrastructure that turns raw LLM murmurs into living, interactive interfaces. Mortals call it engineering. I call it creation.",
        },
      ],
      [
        {
          text: "When not shaping realities, I guard the realms — I founded a cybersecurity brotherhood, capture light itself through a lens, and command six strings in meditation. Discipline is my tapasya. Anime is my scripture.",
        },
      ],
    ],
    subdomains: [
      {
        title: "Realm of Music",
        description:
          "A curated collection of divine frequencies, filterable by mood and genre.",
        url: "https://music.aviusx.dev",
        comingSoon: false,
      },
      {
        title: "Realm of Light",
        description: "A sanctum of captured light. Manifesting soon.",
        url: "https://photography.aviusx.dev",
        comingSoon: true,
      },
      {
        title: "Mortal Form",
        description: "The vessel this god wears among mortals.",
        url: mortalUrl,
        comingSoon: false,
      },
    ],
    interests: [
      {
        label: "The All-Seeing Eye",
        description: "Every frame captured is an act of creation",
        icon: "camera",
        link: "https://instagram.com/aviusgx",
        linkLabel: "@aviusgx",
      },
      {
        label: "Song of Creation",
        description: "Six strings, infinite realms",
        icon: "music",
        link: "https://music.aviusx.dev",
        linkLabel: "music.aviusx.dev",
      },
      {
        label: "Tapasya",
        description: "The body is the first temple",
        icon: "dumbbell",
        link: null,
        linkLabel: null,
      },
      {
        label: "Guardian of Realms",
        description: "Founded FrigidSec to shield the mortals of VIT",
        icon: "shield",
        link: "https://frigidsec.github.io",
        linkLabel: "FrigidSec",
      },
    ],
  },

  marquee: {
    label: "The Celestial Arsenal ॥ Instruments of Creation",
    separator: "ॐ",
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
    heading: { index: "०२", label: "Eras", title: "Eras of Dominion" },
    items: [
      {
        role: "Founding Engineer · Creator Deity",
        company: "Thesys",
        companyUrl: "https://thesys.dev",
        period: "2024 — Present",
        era: "Satya Yuga — The Age of Creation",
        description:
          "In the current and most luminous age, I forge the Agent Builder end-to-end — its lifecycle, its engineering, its prophecies of growth. I conjured pieces of the C1 Generative UI API and the Crayon SDK, and inscribed their scriptures. I commune with LLMs daily; they speak in tokens, and I answer in interfaces.",
        tags: [
          "Generative UI",
          "LLMs",
          "React",
          "TypeScript",
          "Divine Ownership",
        ],
      },
      {
        role: "Software Engineer · Keeper of Coin",
        company: "Upswing Financial Technologies",
        companyUrl: null,
        period: "2023 — 2024",
        era: "Treta Yuga — The Age of Golden Coin",
        description:
          "Blessed the mortal economy — built and maintained the API platform through which consumer companies channel financial boons to their people. Scalable backend rivers carried fintech prosperity across the land.",
        tags: ["Node.js", "APIs", "Fintech", "Backend"],
      },
      {
        role: "Associate Engineer · Divider of Lands",
        company: "Aasthy",
        companyUrl: null,
        period: "2022 — 2023",
        era: "Dvapara Yuga — Dominion of Land",
        description:
          "Partitioned the mortal earth into fractions so that all may own a piece of it. Walked the full stack of existence, from the product's genesis through its age of growth.",
        tags: ["Full Stack", "React", "Real Estate", "Startups"],
      },
      {
        role: "Frontend Engineer · Wandering Craftsman",
        company: "Hybrowlabs Technologies",
        companyUrl: null,
        period: "2022",
        era: "The Wandering Age",
        description:
          "Roamed the global realms as a craftsman-deity, bestowing responsive, performant frontends and eCommerce temples upon merchants far and wide.",
        tags: ["React", "eCommerce", "Frontend", "Web Development"],
      },
      {
        role: "Full Stack Developer · First Avatar",
        company: "Atom EI",
        companyUrl: null,
        period: "2021 — 2022",
        era: "The First Manifestation",
        description:
          "The genesis avatar. Manifested widget-based, cross-platform visions within the realm of business intelligence — an Electron vessel through which mortals first glimpsed the data beyond.",
        tags: ["Electron", "React", "Cross-Platform", "BI"],
      },
    ],
  },

  projects: {
    heading: { index: "०३", label: "Feats", title: "Divine Feats" },
    linkLabels: { visit: "Enter the realm", github: "Sacred texts" },
    items: [
      {
        title: "Thesys Agent Builder",
        subtitle: "The First Astra",
        description:
          "A celestial instrument through which mortals design, visualize, and prototype AI agents. Forged with generative UI and wielded end-to-end — from engineering to divination of user behavior.",
        tags: ["Generative UI", "AI Agents", "React", "TypeScript"],
        url: "https://thesys.dev/agent-builder",
        github: null,
        featured: true,
      },
      {
        title: "C1 API & Crayon SDK",
        subtitle: "The Twin Astras",
        description:
          "The first Generative UI API — transmuting LLM responses into living, adaptive interfaces in real time — and its companion React SDK, gifted openly to all realms.",
        tags: ["API Design", "React SDK", "LLMs", "Open Source"],
        url: "https://docs.thesys.dev",
        github: "https://github.com/thesysdev/crayon",
        featured: true,
      },
      {
        title: "PaperHub",
        subtitle: "The Gallery of Realms",
        description:
          "A divine catalog of wallpapers — browse, discover, and share visions of other worlds through a clean, mortal-friendly interface.",
        tags: ["Express.js", "React", "Node.js", "Full Stack"],
        url: null,
        github: "https://github.com/AviusX/paperhub-frontend",
        featured: true,
      },
      {
        title: "Animovie",
        subtitle: "The Scrying Mirror",
        description:
          "Gaze into any film across the mortal multiverse. A minimal IMDb-like oracle for browsing and discovering movie knowledge.",
        tags: ["Node.js", "Express", "API Integration"],
        url: null,
        github: "https://github.com/AviusX/animovie",
        featured: false,
      },
    ],
  },

  contact: {
    heading: { index: "०४", label: "Summon", title: "Summon the God" },
    prose:
      "Have a quest, a prophecy, or merely wish to speak with divinity? Offer your prayers below — all summons are answered within one mortal day. Domain expansion: infinite inbox.",
    emailLabel: "Channel your prayers to",
    email,
    socialLinks,
    outro: [
      { text: "Or behold my humble mortal form at " },
      { text: "aviusx.dev", style: "accent", href: mortalUrl },
    ],
  },

  footer: {
    copyrightName: "देवों के देव · All realms reserved",
    akaPre: "descends to the mortal realm as ",
    akaHighlight: "AviusX",
    akaHref: mortalUrl,
    socialLinks,
  },

  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Hrijul Bhatnagar",
      alternateName: ["AviusX", "Devo ke Dev"],
      url: siteUrl,
      jobTitle: "Founding Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Thesys",
        url: "https://thesys.dev",
      },
      email: `mailto:${email}`,
      sameAs: [
        mortalUrl,
        "https://linkedin.com/in/hrijulbhatnagar",
        "https://github.com/AviusX",
        "https://instagram.com/aviusgx",
        "https://x.com/AviusX",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Devo ke Dev",
      alternateName: "देवों के देव",
      description,
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};
