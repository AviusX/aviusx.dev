# aviusx.dev / devoke.dev

Portfolio of Hrijul Bhatnagar — an editorial, kinetic-typography site built with
Next.js 16, Tailwind CSS 4, GSAP (ScrollTrigger + SplitText), Lenis smooth
scrolling, and OGL WebGL shaders.

The same app serves two domains from one codebase:

- **aviusx.dev** — the primary editorial theme (`app/(main)`)
- **devoke.dev** — "Devo ke Dev", the divine god theme (`app/(god)`), with a
  react-three-fiber cosmic hero (nebula, sacred-geometry mandala, particle
  halo, third-eye core)

## Development

```bash
bun install
bun dev        # http://localhost:3000 (primary), http://god.localhost:3000 (god)
bun run build  # production build
bun start      # serve the production build
```

Visual QA scripts (require Google Chrome installed):

```bash
bun scripts/shot.mjs         # desktop scroll-through, both color themes → /tmp/aviusx-shots
bun scripts/shot-mobile.mjs  # mobile + reduced-motion pass
bun scripts/shot-god.mjs     # god theme, desktop + mobile → /tmp/devoke-shots
```

## Architecture notes

- **Multi-theme content layer**: all copy/data lives in `lib/site/` as typed,
  JSON-serializable `SiteContent` objects (`lib/site/main.ts`,
  `lib/site/god.ts`, schema in `lib/site/types.ts`). Pages inject content into
  components as props, so themes/locales swap without touching components.
- **Host routing**: `proxy.ts` rewrites the god domain's `/`, `/robots.txt`,
  and `/sitemap.xml` to the statically generated `/god` routes. Each theme is
  its own route group with its own root layout, fonts, metadata, and JSON-LD —
  nothing leaks between theme bundles (three.js never ships to aviusx.dev).
- **Adding a theme**: create `lib/site/<theme>.ts`, a route group
  `app/(<theme>)/` with a root layout + page (+ theme components), theme
  tokens in `app/globals.css`, and map its domain in `proxy.ts`.
- **Single RAF loop**: the GSAP ticker drives Lenis, ScrollTrigger, and every
  OGL canvas. All canvases (including the god R3F scene) pause when
  off-screen or the tab is hidden.
- **Hero loads first**: hero text is server-rendered and animates in with pure
  CSS; WebGL mounts on `requestIdleCallback` and fades in behind it (both
  themes follow this pattern).
- **Theme**: light/dark via CSS custom properties + `.dark` class, no-FOUC
  inline script, shaders read the same tokens and adapt live. The god theme is
  a fixed dark palette under `[data-theme="god"]`.
- **Reduced motion**: smooth scroll, scrub animations, and WebGL are all
  disabled under `prefers-reduced-motion`; content renders as a plain,
  fully-readable document.

## SEO

Already in place: server-rendered content, JSON-LD `Person` + `WebSite`
schema (with `sameAs` profile links), `sitemap.xml`, `robots.txt`, canonical
URL, OG/Twitter meta, and a generated `/opengraph-image`.

### Post-launch checklist (manual steps)

1. **Google Search Console**: verify the domain, then paste the verification
   code into the `verification` field in `app/layout.tsx` (a commented
   placeholder is there). Submit `https://aviusx.dev/sitemap.xml` and request
   indexing for the homepage.
2. **Backlinks from high-authority profiles** — the main lever for ranking on
   a first-name-only query. Set `https://aviusx.dev` as the website on:
   - LinkedIn (`linkedin.com/in/hrijulbhatnagar`)
   - GitHub (`github.com/AviusX`)
   - Instagram (`instagram.com/aviusgx`)
   - X (`x.com/AviusX`)
3. Validate structured data with [Google's Rich Results test](https://search.google.com/test/rich-results)
   after deploying.
