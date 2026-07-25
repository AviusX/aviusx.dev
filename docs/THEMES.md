# Multi-theme architecture

One codebase serves multiple fully distinct sites ("themes") on different
domains. A theme owns its own copy, palette, fonts, metadata, components, and
even its own WebGL stack — while sharing infrastructure (animation loop,
utility components, build pipeline) with every other theme.

## Available themes

| Theme  | Domain       | Route group   | Content module     | Character |
| ------ | ------------ | ------------- | ------------------ | --------- |
| `main` | aviusx.dev   | `app/(main)/` | `lib/site/main.ts` | Editorial, kinetic typography, light/dark, OGL shaders |
| `god`  | devoke.dev   | `app/(god)/`  | `lib/site/god.ts`  | "Devo ke Dev" — cosmic Hindu divinity × anime god-tier energy, fixed dark, react-three-fiber hero |

## How it fits together

```
proxy.ts                     host → internal route mapping (edge, ~1 string check)
lib/site/
  types.ts                   SiteContent schema shared by all themes
  main.ts, god.ts            one typed, JSON-serializable content object per theme
app/
  globals.css                shared primitives + per-theme token blocks
  (main)/                    root layout (fonts/meta/JSON-LD) + page + SEO files
  (god)/                     god root layout + god/page + god SEO files
components/
  *.tsx                      theme-agnostic primitives (Rich, Magnetic, LazyMount, …)
  sections/                  main theme sections
  god/                       god theme sections + gl/GodHeroCanvas (R3F)
```

### 1. Host routing (`proxy.ts`)

Every theme's page is a normal, statically generated route. The proxy (Next's
middleware successor) maps a domain onto its theme's internal base path:

- `devoke.dev/` → rewrite → `/god`
- `devoke.dev/robots.txt` → `/god/robots.txt`, `devoke.dev/sitemap.xml` → `/god/sitemap.xml`
- `devoke.dev/god` → 308 → `/` (canonical hygiene)
- `aviusx.dev/god` → 308 → `https://devoke.dev` (production only; the internal
  path stays reachable in dev/preview for testing)

The matcher covers only these five paths, so no static asset, font, or chunk
request ever executes the proxy, and neither route loses static generation.

Local development: `http://god.localhost:3000` (browsers resolve
`*.localhost` to loopback automatically). Extra hosts can be added via the
`NEXT_PUBLIC_GOD_HOSTS` env var (comma-separated) without a code change.

### 2. Content layer (`lib/site/`)

All copy and data — nav labels, hero lines, section headings, experience,
projects, socials, SEO metadata, JSON-LD — lives in one `SiteContent` object
per theme. The schema (`lib/site/types.ts`) is strictly JSON-serializable:

- Inline emphasis/links use `RichText` segments
  (`{ text, style?: "em" | "accent", href? }`) rendered by
  `components/Rich.tsx`. Each theme maps the abstract style tokens to its own
  classes, so the same content shape produces italic serif on aviusx.dev and
  molten-gold Devanagari on devoke.dev.
- Pages inject content into components as props (`<Hero content={…} />`).
  Components contain zero copy and zero theme conditionals.
- Because content is serializable, it can later come from JSON files, a CMS,
  or per-locale modules without touching a single component.

### 3. Design tokens

Themes restyle through CSS custom properties, not conditional classes.
`app/globals.css` defines the semantic tokens (`--background`, `--accent`,
`--line`, …) on `:root`/`.dark` for the main theme and overrides them under
`[data-theme="god"]`. Tailwind v4's `@theme inline` block maps the same
variables to utilities, so `bg-background` / `text-accent` resolve correctly
inside any theme with no component changes. Theme-specific primitives are
namespaced classes (`.god-display`, `.god-gradient-text`, `.god-halo`, …).

Fonts are loaded per root layout via `next/font`, exposed as CSS variables
(`--font-god-display`, `--font-god-deva`, …). A theme's fonts are never
requested by another theme's pages.

## Isolation and performance guarantees

The primary theme scores ~100 on all Lighthouse metrics; the god theme must
never regress it. The guarantees, in order of importance:

1. **Separate root layouts = separate bundles.** Route groups with their own
   root layouts mean Next code-splits each theme's page, components, fonts,
   and metadata into its own chunks. The god theme's JS (including three.js
   and react-three-fiber) appears in **zero** chunks referenced by `/` — this
   was verified by grepping every script chunk in the production HTML of the
   main page. Only the shared React/Next runtime chunks overlap.
2. **Static generation everywhere.** Proxy rewrites happen in front of
   prerendered routes; nothing becomes SSR. `next build` should always show
   `○ (Static)` for `/` and `/god`.
3. **Heavy dependencies are lazy even inside their own theme.** The R3F hero
   scene is imported with `next/dynamic` (`ssr: false`) and mounted on
   `requestIdleCallback`, so the server-rendered hero text and CSS halo paint
   first (LCP is text, not canvas). This mirrors the main theme's OGL
   pattern.
4. **Canvases pause when invisible.** The god canvas flips R3F's `frameloop`
   to `"never"` via IntersectionObserver + `visibilitychange`; OGL canvases
   skip their tick the same way. DPR is capped (1.25 coarse / 1.5 fine
   pointers).
5. **No conditional renders.** Shared components never branch on theme; they
   consume tokens/props. A change to one theme's components cannot alter
   another theme's render output.
6. **`prefers-reduced-motion`** disables smooth scroll, scrubs, entrance
   animations, and WebGL mounting in every theme.

## Adding a new theme

Say the theme is called `retro` on `retro.example.dev`:

1. **Content** — create `lib/site/retro.ts` exporting a `SiteContent` object
   (copy `god.ts` as a starting point; the type will enforce completeness).
2. **Route group** — create `app/(retro)/`:
   - `layout.tsx`: root layout (`<html data-theme="retro">`) loading the
     theme's fonts, exporting its `metadata`/`viewport`, injecting its
     JSON-LD, and importing `../globals.css`.
   - `retro/page.tsx`: composes sections and passes content slices as props.
   - Optional: `retro/opengraph-image.tsx`, `retro/icon.svg`,
     `retro/robots.txt/route.ts`, `retro/sitemap.xml/route.ts` (plain route
     handlers — the `robots`/`sitemap` file conventions only work at the app
     root).
3. **Tokens** — add a `[data-theme="retro"]` block in `app/globals.css`
   overriding the semantic variables, plus any namespaced primitives
   (`.retro-*`). Map new font variables in the layout.
4. **Components** — reuse main/theme-agnostic components where the layout
   fits, or build theme-specific ones under `components/retro/`. Reuse
   `Rich`, `Magnetic`, `LazyMount`, `AnimationProvider`, and `CardShader`
   freely — `CardShader` reads CSS tokens, so it recolors itself per theme.
   Keep heavy/canvas work behind `next/dynamic` + idle mount.
5. **Routing** — add the theme's hosts and rewrites in `proxy.ts` (mirror the
   `GOD_HOSTS` block) and extend the matcher with its internal base path.
6. **Verify** — `bun run build` (all routes must stay `○ Static`; grep the
   main page's chunks if the theme adds a heavy dependency), `bun run lint`,
   and a screenshot pass (copy `scripts/shot-god.mjs`).
7. **Deploy** — add the new domain to the Vercel project. No config file
   changes are needed.

## Editing an existing theme

- **Copy/data/SEO text** → edit the theme's module in `lib/site/`. Nothing
  else needs to change; metadata and JSON-LD are sourced from the same file.
- **Colors** → edit the theme's token block in `app/globals.css`. WebGL
  scenes that read CSS variables (OGL canvases) recolor automatically.
- **Fonts** → swap the `next/font` loaders in that theme's root layout; keep
  the same CSS variable names.
- **Layout/visuals** → edit that theme's components
  (`components/sections/` for main, `components/god/` for god). Shared
  primitives affect all themes — check both before changing them.

## Future: multilingual copy

The content schema was designed for it: add per-locale modules
(`lib/site/god.hi.ts`), key them in a small registry, and have the theme's
layout/page select by locale (URL prefix, `Accept-Language` in the proxy, or
a toggle). Components already receive content as props and need no changes.

## QA scripts

```bash
bun scripts/shot.mjs         # main theme, desktop, light + dark → /tmp/aviusx-shots
bun scripts/shot-mobile.mjs  # main theme, mobile + reduced motion
bun scripts/shot-god.mjs     # god theme, desktop + mobile → /tmp/devoke-shots
```

All scripts require Google Chrome and a server on the target port
(`bun scripts/shot-god.mjs 3100` to point at port 3100).
