# Design System Showcase — Dark Operations Console

An interactive reference for the design system specified in [`spec/DESIGN_SYSTEM.md`](spec/DESIGN_SYSTEM.md): every token, 49 component pages covering all 51 documented component sections, 12 chart pages, 9 layout patterns and 5 complete example applications. The site is built with the components it documents.

This is a **standalone project**. It lives outside the DEOC repository, has its own dependencies, build and Git history, and never imports anything from DEOC at runtime. DEOC was used only as a read-only source: the spec file and the registry illustrations were copied in.

## Run it

Requirements: Node.js 20+ (tested with 24) and npm.

```bash
npm install
npm run dev          # http://localhost:5180
```

Production build and local preview:

```bash
npm run build        # regenerates CSS/data from the spec, type-checks, builds to dist/
npm run preview      # http://localhost:4173
```

`dist/` is a static site with relative paths and hash routing (`#/components/buttons`), so it can be deployed to any static host or sub-path with no server configuration. Every page is deep-linkable.

## How the spec drives the site

`npm run spec` (it runs automatically before `dev` and `build`) executes `scripts/extract-spec.mjs`, which reads `spec/DESIGN_SYSTEM.md` and writes:

| Output | Contents |
|---|---|
| `src/generated/ds.css` | All 43 CSS blocks from the spec, **verbatim** and in document order: the §3 token file, §4 base CSS and every component blueprint. Rules using `:hover`, `:focus-visible`, `:focus-within` or `:active` get a twin selector (`.is-hover`, `.is-focus-visible`, `.is-active`), so states can be shown without a pointer or keyboard. One reorder: the §2.13 density block is emitted after `:root` (spec finding F-17). |
| `src/generated/text-styles.css` | A `.ds-ts-<name>` class for each of the 52 named text styles in §2.3. |
| `src/generated/spec.json` | Sections, declared tokens, documented token tables, primitives, text styles, the asset registry and the open decisions. Pages render spec text and tables from this, so they stay in sync with the spec. |

To adopt a newer spec, copy it over `spec/DESIGN_SYSTEM.md` and run `npm run build`.

Components whose spec section has a table but **no CSS blueprint** (label tooltip, breadcrumb, generic modal, table card, status card, empty states, charts and others) are styled in `src/styles/derived.css` and `src/styles/charts.css`. Every rule there uses `--ds-*` tokens or a literal stated in the cited spec table, and each block names its section.

## Project structure

```
spec/DESIGN_SYSTEM.md        the specification (single source of truth)
scripts/
  extract-spec.mjs           spec → generated CSS + data
  check-tokens.mjs           static token / literal scan
  check-browser.mjs          axe-core + overflow + console errors on every route (real Chrome/Edge)
  check-interactions.mjs     29 scripted behavior checks (§5.55 contracts)
src/
  components/ds/             reusable React components (Button, Select, DataTable, Overlay, …)
  charts/                    SVG/HTML charts drawn only with §7 tokens (no chart library)
  docs/                      documentation framework, component docs, foundation/chart/layout/QA pages
  apps/                      the five example applications
  data/sample.ts             generic local sample data (no APIs)
  styles/                    derived component CSS, chart CSS, showcase chrome
public/assets/               registry illustrations + 3 sample media frames (copied, filenames preserved)
```

Documentation content (`src/docs`) is kept separate from component logic (`src/components/ds`, `src/charts`).

## Quality checks

```bash
npm run typecheck            # TypeScript, strict
npm run check:tokens         # every var(--ds-*) used in src/ is declared; no stray color literals
npm run check:browser        # needs a built dist/ and an installed Chrome or Edge (or set CHROME_PATH)
npm run check:interactions
npm run qa                   # build + all of the above
```

`check:browser` visits all 91 routes with axe-core (WCAG 2.0/2.1/2.2 A and AA rule tags), measures horizontal page overflow at 390px and 1440px, records console errors and saves screenshots to `qa-output/screenshots/`. The results are written to `public/qa-report.json` and shown on the site's **Visual QA** page, together with live token, contrast and asset checks and the coverage matrix.

## Assets

The 21 illustrations in the spec's §2.11 registry were copied from the source project's `public/assets/` with their original filenames. Three sample media frames (`1a86e.png`, `2cc30.png`, `839eb.png`) were copied the same way for the media card demo. They belong to the source product's owners and are included only to demonstrate the registry. Where an illustration is missing, pages show the documented icon-tile fallback and the Iconography and QA pages flag it. No illustrations were generated.

## Known limitations

- **Inter loads from Google Fonts**, as the spec prescribes. Offline, the system font stack is used.
- **Single 1.5 MB JavaScript bundle** (390 kB gzipped). There is no code splitting; acceptable for a reference site.
- **Automated accessibility checks are not a full audit.** axe-core finds a subset of WCAG issues, and no screen-reader testing was done. The interaction checks cover the behaviors listed on the QA page, in Chrome only.
- **No pixel comparison against DEOC.** Fidelity comes from using the spec's CSS verbatim and was reviewed visually from screenshots.
- **Line, area, grouped-bar and horizontal-bar charts are spec extensions** with no source visual to compare against.
- **Product-specific details** described by the spec (the rich picker's inline add form, photo avatars) are represented by placeholders: a toast, and initials.
- The spec findings listed on the QA page (F-1…F-18) are implemented as described there. The spec itself was not changed.
