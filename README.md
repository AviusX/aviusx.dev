# aviusx.dev

Portfolio of Hrijul Bhatnagar — an editorial, kinetic-typography site built with
Next.js 16, Tailwind CSS 4, GSAP (ScrollTrigger + SplitText), Lenis smooth
scrolling, and OGL WebGL shaders.

## Development

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # production build
bun start      # serve the production build
```

Visual QA scripts (require Google Chrome installed):

```bash
bun scripts/shot.mjs         # desktop scroll-through, both themes → /tmp/aviusx-shots
bun scripts/shot-mobile.mjs  # mobile + reduced-motion pass
```

## Architecture notes

- **Content** lives in `lib/data.ts`; section copy is in `components/sections/*`.
- **Single RAF loop**: the GSAP ticker drives Lenis, ScrollTrigger, and every
  WebGL canvas. Canvases pause when off-screen or the tab is hidden.
- **Hero loads first**: hero text is server-rendered and animates in with pure
  CSS; the OGL shader mounts on `requestIdleCallback` and fades in behind it.
- **Theme**: light/dark via CSS custom properties + `.dark` class, no-FOUC
  inline script, shaders read the same tokens and adapt live.
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
