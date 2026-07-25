/**
 * Theme-agnostic content schema for the site.
 *
 * Each theme (and, later, each locale) is a single module exporting one
 * `SiteContent` object — e.g. `lib/site/main.ts`, `lib/site/god.ts`.
 * Everything is JSON-serializable so content can cross the server/client
 * boundary as props, be swapped per locale, or eventually be loaded from
 * external JSON/CMS without touching components.
 *
 * Adding a theme:
 *   1. Create `lib/site/<theme>.ts` exporting a `SiteContent`.
 *   2. Add a root layout + page under `app/(<theme>)/` that imports it
 *      (each theme is its own route group, so its fonts/CSS/JS never leak
 *      into other themes' bundles).
 *   3. Route a domain to it in `middleware.ts`.
 */

/** A piece of inline rich text. Themes decide how each style token renders. */
export interface RichSegment {
  text: string;
  /** Visual emphasis token — mapped to theme-specific styling. */
  style?: "em" | "accent";
  /** Renders the segment as a link when present. */
  href?: string;
}

export type RichText = RichSegment[];

export interface SiteMeta {
  siteUrl: string;
  title: string;
  description: string;
  keywords: string[];
  authorName: string;
  twitterCreator: string;
  themeColor: string;
  locale: string;
}

export interface NavLink {
  href: string;
  label: string;
  index: string;
}

export interface NavContent {
  logoText: string;
  logoAccent: string;
  links: NavLink[];
  location: string;
  /** Optional outbound link (e.g. the god theme linking back to the mortal realm). */
  externalLink?: { href: string; label: string };
}

export interface TerminalPart {
  label: string;
  value: string;
  accentValue?: boolean;
}

export interface HeroContent {
  badge: string;
  /** Decorative crown line above the title (e.g. Devanagari flourish). */
  crown?: string;
  titleLine1: string;
  titleLine2: string;
  akaPre: string;
  akaHighlight: string;
  akaPost?: string;
  tagline: RichText;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  terminal: TerminalPart[];
  scrollLabel: string;
  /** Small easter-egg line, rendered subtly if present. */
  easterEgg?: string;
}

export interface SectionHeadingContent {
  index: string;
  label: string;
  title: string;
}

export interface InterestItem {
  label: string;
  description: string;
  icon: "camera" | "music" | "dumbbell" | "shield";
  link: string | null;
  linkLabel: string | null;
}

export interface SubdomainItem {
  title: string;
  description: string;
  url: string;
  comingSoon: boolean;
}

export interface AboutContent {
  heading: SectionHeadingContent;
  paragraphs: RichText[];
  subdomains: SubdomainItem[];
  interests: InterestItem[];
}

export interface MarqueeContent {
  label: string;
  items: string[];
  /** Separator glyph between items. */
  separator: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  companyUrl: string | null;
  period: string;
  /** Theme-specific epithet displayed above/with the company (e.g. a yuga name). */
  era?: string;
  description: string;
  tags: string[];
}

export interface ExperienceContent {
  heading: SectionHeadingContent;
  items: ExperienceItem[];
}

export interface ProjectItem {
  title: string;
  /** Theme-specific epithet (e.g. an astra name in the god theme). */
  subtitle?: string;
  description: string;
  tags: string[];
  url: string | null;
  github: string | null;
  featured: boolean;
}

export interface ProjectsContent {
  heading: SectionHeadingContent;
  items: ProjectItem[];
  linkLabels: { visit: string; github: string };
}

export interface SocialLink {
  label: string;
  url: string;
  handle: string;
}

export interface ContactContent {
  heading: SectionHeadingContent;
  prose: string;
  emailLabel: string;
  email: string;
  socialLinks: SocialLink[];
  /** Optional trailing line (e.g. link back to the primary site). */
  outro?: RichText;
}

export interface FooterContent {
  copyrightName: string;
  akaPre: string;
  akaHighlight: string;
  /** When set, the aka line links out (god theme → aviusx.dev). */
  akaHref?: string;
  socialLinks: SocialLink[];
}

export interface SiteContent {
  meta: SiteMeta;
  nav: NavContent;
  hero: HeroContent;
  about: AboutContent;
  marquee: MarqueeContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  contact: ContactContent;
  footer: FooterContent;
  /** Schema.org JSON-LD blobs injected by the theme's root layout. */
  jsonLd: Record<string, unknown>[];
}
