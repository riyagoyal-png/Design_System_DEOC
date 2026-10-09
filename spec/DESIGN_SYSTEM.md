# DESIGN_SYSTEM.md — Dark Operations Console Design Language

> A portable, implementation-ready design system extracted from the DEOC application (a dark, data-dense operations console).
> It is the **single source of truth** for visual design. It contains every token, component, layout and chart rule needed to build a *new* product in the same visual language without access to the original application, its source code, Figma files or assets.

---

## Table of contents

0. [How to read this document](#0-how-to-read-this-document): the five layers, tags, conventions
1. [Design language in one page](#1-design-language-in-one-page)
2. [Foundations (L1)](#2-foundations)
   - 2.1 Color primitives · 2.2 Semantic color tokens · 2.3 Typography · 2.4 Spacing · 2.5 Radii · 2.6 Borders · 2.7 Shadows, elevation & focus · 2.8 Size tokens · 2.9 Motion · 2.10 Z-index · 2.11 Iconography & asset registry · 2.12 Imagery · 2.13 Density modes
3. [Complete token file (L1)](#3-complete-token-file)
4. [Base / global CSS (L1)](#4-base--global-css)
5. [Component specifications (L2)](#5-component-specifications)
6. [Page layout patterns (L3)](#6-page-layout-patterns)
7. [Data visualization system (L2)](#7-data-visualization-system)
8. [Responsive rules](#8-responsive-rules)
9. [Accessibility rules (WCAG 2.2 AA)](#9-accessibility-rules-wcag-22-aa)
10. [AI AGENT DESIGN IMPLEMENTATION RULES](#10-ai-agent-design-implementation-rules)
11. [Inconsistency Resolution Log](#11-inconsistency-resolution-log)
12. [Worked examples (non-normative)](#12-worked-examples-non-normative)
13. [Final QA checklist](#13-final-qa-checklist)
14. [Changelog](#14-changelog)
15. [Open decisions & known issues](#15-open-decisions--known-issues)

---

## 0. How to read this document

### 0.1 The five layers (what is a rule and what is a default)

This system separates **visual identity** (which must stay consistent) from **layout and UX decisions** (which each product makes for its own users). Every section belongs to exactly one layer, and the layer sets how strictly it applies.

| Layer | What it contains | Where | Strength |
|---|---|---|---|
| **L1 · Foundations** | Color, type, spacing, radii, borders, shadows, elevation, sizes, motion, focus, iconography style | §2, §3, §4 | **MUST**. Never invent values. The only sanctioned variation is the comfortable density mode (§2.13) |
| **L2 · Components** | Anatomy, dimensions, states, behavior and accessibility of each reusable component | §5, §7 | **MUST** match visually and behaviorally when the component is used. Content, labels and which components you use are up to the product |
| **L3 · Layout patterns** | Proven ways to assemble components into pages (shell, list page, dashboard, forms) | §6 | **SHOULD**. Each pattern lists its *default*, *acceptable variants* and *product decisions*. Deviate when content or workflow requires it, using L1/L2 building blocks |
| **L4 · Product UX decisions** | Choices the source app made for its own users (page order, which filters exist, panel-vs-page for a given form, page sizes) | Marked **[PRODUCT DECISION]** throughout | **MAY**. Reference only. Each product decides |
| **L5 · Optional extensions** | Patterns derived from L1/L2 that the source app did not have (switch, breadcrumb, skeletons, line charts, comfortable density) | Marked **[EXTENSION]** | **MAY**. If you need the pattern, build it this way instead of inventing one |

Normative keywords follow RFC 2119: **MUST / MUST NOT** (required for visual identity or accessibility), **SHOULD** (the default; deviate only for a stated reason), **MAY** (optional).

### 0.2 Provenance tags

Provenance (where a value came from) is independent of the layer (how strictly it applies).

| Tag | Meaning |
|---|---|
| **[OBSERVED]** | Extracted from the implemented source application. Exact values. |
| **[STANDARDIZED]** | The source used conflicting values, or a value with a usability or accessibility defect. This value was chosen on its merits (hierarchy, consistency, usability, accessibility, behavior), **not** by frequency of use. Every one is justified in the Inconsistency Resolution Log (§11). |
| **[EXTENSION]** | The source had no implementation. Derived from the extracted language so that products don't invent their own. |
| **[PRODUCT DECISION]** | How the source app chose to do it. Provided as a reference default, not a rule. |

If a value has no tag, it is **[OBSERVED]**. Component specifications reference **only canonical values**; conflicting historical values appear only in §11.

### 0.3 Conventions

- All dimensions are in **CSS pixels** unless stated. The system was built at 1 rem = 16 px; teams may convert to rem (px ÷ 16) without changing any value.
- "Height" of a control means its **outer border-box height**, with `box-sizing: border-box` everywhere.
- `rgba(255,255,255,0.06)` is written as **white/6%**, and `rgba(0,0,0,0.5)` as **black/50%**.
- Font weights: 400 regular, 500 medium, 600 semibold, 700 bold.
- **Token shorthand.** In spec tables, a bare token name stands for its full custom property:
  - `surface-card` → `--ds-color-surface-card`, and `text-muted` → `--ds-color-text-muted` (every color token);
  - `shadow-card` → `--ds-shadow-card`;
  - `radius-card` → `--ds-radius-card`;
  - `space-4` → `--ds-space-4`.
  Every shorthand used in this document resolves to a token in §3.
- Token names use the `--ds-` prefix; example classes use the `ds-` prefix. Class names are suggestions; values are requirements.
- Contrast ratios are WCAG 2.x relative-luminance ratios, **computed** (not estimated) against the surface each element actually sits on. Translucent colors are first composited onto that surface.
- The system is **dark-only**. Do not invent a light theme (§10).
- The source app was a fixed-width desktop console. That is **not** a constraint of this system: responsive behavior is defined in §8, and the comfortable density mode in §2.13.

### 0.4 Using this document without the source repository

Everything required is in this file: tokens (§3), base CSS (§4), component specs with code (§5), layouts (§6), charts (§7), responsive (§8) and accessibility (§9) rules. Two kinds of item are **not** included, and must be supplied by the adopting team or replaced with the documented fallbacks:

1. **3D illustration image files.** The registry (§2.11) describes each one. If you don't have the files, use the icon-tile fallback.
2. **Outline icon SVGs.** Use any outline set matching §2.11-E.

### 0.5 What this document deliberately excludes

The source product's business logic, data, navigation labels, terminology and workflows are not part of the system. Where the source used domain words, this document uses generic names (entity card, media card, summary strip, status card). Example copy in quotes (e.g. "Add Item") illustrates **format and tone**, not required wording.

---

## 1. Design language in one page

These ten principles summarise L1 and L2. They are the identity to preserve.

1. **Dark, low-glare console.** Near-black blue-grey surfaces (`#15191c` → `#1d2328`). Pure white is reserved for primary text and key numbers.
2. **Depth through shadow, not lines.** Cards have **no borders**. They lift off the page with a two-layer drop shadow plus a 1 px top inner highlight (`inset 0 1px 0 white/7%`). Lines are used only *inside* components, as dividers.
3. **Raised vs. sunken.** There are two kinds of surface:
   - **Raised** (cards, filter triggers, active tab pills, the active nav item) are lighter, with drop shadows.
   - **Sunken / debossed** (text inputs, form selects, tab tracks, close buttons) are darker, with an inner top shadow (`inset 0 2px 4px 1px black/75%`) and a 1 px white/4% bottom highlight.
   - **Fields and select triggers have no default border.** Their edge is drawn by surface and shadow alone. A visible edge appears only for focus (blue outline), error (red ring) or the opt-in boundary mode (§9.3).
4. **One accent.** Blue is the only brand hue. `#2563eb` fills primary actions and selected states; `#3b82f6` draws focus rings, borders and graphics; `#60a5fa` / `#93c5fd` color blue *text* on dark surfaces. Status colors (green, amber, red) carry meaning only.
5. **Glowing status.** Status is shown with small glowing dots (`box-shadow: 0 0 10px <glow>, 0 0 2px <dot>`) **plus a text label**, not with large color fills.
6. **Strict, small type scale.** Inter at 10 / 12 / 14 / 16 / 20 / 24 px (plus two named exceptions). Headings use tight negative tracking. Uppercase labels use positive tracking.
7. **Dense but calm.** 16 px page gutter, 16 px card padding, 44 px table rows, 40 px controls. Tables have no row borders; zebra striping is at white/1%. A comfortable density mode (§2.13) is available, but dense is the default.
8. **Illustrated identity, outline actions.** Navigation and headline metrics use glossy navy/blue 3D illustrations; actions use thin outline icons in muted grey.
9. **Visible, reliable focus.** Every interactive element shows a 2 px blue outline on keyboard focus. Outlines are never removed without a replacement.
10. **Overlays never close by accident.** Backdrop clicks never close modals or panels. Escape closes them unless there are unsaved edits (R-21).

---

## 2. Foundations

### 2.1 Color primitives

**Primitive names below are reference labels** (e.g. `neutral-800`), used for traceability only. They are **not** emitted as CSS custom properties; the semantic tokens in §3 carry the values. Exceptions: the `--ds-tag-*` and `--ds-heat-*` rows are real tokens, declared in §3, because components reference them directly.

Primitives are raw values. **Components must not reference primitives directly.** Use the semantic tokens in §2.2. Primitives are listed so that every semantic token is traceable.

#### Neutrals (surfaces, darkest → lightest)

| Primitive | HEX | Observed usage |
|---|---|---|
| `neutral-1000` | `#0b0e13` | Media well behind images/video |
| `neutral-975` | `#0b0f14` | Dark text placed on bright chart segments |
| `neutral-950` | `#111418` | Tab track (raised variant); focus ring offset color |
| `neutral-925` | `#121620` | Sunken square buttons (panel close); inactive stepper index |
| `neutral-910` | `#151a1f` | Rich tooltip background |
| `neutral-900` | `#15191c` | App background; slide-panel header/footer |
| `neutral-890` | `#161a1e` | Text input / sunken field |
| `neutral-885` | `#161a20` | Slide-panel body, media card body, accent tab track |
| `neutral-880` | `#171b26` | Attach/upload button inside fields |
| `neutral-875` | `#171c1f` | Card footer strip |
| `neutral-870` | `#182027` | Retired. Was a second card tint; see §11 R-06 |
| `neutral-860` | `#18202d` | Initials avatar fill (neutral) |
| `neutral-850` | `#1b1f22` | Shell panels (sidebar + main content panel) |
| `neutral-800` | `#1d2328` | **Card surface** (KPI, table card, section card), select trigger, menus |
| `neutral-780` | `#202a39` | Selected radio-card fill |
| `neutral-775` | `#212629` | Pinned (sticky) table header row |
| `neutral-770` | `#21272d` | Footer row inside menus/pickers |
| `neutral-760` | `#232a30` | Select trigger hover |
| `neutral-750` | `#262a30` | Input-family borders (dashed upload, list dividers inside pickers) |
| `neutral-745` | `#262d34` | Hover of the menu footer row |
| `neutral-740` | `#292e33` | Divider between card header and table/heatmap |
| `neutral-735` | `#2a3035` | Internal dividers in entity cards (used at 50% opacity) |
| `neutral-730` | `#2b3136` | Vertical divider in summary strips |
| `neutral-700` | `#333333` | Logo tile outline |
| `neutral-650` | `#334155` | Neutral avatar outline |
| `neutral-640` | `#394c5e` | Unselected radio-card border |
| `neutral-630` | `#3a434b` | Rich tooltip border |

#### Text neutrals

| Primitive | HEX | Observed usage |
|---|---|---|
| `white` | `#ffffff` | Primary text, numbers, titles |
| `slate-50` | `#f4f6f8` | Strong text inside the rich tooltip |
| `slate-75` | `#f4f7fa` | Row labels in matrix charts |
| `slate-300` | `#cbd5e1` | Secondary text: table values, secondary button text |
| `slate-350` | `#aeb8c5` | Labels inside the rich tooltip |
| `slate-375` | `#9eacba` | Chart subtitles and chart axis captions |
| `slate-400` | `#94a3b8` | Muted text: labels, form labels, meta, inactive nav |
| `gray-500` | `#6b7280` | Chevron / disclosure icon strokes |
| `slate-500` | `#64748b` | Tertiary text: legend labels, sub-captions, action icon strokes |
| `slate-600` | `#475569` | Placeholder text, de-emphasised denominators, sort icons |

#### Brand blue

| Primitive | HEX |
|---|---|
| `blue-300` | `#93c5fd` |
| `blue-400` | `#60a5fa` |
| `blue-500` | `#3b82f6` |
| `blue-600` | `#2563eb` |
| `blue-700` | `#1d4ed8` |
| `indigo-400` | `#818cf8` (gradient partner only) |
| `indigo-500` | `#6366f1` (gradient partner only) |

#### Status

| Primitive | HEX | Role |
|---|---|---|
| `green-200` | `#a7f3d0` | Highlight in 3D status ball |
| `green-400` | `#34d399` | Success text and success dot |
| `green-500` | `#10b981` | Success glow; "good" chart series |
| `green-500b` | `#22c55e` | Positive detection frame on media |
| `green-700` | `#047857` | Shadow in 3D status ball |
| `amber-400` | `#fbbf24` | Warning text and warning dot |
| `amber-500` | `#f59e0b` | Warning glow / tint base |
| `red-200` | `#fecaca` | Highlight in 3D status ball |
| `red-400` | `#f87171` | Error text, validation, required asterisk |
| `red-500` | `#ef4444` | Error border / ring, inactive dot |
| `red-700` | `#b91c1c` | Inactive dot glow |
| `red-800` | `#991b1b` | Shadow in 3D status ball |
| `rose-400` | `#fb7185` | Non-zero alert counts in tables |
| `orange-500` | `#ff5825` | "Bad / stopped" chart series; heat-scale maximum |

#### Categorical & tag primitives

| Primitive | HEX | Role |
|---|---|---|
| `cat-1` | `#016ffe` | Chart category 1 (blue) |
| `cat-2` | `#8b34fd` | Chart category 2 (violet) |
| `cat-3` | `#fbb645` | Chart category 3 (amber) |
| `cat-4` | `#00bac9` | Chart category 4 (teal) |
| `--ds-tag-purple` | `#4d3f9d` | Solid tag fill |
| `--ds-tag-blue` | `#3f779d` | Solid tag fill |
| `--ds-tag-green` | `#457e32` | Solid tag fill (darkened for contrast, R-36) |
| `--ds-tag-amber` | `#95693c` | Solid tag fill (darkened for contrast, R-36) |
| `--ds-tag-rose` | `#9d3f5a` | Solid tag fill |
| `--ds-heat-0` | `#00403a` | Heat scale stop 0.00 |
| `--ds-heat-1` | `#11603a` | Heat scale stop 0.25 |
| `--ds-heat-2` | `#597730` | Heat scale stop 0.50 |
| `--ds-heat-3` | `#ca8a35` | Heat scale stop 0.75 |
| `--ds-heat-4` | `#ff5825` | Heat scale stop 1.00 |

### 2.2 Semantic color tokens

**Always use these in components.** Each token has one job.

#### Backgrounds & surfaces

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-bg-app` | `#15191c` | `<body>` / outermost viewport background behind the shell |
| `--ds-color-bg-shell` | `#1b1f22` | The two shell panels: sidebar and main content panel |
| `--ds-color-surface-card` | `#1d2328` | Every raised card: KPI, table card, section card, dashboard card, entity card, summary strip, dialogs, menus, select triggers, pagination bar, active tab pill, active nav item |
| `--ds-color-surface-card-hover` | `#232a30` | Hover fill for raised select triggers |
| `--ds-color-surface-card-footer` | `#171c1f` | Footer strip at the bottom of media cards |
| `--ds-color-surface-elevated` | `#21272d` | Footer row inside menus/pickers (e.g. "+ Add" row, inline add form) |
| `--ds-color-surface-elevated-hover` | `#262d34` | Hover of `surface-elevated` rows |
| `--ds-color-surface-overlay` | `#161a20` | Slide-panel body, media card body, large media modal body |
| `--ds-color-surface-overlay-chrome` | `#15191c` | Slide-panel header and footer bars |
| `--ds-color-surface-sunken` | `#161a1e` | Text inputs, textareas, multi-select trigger, rich picker trigger |
| `--ds-color-surface-sunken-deep` | `#111418` | Track of the raised segmented tabs |
| `--ds-color-surface-sunken-alt` | `#161a20` | Track of the accent segmented tabs |
| `--ds-color-surface-sunken-button` | `#121620` | Square sunken buttons (panel close), inactive stepper index |
| `--ds-color-surface-media` | `#0b0e13` | Behind images / video frames |
| `--ds-color-surface-table-header` | `rgba(255,255,255,0.02)` | Table header row (non-sticky), heatmap header row |
| `--ds-color-surface-table-header-pinned` | `#212629` | Table header row when sticky (must be opaque) |
| `--ds-color-surface-tooltip` | `#151a1f` | Rich chart tooltip |
| `--ds-color-surface-callout` | `#111923` | Informational callout box inside forms |
| `--ds-color-surface-hover` | `rgba(255,255,255,0.05)` | Hover fill: ghost buttons, icon buttons, menu options, inactive nav items, clickable table rows |
| `--ds-color-surface-hover-subtle` | `rgba(255,255,255,0.03)` | Hover of inactive tabs and picker rows |
| `--ds-color-surface-row-hover` | `rgba(255,255,255,0.02)` | Hover of non-clickable table rows |
| `--ds-color-surface-row-stripe` | `rgba(255,255,255,0.01)` | Every 2nd (even-numbered) table body row |
| `--ds-color-surface-selected` | `rgba(255,255,255,0.05)` | Selected option in a menu |
| `--ds-color-surface-pill` | `rgba(255,255,255,0.04)` | Count pill fill |

#### Text

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-text-primary` | `#ffffff` | Titles, numbers, active labels, first table column, input values |
| `--ds-color-text-secondary` | `#cbd5e1` | Table values (2nd column onward), secondary button label, select trigger value, body copy in cards |
| `--ds-color-text-muted` | `#94a3b8` | Form labels, KPI labels, table headers, meta text, inactive nav/tabs, descriptions, empty-state text |
| `--ds-color-text-tertiary` | `#8695aa` | **[STANDARDIZED, R-46]** The quietest *readable* text: sub-captions, counts on inactive tabs, captions under timestamps, roles under names, denominators ("/12"), inactive stepper subtitles. ≥ 4.51:1 on every surface |
| `--ds-color-text-placeholder` | `#77879d` | **[STANDARDIZED, R-46]** Placeholders and empty-select prompts, **on sunken fields only** (4.78:1) |
| `--ds-color-text-faint` | `#475569` | **Decorative only** (2.09:1): `aria-hidden` separators such as the breadcrumb "/". Never for readable information |
| `--ds-color-text-on-brand` | `#ffffff` | Text on solid blue (primary button, active pagination, accent tab) |
| `--ds-color-text-on-bright` | `#0b0f14` | Text on bright chart segments (green/orange bars) |
| `--ds-color-text-chart-subtle` | `#9eacba` | Chart subtitles, matrix row sub-labels, matrix axis labels |
| `--ds-color-text-chart-strong` | `#f4f7fa` | Matrix row labels |
| `--ds-color-text-tooltip` | `#f4f6f8` | Strong values in rich tooltip |
| `--ds-color-text-tooltip-muted` | `#aeb8c5` | Labels in rich tooltip |
| `--ds-color-text-axis` | `rgba(255,255,255,0.6)` | Y-axis tick labels |

#### Borders & dividers

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-border-subtle` | `rgba(255,255,255,0.06)` | Default hairline: dialog outline, slide-panel edge and header border, pagination top border, menu search divider, count-pill outline, inactive pagination button |
| `--ds-color-border-faint` | `rgba(255,255,255,0.05)` | Divider under section headers, between table header block and table |
| `--ds-color-border-strong` | `rgba(255,255,255,0.08)` | Slide-panel footer top border, segmented status toggle outline, sidebar user card, attach button |
| `--ds-color-border-control` | `rgba(255,255,255,0.10)` | Secondary button outline |
| `--ds-color-border-control-hover` | `rgba(255,255,255,0.20)` | Hover outline: secondary button, close button, pagination, unselected radio card; unchecked checkbox |
| `--ds-color-border-control-strong` | `#6b7280` | **[STANDARDIZED, R-42]** Unchecked checkbox border (3.28:1); control boundaries in **boundary mode only** (§9.3). Never on default fields or select triggers (R-56, revised in rev 6) |
| `--ds-color-border-on-brand` | `rgba(255,255,255,0.30)` | Outline of brand-filled small controls (current pagination button) |
| `--ds-color-border-track` | `rgba(255,255,255,0.04)` | Outline of the accent segmented-tab track |
| `--ds-color-scrollbar` | `rgba(255,255,255,0.12)` | Scrollbar thumb (hover: `--ds-color-scrollbar-hover`, white/20%) |
| `--ds-color-skeleton` | `rgba(255,255,255,0.06)` | Skeleton loading bars |
| `--ds-color-border-divider` | `#292e33` | Card-header-to-content divider (dashboard cards), heatmap column divider |
| `--ds-color-border-input` | `#262a30` | Dashed upload outline, list dividers inside pickers |
| `--ds-color-border-card-internal` | `rgba(42,48,53,0.5)` | Dividers between sections inside entity cards (`#2a3035` at 50%) |
| `--ds-color-border-vertical` | `#2b3136` | Vertical divider in summary strips |
| `--ds-color-border-radio` | `#394c5e` | Unselected radio card |
| `--ds-color-border-tooltip` | `#3a434b` | Rich tooltip outline |
| `--ds-color-border-callout` | `#25344b` | Informational callout outline |
| `--ds-color-border-media` | `rgba(255,255,255,0.07)` | Media card outline |

#### Brand & interactive

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-brand` | `#3b82f6` | Focus outlines, primary button border, checked checkbox border, radio-on glyph, toggle selected ring, brand dots and graphics. **Never as text** (4.31:1 on card, R-39) |
| `--ds-color-brand-strong` | `#2563eb` | Primary button fill, active pagination fill, checked checkbox fill, active stepper index, selected radio-card border, active accent tab fill |
| `--ds-color-brand-stronger` | `#1d4ed8` | **[STANDARDIZED]** Primary button hover fill |
| `--ds-color-brand-text` | `#93c5fd` | Brand-colored informational text on dark (eyebrow labels, "+ Add" menu row, info chip text) |
| `--ds-color-link` | `#60a5fa` | **[STANDARDIZED, R-39]** Blue text on dark surfaces: link actions, open-record actions, roles under names, active stepper subtitle, icon-tile glyphs (6.24:1 on card) |
| `--ds-color-link-hover` | `#93c5fd` | Hover color of `link` text (8.80:1) |
| `--ds-color-brand-tint-10` | `rgba(59,130,246,0.10)` | Icon tile fill, info chip fill |
| `--ds-color-brand-tint-20` | `rgba(59,130,246,0.20)` | Tonal button fill; icon tile / info chip border; glow under user card |
| `--ds-color-brand-tint-30` | `rgba(59,130,246,0.30)` | Tonal button hover |
| `--ds-color-brand-border-hover` | `rgba(59,130,246,0.40)` | Media card hover outline |
| `--ds-color-focus-ring` | `#3b82f6` | All focus indicators |
| `--ds-color-focus-ring-on-color` | `#ffffff` | Focus outline on elements filled with a data color (heatmap cells) |

#### Status (semantic)

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-success-text` | `#34d399` | Success text, "running/healthy" values, success dot core |
| `--ds-color-success-glow` | `#10b981` | Glow around success dots |
| `--ds-color-success-bg` | `rgba(16,185,129,0.10)` | Success badge fill |
| `--ds-color-success-border` | `rgba(16,185,129,0.20)` | Success badge outline |
| `--ds-color-warning-text` | `#fbbf24` | Warning text/values, idle dot core |
| `--ds-color-warning-glow` | `#f59e0b` | Glow around warning dots |
| `--ds-color-warning-bg` | `rgba(245,158,11,0.10)` | Warning badge fill **[EXTENSION: badge]** |
| `--ds-color-warning-border` | `rgba(245,158,11,0.20)` | Warning badge outline **[EXTENSION: badge]** |
| `--ds-color-warning-row-tint` | `rgba(245,158,11,0.02)` | Table row tint for warning/idle rows |
| `--ds-color-error-text` | `#f87171` | Error text, validation messages, required asterisk, danger button label |
| `--ds-color-error` | `#ef4444` | Error input ring, error dashed border, inactive dot core |
| `--ds-color-error-glow` | `#b91c1c` | Glow around error dots |
| `--ds-color-error-bg` | `rgba(239,68,68,0.10)` | Danger button fill, error badge fill |
| `--ds-color-error-bg-hover` | `rgba(239,68,68,0.20)` | Danger button hover |
| `--ds-color-error-border` | `rgba(239,68,68,0.20)` | Danger button / error badge outline |
| `--ds-color-critical` | `#ff5825` | "Bad/stopped" in charts and progress bars only (never for form errors) |
| `--ds-color-critical-row-tint` | `rgba(255,88,37,0.02)` | Table row tint for stopped/failed rows |
| `--ds-color-alert-count` | `#fb7185` | Non-zero alert/alarm counts in table cells |
| `--ds-color-info-text` | `#93c5fd` | **[EXTENSION]** Informational text (same as brand-text) |
| `--ds-color-info-bg` | `rgba(59,130,246,0.10)` | **[EXTENSION]** Info badge fill |
| `--ds-color-info-border` | `rgba(59,130,246,0.20)` | **[EXTENSION]** Info badge outline |

#### Overlays

| Token | Value | Use exactly for |
|---|---|---|
| `--ds-color-overlay-modal` | `rgba(0,0,0,0.50)` | Backdrop behind centered modals/dialogs |
| `--ds-color-overlay-panel` | `rgba(0,0,0,0.40)` | Backdrop behind slide-in panels |
| `--ds-overlay-blur` | `8px` | `backdrop-filter: blur()` on both backdrops |

#### Disabled

There is no disabled color. Disabled controls keep their colors and get **`opacity: 0.4`** plus `pointer-events: none` (buttons, icon buttons, pagination). Disabled radio groups use the same `opacity: 0.4`, plus `cursor: not-allowed` (R-17).

### 2.3 Typography

#### Font family

```
--ds-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Load Inter weights **400, 500, 600, 700**:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```

There is no monospace font. Codes, IDs, barcodes and IP addresses use Inter. For long numeric identifiers, add `letter-spacing: 0.55px` (see `field-value`).

#### Type scale — the only six font sizes

| Scale token | Size | Default line height | Role |
|---|---|---|---|
| `--ds-font-size-caption` | 10px | 14px | Sub-labels: secondary role text, tiny captions |
| `--ds-font-size-label` | 12px | 16px | Form labels, KPI labels, table headers, meta, small buttons |
| `--ds-font-size-body` | 14px | 20px | Default text, table cells, inputs, buttons, badges |
| `--ds-font-size-value` | 16px | 22px | Emphasised data values, subgroup titles, large buttons |
| `--ds-font-size-heading` | 20px | 28px | Card / panel / dialog titles, KPI values |
| `--ds-font-size-title` | 24px | 32px* | Page titles (*rendered with a 28 px line height, see `page-title`) |

**Two sanctioned exceptions [STANDARDIZED]:** `--ds-font-size-micro: 11px` is used only for chart axis captions and the rich-tooltip header. `--ds-font-size-subheading: 18px` is used only for the summary-strip title. No other sizes are allowed.

#### Named text styles

Every text element in a new product must use one of these styles.

| Style token | Family | Size | Weight | Line height | Letter spacing | Transform | Color token | Usage |
|---|---|---|---|---|---|---|---|---|
| `page-title` | Inter | 24px | 600 | 28px | -0.35px | — | text-primary | One `<h1>` per page, in the page header |
| `dialog-title` | Inter | 20px | 700 | 28px | -0.5px | — | text-primary | Modal, confirm dialog and slide-panel titles |
| `card-title` | Inter | 20px | 600 | 24px | -0.4px | — | text-primary | Dashboard / chart card titles, entity card name, media card title. Wraps (max 2 lines before the card grows); see §2.3 long content |
| `group-title` | Inter | 20px | 700 | 24px | -0.5px | — | text-primary | Collapsible section titles, table section header title |
| `subgroup-title` | Inter | 16px | 700 | 22px | -0.5px | — | text-primary | Nested/compact collapsible section titles |
| `summary-title` | Inter | 18px | 700 | 24px | -0.3px | — | text-primary | Summary-strip main title only; clamp to 2 lines |
| `kpi-value` | Inter | 20px | 700 | 28px | -0.65px | — | text-primary | KPI card value |
| `kpi-label` | Inter | 12px | 700 | 16px | +0.55px | UPPERCASE | text-muted | KPI card label |
| `metric-value` | Inter | 16px | 700 | 24px | -0.65px | — | text-primary | Inline metrics in entity cards |
| `metric-denominator` | Inter | 12px | 500 | 24px | 0 | — | text-tertiary | The "/12" part of "8/12" |
| `metric-label` | Inter | 12px | 500 | 18px | +0.4px | UPPERCASE | text-muted | Labels above inline metrics |
| `field-label` | Inter | 14px | 500 | 20px | 0 | — | text-muted | Labels in summary strips (label above value) |
| `field-value` | Inter | 16px | 400 | 24px | +0.55px | — | text-primary | Values in summary strips; identifiers |
| `eyebrow` | Inter | 14px | 400 | 20px | +0.55px | — | brand-text | Context label above a summary title, preceded by an 8 px brand dot |
| `body` | Inter | 14px | 400 | 20px | 0 | — | text-secondary | Default paragraph / cell text |
| `body-muted` | Inter | 14px | 400 | 20px | 0 | — | text-muted | Descriptions, dialog messages, empty states, "Showing …" |
| `body-strong` | Inter | 14px | 500 | 20px | 0 | — | text-primary | Names, primary cell values |
| `body-emphasis` | Inter | 14px | 600 | 20px | 0 | — | text-primary | Emphasised numbers in dense tables |
| `small` | Inter | 12px | 400 | 16px | 0 | — | text-muted | Meta lines, secondary line under a name |
| `small-strong` | Inter | 12px | 600 | 16px | 0 | — | text-secondary | Callout titles, compact strip labels |
| `caption` | Inter | 10px | 400 | 14px | 0 | — | text-tertiary | Role under a name, smallest annotations |
| `table-header` | Inter | 12px | 600 | 16px | +0.3px (0.025em) | UPPERCASE | text-muted | `<th>` |
| `table-cell-primary` | Inter | 14px | 500 | 20px | 0 | — | text-primary | First column of a table |
| `table-cell` | Inter | 14px | 400 | 20px | 0 | — | text-secondary | All other columns |
| `form-label` | Inter | 12px | 500 | 16px | 0 | — | text-muted | Field labels |
| `input-text` | Inter | 14px | 400 | 20px | 0 | — | text-primary | Typed values |
| `placeholder` | Inter | 14px | 400 | 20px | 0 | — | text-placeholder | Placeholders, empty select |
| `validation` | Inter | 12px | 400 | 16px | 0 | — | error-text | Field errors |
| `button-sm` | Inter | 12px | 600 | 16px | 0 | — | per variant | Small buttons |
| `button-md` | Inter | 14px | 600 | 20px | 0 | — | per variant | Default buttons |
| `button-lg` | Inter | 16px | 600 | 22px | 0 | — | per variant | Large buttons |
| `badge` | Inter | 14px | 600 | 20px | 0 | — | per status | Status badge (md) |
| `badge-sm` | Inter | 12px | 600 | 16px | 0 | — | per status | Status badge (sm) |
| `tag` | Inter | 14px | 500 | 20px | 0 | — | white | Solid category tag |
| `count-pill` | Inter | 14px | 700 | 18px | 0 | — | text-secondary | Count next to a group title |
| `nav-item` | Inter | 14px | 500 (600 when current) | 20px | 0 | — | muted / primary | Sidebar items |
| `nav-section` | Inter | 12px | 400 | 16px | 0 | — | text-muted | Sidebar group labels |
| `tab` | Inter | 14px | 400 (600 when selected) | 20px | 0 | — | muted / primary | Raised segmented tabs |
| `tab-accent` | Inter | 14px | 600 | 20px | -0.4px | — | muted / primary | Accent segmented tabs |
| `tab-count` | Inter | 12px | 400 | 16px | 0 | — | muted (active) / tertiary | "(12)" after a tab label |
| `link-action` | Inter | 14px | 600 | 20px | 0 | — | link → link-hover | Inline text actions ("+ Add new …") |
| `legend` | Inter | 14px | 500 | 22px | 0 | — | text-muted | Chart legends (swatch style) |
| `legend-sm` | Inter | 12px | 500 | 16px | 0 | — | text-muted | Compact legends (dot style) |
| `axis-y` | Inter | 12px | 400 | 24px | -0.4px | — | text-axis | Y-axis ticks |
| `axis-x` | Inter | 14px | 400 | 24px | -0.4px | — | text-primary | X-axis category labels |
| `axis-caption` | Inter | 11px | 400 | 14px | 0 | — | chart-subtle | Dense categorical axis labels (2-line clamp) |
| `data-label` | Inter | 16px | 400 | 22px | -0.4px | — | text-primary + text-shadow `0 1px 3px rgba(0,0,0,0.8)` | Labels on chart points |
| `tooltip-title` | Inter | 11px | 700 | 13px | 0 | — | text-tooltip | Rich tooltip header |
| `tooltip-body` | Inter | 10px | 400 | 12px | 0 | — | tooltip-muted / tooltip | Rich tooltip rows |
| `heat-cell` | Inter | 14px | 600 | 20px | -0.4px | — | white | Heatmap cells and heatmap headers (headers: text-muted, line height 24px, UPPERCASE) |
| `bar-segment` | Inter | 12px | 600 | 1 (12px) | 0 | — | text-on-bright | Numbers inside progress segments |
| `toast` | Inter | 14px | 400 | 20px | 0 | — | text-primary | Toast message |

**Typography rules**

- Headings (≥16 px, bold or semibold) **always** use negative tracking: -0.25 to -0.65px as listed. Body text uses 0.
- UPPERCASE text **always** has positive tracking (+0.3 to +0.55px) and weight ≥500.
- Numbers in KPI and metric styles use bold with -0.65px tracking.
- Never use font sizes outside the six-step scale plus the two exceptions.
- Never use weights other than 400/500/600/700. Never use italics, except one observed case: a detected value inside a media-card footer (`font-style: italic; font-weight: 400`).

#### Text scaling, rem units and long content [STANDARDIZED, R-52, R-53]

**1. Pixels describe the default appearance; rem is an equivalent implementation.** Every value in this document is specified at the browser default of 16px per rem. A product MAY implement typography and sizing in `rem` (value ÷ 16) and SHOULD do so when users are likely to change their browser's default text size. The default rendering is identical.

| Token | px (reference) | rem (equivalent) |
|---|---|---|
| caption | 10px / 14px | 0.625rem / 0.875rem |
| micro | 11px / 14px | 0.6875rem / 0.875rem |
| label | 12px / 16px | 0.75rem / 1rem |
| body | 14px / 20px | 0.875rem / 1.25rem |
| value | 16px / 22px | 1rem / 1.375rem |
| subheading | 18px / 24px | 1.125rem / 1.5rem |
| heading | 20px / 28px | 1.25rem / 1.75rem |
| title | 24px / 28px | 1.5rem / 1.75rem |

Rules for a rem implementation:
- Convert **font sizes, line heights, control min-heights and spacing** together. Never convert font sizes alone: px line heights would then clip enlarged text.
- **Keep in px:** borders (1–2px), focus outline width and offset, shadow offsets/blurs, letter-spacing (it is tiny), icon glyph sizes, status dots and the scrollbar width.
- Tokens keep their names; only the unit changes. Convert each category **completely**: never mix units *within* a category (some font sizes in px and others in rem, or rem padding on one control and px on its neighbour). The px items listed above are the only intended mix.

**2. Zoom and text resizing MUST NOT break the interface** (SC 1.4.4 resize text to 200%, SC 1.4.10 reflow at 320px, SC 1.4.12 text spacing).
- Controls, rows, headers and cards use **minimum** heights (§2.8 dimension types), so enlarged text grows them instead of clipping.
- Text containers never have a fixed height. Use `min-height` plus content.
- Buttons and tabs may wrap their label onto a second line when space runs out. They never clip it.
- Every layout reflows per §8 at 320 CSS px (equivalent to 1280px at 400% zoom).

**3. Long content.** Meaningful information is never cut off without a way to read it.

| Text | Rule |
|---|---|
| **Never truncate** | KPI values, KPI labels, form labels, validation and error messages, status labels, badge text, button labels, dialog titles and messages, toast text, column headers |
| **Wrap (default)** | Page titles, card and group titles, entity names in cards, descriptions, table free-text columns. Card titles wrap to 2 lines before the card grows |
| **Clamp to 2 lines, with recovery** | Summary-strip title (R-23), dense chart axis captions. The full text is available in a §5.49 tooltip or in an accessible name |
| **Truncate with recovery** | Select-trigger values (the full value is in the menu and accessible name), table identifier cells (a tooltip on the focusable row link, or the detail view), nav labels (tooltip, §5.37) |

Use `overflow-wrap: anywhere` on containers that may receive long unbroken strings (IDs, emails, URLs) so they wrap instead of overflowing.

**4. Controlled typography extensions.** The type scale is closed. When a product has an exceptional need:
1. **Compose first**: weight (400–700), color token, case and tracking from existing styles. A large hero number uses `page-title` (24/28 600) or `kpi-value` (20/28 700); a de-emphasised note uses `small`.
2. **Never write an inline font size.** Even a correct value must come from a token.
3. If a genuinely new size is unavoidable (e.g. a display numeral on a wall-mounted screen), it requires **designer approval**. It is then added to §3 as a named token (`--ds-font-size-<role>` + line height), documented as a named exception like R-23, logged in §11 and restricted to its stated role. Sizes MUST stay on a 2px grid between 10 and 32px.

### 2.4 Spacing

Base unit **4 px**. The system also uses a few **2 px half-steps** (2, 6, 10, 14) inside components.

| Token | Value | Typical use |
|---|---|---|
| `--ds-space-0-5` | 2px | Label→error offset, title→subtitle in tight stacks, avatar ring |
| `--ds-space-1` | 4px | Menu offset from trigger, page-content top padding, sidebar nav item gap, tab count gap |
| `--ds-space-1-5` | 6px | Form label → control gap, badge dot gap, pagination button gap, sort icon gap |
| `--ds-space-2` | 8px | Button icon gap, small icon→text gap, dialog title→message gap |
| `--ds-space-2-5` | 10px | Back-button→title gap, chart y-axis→plot gap, avatar→name gap, user-card padding |
| `--ds-space-3` | 12px | Header action gap, KPI icon→text gap, row action gap, section stack gap, dialog button gap |
| `--ds-space-3-5` | 14px | Title→count-pill gap, nav item horizontal padding, callout padding |
| `--ds-space-4` | 16px | **Page gutter**, KPI card padding, card grid gap, table cell horizontal padding, section header horizontal padding |
| `--ds-space-5` | 20px | Entity card padding, dashboard row gap, form column gap, slide-panel header/footer vertical padding |
| `--ds-space-6` | 24px | Dashboard card padding, dialog padding, slide-panel horizontal padding, page section gap, form row gap |
| `--ds-space-8` | 32px | Horizontal padding of the large content (media viewer) modal |
| `--ds-space-10` | 40px | Gap between form sections |
| `--ds-space-12` | 48px | Empty-state vertical padding, title-row→stepper gap in panel headers |
| `--ds-space-16` | 64px | Empty-state vertical padding inside charts |

#### Semantic spacing (use these names in layouts)

| Token | Value | Applies to | Kind |
|---|---|---|---|
| `--ds-space-page-gutter` | 16px | Left/right/bottom padding of the scrolling page content; page header horizontal padding | padding |
| `--ds-space-page-top` | 4px | Top padding of page content (the header supplies the visual gap) | padding |
| `--ds-space-shell-padding` | 16px | Padding around the shell (viewport → sidebar/main panel) | padding |
| `--ds-space-shell-gap` | 20px | Between sidebar and main panel | gap |
| `--ds-space-section` | 24px | **[STANDARDIZED]** Between every vertically stacked page section, on every page type: KPI row → table, chart card → chart card (R-08) | gap |
| `--ds-space-grid` | 16px | Between horizontally adjacent tiles whose padding is ≤20px: KPI cards, entity cards | gap |
| `--ds-space-grid-lg` | 20px | Between horizontally adjacent large cards with 24px padding: chart cards, status cards, media cards (R-08) | gap |
| `--ds-space-stack` | 12px | Between collapsible section cards in a grouped list | gap |
| `--ds-space-card` | 16px | Padding of KPI cards and summary strips (vertical 12px for strips) | padding |
| `--ds-space-card-lg` | 20px | Padding of entity (content) cards | padding |
| `--ds-space-card-xl` | 24px | Padding of dashboard/chart cards, dialogs | padding |
| `--ds-space-card-gap` | 16px | Between sections inside an entity card | gap |
| `--ds-space-chart-gap` | 20px | Between a chart card's title row and its content | gap |
| `--ds-space-header-actions` | 12px | Between controls in the page header | gap |
| `--ds-space-form-label` | 6px | Label → control | gap |
| `--ds-space-form-col` | 20px | Between columns of a form grid | gap |
| `--ds-space-form-row` | 24px | **[STANDARDIZED]** Between rows of every form, single or two-column (R-09) | gap |
| `--ds-space-form-section` | 40px | Between groups of fields that form separate topics (e.g. "Identity" vs "Configuration") | gap |
| `--ds-space-icon-text` | 8px | Icon → label inside buttons, menu items, legends (dot) | gap |
| `--ds-space-icon-text-lg` | 12px | 40px icon → text block (KPI, entity header), legend swatch → label | gap |
| `--ds-space-cell-x` | 16px | Table cell left/right padding | padding |
| `--ds-space-cell-y` | 12px | Table cell top/bottom padding | padding |

**Margin vs padding vs gap rules**

- Use **gap** (flex/grid) for spacing between siblings. This is the default.
- Use **padding** for the inside of containers.
- Use **margin** only for: (a) the 4px offset between a trigger and its floating menu (`margin-top: 4px`); (b) the 2px nudge of validation text below a field; (c) the 2px label-to-sublabel offset in sidebar section labels. No other margins.

### 2.5 Radii

| Token | Value | Applies to |
|---|---|---|
| `--ds-radius-xs` | 4px | Solid tags, checkboxes, info chips, top corners of chart bars, legend swatches, media annotation frames, small focusable text links |
| `--ds-radius-chip` | 6px | Pagination buttons, progress/status bars |
| `--ds-radius-sm` | 8px | Icon buttons, segmented tab pills, radio cards, toast, tooltips (label and rich), inline callouts, square sunken buttons, stepper indices, logo tile |
| `--ds-radius-control` | 10px | Buttons, inputs, select triggers, file upload dropzone, binary status toggle; **anchored floating panels**: dropdown menus and popovers (R-51) |
| `--ds-radius-track` | 12px | Segmented-tab track, icon tiles |
| `--ds-radius-nested` | 16px | Cards nested inside a card (nested group card), sidebar nav items |
| `--ds-radius-card` | 20px | **Every top-level card**: KPI, table card, chart/dashboard card, collapsible section card, entity card, media card, summary strip. Also shell panels, dialogs, modals, sidebar user card |
| `--ds-radius-full` | 9999px | Badges, count pills, status dots, avatars |

**Radius hierarchy [STANDARDIZED, R-05, reviewed in R-51].** Radius is assigned by **role**, using the existing values only:

| Role | Token | Value | Members | Why this radius |
|---|---|---|---|---|
| **Surface** (top-level containers) | `radius-card` | 20px | Shell panels, KPI/table/chart/section/entity/media cards, summary strips, dialogs, modals, the sidebar user card | One shape for every "container of content". Dialogs and modals share it deliberately: their elevation is expressed by shadow, backdrop and position, **not** by a different corner. A larger dialog radius (the source's 32px viewer modal) added a value without adding meaning |
| **Nested surface** | `radius-nested` | 16px | Cards inside cards, sidebar nav items (inside the 20px rail) | Inner corners must be ≤ outer corners. 20px outer − (inset padding) → 16px reads as concentric at the 10–16px insets used here |
| **Control & anchored floating panel** | `radius-control` | 10px | Buttons, inputs, selects, dropzone, binary toggle; **dropdown menus and popovers** | A panel that opens from a 10px control shares that control's corner, so the pair reads as one unit |
| **Small element** | `radius-sm` | 8px | Icon buttons, tab pills, radio cards, toast, tooltips, callouts, stepper indices | Small, self-contained elements; a 10px radius would look pill-like at 28–36px |
| **Track** | `radius-track` | 12px | Segmented-tab tracks, icon tiles | 12 = 8px pill + 5px inset (rounded): concentric with the pills it holds |
| **Chip / bar** | `radius-chip` | 6px | Pagination buttons, progress bars | — |
| **Micro** | `radius-xs` | 4px | Tags, checkboxes, chart bar tops, info chips | — |
| **Pill / circle** | `radius-full` | 9999px | Badges, count pills, dots, avatars | — |
| **Edge-attached** | none (0) | 0 | Slide panels, the mobile top bar | They are attached to a viewport or panel edge; rounding a flush edge would show gaps |

**Decision:** keep **20px as the single surface radius**. A separate dialog radius would make overlays look like a different family of object, while shadow and backdrop already establish their hierarchy. The rules stay simple: surface 20, nested 16, controls and their panels 10, small 8. No new values were added. The one change in this review is that popovers move from 8px to 10px to match menus (R-51).


### 2.6 Borders

| Token | Value | Applies to |
|---|---|---|
| `--ds-border-width` | 1px | Every border in the system |
| `--ds-border-width-emphasis` | 2px | Media modal header bottom border, large icon tile border, media detection frame, stepper connector (height) |
| Dashed | `1px dashed` | File upload dropzone only |

Cards and the shell **have no borders**. Borders appear only on: buttons (primary, secondary, danger), badges, count pills, pagination buttons, radio cards, dialog outline, slide-panel edge, tooltip, menus' internal dividers, checkboxes, callouts, media cards, the binary toggle container, the attach button and the dashed upload dropzone.

**Fields and select triggers have no default border [OBSERVED, R-58].** Text inputs, textareas, password and search fields, sunken select, multi-select and rich-picker triggers, and the field with attach button are drawn with `surface-sunken` + `shadow-sunken`. Raised filter and date-range triggers are drawn with `surface-card` + `shadow-trigger`. A visible edge appears on them only as:
- the focus outline (`focus-ring-tight`);
- the error ring (`--ds-error-ring`, 1px `#ef4444` box-shadow);
- boundary mode (§9.3), which adds 1px `border-control-strong` when the user or product asks for more contrast.

### 2.7 Shadows, elevation & focus

| Token | Value | Applies to |
|---|---|---|
| `--ds-shadow-lift` | `0 2px 18px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.40)` | Base lift for all cards |
| `--ds-shadow-highlight` | `inset 0 1px 0 0 rgba(255,255,255,0.07)` | Top inner highlight on raised cards |
| `--ds-shadow-card` | `var(--ds-shadow-lift), var(--ds-shadow-highlight)` | **KPI cards, table cards, section cards, dashboard cards, entity cards, summary strips, active nav item, active raised tab pill, raised tags** |
| `--ds-shadow-shell` | `0 12px 32px -4px rgba(0,0,0,0.70), 0 4px 12px -2px rgba(0,0,0,0.50), inset 0 1px 0 0 rgba(255,255,255,0.05)` | Sidebar and main content panel |
| `--ds-shadow-float` | `0 16px 36px -8px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.40)` | Media cards, prominent data card (with highlight) |
| `--ds-shadow-trigger` | `0 2px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)` | **Raised** select (filter) and date-range triggers: outer drop shadow + 1px top inner highlight. They have no border; this shadow separates them (source token `--shadow-dropdown`) |
| `--ds-shadow-menu` | `0 12px 32px -4px rgba(0,0,0,0.80), 0 4px 12px -2px rgba(0,0,0,0.60)` | Dropdown menus, popovers |
| `--ds-shadow-dialog` | `0 24px 80px rgba(0,0,0,0.80), inset 0 1px 0 0 rgba(255,255,255,0.07)` | Confirm dialog |
| `--ds-shadow-modal` | `0 24px 80px rgba(0,0,0,0.80)` | Large content modal (e.g. media viewer) |
| `--ds-shadow-drawer` | `-8px 0 48px rgba(0,0,0,0.60)` | Slide-in panel (cast to the left) |
| `--ds-shadow-drawer-mirrored` | `8px 0 48px rgba(0,0,0,0.60)` | Drawer cast to the right: the mobile sidebar drawer, and slide panels in RTL (§8.9) |
| `--ds-shadow-elevated` | `0 4px 40px rgba(0,0,0,0.50)` | Toast, active pagination button |
| `--ds-shadow-tooltip` | `0 8px 18px 0 rgba(0,0,0,0.50)` | Rich tooltip |
| `--ds-shadow-button-primary` | `0 2px 12px rgba(59,130,246,0.30)` | Primary button glow |
| `--ds-shadow-sunken` | `inset 0 2px 4px 1px rgba(0,0,0,0.75), 0 1px 0 0 rgba(255,255,255,0.04)` | **Recessed** fields: text, password and search inputs, textareas, sunken select, multi-select and rich-picker triggers, the field with attach button. Inner top shadow + 1px white/4% bottom highlight; no border (R-58) |
| `--ds-shadow-sunken-track` | `inset 0 2px 4px 0 rgba(0,0,0,0.75), 0 1px 0 0 rgba(255,255,255,0.04)` | Segmented tab tracks |
| `--ds-shadow-sunken-button` | `inset 0 2px 4px 0 rgba(0,0,0,0.60), 0 1px 0 0 rgba(255,255,255,0.04)` | Square sunken buttons (panel close) |
| `--ds-shadow-header-scrolled` | `0 8px 16px -6px rgba(0,0,0,0.60)` | Page header, panel header, pinned table header **only while content beneath is scrolled** |
| `--ds-shadow-status-success` | `0 0 10px 0 #10b981, 0 0 2px 0 #34d399` | Success status dot glow |
| `--ds-shadow-status-warning` | `0 0 10px 0 #f59e0b, 0 0 2px 0 #fbbf24` | Warning status dot glow |
| `--ds-shadow-status-error` | `0 0 10px 0 #b91c1c, 0 0 2px 0 #ef4444` | Error status dot glow |

#### Elevation levels

| Level | Name | Surface | Shadow | Examples |
|---|---|---|---|---|
| -2 | Sunken deep | `surface-sunken-deep` | `shadow-sunken-track` | Tab tracks |
| -1 | Sunken | `surface-sunken` | `shadow-sunken` | Inputs |
| 0 | App | `bg-app` | none | Viewport |
| 1 | Shell | `bg-shell` | `shadow-shell` | Sidebar, main panel |
| 2 | Card | `surface-card` | `shadow-card` | Cards, select triggers (`shadow-trigger`) |
| 3 | Float | `surface-overlay` / `surface-card` | `shadow-float` / `shadow-menu` | Media cards, menus, popovers, tooltips |
| 4 | Overlay | `surface-overlay` / `surface-card` | `shadow-drawer` / `shadow-dialog` / `shadow-modal` | Slide panels, dialogs, modals |
| 5 | Notification | `surface-card` | `shadow-elevated` | Toasts |

#### Focus indicators [STANDARDIZED, R-37]

Focus is drawn with the CSS **`outline`** property, **not** `box-shadow`. Outlines follow `border-radius`, never collide with component shadows, and stay visible in Windows High Contrast / forced-colors mode, where box-shadows are removed.

| Style | Spec | Applies to |
|---|---|---|
| `focus-ring` (default) | `outline: 2px solid var(--ds-color-focus-ring); outline-offset: 2px` | Buttons, icon buttons, links, nav items, clickable cards, pagination, collapsible headers, checkboxes, switches, chart bubbles, scrollable table regions |
| `focus-ring-tight` | same, `outline-offset: 0` | Fields (inputs, textareas, select triggers), tabs inside a track, radio cards, sort buttons in table headers, menu search inputs |
| `focus-ring-inset` | same, `outline-offset: -2px` | Elements clipped by an `overflow: hidden` parent or filling a cell edge-to-edge: binary toggle options, menu options (active descendant), table row links that fill the cell |
| `focus-ring-on-color` | `outline: 2px solid #ffffff; outline-offset: -2px` | Elements whose own fill is a data color: heatmap cells, colored segments |

**Contrast:** the ring (`#3b82f6`) measures 4.10–4.81:1 against every surface it can sit on (elevated 4.10, card 4.31, shell 4.51, overlay 4.75, sunken 4.76, app 4.81). This exceeds the 3:1 non-text requirement (WCAG 2.2 SC 1.4.11 / 2.4.7). On colored fills, use `focus-ring-on-color`.

**Rules**

- Show focus with `:focus-visible` (keyboard and programmatic focus). Text inputs match `:focus-visible` on every focus in all modern browsers, so fields always show their ring while focused.
- `outline: none` is allowed **only** (a) in the pair `:focus:not(:focus-visible) { outline: none; }`, or (b) on an input inside a composite field whose wrapper draws the same outline via `:focus-within` (the §5.18 field with attach button). Never remove focus without a replacement.
- Focus must never be obscured by sticky headers or footers (SC 2.4.11). Scroll containers MUST use `scroll-padding-top` equal to any sticky header height.
- Error state (`--ds-error-ring`, a 1px `#ef4444` box-shadow) is a **state**, not focus. A focused field in error shows both the red ring and the blue outline.

### 2.8 Size tokens

| Token | Value | Applies to |
|---|---|---|
| `--ds-size-control` | 40px | **Minimum height** of buttons (md), inputs, select triggers, accent tab bar, menu options, attach button |
| `--ds-size-control-sm` | 28px | Minimum height of small buttons; fixed size of small icon buttons |
| `--ds-size-control-lg` | 48px | Minimum height of large buttons |
| `--ds-size-icon-button` | 36px | Default icon button, back button, close button |
| `--ds-size-pagination-button` | 32px | Pagination buttons, stepper indices |
| `--ds-size-page-header` | 76px | Page header height; slide-panel header (no subheader) height |
| `--ds-size-section-header` | 60px | Collapsible section header height (fixed) |
| `--ds-size-table-row` | 44px | Single-line table body row (12 + 20 + 12) |
| `--ds-size-table-header` | 40px | Table header row (12 + 16 + 12) |
| `--ds-size-heat-row` | 40px | Heatmap body row |
| `--ds-size-kpi-card` | 76px | KPI card **minimum** height (16 + 44 + 16); grows with wrapped labels or values |
| `--ds-size-kpi-icon` | 40px | KPI icon, entity card icon, avatar (lg) |
| `--ds-size-nav-item` | 44px | Sidebar nav item height |
| `--ds-size-nav-icon` | 24px | Sidebar icons, slide-panel title icon, back-arrow glyph |
| `--ds-size-action-icon` | 20px | Row action icons (inside 28px icon button), button leading icons (back arrow) |
| `--ds-size-ui-icon` | 16px | Calendar, expand, menu-action plus, pagination chevrons |
| `--ds-size-ui-icon-sm` | 14px | Primary button plus/arrow icons, sort icon |
| `--ds-size-search-icon` | 18px | Search icon box, chevron box, password eye box |
| `--ds-size-sidebar-collapsed` | 76px | Sidebar rail width |
| `--ds-size-sidebar-expanded` | 256px | Sidebar width on hover/focus (overlays content) |
| `--ds-size-status-dot` | 10px | Status dot (md) |
| `--ds-size-status-dot-sm` | 8px | Status dot (sm), eyebrow dot |
| `--ds-size-badge-dot` | 6px | Dot inside a badge |
| `--ds-size-checkbox` | 16px | Checkbox |
| `--ds-size-avatar-sm` | 32px | Sidebar user avatar |
| `--ds-size-avatar-md` | 36px | Entity card person avatar |
| `--ds-size-avatar-lg` | 40px | Picker row avatar |
| `--ds-size-menu-max-height` | 260px | Dropdown option list max height (then scroll) |
| `--ds-size-picker-max-height` | 280px | Rich picker list max height |
| `--ds-size-dialog` | 440px | Confirm dialog **maximum** width (`min(440px, 100% − 32px)`) |
| `--ds-size-panel-sm` | 480px | Slide panel default **maximum** width (`min(<size>, 100%)` for all panel sizes) |
| `--ds-size-panel-md` | 560px | Slide panel: single-column edit forms |
| `--ds-size-panel-lg` | 680px | Slide panel: mixed single/two-column forms |
| `--ds-size-panel-xl` | 820px | Slide panel: two-column forms, multi-step wizards |
| `--ds-size-popover-date` | 360px | Date-range popover width |
| `--ds-size-tooltip` | 314px | Rich tooltip width (342px when lists are long) |
| `--ds-size-search-sm` | 288px | Header search field (standard) |
| `--ds-size-search-md` | 320px | Header search field (longer placeholder) |
| `--ds-size-search-lg` | 366px | Header search field (longest placeholder) |
| `--ds-size-filter` | 180px | Recommended default width of a header filter select (content-driven; any width that fits the longest option is valid). Also 160px for short options, 200px for long labels |
| `--ds-size-filter-date` | 240px | Header date-range trigger |
| `--ds-size-header-button` | 180px | **Optional minimum** width for primary buttons in headers and panel footers, used to align them. Never a fixed width; the label always fits |

#### Dimension types [STANDARDIZED, R-52]

Every dimension in this document is one of four types. **The type matters more than the number**: it tells you what happens when content, text size or container width changes. At standard content length and default text size, all four render exactly as in the source.

| Type | Meaning | CSS | Examples |
|---|---|---|---|
| **Fixed** | Never changes with content or text size | `width` / `height` | Icons and illustrations; status dots; checkboxes; avatars; icon-only buttons (36/28px); pagination buttons (min 32px, may widen for 3+ digits); borders; radii; focus outline; scrollbar |
| **Minimum** | The default size; grows if content or enlarged text needs more | `min-height` / `min-width` | Controls (`size-control` 40/28/48), table rows (44), table header (40), menu options (40), nav items (44), section headers (60), page header (76), KPI cards (76), the header-button min width (180, optional) |
| **Maximum** | The default width for overlays and text measure; shrinks to fit the viewport | `width: min(<value>, 100%)` or `max-width` | Dialog 440, slide panels 480/560/680/820, date popover 360, rich tooltip 314/342, label tooltip 280, form content column 820 (two-column) / 560 (single), truncation caps (180–240) |
| **Content-driven** | No set size; determined by content and layout | none (flex/grid) | Cards (in responsive grids), button widths, filter widths (160/180/200px are recommended defaults, not limits), table column widths, chart-card heights |

**Rule:** if a spec says "height N" for a container or control, implement `min-height: N`. Only the items listed as **Fixed** above use `height`.

### 2.9 Motion

| Token | Value | Applies to |
|---|---|---|
| `--ds-duration-fast` | 150ms | Color, background, border, opacity transitions on every interactive element (default) |
| `--ds-duration-base` | 200ms | Scrolled-header shadow fade, sidebar label fade |
| `--ds-duration-slow` | 300ms | Sidebar width, bar-chart heights |
| `--ds-duration-chart` | 500ms | Donut segments, progress-bar widths |
| `--ds-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing |
| `--ds-ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | Sidebar expand/collapse |
| Sidebar label delay | 75ms | Labels start fading in 75ms after the expand begins |

**Rules**

- Transition only `color, background-color, border-color, opacity, box-shadow, filter, transform, width/height` (charts). Never transition layout in tables or forms.
- Overlays, panels, menus and dialogs **appear instantly** (no enter/exit animation) **[OBSERVED]**. An optional 150ms opacity fade on backdrops is permitted **[EXTENSION]**. Never slide or scale content.
- Honour `prefers-reduced-motion: reduce` by disabling the sidebar width transition and chart transitions.
- Hover "brightening" of clickable cards uses `filter: brightness(1.1)`. Heatmap cells use `brightness(1.25)`. Chart bubbles use `transform: scale(1.1)`.

### 2.10 Z-index

| Token | Value | Layer |
|---|---|---|
| `--ds-z-header` | 10 | Page header, pinned table header, panel header |
| `--ds-z-tooltip` | 30 | Chart tooltips |
| `--ds-z-sidebar` | 40 | Sidebar slot (expands over content) |
| `--ds-z-menu` | 50 | Dropdown menus, popovers |
| `--ds-z-overlay` | 50 | Modals, dialogs, slide panels. On desktop they are positioned inside the main panel, so they never cover the sidebar. Below 1024px they cover the viewport (§8) |
| `--ds-z-toast` | 60 | Toasts |

### 2.11 Iconography & asset registry

There are two icon families. **Never mix their roles.**

| Family | Role | Layer |
|---|---|---|
| **A. 3D illustrations** | Identity: navigation, headline metrics, record/entity headers, panel titles, event types | L1 style (MUST); individual assets are product content |
| **B. Outline UI icons** | Actions and controls: edit, delete, sort, chevrons, close, search | L1 (MUST) |

#### A. 3D illustration style (extracted from the source assets)

| Attribute | Specification |
|---|---|
| Rendering | Glossy, soft "clay" 3D with smooth bevels, specular highlights from the upper left, and soft ambient occlusion. No outlines. No flat shading |
| Palette | **Dominant navy → royal blue** (≈ `#1e3a8a` → `#2563eb`) on the main object, with **glowing cyan-blue accents** (≈ `#38bdf8`) on lights, windows and screens. Secondary materials: warm cardboard (≈ `#e0a96d`) for goods/packages; skin tones for people (faceless figures); white/light grey for paper and labels |
| Status coin | Many illustrations add a **round glossy "coin" badge** at the lower right (≈ 35–40% of the canvas), with a white glyph. Coin colors carry meaning: green (≈ `#22c55e`) = success/created/approved; red (≈ `#ef4444`) = error/deleted/stopped/alert; blue (≈ `#3b82f6`) = updated/info/neutral; amber (≈ `#f59e0b`) = sign-in/attention |
| Viewpoint | Three-quarter front view, slight elevation (≈ 15–25°), subject centered |
| Background | **Transparent PNG.** No ground plane or scene; a faint contact shadow only |
| Composition | One primary object; at most one secondary object plus one status coin. Subject fills ≈ 80–90% of the canvas width |
| Text | The source contains baked-in text on two assets ("ADMIN", "SHIFT"). **New illustrations MUST NOT contain text** (it can't be translated or read at 24–40 px) |
| Source size | Square or near-square masters of ≥ 512 px. Source assets range from 128 px to 1374 px wide; masters ≥ 1024 px are preferred |

#### B. Asset registry (source illustrations)

Registry format (use the same columns when you add assets):

`semantic name · depicts · intended purpose · asset reference · master size · display sizes · fallback`

- **Asset reference** is the source file name. The files are **not bundled** with this document; obtain them from the source asset pack, or use the fallback.
- **Display sizes** are the rendered box sizes; the image is drawn with `object-fit: contain` inside the box.
- **Sprite sheets** hold several frames side by side. Display one frame by placing the image inside an `overflow: hidden` box at `width: <frames × 100>%`, offset by `left: -<frame × 100>%`. Use separate files for new work.

| Semantic name | Depicts | Intended purpose | Asset reference | Master size | Display sizes | Fallback (outline icon in icon tile) |
|---|---|---|---|---|---|---|
| `illus.surveillance-camera` | Wall-mounted security camera, blue lens, green status LED | Camera / video-source section, media card icon, KPI | `8d574.png` | 1374×1145 | 24 (nav), 32 (panel title), 40 (KPI) | `video` / `cctv` |
| `illus.facility-set` (sprite, 4 frames) | 1 building with chimneys · 2 same + green check coin · 3 stacked server/device units · 4 security camera | Sites/locations (1), active sites (2), devices (3), cameras (4) | `51b9c.png` | 2171×724 | 40 (KPI, entity header), 24 (nav) | `building-2`, `building-check`, `server`, `cctv` |
| `illus.conveyor-line` | Conveyor belt with boxes under a scanner arm | Production line / pipeline / process | `1cd34.png` | 256×257 | 24, 40 | `workflow` |
| `illus.analytics-board` | Dark board with bar chart, trend line and pie wedge | Dashboard / analytics navigation | `d9cb8.png` | 511×465 | 24 | `bar-chart-3` |
| `illus.catalog-item` | Box on conveyor with clipboard spec sheet | Item/product catalog section, create-item panel title | `28768.png` | 247×272 | 24, 32 | `package` |
| `illus.gear` | Silver gear | Devices / integrations / configuration | `e2c03.png` | 128×128 | 24, 40 | `settings` |
| `illus.user-group-admin` | Three faceless people, user-list card, blue gear | User management navigation | `9ceae.png` | 1374×1145 | 24 | `users` |
| `illus.activity-document` | Document with a colored timeline and a history-clock badge | Activity log / audit trail navigation | `6ba35.png` | 215×232 | 24 | `history` |
| `illus.site-admin` | Facility + person in hard hat with "ADMIN" badge + clock and "SHIFT" card | Administrator / owner KPI, user panel title | `2c3cb.png` | 1374×1145 | 40 | `user-cog` |
| `illus.items-total` | Stacked boxes on conveyor + blue cube coin | "Total items" KPI | `b1c01.png` | 1254×1254 | 40 | `boxes` |
| `illus.items-active` | Boxes on conveyor + green check coin | "Active items" KPI | `b1c02.png` | 1254×1254 | 40 | `package-check` |
| `illus.items-inactive` | Boxes on conveyor (one faded) + red pause coin | "Inactive items" KPI | `b1c03.png` | 1254×1254 | 40 | `package-x` |
| `illus.items-analyzed` | Box with magnifier showing a bar chart | "Items analyzed / processed" KPI | `d1c01.png` | 1254×1254 | 40 | `scan-search` |
| `illus.defect-rate` | Damaged box on conveyor + red "%" coin with "!" | "Error / defect rate" KPI | `d1c02.png` | 1254×1254 | 40 | `percent` |
| `illus.event-camera` (sprite, 3 frames: created · deleted · updated) | Camera + green plus / red trash / blue sync coin | Event-row icons in activity lists | `activity-camera.png` | 2172×724 | 32 | `plus` / `trash-2` / `refresh-cw` in a 32 px tile |
| `illus.event-line` (sprite, 3) | Line/process object + same three coins | Event-row icons | `activity-line.png` | 2172×724 | 32 | same as above |
| `illus.event-site` (sprite, 3) | Facility + same three coins | Event-row icons | `activity-factory.png` | 2172×724 | 32 | same |
| `illus.event-item` (sprite, 3) | Item/box + same three coins | Event-row icons | `activity-product.png` | 2172×724 | 32 | same |
| `illus.event-user` (sprite, 3) | User group + green plus / red trash / blue sync coin | Event-row icons | `activity-user.png` | 2172×724 | 32 | same |
| `illus.event-user-created` | Single user + green plus coin | Event: user created | `activity-user-created.png` | 1536×1024 (subject inset ≈ 14% each side) | 32 | `user-plus` |
| `illus.event-user-login` | Single user + amber sign-in coin | Event: sign-in | `activity-user-login.png` | 1536×1024 (subject inset ≈ 11–12%) | 32 | `log-in` |

Not illustrations: the brand logo (provided by each product, shown in a 40 px tile) and user avatars (photos or initials, §5.32).

Fallback icon names refer to the Lucide set as an example; any outline set meeting section E works.

#### C. Rules for introducing new illustrations

1. **Check the registry first.** Reuse an existing illustration whose *depicted object* fits, even if the source used it for a different section.
2. **Do not generate, trace or approximate illustrations in code or with AI image tools as part of implementation.** New illustrations are commissioned design assets. Until one exists, use the **fallback icon tile**; never ship a placeholder that imitates the 3D style.
3. New assets MUST follow every attribute in table A: navy/blue dominant palette, glossy clay rendering, transparent background, no text, one object + optional status coin.
4. **Status coins encode meaning consistently.** Green = positive/created, red = negative/deleted/stopped, blue = updated/neutral, amber = attention/sign-in. Never use a coin color for decoration.
5. **Provide one file per frame** (no new sprite sheets): a transparent PNG or WebP, master ≥ 1024 px, plus a 2× export at the largest display size (80 px for 40 px use).
6. **Register every new asset** in this table, with the same columns, before it is used.
7. **Accessibility:** illustrations are decorative (`alt=""`, `aria-hidden="true"`) when a text label is adjacent, which is always the case in nav items, KPI cards and headers. In the rare case an illustration is the only label (event icons in a dense list), give the wrapper `role="img"` and an `aria-label` ("User created").

#### D. Fallback: icon tile [EXTENSION]

When an illustration is missing, use a 40×40 box (32×32 for event rows, bare 24 px icon in nav):

- radius 12px (8px at 32);
- fill `brand-tint-10`, 1px border `brand-tint-20`;
- a 20px outline icon (16px at 32) stroked in `link` `#60a5fa`.

Status variants use the same structure with the success/warning/error `*-bg` fill, `*-border` border and `*-text` icon color. Do not use emoji or flat colored circles.

#### E. Outline UI icons (actions)

| Use | Box | Glyph | Stroke | Color |
|---|---|---|---|---|
| Row actions (edit, delete, copy) | 20px inside a 28px icon button | 24-grid | 1.5px, round caps/joins | `icon` `#64748b` (3.3:1 on card) → white on hover |
| Navigation back arrow | 24px | 24-grid | 1.5px | `text-primary` |
| Button back arrow (leading) | 20px | 20-grid | 1.5px | `currentColor` |
| Select chevron | 18px box (glyph 7.2 × 3.6) | down chevron | 1.35px round | `icon-chevron` `#6b7280` (3.3:1 card, 3.6:1 sunken) |
| Disclosure chevron (sections) | 32px (24px compact/nested) | down chevron | 2px round | `icon-chevron`; flips vertically when open |
| Sort indicator | 14px | unsorted: up/down pair; sorted: single arrow, rotated 180° for descending | 1.17px | `currentColor` = header text (`text-muted`, 5.9:1) |
| Pagination prev/next | 16px | chevron | 1.33px | `currentColor` |
| Search | 18px box | magnifier | 1.5px | `text-muted` |
| Calendar | 16px in an 18px box | calendar | 1px | `icon-chevron` |
| Close (×) | 10px | cross | 1.5px | `text-muted` |
| Expand / collapse media | 16px / 20px | four corner arrows | 1.33px | `icon` |
| Plus in primary button | 14px | plus | 1.47px round | `currentColor` (white) |
| Plus in tonal button / link action / menu action | 16px (14px in links) | plus | 1.5px | `currentColor` (`link` / `brand-text`) |
| Forward chevron in primary button | 14px | chevron pointing right | 1.35px | `currentColor` |
| "Open / view" action | 20px | box with arrow | 1.5px | `link` `#60a5fa` |
| Upload | 32px | upload tray | 1.5px | `text-muted` |
| Radio on / off | 20px | filled ring / outline ring | 1.5px | on: `brand` `#3b82f6`; off: `text-muted` (6.2:1) |

**Rules**

- Use one outline set: round caps and joins, a 24px grid, 1.5px stroke at 24px. Lucide, Phosphor (regular) and Heroicons Outline are acceptable.
- Icons use `stroke="currentColor"` so they inherit state colors from their control.
- Icons that convey meaning on their own (sort direction, chevron state, status glyphs) MUST reach **3:1** against their background. The colors above are computed to do so on card, sunken and table-header surfaces.
- Icons are decorative (`aria-hidden="true"`); the accessible name is on the control (`aria-label`).
- Icon → text gap is 8px for 14–18px icons, and 12px for 24–40px icons.

### 2.12 Imagery

- Camera/photo media sits on `surface-media` (`#0b0e13`) at **50% opacity**, so overlays and text remain dominant. In grids, use `object-fit: cover`. In expanded views, use `object-fit: contain`.
- Detection / annotation frames: 2px solid `#22c55e` (positive) or `#ef4444` (negative), radius 4px, glow `0 0 20px rgba(34,197,94,0.3)` or `rgba(239,68,68,0.3)`.
- Avatars: a photo inside a 1px gradient ring (`linear-gradient(45deg, #3b82f6, #818cf8)`) with an inner fill of `#121622`, or an initials avatar (see §5.32).


### 2.13 Density modes [EXTENSION]

**Dense is the default and the source of every value in this document.** A **comfortable** mode is available for touch-first products or less data-heavy screens. It is derived mechanically, so it introduces no new values:

1. **Control sizes** (`--ds-size-*` for controls, rows and headers) grow by **+4px**, the system's base unit.
2. **Padding and gap tokens** in the table below move **one step up** the existing spacing scale (12→16, 16→20, 20→24, 24→32).
3. **Type, radii, colors, shadows and icon sizes do not change.**

| Token | Dense (default) | Comfortable |
|---|---|---|
| `--ds-size-control` | 40px | 44px |
| `--ds-size-control-sm` | 28px | 32px |
| `--ds-size-control-lg` | 48px | 52px |
| `--ds-size-icon-button` | 36px | 40px |
| `--ds-size-pagination-button` | 32px | 36px |
| `--ds-size-table-row` | 44px | 52px (`space-cell-y` 12→16) |
| `--ds-size-table-header` | 40px | 48px |
| `--ds-size-section-header` | 60px | 64px |
| `--ds-size-nav-item` | 44px | 48px |
| `--ds-space-cell-y` | 12px | 16px |
| `--ds-space-card` | 16px | 20px |
| `--ds-space-card-lg` | 20px | 24px |
| `--ds-space-card-xl` | 24px | 32px |
| `--ds-space-form-row` | 24px | 32px |
| `--ds-space-grid` | 16px | 20px |
| `--ds-space-grid-lg` | 20px | 24px |

Unchanged in both modes: page gutter, shell padding, section gap, label gap, icon gaps and every font size. KPI card height follows automatically: card padding + 44px of content.

```css
[data-density="comfortable"] {
  --ds-size-control: 44px;  --ds-size-control-sm: 32px;  --ds-size-control-lg: 52px;
  --ds-size-icon-button: 40px;  --ds-size-pagination-button: 36px;
  --ds-size-table-row: 52px;  --ds-size-table-header: 48px;
  --ds-size-section-header: 64px;  --ds-size-nav-item: 48px;
  --ds-space-cell-y: 16px;  --ds-space-card: 20px;  --ds-space-card-lg: 24px;  --ds-space-card-xl: 32px;
  --ds-space-form-row: 32px;  --ds-space-grid: 20px;  --ds-space-grid-lg: 24px;
}
```

**Rules.**

- Set density on `<html>` (a whole product) or on a page region. Never mix densities inside one card.
- Components work in both modes only if their CSS reads these tokens. The §5 code examples do this; any implementation that hard-codes 40px or 12px breaks density.
- Touch targets in the `sm`/`xs` breakpoints are still governed by §8.8, whatever the density.

---

## 3. Complete token file

Copy this verbatim into the global stylesheet of any new product. **Every value in components must come from here.**

**Token naming scheme.** `--ds-<category>-<role>[-<variant>]`, where `<category>` is one of: `color`, `font` (`font-size`, `font-weight`, `font-family`), `line-height`, `tracking`, `space`, `radius`, `border` (widths only; border *colors* are `color-border-*`), `shadow`, `gradient`, `size`, `duration`, `ease`, `z`, `focus`, `chart`, `heat`, `tag`, `overlay`, `error-ring`. Roles are semantic (`surface-card`), never literal (`gray-800`). Components read **only** these tokens. The three component-level knobs `--ds-table-max-height`, `--ds-table-min-width` and `--ds-cell-max` are intentionally undeclared: they are set per instance and have fallbacks in the §5.41 CSS.

```css
:root {
  color-scheme: dark;

  /* ── Font ─────────────────────────────────────────────── */
  --ds-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ds-font-weight-regular: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-semibold: 600;
  --ds-font-weight-bold: 700;

  --ds-font-size-caption: 10px;  --ds-line-height-caption: 14px;
  --ds-font-size-micro: 11px;    --ds-line-height-micro: 14px;    /* charts & tooltip header only */
  --ds-font-size-label: 12px;    --ds-line-height-label: 16px;
  --ds-font-size-body: 14px;     --ds-line-height-body: 20px;
  --ds-font-size-value: 16px;    --ds-line-height-value: 22px;
  --ds-font-size-subheading: 18px; --ds-line-height-subheading: 24px; /* summary-strip title only */
  --ds-font-size-heading: 20px;  --ds-line-height-heading: 28px;
  --ds-font-size-title: 24px;    --ds-line-height-title: 28px;

  --ds-tracking-title: -0.35px;
  --ds-tracking-heading: -0.5px;
  --ds-tracking-card-title: -0.4px;
  --ds-tracking-number: -0.65px;
  --ds-tracking-tight: -0.4px;
  --ds-tracking-upper: 0.55px;
  --ds-tracking-upper-sm: 0.4px;
  --ds-tracking-table-header: 0.3px;
  --ds-tracking-identifier: 0.55px;

  /* ── Color: surfaces ──────────────────────────────────── */
  --ds-color-bg-app: #15191c;
  --ds-color-bg-shell: #1b1f22;
  --ds-color-surface-card: #1d2328;
  --ds-color-surface-card-hover: #232a30;
  --ds-color-surface-card-footer: #171c1f;
  --ds-color-surface-elevated: #21272d;
  --ds-color-surface-elevated-hover: #262d34;
  --ds-color-surface-overlay: #161a20;
  --ds-color-surface-overlay-chrome: #15191c;
  --ds-color-surface-sunken: #161a1e;
  --ds-color-surface-sunken-deep: #111418;
  --ds-color-surface-sunken-alt: #161a20;
  --ds-color-surface-sunken-button: #121620;
  --ds-color-surface-media: #0b0e13;
  --ds-color-surface-table-header: rgba(255,255,255,0.02);
  --ds-color-surface-table-header-pinned: #212629;
  --ds-color-surface-tooltip: #151a1f;
  --ds-color-surface-callout: #111923;
  --ds-color-surface-hover: rgba(255,255,255,0.05);
  --ds-color-surface-hover-subtle: rgba(255,255,255,0.03);
  --ds-color-surface-row-hover: rgba(255,255,255,0.02);
  --ds-color-surface-row-stripe: rgba(255,255,255,0.01);
  --ds-color-surface-selected: rgba(255,255,255,0.05);
  --ds-color-surface-pill: rgba(255,255,255,0.04);
  --ds-color-surface-radio-selected: #202a39;
  --ds-color-surface-avatar: #18202d;
  --ds-color-surface-attach: #171b26;

  /* ── Color: text ──────────────────────────────────────── */
  --ds-color-text-primary: #ffffff;
  --ds-color-text-secondary: #cbd5e1;
  --ds-color-text-muted: #94a3b8;
  --ds-color-text-tertiary: #8695aa;
  --ds-color-text-placeholder: #77879d;
  --ds-color-text-faint: #475569;
  --ds-color-text-on-brand: #ffffff;
  --ds-color-text-on-bright: #0b0f14;
  --ds-color-text-chart-subtle: #9eacba;
  --ds-color-text-chart-strong: #f4f7fa;
  --ds-color-text-tooltip: #f4f6f8;
  --ds-color-text-tooltip-muted: #aeb8c5;
  --ds-color-text-axis: rgba(255,255,255,0.6);
  --ds-color-icon: #64748b;
  --ds-color-icon-chevron: #6b7280;

  /* ── Color: borders ───────────────────────────────────── */
  --ds-color-border-subtle: rgba(255,255,255,0.06);
  --ds-color-border-faint: rgba(255,255,255,0.05);
  --ds-color-border-strong: rgba(255,255,255,0.08);
  --ds-color-border-control: rgba(255,255,255,0.10);
  --ds-color-border-control-hover: rgba(255,255,255,0.20);
  --ds-color-border-control-strong: #6b7280;
  --ds-color-border-on-brand: rgba(255,255,255,0.30);
  --ds-color-border-track: rgba(255,255,255,0.04);
  --ds-color-scrollbar: rgba(255,255,255,0.12);
  --ds-color-scrollbar-hover: rgba(255,255,255,0.20);
  --ds-color-skeleton: rgba(255,255,255,0.06);
  --ds-color-border-divider: #292e33;
  --ds-color-border-input: #262a30;
  --ds-color-border-card-internal: rgba(42,48,53,0.5);
  --ds-color-border-vertical: #2b3136;
  --ds-color-border-radio: #394c5e;
  --ds-color-border-tooltip: #3a434b;
  --ds-color-border-tooltip-divider: rgba(57,67,75,0.4);
  --ds-color-border-callout: #25344b;
  --ds-color-border-media: rgba(255,255,255,0.07);
  --ds-color-border-avatar: #334155;
  --ds-color-border-logo: #333333;

  /* ── Color: brand ─────────────────────────────────────── */
  --ds-color-brand: #3b82f6;
  --ds-color-brand-strong: #2563eb;
  --ds-color-brand-stronger: #1d4ed8;
  --ds-color-brand-text: #93c5fd;
  --ds-color-link: #60a5fa;
  --ds-color-link-hover: #93c5fd;
  --ds-color-brand-tint-10: rgba(59,130,246,0.10);
  --ds-color-brand-tint-20: rgba(59,130,246,0.20);
  --ds-color-brand-tint-30: rgba(59,130,246,0.30);
  --ds-color-brand-border-hover: rgba(59,130,246,0.40);
  --ds-color-brand-avatar-border: rgba(147,197,253,0.30);
  --ds-gradient-brand-ring: linear-gradient(45deg, #3b82f6 0%, #818cf8 100%);
  --ds-gradient-brand-avatar: linear-gradient(45deg, #1d4ed8 0%, #6366f1 100%);
  --ds-gradient-button-secondary: linear-gradient(180deg, #151922 0%, #11141c 100%);
  --ds-gradient-user-card: linear-gradient(180deg, #141824 0%, #10141e 50%, #0c0f16 100%);
  --ds-color-avatar-inner: #121622;
  --ds-color-stepper-track: #1f2636;
  --ds-color-stepper-active-border: rgba(147,197,253,0.40);
  --ds-gradient-stepper-active: linear-gradient(90deg, rgba(59,130,246,0.6), #1f2636);
  --ds-shadow-stepper-active: 0 0 0 2px rgba(59,130,246,0.2), 0 0 20px -2px rgba(37,99,235,0.45), inset 0 1px 1px 1px rgba(255,255,255,0.35);
  --ds-shadow-stepper-idle: inset 0 2px 4px 0 rgba(0,0,0,0.6);
  --ds-color-focus-ring: #3b82f6;
  --ds-color-focus-ring-on-color: #ffffff;

  /* ── Color: status ────────────────────────────────────── */
  --ds-color-success-text: #34d399;
  --ds-color-success-glow: #10b981;
  --ds-color-success-bg: rgba(16,185,129,0.10);
  --ds-color-success-border: rgba(16,185,129,0.20);
  --ds-color-warning-text: #fbbf24;
  --ds-color-warning-glow: #f59e0b;
  --ds-color-warning-bg: rgba(245,158,11,0.10);
  --ds-color-warning-border: rgba(245,158,11,0.20);
  --ds-color-warning-row-tint: rgba(245,158,11,0.02);
  --ds-color-error-text: #f87171;
  --ds-color-error: #ef4444;
  --ds-color-error-glow: #b91c1c;
  --ds-color-error-bg: rgba(239,68,68,0.10);
  --ds-color-error-bg-hover: rgba(239,68,68,0.20);
  --ds-color-error-border: rgba(239,68,68,0.20);
  --ds-color-critical: #ff5825;
  --ds-color-critical-row-tint: rgba(255,88,37,0.02);
  --ds-color-alert-count: #fb7185;
  --ds-color-info-text: #93c5fd;
  --ds-color-info-bg: rgba(59,130,246,0.10);
  --ds-color-info-border: rgba(59,130,246,0.20);
  --ds-color-detect-positive: #22c55e;
  --ds-color-detect-negative: #ef4444;

  /* ── Color: overlays ──────────────────────────────────── */
  --ds-color-overlay-modal: rgba(0,0,0,0.50);
  --ds-color-overlay-panel: rgba(0,0,0,0.40);
  --ds-overlay-blur: 8px;

  /* ── Color: data visualization ────────────────────────── */
  --ds-chart-cat-1: #016ffe;
  --ds-chart-cat-2: #8b34fd;
  --ds-chart-cat-3: #fbb645;
  --ds-chart-cat-4: #00bac9;
  --ds-chart-positive: #10b981;
  --ds-chart-negative: #ff5825;
  --ds-chart-running: #34d399;
  --ds-chart-stopped: #ff5825;
  --ds-chart-trend: #ffffff;
  --ds-chart-track: rgba(255,255,255,0.05);
  --ds-chart-baseline: rgba(255,255,255,0.06);
  --ds-heat-0: #00403a;
  --ds-heat-1: #11603a;
  --ds-heat-2: #597730;
  --ds-heat-3: #ca8a35;
  --ds-heat-4: #ff5825;

  /* ── Color: tags (solid, white text) ──────────────────── */
  --ds-tag-purple: #4d3f9d;
  --ds-tag-blue: #3f779d;
  --ds-tag-green: #457e32;
  --ds-tag-amber: #95693c;
  --ds-tag-rose: #9d3f5a;

  /* ── Spacing ──────────────────────────────────────────── */
  --ds-space-0-5: 2px;
  --ds-space-1: 4px;
  --ds-space-1-5: 6px;
  --ds-space-2: 8px;
  --ds-space-2-5: 10px;
  --ds-space-3: 12px;
  --ds-space-3-5: 14px;
  --ds-space-4: 16px;
  --ds-space-5: 20px;
  --ds-space-6: 24px;
  --ds-space-8: 32px;
  --ds-space-10: 40px;
  --ds-space-12: 48px;
  --ds-space-16: 64px;

  --ds-space-page-gutter: 16px;
  --ds-space-page-top: 4px;
  --ds-space-shell-padding: 16px;
  --ds-space-shell-gap: 20px;
  --ds-space-section: 24px;
  --ds-space-grid: 16px;
  --ds-space-grid-lg: 20px;
  --ds-space-stack: 12px;
  --ds-space-card: 16px;
  --ds-space-card-lg: 20px;
  --ds-space-card-xl: 24px;
  --ds-space-card-gap: 16px;
  --ds-space-chart-gap: 20px;
  --ds-space-header-actions: 12px;
  --ds-space-form-label: 6px;
  --ds-space-form-col: 20px;
  --ds-space-form-row: 24px;
  --ds-space-form-section: 40px;
  --ds-space-icon-text: 8px;
  --ds-space-icon-text-lg: 12px;
  --ds-space-cell-x: 16px;
  --ds-space-cell-y: 12px;

  /* ── Radii ────────────────────────────────────────────── */
  --ds-radius-xs: 4px;
  --ds-radius-chip: 6px;
  --ds-radius-sm: 8px;
  --ds-radius-control: 10px;
  --ds-radius-track: 12px;
  --ds-radius-nested: 16px;
  --ds-radius-card: 20px;
  --ds-radius-full: 9999px;

  /* ── Shadows ──────────────────────────────────────────── */
  --ds-shadow-lift: 0 2px 18px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.40);
  --ds-shadow-highlight: inset 0 1px 0 0 rgba(255,255,255,0.07);
  --ds-shadow-card: var(--ds-shadow-lift), var(--ds-shadow-highlight);
  --ds-shadow-shell: 0 12px 32px -4px rgba(0,0,0,0.70), 0 4px 12px -2px rgba(0,0,0,0.50), inset 0 1px 0 0 rgba(255,255,255,0.05);
  --ds-shadow-float: 0 16px 36px -8px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.40);
  --ds-shadow-trigger: 0 2px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
  --ds-shadow-menu: 0 12px 32px -4px rgba(0,0,0,0.80), 0 4px 12px -2px rgba(0,0,0,0.60);
  --ds-shadow-dialog: 0 24px 80px rgba(0,0,0,0.80), inset 0 1px 0 0 rgba(255,255,255,0.07);
  --ds-shadow-modal: 0 24px 80px rgba(0,0,0,0.80);
  --ds-shadow-drawer: -8px 0 48px rgba(0,0,0,0.60);
  --ds-shadow-drawer-mirrored: 8px 0 48px rgba(0,0,0,0.60);
  --ds-shadow-elevated: 0 4px 40px rgba(0,0,0,0.50);
  --ds-shadow-tooltip: 0 8px 18px 0 rgba(0,0,0,0.50);
  --ds-shadow-button-primary: 0 2px 12px rgba(59,130,246,0.30);
  --ds-shadow-sunken: inset 0 2px 4px 1px rgba(0,0,0,0.75), 0 1px 0 0 rgba(255,255,255,0.04);
  --ds-shadow-sunken-track: inset 0 2px 4px 0 rgba(0,0,0,0.75), 0 1px 0 0 rgba(255,255,255,0.04);
  --ds-shadow-sunken-button: inset 0 2px 4px 0 rgba(0,0,0,0.60), 0 1px 0 0 rgba(255,255,255,0.04);
  --ds-shadow-header-scrolled: 0 8px 16px -6px rgba(0,0,0,0.60);
  --ds-shadow-status-success: 0 0 10px 0 #10b981, 0 0 2px 0 #34d399;
  --ds-shadow-status-warning: 0 0 10px 0 #f59e0b, 0 0 2px 0 #fbbf24;
  --ds-shadow-status-error: 0 0 10px 0 #b91c1c, 0 0 2px 0 #ef4444;

  /* Focus (rendered with outline, §2.7) */
  --ds-focus-width: 2px;
  --ds-focus-offset: 2px;
  --ds-focus-offset-tight: 0px;
  --ds-focus-offset-inset: -2px;
  --ds-error-ring: 0 0 0 1px var(--ds-color-error);

  /* ── Sizes ────────────────────────────────────────────── */
  --ds-size-control: 40px;
  --ds-size-control-sm: 28px;
  --ds-size-control-lg: 48px;
  --ds-size-icon-button: 36px;
  --ds-size-pagination-button: 32px;
  --ds-size-page-header: 76px;
  --ds-size-section-header: 60px;
  --ds-size-table-row: 44px;
  --ds-size-table-header: 40px;
  --ds-size-kpi-card: 76px;
  --ds-size-kpi-icon: 40px;
  --ds-size-heat-row: 40px;
  --ds-size-avatar-sm: 32px;
  --ds-size-avatar-md: 36px;
  --ds-size-avatar-lg: 40px;
  --ds-border-width: 1px;
  --ds-border-width-emphasis: 2px;
  --ds-size-nav-item: 44px;
  --ds-size-nav-icon: 24px;
  --ds-size-action-icon: 20px;
  --ds-size-ui-icon: 16px;
  --ds-size-ui-icon-sm: 14px;
  --ds-size-search-icon: 18px;
  --ds-size-sidebar-collapsed: 76px;
  --ds-size-sidebar-expanded: 256px;
  --ds-size-status-dot: 10px;
  --ds-size-status-dot-sm: 8px;
  --ds-size-badge-dot: 6px;
  --ds-size-checkbox: 16px;
  --ds-size-menu-max-height: 260px;
  --ds-size-picker-max-height: 280px;
  --ds-size-dialog: 440px;
  --ds-size-panel-sm: 480px;
  --ds-size-panel-md: 560px;
  --ds-size-panel-lg: 680px;
  --ds-size-panel-xl: 820px;
  --ds-size-popover-date: 360px;
  --ds-size-tooltip: 314px;
  --ds-size-filter: 180px;
  --ds-size-filter-sm: 160px;
  --ds-size-filter-lg: 200px;
  --ds-size-filter-date: 240px;
  --ds-size-search-sm: 288px;
  --ds-size-search-md: 320px;
  --ds-size-search-lg: 366px;
  --ds-size-header-button: 180px;

  /* ── Motion ───────────────────────────────────────────── */
  --ds-duration-fast: 150ms;
  --ds-duration-base: 200ms;
  --ds-duration-slow: 300ms;
  --ds-duration-chart: 500ms;
  --ds-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ds-ease-emphasized: cubic-bezier(0.22, 1, 0.36, 1);

  /* ── Z-index ──────────────────────────────────────────── */
  --ds-z-header: 10;
  --ds-z-tooltip: 30;
  --ds-z-sidebar: 40;
  --ds-z-menu: 50;
  --ds-z-overlay: 50;
  --ds-z-toast: 60;
}
```

---

## 4. Base / global CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

/* Subtle scrollbars everywhere: thin, faint thumb, no track */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--ds-color-scrollbar) transparent;
}
@supports not (scrollbar-color: auto) {
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--ds-color-scrollbar); border-radius: var(--ds-radius-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--ds-color-scrollbar-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
}

html, body { height: 100%; }
body {
  margin: 0;
  padding: 0;
  font-family: var(--ds-font-family);
  font-size: var(--ds-font-size-body);
  line-height: var(--ds-line-height-body);
  color: var(--ds-color-text-secondary);
  background: var(--ds-color-bg-app);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, p, dl, dd, ol, ul { margin: 0; }
ul, ol { padding: 0; list-style: none; }
button, input, select, textarea { font: inherit; color: inherit; }
button { background: none; border: 0; padding: 0; cursor: pointer; }
img, svg { display: block; }

/* Focus: one reliable indicator everywhere (§2.7). Outlines survive forced-colors mode. */
:focus-visible { outline: var(--ds-focus-width) solid var(--ds-color-focus-ring); outline-offset: var(--ds-focus-offset); }
:focus:not(:focus-visible) { outline: none; }  /* the ONLY permitted outline removal */
input:focus-visible, textarea:focus-visible, select:focus-visible { outline-offset: var(--ds-focus-offset-tight); }

/* Direction-aware icons (§8.9): arrows and left/right chevrons flip in RTL */
.ds-icon--dir:dir(rtl) { transform: scaleX(-1); }

/* Increased-contrast boundary mode (§9.3): automatic, or forced with data-contrast="more".
   By default, fields and triggers are borderless (depth only, R-58); this adds a 3:1 edge to them and to the other
   depth-only controls. It is the ONLY rule in this file that draws a border on a default field or trigger. */
@media (prefers-contrast: more) {
  :is(.ds-input, .ds-select__trigger, .ds-attach__field, .ds-toggle, .ds-tabs, .ds-tab[aria-selected="true"], .ds-radio-card, .ds-nav__item[aria-current="page"], .ds-btn--secondary, .ds-btn--ghost) {
    border: 1px solid var(--ds-color-border-control-strong);
  }
}
[data-contrast="more"] :is(.ds-input, .ds-select__trigger, .ds-attach__field, .ds-toggle, .ds-tabs, .ds-tab[aria-selected="true"], .ds-radio-card, .ds-nav__item[aria-current="page"], .ds-btn--secondary, .ds-btn--ghost) {
  border: 1px solid var(--ds-color-border-control-strong);
}

/* Forced colors (Windows High Contrast): keep status dots visible */
@media (forced-colors: active) {
  .ds-dot, .ds-badge__dot { forced-color-adjust: none; }
}

/* Screen-reader-only utility */
.ds-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* Browser autofill would paint inputs light; repaint in the sunken color */
input:-webkit-autofill,
input:-webkit-autofill:hover {
  -webkit-text-fill-color: var(--ds-color-text-primary);
  caret-color: var(--ds-color-text-primary);
  box-shadow: inset 0 2px 4px 1px rgba(0,0,0,0.75), inset 0 0 0 1000px var(--ds-color-surface-sunken);
  transition: background-color 99999s ease-out;
}
input:-webkit-autofill:focus {
  box-shadow: inset 0 2px 4px 1px rgba(0,0,0,0.75), inset 0 0 0 1000px var(--ds-color-surface-sunken);
}

/* Native date inputs & popovers must render with dark chrome */
input[type="date"], .ds-popover { color-scheme: dark; }

/* Remove number/search native decorations */
input[type="search"]::-webkit-search-cancel-button { -webkit-appearance: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}

/* Text-style helpers (use these instead of ad-hoc font declarations) */
.ds-text-page-title   { font-size: 24px; font-weight: 600; line-height: 28px; letter-spacing: -0.35px; color: var(--ds-color-text-primary); }
.ds-text-dialog-title { font-size: 20px; font-weight: 700; line-height: 28px; letter-spacing: -0.5px;  color: var(--ds-color-text-primary); }
.ds-text-card-title   { font-size: 20px; font-weight: 600; line-height: 24px; letter-spacing: -0.4px;  color: var(--ds-color-text-primary); }
.ds-text-group-title  { font-size: 20px; font-weight: 700; line-height: 24px; letter-spacing: -0.5px;  color: var(--ds-color-text-primary); }
.ds-text-subgroup-title { font-size: 16px; font-weight: 700; line-height: 22px; letter-spacing: -0.5px; color: var(--ds-color-text-primary); }
.ds-text-kpi-value    { font-size: 20px; font-weight: 700; line-height: 28px; letter-spacing: -0.65px; color: var(--ds-color-text-primary); }
.ds-text-kpi-label    { font-size: 12px; font-weight: 700; line-height: 16px; letter-spacing: 0.55px;  color: var(--ds-color-text-muted); text-transform: uppercase; }
.ds-text-metric-value { font-size: 16px; font-weight: 700; line-height: 24px; letter-spacing: -0.65px; color: var(--ds-color-text-primary); }
.ds-text-metric-label { font-size: 12px; font-weight: 500; line-height: 18px; letter-spacing: 0.4px;   color: var(--ds-color-text-muted); text-transform: uppercase; }
.ds-text-body         { font-size: 14px; font-weight: 400; line-height: 20px; color: var(--ds-color-text-secondary); }
.ds-text-body-muted   { font-size: 14px; font-weight: 400; line-height: 20px; color: var(--ds-color-text-muted); }
.ds-text-body-strong  { font-size: 14px; font-weight: 500; line-height: 20px; color: var(--ds-color-text-primary); }
.ds-text-small        { font-size: 12px; font-weight: 400; line-height: 16px; color: var(--ds-color-text-muted); }
.ds-text-caption      { font-size: 10px; font-weight: 400; line-height: 14px; color: var(--ds-color-text-tertiary); }
.ds-text-validation   { font-size: 12px; font-weight: 400; line-height: 16px; color: var(--ds-color-error-text); }
.ds-truncate          { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.ds-clamp-2           { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
```

---

## 5. Component specifications

**Layer L2.** When you use a component, its visuals, states and accessibility behavior MUST match this section. *Whether* to use it, and with what content, is up to the product (§6, §10).

Each component lists: **Purpose · Anatomy · Visual spec · Variants · States · Behavior · Composition · Blueprint**. Blueprints are framework-neutral HTML + CSS, use only §3 tokens, and **never contradict their spec table**; if you find a mismatch, the table wins (report it). Code examples rely on the base CSS in §4, including the global focus outline, so they don't repeat focus rules unless the component needs a different offset.

**Canonical-only rule.** Every value below is canonical. Historical alternatives exist only in §11.

### Universal state matrix

Apply this unless a component states otherwise.

| State | Visual treatment | Accessibility requirement |
|---|---|---|
| Default | As specified | — |
| Hover | Color/background/border change only, 150ms `--ds-ease-standard`. Never move or resize | Hover MUST NOT be the only way to reveal content or actions; the same content must be reachable by focus |
| Active (pressed) | Same as hover. No scale or press effect | — |
| Focus-visible | The §2.7 focus outline (`focus-ring`, or `-tight` / `-inset` / `-on-color` where specified) | Always visible, never obscured, ≥ 3:1 |
| Selected / current | Text becomes `text-primary`, plus the component's selected fill **and** a non-color cue where listed (inset ring, check glyph, weight) | Expose with `aria-selected`, `aria-checked`, `aria-current` or `aria-pressed` |
| Disabled | `opacity: 0.4`; the label remains visible; `cursor: not-allowed` | See the disabled rules below |
| Loading | A 16px spinner replaces the leading icon; the control is busy | `aria-busy="true"` on the control or region; announce the result via a status message |
| Error | The `--ds-error-ring` (1px `--ds-color-error` box-shadow, combined with the component's own shadow) **plus** a validation message. Components that already have a border (dropzone, radio card) recolor it instead | `aria-invalid="true"` + `aria-describedby` pointing at the message; color is never the only cue |
| Read-only | Same visuals as default; no focus ring change | `readonly`; it stays in the tab order only if the value is meaningful to copy |

**Disabled components must stay understandable [STANDARDIZED, R-41]**

1. Keep disabled controls **visible and labelled**; never hide an action just because it's unavailable, unless the user can never use it.
2. Prefer **`aria-disabled="true"`** (focusable, click handler ignores the activation) over the `disabled` attribute when the user needs to learn *why*. Then attach the reason with `aria-describedby`, shown as helper text next to the control or in a tooltip on focus.
3. **Submit buttons [PRODUCT DECISION]:** the source keeps Save disabled until all required fields are filled. If you keep that behavior, a visible hint MUST explain it, e.g. footer text "Complete all required fields to save." in `small` style, `text-muted`, placed left of the button and linked via `aria-describedby`. The accessible alternative (and the recommended default for new products) is to keep Save enabled and show the validation messages on submit.
4. Disabled text is exempt from contrast requirements (WCAG 1.4.3), but the 0.4 opacity applies only to the control, never to surrounding explanatory text.

---

### 5.1 Button

**Purpose.** Triggers an action. One **primary** button per view region (page header, panel footer, dialog).

**Anatomy.** `[leading icon?] label [trailing icon?]`, centered, inside a 10px-radius box.

**Visual spec (md, default)**

| Property | Value |
|---|---|
| Height | **minimum** 40px (`size-control`), border included; grows if the label wraps or text is enlarged |
| Padding | 0 16px (sm: 0 12px; lg: 0 20px) |
| Width | content-driven (label + padding). Optional `min-width: var(--ds-size-header-button)` (180px) to align header and footer primaries; never a fixed width |
| Radius | 10px |
| Gap icon→label | 8px |
| Typography | `button-md` (14/20, 600). sm: `button-sm`. lg: `button-lg` |
| Icons | leading 14px (plus) or 20px (back arrow); trailing 14px chevron pointing right |
| Display | `inline-flex; align-items: center; justify-content: center; white-space: normal; text-align: center`. Keep labels short; if space runs out, the label wraps and the button grows (never clipped) |

**Variants**

| Variant | Background | Border | Text | Shadow | Hover | Use for |
|---|---|---|---|---|---|---|
| `primary` | `brand-strong` #2563eb | 1px `brand` #3b82f6 | white | `shadow-button-primary` | bg `brand-stronger` #1d4ed8 | The main action: Add, Save, Create, Apply, Next |
| `secondary` | `--ds-gradient-button-secondary` (180°, #151922 → #11141c) | 1px `border-control` white/10% | `text-secondary` | none | border `border-control-hover` white/20% | Cancel / Back in footers and dialogs; neutral actions |
| `tonal` | `brand-tint-20` | none (1px transparent) | `brand-text` #93c5fd (6.78:1; 5.80:1 on hover) | none | bg `brand-tint-30` | Secondary *constructive* actions inside cards (e.g. "+ Add item" in a group header) |
| `ghost` | transparent | none (1px transparent) | `text-muted` | none | bg `surface-hover`, text `text-primary` | Low-emphasis actions: Clear, inline Cancel |
| `danger` | `error-bg` | 1px `error-border` | `error-text` | none | bg `error-bg-hover` | Confirming destructive actions (only inside confirmation dialogs) |

**Sizes**

| Size | Min height | Horizontal padding | Type |
|---|---|---|---|
| sm | 28px | 12px | 12/16 600 |
| md | 40px | 16px | 14/20 600 |
| lg | 48px | 20px | 16/22 600 |

**States.** Focus-visible: `focus-ring` (2px outline, 2px offset). Disabled: opacity 0.4, following the §5 disabled rules (prefer `aria-disabled` plus a visible reason). Loading: a 16px spinner (3px stroke, `currentColor`, 1s linear spin) replaces the leading icon, the trailing icon hides, and the button is disabled.

**Behavior.** Use `<button type="button">` unless it submits a form. Never a link styled as a button for in-app actions. Labels are verb-first title case ("Add User", "Save Changes", "Delete Line").

**Composition.** Footer pattern: secondary "Back"/"Cancel" on the left, primary on the right (`justify-content: space-between`). Dialog pattern: both right-aligned, gap 12px, Cancel first. Header pattern: the primary button is the right-most item.

```html
<button class="ds-btn ds-btn--primary">
  <svg class="ds-btn__icon" width="14" height="14" aria-hidden="true"><!-- plus --></svg>
  Add Item
</button>
```

```css
.ds-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--ds-space-2);
  min-height: var(--ds-size-control); padding: 0 var(--ds-space-4);
  border: 1px solid transparent; border-radius: var(--ds-radius-control);
  font-size: var(--ds-font-size-body); line-height: var(--ds-line-height-body); font-weight: 600;
  white-space: normal; text-align: center; cursor: pointer;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-standard),
              border-color var(--ds-duration-fast) var(--ds-ease-standard),
              color var(--ds-duration-fast) var(--ds-ease-standard);
}
.ds-btn:disabled { opacity: 0.4; pointer-events: none; }
.ds-btn[aria-disabled="true"] { opacity: 0.4; cursor: not-allowed; }  /* stays focusable; the click handler ignores it */
.ds-btn--sm { min-height: var(--ds-size-control-sm); padding: 0 var(--ds-space-3); font-size: 12px; line-height: 16px; }
.ds-btn--lg { min-height: var(--ds-size-control-lg); padding: 0 var(--ds-space-5); font-size: 16px; line-height: 22px; }

.ds-btn--primary   { background: var(--ds-color-brand-strong); border-color: var(--ds-color-brand); color: var(--ds-color-text-on-brand); box-shadow: var(--ds-shadow-button-primary); }
.ds-btn--primary:hover { background: var(--ds-color-brand-stronger); }
.ds-btn--secondary { background: var(--ds-gradient-button-secondary); border-color: var(--ds-color-border-control); color: var(--ds-color-text-secondary); }
.ds-btn--secondary:hover { border-color: var(--ds-color-border-control-hover); }
.ds-btn--tonal     { background: var(--ds-color-brand-tint-20); color: var(--ds-color-brand-text); }
.ds-btn--tonal:hover { background: var(--ds-color-brand-tint-30); }
.ds-btn--ghost     { background: transparent; color: var(--ds-color-text-muted); }
.ds-btn--ghost:hover { background: var(--ds-color-surface-hover); color: var(--ds-color-text-primary); }
.ds-btn--danger    { background: var(--ds-color-error-bg); border-color: var(--ds-color-error-border); color: var(--ds-color-error-text); }
.ds-btn--danger:hover { background: var(--ds-color-error-bg-hover); }

.ds-spinner { width: 16px; height: 16px; animation: ds-spin 1s linear infinite; }
@keyframes ds-spin { to { transform: rotate(360deg); } }
```

Spinner markup: `<svg class="ds-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>`

---

### 5.2 Icon button

**Purpose.** An icon-only action: row actions, back, close, expand.

| Property | sm (row actions) | md (default) |
|---|---|---|
| Size | `size-control-sm` (28 × 28px) | `size-icon-button` (36 × 36px) |
| Radius | 8px | 8px |
| Icon | 20px | 20–24px |
| Background | transparent | transparent |
| Color | `--ds-color-icon` #64748b (icons use `currentColor`) → hover `text-primary` | same |
| Hover | bg `surface-hover` | same |
| Focus | `focus-ring` | same |
| Disabled | opacity 0.4 | same |

**Sunken close variant** (slide-panel close): 36 × 36px, radius 8px, bg `surface-sunken-button` #121620, 1px `border-subtle`, shadow `shadow-sunken-button`, 10px × glyph. Hover: border `border-control-hover`.

**Behavior.** Always set `aria-label` ("Edit Jane Cooper", "Delete row 4": verb plus object), and show the same text in a §5.49 tooltip on hover **and** focus.

**Composition.** Row actions sit right-aligned in the last table column, gap 12px, in this order: secondary actions (copy, open) → Edit → Delete. "Open/view" actions that navigate may use the brand-blue icon `#2563eb`.

```html
<button class="ds-icon-btn ds-icon-btn--sm" aria-label="Edit Jane Cooper">
  <svg width="20" height="20" aria-hidden="true"><!-- edit --></svg>
</button>
<button class="ds-icon-btn ds-icon-btn--close" aria-label="Close panel">
  <svg width="10" height="10" aria-hidden="true"><!-- × --></svg>
</button>
```

```css
.ds-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: var(--ds-size-icon-button); height: var(--ds-size-icon-button);
  border-radius: var(--ds-radius-sm); color: var(--ds-color-icon); background: transparent;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard);
}
.ds-icon-btn--sm { width: var(--ds-size-control-sm); height: var(--ds-size-control-sm); }
.ds-icon-btn:hover { background: var(--ds-color-surface-hover); color: var(--ds-color-text-primary); }
.ds-icon-btn:disabled { opacity: 0.4; pointer-events: none; }
.ds-icon-btn--close {
  background: var(--ds-color-surface-sunken-button); border: 1px solid var(--ds-color-border-subtle);
  box-shadow: var(--ds-shadow-sunken-button); color: var(--ds-color-text-muted);
}
.ds-icon-btn--close:hover { background: var(--ds-color-surface-sunken-button); border-color: var(--ds-color-border-control-hover); }
```

---

### 5.3 Link action

**Purpose.** A low-weight inline action inside a form or card ("+ Add New User").

**Spec.** `inline-flex`, gap 8px, 14px plus icon (`currentColor`), `link-action` text style (14/20 600 `link` #60a5fa, 6.24:1). Hover: `link-hover` #93c5fd. Focus: `focus-ring` with radius 4px. No underline. Align with `align-self: flex-start`.

```html
<button type="button" class="ds-link-action"><svg width="14" height="14" aria-hidden="true"></svg>Add New User</button>
```
```css
.ds-link-action { display: inline-flex; align-items: center; gap: var(--ds-space-2); align-self: flex-start;
  font-size: 14px; line-height: 20px; font-weight: 600; color: var(--ds-color-link); border-radius: var(--ds-radius-xs);
  transition: color var(--ds-duration-fast) var(--ds-ease-standard); }
.ds-link-action:hover { color: var(--ds-color-link-hover); }
```

---

### 5.4 Action group

**Purpose.** A horizontal set of related controls.

| Context | Gap | Alignment | Order |
|---|---|---|---|
| Page header actions | 12px | right, vertically centered | search → filters (selects, date) → primary button |
| Card header actions | 16px | right | filter select → segmented tabs |
| Dialog actions | 12px | right | Cancel (secondary) → Confirm |
| Panel footer | `space-between` | — | Back/Cancel (secondary) left; primary right (optional min-width 180px) |
| Row actions | 12px | right | copy/open → edit → delete |
| Popover footer | `space-between` | — | Clear (ghost sm) left; Apply (primary sm) right |

**Split button [EXTENSION].** A primary button (radius 10px 0 0 10px) joined to a 40×40 primary chevron button (radius 0 10px 10px 0, 14px white chevron), separated by a 1px `rgba(255,255,255,0.2)` divider. The menu follows §5.10.

---

### 5.5 Text input

**Purpose.** Single-line text entry. It is a **sunken** surface.

**Anatomy.** `<input>` inside a sunken box. Optional suffix unit (inside the right edge) or trailing icon button.

| Property | Value |
|---|---|
| Height | **minimum** `size-control` (40px); padding 0 16px; the 20px line box is vertically centered |
| Width | 100% of its container |
| Background | `surface-sunken` #161a1e |
| Border | **none** [OBSERVED]. The recessed look comes from the fill and the inset shadow only. Fill vs surroundings is 1.00–1.16:1, below the 3:1 non-text threshold: documented exception A-1 (§9.8). Boundary mode (§9.3) adds 1px `border-control-strong` |
| Radius | 10px |
| Shadow | `shadow-sunken`: `inset 0 2px 4px 1px` black/75% top shadow + `0 1px 0` white/4% bottom highlight |
| Text | `input-text` 14/20 400 white |
| Placeholder | `placeholder` 14/20 `text-placeholder` #77879d (4.78:1) |
| Suffix | 12px `text-muted`, absolutely positioned 16px from the right edge, vertically centered; input right padding becomes 48px |
| Trailing icon button | 18px box, 12px from the right; input right padding becomes 44px |

**States**

| State | Treatment |
|---|---|
| Hover | no change |
| Focus | `focus-ring-tight` outline (text fields match `:focus-visible` on every focus) |
| Error | `--ds-error-ring` (1px `#ef4444`: 4.65:1 against the fill, 4.22:1 against the card) combined with `shadow-sunken`, plus the validation message; also when focused (the blue focus outline is drawn outside it) |
| Disabled | opacity 0.4 |
| Read-only | same visuals, `tabindex="-1"` when the value is only shown for context |
| Autofill | repainted in the sunken color (see §4) |

**Password variant.** A trailing show/hide toggle (18px eye icon, opacity 0.7 → 1 on hover or when pressed) with `aria-pressed` and an `aria-label` of "Show password" / "Hide password".

```html
<div class="ds-input-wrap">
  <input class="ds-input ds-input--suffix" id="f-len" inputmode="numeric" placeholder="E.g. 500">
  <span class="ds-input__suffix" aria-hidden="true">ms</span>
</div>
```
```css
.ds-input {
  width: 100%; min-height: var(--ds-size-control); padding: 0 var(--ds-space-4);
  border: 0; border-radius: var(--ds-radius-control);
  background: var(--ds-color-surface-sunken); box-shadow: var(--ds-shadow-sunken);
  font-size: 14px; line-height: 20px; color: var(--ds-color-text-primary);
  transition: box-shadow var(--ds-duration-fast) var(--ds-ease-standard);
}
.ds-input::placeholder { color: var(--ds-color-text-placeholder); opacity: 1; }
.ds-input:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
.ds-input[aria-invalid="true"], .ds-input[aria-invalid="true"]:focus { box-shadow: var(--ds-error-ring), var(--ds-shadow-sunken); }
.ds-input:disabled { opacity: 0.4; }
.ds-input-wrap { position: relative; }
.ds-input--suffix { padding-inline-end: var(--ds-space-12); }
.ds-input__suffix { position: absolute; inset-inline-end: 16px; top: 50%; transform: translateY(-50%); pointer-events: none;
  font-size: 12px; line-height: 16px; color: var(--ds-color-text-muted); }
.ds-input--trailing { padding-inline-end: 44px; }
.ds-input__trailing { position: absolute; inset-inline-end: 12px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: var(--ds-radius-xs);
  opacity: 0.7; } 
.ds-input__trailing:hover, .ds-input__trailing[aria-pressed="true"] { opacity: 1; }
```

---

### 5.6 Search input

Same as the text input, plus an 18px search icon positioned 14px from the left (input left padding 40px, right padding 16px). Use `type="search"` and an `aria-label` when there is no visible label.

**Widths in a page header (defaults, not fixed):** 288px (standard), 320px, or 366px, applied as `width: min(<w>, 100%)` so the field shrinks in narrow headers (§8.3). Choose the narrowest that shows the full placeholder in the longest supported language.

**Placeholder copy:** "Search by name, email or role" (state the searchable fields).

**Inside a menu:** the search box sits in an 8px-padded band with a 1px `border-subtle` bottom border. It autofocuses when the menu opens and shows the normal `focus-ring-tight` outline (R-37).

```html
<div class="ds-search">
  <svg class="ds-search__icon" width="18" height="18" aria-hidden="true"></svg>
  <input class="ds-input ds-search__input" type="search" placeholder="Search by name, email or role" aria-label="Search people">
</div>
```
```css
.ds-search { position: relative; }
.ds-search__icon { position: absolute; inset-inline-start: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--ds-color-text-muted); }
.ds-search__input { padding-inline-start: var(--ds-space-10); padding-inline-end: var(--ds-space-4); }
```

---

### 5.7 Textarea

Same tokens as the text input: radius 10px, sunken, but `height: auto`, padding 10px 16px, min-height 80px (3 rows) **[EXTENSION]**, `resize: vertical` (resizing helps users who enlarge text). The focus and error rules are identical.

```css
.ds-textarea { height: auto; min-height: 80px; padding: var(--ds-space-2-5) var(--ds-space-4); resize: vertical; }
```

---

### 5.8 Form field (label + control + message)

**Anatomy.** `label` → (6px gap) → control → (8px total: 6px gap + 2px offset) → validation message.

| Element | Spec |
|---|---|
| Container | `display: flex; flex-direction: column; gap: 6px; min-width: 0` |
| Label | `form-label` 12/16 500 `text-muted`; uses `<label for>` |
| Required marker | `*` in `error-text`, 2px left margin, `aria-hidden="true"`; the control also gets `required` / `aria-required="true"` |
| Helper text **[EXTENSION]** | `small` 12/16 `text-muted`, below the control, same 8px offset |
| Validation message | `validation` 12/16 `error-text`, `role="alert"`, 2px top margin; replaces any helper text |

**Validation behavior.**

- Keep the primary/Save button **enabled** (R-41). On submit, show every required-field and format error and move focus to the first invalid field. A product that keeps the source behavior (Save disabled until required fields are filled) MUST show the visible hint from the §5 disabled rules.
- Format and duplicate errors appear **after the first submit attempt**. After that, they update live as the user types.
- Never validate on blur before the first submit.
- Message copy is a full sentence with a period, stating the fix: "Enter a valid email address."

```html
<div class="ds-field">
  <label class="ds-field__label" for="email">Email<span class="ds-field__req" aria-hidden="true">*</span></label>
  <input class="ds-input" id="email" type="email" required aria-invalid="true" aria-describedby="email-err">
  <p class="ds-field__error" id="email-err" role="alert">Enter a valid email address.</p>
</div>
```
```css
.ds-field { display: flex; flex-direction: column; gap: var(--ds-space-form-label); min-width: 0; }
.ds-field__label { font-size: 12px; line-height: 16px; font-weight: 500; color: var(--ds-color-text-muted); }
.ds-field__req { color: var(--ds-color-error-text); margin-inline-start: 2px; }
.ds-field__help { font-size: 12px; line-height: 16px; color: var(--ds-color-text-muted); margin-top: 2px; }
.ds-field__error { font-size: 12px; line-height: 16px; color: var(--ds-color-error-text); margin-top: 2px; }
```

---

### 5.9 Select (single choice)

There are **two trigger styles**, chosen by **context**, never by preference (R-03):

| Context | Trigger style | Why |
|---|---|---|
| **Filter / toolbar** (page header, card header) | **Raised**: `surface-card` + `shadow-trigger`, text `text-secondary` | Filters are view controls that sit among buttons; they read as controls, not as data fields |
| **Form field** (inside a form, dialog or panel) | **Sunken**: identical to the text input (`surface-sunken` + `shadow-sunken`), value text `text-primary` | Every editable field in a form looks like a field. A mixed column of raised and sunken fields reads as two different kinds of thing |

**Shared anatomy.** `button[role="combobox"][aria-haspopup="listbox"]` (the combobox role is what makes `aria-activedescendant` valid on the trigger; §5.55) → `[status dot?] value-or-placeholder (truncated)` + chevron (18px box, `#6b7280`, rotates 180° when open).

| Property | Raised (filter) | Sunken (form) |
|---|---|---|
| Height | min 40px | min 40px |
| Padding | 0 12px 0 16px (content centered in the height) | 0 14px 0 16px |
| Radius | 10px | 10px |
| Background | `surface-card` #1d2328 | `surface-sunken` #161a1e |
| Shadow | `shadow-trigger` | `shadow-sunken` |
| Border | **none** [OBSERVED]: depth = `surface-card` + `shadow-trigger`; identified by its value text and chevron (≥ 3.3:1), like a text button | **none** [OBSERVED]: depth = `surface-sunken` + `shadow-sunken`, as the text input (exception A-1) |
| Value text | 14/20 `text-secondary` | 14/20 `text-primary` |
| Placeholder | 14/20 `text-placeholder` | same |
| Hover | bg `surface-card-hover` #232a30 | no change |
| Focus-visible | `focus-ring-tight` | `focus-ring-tight` + `shadow-sunken` |
| Error | — (filters can't be invalid) | `--ds-error-ring` + `shadow-sunken` |
| Width | sized to the longest option; defaults 160 / 180 / 200px **[PRODUCT DECISION]** | 100% of the field |
| Boundary mode (§9.3) | adds 1px `border-control-strong` | adds 1px `border-control-strong` |

**Source note (R-03, R-58).** In the source, the single-select dropdown was **raised** everywhere, including create/edit panels; only the multi-select and the rich user picker were recessed. R-03 standardized single selects in forms to the recessed style so a form column reads as one kind of field. Whether to restore the raised form select is open decision D-18. Either way, neither style has a default border.
| Gap value↔chevron | 8px | 8px |

**Default values.** Filters always have an explicit "All …" option as the first option and default ("All Status", "All Regions"). This keeps the trigger showing a value. Form selects show a placeholder ("Choose region") until a value is chosen.

```html
<div class="ds-select">
  <button type="button" class="ds-select__trigger ds-select__trigger--filter" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="status-list" aria-label="Status">
    <span class="ds-select__value ds-truncate">All Status</span>
    <svg class="ds-select__chevron" width="18" height="18" aria-hidden="true"><path d="M5.4 7.2 9 10.8l3.6-3.6" stroke="#6b7280" stroke-width="1.35" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <!-- menu: §5.10 -->
</div>
```
```css
.ds-select { position: relative; }
.ds-select__trigger {
  display: flex; align-items: center; justify-content: space-between; gap: var(--ds-space-2);
  width: 100%; min-height: var(--ds-size-control); border-radius: var(--ds-radius-control);
  font-size: 14px; line-height: 20px; text-align: start;
  transition: background-color var(--ds-duration-fast) var(--ds-ease-standard);
}
.ds-select__trigger--filter { padding: 0 var(--ds-space-3) 0 var(--ds-space-4); background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-trigger); color: var(--ds-color-text-secondary); }
.ds-select__trigger--filter:hover { background: var(--ds-color-surface-card-hover); }
.ds-select__trigger--field { padding: 0 var(--ds-space-3-5) 0 var(--ds-space-4); background: var(--ds-color-surface-sunken); box-shadow: var(--ds-shadow-sunken);
  color: var(--ds-color-text-primary); }
.ds-select__trigger:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
.ds-select__trigger--field[aria-invalid="true"] { box-shadow: var(--ds-error-ring), var(--ds-shadow-sunken); }
.ds-select__value { display: flex; align-items: center; gap: var(--ds-space-2); min-width: 0; }
.ds-select__value--placeholder { color: var(--ds-color-text-placeholder); }
.ds-select__chevron { flex-shrink: 0; transition: transform var(--ds-duration-fast) var(--ds-ease-standard); }
.ds-select__trigger[aria-expanded="true"] .ds-select__chevron { transform: rotate(180deg); }
```

---

### 5.10 Dropdown menu (listbox)

**Purpose.** The floating option list for selects and multi-selects. (Menus of *commands*, e.g. "More actions", use the same visuals with `role="menu"` / `menuitem` semantics.)

**Anatomy.** Container → [search band] → `ul[role=listbox]` of options → [empty row] → [action row, *outside* the listbox].

| Property | Value |
|---|---|
| Position | `position: absolute; top: 100%; margin-top: 4px`; left-aligned; width = trigger width (it may be wider, right-aligned, for long labels) |
| Surface | bg `surface-card`; no border; radius 10px (`radius-control`); `overflow: hidden`; `shadow-menu`; z-index 50 |
| List | max height 260px, then `overflow-y: auto` |
| Search band | shown when there are **more than 5 options**: 8px padding, 1px `border-subtle` bottom; search input (§5.6) autofocused, placeholder "Search…", with the normal focus ring |
| Option | min height `size-control` (40px); padding 0 16px; 14/20 `text-muted`; an optional 8px status dot + 8px gap before the label |
| Option: hover / active descendant | bg `surface-hover`, text `text-primary`; the **active descendant** also gets `focus-ring-inset` while the listbox or search input has keyboard focus |
| Option: selected | bg `surface-selected`, text `text-primary`, **plus a 16px check glyph at the right edge** (non-color cue); `aria-selected="true"` |
| Empty row | "No matches", 14/20 `text-muted`, padding 10px 16px, `role="status"` |
| Action row | a `<button>` after the list ("+ Add …"): full width, min height 40px, padding 0 16px, 1px `border-subtle` top, bg `surface-card`, 14/20 500 `brand-text` #93c5fd (8.8:1), 16px plus icon, gap 8px; hover text `text-primary`. It is **not** an option, so it never appears in the listbox's arrow-key cycle |

**Keyboard (required, WAI-ARIA select-only combobox + listbox pattern).** Focus stays on the trigger (or on the search input, when present); both carry `role="combobox"`. The focused combobox tracks the active option with `aria-activedescendant`; options are never tab stops. Full behavior contract: §5.55.

| Key | Action |
|---|---|
| Enter / Space / ArrowDown on the closed trigger | Open; the active option = the selected option (or the first) |
| ArrowDown / ArrowUp | Move the active option (no wrap) |
| Home / End | First / last option |
| Type characters (no search band) | Jump to the next option starting with the typed string |
| Enter | Select the active option and close (single select); toggle it (multi-select) |
| Escape | Close without changing; return focus to the trigger |
| Tab | With an action row, from the trigger or search input: move focus to the action row (the menu stays open). Otherwise: close **without** changing a single-select value (multi-select keeps the toggled choices) and let focus move onward |

Clicking outside closes the menu. Picking closes the menu, clears the search and returns focus to the trigger.

```html
<div class="ds-menu">
  <div class="ds-menu__search"><!-- §5.6 search input with role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="opts" aria-activedescendant="opt-1" --></div>
  <ul class="ds-menu__list" role="listbox" id="opts" aria-label="Status">
    <li class="ds-menu__option is-active" role="option" id="opt-1" aria-selected="true">
      <span class="ds-dot ds-dot--sm ds-dot--success" aria-hidden="true"></span>Active
      <svg class="ds-menu__check" width="16" height="16" aria-hidden="true"><!-- check --></svg>
    </li>
    <li class="ds-menu__option" role="option" id="opt-2" aria-selected="false">Inactive</li>
  </ul>
  <button type="button" class="ds-menu__action"><svg width="16" height="16" aria-hidden="true"></svg>Add New Item</button>
</div>
```
```css
.ds-menu { position: absolute; z-index: var(--ds-z-menu); top: 100%; inset-inline-start: 0; margin-top: var(--ds-space-1); width: 100%;
  background: var(--ds-color-surface-card); border-radius: var(--ds-radius-control); box-shadow: var(--ds-shadow-menu); overflow: hidden; }
.ds-menu__search { padding: var(--ds-space-2); border-bottom: 1px solid var(--ds-color-border-subtle); }
.ds-menu__list { max-height: var(--ds-size-menu-max-height); overflow-y: auto; }
.ds-menu__option { display: flex; align-items: center; gap: var(--ds-space-2); min-height: var(--ds-size-control); padding: 0 var(--ds-space-4);
  cursor: pointer; font-size: 14px; line-height: 20px; color: var(--ds-color-text-muted);
  transition: background-color var(--ds-duration-fast), color var(--ds-duration-fast); }
.ds-menu__option:hover, .ds-menu__option.is-active { background: var(--ds-color-surface-hover); color: var(--ds-color-text-primary); }
.ds-menu:focus-within .ds-menu__option.is-active { outline: var(--ds-focus-width) solid var(--ds-color-focus-ring); outline-offset: var(--ds-focus-offset-inset); }
.ds-menu__option[aria-selected="true"] { background: var(--ds-color-surface-selected); color: var(--ds-color-text-primary); }
.ds-menu__check { margin-inline-start: auto; flex-shrink: 0; display: none; color: var(--ds-color-link); }
.ds-menu__option[aria-selected="true"] .ds-menu__check { display: block; }
.ds-menu__empty { padding: var(--ds-space-2-5) var(--ds-space-4); font-size: 14px; line-height: 20px; color: var(--ds-color-text-muted); }
.ds-menu__action { display: flex; align-items: center; gap: var(--ds-space-2); width: 100%; min-height: var(--ds-size-control); padding: 0 var(--ds-space-4);
  border-top: 1px solid var(--ds-color-border-subtle); background: var(--ds-color-surface-card);
  font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-brand-text); text-align: start; }
.ds-menu__action:hover { color: var(--ds-color-text-primary); }
.ds-menu__action:focus-visible { outline-offset: var(--ds-focus-offset-inset); }
```

---

### 5.11 Multi-select

**Purpose.** Choose several options from a list. It is always a **form** control (sunken trigger).

- **Trigger:** the §5.9 sunken field trigger. Value = the selected labels joined with ", " when they fit on one line, otherwise "N selected" (the full list is in the menu and in the trigger's accessible name); never a clipped half-word. Placeholder "Select…" when empty.
- **Menu:** §5.10, with `aria-multiselectable="true"`. Each option is `[16px checkbox] label` with a 12px gap and 14/20 `text-secondary`. Choosing an option toggles it **without closing** the menu.
- **Checkbox (in options):** 16×16, radius 4px. Unchecked: 1px `border-control-strong` #6b7280 (3.28:1), transparent. Checked: bg `brand-strong`, border `brand`, white check (10×8 path `M1 4l2.5 2.5L9 1`, stroke 1.6, round caps).
- **Error:** the trigger shows `--ds-error-ring` with `shadow-sunken` (no default border, as §5.9).

Chips inside the trigger are **not used**: the value stays as text so the trigger keeps a single line at its 40px minimum height.

---

### 5.12 Checkbox (standalone) [EXTENSION]

Built from the in-menu checkbox: a 16px box with the same states as above, a 12px gap to a 14/20 `text-secondary` label, and an overall row height of 20px. Focus: `focus-ring` on the box. Indeterminate state: brand fill with a white 8×1.6 horizontal bar. Use a native `<input type="checkbox">` visually hidden behind the styled box.

```css
.ds-check { display: inline-flex; align-items: center; gap: var(--ds-space-3); font-size: 14px; line-height: 20px; color: var(--ds-color-text-secondary); cursor: pointer; }
.ds-check__box { width: 16px; height: 16px; border-radius: var(--ds-radius-xs); border: 1px solid var(--ds-color-border-control-strong);
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ds-check input:checked + .ds-check__box { background: var(--ds-color-brand-strong); border-color: var(--ds-color-brand); }
.ds-check input:focus-visible + .ds-check__box { outline: var(--ds-focus-width) solid var(--ds-color-focus-ring); outline-offset: var(--ds-focus-offset); }
```

---

### 5.13 Radio cards

**Purpose.** Choose one of 2–4 mutually exclusive options. All options are shown side by side.

| Property | Value |
|---|---|
| Group | `role="radiogroup"` with `aria-label`; `display: flex; gap: 12px` |
| Card | `flex: 1; min-width: 0`; min-height `size-control` (40px); padding 0 16px; radius 8px; 1px border; gap 8px between radio glyph and label |
| Radio glyph | 20px: filled ring in `brand` when selected; outline ring in `text-muted` (6.19:1) when not. The glyph is the state cue; the card border is decorative |
| Unselected | bg `surface-card`, border `border-radio` #394c5e, text `text-muted` (R-47) |
| Unselected hover | border `border-control-hover` |
| Selected | bg `surface-radio-selected` #202a39, border `brand-strong` #2563eb, text `text-primary` |
| Focus-visible | `focus-ring-tight` |
| Disabled group | opacity 0.4, `cursor: not-allowed` |
| Label | 14/20; wraps and the card grows; never truncated (§2.3) |

**Keyboard.** Arrow keys move the selection within the group (roving `tabindex`). Each card is `role="radio"` with `aria-checked`.

**Radio list [EXTENSION]:** for more than 4 options or long labels, use a vertical stack with gap 8px and the same card styling at full width.

---

### 5.14 Binary status toggle (segmented)

**Purpose.** A two-option state choice in forms (Active / Inactive, Enabled / Disabled). This is the system's canonical on/off control in forms.

| Property | Value |
|---|---|
| Container | `role="radiogroup"`; `display: flex`; 1px `border-strong` white/8%; radius 10px; `overflow: hidden`; min-height `size-control` (40px) |
| Option | `flex: 1`; padding 8px 16px (content centered in the 40px minimum); 14/20 500; gap 6px between an 8px status dot and the label |
| Selected | bg `surface-card`, text `text-primary`, **inset 1px `brand` ring** (4.31:1, R-43) |
| Unselected | transparent, text `text-muted`; hover `text-primary` |
| Focus-visible | `focus-ring-inset` (the container clips outer outlines) |
| Width | half the form row (one column of a two-column grid) |

The dots use the status tones: Active = success, Inactive = error (§5.28).

```html
<div class="ds-toggle" role="radiogroup" aria-label="Status">
  <button type="button" role="radio" aria-checked="true" class="ds-toggle__opt"><span class="ds-dot ds-dot--sm ds-dot--success" aria-hidden="true"></span>Active</button>
  <button type="button" role="radio" aria-checked="false" class="ds-toggle__opt"><span class="ds-dot ds-dot--sm ds-dot--error" aria-hidden="true"></span>Inactive</button>
</div>
```
```css
.ds-toggle { display: flex; min-height: var(--ds-size-control); border: 1px solid var(--ds-color-border-strong); border-radius: var(--ds-radius-control); overflow: hidden; }
.ds-toggle__opt { flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--ds-space-1-5); padding: var(--ds-space-2) var(--ds-space-4);
  font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-muted); background: transparent;
  transition: background-color var(--ds-duration-fast), color var(--ds-duration-fast); }
.ds-toggle__opt:hover { color: var(--ds-color-text-primary); }
.ds-toggle__opt[aria-checked="true"] { background: var(--ds-color-surface-card); color: var(--ds-color-text-primary); box-shadow: inset 0 0 0 1px var(--ds-color-brand); }
.ds-toggle__opt:focus-visible { outline-offset: var(--ds-focus-offset-inset); }
```

### 5.15 Switch [EXTENSION]

Use a switch only for **instant-apply** settings, outside forms that have a Save button.

| Property | Value |
|---|---|
| Track | 36 × 20px, radius full; off: `surface-sunken` with `shadow-sunken-track`; on: `brand-strong` |
| Thumb | 16px circle, 2px inset; off: `text-muted` #94a3b8; on: white with `shadow-lift`; travels 16px, 150ms |
| Label | 14/20 `text-secondary`, 12px gap, label on the right |
| Focus | `focus-ring` on the track |
| Semantics | `<button role="switch" aria-checked>` |

---

### 5.16 Date range picker

**Trigger.** Identical to the **raised filter** select (§5.9). Width: 240px default as a `min-width` (it grows for longer localized dates; `max-width: 100%`). Value text: "10 Apr 2024 - 20 Apr 2024", "From 10 Apr 2024", "Until 20 Apr 2024" or "All Dates". The icon is a 16px calendar in an 18px box, in place of the chevron. `aria-haspopup="dialog"`.

**Popover.**

| Property | Value |
|---|---|
| Position | `top: 100%; right: 0; margin-top: 4px` (right-aligned to the trigger) |
| Size | width `min(360px, 100vw − 32px)` (maximum); padding 16px; `flex-direction: column; gap: 16px` |
| Surface | bg `surface-card`, radius 10px (`radius-control`, R-51), `shadow-menu`, `color-scheme: dark` |
| Body | two form fields ("From", "To") in a 2-column grid, gap 12px; native `<input type="date">` styled as §5.5 with 12px horizontal padding |
| Validation | when From > To: inline `validation` text "“From” must be on or before “To”." and Apply is disabled |
| Footer | `justify-content: space-between`: ghost sm "Clear" (resets to All Dates) and primary sm "Apply" |
| Dismiss | outside click or Escape discards the draft |

**Preset pattern.** Pair it with a raised filter select of presets (Today, Yesterday, Last 7 Days, Last 30 Days, Custom Range). Show the 240px date trigger **only** when "Custom Range" is selected, placed directly to the right of the preset select.

---

### 5.17 File upload (dropzone)

| Property | Value |
|---|---|
| Container | `role="button"`, `tabindex="0"`; `flex-direction: column; align-items: center; gap: 8px`; padding 24px |
| Surface | bg `surface-card`, 1px **dashed** `border-input` #262a30, radius 10px |
| Icon | 32px upload icon at 60% opacity |
| Title | 14/20 500 `text-secondary` ("Upload Reference") |
| Hint | 12/16 `text-muted` (the dropzone sits on the card surface; placeholder grey is for sunken fields only), 2px top margin ("Drag and drop an image, or click to browse • JPG, PNG (Max 5 MB)") |
| Hover / focus-visible / drag-over | border `brand` |
| Error | border `error` |
| Input | a visually hidden `<input type="file">`; Enter/Space opens the picker |

---

### 5.18 Field with attach button

**Purpose.** A text field whose value can be typed or extracted from an uploaded file (e.g. scan a code from a photo).

**Anatomy.** Row (gap 12px): [sunken field (flex 1) holding [20px thumbnail with a 14px clear "×"]? + input] + [Attach button].

| Element | Spec |
|---|---|
| Field | min-height 40px, padding 0 16px, radius 10px, recessed (`surface-sunken` + `shadow-sunken`, no border, as §5.5); inner gap 10px. The wrapper draws the focus outline (`:focus-within`) and the error ring |
| Thumbnail | 20×20 box, 3px padding, image radius 4px at 60% opacity; the clear button is a 14px circle at top/right -6px, bg `surface-card`, 1px `border-subtle`, 6px × glyph, `aria-label="Remove image"` |
| Attach button | min-height 40px, padding 8px 14px, radius 10px, bg `surface-attach` #171b26, 1px `border-strong`, shadow `shadow-highlight` + `shadow-lift`; 14/20 500 `text-secondary`; leading 18px icon, gap 6px; label "Upload" → "Replace" once a file is attached; hover opacity 0.8 |
| Processing | placeholder text changes to "Scanning…" (present tense, ellipsis) |
| Error message | `validation` style below the row, 8px gap ("Text not detected. Upload the photo again.") |

---

### 5.19 Rich picker (entity select with avatar rows)

**Purpose.** Choose a person or entity where identity needs more than a label (name + ID chip + role + email).

| Element | Spec |
|---|---|
| Trigger | §5.9 sunken field trigger with a 12px chevron. With a value, it shows a picker row (below) and uses 12px vertical padding (height grows to 64px) |
| Menu | §5.10 surface; list max height 280px |
| Row | padding 14px 14px 14px 16px; 1px `border-input` bottom divider; hover `surface-hover-subtle`; selected `surface-pill`; focus `surface-hover` |
| Row content | 40px initials avatar (§5.32) + 14px gap + text block: line 1 = name (12/16 600 white) + optional info chip (§5.31) + role (`caption` `text-tertiary`), gap 8px; line 2 = 11×8 mail glyph + email (12/16 `text-muted`, truncate), gap 4px; 1.5px between lines |
| Footer row | full-width button, bg `surface-elevated` #21272d, padding 10px, 14/20 `link` (5.93:1), 16px plus, gap 8px; hover `surface-elevated-hover` |
| Inline add form | replaces the footer: padding 16px, bg `surface-elevated`, gap 12px; [name][email] inputs side by side (gap 12px), then a sunken role select, then a right-aligned ghost sm "Cancel" + primary sm "Add & Select" (gap 8px) |
| Companion link | below the trigger, 16px gap: the §5.3 link action "Add New …" opens the menu straight into the add form |

---

### 5.20 Inline callout (form note)

| Property | Value |
|---|---|
| Container | padding 14px; radius 8px; bg `surface-callout` #111923; 1px `border-callout` #25344b; `flex-direction: column; gap: 4px`; spans the full form width |
| Title | `small-strong` 12/16 600 `text-secondary` |
| Body | 12px, line-height 1.45 (17.4px), `text-muted` |
| Placement | directly under the fields it explains |

### 5.21 Inline alert [EXTENSION]

Built from the callout, using status tints for page-level or form-level messages.

| Tone | Background | Border | Title color | Icon |
|---|---|---|---|---|
| Info | `info-bg` | `info-border` | `info-text` | 16px info circle, `brand` |
| Success | `success-bg` | `success-border` | `success-text` | 16px check circle |
| Warning | `warning-bg` | `warning-border` | `warning-text` | 16px triangle |
| Error | `error-bg` | `error-border` | `error-text` | 16px alert circle |

Layout: padding 12px 14px, radius 8px, gap 8px (icon → text block). Title 12/16 600; body 12/16 `text-secondary`. An optional dismiss icon button (sm) sits on the right. Use `role="alert"` for errors and `role="status"` for the other tones.

---

### 5.22 Stepper (multi-step progress)

**Purpose.** Shows progress through a multi-step form, in a slide-panel header (subheader slot).

| Element | Spec |
|---|---|
| List | `ol`, `display: flex; align-items: center`; every step except the last is `flex: 1` |
| Step | index box + text block, gap 12px |
| Index (current) | 32×32, radius 8px, bg `brand-strong`, 1px `rgba(147,197,253,0.4)` border, 12/16 600 white; shadow `0 0 0 2px rgba(59,130,246,0.2), 0 0 20px -2px rgba(37,99,235,0.45), inset 0 1px 1px 1px rgba(255,255,255,0.35)`; `aria-current="step"` |
| Index (other) | 32×32, radius 8px, bg `surface-sunken-button`, 1px `border-strong`, 12/16 500 `text-muted`, shadow `inset 0 2px 4px 0 rgba(0,0,0,0.6)` |
| Title | current: 12/16 700, +0.3px, white; other: 12/16 500 `text-muted` |
| Subtitle | current: 12/16 500 `link`; other: 12/16 `text-tertiary` |
| Upcoming steps | full opacity; hierarchy via the colors above (R-48). Never dim text with opacity |
| Completed steps [EXTENSION] | full opacity; the index shows a white check on `success-glow` #10b981 |
| Tokens | `--ds-shadow-stepper-active`, `--ds-shadow-stepper-idle`, `--ds-gradient-stepper-active`, `--ds-color-stepper-track`, `--ds-color-stepper-active-border` |
| Connector | `flex: 1`, horizontal padding 16px, 2px tall line; after the current step: `linear-gradient(90deg, rgba(59,130,246,0.6), #1f2636)`; elsewhere solid `#1f2636` |

---

### 5.23 KPI card

**Purpose.** One page-level headline number with its label. By default, KPI cards appear in a **KPI row** near the top of a page. Numbers that belong to a chart, record or row use the §6.4 variants instead.

**Anatomy and structure**

```
┌──────────────────────────────────────────────┐  radius 20 · bg surface-card · shadow-card
│ 16                                            │
│   ┌──────┐ 12  TOTAL USERS          ← kpi-label 12/16 700 UPPER +0.55 muted
│   │ 40×40│     1,284                ← kpi-value 20/28 700 -0.65 white (0px gap)
│   └──────┘                                    │
│                                            16 │
└──────────────────────────────────────────────┘  min-height 76 (16 + 44 + 16)
```

| # | Element | Spec |
|---|---|---|
| 1 | Container | `display: flex; align-items: center; gap: 12px; padding: 16px; flex: 1; min-width: 0`; radius 20px; bg `surface-card`; `shadow-card`; no border; **min-height 76px** (cards in a row stretch to the tallest) |
| 2 | Icon | 40×40 (fixed), `flex-shrink: 0`, `overflow: hidden`, `aria-hidden`; a 3D illustration, or the §2.11 icon tile (radius 12px, `radius-track`). An optional status ball sits bottom-right (14px) |
| 3 | Text block | `min-width: 0`; label directly above value, **0px gap** (the line heights give the rhythm) |
| 4 | Label | `kpi-label`. **Use the complete label** (R-31). Abbreviate only when the meaning stays clear without explanation (standard forms such as "Avg.", "No.", "Qty"); otherwise reword more briefly. At narrow widths the label **wraps to a second line**; it is never truncated (R-53) |
| 5 | Value | `kpi-value`; wraps, never truncates (R-53); `font-variant-numeric: tabular-nums`. Formats: integer with thousands separators ("12,480"), ratio "8 / 12" (spaces around the slash), percent "3.42%", or a short name |
| 6 | Secondary info [EXTENSION] | Optional delta under the value is **not** used; put deltas in a tooltip, or use a dashboard card instead. If one is unavoidable: a third line `small` 12/16 in `success-text` / `error-text` ("▲ 4.2% vs last week"), and the card grows to 92px. Every card in the row must then show one |

**Variants.** *Static* (`<div>`). *Interactive*: a `<button>` that applies a page filter. Hover `filter: brightness(1.1)`; focus `focus-ring`; when its filter is active **[EXTENSION]**, it shows an inset ring `inset 0 0 0 1px var(--ds-color-brand)` and `aria-pressed="true"`.

**Status icon variant.** The base icon plus a status ball: 14px circle at bottom-right, `box-shadow: 0 0 0 2px var(--ds-color-surface-card), 0 2px 4px rgba(0,0,0,0.5), 0 0 6px rgba(16,185,129,0.5)`, fill `radial-gradient(circle at 35% 30%, #a7f3d0 0%, #10b981 45%, #047857 100%)` (success) or `#fecaca / #ef4444 / #991b1b` (error).

**KPI row.** `display: flex; gap: 16px; width: 100%`; 3–5 cards of equal width (`flex: 1`) is the default; more than 6 becomes hard to scan. A single KPI is better shown as a §6.4 variant. Responsive behavior: §8.

```html
<div class="ds-kpi-row">
  <div class="ds-kpi">
    <div class="ds-kpi__icon" aria-hidden="true"><img src="users-3d.png" alt=""></div>
    <div class="ds-kpi__text">
      <p class="ds-kpi__label">Total Users</p>
      <p class="ds-kpi__value">1,284</p>
    </div>
  </div>
  <!-- … -->
</div>
```
```css
.ds-kpi-row { display: flex; gap: var(--ds-space-grid); width: 100%; }
.ds-kpi { display: flex; align-items: center; gap: var(--ds-space-icon-text-lg); flex: 1; min-width: 0;
  padding: var(--ds-space-card); border-radius: var(--ds-radius-card); background: var(--ds-color-surface-card);
  box-shadow: var(--ds-shadow-card); text-align: start; transition: filter var(--ds-duration-fast); }
button.ds-kpi { cursor: pointer; }
button.ds-kpi:hover { filter: brightness(1.1); }
button.ds-kpi[aria-pressed="true"] { box-shadow: var(--ds-shadow-card), inset 0 0 0 1px var(--ds-color-brand); }
.ds-kpi__icon { position: relative; width: var(--ds-size-kpi-icon); height: var(--ds-size-kpi-icon); flex-shrink: 0; overflow: hidden; }
.ds-kpi__icon img { width: 100%; height: 100%; object-fit: contain; }
.ds-kpi__text { min-width: 0; }
.ds-kpi__label { font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 0.55px; text-transform: uppercase;
  color: var(--ds-color-text-muted); overflow-wrap: anywhere; }
.ds-kpi__value { font-size: 20px; line-height: 28px; font-weight: 700; letter-spacing: -0.65px;
  color: var(--ds-color-text-primary); overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.ds-icon-tile { width: 40px; height: 40px; border-radius: var(--ds-radius-track); background: var(--ds-color-brand-tint-10);
  border: 1px solid var(--ds-color-brand-tint-20); display: flex; align-items: center; justify-content: center; color: var(--ds-color-link); }
```

---

### 5.24 Entity card (content card)

**Purpose.** A summary tile for one record in a browsable grid (a project, a team, a site, a customer). Clicking it opens the detail page.

**Anatomy and structure**

```
┌───────────────────────────────────────────────────────────┐ radius 20 · padding 20 · shadow-card
│ [40 icon] 12 Name (card-title)               [● Active]   │ header
│              Location / subtitle (body-muted)  ← 2px gap  │
│ ─────────────────────────────────────────────────────────  │ 1px border-card-internal, 16px above & below
│ [36 avatar] 10 Owner Name (14/22 500 secondary)   12 May  │ person + timestamp row
│                Role (caption, brand)            Updated on│
│ ─────────────────────────────────────────────────────────  │
│   OPEN ITEMS     │   MEMBERS     │   ALERTS               │ metric row (3 equal columns,
│      8/12        │    30/36      │    11/12               │ 1px left dividers)
└───────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Container | `role="button"` (or `<a>` for navigation), `tabindex="0"`; `display: flex; flex-direction: column`; padding 20px; radius 20px; bg `surface-card`; `shadow-card`; hover `brightness(1.1)`; focus `focus-ring` |
| Section separation | each section after the first: `border-top: 1px solid var(--ds-color-border-card-internal); padding-top: 16px`; every section except the last: `margin-bottom: 16px` (this is the card-gap) |
| Header | `justify-content: space-between; align-items: flex-start`; left = 40px icon + 12px gap + [title `card-title`, subtitle 14/20 `text-muted`, 2px gap]; right = Badge md (§5.27) |
| Person row | `justify-content: space-between; align-items: flex-end`; left = 36px neutral initials avatar + 10px gap + [name 14/22 500 `text-secondary`, role `caption` in `link`, 2px gap]; right (right-aligned) = [value 12/16 `text-secondary`, caption 12/16 `text-tertiary`, 2px gap] |
| Metric row | `display: flex`; 3 (2–4) equal columns; each `flex: 1; flex-direction: column; align-items: center; gap: 4px`; columns 2+ have `border-left: 1px solid var(--ds-color-border-card-internal)`; label `metric-label` centered; value = `metric-value` + `metric-denominator` (`/12`), baseline-aligned with a 2px gap |
| Inactive record | the whole card at `opacity: 0.75`; the badge shows the error tone; the timestamp caption reads "Inactive since" |

**Grid.** `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px`. Default: `repeat(auto-fill, minmax(320px, 1fr))`. The source used a fixed 3 columns **[PRODUCT DECISION]**. `auto-fill` keeps card widths stable when the last row is partly filled. Responsive: §8.

```css
.ds-entity { display: flex; flex-direction: column; padding: var(--ds-space-card-lg); border-radius: var(--ds-radius-card);
  background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); cursor: pointer; min-width: 0; transition: filter var(--ds-duration-fast); }
.ds-entity:hover { filter: brightness(1.1); }
.ds-entity--inactive { opacity: 0.75; }
.ds-entity__section + .ds-entity__section { border-top: 1px solid var(--ds-color-border-card-internal); padding-top: var(--ds-space-card-gap); }
.ds-entity__section:not(:last-child) { margin-bottom: var(--ds-space-card-gap); }
.ds-entity__metrics { display: flex; }
.ds-entity__metric { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--ds-space-1); }
.ds-entity__metric + .ds-entity__metric { border-inline-start: 1px solid var(--ds-color-border-card-internal); }
```

---

### 5.25 Dashboard card (chart / data container)

**Purpose.** A container for a chart, matrix, heatmap or embedded table on a dashboard.

| Element | Spec |
|---|---|
| Container | `position: relative`; radius 20px; bg `surface-card`; `shadow-card`; `flex-direction: column; gap: 20px` |
| Padding | **Chart content:** 24px on all sides. **Edge-to-edge content** (tables, heatmaps): `padding-top: 24px` only; the header row has 24px horizontal padding, and the content starts after a 1px `border-divider` top border and runs to the card edges (`overflow: hidden`) |
| Header row | `display: flex; justify-content: space-between; align-items: center; gap: 16px`; min-height 40px (so headers align across side-by-side cards) |
| Title | `card-title` |
| Subtitle (optional) | 14/20 `text-chart-subtle` #9eacba, 5px below the title (title + subtitle stack, `gap: 5px`) |
| Header right | legend and/or filter select and/or accent segmented tabs, gap 16–20px |
| Empty state | centered `body-muted` text ("No data in this range."), padding 64px 0, or the chart's fixed height (e.g. 330px) |

**Side-by-side layout.** `display: flex; gap: 20px; align-items: stretch`. A card whose content has a fixed size (e.g. a donut + legend, observed at 594px) takes `flex: 0 1 auto` with a `min-width` that fits its content; the neighbouring card takes `flex: 1; min-width: 0`. For a set of peer cards, use proportional `flex` values.

```css
.ds-dash-card { position: relative; display: flex; flex-direction: column; gap: var(--ds-space-chart-gap);
  padding: var(--ds-space-card-xl); border-radius: var(--ds-radius-card); background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); }
.ds-dash-card--flush { padding: var(--ds-space-card-xl) 0 0; overflow: hidden; }
.ds-dash-card--flush > .ds-dash-card__header { padding: 0 var(--ds-space-card-xl); }
.ds-dash-card--flush > .ds-dash-card__body { border-top: 1px solid var(--ds-color-border-divider); }
.ds-dash-card__header { display: flex; align-items: center; justify-content: space-between; gap: var(--ds-space-4); min-height: 40px; }
.ds-dash-card__title { font-size: 20px; line-height: 24px; font-weight: 600; letter-spacing: -0.4px; color: var(--ds-color-text-primary); overflow-wrap: anywhere; }
.ds-dash-card__subtitle { font-size: 14px; line-height: 20px; color: var(--ds-color-text-chart-subtle); margin-top: 5px; }
.ds-dash-row { display: flex; gap: var(--ds-space-grid-lg); align-items: stretch; }
```

---

### 5.26 Status card (status bar + list)

**Purpose.** Shows the live up/down state of a set of units, with a summary bar and a short list.

Anatomy: a §5.25 flush card with a `gap` of **16px** (not 20px).

1. Header row (min-height 40px, padding 0 24px): title on the left; a dot legend on the right ("Running", "Stopped"; gap 20px).
2. Segmented status bar (padding 0 24px): §5.34.
3. Table (after a 1px `border-divider` top border), capped at 266px (header + 5 rows) with a pinned header. Sort it worst-first: down/failed items first, with the longest-down at the top.

Clickable rows (`onRowClick`) navigate to the unit.

---

### 5.27 Badge (status)

**Purpose.** A labelled status for a single record (Active, Inactive, Matched, Failed, Pending).

| Property | md (default) | sm |
|---|---|---|
| Layout | `inline-flex; align-items: center; gap: 6px` | same |
| Padding | 4px 12px | 2px 8px |
| Height | 30px (with border) | 22px |
| Radius | full (pill) | full |
| Text | `badge` 14/20 600 | `badge-sm` 12/16 600 |
| Dot | 6px circle with the tone's glow | 6px, no glow |
| Border | 1px tone border | 1px tone border |

| Tone | Background | Border | Text | Dot | Glow |
|---|---|---|---|---|---|
| success | `success-bg` | `success-border` | `success-text` | `success-text` | `shadow-status-success` |
| warning | `warning-bg` | `warning-border` | `warning-text` | `warning-text` | `shadow-status-warning` |
| error | `error-bg` | `error-border` | `error-text` | `error` | `shadow-status-error` |
| info [EXT] | `info-bg` | `info-border` | `info-text` | `brand` | none |
| neutral [EXT] | `surface-pill` | `border-subtle` | `text-secondary` | `text-muted` | none |

**Rules.** The text always names the state (color is never the only signal). Use md in cards and headers, and sm in dense rows. Badges are not interactive.

```html
<span class="ds-badge ds-badge--success"><span class="ds-badge__dot" aria-hidden="true"></span>Active</span>
```
```css
.ds-badge { display: inline-flex; align-items: center; gap: var(--ds-space-1-5); padding: var(--ds-space-1) var(--ds-space-3); border: 1px solid; border-radius: var(--ds-radius-full);
  font-size: 14px; line-height: 20px; font-weight: 600; white-space: nowrap; }
.ds-badge--sm { padding: var(--ds-space-0-5) var(--ds-space-2); font-size: 12px; line-height: 16px; }
.ds-badge__dot { width: 6px; height: 6px; border-radius: 9999px; flex-shrink: 0; background: currentColor; }
.ds-badge--success { background: var(--ds-color-success-bg); border-color: var(--ds-color-success-border); color: var(--ds-color-success-text); }
.ds-badge--success .ds-badge__dot { box-shadow: var(--ds-shadow-status-success); }
.ds-badge--warning { background: var(--ds-color-warning-bg); border-color: var(--ds-color-warning-border); color: var(--ds-color-warning-text); }
.ds-badge--warning .ds-badge__dot { box-shadow: var(--ds-shadow-status-warning); }
.ds-badge--error { background: var(--ds-color-error-bg); border-color: var(--ds-color-error-border); color: var(--ds-color-error-text); }
.ds-badge--error .ds-badge__dot { background: var(--ds-color-error); box-shadow: var(--ds-shadow-status-error); }
.ds-badge--sm .ds-badge__dot { box-shadow: none; }
```

---

### 5.28 Status dot

**Purpose.** A compact status indicator in tables, menus, toggles and strips.

| Property | md | sm |
|---|---|---|
| Size | 10px | 8px |
| Shape | circle | circle |

| Tone | Core | Glow (`box-shadow`) |
|---|---|---|
| success / active / online | `#34d399` | `0 0 10px 0 #10b981, 0 0 2px 0 #34d399` |
| warning / idle | `#fbbf24` | `0 0 10px 0 #f59e0b, 0 0 2px 0 #fbbf24` |
| error / inactive / offline | `#ef4444` | `0 0 10px 0 #b91c1c, 0 0 2px 0 #ef4444` |

**Accessibility rule [STANDARDIZED, R-15].** A dot is never the only carrier of status. Either:
- (a) pair it with a visible text label (`body` `text-secondary`, 8px gap). This is the default in table "Status" columns. Or:
- (b) when density forbids a label, give the dot `role="img"`, an `aria-label` ("Active") and a §5.49 tooltip on hover/focus (the dot then needs `tabindex="0"`), **and** the screen must show a legend explaining the tones.

When the label sits next to the dot, set `aria-hidden="true"` on the dot.

```css
.ds-dot { display: inline-block; width: var(--ds-size-status-dot); height: var(--ds-size-status-dot); border-radius: 9999px; flex-shrink: 0; }
.ds-dot--sm { width: var(--ds-size-status-dot-sm); height: var(--ds-size-status-dot-sm); }
.ds-dot--success { background: var(--ds-color-success-text); box-shadow: var(--ds-shadow-status-success); }
.ds-dot--warning { background: var(--ds-color-warning-text); box-shadow: var(--ds-shadow-status-warning); }
.ds-dot--error   { background: var(--ds-color-error);        box-shadow: var(--ds-shadow-status-error); }
.ds-status { display: inline-flex; align-items: center; gap: var(--ds-space-2); font-size: 14px; line-height: 20px; color: var(--ds-color-text-secondary); }
```

---

### 5.29 Tag (solid category)

**Purpose.** A categorical label for non-status categories: role, module, type, department.

| Property | Value |
|---|---|
| Layout | `inline-block`, `white-space: nowrap` |
| Padding | 6px 12px (height 32px) |
| Radius | 4px |
| Text | `tag` 14/20 500 white |
| Fill | one of the five muted fills: purple `#4d3f9d`, blue `#3f779d`, green `#457e32`, amber `#95693c`, rose `#9d3f5a` (all ≥ 4.5:1 with white text) |
| Raised variant | adds `shadow-card` (use when the tag sits on a busy surface) |

**Assignment rule.** Map each category value to a fixed fill **once per product**, and keep the mapping stable across every screen. With more than 5 categories, reuse fills in the same order. Never use status colors for tags, and never use tags for status.

```css
.ds-tag { display: inline-block; padding: var(--ds-space-1-5) var(--ds-space-3); border-radius: var(--ds-radius-xs); font-size: 14px; line-height: 20px; font-weight: 500;
  color: var(--ds-color-text-primary); white-space: nowrap; }
.ds-tag--purple { background: var(--ds-tag-purple); } .ds-tag--blue { background: var(--ds-tag-blue); }
.ds-tag--green  { background: var(--ds-tag-green); }  .ds-tag--amber { background: var(--ds-tag-amber); }
.ds-tag--rose   { background: var(--ds-tag-rose); }
```

### 5.30 Count pill

A number next to a group or section title. Padding 3px 13px (height 26px); radius full; bg `surface-pill` white/4%; 1px `border-subtle`; `count-pill` 14/18 700 `text-secondary`. It is not interactive. Gap to the title is 14px.

```css
.ds-count { display: inline-block; padding: 3px 13px; border-radius: 9999px; background: var(--ds-color-surface-pill);
  border: 1px solid var(--ds-color-border-subtle); font-size: 14px; line-height: 18px; font-weight: 700; color: var(--ds-color-text-secondary); }
```

### 5.31 Info chip

A compact identifier next to a name (an employee ID or code). Padding 3px 9px; radius 4px; bg `brand-tint-10`; 1px `brand-tint-20`; `caption` 10px with a 15px line height, in `brand-text` #93c5fd; `white-space: nowrap`.

### 5.32 Avatar

| Variant | Size | Spec |
|---|---|---|
| Photo (user menu) | 32px | 1px padding showing `--ds-gradient-brand-ring`; inner circle bg `#121622`, image `object-fit: cover` |
| Initials, brand (pickers, people lists) | 40px | circle, `--ds-gradient-brand-avatar` (45°, #1d4ed8 → #6366f1), 1px `brand-avatar-border`, 12/16 700 white initials (max 2 letters), shadow `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` |
| Initials, neutral (card owner) | 36px | circle, bg `surface-avatar` #18202d, 1px `border-avatar` #334155, 12px 500 `text-secondary`, line-height 1 |

Initials = the first letters of the first two words, uppercased. Avatars are decorative when the name is shown beside them.

### 5.33 Metric indicator (inline value)

A value with an optional denominator, used in cards and strips: `metric-value` + `metric-denominator`, `display: flex; align-items: baseline; gap: 2px` → **8**/12. Above it, a `metric-label` with a 4px gap. Center it in equal columns.

Colored values in table cells: a value equal to its target is shown in `success-text`. A value below target is shown in `warning-text`. A non-zero alert count is shown in `alert-count` #fb7185. A zero or neutral value is shown in `text-secondary`.

### 5.34 Progress & segmented status bar

**Segmented status bar.**

| Property | Value |
|---|---|
| Track | `display: flex`; height 20px; radius 6px; `overflow: hidden`; `role="img"` + `aria-label="18 running, 3 stopped"` |
| Segment | width ∝ share; bg `chart-running` #34d399 / `chart-stopped` #ff5825 (or other chart tones); the last segment is `flex: 1`; 2px card-colored gap between segments (R-45) |
| Count label | centered in the segment, 12px 600, line-height 1, `text-on-bright` #0b0f14 |
| Min width | 28px for any non-empty segment (keeps its number readable); 0 when empty |
| Motion | `transition: width 500ms` |

**Progress bar [EXTENSION]** (single value, e.g. completion):

| Property | Value |
|---|---|
| Track | height 8px; radius 6px; bg `chart-track` white/5% |
| Fill | `brand` (neutral progress), `success-text` (healthy), `warning-text` (at risk), `error` (failing) |
| Label | value to the right: 12/16 600 `text-secondary`, 8px gap |
| Semantics | `role="progressbar"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` |

### 5.35 Summary strip (record header bar)

**Purpose.** A single-row summary of the record currently in context, shown above the main content (key identifiers + health).

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐ radius 20 · px16 py12
│ ● Context label (eyebrow)   │  Field label   Field label   Field label   Status  Status  │
│ Record Title (summary-title)│  VALUE-001     VALUE-002     VALUE-003       ●       ●     │
└─────────────────────────────────────────────────────────────────────────────────────────┘
       min-width 180px       1px vertical divider    (all items: justify-content: space-between, gap 20px)
```

| Element | Spec |
|---|---|
| Container | `display: flex; align-items: center; justify-content: space-between; gap: 20px`; padding 12px 16px; radius 20px; bg `surface-card`; `shadow-card` |
| Lead block | `flex-direction: column; gap: 6px; min-width: 180px; flex-shrink: 1`; eyebrow = 8px `brand` dot + 8px gap + `eyebrow` text; title = `summary-title`, 2-line clamp; when clamped, the full text is shown in a §5.49 tooltip (make the title focusable with `tabindex="0"`) |
| Divider | `align-self: stretch; width: 1px; background: var(--ds-color-border-vertical)` |
| Field | `flex-direction: column; gap: 8px; flex-shrink: 0`; label `field-label`; value `field-value` (`nowrap`) |
| Status field | same as a field; the value is a §5.28 status (10px dot + `body` label "Online" / "Offline"), 24px tall |

---

### 5.36 Media card & media viewer modal

**Media card** (a camera feed, image, document preview):

| Element | Spec |
|---|---|
| Container | `<button>`; `flex-direction: column; min-height: 0`; radius 20px; `overflow: hidden`; bg `surface-overlay` #161a20; 1px `border-media` white/7%; shadow `shadow-float`; an inner overlay with `shadow-highlight` |
| Hover | border `brand-border-hover` (blue/40%) |
| Focus | `focus-ring` |
| Header | padding 16px; bg `surface-card`; left = 28px icon tile (radius 8px, `brand-tint-10` fill, 1px `brand-tint-20`, 16px icon) + 12px gap + [title `card-title` truncate, sub `body-muted` with a 16px line height, 4px gap]; right = 16px expand icon in a 4px-padded box |
| Media | `flex: 1`; bg `surface-media`; image `object-fit: cover` at opacity 0.5 |
| Footer | padding 10px 16px; 1px `border-subtle` top; bg `surface-card-footer`; left = 12/16 600 `text-secondary` "Label: *value*" (the value in italic 400), truncated; right = Badge md |

**Grid.** Default `repeat(auto-fill, minmax(280px, 1fr)); gap: 20px` (the source used a fixed 4 columns **[PRODUCT DECISION]**). The grid fills the remaining page height (`flex: 1; min-height: 0`).

**Media viewer modal.**

| Element | Spec |
|---|---|
| Container | width `min(90vw, 900px)`; max-height 90vh; radius 20px; `overflow: hidden`; bg `surface-overlay`; `shadow-modal` |
| Header | padding 20px 32px; bg `surface-card`; 2px `border-subtle` bottom; left = 48px icon tile (radius 12px, 2px `brand-tint-20` border) + 16px gap + [title row: `dialog-title` + 16px `text-muted` secondary id, gap 12px; sub line `body-muted`]; right = Badge + 36px collapse icon button (radius 12px), gap 16px |
| Context row | padding 12px 32px; 1px `border-subtle` bottom; `body-muted` "Detected: " + value in 500 `text-primary` |
| Media | `flex: 1`; min-height 460px; image `object-fit: contain` at opacity 0.5; annotation frame per §2.12 |

---

### 5.37 Sidebar navigation

**Purpose.** Primary app navigation. On desktop it is an **icon rail** that expands over the content on hover or keyboard focus.

**Structure**

```
 collapsed 76px              expanded 256px (overlays content; page never reflows)
┌──────────┐                ┌────────────────────────────────┐
│ [logo40] │ brand header   │ [logo40] Product Name    [⇄]   │  px 6 · py 4 · width 236
│          │ ↓ 20px         │          Product tagline       │
│ ·        │ section label  │ General                        │  12/16 muted, px 14, mb 2
│ [icon24] │ nav item 44px  │ [icon24] Dashboard             │  gap 4 between items
│ [icon24] │                │ [icon24] Reports               │
│          │ ↓ 16px         │                                │  gap 16 between sections
│ ·        │                │ Admin                          │
│ [icon24] │                │ [icon24] Users                 │
│   …      │                │   …                            │
│ [avatar] │ user card      │ [avatar] Full Name        [⎋]  │  pinned to bottom, mt 12
└──────────┘                └────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Slot | `position: relative; width: 76px; flex-shrink: 0; z-index: 40` (reserves the rail width) |
| Panel | `position: absolute; inset-block: 0; left: 0; width: 76px`; expands to `256px` on `:hover` or `:has(:focus-visible)`; radius 20px; bg `bg-shell` #1b1f22; `shadow-shell`; `overflow: hidden`; `transition: width 300ms var(--ds-ease-emphasized)` |
| Inner | `flex-direction: column; justify-content: space-between; height: 100%; padding: 17px 10px` |
| Scroll area | top block `flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden` |
| Brand header | width 236px; padding 4px 6px; logo tile 40×40, 1px `border-logo` #333, radius 8px; gap 12px; name 14/20 600 -0.35px white; tagline `caption` with a 16.5px line height, `text-muted`; optional 24px toggle icon button on the right |
| Nav | `margin-top: 20px; flex-direction: column; gap: 16px` (between sections) |
| Section | `flex-direction: column; gap: 4px`; label `nav-section`, padding 0 14px, margin-bottom 2px, `nowrap` |
| Nav item | `<button>` or `<a>`; `display: flex; align-items: center`; width 100%; min-height `size-nav-item` (44px); padding 0 14px; radius 16px; `nav-item` text; icon 24px; label `padding-inline-start: 12px`, one line with an ellipsis; when truncated, the item shows its full label in a §5.49 tooltip (as in the collapsed rail) |
| Nav item: inactive | text `text-muted`; hover text `text-primary` + bg `surface-hover` |
| Nav item: active | text `text-primary`; **label weight 600** (the non-color cue, R-56); bg `surface-card` #1d2328 + `shadow-card` (a raised pill); `aria-current="page"` |
| Nav item: focus | `focus-ring` |
| Collapsed labels | `opacity: 0`; when the panel expands, `opacity: 1` with `transition: opacity 200ms; transition-delay: 75ms`. While collapsed, each item shows its label in a §5.49 tooltip on hover/focus, and the label stays in the accessible name |
| User card | `margin-top: 12px`; radius 20px; 1px `border-strong`; padding 10px; bg `linear-gradient(180deg, #141824 0%, #10141e 50%, #0c0f16 100%)`; a decorative glow (128px circle, `brand-tint-20`, `filter: blur(20px)`, centered at top -48px); content width 214px: 32px photo avatar + 8px gap + [name 14/18 600 -0.35px white, role 12/16 `text-muted`]; a 20px log-out icon on the right at opacity 0.6 → 1 on hover, with `aria-label="Log out"` |

**Section grouping.** Group items into 2–3 labelled sections (e.g. "General", "Admin"). Section labels are visible only when expanded.

```css
.ds-sidebar-slot { position: relative; width: var(--ds-size-sidebar-collapsed); flex-shrink: 0; z-index: var(--ds-z-sidebar); }
.ds-sidebar { position: absolute; top: 0; bottom: 0; inset-inline-start: 0; width: var(--ds-size-sidebar-collapsed); overflow: hidden;
  border-radius: var(--ds-radius-card); background: var(--ds-color-bg-shell); box-shadow: var(--ds-shadow-shell);
  transition: width var(--ds-duration-slow) var(--ds-ease-emphasized); }
.ds-sidebar:hover, .ds-sidebar:has(:focus-visible) { width: var(--ds-size-sidebar-expanded); }
.ds-sidebar__inner { display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 17px var(--ds-space-2-5); }
.ds-sidebar__fade { opacity: 0; transition: opacity var(--ds-duration-base); white-space: nowrap; }
.ds-sidebar:hover .ds-sidebar__fade, .ds-sidebar:has(:focus-visible) .ds-sidebar__fade { opacity: 1; transition-delay: 75ms; }
.ds-nav { margin-top: 20px; display: flex; flex-direction: column; gap: var(--ds-space-4); }
.ds-nav__section { display: flex; flex-direction: column; gap: var(--ds-space-1); }
.ds-nav__label { padding: 0 var(--ds-space-3-5); margin-bottom: 2px; font-size: 12px; line-height: 16px; color: var(--ds-color-text-muted); }
.ds-nav__item { position: relative; display: flex; align-items: center; width: 100%; min-height: var(--ds-size-nav-item); padding: 0 var(--ds-space-3-5); border-radius: var(--ds-radius-nested);
  font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-muted); text-align: start;
  transition: background-color var(--ds-duration-fast), color var(--ds-duration-fast); }
.ds-nav__item:hover { color: var(--ds-color-text-primary); background: var(--ds-color-surface-hover); }
.ds-nav__item[aria-current="page"] { color: var(--ds-color-text-primary); font-weight: 600; background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); }
.ds-nav__icon { width: 24px; height: 24px; flex-shrink: 0; }
.ds-nav__text { padding-inline-start: var(--ds-space-3); min-width: 0; overflow: hidden; text-overflow: ellipsis; }
@media (prefers-reduced-motion: reduce) { .ds-sidebar { transition: none; } }
```

**Top navigation [EXTENSION].** For products that need a top bar instead: min-height 64px; bg `bg-shell`; `shadow-shell`; radius 20px; padding 0 16px; brand block on the left (same as the brand header); nav items are horizontal, use the same item styling at height 40px (padding 10px 14px, radius 12px), gap 4px; the user avatar is on the right. Never use a sidebar and a top nav together.

---

### 5.38 Page header

| Property | Value |
|---|---|
| Element | `<header>`, `flex-shrink: 0`, `position: relative; z-index: 10` |
| Height | min-height 76px (grows when the title or actions wrap) |
| Padding | 0 16px |
| Layout | `display: flex; align-items: center; justify-content: space-between` |
| Background | transparent over `bg-shell`, with `backdrop-filter: blur(12px)` |
| Left | [back button?] + 10px gap + `<h1>` in `page-title` |
| Right | action group, gap 12px (§5.4) |
| Scrolled state | when the content below is scrolled (`scrollTop > 0`), `box-shadow: var(--ds-shadow-header-scrolled)`, transitioned over 200ms; otherwise no shadow |

**Back button.** A 36px icon button (radius 8px; hover `surface-hover`) with a 24px white back arrow and `aria-label="Back to <parent>"`. It is the only breadcrumb pattern for one level of depth.

**Breadcrumb [EXTENSION]** for two or more levels: placed above the title inside the same 76px header (stack gap 2px). Text `small` 12/16: links in `text-muted` (hover `text-primary`), separator "/" in `text-faint` with 6px spacing each side, current page omitted (it is the h1). The title stays `page-title`.

---

### 5.39 Segmented tabs

Two variants. Both are `role="tablist"`; each tab is a `role="tab"` button with `aria-selected`.

| Property | **Raised** (page-level view switch) | **Accent** (in-card view switch) |
|---|---|---|
| Track | `inline-flex`; padding 5px; radius 12px; bg `surface-sunken-deep` #111418; `shadow-sunken-track`; min-height 50px | `inline-flex`; min-height `size-control` (40px); padding 5px; radius 12px; bg `surface-sunken-alt` #161a20; 1px white/4% border; `shadow-sunken-track` |
| Tab | padding 10px 20px; radius 8px; `tab` 14/20 400 | `flex: 1` (equal widths); padding 0 12px; radius 8px; `tab-accent` 14/20 600 -0.4px |
| Inactive | text `text-muted`; hover bg `surface-hover-subtle` | text `text-muted`; hover bg `surface-hover-subtle` |
| Active | bg `surface-card` + `shadow-card`; text `text-primary`; **label weight 600** (the non-color cue, R-56) | bg `brand-strong` #2563eb (3.38:1 against the track); text white (5.17:1, R-39) |
| Count | optional "(24)", `tab-count`, 4px gap; active `text-muted`, inactive `text-tertiary` | not used |
| Focus | `focus-ring-tight` | `focus-ring-tight` |
| Width | content width, left-aligned | equal-width tabs; track width = tab count × the widest label's tab (observed: 282px for 2 tabs, 408px for 3, 680px for 5; examples, not requirements) |
| Use | filtering a page's main list by category (counts help) | switching a chart or table view inside a card header |

**Keyboard (required):** the tablist is one tab stop. ArrowLeft/ArrowRight move between tabs and activate them; Home/End jump to the first/last tab. Each tab has `aria-controls` pointing at its panel. Suggested classes: `.ds-tabs` (track), `.ds-tab` (tab).

**Underline tabs** are not part of this system. Do not introduce them.

---

### 5.40 Pagination

| Element | Spec |
|---|---|
| Bar | `display: flex; justify-content: space-between; align-items: center`; padding 12px 16px; 1px `border-subtle` top; bg `surface-card`; sits at the bottom of a table card |
| Summary | `body-muted`: "Showing **1 – 8** of **24** users"; numbers in 500 `text-primary`; en dash with spaces; plural noun of the item type |
| Buttons | gap 6px; each `size-pagination-button` (32 × 32px); radius 6px; 1px border; 12/16 500 |
| Inactive page | bg `surface-card`; border `border-subtle`; text `text-muted`; hover text `text-primary` + border `border-control-hover` |
| Current page | bg `brand-strong`; border white/30%; text white; `shadow-elevated`; `aria-current="page"` |
| Prev / Next | the same buttons holding a 16px chevron; `aria-label="Previous page"` / `"Next page"`; disabled (opacity 0.4) at the ends |
| Focus | `focus-ring` |
| Many pages [EXTENSION] | show first, last, current ±1 and "…" (a 32px non-interactive cell in `text-muted`) once there are more than 7 pages |
| Page size | defined by the product (observed 6–8 rows); keep it constant per table |

```css
.ds-pagination { display: flex; align-items: center; justify-content: space-between; padding: var(--ds-space-3) var(--ds-space-4);
  border-top: 1px solid var(--ds-color-border-subtle); background: var(--ds-color-surface-card); }
.ds-pagination__summary { font-size: 14px; line-height: 20px; color: var(--ds-color-text-muted); }
.ds-pagination__summary strong { font-weight: 500; color: var(--ds-color-text-primary); }
.ds-pagination__pages { display: flex; align-items: center; gap: var(--ds-space-1-5); }
.ds-page-btn { min-width: var(--ds-size-pagination-button); min-height: var(--ds-size-pagination-button); padding: 0 var(--ds-space-1-5); display: flex; align-items: center; justify-content: center; border-radius: var(--ds-radius-chip);
  border: 1px solid var(--ds-color-border-subtle); background: var(--ds-color-surface-card); color: var(--ds-color-text-muted);
  font-size: 12px; line-height: 16px; font-weight: 500; transition: color var(--ds-duration-fast), border-color var(--ds-duration-fast); }
.ds-page-btn:hover { color: var(--ds-color-text-primary); border-color: var(--ds-color-border-control-hover); }
.ds-page-btn[aria-current="page"] { background: var(--ds-color-brand-strong); border-color: var(--ds-color-border-on-brand); color: var(--ds-color-text-on-brand); box-shadow: var(--ds-shadow-elevated); }
.ds-page-btn:disabled { opacity: 0.4; pointer-events: none; }
```

---

### 5.41 Data table

**Purpose.** Tabular records. This is the system's core component. The visual appearance is preserved from the source; the structure is standard semantic HTML (R-38).

**Anatomy.** Card (§5.42 / §5.43 / §5.25) → scroll region → `<table>` → `<caption>` (visually hidden) → `<thead>` with one row of `<th scope="col">` → `<tbody>` rows, where each row's identifying cell is `<th scope="row">` and the rest are `<td>`. **A table never sits directly on the page background.**

#### Visual spec

| Element | Spec |
|---|---|
| Table | `width: 100%; border-collapse: separate; border-spacing: 0; table-layout: auto` |
| Header cells | padding `space-cell-y` × `space-cell-x` (12px 16px); `table-header` style (12/16 600 UPPERCASE +0.3px `text-muted`); bg `surface-table-header` (white/2%); `white-space: nowrap`; `vertical-align: bottom` |
| Body row | min-height `size-table-row` (44px) for single-line content (rows grow when cells wrap); **no row borders**; even rows bg `surface-row-stripe` (white/1%); hover bg `surface-row-hover` (white/2%) |
| Body cells | padding 12px 16px; `vertical-align: middle`; 14/20 |
| Row header (identifying column) | `<th scope="row">`, left-aligned, `table-cell-primary` (14/20 500 white), `font-weight: 500` (overriding the bold browser default). It may hold a two-line block: primary line 14/20 600 + secondary `small` 12/16 `text-muted`, 2px gap |
| Other cells | `table-cell` (14/20 400 `text-secondary`). Semantic value colors (§5.33) and tags keep their own colors |
| Spacing between columns | **only the cell padding**: 16px + 16px = 32px between adjacent content. No spacer columns |
| First / last cell | the same 16px padding (aligns with the card header's 16px or 24px inset; with a 24px card header, add `padding-inline-start: 24px` on the first column and `padding-inline-end: 24px` on the last) |

#### Alignment rules

| Content | Alignment | Notes |
|---|---|---|
| Text, names, identifiers, dates, tags, status | **left** | Status is a dot + label (§5.28), left-aligned with the text it reads like |
| Numbers that are compared (counts, amounts, percentages, durations) | **right**, with `font-variant-numeric: tabular-nums` | The header of a right-aligned column is right-aligned too |
| Row actions | **right** | The last column. Header text is visually hidden ("Actions") |
| Single icons / checkboxes | center | Checkbox column 48px wide |

#### Column widths

- `table-layout: auto` lets the browser size columns from their content.
- **Shrink-to-fit columns** (IDs, numbers, dates, status, tags, actions): `width: 1%; white-space: nowrap`.
- **Grow column**: give the one descriptive column (name, title, details) no width. It absorbs the remaining space and may wrap (set `min-width`, e.g. 200px). If a table has no descriptive column, leave all columns at auto; the browser distributes the extra space proportionally.
- An explicit width (e.g. `width: 38%`) is allowed for a long free-text column.
- **Minimum table width:** set `min-width` on the `<table>` (e.g. 720px) so columns never crush. Below that, the region scrolls horizontally.

#### Overflow and truncation

- **Horizontal overflow:** the scroll region (`overflow-x: auto`) MUST be keyboard-scrollable: `role="region"`, `aria-labelledby` pointing at the card title, `tabindex="0"`, and the standard focus ring.
- **Prefer wrapping** for free text. Truncate (`text-overflow: ellipsis` with a max width of 180–240px) **only** when the full value is also available:
  - (a) inside a focusable element in the cell (a row link) with a §5.49 tooltip on hover **and** focus; or
  - (b) in a detail view the row opens.
  Never rely on `title` alone (R-40).
- Screen readers always get the full text: truncation is visual only.

#### Sticky header

- With a height cap (`max-height` on the scroll region, e.g. 266px = header + 5 rows, or 494px ≈ 10 rows): `thead th { position: sticky; top: 0; z-index: 10 }` with **opaque** bg `surface-table-header-pinned` #212629. Sticky goes on the `th`, not the `thead`, for cross-browser support. The header gains `shadow-header-scrolled` while the region is scrolled. The region gets `scroll-padding-top` = header height, so focused rows are never hidden under the header (SC 2.4.11).
- **Page-level sticky header** (no cap; the page scrolls): `top: 0` relative to the page scroller. The table card MUST then use `overflow: clip` instead of `overflow: hidden` (hidden breaks sticky), or round the first and last header cells itself.

#### Sorting

- A sortable header contains a `<button type="button">` with the column label and a 14px sort icon (`currentColor`).
- Set `aria-sort="ascending"` or `"descending"` on the sorted `<th>` only; other sortable headers have no `aria-sort`.
- Unsorted icon = up/down pair; sorted = a single arrow (rotated 180° for descending). The sorted header text becomes `text-secondary`; hover `text-primary`; focus `focus-ring-tight`.
- Sort cycle: first activation = ascending for text, descending for numbers and dates; the next activation reverses.
- Announce the change through a polite live region ("Sorted by Name, ascending").

#### Row actions

- Icon buttons (§5.2, sm) with a 12px gap, each with `aria-label` "<Verb> <row name>" ("Edit Jane Cooper") and a §5.49 tooltip.
- Show at most **3** visible actions. Move the rest into a "More actions" sm icon button that opens a §5.10-style `role="menu"`. Put destructive actions last.

#### Row activation (opening a record)

- Make the row's identifying text a **link or button** inside the row header cell. That is the keyboard target.
- A mouse click anywhere on the row MAY trigger it (via script, ignoring clicks on other interactive elements). Row hover is then bg `surface-hover`, plus `cursor: pointer`.
- **Do not** put `tabindex` or a click role on `<tr>`. It breaks table semantics.
- The row link shows `focus-ring-inset` so the ring isn't clipped by the card.

#### Selection [EXTENSION]

- A leading 48px checkbox column. The header checkbox is labelled "Select all rows on this page" and supports the indeterminate state; each row checkbox is labelled "Select <row name>".
- A selected row gets bg `brand-tint-10`; the checked checkbox is the non-color cue.
- With ≥ 1 row selected, a bulk-action bar replaces the table section header: "3 selected" (`body-strong`, inside a `role="status"` element) + sm action buttons + a ghost sm "Clear selection".
- Spreadsheet-style cell navigation (ARIA `grid`) is a **[PRODUCT DECISION]**, only for editable data grids. Ordinary tables use plain Tab navigation through their interactive elements.

#### Status tints & empty state

- Rows in a warning state: bg `warning-row-tint`. Failed/stopped rows: bg `critical-row-tint`. These are always paired with a status label in the row.
- Empty: one row, one `<td colspan="<all>">`, padding 48px 16px, centered `body-muted` text ("No records match your filters.").

```html
<div class="ds-table-region ds-table-region--capped" role="region" aria-labelledby="people-title" tabindex="0">
  <table class="ds-table">
    <caption class="ds-sr-only">People, sorted by name ascending</caption>
    <thead><tr>
      <th scope="col" aria-sort="ascending"><button type="button" class="ds-th-sort">Name<svg width="14" height="14" aria-hidden="true"></svg></button></th>
      <th scope="col" class="ds-col-shrink">Email</th>
      <th scope="col" class="ds-col-shrink">Status</th>
      <th scope="col" class="ds-col-shrink ds-num">Open Tasks</th>
      <th scope="col" class="ds-col-shrink ds-right"><span class="ds-sr-only">Actions</span></th>
    </tr></thead>
    <tbody>
      <tr>
        <th scope="row"><a href="/people/17" class="ds-row-link">Jane Cooper</a></th>
        <td class="ds-col-shrink">jane@example.com</td>
        <td class="ds-col-shrink"><span class="ds-status"><span class="ds-dot ds-dot--sm ds-dot--success" aria-hidden="true"></span>Active</span></td>
        <td class="ds-col-shrink ds-num">12</td>
        <td class="ds-col-shrink ds-right"><div class="ds-row-actions"><!-- sm icon buttons --></div></td>
      </tr>
    </tbody>
  </table>
</div>
```
```css
.ds-table-region { width: 100%; overflow-x: auto; }
.ds-table-region--capped { overflow-y: auto; max-height: var(--ds-table-max-height, 494px); scroll-padding-top: var(--ds-size-table-header); }
.ds-table-region:focus-visible { outline-offset: var(--ds-focus-offset-inset); }
.ds-table { width: 100%; min-width: var(--ds-table-min-width, 0); border-collapse: separate; border-spacing: 0; table-layout: auto; }
.ds-table th, .ds-table td { padding: var(--ds-space-cell-y) var(--ds-space-cell-x); text-align: start; vertical-align: middle; }
.ds-table thead th { background: var(--ds-color-surface-table-header); white-space: nowrap; vertical-align: bottom;
  font-size: 12px; line-height: 16px; font-weight: 600; letter-spacing: var(--ds-tracking-table-header); text-transform: uppercase; color: var(--ds-color-text-muted); }
.ds-table-region--capped thead th { position: sticky; top: 0; z-index: var(--ds-z-header); background: var(--ds-color-surface-table-header-pinned);
  transition: box-shadow var(--ds-duration-base); }
.ds-table-region--scrolled thead th { box-shadow: var(--ds-shadow-header-scrolled); }
.ds-table tbody td { font-size: 14px; line-height: 20px; color: var(--ds-color-text-secondary); }
.ds-table tbody th { font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-primary); }
.ds-table tbody tr { transition: background-color var(--ds-duration-fast); }
.ds-table tbody tr:nth-child(even) { background: var(--ds-color-surface-row-stripe); }
.ds-table tbody tr:hover { background: var(--ds-color-surface-row-hover); }
.ds-table tbody tr.ds-row-clickable { cursor: pointer; }
.ds-table tbody tr.ds-row-clickable:hover { background: var(--ds-color-surface-hover); }
.ds-table tbody tr.ds-row-warning { background: var(--ds-color-warning-row-tint); }
.ds-table tbody tr.ds-row-critical { background: var(--ds-color-critical-row-tint); }
.ds-table tbody tr[aria-selected="true"], .ds-table tbody tr.is-selected { background: var(--ds-color-brand-tint-10); }
.ds-table .ds-col-shrink { width: 1%; white-space: nowrap; }
.ds-table .ds-num { text-align: right; font-variant-numeric: tabular-nums; }
.ds-table .ds-right { text-align: end; }
.ds-table .ds-center { text-align: center; }
.ds-row-link { color: inherit; font-weight: inherit; text-decoration: none; border-radius: var(--ds-radius-xs); }
.ds-row-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.ds-row-link:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
.ds-th-sort { display: inline-flex; align-items: center; gap: var(--ds-space-1-5); font: inherit; letter-spacing: inherit; text-transform: inherit;
  color: inherit; border-radius: var(--ds-radius-xs); }
.ds-th-sort:hover { color: var(--ds-color-text-primary); }
.ds-th-sort:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
th[aria-sort] .ds-th-sort { color: var(--ds-color-text-secondary); }
th[aria-sort="descending"] .ds-th-sort svg { transform: rotate(180deg); }
.ds-num .ds-th-sort { flex-direction: row-reverse; }
.ds-row-actions { display: flex; align-items: center; justify-content: flex-end; gap: var(--ds-space-3); }
.ds-cell-truncate { display: block; max-width: var(--ds-cell-max, 240px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-table-empty { padding: var(--ds-space-12) var(--ds-space-4) !important; text-align: center !important; color: var(--ds-color-text-muted) !important; }
```

---

### 5.42 Table card & table section header

**Table card.** `display: flex; flex-direction: column; flex-shrink: 0`; radius 20px; `overflow: hidden`; bg `surface-card`; `shadow-card`. Children: [section header?] → table → pagination.

**Table section header** (optional title row above the table):

| Property | Value |
|---|---|
| Layout | `display: flex; justify-content: space-between; align-items: center`; padding 16px; 1px `border-faint` bottom |
| Left | title `group-title` (20/24 700 -0.5px) + 14px gap + count pill (§5.30) |
| Right | optional actions (tonal button, filter select), gap 12px |

---

### 5.43 Collapsible section (grouped list)

**Purpose.** Groups tables or lists by a parent entity. It can nest one level.

| Element | Spec |
|---|---|
| Section card | `<section>`; radius 20px; `overflow: hidden`; bg `surface-card`; `shadow-card`; `flex-shrink: 0` |
| Nested card | inside an open section, in a list with padding 16px and gap 12px; radius 16px; bg `surface-card`; `shadow-card` |
| Header | **min-height `size-section-header` (60px)** (identical whether or not it has an action; grows when the title wraps); padding 0 16px; `display: flex; align-items: center; gap: 16px`; 1px `border-faint` bottom **only when open** |
| Toggle | a `<button aria-expanded>` that fills the header minus the action (`flex: 1; min-width: 0`); `display: flex; align-items: center; gap: 24px`; radius 8px; focus `focus-ring` |
| Title block | title + count pill, gap 14px; title `group-title` (top level), or `subgroup-title` (compact or nested); wraps, never truncated (§2.3) |
| Chevron | top level: after the title block, 32px (24px compact); nested: **before** the title, 24px. Stroke `#6b7280`. Open = flipped vertically (`transform: scaleY(-1)`) |
| Action | optional, right edge, e.g. a tonal md button with an optional min-width of 180px ("+ Add Item") |
| Content | rendered only when open; a table (flush to the edges) or a nested stack |
| Stack | sections are stacked with `gap: 12px` |

**Behavior.** By default, the first group (and its first child) is open. **While any filter or search is active, every group is forced open**, and groups with no matches are hidden, so matches are never behind a collapsed header. An empty group (with no filters active) shows the table's empty row ("No items in this group yet.").

---

### 5.44 Overlay & modal

**Overlay container.**

| Property | Value |
|---|---|
| Scope | desktop: `position: absolute; inset: 0` inside the **main content panel** (the sidebar stays visible for orientation but is `inert` while the overlay is open, matching `aria-modal`); below 1024px: `position: fixed; inset: 0` |
| Backdrop | `modal`: `overlay-modal` black/50%; `panel`: `overlay-panel` black/40%; both with `backdrop-filter: blur(8px)` |
| Z-index | 50 |
| Semantics | `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the title |

**Dismissal rules [STANDARDIZED, R-21]**

| Trigger | Behavior |
|---|---|
| Backdrop click | never closes |
| Close/Cancel button | closes and discards the draft |
| Escape | closes **if there are no unsaved edits**; otherwise opens a discard confirmation ("Discard changes?" with "Keep Editing" (secondary) and "Discard" (danger)) |
| Focus | moves to the first field (forms), to Cancel (confirmations) or to the close button (viewers); focus is trapped inside; it returns to the opener on close |

**Generic modal [EXTENSION]** (for content that isn't a form panel or a confirmation): width 560px (or 720px), max-height `calc(100% - 48px)`; radius 20px; bg `surface-card`; 1px `border-subtle`; `shadow-dialog`. Header: padding 20px 24px, `dialog-title` + close icon button (sunken variant), 1px `border-subtle` bottom. Body: padding 24px, scrolls. Footer: padding 20px 24px, 1px `border-strong` top, actions right-aligned with a 12px gap.

### 5.45 Confirmation dialog

| Element | Spec |
|---|---|
| Container | width `min(440px, 100% − 32px)` (maximum); height content-driven, max `100% − 48px` with the message area scrolling; padding 24px; `flex-direction: column; gap: 24px`; radius 20px; 1px `border-subtle`; bg `surface-card`; `shadow-dialog` |
| Text | title `dialog-title` ("Delete Jane Cooper?") + 8px + message `body-muted` (states the consequence and "This can't be undone.") |
| Actions | `justify-content: flex-end; gap: 12px`; secondary "Cancel" (**autofocused**, so Enter can't delete by accident) + danger "<Verb> <Noun>" ("Delete User") |
| Semantics | `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby` (title) and `aria-describedby` (message) |
| Use | destructive actions that can't be undone. For undoable actions, acting immediately plus a toast with "Undo" is an acceptable alternative **[PRODUCT DECISION]**. Never confirm non-destructive actions |

```html
<div class="ds-overlay" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-d">
  <div class="ds-overlay__backdrop" aria-hidden="true"></div>
  <div class="ds-dialog">
    <div class="ds-dialog__text">
      <h2 id="dlg-t" class="ds-text-dialog-title">Delete Jane Cooper?</h2>
      <p id="dlg-d" class="ds-text-body-muted">Jane Cooper will lose access immediately. This can't be undone.</p>
    </div>
    <div class="ds-dialog__actions">
      <button class="ds-btn ds-btn--secondary" autofocus>Cancel</button>
      <button class="ds-btn ds-btn--danger">Delete User</button>
    </div>
  </div>
</div>
```
```css
.ds-overlay { position: absolute; inset: 0; z-index: var(--ds-z-overlay); display: flex; align-items: center; justify-content: center; }
.ds-overlay__backdrop { position: absolute; inset: 0; background: var(--ds-color-overlay-modal); backdrop-filter: blur(var(--ds-overlay-blur)); }
.ds-overlay--panel { justify-content: flex-end; align-items: stretch; }
.ds-overlay--panel .ds-overlay__backdrop { background: var(--ds-color-overlay-panel); }
.ds-dialog { position: relative; width: min(var(--ds-size-dialog), calc(100% - 32px)); max-height: calc(100% - 48px); overflow-y: auto; display: flex; flex-direction: column; gap: var(--ds-space-6);
  padding: var(--ds-space-6); border-radius: var(--ds-radius-card); border: 1px solid var(--ds-color-border-subtle);
  background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-dialog); }
.ds-dialog__text { display: flex; flex-direction: column; gap: var(--ds-space-2); }
.ds-dialog__actions { display: flex; justify-content: flex-end; gap: var(--ds-space-3); }
```

---

### 5.46 Slide panel (drawer)

**Purpose.** The **default** surface for creating or editing a record from a list, keeping the list in view. Other form containers (full page, modal, inline edit) are valid; see §6.10.

**Structure**

```
                      ┌──────────────────────────────────────┐  width 480/560/680/820 · full height
                      │ HEADER  bg #15191c · px24 · py20      │  1px border-subtle bottom
   backdrop           │ [←36] [icon24–40] Title (dialog-title)  [×36]
   black/40 + blur    │ (optional subheader e.g. stepper, 48px below the title row)
                      ├──────────────────────────────────────┤
                      │ BODY  bg #161a20 · p24 · scrolls      │
                      │   form grid                           │
                      ├──────────────────────────────────────┤
                      │ FOOTER bg #15191c · px24 · py20       │  1px border-strong top
                      │ [← Back]                 [Save  ›]   │
                      └──────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Panel | `position: relative; height: 100%; display: flex; flex-direction: column`; bg `surface-overlay`; 1px `border-subtle` left; `shadow-drawer` |
| Width | 480px (default, simple), **560px** (single-column forms of ≤5 fields), **680px** (forms mixing 2-column rows and full-width rows), **820px** (two-column forms, wizards); always `max-width: 100%` |
| Header | `flex-shrink: 0`; padding 20px 24px (with a subheader: 28px top, 33px bottom, and `gap: 48px` between the title row and the subheader); bg `surface-overlay-chrome` #15191c; 1px `border-subtle` bottom; `shadow-header-scrolled` while the body is scrolled |
| Title row | `justify-content: space-between`; left group gap 12px: [back icon button 36px, only for a panel opened from another panel] + [title icon 24px (illustration up to 40px)] + `<h2>` `dialog-title` |
| Close | the §5.2 sunken close variant, `aria-label="Close panel"` |
| Body | `flex: 1; overflow-y: auto`; padding 24px |
| Footer | `flex-shrink: 0`; padding 20px 24px; 1px `border-strong` top; bg `surface-overlay-chrome` |
| Footer content | `justify-content: space-between`: secondary button "Back" or "Cancel" with a 20px leading back arrow (horizontal padding 21px); primary button with an optional `min-width: 180px`, label "Save" / "Create <Noun>" / "Save Changes" / "Next", and a trailing 14px right-chevron for "Next"-style steps |
| Stacking | a sub-panel opened from a panel (e.g. "Add new option") **replaces** the panel at the same position, shows a back arrow, and returns to the parent with its form state intact |

**Form layout inside the body.** A two-column grid: `grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 24px`. Full-width fields span both columns. Half-width standalone fields (status toggle, short selects) occupy one column. Use a 40px gap between field groups that form separate topics. Sequence: identity fields → classification selects → technical fields → notes/callout → status (always last).

```css
.ds-panel { position: relative; display: flex; flex-direction: column; height: 100%; max-width: 100%;
  background: var(--ds-color-surface-overlay); border-inline-start: 1px solid var(--ds-color-border-subtle); box-shadow: var(--ds-shadow-drawer); }
.ds-panel:dir(rtl) { box-shadow: var(--ds-shadow-drawer-mirrored); }
.ds-panel--sm { width: var(--ds-size-panel-sm); } .ds-panel--md { width: var(--ds-size-panel-md); }
.ds-panel--lg { width: var(--ds-size-panel-lg); } .ds-panel--xl { width: var(--ds-size-panel-xl); }
.ds-panel__header { position: relative; z-index: var(--ds-z-header); flex-shrink: 0; padding: var(--ds-space-5) var(--ds-space-6); display: flex; flex-direction: column; gap: var(--ds-space-12);
  background: var(--ds-color-surface-overlay-chrome); border-bottom: 1px solid var(--ds-color-border-subtle); transition: box-shadow var(--ds-duration-base); }
.ds-panel__header--scrolled { box-shadow: var(--ds-shadow-header-scrolled); }
.ds-panel__titlerow { display: flex; align-items: center; justify-content: space-between; }
.ds-panel__titlegroup { display: flex; align-items: center; gap: var(--ds-space-3); min-width: 0; }
.ds-panel__body { flex: 1; overflow-y: auto; padding: var(--ds-space-6); }
.ds-panel__footer { flex-shrink: 0; padding: var(--ds-space-5) var(--ds-space-6); border-top: 1px solid var(--ds-color-border-strong); background: var(--ds-color-surface-overlay-chrome);
  display: flex; align-items: center; justify-content: space-between; }
.ds-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--ds-space-form-col); row-gap: var(--ds-space-form-row); }
.ds-form-grid > .ds-span-2 { grid-column: span 2; }
```

### 5.47 Popover [EXTENSION from the date popover]

A floating panel holding a small form or detail: bg `surface-card`; radius 10px (`radius-control`, R-51); `shadow-menu`; padding 16px; content gap 16px; width 280–360px; 4px from its trigger; `role="dialog"` + `aria-label`; closes on outside click or Escape. Footer: as §5.4 popover footer.

### 5.48 Toast

| Property | Value |
|---|---|
| Position | `position: absolute; top: 24px; left: 50%; transform: translateX(-50%)` inside the main panel; z-index 60 |
| Surface | padding 10px 16px; radius 8px; bg `surface-card`; 1px `border-subtle`; `shadow-elevated`; max width `min(480px, 100% − 32px)` |
| Text | `toast` 14/20 `text-primary`, one sentence, no period required ("Jane Cooper added", "Login details copied") |
| Semantics | `role="status"` (polite) |
| Lifetime | auto-dismisses after 2500ms; the timer pauses while the toast is hovered or holds focus; a new toast replaces the current one (one at a time). **A toast with an action (e.g. Undo) never auto-dismisses** (SC 2.2.1): it stays until the user acts, closes it or a newer toast replaces it (§5.55) |
| Error toast [EXTENSION] | a 16px alert icon in `error-text` before the text, gap 8px, and the lifetime extends to 5000ms; use it for failed background actions (e.g. "Couldn't copy: clipboard access blocked") |

### 5.49 Tooltips [STANDARDIZED, R-40]

The native `title` attribute is **not** an accessible tooltip: it never appears on keyboard focus or touch, and can't be styled. It MAY be kept as a supplementary hint, but it MUST NOT be the only way to read information.

**Label tooltip** (icon-only buttons, collapsed nav items, truncated text inside focusable elements):

| Property | Value |
|---|---|
| Surface | bg `surface-tooltip` #151a1f; 1px `border-tooltip` #3a434b; radius 8px; `shadow-tooltip`; padding 6px 10px; max width 280px |
| Text | `small` 12/16, `text-tooltip` #f4f6f8 (16.2:1) |
| Placement | 8px from the anchor; default above, flipping to below/left/right to stay in view; z-index 30 |
| Show | on pointer hover after 300ms, **and immediately on keyboard focus** |
| Persistence (SC 1.4.13) | stays visible while the pointer is over the anchor **or the tooltip itself** |
| Dismiss | on Escape (without moving focus), on blur, or 100ms after the pointer leaves both |
| Semantics | `role="tooltip"`, with an `id`. The anchor references it with `aria-describedby` (supplementary text) or, for icon-only buttons, it duplicates the `aria-label` (no `aria-describedby` needed) |
| Touch | not used for essential information. On touch devices, essential content must be visible or reachable via a tap that opens a popover |

**Rich chart tooltip:** see §7.9. It follows the same show/persist/dismiss rules, and every chart mark that has one is focusable.

**Never put** interactive content (links, buttons) inside a tooltip; use a popover (§5.47).

### 5.50 Loading states

| Context | Pattern |
|---|---|
| Button action | the §5.1 loading state (spinner, disabled) |
| Background processing in a field | the field placeholder becomes "Scanning…" / "Loading…"; the field stays enabled |
| Table / card initial load [EXTENSION] | skeleton rows: same row height (44px), 1–3 bars per cell, 12px tall, radius 6px, bg `rgba(255,255,255,0.06)`, pulse animation opacity 0.5 → 1 → 0.5 over 1.5s; the header renders normally |
| KPI load [EXTENSION] | keep the card frame and icon; the value becomes a 72×20px skeleton bar |
| Chart load [EXTENSION] | keep the card header; the plot area shows a centered 16px spinner in `text-muted` at the chart's fixed height |
| Full page [EXTENSION] | never blank the shell; render the header and skeleton sections |

```css
.ds-skeleton { background: var(--ds-color-skeleton); border-radius: var(--ds-radius-chip); animation: ds-pulse 1.5s ease-in-out infinite; }
@keyframes ds-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
```

### 5.51 Empty states

| Context | Pattern |
|---|---|
| Tokens | message `body-muted` (`text-muted` #94a3b8, 14/20); first-use title `card-title`; padding `space-12` (48px) / `space-16` (64px) vertical; icon tile per §2.11-D |
| Table with no rows | the table empty row (§5.41): one sentence stating why ("No users match your filters.", "No items in this group yet.") |
| Grouped page with no groups | `body-muted`, centered, padding 48px 0, in place of the groups |
| Chart with no data | `body-muted`, centered, at the chart's height (or 64px vertical padding): "No data in this range." |
| Menu search with no results | "No matches" row |
| First-use empty page [EXTENSION] | inside the table card: padding 64px 24px; centered column, gap 12px: 40px illustration or icon tile → `card-title` ("No projects yet") → `body-muted` single sentence → primary button ("Add Project") |

### 5.52 Component contract matrix

The sections above give anatomy, tokens, variants and states. This matrix completes every component's contract with the remaining dimensions: **sizing type** (§2.8), **overflow**, **responsive behavior** (breakpoints per §8.1) and **accessibility essentials**. It also says where the implementation blueprint lives. Where a section and this matrix differ, the section's spec table wins. Report the mismatch.

Abbreviations: **Min** = minimum dimension that grows; **Max** = maximum that shrinks; **Content** = content-driven; **Fixed** = never changes. "≤sm" means at the `sm` and `xs` breakpoints.

| § | Component | Sizing | Overflow | Responsive | Accessibility essentials | Blueprint |
|---|---|---|---|---|---|---|
| 5.1 | Button | Min height 40/28/48; Content width; optional min-width 180 | Label never truncates; wraps to 2 lines when constrained | ≤sm: footer and dialog buttons stretch to full width and stack (primary first); header primary becomes a 36px icon button | `<button>`; verb-first label; `aria-disabled` + reason; `aria-busy` when loading | §5.1 |
| 5.2 | Icon button | Fixed 36/28 | — | ≤sm: hit area ≥ 44px (§8.8) | `aria-label`; tooltip on hover and focus | §5.2 |
| 5.3 | Link action | Content | Wraps | — | `<button>` for actions, `<a>` for navigation; visible text | §5.3 |
| 5.4 | Action group | Content; gaps per table | Wraps (`flex-wrap`) | ≤sm: header actions collapse per §8.3; footers stack | Order matches visual order; one primary per group | §5.4 + §5.52 B |
| 5.5 | Text input | Min height 40; width 100% of the field | Text scrolls horizontally inside the field (native) | Full width at every breakpoint | `<label for>`; `aria-invalid` + `aria-describedby`; `autocomplete` where applicable | §5.5 |
| 5.6 | Search input | Min height 40; Max width 366 in headers | Native | ≤md: grows to fill the header row | `type="search"`; label or `aria-label`; results count announced (`role="status"`) | §5.6 |
| 5.7 | Textarea | Min height 80; height content-driven | Vertical scroll; `resize: vertical` | Full width | As text input | §5.7 |
| 5.8 | Form field | Content | Label and message wrap; never truncate | Two-column grid collapses to one at ≤sm | Label, required marker, errors linked | §5.8 |
| 5.9 | Select | Min height 40; Content width (defaults 160/180/200) | Trigger value truncates (the full value is in the menu and accessible name) | ≤sm: filters move into the Filters sheet (§8.3) | Listbox pattern (§5.10); `aria-expanded`, `aria-controls` | §5.9 |
| 5.10 | Dropdown menu | Max height 260; width ≥ trigger | Options **wrap** (no truncation); the list scrolls | ≤xs: MAY render as a bottom sheet with 48px options | Active descendant, keyboard table | §5.10 |
| 5.11 | Multi-select | As select | Trigger shows "3 selected" when the joined labels exceed the width (the full list is in the menu); never a clipped half-word | As select | `aria-multiselectable`; checkbox state per option | §5.9 + §5.10 + §5.52 B |
| 5.12 | Checkbox | Fixed 16px box; row Min 20 | Label wraps | ≤sm: 44px hit area via label padding | Native `<input type="checkbox">`; label `for` | §5.12 |
| 5.13 | Radio cards | Min height 40; equal widths | Label wraps (the card grows) | ≥ 3 options at ≤sm: stack vertically | `radiogroup` / `radio`, roving tabindex | §5.52 B |
| 5.14 | Binary toggle | Min height 40; half the form width | Labels wrap | Full width at ≤sm | `radiogroup`, arrow keys, selected ring | §5.14 |
| 5.15 | Switch | Fixed 36×20 track | Label wraps | 44px hit area at ≤sm | `role="switch"`, `aria-checked`, visible label | §5.52 B |
| 5.16 | Date range | Trigger Min 40; popover Max 360 | Trigger value truncates (the full range is in the accessible name) | ≤sm: the popover becomes full width under the trigger | Popover `role="dialog"`; native date inputs; error `role="alert"` | §5.52 B |
| 5.17 | File upload | Content; padding 24 | Hint wraps; file names wrap with `overflow-wrap: anywhere` | Full width | `role="button"` + keyboard; the hidden input is labelled; errors announced | §5.52 B |
| 5.18 | Field with attach | Min height 40 | Field text scrolls; the error wraps | ≤xs: the attach button moves below the field at full width | The button names its action ("Upload photo for Primary code") | §5.52 B |
| 5.19 | Rich picker | Trigger Min 40 (64 with value); list Max 280 | Name and email truncate with recovery (full text in the accessible name; email wraps in the selected trigger) | ≤xs: bottom sheet | Listbox with rich options: each option's accessible name = "Name, role, email" | §5.10 + §5.52 B |
| 5.20 | Inline callout | Content | Wraps | Full width | Plain text; no role (static) | §5.52 B |
| 5.21 | Inline alert | Content | Wraps | Full width | `role="alert"` (error) / `role="status"`; dismiss button labelled | §5.52 B |
| 5.22 | Stepper | Content | Titles wrap under indices | ≤sm: show only the indices + the current step's title ("Step 1 of 3 · Basics") | `<ol>`; `aria-current="step"`; completed steps say "completed" in their accessible name | §5.52 B |
| 5.23 | KPI card | Min height 76; Content width in the row | Label and value **wrap**; never truncate (R-53) | Grid per §8.4 | Text order label → value; the illustration is decorative; clickable cards are `<button>` with `aria-pressed` | §5.23 |
| 5.24 | Entity card | Content; grid min 320 | Title wraps (2 lines); metric labels wrap | Grid per §8.4 | Whole card = one link/button with a meaningful accessible name; no nested interactive elements | §5.24 |
| 5.25 | Dashboard card | Content; header Min 40 | Title wraps; chart areas have fixed plot heights | Rows stack at ≤md | `<section aria-labelledby>`; chart `role="img"` + summary | §5.25 |
| 5.26 | Status card | Content; table capped at 266 | Table region scrolls | Stack at ≤md | Bar `role="img"` with counts; table per §5.41 | §5.25 + §5.34 + §5.41 |
| 5.27 | Badge | Content; Min 30/22 | **Never truncates**; keep labels short (≤ 2 words) | — | Text conveys the state | §5.27 |
| 5.28 | Status dot | Fixed 10/8 | — (its label wraps) | — | Paired label, or `role="img"` + `aria-label` + legend | §5.28 |
| 5.29 | Tag | Content | No truncation; long category names wrap inside the tag (`white-space: normal`) only in wide-text contexts, otherwise shorten the name | — | Text conveys the category | §5.29 |
| 5.30 | Count pill | Content | — | — | Include the noun in the accessible name when the title doesn't ("12 items") | §5.30 |
| 5.31 | Info chip | Content | No truncation | — | Static text | §5.52 B |
| 5.32 | Avatar | Fixed 32/36/40 | Initials max 2 characters | — | Decorative when the name is adjacent (`alt=""`); otherwise `alt` = name | §5.52 B |
| 5.33 | Metric indicator | Content | Label wraps | Columns wrap to 2 per row at ≤xs | Accessible text "8 of 12" (use an `aria-label` on the value pair) | §5.52 B |
| 5.34 | Progress / status bar | Track height Fixed 20 (8 for progress); width 100% | Segment numbers hide below the 28px minimum (the total stays in the accessible name) | Full width | `role="img"` / `progressbar` with values | §5.52 B |
| 5.35 | Summary strip | Content; padding 12/16 | Title clamps to 2 lines with recovery; field values wrap | ≤md: fields wrap into a grid of 2–3 columns under the title; the divider becomes horizontal | Field label/value pairs as `<dl>`; status = dot + text | §5.52 B |
| 5.36 | Media card / viewer | Content; media fills the remaining height; viewer Max 900 × 90vh | Title wraps; footer text wraps | Grid per §8.4; the viewer is full screen at ≤sm | The card is one button; the image has `alt`; the viewer follows §5.44 | §5.52 B |
| 5.37 | Sidebar | Fixed 76 rail / 256 expanded | Labels: one line, truncated with a §5.49 tooltip in both states (wrapping during the width animation would make rows jump) | ≤sm: top bar + drawer (§8.2) | `<nav aria-label>`; `aria-current`; expands on focus | §5.37 |
| 5.38 | Page header | Min height 76 | Title wraps (max 2 lines), then actions wrap | §8.3 | One `<h1>`; back button labelled with its destination | §6.1 |
| 5.39 | Segmented tabs | Min height 50/40; tabs equal-width (accent) or content-width (raised) | Labels wrap within the tab; with too many tabs for the width, the track scrolls horizontally with edge fades | ≤xs: the accent variant becomes a raised filter select with the same options | Tablist pattern; `aria-controls` | §5.52 B |
| 5.40 | Pagination | Buttons Min 32 | — | ≤xs: "Page 2 of 5" + prev/next only | `<nav aria-label="Pagination">`; `aria-current="page"` | §5.40 |
| 5.41 | Data table | Rows Min 44; columns content-driven | Region scrolls; truncation only with recovery | Sticky first column ≤md; stacked rows ≤xs (§8.5) | Semantic table; sort, selection and actions per §5.41 | §5.41 |
| 5.42 | Table card + section header | Content; header padding 16 | Title wraps | Header actions wrap below the title at ≤sm | `aria-labelledby` from the table region to the title | §5.52 B |
| 5.43 | Collapsible section | Header Min 60 | Title wraps | Action button moves under the title at ≤xs | `<button aria-expanded aria-controls>`; heading level around the button | §5.52 B |
| 5.44 | Overlay / modal | Max 560 / 720 wide; Max height `100% − 48px` | The body scrolls; header and footer stay | Full screen at ≤sm | `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, R-21 | §5.45 |
| 5.45 | Confirmation dialog | Max 440 | Message wraps | Buttons stack full width at ≤xs | Cancel autofocused; `alertdialog` role for destructive confirmations | §5.45 |
| 5.46 | Slide panel | Max 480/560/680/820; full height | The body scrolls | Full screen at ≤sm (§8.6) | As overlay; the title is the `aria-labelledby` target | §5.46 |
| 5.47 | Popover | Max 280–360 | Content wraps | Full width at ≤xs | `role="dialog"`, labelled, Escape closes, focus returns | §5.52 B (date popover) |
| 5.48 | Toast | Content; Max 480 | Wraps (no truncation) | ≤xs: full width minus 16px gutters, bottom-anchored | `role="status"`; never the only record of an error the user must act on | §5.52 B |
| 5.49 | Tooltip | Max 280 | Wraps | Touch: see §5.49 | `role="tooltip"`; 1.4.13 rules | §5.49 |
| 5.50 | Loading | Matches the replaced content | — | — | `aria-busy`; announce completion | §5.50 |
| 5.51 | Empty state | Content | Wraps | Centered at all sizes | Plain text; a primary action if one exists | §5.51 |
| 7.x | Charts | Plot heights Fixed (300 bars, 180 donut); widths content | Axis labels thin out or clamp | Cards stack ≤md; donut legend moves below | §7.1 accessibility, focusable marks, tooltips | §7 |

### 5.53 Supplementary blueprints (B)

Minimal, framework-neutral structures for components whose sections define anatomy but had no code. They use only §3 tokens; behavior scripting follows the cited sections.

**Radio cards (§5.13)**
```html
<div class="ds-radio-group" role="radiogroup" aria-labelledby="prio-label">
  <button type="button" class="ds-radio-card" role="radio" aria-checked="true" tabindex="0"><svg width="20" height="20" aria-hidden="true"></svg>High</button>
  <button type="button" class="ds-radio-card" role="radio" aria-checked="false" tabindex="-1"><svg width="20" height="20" aria-hidden="true"></svg>Medium</button>
</div>
```
```css
.ds-radio-group { display: flex; flex-wrap: wrap; gap: var(--ds-space-3); }
.ds-radio-card { flex: 1 1 0; min-width: 0; min-height: var(--ds-size-control); display: flex; align-items: center; gap: var(--ds-space-2);
  padding: var(--ds-space-2) var(--ds-space-4); border-radius: var(--ds-radius-sm); border: 1px solid var(--ds-color-border-radio);
  background: var(--ds-color-surface-card); color: var(--ds-color-text-muted); font-size: 14px; line-height: 20px; text-align: start;
  transition: border-color var(--ds-duration-fast); }
.ds-radio-card:hover { border-color: var(--ds-color-border-control-hover); }
.ds-radio-card[aria-checked="true"] { background: var(--ds-color-surface-radio-selected); border-color: var(--ds-color-brand-strong); color: var(--ds-color-text-primary); }
.ds-radio-card:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
[aria-disabled="true"] > .ds-radio-card { opacity: 0.4; cursor: not-allowed; }
```

**Segmented tabs (§5.39)**
```html
<div class="ds-tabs" role="tablist" aria-label="Filter by status">
  <button type="button" class="ds-tab" role="tab" aria-selected="true" aria-controls="p-all" id="t-all"><span class="ds-tab__label" data-label="All">All</span> <span class="ds-tab__count">(248)</span></button>
  <button type="button" class="ds-tab" role="tab" aria-selected="false" aria-controls="p-open" id="t-open" tabindex="-1"><span class="ds-tab__label" data-label="Open">Open</span> <span class="ds-tab__count">(31)</span></button>
</div>
```
```css
.ds-tabs { display: inline-flex; max-width: 100%; overflow-x: auto; padding: 5px; border-radius: var(--ds-radius-track);
  background: var(--ds-color-surface-sunken-deep); box-shadow: var(--ds-shadow-sunken-track); }
.ds-tab { display: flex; align-items: center; justify-content: center; gap: var(--ds-space-1); min-height: var(--ds-size-control);
  padding: var(--ds-space-2-5) var(--ds-space-5); border-radius: var(--ds-radius-sm); font-size: 14px; line-height: 20px; color: var(--ds-color-text-muted);
  transition: background-color var(--ds-duration-fast), color var(--ds-duration-fast); }
.ds-tab:hover { background: var(--ds-color-surface-hover-subtle); }
.ds-tab[aria-selected="true"] { background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); color: var(--ds-color-text-primary); font-weight: 600; }
/* Reserve the semibold width so selecting a tab never shifts its neighbours */
.ds-tab__label { display: inline-grid; }
.ds-tab__label::after { content: attr(data-label); font-weight: 600; height: 0; overflow: hidden; visibility: hidden; }
.ds-tab:focus-visible { outline-offset: var(--ds-focus-offset-tight); }
.ds-tab__count { font-size: 12px; line-height: 16px; color: var(--ds-color-text-tertiary); }
.ds-tab[aria-selected="true"] .ds-tab__count { color: var(--ds-color-text-muted); }
/* Accent variant */
.ds-tabs--accent { display: flex; padding: 5px; background: var(--ds-color-surface-sunken-alt); border: 1px solid var(--ds-color-border-track); }
.ds-tabs--accent .ds-tab { flex: 1 1 0; min-height: calc(var(--ds-size-control) - 12px); padding: 0 var(--ds-space-3); font-weight: 600; letter-spacing: var(--ds-tracking-tight); }
.ds-tabs--accent .ds-tab[aria-selected="true"] { background: var(--ds-color-brand-strong); box-shadow: none; color: var(--ds-color-text-on-brand); }
```
The accent track's outer minimum height is `size-control` (40px): 28px tab + 2 × 5px padding + 2 × 1px border.

**Switch [EXTENSION] (§5.15)**
```html
<button type="button" class="ds-switch" role="switch" aria-checked="false" aria-labelledby="sw-l"><span class="ds-switch__thumb" aria-hidden="true"></span></button>
<span id="sw-l" class="ds-text-body">Email notifications</span>
```
```css
.ds-switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; border-radius: var(--ds-radius-full);
  background: var(--ds-color-surface-sunken); box-shadow: var(--ds-shadow-sunken-track); transition: background-color var(--ds-duration-fast); }
.ds-switch[aria-checked="true"] { background: var(--ds-color-brand-strong); }
.ds-switch__thumb { position: absolute; top: 2px; inset-inline-start: 2px; width: 16px; height: 16px; border-radius: var(--ds-radius-full);
  background: var(--ds-color-text-muted); transition: transform var(--ds-duration-fast) var(--ds-ease-standard); }
.ds-switch[aria-checked="true"] .ds-switch__thumb { transform: translateX(16px); background: var(--ds-color-text-primary); box-shadow: var(--ds-shadow-lift); }
.ds-switch:dir(rtl)[aria-checked="true"] .ds-switch__thumb { transform: translateX(-16px); }
```

**Date range trigger + popover (§5.16)**: the trigger reuses `.ds-select__trigger--filter` with a calendar icon in place of the chevron and `aria-haspopup="dialog"`.
```html
<div class="ds-popover" role="dialog" aria-label="Choose date range">
  <div class="ds-form-grid"><!-- two .ds-field with <input type="date" class="ds-input"> --></div>
  <p class="ds-field__error" role="alert" hidden>“From” must be on or before “To”.</p>
  <div class="ds-popover__footer"><button class="ds-btn ds-btn--ghost ds-btn--sm">Clear</button><button class="ds-btn ds-btn--primary ds-btn--sm">Apply</button></div>
</div>
```
```css
.ds-popover { position: absolute; z-index: var(--ds-z-menu); top: 100%; inset-inline-end: 0; margin-top: var(--ds-space-1); width: min(var(--ds-size-popover-date), calc(100vw - 32px));
  display: flex; flex-direction: column; gap: var(--ds-space-4); padding: var(--ds-space-4);
  border-radius: var(--ds-radius-control); background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-menu); }
.ds-popover .ds-form-grid { column-gap: var(--ds-space-3); }
.ds-popover__footer { display: flex; justify-content: space-between; gap: var(--ds-space-3); }
```

**File upload (§5.17)**
```html
<div class="ds-dropzone" role="button" tabindex="0" aria-describedby="dz-hint">
  <svg width="32" height="32" aria-hidden="true"></svg>
  <p class="ds-dropzone__title">Upload reference image</p>
  <p class="ds-dropzone__hint" id="dz-hint">Drag and drop, or click to browse · JPG, PNG (max 5 MB)</p>
  <input type="file" class="ds-sr-only" tabindex="-1" aria-hidden="true">
</div>
```
```css
.ds-dropzone { display: flex; flex-direction: column; align-items: center; gap: var(--ds-space-2); padding: var(--ds-space-6); text-align: center; cursor: pointer;
  border: 1px dashed var(--ds-color-border-input); border-radius: var(--ds-radius-control); background: var(--ds-color-surface-card);
  transition: border-color var(--ds-duration-fast); overflow-wrap: anywhere; }
.ds-dropzone:hover, .ds-dropzone.is-dragover { border-color: var(--ds-color-brand); }
.ds-dropzone[aria-invalid="true"] { border-color: var(--ds-color-error); }
.ds-dropzone__title { font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-secondary); }
.ds-dropzone__hint { font-size: 12px; line-height: 16px; color: var(--ds-color-text-muted); }
```
(The hint uses `text-muted`, because it sits on the card surface where `text-placeholder` is not permitted.)

**Field with attach button (§5.18)**
```html
<div class="ds-attach">
  <div class="ds-attach__field"><input class="ds-attach__input" id="code" placeholder="Type the code or upload a photo"></div>
  <button type="button" class="ds-attach__btn" aria-label="Upload photo for code"><svg width="18" height="18" aria-hidden="true"></svg>Upload</button>
</div>
```
```css
.ds-attach { display: flex; flex-wrap: wrap; gap: var(--ds-space-3); }
.ds-attach__field { flex: 1 1 240px; min-width: 0; min-height: var(--ds-size-control); display: flex; align-items: center; gap: var(--ds-space-2-5);
  padding: 0 var(--ds-space-4); border-radius: var(--ds-radius-control); background: var(--ds-color-surface-sunken); box-shadow: var(--ds-shadow-sunken); }
.ds-attach__field:has([aria-invalid="true"]) { box-shadow: var(--ds-error-ring), var(--ds-shadow-sunken); }
.ds-attach__field:focus-within { outline: var(--ds-focus-width) solid var(--ds-color-focus-ring); outline-offset: var(--ds-focus-offset-tight); }
.ds-attach__input { flex: 1; min-width: 0; background: transparent; border: 0; font-size: 14px; line-height: 20px; color: var(--ds-color-text-primary); }
.ds-attach__input:focus-visible { outline: none; }  /* the wrapper above draws the ring (replacement, §2.7) */
.ds-attach__input::placeholder { color: var(--ds-color-text-placeholder); }
.ds-attach__btn { min-height: var(--ds-size-control); display: inline-flex; align-items: center; gap: var(--ds-space-1-5); padding: 0 var(--ds-space-3-5);
  border-radius: var(--ds-radius-control); border: 1px solid var(--ds-color-border-strong); background: var(--ds-color-surface-attach);
  box-shadow: var(--ds-shadow-highlight), var(--ds-shadow-lift); font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-secondary); }
```

**Inline callout & alert (§5.20, §5.21)**
```html
<div class="ds-callout"><p class="ds-callout__title">Pulse configuration</p><p class="ds-callout__body">Length controls the output window; duration controls the full cycle.</p></div>
<div class="ds-callout ds-callout--error" role="alert"><svg width="16" height="16" aria-hidden="true"></svg><div><p class="ds-callout__title">Couldn't save</p><p class="ds-callout__body">Check your connection and try again.</p></div></div>
```
```css
.ds-callout { display: flex; flex-direction: column; gap: var(--ds-space-1); padding: var(--ds-space-3-5); border-radius: var(--ds-radius-sm);
  background: var(--ds-color-surface-callout); border: 1px solid var(--ds-color-border-callout); }
.ds-callout--error, .ds-callout--success, .ds-callout--warning, .ds-callout--info { flex-direction: row; align-items: flex-start; gap: var(--ds-space-2); padding: var(--ds-space-3) var(--ds-space-3-5); }
.ds-callout--error { background: var(--ds-color-error-bg); border-color: var(--ds-color-error-border); color: var(--ds-color-error-text); }
.ds-callout--success { background: var(--ds-color-success-bg); border-color: var(--ds-color-success-border); color: var(--ds-color-success-text); }
.ds-callout--warning { background: var(--ds-color-warning-bg); border-color: var(--ds-color-warning-border); color: var(--ds-color-warning-text); }
.ds-callout--info { background: var(--ds-color-info-bg); border-color: var(--ds-color-info-border); color: var(--ds-color-info-text); }
.ds-callout__title { font-size: 12px; line-height: 16px; font-weight: 600; color: inherit; }
.ds-callout:not([class*="--"]) .ds-callout__title { color: var(--ds-color-text-secondary); }
.ds-callout__body { font-size: 12px; line-height: 1.45; color: var(--ds-color-text-secondary); }
.ds-callout:not([class*="--"]) .ds-callout__body { color: var(--ds-color-text-muted); }
```

**Stepper (§5.22)**
```html
<ol class="ds-stepper">
  <li class="ds-step" aria-current="step"><span class="ds-step__index">1</span><span class="ds-step__text"><span class="ds-step__title">Basics</span><span class="ds-step__sub">In progress</span></span></li>
  <li class="ds-step"><span class="ds-step__index">2</span><span class="ds-step__text"><span class="ds-step__title">Team</span><span class="ds-step__sub">Members &amp; roles</span></span></li>
</ol>
```
```css
.ds-stepper { display: flex; align-items: center; gap: var(--ds-space-4); }
.ds-step { display: flex; align-items: center; gap: var(--ds-space-3); flex: 1; min-width: 0; }
.ds-step:not(:last-child)::after { content: ""; flex: 1; height: 2px; min-width: var(--ds-space-4); background: var(--ds-color-stepper-track); }
.ds-step[aria-current="step"]:not(:last-child)::after { background: var(--ds-gradient-stepper-active); }
.ds-step__index { flex-shrink: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--ds-radius-sm);
  background: var(--ds-color-surface-sunken-button); border: 1px solid var(--ds-color-border-strong); box-shadow: var(--ds-shadow-stepper-idle);
  font-size: 12px; line-height: 16px; font-weight: 500; color: var(--ds-color-text-muted); }
.ds-step[aria-current="step"] .ds-step__index { background: var(--ds-color-brand-strong); border-color: var(--ds-color-stepper-active-border); color: var(--ds-color-text-on-brand); font-weight: 600;
  box-shadow: var(--ds-shadow-stepper-active); }
.ds-step__text { display: flex; flex-direction: column; min-width: 0; font-size: 12px; line-height: 16px; }
.ds-step__title { font-weight: 500; color: var(--ds-color-text-muted); }
.ds-step__sub { color: var(--ds-color-text-tertiary); }
.ds-step[aria-current="step"] .ds-step__title { font-weight: 700; letter-spacing: 0.3px; color: var(--ds-color-text-primary); }
.ds-step[aria-current="step"] .ds-step__sub { font-weight: 500; color: var(--ds-color-link); }
```

**Collapsible section + table card header (§5.42, §5.43)**
```html
<section class="ds-section-card">
  <h2 class="ds-section-card__heading">
    <button type="button" class="ds-section-card__toggle" aria-expanded="true" aria-controls="grp-1">
      <span class="ds-text-group-title">North Region</span><span class="ds-count">12</span><svg width="32" height="32" aria-hidden="true"></svg>
    </button>
  </h2>
  <div id="grp-1"><!-- table region --></div>
</section>
```
```css
.ds-section-card { border-radius: var(--ds-radius-card); overflow: clip; background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); }
.ds-section-card--nested { border-radius: var(--ds-radius-nested); }
.ds-section-card__heading { display: flex; align-items: center; gap: var(--ds-space-4); min-height: var(--ds-size-section-header); padding: var(--ds-space-2) var(--ds-space-4); }
.ds-section-card__heading:has(+ [id]:not([hidden])) { border-bottom: 1px solid var(--ds-color-border-faint); }
.ds-section-card__toggle { flex: 1; min-width: 0; display: flex; align-items: center; gap: var(--ds-space-3-5); text-align: start; border-radius: var(--ds-radius-sm); }
.ds-section-card__toggle svg { margin-inline-start: var(--ds-space-3); flex-shrink: 0; color: var(--ds-color-icon-chevron); transition: transform var(--ds-duration-fast); }
.ds-section-card__toggle[aria-expanded="true"] svg { transform: scaleY(-1); }
.ds-table-card__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--ds-space-3);
  padding: var(--ds-space-4); border-bottom: 1px solid var(--ds-color-border-faint); }
```

**Summary strip (§5.35)**
```html
<section class="ds-strip" aria-labelledby="strip-title">
  <div class="ds-strip__lead"><p class="ds-strip__eyebrow"><span class="ds-dot ds-dot--sm" aria-hidden="true"></span>Context label</p>
    <h2 class="ds-strip__title ds-clamp-2" id="strip-title" tabindex="0">Record title that may run to two lines</h2></div>
  <span class="ds-strip__divider" aria-hidden="true"></span>
  <dl class="ds-strip__fields"><div><dt>Primary code</dt><dd>8901030875397</dd></div><div><dt>Device</dt><dd><span class="ds-status"><span class="ds-dot ds-dot--sm ds-dot--success" aria-hidden="true"></span>Online</span></dd></div></dl>
</section>
```
```css
.ds-strip { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ds-space-5); padding: var(--ds-space-3) var(--ds-space-4);
  border-radius: var(--ds-radius-card); background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-card); }
.ds-strip__lead { display: flex; flex-direction: column; gap: var(--ds-space-1-5); flex: 1 1 180px; min-width: 180px; }
.ds-strip__eyebrow { display: flex; align-items: center; gap: var(--ds-space-2); font-size: 14px; line-height: 20px; letter-spacing: var(--ds-tracking-identifier); color: var(--ds-color-brand-text); }
.ds-strip__eyebrow .ds-dot { background: var(--ds-color-brand); box-shadow: none; }
.ds-strip__title { font-size: var(--ds-font-size-subheading); line-height: var(--ds-line-height-subheading); font-weight: 700; letter-spacing: -0.3px; color: var(--ds-color-text-primary); }
.ds-strip__divider { align-self: stretch; width: 1px; background: var(--ds-color-border-vertical); }
.ds-strip__fields { display: flex; flex-wrap: wrap; gap: var(--ds-space-5); justify-content: space-between; flex: 999 1 480px; }
.ds-strip__fields dt { font-size: 14px; line-height: 20px; font-weight: 500; color: var(--ds-color-text-muted); }
.ds-strip__fields dd { margin-top: var(--ds-space-2); font-size: 16px; line-height: 24px; letter-spacing: var(--ds-tracking-identifier); color: var(--ds-color-text-primary); overflow-wrap: anywhere; }
```

**Media card (§5.36)**
```html
<button type="button" class="ds-media-card" aria-label="Loading dock feed, Source 2. Open full view.">
  <span class="ds-media-card__head"><span class="ds-icon-tile ds-icon-tile--sm" aria-hidden="true"></span><span><span class="ds-text-card-title">Loading dock feed</span><span class="ds-text-body-muted">Source 2</span></span></span>
  <span class="ds-media-card__media"><img src="frame.jpg" alt=""></span>
  <span class="ds-media-card__foot"><span class="ds-text-small">Detected: <em>ABC-123</em></span><span class="ds-badge ds-badge--success"><span class="ds-badge__dot" aria-hidden="true"></span>Matched</span></span>
</button>
```
```css
.ds-media-card { display: flex; flex-direction: column; min-height: 0; overflow: hidden; text-align: start; border-radius: var(--ds-radius-card);
  border: 1px solid var(--ds-color-border-media); background: var(--ds-color-surface-overlay); box-shadow: var(--ds-shadow-float), var(--ds-shadow-highlight);
  transition: border-color var(--ds-duration-fast); }
.ds-media-card:hover { border-color: var(--ds-color-brand-border-hover); }
.ds-media-card__head { display: flex; align-items: center; gap: var(--ds-space-3); padding: var(--ds-space-4); background: var(--ds-color-surface-card); }
.ds-media-card__head > span:last-child { display: flex; flex-direction: column; gap: var(--ds-space-1); min-width: 0; }
.ds-media-card__media { position: relative; flex: 1; min-height: 160px; background: var(--ds-color-surface-media); }
.ds-media-card__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.ds-media-card__foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--ds-space-3);
  padding: var(--ds-space-2-5) var(--ds-space-4); border-top: 1px solid var(--ds-color-border-subtle); background: var(--ds-color-surface-card-footer); }
.ds-icon-tile--sm { width: 28px; height: 28px; border-radius: var(--ds-radius-sm); }
```

**Avatar, info chip, metric indicator (§5.31–5.33)**
```html
<span class="ds-avatar" aria-hidden="true">JC</span>
<span class="ds-chip">EMP-2041</span>
<div class="ds-metric"><span class="ds-text-metric-label">Active</span><span class="ds-metric__value" aria-label="8 of 12"><b>8</b><span>/12</span></span></div>
```
```css
.ds-avatar { width: 40px; height: 40px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--ds-radius-full);
  background: var(--ds-gradient-brand-avatar); border: 1px solid var(--ds-color-brand-avatar-border); font-size: 12px; line-height: 16px; font-weight: 700; color: var(--ds-color-text-primary); }
.ds-avatar--neutral { width: 36px; height: 36px; background: var(--ds-color-surface-avatar); border-color: var(--ds-color-border-avatar); font-weight: 500; color: var(--ds-color-text-secondary); }
.ds-chip { display: inline-block; padding: 3px 9px; border-radius: var(--ds-radius-xs); background: var(--ds-color-brand-tint-10); border: 1px solid var(--ds-color-brand-tint-20);
  font-size: 10px; line-height: 15px; color: var(--ds-color-brand-text); white-space: nowrap; }
.ds-metric { display: flex; flex-direction: column; align-items: center; gap: var(--ds-space-1); text-align: center; }
.ds-metric__value { display: flex; align-items: baseline; gap: var(--ds-space-0-5); }
.ds-metric__value b { font-size: 16px; line-height: 24px; font-weight: 700; letter-spacing: var(--ds-tracking-number); color: var(--ds-color-text-primary); }
.ds-metric__value span { font-size: 12px; line-height: 24px; font-weight: 500; color: var(--ds-color-text-tertiary); }
```

**Progress & segmented status bar (§5.34)**
```html
<div class="ds-segbar" role="img" aria-label="18 running, 3 stopped">
  <span class="ds-segbar__seg" style="flex-grow:18; background: var(--ds-chart-running)">18</span>
  <span class="ds-segbar__seg" style="flex-grow:3; background: var(--ds-chart-stopped)">3</span>
</div>
<div class="ds-progress" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100" aria-label="Completion"><span style="width:64%"></span></div>
```
```css
.ds-segbar { display: flex; gap: var(--ds-space-0-5); height: 20px; border-radius: var(--ds-radius-chip); overflow: hidden; }
.ds-segbar__seg { flex-basis: 0; min-width: 28px; display: flex; align-items: center; justify-content: center; overflow: hidden;
  font-size: 12px; line-height: 1; font-weight: 600; color: var(--ds-color-text-on-bright); transition: flex-grow var(--ds-duration-chart); }
.ds-progress { height: 8px; border-radius: var(--ds-radius-chip); background: var(--ds-chart-track); overflow: hidden; }
.ds-progress > span { display: block; height: 100%; background: var(--ds-color-brand); border-radius: inherit; transition: width var(--ds-duration-chart); }
```
Empty segments are omitted from the DOM rather than kept at `min-width`. The 2px `gap` shows the card color between segments (R-45).

**Toast (§5.48)**
```html
<div class="ds-toast" role="status">Jane Cooper added</div>
```
```css
.ds-toast { position: absolute; z-index: var(--ds-z-toast); top: var(--ds-space-6); left: 50%; transform: translateX(-50%); max-width: min(480px, calc(100% - 32px));
  padding: var(--ds-space-2-5) var(--ds-space-4); border-radius: var(--ds-radius-sm); border: 1px solid var(--ds-color-border-subtle);
  background: var(--ds-color-surface-card); box-shadow: var(--ds-shadow-elevated); font-size: 14px; line-height: 20px; color: var(--ds-color-text-primary); }
```


### 5.54 Anatomy, variants & states index

This is a one-line contract summary per component. With §5.52 (sizing, overflow, responsive, accessibility) and the section itself (values), every component has all nine contract elements. **Static** means non-interactive: there are no hover, focus or disabled states to implement. "Universal" means the universal state matrix (top of §5) applies as written.

| § | Component | Anatomy | Variants | States |
|---|---|---|---|---|
| 5.1 | Button | [leading icon] · label · [trailing icon] | primary, secondary, tonal, ghost, danger × sm/md/lg | default, hover, focus, disabled (`disabled` / `aria-disabled`), loading |
| 5.2 | Icon button | icon in a square hit area | sm 28, md 36, sunken-close | default, hover, focus, disabled |
| 5.3 | Link action | [14px icon] · label | inline (text only), with leading icon | default, hover (`link-hover`), focus, disabled (opacity 0.4) |
| 5.4 | Action group | ordered controls + gap | header, card header, dialog, panel footer, row actions, popover footer, split button | inherits its members' states |
| 5.5 | Text input | field · [suffix unit or trailing icon button] | plain, with suffix, with trailing action, password | default, focus, error, disabled, read-only, autofill |
| 5.6 | Search input | leading search icon · field | header search, in-menu search | as text input |
| 5.7 | Textarea | multi-line field | default (3 rows), auto-grow (product choice) | as text input |
| 5.8 | Form field | label · [required *] · control · [helper] · [error] | required, optional, with helper, with error | error shown after the first submit; live after that |
| 5.9 | Select | trigger (value/placeholder · chevron) + menu | raised (toolbar filter), sunken (form field); with status dots | default, hover (raised), focus, open, error (sunken), disabled |
| 5.10 | Dropdown menu | [search band] · listbox · options · [empty row] · [action button] | single, multi (§5.11), command menu (`role="menu"`) | option: default, hover, active descendant, selected (check glyph), disabled option (opacity 0.4, skipped by arrows) |
| 5.11 | Multi-select | sunken trigger (joined labels or "N selected") + menu with checkbox options | with/without search, with action row | as select; options checked/unchecked |
| 5.12 | Checkbox | hidden native input · 16px box · label | default, indeterminate | unchecked, checked, indeterminate, focus, disabled |
| 5.13 | Radio cards | group label · cards (radio glyph · label) | horizontal (2–4), vertical list (5+) | unselected, hover, selected, focus, disabled group |
| 5.14 | Binary toggle | container · 2 options (dot · label) | status (with dots), generic two-choice (without dots) | unselected, hover, selected (ring), focus, disabled |
| 5.15 | Switch | track · thumb · visible label | default | off, on, focus, disabled |
| 5.16 | Date range | trigger (range text · calendar icon) + popover (From/To · error · Clear/Apply) | standalone, paired with a preset select | trigger as select; popover: valid, invalid (Apply disabled + message) |
| 5.17 | File upload | dropzone (icon · title · hint) + hidden file input | single file, multiple files (lists files below, product choice) | default, hover/drag-over, focus, error, uploading (`aria-busy`) |
| 5.18 | Field with attach | sunken field ([thumbnail + clear] · input) · attach button · [error] | empty, with attachment, processing | field: as text input; processing (placeholder "Scanning…"); error |
| 5.19 | Rich picker | sunken trigger (rich row or placeholder) + menu (rich rows · footer row or inline add form) + companion link | select-only, with inline add | as select; inline-add form valid/invalid |
| 5.20 | Inline callout | container · title · body | neutral (default) | static |
| 5.21 | Inline alert | container · status icon · [title] · body · [dismiss] | info, success, warning, error | static; dismiss button: universal |
| 5.22 | Stepper | ordered steps (index · title · subtitle) · connectors | current, upcoming, completed | static (non-interactive by default; if steps are clickable, each is a button with universal states) |
| 5.23 | KPI card | container · 40px icon · label · value · [status ball] | static, interactive (filter) | static; interactive: hover, focus, pressed (`aria-pressed`) |
| 5.24 | Entity card | container · header (icon · title · subtitle · badge) · person row · metric row | active, inactive (opacity 0.75) | hover, focus |
| 5.25 | Dashboard card | container · header (title · [subtitle] · [legend/controls]) · body | padded (charts), flush (tables/heatmaps) | static container; loading (§5.50), empty (§5.51) |
| 5.26 | Status card | flush card · header (title · dot legend) · segmented bar · capped table | — | inherits table states; loading, empty |
| 5.27 | Badge | pill · 6px dot · label | success, warning, error, info, neutral × md/sm | static |
| 5.28 | Status dot | circle with glow | success, warning, error × md/sm; labelled or standalone | static |
| 5.29 | Tag | filled rectangle · label | purple, blue, green, amber, rose; flat or raised | static (removable tags in filter chips add a universal-state remove button) |
| 5.30 | Count pill | pill · number | — | static |
| 5.31 | Info chip | outlined chip · text | — | static |
| 5.32 | Avatar | circle · photo or initials | photo (32), initials brand (40), initials neutral (36) | static |
| 5.33 | Metric indicator | label · value · [/denominator] | with/without denominator; semantic value colors | static |
| 5.34 | Progress / status bar | track · segments · [in-segment counts] | segmented (multi-series), progress (single value) | static; value changes animate |
| 5.35 | Summary strip | lead (eyebrow · title) · divider · field pairs · status pairs | with/without status fields | static; a clamped title is focusable for its tooltip |
| 5.36 | Media card / viewer | header (icon tile · title · sub · expand icon) · media · footer (detail · badge) | card, full viewer modal | card: hover (blue border), focus; viewer: §5.44 |
| 5.37 | Sidebar | rail · brand header · sections (label · items) · user card | hover-expand rail (default), always-expanded, top nav, mobile drawer | item: default, hover, current, focus; rail: collapsed, expanded |
| 5.38 | Page header | [back button] · h1 · actions | plain, with back, with breadcrumb, with description | scrolled (shadow) / unscrolled |
| 5.39 | Segmented tabs | track · tabs (label · [count]) | raised (page level), accent (in card) | default, hover, selected (fill + weight 600 / brand fill), focus |
| 5.40 | Pagination | summary text · prev · page buttons · [ellipsis] · next | numbered, compact (≤xs), "Load more" (extension) | default, hover, current, focus, disabled (ends) |
| 5.41 | Data table | region · caption · header row · body rows · [selection col] · [actions col] | plain, sortable, selectable, capped (sticky header), clickable rows | row: default, stripe, hover, selected, warning/critical tint; header: sorted asc/desc |
| 5.42 | Table card | card · [section header (title · count · actions)] · table · [pagination] | with/without header, with bulk-action bar | static container |
| 5.43 | Collapsible section | card · header button (title · count · chevron) · [action] · content | top-level, nested, compact | collapsed, expanded, hover, focus |
| 5.44 | Overlay / modal | backdrop · dialog (header · body · footer) | generic modal 560/720, viewer | open; dirty (Escape asks to discard) |
| 5.45 | Confirmation dialog | title · message · Cancel · danger action | destructive (default), non-destructive confirm (primary instead of danger, product choice) | open; Cancel focused |
| 5.46 | Slide panel | backdrop · panel (header [back · icon · title · close · subheader] · body · footer) | 480/560/680/820; stacked sub-panel | open, body scrolled (header shadow), dirty |
| 5.47 | Popover | surface · content · [footer] | form popover, detail popover | open, closed |
| 5.48 | Toast | surface · [icon] · message · [action, e.g. Undo] · [close] | neutral, error (extension), with action | visible (2500ms / 5000ms; no timeout with an action), paused (hover/focus), replaced |
| 5.49 | Tooltip | surface · text | label tooltip, rich chart tooltip | hidden, shown (hover/focus), dismissed (Escape) |
| 5.50 | Loading | spinner or skeleton bars in the shape of the content | button, field, table, KPI, chart, page | loading → loaded / error |
| 5.51 | Empty state | message · [illustration/icon tile · title · action] | inline (table/chart/menu), first-use | static; action button: universal |


### 5.55 Behavior specifications for scripted components [STANDARDIZED, R-57]

The blueprints in §5 are HTML and CSS. This section defines the behavior that adopting applications must script. It is a contract, not a library: any framework, or any headless component library that meets it, is acceptable. The pseudocode is illustrative and framework-neutral. Native elements are preferred wherever they meet the contract (for example `<dialog>` with `showModal()`, which provides inertness, Escape handling and top-layer rendering).

**Shared rules**
- **Focus is never lost.** When the focused element disappears (a deleted row, a closed menu), focus moves to a defined target, never to `<body>`.
- **One source of state.** Visual state is derived from ARIA state (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`, `aria-invalid`, `aria-busy`), so the CSS selectors in §5 work unchanged.
- **Live announcements** use one polite `role="status"` region per page, present in the DOM from page load (content inserted into a region that was just created is often not announced).
- **RTL:** in horizontal widgets, ArrowLeft/ArrowRight swap meaning under `dir="rtl"`.

#### Select, multi-select and rich picker (combobox + listbox)

| Aspect | Contract |
|---|---|
| Attributes | Trigger: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (listbox id), labelled by its `<label>` or `aria-label`. While open: `aria-activedescendant` = the active option's id (removed when closed). Form selects add `aria-invalid` / `aria-describedby`. Listbox: `role="listbox"`, labelled; `aria-multiselectable="true"` for multi-select. Options: `role="option"`, unique `id`, `aria-selected`; unavailable options `aria-disabled="true"` |
| States | `closed` → `open` (active = the selected option, else the first enabled) → `closed`. Multi-select stays open while options are toggled |
| Opening | Click, Enter, Space, ArrowDown (active = selected or first) or ArrowUp (active = selected or last) on the trigger |
| Closing | Selecting (single), Escape (no change), click outside, Tab (§5.10), clicking the trigger again |
| Keyboard | §5.10 table. Disabled options are skipped. The active option is scrolled into view (`block: "nearest"`) |
| Search band | The search input is also `role="combobox"` with `aria-autocomplete="list"` and owns `aria-activedescendant` while it has focus. Typing filters; the active option resets to the first match; no matches → remove `aria-activedescendant` and show the "No matches" status row |
| Focus | Stays on the trigger (or the search input); options never receive DOM focus. On close, focus returns to the trigger |
| Positioning | Opens below; flips above when the space below is smaller than the menu. At `xs` it MAY render as a bottom sheet (§8.6) |
| Validation | Form selects are validated with the form (§5.8). A required empty select shows "Choose a <noun>." The error clears as soon as a value is chosen |

```text
onTriggerKey(key):
  if not open:
    if key in [Enter, Space, ArrowDown]: open(active = selectedIndex ?? firstEnabled)
    if key == ArrowUp:                   open(active = selectedIndex ?? lastEnabled)
    return
  switch key:
    ArrowDown / ArrowUp: active = nextEnabled(active, ±1)       // no wrap
    Home / End:          active = firstEnabled / lastEnabled
    Enter:               multi ? toggle(active) : (commit(active); close())
    Escape:              close()                                // value unchanged
    Tab:                 hasActionRow and focus is on trigger/search ? focus(actionRow) : close()
    printable char:      active = typeahead(buffer += char)     // buffer resets after 500 ms
  trigger.ariaActiveDescendant = open ? options[active].id : none
```

#### Command menu ("More actions", `role="menu"`)

| Aspect | Contract |
|---|---|
| Attributes | Trigger: `<button aria-haspopup="menu" aria-expanded aria-controls>` with an `aria-label`. Menu: `role="menu"`; items `role="menuitem"` |
| Focus | Unlike the listbox, focus **moves into** the menu: the first item on open (the last with ArrowUp). Items use a roving `tabindex` |
| Keyboard | ArrowDown/ArrowUp move (wrapping), Home/End, Enter/Space activate and close, Escape closes, Tab closes and moves on |
| Closing | Focus returns to the trigger, unless the action removed it (delete row): then focus follows the overlay fallback rule below |

#### Segmented tabs

| Aspect | Contract |
|---|---|
| Attributes | `role="tablist"` (labelled); tabs `role="tab"`, `aria-selected`, `aria-controls`; panels `role="tabpanel"`, `aria-labelledby` the tab, `tabindex="0"` when the panel has no focusable content |
| Keyboard | Roving `tabindex` (selected tab `0`, others `-1`). ArrowLeft/ArrowRight move **and activate** (wrapping at the ends); Home/End; Tab moves into the panel |
| State change | Activation swaps `aria-selected`, shows the panel and keeps focus on the tab. When a tab filters a list, announce the result count in the status region ("31 open items") |

#### Overlays: modal, confirmation dialog, slide panel, viewer, mobile drawer

| Aspect | Contract |
|---|---|
| Opening | Store the opener. Make everything outside the overlay `inert` (the sidebar stays visible but inert). Lock background scroll. Move focus per the §5.44 R-21 table (first field, Cancel, or the close button) |
| While open | Tab and Shift+Tab cycle inside the overlay. `aria-modal="true"`; confirmations use `role="alertdialog"` with `aria-describedby` on the message |
| Dirty tracking | `dirty` = current form values differ from the values at opening |
| Escape | Not dirty → close. Dirty → open the discard confirmation ("Keep Editing" focused, "Discard" danger); Discard closes both |
| Backdrop click | Does nothing (R-21) |
| Closing | Remove `inert`, unlock scroll, restore focus to the opener. If the opener no longer exists, focus the next row's link, else the previous row's, else the table region or the page `<h1>` (made focusable with `tabindex="-1"`) |
| Stacked sub-panel | Replaces the panel content. Back restores the parent's form state and focuses the control that opened the sub-panel |
| Submit (form panels) | Validate everything (§5.8). Errors: show all messages, keep the panel open and focus the first invalid field. Valid: Save enters the loading state (`aria-busy`, disabled). Success: close, show a toast and focus the created/updated row's link (else the opener). Server failure: keep the data, re-enable Save and show a §5.21 error alert (`role="alert"`) at the top of the body |
| Scroll shadow | The header gets `--scrolled` while `body.scrollTop > 0` |

```text
openOverlay(overlay, opener):
  overlay.returnTo = opener; setInertOutside(overlay, true); lockScroll()
  show(overlay); focus(initialTarget(overlay))          // R-21 table
onEscape(overlay):
  overlay.isDirty() ? confirmDiscard(onDiscard = () => closeOverlay(overlay)) : closeOverlay(overlay)
closeOverlay(overlay):
  hide(overlay); setInertOutside(overlay, false); unlockScroll()
  focus(isConnected(overlay.returnTo) ? overlay.returnTo : fallbackTarget())
```

#### Popovers (date range and generic)

| Aspect | Contract |
|---|---|
| Attributes | Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`. Popover: `role="dialog"`, labelled; **non-modal** (no focus trap, no `inert`) |
| Opening | Copy the committed value into a draft; focus the first field ("From") |
| Apply | Validate (From ≤ To). Invalid: the message appears (`role="alert"`), the "To" field gets `aria-invalid` and Apply is `aria-disabled` with `aria-describedby` on the message. Valid: commit, close, update the trigger text, return focus to the trigger |
| Clear | Reset to "All Dates", commit, close, return focus to the trigger |
| Dismiss | Escape discards the draft and returns focus to the trigger. Outside click or tabbing out discards the draft and leaves focus where the user moved it |

#### Tooltips

```text
states: hidden → pending → shown → leaving → hidden
anchor pointerenter            → pending; after 300 ms → shown
anchor focus (keyboard)        → shown immediately
pointer leaves anchor/tooltip  → leaving; after 100 ms → hidden, unless the pointer is over either again
anchor blur                    → hidden
Escape                         → hidden (focus does not move)
only one tooltip is shown at a time; showing a new one hides the previous
```
The tooltip element exists in the DOM while hidden, so `aria-describedby` always resolves. A tooltip for truncated text is shown only when the text is actually truncated (`scrollWidth > clientWidth`).

#### Toasts

| Aspect | Contract |
|---|---|
| Announcement | Text is inserted into the page's persistent `role="status"` toast region; toasts never take focus |
| Lifetime | 2500ms (5000ms for errors). The timer pauses while the pointer is over the toast or focus is inside it, and restarts on leave |
| With an action | No timeout (SC 2.2.1). It stays until the user acts, closes it (sm close icon button, `aria-label="Dismiss"`) or a newer toast replaces it |
| Replacement | A new toast replaces the current one |

#### Collapsible section

`<button aria-expanded aria-controls>` inside the heading. Enter/Space toggle; focus stays on the button; collapsed content is `hidden`. While a filter or search is active, sections with matches are forced open (`aria-expanded="true"`) and sections without matches are hidden. The user may still collapse one; that choice lasts until the filter changes.

#### Sidebar

The rail expands on hover or when focus is inside it (CSS, §5.37); no script is needed. The mobile drawer (§8.2) follows the overlay contract: the menu button has `aria-expanded` and `aria-controls`, Escape closes, and focus returns to the menu button. Following a nav link closes the drawer.

#### Data table

| Aspect | Contract |
|---|---|
| Sorting | Activating a header button cycles the order (§5.41). Set `aria-sort` on that `<th>` only, remove it from the others, update the caption, keep focus on the button and announce "Sorted by <column>, <direction>" |
| Selection | Header checkbox: unchecked (none) / indeterminate (some, via the `indeterminate` property) / checked (all on the page). Toggling it selects or clears the page. The bulk-action bar appears with "N selected" in `role="status"`. "Clear selection" clears and focuses the header checkbox |
| Row click | On a `<tr>` click: ignore it when the target is inside a link, button, input or label, or when text is selected; otherwise activate the row's link |
| Sticky header | The region gets `--scrolled` while `scrollTop > 0` |
| Pagination | Keep focus on the activated page button. If it disappears or becomes disabled (Next on the last page), focus the current-page button. Announce "Page 2 of 5" |
| Row deletion | After a confirmed delete, focus the next row's link (else the previous, else the table region) and show a toast |

#### Choice controls (radio cards, binary toggle, switch)

Radio cards and the binary toggle use a roving `tabindex`: one tab stop, with the arrow keys moving **and** selecting (wrapping; disabled options skipped). Space selects the focused option. The switch toggles `aria-checked` on click or Space and applies immediately; when saving fails, it reverts and shows an error toast.

#### File upload and field with attach

| Aspect | Contract |
|---|---|
| Activation | Click, Enter or Space on the dropzone (or the Upload button) opens the file picker. Drag-and-drop is optional; the picker is always available (SC 2.5.7) |
| Drag | `dragenter`/`dragover` add `is-dragover` (call `preventDefault`); `dragleave`/`drop` remove it |
| Validation | Check type and size on selection or drop. Invalid: `aria-invalid="true"` on the dropzone and a message (`role="alert"`, e.g. "Use a JPG or PNG file up to 5 MB.") |
| Progress | Uploading: `aria-busy="true"` and the status text "Uploading…". Field with attach: the placeholder becomes "Scanning…", and the extracted value fills the input, announced as "Code detected" |
| Removal | Remove buttons are labelled "Remove <file name>"; after removal, focus returns to the dropzone (or the input) |

#### Forms (every container)

Validation timing is defined once in §5.8: no errors before the first submit; on submit, validate everything and focus the first invalid field; after that, revalidate as the user types. Each message is linked to its control with `aria-describedby` (appended to any helper text id) and the control gets `aria-invalid="true"`. Server errors map to their fields where possible; otherwise they appear in a form-level §5.21 error alert. A form with more than about 8 fields MAY also show an error summary at the top listing links to each invalid field.

---

## 6. Page layout patterns

**Layer L3 (SHOULD).** These are proven assemblies, not mandates. Each pattern states:

- **Default:** use this unless you have a reason not to.
- **Acceptable variants:** equally on-system alternatives, and when to choose them.
- **Product decisions:** what each product must decide for itself. The source app's choice is given only as a reference.

Whatever layout you choose, it MUST be built from L1 tokens and L2 components, and MUST keep the spacing relationships in §6.0.

### 6.0 Spacing relationships (apply to every layout)

| Relationship | Value |
|---|---|
| Page gutter (content ↔ panel edge) | 16px (12px at `xs`) |
| Between stacked page sections | 24px |
| Between tiles in a row/grid (cards with ≤ 20px padding) | 16px |
| Between large side-by-side cards (24px padding) | 20px |
| Between collapsible groups | 12px |
| Inside a card: header ↔ content | 20px (chart cards), 16px (status cards) |
| Gaps never shrink below the padding of the cards they separate | — |

**Card sizing.** Cards size to their content and container. **Fixed pixel widths in this document (e.g. a 594px donut card) are observed examples, not requirements.** Use `flex`/`grid` with `minmax()` and sensible `min-width`s (charts ≥ 320px, entity cards ≥ 280px) so cards reflow (§8).

### 6.1 Application shell

**Default:** sidebar rail + main panel.

```
viewport (100dvh, bg-app #15191c, padding 16, gap 20, overflow hidden)
┌────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐ 20 ┌────────────────────────────────────────────────────────────┐ │
│ │ side │    │ MAIN PANEL  bg-shell #1b1f22 · radius 20 · shadow-shell     │ │
│ │ bar  │    │ ┌────────────────────────────────────────────────────────┐ │ │
│ │ 76px │    │ │ PAGE HEADER 76px (title ··········· actions)            │ │ │
│ │      │    │ ├────────────────────────────────────────────────────────┤ │ │
│ │      │    │ │ PAGE CONTENT  flex:1 · overflow:auto                    │ │ │
│ │      │    │ │ padding 4 16 16 16 · flex column · gap 24               │ │ │
│ │      │    │ └────────────────────────────────────────────────────────┘ │ │
│ └──────┘    └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

```css
.ds-shell { display: flex; gap: var(--ds-space-shell-gap); width: 100%; height: 100dvh; padding: var(--ds-space-shell-padding);
  background: var(--ds-color-bg-app); overflow: hidden; }
.ds-main { position: relative; display: flex; flex-direction: column; flex: 1; min-width: 0; min-height: 0;
  border-radius: var(--ds-radius-card); background: var(--ds-color-bg-shell); box-shadow: var(--ds-shadow-shell); overflow: hidden; }
.ds-page-header { position: relative; z-index: var(--ds-z-header); flex-shrink: 0; min-height: var(--ds-size-page-header); padding: 0 var(--ds-space-page-gutter);
  display: flex; align-items: center; justify-content: space-between; gap: var(--ds-space-4); flex-wrap: wrap; backdrop-filter: blur(12px);
  transition: box-shadow var(--ds-duration-base); }
.ds-page-header--scrolled { box-shadow: var(--ds-shadow-header-scrolled); }
.ds-page-header__lead { display: flex; align-items: center; gap: var(--ds-space-2-5); min-width: 0; }
.ds-page-header__actions { display: flex; align-items: center; gap: var(--ds-space-header-actions); flex-wrap: wrap; }
.ds-page-content { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: var(--ds-space-section);
  padding: var(--ds-space-page-top) var(--ds-space-page-gutter) var(--ds-space-page-gutter); }
.ds-page-content > * { flex-shrink: 0; }
```

| Acceptable variants | When |
|---|---|
| Top navigation bar (§5.37) | Fewer than ~6 destinations, or products where horizontal space is precious (wide tables, canvases) |
| Persistently expanded sidebar (256px, no hover expansion) | Products with many sections whose users rely on reading labels; first-time-heavy audiences |
| No sidebar (single-purpose tool) | Tools with 1–2 screens; keep the main panel styling |

**Product decisions:** navigation items and grouping; whether the rail expands on hover (source) or on click; the user-menu contents.

**Invariant rules (MUST):** only the content area scrolls; there is exactly one `<h1>` per page; overlays mount inside the main panel on desktop.

### 6.2 Page header

**Default:** title on the left; page-scoped actions on the right, in the order **search → filters → date → primary action** (§5.38).

| Acceptable variants | When |
|---|---|
| Header + separate toolbar row (§6.3 B) | More than ~5 controls, or filters that need more width |
| Back button + title | A detail page one level down |
| Breadcrumb above the title (§5.38) | Two or more levels of hierarchy |
| Title + description line (`body-muted`, below the title; header grows to fit) | Pages that need one sentence of orientation |

**Product decisions:** which actions belong to the page (vs. a card or row), and whether the primary action needs a fixed width (the source used 180px for visual alignment).

### 6.3 Filters

Place a filter **where its scope is**, not in a fixed location.

| Filter scope | Placement | Component |
|---|---|---|
| **Global**: affects every card on the page (date range, organization, region) | Page header actions, or a toolbar row under the header | Raised filter select (§5.9), date range (§5.16), search (§5.6) |
| **Local**: affects one card, chart or table | That card's header, right side | Raised filter select (220px default), accent segmented tabs |
| **Categorical with counts** for the main list | Above the list, as raised segmented tabs (§5.39) | "All (248) · Open (31) · Closed (217)" |
| **Many / advanced filters** (more than 5) **[EXTENSION]** | A "Filters" secondary button opening a popover (≤ 4 fields) or a 480px slide panel (more), plus applied-filter chips (tags in `surface-pill`, with a remove ✕ button) under the header | §5.47 / §5.46 |

**Behavior rules (SHOULD):**
- Simple filters apply instantly. Panels with several fields use an "Apply" button.
- Changing any filter resets pagination to page 1.
- Provide "Clear filters" (ghost button) once any filter is active.
- Summary metrics follow the scope filters. **[PRODUCT DECISION]** In the source, KPI totals ignored the status filter, so their parts always added up.

### 6.4 Metrics

**Default:** headline numbers for a whole page appear as a **KPI row** (§5.23) at the top: 3–5 KPI cards.

| Acceptable variants | When |
|---|---|
| Metric inside a dashboard card header (`kpi-value` + `small` label) | The number belongs to that chart |
| Inline metric indicator (§5.33) | Several small metrics inside an entity card or summary strip |
| Summary strip (§5.35) | Key facts about the single record in context |
| A number in a table cell | Per-row values |
| One prominent metric [EXTENSION] | A dashboard card with the value in `page-title` style (24/28 600), label `kpi-label`, optional delta in `small` success/error text |

**Not every large number needs a KPI card.** Use KPI cards when the numbers are page-level, comparable and scannable; otherwise use the variant that keeps the number next to its context.

### 6.5 Card grids

**Default:** `display: grid; grid-template-columns: repeat(auto-fill, minmax(<min>, 1fr)); gap: 16px` (20px for large cards).

| Grid | Reference min width | Source reference |
|---|---|---|
| Entity cards | 320px | 3 columns at 1440px **[PRODUCT DECISION]** |
| Media cards | 280px | 4 columns at 1440px **[PRODUCT DECISION]** |

**Product decisions:**
- fixed column counts versus `auto-fill`;
- whether partially filled last rows keep card widths (use `auto-fill`) or stretch (`auto-fit`).

### 6.6 List / management page

**Default:**

```
PAGE HEADER: Title ············· [search][filter][filter][+ Add Item]
CONTENT (gap 24):
  [segmented tabs with counts, optional]
  [KPI row, optional]
  TABLE CARD: [section header, optional] → table → pagination
```

| Acceptable variants | When |
|---|---|
| Grouped list (§6.7) | Records naturally belong to parents and users work group by group |
| Card grid (§6.5) instead of a table | Visual records (images, rich summaries) and fewer than ~50 items |
| Infinite scroll / "Load more" button **[EXTENSION]** | Feeds and logs where page numbers have no meaning. Keep a visible count ("Showing 40 of 1,204") |

**Product decisions:**
- page size (the source used 6–8);
- default sort;
- which columns appear;
- whether rows open a detail page, a panel or nothing.

### 6.7 Grouped list page

**Default:** a stack of collapsible section cards (§5.43), gap 12px. Each group contains a table without pagination. **[PRODUCT DECISION]** The source opened the first group by default and force-opened all groups while filtering.

### 6.8 Detail page

**Default:**

```
PAGE HEADER: [← back] Record Name ··········· [record actions]
CONTENT (gap 24):
  [KPI row or summary strip]
  [child records: table card, or cards]
```

**Acceptable variants:**
- tabs (raised segmented tabs) between sections of a large record;
- a two-column layout (main content + 320–360px side card with properties as label/value pairs) on wide screens **[EXTENSION]**.

### 6.9 Dashboard

**Default composition:** global filters in the header → KPI row → the most decision-relevant chart full-width → supporting charts in rows (gap 20) → detail tables → live status.

| Rules (SHOULD) |
|---|
| Global filters drive every card; local controls drive only their card |
| One color mapping per series across the page |
| Side-by-side cards share a header height (40px minimum) so titles align |
| Every chart card has an empty state and a loading state |

**Product decisions:**
- the set and order of charts. The source ordered cards differently for "today" versus historical ranges; that is a product choice.

### 6.10 Forms

**There is no single required form container.** Choose by size and context:

| Container | Use when | Spec |
|---|---|---|
| **Slide panel** (default for create/edit of a record from a list) | The user should keep the list in view; 3–20 fields | §5.46; 560px single-column, 820px two-column |
| **Full page** | Long or multi-section forms (more than ~20 fields), forms that need a URL or draft saving, settings pages | Content column max-width 820px (two-column grid) or 560px (single), inside section cards (radius 20, padding 24, gap 24); a sticky footer bar with the same footer layout as panels **[EXTENSION]** |
| **Centered modal** (§5.44 generic modal) | 1–3 fields or a single decision with input (rename, add a note) | 560px |
| **Inline edit** **[EXTENSION]** | A single field edited in place (a title, a cell) | The field swaps to a §5.5 input of the same width; Enter saves, Escape cancels |
| **Wizard** | Ordered steps with dependencies | An 820px panel or a full page with a stepper (§5.22) |

**Invariant rules (MUST):**
- labels above fields (6px gap);
- column gap 20px; row gap 24px; 40px between topic groups;
- required fields marked;
- errors per §5.8;
- footer: secondary on the left, primary on the right.

**Product decisions:** field order, and whether Save is disabled until valid (see §5 disabled rules).

### 6.11 Monitoring view

**Default:** a summary strip, then a media/status grid that fills the remaining height (no page scroll on desktop). Variant: a table of live statuses with a segmented status bar (§5.26).

### 6.12 Mapping product needs to patterns

| Need | Start from |
|---|---|
| CRUD over a list of records | §6.6 + §6.10 |
| Records grouped by a parent | §6.7 |
| One record and its children | §6.8 |
| Metrics and trends | §6.9 |
| Visual items (files, devices, images) | §6.5 media grid |
| Settings **[EXTENSION]** | Full-page form (§6.10) with section cards, each with a `card-title`, a `body-muted` description, fields and a right-aligned sm primary Save |
| Something none of these fit | Compose L2 components with the §6.0 spacing relationships, and record it as an extension (§10 rule 10) |

---

## 7. Data visualization system

### 7.1 General rules

- Charts always live in a dashboard card (§5.25), with the title on the left and legend/controls on the right.
- **No gridlines** [OBSERVED]. Bars sit on a 1px `chart-baseline` (white/6%) bottom axis line. Optional gridlines [EXTENSION]: horizontal only, 1px dashed `rgba(255,255,255,0.04)`, at the y ticks.
- Plot backgrounds are transparent (the card surface).
- Animate data changes: bars 300ms, donut/progress 500ms, `--ds-ease-standard`. No entrance animation on first render.
- Every chart has an accessible name (`role="img"` + `aria-label` summarising it), and every mark is reachable by hover **and** keyboard focus when it carries a tooltip.
- Number formatting: thousands separators (`12,480`), compact axes (`2.5k`), percentages with 2 decimals for rates (`3.42%`), units with a space (`500 ms`, `4 h`), dates `10 Apr 2024` (en-GB, short month) and `10 Apr` on axes.

### 7.2 Color palettes

| Palette | Values | Use |
|---|---|---|
| Categorical (in this order) | `#016ffe`, `#8b34fd`, `#fbb645`, `#00bac9` | Distinct categories in donuts, multi-series lines, stacked categories |
| Categorical extension [EXTENSION] | then `#34d399`, `#fb7185`, `#93c5fd`, `#f59e0b` | Categories 5–8. With more than 8, group the rest into "Other" in `#64748b` |
| Positive / negative | good `#10b981`, bad `#ff5825` | Good-vs-bad splits (pass/fail, good/defective) |
| Running / stopped | `#34d399`, `#ff5825` | Up/down status bars and legends |
| Sequential heat (low → high = good → bad) | `#00403a` → `#11603a` → `#597730` → `#ca8a35` → `#ff5825` | Heatmaps and bubble matrices; interpolate linearly in RGB between the 5 equal-spaced stops |
| Sequential neutral [EXTENSION] | `rgba(59,130,246, 0.15 → 1.0)` | Magnitude with no good/bad meaning |
| Trend overlay | `#ffffff` | Dashed secondary metric line |
| Track | `rgba(255,255,255,0.05)` | Unfilled donut ring, progress track |

**Heat normalization.** Map each value to `t = (v − min) / (max − min)` over **the values currently visible** (0.5 when all values are equal). This keeps the contrast between cells when the rates are close. Say "relative scale" in the chart subtitle when it matters.

### 7.3 Axes

| Part | Spec |
|---|---|
| Y axis | width 28px; tick labels right-aligned, `axis-y` (12/24 white/60% -0.4px); 7 ticks (0 + 6 even steps) rounded to a nice 1/2/2.5/5 × 10ⁿ step; compact formatting (`1.2k`); 10px gap to the plot |
| X axis | labels centered under each band, `axis-x` (14/24 white -0.4px), truncated; with more than 16 bands, label every ⌈n/12⌉-th band; 10px gap above |
| Dense categorical axis | `axis-caption` (11/14 `#9eacba`), 2-line clamp, 4px horizontal padding |
| Axis line | bottom only, 1px `chart-baseline` |
| Titles | none; units go in the card subtitle or legend |

### 7.4 Bar charts (vertical, stacked)

| Property | Value |
|---|---|
| Plot height | 300px |
| Band | equal-width flex columns; the bar is centered in its band |
| Bar width | 60% of the band, max 74px, min 6px |
| Stack order | bottom: primary/positive series (`#10b981`); top: negative series (`#ff5825`) |
| Segment gap | 2px of card color between stacked segments (R-45) |
| Corners | top corners of the topmost segment 4px; the bottom is square |
| Hover / focus | a tooltip (§5.49, or the rich tooltip §7.9) with the breakdown ("Mon: 12,400 good · 320 bad"); a bar with a tooltip is focusable |
| Horizontal bars [EXTENSION] | bar height 20px, gap 12px, label column 154px (`body-strong` + `small`), value label to the right of the bar in `small-strong` |
| Grouped bars [EXTENSION] | up to 3 series per band, 4px gap inside the group, the group at 60% of the band |

### 7.5 Line / trend charts

**Trend overlay [OBSERVED].** A secondary metric (e.g. a rate) drawn over bars on its own scale, with max = 1.25 × the data max:
- the line is a 2px white dashed stroke (`6 5`) with a non-scaling stroke;
- points are 10px white dots centered on each band;
- data labels (`data-label` 16px white with a dark text shadow) sit 14px above the points, only when there are 16 bands or fewer.

**Standalone line chart [EXTENSION].**

| Property | Value |
|---|---|
| Series stroke | 2px solid, categorical colors |
| Points | 6px dots in the series color, shown on hover/focus only (and always when there are 12 points or fewer) |
| Area fill (area chart) | the series color at 12% → 0% vertical gradient |
| Highlight on hover | a 1px vertical guide `rgba(255,255,255,0.2)` + the rich tooltip listing every series at that x |
| Plot height | 300px |

### 7.6 Donut / pie

| Property | Value |
|---|---|
| Size | 180px diameter, 32px ring thickness |
| Track | the full ring in `chart-track` behind the segments |
| Start | 12 o'clock, clockwise; **2px card-colored gaps** between segments (R-45) |
| Legend | a vertical list beside the donut (gap 20px) or under it when the card is tall (gap 12px); each row = swatch legend + value in 14/20 500 `text-muted` as "1,240 (32.10%)", `justify-content: space-between; gap: 24px` |
| Hover / focus | a tooltip per segment ("Label: 1,240 (32.10%)"); the legend rows repeat every value, so no information is hover-only |
| Center label [EXTENSION] | total in `kpi-value`, caption under it in `small` |
| Pie | **not used**. Always use a donut |

### 7.7 Heatmap

| Property | Value |
|---|---|
| Layout | a CSS grid: first column = row labels, then one equal column per category; it runs edge-to-edge in a flush card |
| Header row | bg white/2%; padding 8px 0; 14/24 600 -0.4px UPPERCASE `text-muted`, centered (first column left, padding-left 28px) |
| Row | min-height 40px (`size-heat-row`) |
| Row label | 14/20 600 -0.4px white, padding-left 28px, 1px `border-divider` right |
| Cell | full-bleed fill = heat color; value centered in `heat-cell` (14/20 600 -0.4px), **white when the fill's ramp position p ≤ 0.55 and ink `#0b0f14` when p ≥ 0.59** (§9.1). Positions 0.55 < p < 0.59 are **snapped** to the nearer edge for the fill, because no text color reaches 4.5:1 on those mid-tones (R-56); the exact value is still printed in the cell. Hover: a 1px inset white line (`box-shadow: inset 0 0 0 1px var(--ds-color-text-primary)`), never a brightness filter, which would push white text below 4.5:1; focus `focus-ring-on-color`; it is a `<button>` with an `aria-label` ("Region A, Category 2: 3.42%") |
| Last cell | bottom-right radius matches the card (20px) |
| Tooltip | the rich tooltip (§7.9) on hover/focus |

```text
p = reversedScale ? 1 - t : t                    // ramp position (reverse when high = good, §12)
if 0.55 < p < 0.59: p = (p < 0.57) ? 0.55 : 0.59   // text-bearing cells only; bubbles keep p
fill = interpolateRGB(HEAT_STOPS, p)
text = (p <= 0.55) ? white : ink                  // ≥ 4.60:1 and ≥ 4.56:1
```

### 7.8 Bubble matrix

| Property | Value |
|---|---|
| Layout | the row label column is 154px (name 14/20 600 `#f4f7fa` + sub 12/16 `#9eacba`), then one equal grid column per category; inner padding 12px 16px 8px |
| Row height | 88px (64px when there are more than 6 rows); up to 10 rows × 10 columns |
| Bubble | diameter = 14 + √(v / max) × 40 px (range 14–54px); fill = heat color of its rate; hover `scale(1.1)`; focus `focus-ring`; a `<button>` with an `aria-label` |
| Encoding | size = volume, color = rate. State both in the subtitle |
| X labels | `axis-caption`, centered under the columns |

### 7.9 Rich chart tooltip

```
┌────────────────────────────────────────────┐ width 314 (342 for long lists) · padding 13 · radius 8
│ ● Title × Subtitle                          │ 11px dot · 11/13 700 #f4f6f8 · "×" in #aeb8c5 · gap 8
│ Metric label ························ value │ 10/12 · labels #aeb8c5 · values #f4f6f8 · gap 6
│ Metric label ························ value │
│ ─────────────────────────────────────────── │ 1px rgba(57,67,75,0.4)
│ List title                                  │ 10/12 #aeb8c5
│ 1. Item ······················ 3.2% (120)  │ gap 8 · item #f4f6f8 truncate · value #aeb8c5 nowrap
└────────────────────────────────────────────┘ bg #151a1f · 1px #3a434b · shadow-tooltip · gap 10 between blocks
```

**Positioning.** Anchor at the mark's center, offset 12px right and 12px down. Flip to the left/up when `anchor + size + 24px` exceeds the chart container. Set z-index 30 and `role="tooltip"`; give the focused mark `aria-describedby` pointing at the tooltip. The tooltip is **hoverable** (SC 1.4.13): it stays open while the pointer is over the mark or the tooltip, hides 100ms after the pointer leaves both, hides on blur of the mark, and closes on Escape.

```css
.ds-chart-tip { position: absolute; z-index: var(--ds-z-tooltip); width: var(--ds-size-tooltip);
  display: flex; flex-direction: column; gap: var(--ds-space-2-5); padding: 13px; border-radius: var(--ds-radius-sm);
  background: var(--ds-color-surface-tooltip); border: 1px solid var(--ds-color-border-tooltip); box-shadow: var(--ds-shadow-tooltip); }
.ds-chart-tip__head { display: flex; align-items: center; gap: var(--ds-space-2); font-size: 11px; line-height: 13px; }
.ds-chart-tip__head b { font-weight: 700; color: var(--ds-color-text-tooltip); }
.ds-chart-tip__rows { display: flex; flex-direction: column; gap: var(--ds-space-1-5); font-size: 10px; line-height: 12px; }
.ds-chart-tip__row { display: flex; justify-content: space-between; gap: var(--ds-space-3); color: var(--ds-color-text-tooltip-muted); }
.ds-chart-tip__row > :last-child { color: var(--ds-color-text-tooltip); }
.ds-chart-tip__divider { height: 1px; background: var(--ds-color-border-tooltip-divider); }
```

### 7.10 Legends

| Style | Swatch | Text | Gap swatch→text | Gap between items | Use |
|---|---|---|---|---|---|
| Swatch legend | 24×16, radius 4px | `legend` 14/22 500 `text-muted` | 12px | 24px | Chart cards (bars, donut) |
| Dot legend | 12px circle | `legend-sm` 12/16 500 `text-muted` | 8px | 20px | Compact headers (status cards) |
| Line legend | 24×16 SVG: 2px dashed line (`4 3`) with a 6px dot | `legend` | 12px | 24px | Trend overlays |

Legends sit in the card header, on the right, in series order. Legend labels may carry a value (`text-muted`) after the label, with a 12px gap.

### 7.11 Data labels

On-chart labels are allowed only for trend points (16 or fewer) and inside bars/segments wide enough to hold them (min 28px). Style: `data-label`, or `bar-segment` for numbers inside a colored segment. Never label every bar on a dense chart; use the tooltip.

### 7.12 Visualization controls

- View switch inside a card: accent segmented tabs (§5.39), equal-width tabs, at the right end of the header.
- Scope filter inside a card: a raised filter select (220px), whose menu may be wider and right-aligned.
- Date range: always in the page header (§5.16), never per card.

---

## 8. Responsive rules

> **Observed:** the source app was built only for wide desktop screens (≈1440–1920px) and had no breakpoints.
> **Standard for this system:** responsive design is **required**. The rules below are **[STANDARDIZED/EXTENSION]**. They preserve every token, and change only layout, never colors, type or component anatomy.

### 8.1 Breakpoints

| Name | Range | Reference width |
|---|---|---|
| `xs` | < 640px | 390px (phone) |
| `sm` | 640 – 1023px | 768px (tablet portrait) |
| `md` | 1024 – 1279px | 1024px (tablet landscape / small laptop) |
| `lg` | 1280 – 1535px | 1440px (laptop) — **primary design width** |
| `xl` | ≥ 1536px | 1920px (desktop) |

Minimum supported width: **360px**. Use `min-width` media queries (mobile-first) or container queries for cards.

### 8.2 Shell

| Breakpoint | Shell |
|---|---|
| `lg`, `xl` | as §6.1: 76px hover-expand rail, 16px shell padding, 20px gap |
| `md` | same rail; shell padding 12px, gap 12px |
| `sm`, `xs` | the rail is hidden. A 56px top bar (bg `bg-shell`, `shadow-shell`, no radius, padding 0 16px) holds a 36px menu icon button, the brand logo and the user avatar. The menu opens the full sidebar (256px) as a start-edge drawer over a black/40% blurred backdrop (`shadow-drawer-mirrored`). Shell padding 0; the main panel has no radius |

### 8.3 Page header

| Breakpoint | Behavior |
|---|---|
| `lg`+ | single row, 76px |
| `md` | the title row stays 76px; actions wrap onto a second row (gap 12px, `flex-wrap: wrap`, padding-bottom 16px); search grows to fill the row |
| `sm`, `xs` | title row 56px with the `page-title` reduced to 20/28; the primary action becomes a 36px icon button (+) with an `aria-label`; filters collapse into a "Filters" secondary button opening a bottom sheet (radius 20px 20px 0 0, bg `surface-card`) holding the same selects stacked at full width |

### 8.4 Grids

With the §6.5 default (`auto-fill` + `minmax`), these column counts emerge from the minimum widths. Use the table as the target when a product chooses fixed column counts.

| Component | xl | lg | md | sm | xs |
|---|---|---|---|---|---|
| KPI row | 5–6 in a row | up to 5 in a row | `grid; repeat(3, 1fr)` | `repeat(2, 1fr)` | `repeat(2, 1fr)`; labels and values wrap (R-53) |
| Entity grid | 3 cols | 3 cols | 2 cols | 2 cols | 1 col |
| Media grid | 4 cols | 4 cols | 3 cols | 2 cols | 1 col (16:9 min height 220px) |
| Dashboard side-by-side rows | row | row | stack (100% width each) | stack | stack |
| Form grid (2 cols) | 2 | 2 | 2 | 1 | 1 |
| Status cards row | 3 in a row | 3 | stack | stack | stack |

Gaps never change: 16px tiles, 20px large cards, 24px sections. At `xs`, reduce the page gutter to 12px.

### 8.5 Tables

- `lg`+: full table.
- `md`/`sm`: horizontal scroll inside the card (`overflow-x: auto`). The first column becomes sticky (`position: sticky; inset-inline-start: 0; background: var(--ds-color-surface-card)`, with a 1px `border-faint` inline-end edge once scrolled).
- `xs` [EXTENSION]: each row becomes a stacked list item inside the table card. The primary column becomes the item title (`body-strong`), 2–3 key fields follow as "LABEL value" pairs (label `table-header` style, value `body`), status shows as a badge sm, row actions move into a 36px "⋯" icon button menu. Items are separated by 1px `border-faint`, padding 12px 16px.
- Pagination at `xs`: hide the page numbers and show "Page 2 of 5" between prev/next.

### 8.6 Overlays

- Slide panels: `width: min(<panel width>, 100%)`. Below 1024px they cover the viewport (`position: fixed`). At `xs`, the panel takes the full screen with the same header/footer.
- Dialogs: `max-width: calc(100% - 32px)`.
- Menus: at `xs`, select menus may render as a bottom sheet with 48px options [EXTENSION].
- Rich tooltips: on touch, show on tap and close on outside tap.

### 8.7 Text wrapping & truncation

The truncation policy is defined once, in §2.3 ("Long content"). In summary: **never truncate** KPI values/labels, form labels, messages, status and button labels; **wrap** titles and names; **clamp or truncate only with recovery** (a tooltip on a focusable element, a menu, or a detail view). At every breakpoint, prefer letting a component grow taller over hiding text.

### 8.8 Touch targets

At `sm`/`xs`, interactive targets are at least **44×44px**. Keep visual sizes and extend the hit area with padding or a `::before` inset (e.g. 28px row icon buttons get a 44px hit area). At `md`+, the minimum is 24×24 (WCAG 2.2 AA 2.5.8). Every control in this system meets it.

### 8.9 Internationalization & right-to-left [STANDARDIZED, R-57]

There is one design for every locale. A locale changes only the text, its formatting and the reading direction, never tokens or anatomy. Test every screen with copy 40% longer than the source language (up to 200% for strings under 10 characters), and with one right-to-left locale.

**Text expansion by component**

| Component | When translated text is longer |
|---|---|
| Buttons | The label wraps to a second line and the button grows (§5.1). Never shrink the font or clip. If a translation needs more than 2 lines, shorten the copy, not the component |
| Header / footer primaries | The optional 180px `min-width` stays a minimum; the width grows with the label |
| Navigation | Labels stay on one line, with an ellipsis and a §5.49 tooltip (§5.37). Budget about 22 characters at 14px in the 256px panel; write shorter translated nav labels where possible |
| Tabs | Labels wrap inside the tab. When the track no longer fits, it scrolls horizontally (§5.52); at `xs` the accent variant becomes a select |
| KPI, entity and dashboard cards | Labels, values and titles wrap; cards in a row stretch to the tallest (§2.3) |
| Badges and tags | 1–2 words in every locale; they never truncate. Supply short translated forms rather than phrases |
| Form labels, helper text, errors | Wrap; never truncate |
| Table headers | `nowrap` suits short headers only. A translated header longer than about 20 characters MAY wrap: remove `nowrap` for that column. Shrink-to-fit columns size to the translated content, and the region scrolls horizontally when needed |
| Select triggers / menus | The trigger truncates with recovery (the menu and accessible name hold the full value); menu options wrap |

**Unbroken text** (emails, URLs, identifiers, file names, hashes) has no break opportunities.
- In wrapping containers (cards, summary-strip values, dropzones, toasts, dialog messages): `overflow-wrap: anywhere`.
- In tables: identifiers stay on one line in shrink-to-fit columns. Long free-form strings (emails, URLs) either use `overflow-wrap: anywhere` in the grow column or `.ds-cell-truncate` with recovery (§5.41).
- Never insert manual hyphens or `<br>` into data. `hyphens: auto` is allowed on prose only, with a correct `lang` attribute.

**Formatting.** Format numbers, dates and plurals with the locale (for example `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`). The §7.1 formats are the en-GB reference. Never build a sentence by concatenating translated fragments ("Showing" + n + "of" + m): translate the whole message with placeholders.

**Scripts other than Latin.** Inter has no Arabic, Hebrew, CJK or Indic glyphs. Append a script-appropriate family after `'Inter'` in `--ds-font-family` (for example a Noto Sans variant); keep the sizes and line heights. For scripts without letter case or with joined letters (Arabic and others), set `letter-spacing: 0` and drop `text-transform: uppercase`; tracking breaks letter joining.

**Right-to-left**
- Set `dir="rtl"` and `lang` on `<html>` (or on the region that changes direction).
- Use CSS logical properties. The blueprints in this document already do (`padding-inline-start`, `margin-inline-start`, `inset-inline-end`, `border-inline-start`, `text-align: start`). Where a spec table says "left" or "right", read it as **start** or **end**.
- Flex and grid order follow the direction automatically. Footers keep secondary at the start and primary at the end; row actions sit at the end; the sidebar sits at the start; slide panels open from the end edge (`.ds-overlay--panel` uses `justify-content: flex-end`).
- Numeric table columns stay **physically right-aligned** (`.ds-num` keeps `text-align: right`) so that digits, which are always written left-to-right, line up by place value.
- Horizontal shadows mirror: a slide panel in RTL, and the mobile sidebar drawer in LTR, use `--ds-shadow-drawer-mirrored`.
- The switch thumb travels toward the end (the §5.53 switch blueprint includes the `:dir(rtl)` rule).
- User-entered or mixed-direction text (an English email inside an Arabic interface): wrap it in `<bdi>`, or set `dir="auto"` on inputs and cells that hold user data.
- Charts: legends and categorical order follow the reading direction. Whether time axes run right-to-left is a **[PRODUCT DECISION]**; choose once and apply it to every chart.

**Direction-aware icons.** Icons that express direction or sequence mirror in RTL; everything else never mirrors.

| Mirror in RTL | Never mirror |
|---|---|
| Back and forward arrows; chevrons pointing left/right (Next buttons, pagination prev/next, the breadcrumb chevron if used); the sidebar collapse toggle; undo/redo; the trailing "›" on step buttons; stepper connectors | Check marks, plus, ×, search, upload/download, clock, calendar, play/media controls, status and alert icons, vertical chevrons and sort arrows, logos, 3D illustrations, numbers |

Mark mirroring icons with the class `ds-icon--dir`; §4 flips them under `:dir(rtl)`. An icon that already has a transform (a rotated chevron) puts the flip on a wrapper instead.

**Print.** Print styles remain optional. If a product needs them, print on a white background with `text-primary` swapped to black, and remove shadows, backdrops and the sidebar (§15.2).

---

## 9. Accessibility rules (WCAG 2.2 AA)

**Target: WCAG 2.2 Level AA.** Every ratio below is **computed** with the WCAG relative-luminance formula. Translucent colors were composited onto the surface first. Requirements: 4.5:1 for normal text, 3:1 for large text (≥ 24px regular or ≥ 18.66px bold), and 3:1 for non-text UI parts and states (SC 1.4.11).

### 9.1 Text contrast

| Text token | Value | card `#1d2328` | elevated `#21272d` | shell `#1b1f22` | overlay `#161a20` | sunken `#161a1e` | Use |
|---|---|---|---|---|---|---|---|
| `text-primary` | `#ffffff` | 15.87 | 15.08 | 16.59 | 17.46 | 17.49 | Pass AAA |
| `text-secondary` | `#cbd5e1` | 10.69 | 10.16 | 11.18 | 11.76 | 11.78 | Pass AAA |
| `text-muted` | `#94a3b8` | 6.19 | 5.88 | 6.47 | 6.81 | 6.82 | Pass AA |
| `text-tertiary` **(new)** | `#8695aa` | 5.21 | 4.95 | 5.45 | 5.73 | 5.74 | Pass AA, also on hovered rows (4.51) |
| `text-placeholder` **(new)** | `#77879d` | — | — | — | 4.77 | 4.78 | Pass AA; used only on sunken fields |
| `text-faint` | `#475569` | 2.09 | 1.99 | 2.19 | 2.30 | 2.31 | **Not text.** Decorative separators only (`aria-hidden`) |
| `link` **(new)** | `#60a5fa` | 6.24 | 5.93 | 6.53 | 6.87 | 6.88 | Blue text: links, link actions, open-record actions |
| `brand-text` | `#93c5fd` | 8.80 | 8.36 | 9.20 | 9.68 | 9.70 | Blue text on tints, eyebrow labels, menu action row; link hover |
| `brand` (as text) | `#3b82f6` | **4.31** | **4.10** | 4.51 | 4.75 | 4.76 | **Not used for text** (fails on card/elevated). Graphics, borders, focus only |
| `error-text` | `#f87171` | 5.74 | 5.45 | 6.00 | 6.31 | 6.32 | Pass AA |
| `success-text` | `#34d399` | 8.25 | 7.84 | 8.63 | 9.08 | 9.10 | Pass AA |
| `warning-text` | `#fbbf24` | 9.51 | 9.03 | 9.94 | 10.46 | 10.48 | Pass AA |
| `alert-count` | `#fb7185` | 5.90 | 5.60 | 6.16 | 6.49 | 6.50 | Pass AA |
| `text-chart-subtle` | `#9eacba` | 6.85 | 6.51 | 7.16 | 7.54 | 7.55 | Pass AA |
| `text-axis` | white/60% → `#a5a7a9` on card | 6.57 | — | — | — | — | Pass AA |

| Text on colored fills | Ratio | Result |
|---|---|---|
| White on `brand-strong` `#2563eb` (primary button, active accent tab, current page, stepper index) | 5.17 | Pass |
| White on `brand-stronger` `#1d4ed8` (primary hover) | 6.70 | Pass |
| White on `brand` `#3b82f6` | **3.68** | **Fails for 14px text. Not allowed** (R-39: the accent tab now uses `brand-strong`) |
| `brand-text` on tonal bg (tint 20% / 30% over card) | 6.78 / 5.80 | Pass (R-39: tonal button text) |
| `success-text` / `warning-text` / `error-text` on their badge fills | 7.05 / 7.99 / 5.24 | Pass |
| `error-text` on the danger button hover fill | 4.63 | Pass |
| `brand-text` on info chip (tint 10%) | 7.82 | Pass |
| `#cbd5e1` on secondary button gradient (#151922 → #11141c) | 11.85–12.40 | Pass |
| Tooltip: `#f4f6f8` / `#aeb8c5` on `#151a1f` | 16.16 / 8.72 | Pass |
| White on tags: purple / blue / green / amber / rose | 8.36 / 4.84 / 4.90 / 4.81 / 6.38 | Pass (after R-36) |
| Ink `#0b0f14` on running `#34d399` / stopped `#ff5825` segments | 10.00 / 6.11 | Pass (white on `#ff5825` would be 3.15: not allowed) |
| Heatmap cell text: white for ramp position p ≤ 0.55; ink `#0b0f14` for p ≥ 0.59; fills between are snapped (§7.7) | white ≥ 4.60; ink ≥ 4.56 | Pass (R-56; the unsnapped band 0.56–0.59 measured 4.27–4.47) |

### 9.2 Non-text contrast (SC 1.4.11)

| Element | Against | Ratio | Result |
|---|---|---|---|
| Focus outline `#3b82f6` | elevated / card / shell / overlay / sunken / app | 4.10 / 4.31 / 4.51 / 4.75 / 4.76 / 4.81 | Pass |
| Checkbox, unchecked border `border-control-strong` `#6b7280` | card / elevated | 3.28 / 3.12 | Pass (R-42; was white/20% = 1.92) |
| Radio glyph, off `text-muted` | card | 6.19 | Pass |
| Binary toggle selected indicator: inset 1px `brand` ring | card fill | 4.31 | Pass (R-43) |
| Sort icon (`currentColor` = `text-muted`) | header | 5.87 | Pass (R-44; was `#475569` = 1.99) |
| Action icons `#64748b` | card / stripe / hover-2% | 3.33 / 3.25 / 3.16 | Pass. Icons turn white on button hover |
| Chevrons `#6b7280` | card / sunken | 3.28 / 3.62 | Pass |
| Status dots: success / warning / error | card | 8.25 / 9.51 / 4.22 | Pass (and always labelled) |
| Chart categories: cat1 / cat2 / cat3 / cat4 | card | 3.56 / 3.03 / 8.98 / 6.70 | Pass against the card |
| Adjacent chart segments (e.g. cat1 vs cat2 1.17; good vs bad 1.24) | each other | < 3 | Mitigated: **2px card-colored gaps** between all adjacent segments (R-45), so every segment is bounded by the card |
| **Recessed field edge** (inputs, textareas, search, sunken select, multi-select, rich picker, attach field): fill `#161a1e` | card / elevated / shell / overlay | 1.10 / 1.16 / 1.05 / 1.00 | **Below 3:1: exception A-1** (§9.8). The strongest depth cue, the inset-shadow core (`#060608`), reaches 1.28:1 vs the card; the bottom highlight 1.12:1. Shadows do not reach 3:1. Boundary mode: 1px `#6b7280` = 3.12–3.62:1 |
| Field error ring `#ef4444` / focus outline `#3b82f6` | fill / card | 4.65 / 4.22 and 4.76 / 4.31 | Pass |
| Raised filter trigger vs shell | — | 1.05 | **Not required**: like a text button, it is identified by its value text and chevron (≥ 3.3:1). Boundary mode adds a border |
| Active raised tab / active nav item | fill vs track ≈ 1.05–1.2; white vs inactive muted text 2.56 | — | **Pass** through a non-color cue: label weight 600 plus `aria-selected` / `aria-current` (R-56). Fill and color alone would fail |
| Accent tab active fill `brand-strong` | accent track | 3.38 | Pass |
| Current page button `brand-strong` | card | 3.07 | Pass (also `aria-current`) |
| Selected table row (`brand-tint-10`) vs card | — | 1.13 | Mitigated: the checked checkbox is the non-color cue |

### 9.3 Increased-contrast mode (`prefers-contrast: more`) [STANDARDIZED, R-42]

The original visuals draw the edges of fields, triggers, tracks and pills with surface and shadow only, which stays below 3:1 (§9.2). For users who request more contrast, and for products that must pass 1.4.11 strictly, a **boundary mode** adds 1px borders in `border-control-strong` `#6b7280` (3.12–3.62:1 on every surface). It turns on automatically with `@media (prefers-contrast: more)`, or manually with `[data-contrast="more"]` on `<html>`. No other visual changes (§4 has the CSS).

This is an **optional higher-contrast treatment**, separate from the original visual specification. Products that must meet a strict reading of SC 1.4.11 for every user can turn it on by default (D-1).

Elements that gain a boundary: text inputs, textareas and search fields, sunken and raised select triggers (including multi-select, rich picker and date range), the field with attach button, segmented tab tracks **and active pills**, the binary toggle container, radio cards, the active nav item, and secondary/ghost buttons.

### 9.4 Status, color and meaning

- Never use color alone (SC 1.4.1). Status = dot or badge **plus** text. Charts encode categories with color plus legend and labels/tooltips. Selected states add a visible non-color cue **and** an `aria-*` state as well as a fill: menu option → check glyph; binary toggle → inset ring; radio card → filled radio glyph; checkbox → check; raised tab and nav item → weight 600; accent tab and current page → a ≥ 3:1 fill; interactive KPI → inset ring; selected row → checked checkbox.
- Required fields: the asterisk is paired with `required` / `aria-required`. The form intro states "* Required" when a form mixes optional and required fields.

### 9.5 Keyboard

| Component | Keys |
|---|---|
| Everything interactive | Reachable with Tab in visual order; visible focus outline (§2.7); no keyboard traps except inside modal overlays |
| Buttons, links, clickable cards | Enter (and Space for buttons) activate |
| Select / listbox | §5.10 table (active descendant, arrows, Home/End, type-ahead, Escape) |
| Segmented tabs (tablist) | Arrow Left/Right move and activate (wrapping; swapped in RTL); Home/End; one tab stop for the whole group |
| Radio cards, binary toggle | Arrow keys move the selection; one tab stop for the group |
| Table | Tab moves through interactive elements only (row links, sort buttons, checkboxes, actions); the scroll region is focusable and scrolls with arrow keys |
| Collapsible section | The header button toggles with Enter/Space; `aria-expanded` |
| Sidebar | Expands when any item has focus; `aria-current="page"` on the active item |
| Overlays | Focus moves inside and is trapped; the rest of the page is `inert`; Escape per R-21; focus returns to the opener (fallbacks in §5.55) |
| Tooltips | Shown on focus; dismissed with Escape (§5.49) |
| Chart marks with tooltips | Focusable (`<button>` with `aria-label`); the tooltip shows on focus |

### 9.6 Semantics, truncation, motion

- Landmarks: `<header>`, `<nav aria-label>`, `<main>`. One `<h1>` per page; `<h2>` for card/panel titles.
- Tables per §5.41: `<caption>`, `th scope`, `aria-sort`, labelled scroll region.
- Forms: `<label for>`, `aria-invalid`, `aria-describedby`; errors in `role="alert"`; toasts and dynamic counts in `role="status"`.
- Truncated text must remain available: the full text stays in the DOM, and sighted users get it via a focusable element's tooltip or a detail view (§5.41, §5.49). `title` alone is not sufficient (R-40).
- Respect `prefers-reduced-motion` (§4). Nothing flashes more than 3 times per second.
- Text must reflow at 320 CSS px wide (400% zoom) without loss of content (SC 1.4.10). The `xs` layouts in §8 satisfy this; wide tables scroll inside their labelled region, which is permitted for data tables.
- Text spacing overrides (SC 1.4.12) must not clip content. Avoid fixed heights on text containers; the only fixed heights are controls with single-line labels, and they use `min-height` in code.

### 9.7 Target size (SC 2.5.8)

Every interactive target is ≥ 24×24 CSS px; the smallest are 28px icon buttons and 32px pagination buttons. At the `sm`/`xs` breakpoints, targets are ≥ 44×44 (§8.8).

### 9.8 Accessibility issue register

Every issue found in the audits, with its classification. A documented exception is **not** treated as a pass: confirmed failures were fixed in the canonical specs and tokens above.

| ID | Issue | Classification | Resolution | Status |
|---|---|---|---|---|
| A-1 | Recessed fields (and sunken select triggers) have no visible boundary: fill vs surroundings 1.00–1.16:1, strongest shadow cue 1.31:1 | **Documented exception, not a pass.** SC 1.4.11 requires 3:1 for visual information *required to identify* a component. A strict reading treats the extent of an empty field as such information, so this can fail an audit. A reading that accepts identification by a persistent visible label may pass it. This document does not claim compliance | Original depth-only look kept as the default (R-56 revised, R-58). Mitigations: a visible label above every field (MUST, §5.8); placeholder 4.78:1; focus outline 4.76:1; error ring 4.65:1; boundary mode automatic under `prefers-contrast: more`. Accessible alternative: boundary mode on by default (`data-contrast="more"`) | **Open exception**: designer + accessibility approval (D-1) |
| A-1b | Raised filter triggers, secondary/ghost buttons and the toggle container have no 3:1 boundary | **Not a failure**: they are identified by their text (and chevron), which SC 1.4.11 accepts, as for text buttons | Boundary mode (§9.3) for users who request more contrast | Acceptable; no change |
| A-2 | The active raised tab and nav item differed only by fill (≈ 1.05–1.2:1) and text color (2.56:1 between states) | **WCAG failure**, SC 1.4.1 / 1.4.11: the state was shown by color differences below 3:1 | Selected label weight 600 (a non-color cue) plus the ARIA state (R-56) | **Fixed** (visual approval: D-2) |
| A-3 | Heatmap text at ramp positions 0.56–0.59 reached 4.27–4.47:1; the hover brightness filter lowered white-text contrast further | **WCAG failure**, SC 1.4.3 | Fills snapped out of the band; white ≤ 0.55, ink ≥ 0.59; a hover line replaces the brightness filter (R-56) | **Fixed** (visual approval: D-10) |
| A-4 | Toasts with an action (Undo) disappeared after 2.5s | **WCAG failure**, SC 2.2.1 | Action toasts have no timeout; all timers pause on hover and focus (R-56) | **Fixed** |
| A-5 | The select trigger used `aria-activedescendant` on a plain button | **WCAG failure**, SC 4.1.2: the attribute is not supported on a button, so the active option was not announced | The trigger and in-menu search use `role="combobox"` (R-57) | **Fixed** |
| A-6 | Disabled controls at 40% opacity fall below 4.5:1 | **Not a failure** (exempt under SC 1.4.3) | §5 disabled rules require visible reasons | — |
| A-7 | 3D illustrations have no text alternative | **Not a failure** when decorative (always paired with a visible label) | §2.11-C rule 7 | — |
| A-8 | Source illustrations with baked-in English text (`illus.site-admin`) | **Limitation** for other locales (the text is not translatable) | Use only where decorative, or commission text-free versions (D-11) | Open (assets) |

---

## 10. AI AGENT DESIGN IMPLEMENTATION RULES

> These rules apply to any AI coding agent (or developer) that receives this file. They are strict about **visual identity and accessibility** (L1, L2) and deliberately flexible about **layout and UX** (L3, L4), which belong to the product being built.

### 10.1 Mandatory rules

1. **Read the entire design system before creating UI**, including the layer model (§0.1), the resolution log (§11) and the open items (§15).
2. **Use only documented colors, typography, spacing, radii and shadows.** Every CSS value resolves to a `--ds-*` token from §3, or to a literal stated in a §5–§7 spec.
3. **Build components to their documented anatomy, dimensions and states** (§5). When you use a component, it looks and behaves as specified, including keyboard and ARIA behavior.
4. **Reuse defined components rather than inventing variations.** A button is §5.1, a card is §5.23–§5.26, a table is §5.41. Choose *which* component fits; don't restyle one into another.
5. **Follow the composition conventions that are invariant:** the §6.0 spacing relationships, label-above-field forms, secondary-left/primary-right footers, tables inside cards, one primary action per region.
6. **Preserve visual consistency across screens.** The same element looks the same everywhere.
7. **Never introduce arbitrary hard-coded design values.** No new hex colors, font sizes, radii, shadows or spacing. Density changes go through §2.13 only.
8. **Adapt content, structure and workflow to the new product.** Layout patterns (§6) are defaults with variants. Choose the one that fits the content, and record why when you deviate.
9. **Use semantic tokens instead of primitives** (`var(--ds-color-text-muted)`, never `#94a3b8`, in component code).
10. **Identify genuinely missing patterns and derive extensions systematically.** Check §5–§7 first. If something is missing, build it from L1 tokens and the closest L2 anatomy. Mark it in code with `/* DS-EXTENSION: <name> — derived from §5.x */` and list it in your summary.
11. **Never assume the source repository, assets or Figma files are available.** Use the §2.11 fallbacks for missing illustrations. Never generate imitation 3D art.
12. **Verify the implementation against the specs** before finishing, using the §13 checklist (dimensions, colors, type, states, focus, contrast, responsive).
13. **Accessibility is mandatory:** WCAG 2.2 AA per §9. Don't remove focus outlines, don't convey state by color alone, don't rely on `title` tooltips.
14. **Dark-only.** No light theme unless the product owner supplies a light token set.
15. **Canonical values only.** Values described as historical in §11 are not options.
16. **Do not copy source-product content.** Labels, terminology, workflows and data from the source app are not part of the system.
17. **DEOC uses depth-based field styling.** Standard text inputs and search fields use recessed dark surfaces with inset shadows. Raised dropdown/filter triggers use lighter surfaces and external shadows. Do not introduce visible default borders unless the specific component variant explicitly requires them. Preserve focus and error indicators and account for accessibility requirements (exception A-1, boundary mode §9.3). Never confuse the two variants:

    | Variant | Components | Fill | Shadow | Default border |
    |---|---|---|---|---|
    | **Recessed** | text, password and search inputs (header and in-menu), textarea, sunken select (forms), multi-select, rich picker, field with attach button | `surface-sunken` `#161a1e` | `shadow-sunken` (inset) | none |
    | **Raised** | filter select (toolbars, card headers), date-range trigger | `surface-card` `#1d2328` (hover `#232a30`) | `shadow-trigger` (outer + top highlight) | none |

### 10.2 Decision hierarchy (when several options could apply)

1. **Accessibility (§9)** overrides every other rule.
2. **An explicit L2 spec** (§5, §7) for the component you are using.
3. **The resolution log (§11)** for any value that once conflicted.
4. **The §6 pattern whose *job* matches the screen.** Choose its default, or a listed variant whose "when" condition applies.
5. **The closest component by purpose**, not appearance (pick-one-of-3 → radio cards; on/off inside a form → binary toggle; instant setting → switch).
6. **Role-based token rules** (§2): surfaces by elevation, text by importance, spacing by relationship.
7. **The more restrained option:** fewer colors, less elevation, the smaller type step, an existing token.
8. Still ambiguous → build the extension per rule 10 and **flag it for human review**.

### 10.3 Defaults and when to deviate

| Question | Default | Deviate when |
|---|---|---|
| Where do filters go? | Page header if they scope the whole page (§6.3) | They scope one card (→ card header) or there are many (→ filter panel) |
| Where does create/edit happen? | Slide panel (§5.46) | Long or URL-worthy forms (→ full page), 1–3 fields (→ modal), a single value (→ inline edit) (§6.10) |
| How to confirm a delete? | Confirmation dialog with Cancel autofocused (§5.45) | The action can be undone (→ do it and show a toast with "Undo") **[PRODUCT DECISION]** |
| How to show success? | Toast (§5.48) | The result is already visible on screen (→ no toast needed) |
| How to show status in a table? | Dot + label, left-aligned | — (no deviation: accessibility) |
| How to show a category? | Solid tag (§5.29) | — |
| Big number? | KPI card, if page-level and comparable (§6.4) | It belongs to a chart, record or row (→ inline variants in §6.4) |
| Card size? | Content-driven, in a responsive grid | — (never fixed widths without a reason) |
| Select style? | Sunken in forms; raised in toolbars (§5.9) | — |
| Table numeric alignment? | Right, tabular numerals | — |
| Density? | Dense | Touch-first or low-density products (→ comfortable, §2.13) |

---

## 11. Inconsistency Resolution Log

Every conflict found while auditing the source application. **Choices were made on merit** (visual consistency, hierarchy, usability, component behavior), **not by frequency of use**. Several canonical values below deliberately overrule the most common implementation.

**Status legend**

| Status | Meaning |
|---|---|
| **Verified** | Not a real conflict. The values were checked and serve different roles, or the rendered value is confirmed correct. Documented as-is |
| **Standardized** | A real conflict, resolved. The canonical value is used throughout §2–§9 |
| **Needs Review** | Resolved with a recommendation (which is used in this document), but it involves a product or brand judgement that the design owner should confirm |

**Basis legend.** *Existing pattern* = the canonical value already existed in the app. *New decision* = a value or rule introduced to fix a defect that none of the existing implementations fixed.

The "Where it appears" column names the screen or component in the source app, so the decision is traceable. You don't need access to those screens to implement the canonical value.

| ID | Topic | Conflicting values / implementations | Where each appears | Canonical | Rationale | Basis | Status |
|---|---|---|---|---|---|---|---|
| R-01 | Primary button hover | (a) the hover referenced a token that was never defined, so **there was no visible hover**; (b) a token file listed `#1d4ed8` as "brand darker" but nothing used it | (a) all primary buttons; (b) the TS token constants | Hover bg `#1d4ed8` | Every other variant has a hover. A primary button without one feels unresponsive and breaks the universal state matrix. One step darker keeps the label contrast (white on #1d4ed8 = 6.7:1) | New decision (using a declared but unused value) | Standardized |
| R-02 | Page header background | the class referenced an undefined token (renders transparent); the token file declared `rgba(17,20,24,0.9)` | Page header on every page | Transparent over `bg-shell` + 12px backdrop blur | Content never scrolls under the header (it is a sibling above the scroll area), so a fill would be invisible anyway. Transparent is the rendered truth and keeps the panel seamless | Existing (rendered) | Verified |
| R-03 | Select trigger style in forms | (a) raised trigger (card surface + drop shadow); (b) sunken trigger (input surface + inner shadow) | (a) single-select fields in every create/edit panel, and all toolbar filters; (b) multi-select and the rich user picker in forms | Forms = **sunken**; toolbars = **raised** | A form is a column of editable fields; mixing raised and sunken fields makes some look like buttons and breaks scanning. Sunken = "you put data here" is the system's affordance. Raised stays for view controls next to buttons. **This overrules the majority** (raised was used in most forms) | New decision | Standardized |
| R-04 | Control height | 42px (bordered buttons: 40 + 2×1px border) vs 40px (ghost/tonal buttons, inputs, selects) | Primary/secondary/danger buttons vs everything else | **40px** for all md controls, border included | A button next to a 40px input or select in a header or form row must align exactly; 2px misalignments are visible on dark UIs with light borders | Existing (inputs) applied to buttons | Standardized |
| R-05 | Card radius | 16px, 20px, 24px, 32px on cards of the same role; a 24px nested card inside a 16px parent | 20: KPI, table card, summary strip, dialog, shell. 16: dashboard cards, section cards, entity cards, detail table card. 24: nested section card, media card. 32: media modal | **20px** for every top-level card, dialog and modal; **16px** for nested cards | On the dashboard a 20px KPI card sat above 16px chart cards, which reads as two systems. A child with a larger radius than its parent breaks concentric corners. One radius per role is easiest to apply correctly | New decision (20 and 16 both existed; the role mapping is new) | Standardized |
| R-06 | Second card color | `#182027` vs `#1d2328` | `#182027`: the matrix chart card and the master table card on the dashboard. `#1d2328`: every other card | `#1d2328` only | The tint difference is ~3% and carries no meaning; next to identical cards it reads as a bug. One card surface keeps the elevation model simple | Existing pattern | Standardized |
| R-07 | Card shadow | (a) CSS token `0 2px 24px rgba(0,0,0,0.35)` (declared, never used); (b) two-layer lift + 1px highlight (used); (c) a deeper "float" shadow on one table card | (a) none; (b) KPI, table, section, dashboard and entity cards; (c) the detail page's table card | (b) as `--ds-shadow-card`; (c) reserved for media cards only | (b) is what renders on most surfaces and gives the signature top highlight. One table card with a heavier shadow made it look elevated above its peers for no reason | Existing pattern | Standardized |
| R-08 | Section & card spacing | vertical section gap 24px vs 20px; horizontal card gap 16px vs 20px | 24: live, list, detail and user pages. 20: dashboard, grouped-list pages. 16: KPI rows, entity grid. 20: dashboard card rows, media grid | Vertical **24px** everywhere; horizontal **16px** for tiles (padding ≤20) and **20px** for large cards (padding 24) | A gap between stacked cards should never be smaller than the padding inside them (24px), or the cards visually merge. The horizontal gutter scales with card padding so dense tiles stay compact and big chart cards breathe. Dashboards move from 20px to 24px vertically | New rule built on existing values | Standardized |
| R-09 | Form row gap | 40px vs 24px | 40: most two-column create panels. 24: user form, product form, single-column edit form | **24px** rows; **40px** only between topic groups | 40px rows separated a field from its neighbours more than from its label's own group, weakening proximity. They also pushed 8–10-field forms into scrolling. 24px still clearly exceeds the 6px label gap, and the 40px gap remains as a deliberate group separator. **Overrules the majority** | New decision | Standardized |
| R-10 | Pagination | (a) shared: 6px radius, "Showing 1 – 8 of 24 users", numbers weight 500, aria labels, focus rings, all pages shown; (b) custom: 8px radius, "1 to 6 of 18 lines in …", weight 600, max 3 page buttons, no labels or focus ring | (a) list pages; (b) the detail page | (a), plus an ellipsis rule for more than 7 pages | (a) is accessible and consistent; (b) dropped focus visibility and labels and capped pages arbitrarily | Existing pattern | Standardized |
| R-11 | Status badge | (a) shared badge: padding 4/12, 14/20, pill; (b) custom: padding 5/11, 14/18; (c) a 4px-radius rectangle variant | (a) media cards; (b) entity cards; (c) one status label in a table | (a), always pill | One shape = one meaning. The rectangle variant collided with the 4px solid tag shape, which means "category", not "status" | Existing pattern | Standardized |
| R-12 | Placeholder color | `#475569` (rendered) vs `#8e9296` (declared, unused) | `#475569`: every input; `#8e9296`: token file only | **`#64748b`** | `#475569` measures 2.3:1 on the input surface, too faint to read the hint text. `#8e9296` (5.6:1) is nearly the form-label color, so empty fields looked filled. `#64748b` (3.7:1) is readable yet clearly weaker than values (white) and labels (#94a3b8). `#475569` is kept as `text-faint` for denominators | New decision | Superseded (R-46) |
| R-13 | Legend label color | `#64748b` vs `#94a3b8` | `#64748b`: all chart legends; `#94a3b8`: legend values, other labels | `#94a3b8` (`text-muted`) | Legends are essential for reading a chart; at 3.3:1, `#64748b` fails AA for 14px text (muted is 6.2:1). Muted keeps them visually subordinate to the title while passing contrast | New decision | Standardized |
| R-14 | Validation error color | `#f87171` vs `#ff5825` | `#f87171`: form field errors, date range error, picker error. `#ff5825`: the upload-field error | `#f87171` | One error color for every validation message. `#ff5825` is the chart "bad/stopped" color; reusing it for form errors blurs data meaning and UI feedback | Existing pattern | Standardized |
| R-15 | Status in tables | dot only (some with screen-reader text, some with `role="img"`, some with neither) | Status columns on product, user, camera, device and line tables | **Dot + visible label**; dot-only allowed only with `aria-label`, a §5.49 tooltip and an on-screen legend | Color-only status fails WCAG 1.4.1 and is unreadable for color-blind users; the label costs ~60px of column width | New decision | Standardized |
| R-16 | Count pill size | 14px vs 12px text | 14: collapsible section headers; 12: the detail page's table section header | 14/18 700 | The pill sits next to a 20px title; 12px looked detached. One pill spec everywhere | Existing pattern | Standardized |
| R-17 | Disabled opacity | 0.4 vs 0.5 | 0.4: buttons, icon buttons, pagination; 0.5: radio card group | 0.4 | One disabled treatment, so disabled states read the same across controls | Existing pattern | Standardized |
| R-18 | Menu surface | (a) radius 10, card surface, menu shadow; (b) radius 8, **input (sunken) surface**; (c) radius 8 with a custom lighter shadow | (a) select menus; (b) multi-select menu; (c) rich user picker menu | (a) for every listbox menu; popovers (non-list panels) radius 8 | A floating menu is elevation level 3. Painting it with the sunken input color contradicts the elevation model. Matching the 10px trigger radius makes the menu read as part of the control | Existing pattern | Standardized |
| R-19 | Page title line height | token 32px vs rendered 28px | Token vs the page header | 28px | It renders at 28px in the 76px header, a single line; 32px would be unused space. The 24px title token now carries 28px | Existing (rendered) | Verified |
| R-20 | "Brand text" color | `#93c5fd` vs `#60a5fa` under the same name | `#93c5fd`: summary-strip eyebrow, menu "+ Add" row, ID chips. `#60a5fa`: link hover, active stepper subtitle | Two tokens: `brand-text` #93c5fd (static brand-tinted text) and `link` #60a5fa (interactive hover) | They serve different roles; one name for two values caused the conflict | Existing pattern (split) | Verified |
| R-21 | Overlay dismissal | backdrop click, **and Escape**, did nothing; only the overlay's own buttons closed it | All modals, dialogs and slide panels | Backdrop: never closes. Escape: closes unless there are unsaved edits, otherwise it asks to discard. Focus trapped and restored | Ignoring the backdrop protects form data (kept). Ignoring Escape strands keyboard users and violates the dialog pattern users expect; the dirty-check keeps the original intent of never losing work | Partly existing, partly new decision | Standardized |
| R-22 | Panel footer "Back" button | secondary vs ghost | secondary: most panels; ghost: the product create panel | Secondary | The footer pair needs two visible button shapes; a ghost "Back" reads as plain text beside a solid primary | Existing pattern | Standardized |
| R-23 | Off-scale font sizes | 11px, 12px (as a literal), 18px | 11: tooltip header, matrix axis. 12 literal: dot legend. 18: summary-strip title | 11px and 18px kept as named exceptions; the 12px literal → `label` token | 11px is needed for dense axes; 10px is too small and 12px collides. The 18px title sits between 16px values and 20px card titles; 20px would overpower the KPI values on the same screen | Existing pattern | Standardized (designer decision, rev. 3: keep 18px as a named exception) |
| R-24 | Hard-coded duplicate colors | hex literals equal to tokens (`#cbd5e1`, `#94a3b8`, `#3b82f6`, `#1d2328`, `#161a1e` …) used instead of tokens | Entity cards, stepper, picker, pagination, panels | Tokens only | Same values, so no visual change; literals hide intent and drift over time | Existing pattern | Verified |
| R-25 | Media card title style | 20/26 600 -0.25px vs `card-title` 20/24 600 -0.4px | Media card header vs every other card title | `card-title` | Same role, same style; the 2px line-height difference had no purpose | Existing pattern | Standardized |
| R-26 | Badge dot glow | the badge dot referenced a color that wasn't in the theme (glow may not render) vs explicit glow values on status dots | Status badges vs status dots | Explicit `shadow-status-*` tokens on both | The glow is the system's status signature; it must render reliably | Existing pattern | Standardized |
| R-27 | Input radius | 10px vs 8px vs 12px | 10: text inputs and selects. 8: the field-with-attach input and its button. 12: the rich picker trigger | 10px | All 40px controls share one radius, so mixed rows align visually | Existing pattern | Standardized |
| R-28 | Tooltip radius | 9px vs the 8px scale step | Rich chart tooltip | 8px | 9px was the only off-scale radius; a 1px difference is imperceptible but adds a token | Existing scale | Standardized |
| R-29 | Two reds for "stopped" | `#ef4444` (status dots) vs `#ff5825` (status bars, chart legends, row tint) | Dots in tables and strips vs dashboard status bars, legends and row tints | Status indicators (dots, badges) use the error red; data series and aggregate bars use the critical orange-red | Dots must match badges and form errors; chart series need a hue that separates from the green "good" series and the heat scale's top stop, and `#ff5825` is that stop | Existing pattern (roles clarified) | Verified |
| R-30 | Segmented tab tracks | track `#111418` vs `#161a20` + white/4% border; tab padding/weight differ | Page-level category tabs vs in-card view tabs | Both kept as the **raised** and **accent** variants | They have distinct jobs (page filter with counts vs compact chart/table switch) and distinct visual weight | Existing pattern | Verified |
| R-31 | Abbreviated KPI labels | full labels vs truncated abbreviations ("Products An.") | Dashboard KPI row | Complete labels; abbreviate only when the meaning remains clear (standard abbreviations); otherwise reword; a truncated label is exposed in an accessible tooltip | Unexplained abbreviations hurt comprehension | New decision | Standardized (designer decision, rev. 3) |
| R-32 | Responsiveness | none (fixed desktop layout, no breakpoints) | Whole app | Full responsive rules (§8) | A portable system must not inherit a single-device limitation; every rule in §8 reuses existing tokens and only changes layout | New decision | Standardized |
| R-33 | Media annotation green | `#22c55e` vs success `#34d399` | Detection frame on images vs all other success states | Keep `#22c55e` as `detect-positive`, for annotations on imagery only | Annotations sit on 50%-opacity photos; the more saturated green holds up on busy imagery where the lighter success green washes out | Existing pattern | Standardized (designer decision, rev. 3: preserve for imagery only) |
| R-34 | Scrolled header shadow | applied consistently to the page header, panel header and pinned table header | Those three components | `shadow-header-scrolled`, shown only when scrolled | Consistent already; recorded for completeness | Existing pattern | Verified |
| R-36 | Tag fill contrast | white text on the green tag `#569d3f` = 3.3:1 and on the amber tag `#9d6f3f` = 4.4:1 (purple, blue and rose pass) | Role tags on the user list; module tags on the activity log | Green **`#457e32`** (4.9:1) and amber **`#95693c`** (4.8:1); hue unchanged, only darkened | Tags carry essential category text at 14px/500, which needs 4.5:1. Darkening keeps the muted, desaturated family look while passing AA | New decision | Standardized (designer decision, rev. 3); visual verification pending (D-4) |
| R-35 | Search box focus inside menus | ring suppressed in menus vs shown in toolbars | Menu search band vs header search | ~~Keep both~~ Superseded by R-37: the menu search shows the normal ring | Removing the only focus indicator fails SC 2.4.7 | Existing pattern | Superseded (R-37) |
| R-37 | Focus rendering | (a) `box-shadow` rings, 1px or 2px depending on component; (b) a global `:focus { outline: none }`; (c) no ring at all on search boxes inside menus | All interactive components; the menu search band | **2px `outline`**, offset 2px (default), 0 (fields, tabs), −2px (clipped or edge-to-edge items), white on data colors. `outline: none` only for `:focus:not(:focus-visible)` | Box-shadow rings vanish in forced-colors mode and stack awkwardly with component shadows. A 1px ring is easy to miss; 2px is the minimum reliable indicator. Removing the in-menu ring left keyboard users without a cue. **Supersedes R-35** | New decision | Standardized |
| R-38 | Table structure & alignment | (a) empty spacer columns between content columns to equalize gaps; (b) numbers and status centered; (c) clickable `<tr tabindex>` rows; (d) `title`-only truncation | All tables | Semantic table: no spacer columns; 16px cell padding gives the gaps; `th scope`, caption, labelled scroll region; **numbers right-aligned** with tabular numerals; status left-aligned; activation via a link in the row-header cell; sticky header on `th` with `scroll-padding` | Spacer columns add empty cells that screen readers announce and break column counts and `colspan`. Centered numbers can't be compared by magnitude. A focusable `<tr>` has no role. The visual look (padding, header style, zebra, row height) is unchanged | New decision | Standardized |
| R-39 | Blue used as text / under text | (a) `#3b82f6` as text (link actions, tonal buttons, picker footer, role captions) = 4.31:1 on card; (b) white on the `#3b82f6` accent-tab fill = 3.68:1 | Link actions, tonal button, picker footer, entity card role caption; accent segmented tabs | Blue text uses `link` `#60a5fa` (6.24:1), hover `#93c5fd`; tonal button text `brand-text` `#93c5fd` (6.78 / 5.80:1 on default / hover); accent tab active fill `brand-strong` `#2563eb` (white 5.17:1) | Both failed SC 1.4.3 for 14px text. The replacements stay in the same blue family. The accent tab becomes one step darker, matching the primary button | New decision | Standardized |
| R-40 | Tooltips & truncated text | the native `title` attribute was the only way to read truncated text, icon-button names (visually), collapsed nav labels and chart values | Icon buttons, collapsed sidebar, truncated table cells, chart bars/donut | An accessible tooltip (§5.49) on hover **and** focus, dismissible with Escape, hoverable; truncation only where the full value is reachable | `title` never appears on keyboard focus or touch and fails SC 1.4.13 expectations | New decision | Standardized |
| R-41 | Disabled controls | disabled Save buttons with no explanation; `pointer-events: none` hid them from hover/focus | Panel footers, dialogs | Keep visible; prefer `aria-disabled` + a visible reason; for disabled-until-valid Save, show "Complete all required fields to save." | Users (and screen-reader users in particular) couldn't learn why an action was unavailable | New decision | Standardized |
| R-42 | Control boundaries | unchecked checkbox border white/20% (1.92:1); field and pill boundaries ≈ 1.0–1.2:1 | Multi-select options, fields, triggers, tabs, nav | Unchecked checkbox border `border-control-strong` `#6b7280` (3.28:1). Boundary mode (`prefers-contrast: more` / `data-contrast="more"`) adds `#6b7280` borders to fields, triggers, tracks, active pills and radio cards | A checkbox's state is unreadable without a visible box. Boundary mode meets 1.4.11 strictly without changing the default identity; making it the default is open item A-1 | New decision | Standardized |
| R-43 | Binary toggle selected state | selected = slightly lighter fill (≈1.1:1) + white text | Status toggles in forms | Adds an inset 1px `brand` ring (4.31:1) to the selected option | The selection *is* the data in a form; it needs a 3:1 indicator | New decision | Standardized |
| R-44 | Sort icon color | `#475569` (1.99:1 on the header) | Sortable table headers | `currentColor` (`text-muted`, 5.87:1) | The arrow is the only cue for sort direction | New decision | Standardized |
| R-45 | Adjacent chart segments | segments touched directly: cat1/cat2 1.17:1, good/bad 1.24:1, running/stopped 1.64:1 | Donut, stacked bars, segmented status bar | 2px gaps in the card color between all adjacent segments | Each segment is then bounded by the card (≥ 3:1 for every series color), satisfying SC 1.4.11 without changing the palette | New decision | Standardized |
| R-46 | Low-contrast greys | tertiary `#64748b` (3.33:1), placeholder `#64748b` (3.68:1; was `#475569`, 2.31:1, see R-12), faint `#475569` used for denominators (2.09:1) | Captions, counts on tabs, denominators, placeholders | `text-tertiary` → `#8695aa` (≥ 4.51:1 on every surface, including hovered rows); `text-placeholder` → `#77879d` (4.78:1 on sunken); `text-faint` → decorative only | All three carried real information below 4.5:1. The new values keep the order primary > secondary > muted > tertiary > placeholder. **Supersedes R-12** | New decision | **Needs Review**: visual check that tertiary (#8695aa) still reads as a step below muted (#94a3b8) |
| R-47 | Radio card unselected label | `#475569` (2.09:1) | Radio cards | `text-muted` (6.19:1) | Unselected options are still choices the user must read | New decision | Standardized |
| R-48 | Stepper upcoming steps | whole step at 50% / 40% opacity (title 3.9:1; subtitle 1.6:1) | Multi-step panels | Full opacity; title `text-muted`, subtitle `text-tertiary`; the index box keeps its inactive style | Opacity dimming failed contrast; color tokens give the same hierarchy | New decision | Standardized |
| R-49 | Universal layout rules | earlier drafts mandated: every form in a slide panel, every big number as a KPI card, all filters in the header, fixed card widths and column counts | §6, §10 | Layout is L3 (defaults + variants + product decisions); fixed widths are examples | Layout choices from one product are not identity; enforcing them would make other products worse without making them more consistent | New decision | Standardized |
| R-50 | Density | the source had one dense layout | — | Dense default + derived comfortable mode (§2.13) | Derived mechanically (+4px sizes, one spacing step), so it introduces no new values | New decision (extension) | Standardized |
| R-51 | Radius hierarchy review | (a) one 20px radius for all top-level surfaces including dialogs/modals; (b) popovers at 8px while menus anchored to the same controls were 10px | §2.5; date popover, generic popover | (a) **Retained**: 20px surface radius for cards, dialogs and modals; role table in §2.5. (b) Popovers → 10px (`radius-control`) | (a) Overlay hierarchy is already carried by shadow, backdrop and position; a second large radius would add a value without meaning, and the existing roles are concentric. (b) A panel anchored to a 10px control should share its corner, as menus already do | Existing values; (b) is a new decision | Standardized |
| R-52 | Rigid dimensions | fixed `height` on controls (40/28/48), 76px KPI card height, 180px fixed header/footer button widths, 440px dialog width, fixed tab-track widths, px-only type | Buttons, inputs, selects, toggle, pagination, KPI, page header, dialogs, panels, tabs | Four dimension types (fixed / minimum / maximum / content-driven, §2.8). Controls, rows, headers and KPI cards use **min-height**; overlays use **min(max, 100%)**; button widths are content-driven with an optional 180px **min-width**; rem implementation allowed (§2.3) | Fixed heights clip enlarged text (SC 1.4.4) and long labels; fixed widths clip translations. Minimums keep the identical default look | New decision | Standardized |
| R-53 | Mandatory truncation | KPI labels/values, card titles, dashboard titles, nav, tabs and page titles were "single line + ellipsis" | §2.3 type table, §5.23, §5.25, §8.7 | A single long-content policy (§2.3): never truncate meaningful values/labels/messages; wrap titles; clamp/truncate only with recovery. Refines R-31: complete KPI labels, now wrapping instead of truncating | Truncating a KPI value or label hides the very information the component exists to show | New decision | Standardized |
| R-54 | Primitive names | ~66 primitive names written as `--ds-*` tokens but never declared in §3 | §2.1 | Primitives are reference labels without the `--ds-` prefix; only `--ds-tag-*` and `--ds-heat-*` are real tokens | A developer copying a documented `--ds-neutral-800` would get an undefined variable. Automated validation found it | Correction | Standardized |
| R-55 | Untokenized literals in examples | scrollbar colors, skeleton fill, pagination current-page border/text, tag text, accent-track border written as raw values; spacing written as raw px | §4, §5.29, §5.39, §5.40, §5.50; all §5–§7 examples | New tokens `border-on-brand`, `border-track`, `scrollbar`, `scrollbar-hover`, `skeleton`; spacing literals replaced by `--ds-space-*` wherever a token exists | Raw values in examples get copied verbatim and drift; tokens also make density and rem conversion work | Correction | Standardized |
| R-56 | Accessibility failures carried as exceptions | (a) sunken fields 1.10:1, no border; (b) active tab/nav shown only by fill and a 2.56:1 text-color change; (c) heatmap text 4.27–4.47:1 at ramp 0.56–0.59, plus hover brightness; (d) action toasts timed out | §5.5, §5.9, §5.11, §5.18, §5.39, §5.37, §7.7, §5.48, §9 | (a) **Revised in rev 6:** the default 1px `border-control-strong` field border (rev 5) is **removed**. It contradicted the source's depth-only fields and the system's identity. Fields stay borderless; the 3:1 edge moves to boundary mode (§9.3); the shortfall is documented as exception A-1 with mitigations and an accessible alternative. (b) Selected label weight 600; (c) snap fills out of the band, text threshold 0.55 / 0.59, hover line; (d) no timeout for action toasts, pause on hover/focus | (b)–(d) were confirmed failures fixed with the smallest visible change. For (a), a grey outline on every field changed the visual language more than any other fix; the trade-off is recorded openly instead of being hidden in the default look | New decision; (a) revised | (b)–(d) Standardized; (a) **Needs Review** (D-1) |
| R-57 | Specification consistency and portability | spec tables vs examples: placeholder grey `#64748b` in §5.5; fixed heights in §5.5, §5.9, §5.13, §5.18, §5.39, §5.43; truncated labels in §5.13 and §5.43 against §2.3; card-title `nowrap` in §4; Save disabled in §5.8 against R-41; `dialog` vs `alertdialog`; a usable sidebar under `aria-modal`; nav labels "wrap" (§5.52) vs `nowrap` (§5.37); `aria-activedescendant` on a button; "no px/rem mixing" vs "keep borders in px"; physical left/right in examples | §2.3, §4, §5, §8.5 | Section specs corrected to the §2.3 / §2.8 policies; behavior contracts added (§5.55); i18n and RTL rules added (§8.9); examples use logical properties | Where a spec table and its example disagreed, the value that satisfies the long-content, dimension and accessibility policies was kept | Correction | Standardized |
| R-58 | Field depth treatment, verified against the source | rev 5 documented a 1px grey border on recessed fields; the source has none | Source: `Input.tsx` (TextInput, Textarea, PasswordInput, SearchInput incl. the in-menu search), `MultiSelect.tsx`, `LabelFieldInput.tsx`, the rich user picker; `Dropdown.tsx` and `DateRangePicker.tsx` triggers | **Recessed** (no border): `#161a1e` + `inset 0 2px 4px 1px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.04)`. MultiSelect and the picker add `0 1px 2px rgba(0,0,0,0.05)`, invisible on these surfaces, so it is folded into `shadow-sunken`. Error: a 1px red ring (`ring-1`), i.e. `--ds-error-ring`. **Raised** (no border): `#1d2328`, hover `#232a30`, `--shadow-dropdown` = `shadow-trigger`. Focus: the source's 1px brand ring is replaced by the §2.7 outline (R-37). The source's single select was raised inside forms as well (R-03, D-18) | The system's identity is depth through surface and shadow; a default outline on fields was not observed anywhere in the source | Existing pattern (restored) | Verified |

### Open items

All open decisions now live in §15.1. Items marked **Needs Review** above are listed there with their recommendation, which this document already applies.

---

## 12. Worked examples (non-normative)

These show the four test products built from this file alone. Each one illustrates **one** valid composition; the layout choices are L3/L4 and may differ in a real product. Components and tokens (L1/L2) are as specified.

### 12.1 CRM dashboard

- **Shell:** §6.1. Sidebar sections "General" (Dashboard, Pipeline, Contacts, Companies) and "Admin" (Users, Activity Log).
- **Header:** "Dashboard"; filters: Owner (200px), Region (180px), date preset (180px), plus a custom date (240px) when "Custom Range" is chosen.
- **KPI row (5):** Open Deals · Pipeline Value · Won This Period · Win Rate (%) · Avg. Deal Size. Each is a KPI card with an icon tile.
- **Chart card (full width):** "Deals Won vs Lost". Stacked bars (won `#10b981`, lost `#ff5825`) + white dashed win-rate trend; accent tabs "Time Series | By Region" (282px); swatch legend.
- **Row (gap 20):**
  - a 594px donut card "Pipeline by Stage", using categorical colors in stage order;
  - a heatmap card "Win Rate by Rep & Segment" (flush), using the heat scale. Here high = good, so **reverse the stops**, and say so in the subtitle.
- **Flush card:** "Top Accounts" with a product filter (220px) + accent tabs; table with a 494px cap; status column uses dot + label.

### 12.2 Employee management table

- **Header:** "Employees"; search 366px ("Search by name, email, team or role"), Department filter 180px, Status filter 160px (with dots), primary "Add Employee" 180px.
- **Content:** raised segmented tabs "All Employees (248) | Engineering (92) | Sales (61) …", then a table card.
- **Table:**
  - Name: primary cell; two-line, with email as `small`.
  - Role: a solid tag (role → tag color mapping).
  - Team; Location; Status (dot + label, left-aligned); Open Tasks (right-aligned number); Last Active.
  - Actions: copy, edit, delete icon buttons.
- **Pagination:** "Showing 1 – 8 of 248 employees".
- **Add/Edit:** 820px slide panel, two-column form (rows 24px). Fields: Full Name, Email, Department (sunken select), Manager (rich picker), Start Date (date input), Status (binary toggle).
- **Feedback:** delete → confirmation "Delete Jane Cooper?" + danger "Delete Employee"; toast "Jane Cooper added".

### 12.3 Project management form

- **Surface:** "New Project" in an 820px slide panel. The title icon is an icon tile. The subheader is a stepper: "Basics · In progress" → "Team · Members & roles" → "Review · Summary".
- **Step 1 fields:**
  - Project Name (full width, required);
  - Client (sunken select) | Project Code (text input);
  - Start Date | Due Date;
  - Priority (radio cards: Low | Medium | High);
  - Tags (multi-select with a "+ Add New Tag" action row);
  - Budget (input with an "USD" suffix) | Estimate (input with an "h" suffix);
  - a callout explaining billing;
  - Description (textarea);
  - Status (binary toggle).
- **Footer:** secondary "Back" (left) + primary "Next ›" 180px (disabled until required fields are filled). Errors appear after the first submit.

### 12.4 Analytics dashboard

- **Header:** "Analytics"; filters: Property, Channel, date preset.
- **KPI row:** Sessions · Users · Conversion % · Bounce % · Avg. Session.
- **Line chart card [EXTENSION §7.5]:** "Traffic Over Time", categorical series per channel, with a swatch legend.
- **Row:** a donut "Traffic by Source" + a horizontal bar card "Top Pages" [EXTENSION §7.4].
- **Bubble matrix:** "Channel × Landing Page Conversion" (size = sessions, color = conversion, heat scale reversed for "high = good").
- **Status cards row:** "Integrations" with a running/stopped segmented bar + table.

---

## 13. Final QA checklist

Run this for every screen before considering it done.

**Foundations (L1)**
- [ ] Every color, size, radius, shadow and spacing value resolves to a `--ds-*` token or a §5–§7 spec literal.
- [ ] Font sizes are only 10/12/14/16/20/24, plus 11 (chart axis captions, tooltip header) and 18 (summary title).
- [ ] Weights are only 400/500/600/700.
- [ ] Density, if not dense, is set via `[data-density="comfortable"]` only.
- [ ] If implemented in rem: font sizes, line heights, control min-heights and spacing were converted together (§2.3).
- [ ] Dimensions follow their type (§2.8): controls, rows, headers and KPI cards use `min-height`; overlays use `min(max, 100%)`; only Fixed items use `height`.

**Components (L2)**
- [ ] Controls use `--ds-size-control*` (40/28/48 dense); icon buttons 36/28.
- [ ] Cards: radius 20 (16 nested), `shadow-card`, no border, bg `surface-card`.
- [ ] Tables: semantic (`caption`, `th scope`), no spacer columns, numbers right-aligned with tabular numerals, uppercase 12px headers, zebra at white/1%, labelled scroll region.
- [ ] Form selects sunken; toolbar selects raised.
- [ ] No default border on fields or select triggers: recessed = `surface-sunken` + `shadow-sunken`; raised = `surface-card` + `shadow-trigger`. Their only edges are the focus outline, the error ring and boundary mode.
- [ ] Every field has a visible label above it (mitigation for exception A-1).
- [ ] One primary button per region; secondary left, primary right in footers.
- [ ] Status = dot/badge **plus** text.
- [ ] Every code example used still matches its spec table.

**Layout (L3)**
- [ ] §6.0 spacing relationships hold (24 sections, 16/20 grids, 12 groups, 16 gutter).
- [ ] Filters are placed by scope (§6.3).
- [ ] Any deviation from a §6 default is a listed variant, or recorded as an extension.

**States & accessibility**
- [ ] Every interactive element has hover, a visible focus outline (never removed), and disabled/selected/error/loading states as relevant.
- [ ] Disabled actions are explained.
- [ ] No text below 4.5:1 (check against §9.1); no essential graphic below 3:1 (§9.2).
- [ ] Tooltips appear on focus, are dismissible with Escape, and `title` is never the only source.
- [ ] Keyboard: everything is reachable; menus and tabs follow §9.5; overlays trap and restore focus; Escape follows R-21.
- [ ] `prefers-reduced-motion` and `prefers-contrast: more` are honoured.
- [ ] Reflow verified at 320px (400% zoom), and layouts at 390 / 768 / 1024 / 1440 / 1920.
- [ ] Browser text size at 200% and the WCAG text-spacing overrides: nothing clips or overlaps; controls grow.
- [ ] Long-content test: double every label and value; nothing meaningful is truncated without recovery (§2.3).
- [ ] Scripted components meet their §5.55 contract: states, keyboard, focus movement and restoration, ARIA attributes, validation.
- [ ] i18n (§8.9): tested with +40% text and one RTL locale; logical properties only; directional icons mirror; unbroken strings wrap or truncate with recovery.

**Portability**
- [ ] No terminology, labels, data or workflows from the source product leaked into the new product.
- [ ] Missing illustrations use the icon-tile fallback; no generated look-alikes.

---

## 14. Changelog

### Revision 6: field styling restored to the source's depth-only language (2026-10-09)

- **Source verified** (R-58). Recessed, with no border: text, password and search inputs, textareas, multi-select, the rich picker and the field with attach button. Raised, with no border: the dropdown and date-range triggers. Errors are a 1px red ring.
- **R-56 (a) revised.** The rev-5 default 1px `#6b7280` border on recessed fields and sunken select triggers is removed from §1, §2.2, §2.6, §5.5, §5.9, §5.11, §5.18 and the §5.53 blueprint. Errors use `--ds-error-ring` again.
- **Boundary mode (§9.3)** now covers fields and triggers again, as an optional higher-contrast treatment kept separate from the original specification.
- **A-1 is a documented open exception** (fill 1.00–1.16:1, best shadow cue 1.31:1), with mitigations and an accessible alternative (D-1).
- **New §10.1 rule 17** distinguishes recessed and raised variants. §2.7 shadow roles and the §13 checklist were updated. New open decision D-18: whether to restore the raised single select inside forms.
- **Retained borders:** checkboxes, secondary and danger buttons, radio cards, the toggle container, the attach button, the dashed dropzone, dialogs, panels, tooltips, callouts and media cards.

### Revision 5: targeted corrections before visual validation (2026-10-09)

**Accessibility failures fixed (R-56, §9.8).** A-1 to A-3 were documented exceptions; each was re-examined and confirmed as a WCAG 2.2 AA failure, then fixed in the canonical specs:
- Sunken fields get a default 1px `#6b7280` boundary (3.12–3.62:1). Field errors now recolor that border instead of adding a ring. *(Reverted in revision 6: see R-56, R-58.)*
- Active raised tabs and nav items get label weight 600 as a non-color cue. The tab blueprint reserves the semibold width, so nothing shifts.
- Heatmap fills snap out of the 0.55–0.59 mid-tone band, where neither white nor ink reaches 4.5:1. Hover uses an inset line instead of `brightness()`.
- Toasts with an action no longer time out (SC 2.2.1).
- The select trigger is a `role="combobox"`, so `aria-activedescendant` is valid (SC 4.1.2).
- Raised filter triggers and text buttons are classified as acceptable (text-identified). Boundary mode now covers only those controls.

**Internationalization (§8.9).** Text expansion per component, unbroken strings, locale formatting, non-Latin scripts (no tracking or uppercase on joined scripts), RTL with logical properties, mirrored shadows and switch travel, and a direction-aware icon list with a `ds-icon--dir` utility. All CSS examples now use logical properties, except physically centered elements and right-aligned numeric columns (kept on purpose).

**Behavior contracts (§5.55).** States, opening/closing, keyboard, focus movement and restoration, validation and ARIA for selects, command menus, tabs, overlays, popovers, tooltips, toasts, collapsible sections, the sidebar, tables, choice controls, file upload and forms, with framework-neutral pseudocode where it removes ambiguity.

**Consistency fixes (R-57).** These spec-versus-example and section-versus-matrix mismatches were corrected:
- the §5.5 placeholder grey;
- fixed heights changed to minimums (input, select, radio card, attach field, tabs, section header, table row, KPI diagram);
- truncated labels changed to wrapping (radio cards, collapsible titles);
- the card-title text helper, which still prevented wrapping;
- §5.8 Save-disabled guidance aligned with R-41;
- the confirmation `alertdialog` role and description;
- the inert sidebar behind modals;
- nav-label overflow;
- the menu Tab-key rule;
- the toggle padding;
- toast maximum width;
- the px/rem mixing rule.

**Preserved.** Every color token, the type scale, the 20px surface radius and radius hierarchy, the component anatomy, and the layer model. One token was added: `--ds-shadow-drawer-mirrored`, the mirrored value that §8.2 already described.

### Revision 4: final reconciliation (2026-10-09)

**Typography & content flexibility**
- Added text scaling rules: px is the reference, and rem is an equivalent implementation (with a full conversion table and what to keep in px). Zoom and text-resize requirements, a single **long-content policy** (never truncate / wrap / clamp or truncate only with recovery), and controlled typography-extension rules (§2.3, R-52, R-53).
- KPI labels and values, card titles and dashboard titles now wrap instead of truncating. §8.7 now defers to the §2.3 policy.

**Dimensions**
- Added four **dimension types** (fixed / minimum / maximum / content-driven, §2.8).
- Controls, menu options, pagination, the toggle, KPI cards, the page header and section headers use `min-height`.
- The 180px header/footer button width is now an optional minimum. The 440px dialog and the panel widths are maximums (`min(…, 100%)`). Tab-track and filter widths are examples or recommended defaults.
- Button labels may wrap instead of clipping (R-52).

**Radius**
- Reviewed. The single 20px surface radius is **retained**, with a role table and rationale (§2.5). Popovers move from 8px to 10px to match the menus anchored to the same controls. No new values (R-51).

**Component contracts**
- Added §5.52 (sizing type, overflow, responsive, accessibility, blueprint location for all 51 components plus charts).
- Added §5.53: 16 supplementary blueprints for components that had none.
- Added §5.54 (anatomy, variants and states for every component; static components marked).

**Validation-driven corrections**
- Primitive names are reference labels, not undeclared `--ds-*` tokens (R-54).
- Declared 6 tokens that were documented but missing (`--ds-border-width`, `--ds-border-width-emphasis`, `--ds-size-heat-row`, `--ds-size-avatar-sm/md/lg`).
- New tokens replace raw literals in examples: border-on-brand, border-track, scrollbar, scrollbar-hover, skeleton, stepper shadows and gradient. Spacing literals in §5–§7 examples were converted to `--ds-space-*` (R-55).
- Fixed spec-vs-example contradictions: button wrapping, the KPI icon-tile radius, the dropzone hint color, dialog sizing.
- Fixed five heights stated as fixed that should be minimums (toggle, status-card header, top nav, heatmap row, page header).
- Fixed a conflict between §8.4 ("KPI values may truncate") and R-53.
- Documented the token naming scheme (§3) and the composite-field exception to the outline rule (§2.7).
- Replaced residual source-domain wording in normative examples.

**Preserved:** R-23, R-31 (now wrap instead of truncate), R-33, R-36 (visual verification pending), the semantic tables, layer separation, the asset registry, WCAG 2.2 AA, and dense-by-default with derived comfortable density.

### Revision 3: portability & accessibility audit (2026-10-09)

**Structure & portability**
- Added the five-layer model (§0.1): foundations, components, layouts, product decisions, extensions. Added RFC-2119 keywords, a `[PRODUCT DECISION]` tag, token-shorthand rules and a "using this without the source repo" section.
- §6 rewritten as default / acceptable variants / product decisions. Forms, metrics, filters and card sizing are no longer universal mandates (R-49).
- §10 rewritten: strict on identity and accessibility, flexible on layout. Added a "defaults and when to deviate" table.
- §12 recipes marked non-normative.

**Accessibility (WCAG 2.2 AA)**
- Recomputed every documented contrast ratio across all surfaces (§9.1–9.2) and added non-text contrast. The earlier claim that white on `#3b82f6` passes was wrong: it is 3.68:1 and fails for 14px text.
- Blue text now uses `#60a5fa` / `#93c5fd`; the accent tab fill is `#2563eb` (R-39).
- New tertiary `#8695aa` and placeholder `#77879d`; faint grey is decorative only (R-46). The radio label (R-47) and stepper (R-48) no longer dim below AA.
- Focus is drawn with `outline` (2px; default / tight / inset / on-color), forced-colors safe. The global `outline: none` was removed (R-37).
- Added a boundary mode via `prefers-contrast: more` (R-42); a checkbox border that passes 3:1; a selected-state ring on the binary toggle (R-43); a sort icon that passes 3:1 (R-44); 2px gaps between chart segments (R-45); a heatmap text-color switch.
- Accessible tooltip spec replaces `title` reliance (R-40). Added disabled-state rules (R-41) and a documented exceptions list (§9.8).

**Tables (§5.41)**
- Removed spacer columns. Semantic structure (`caption`, `th scope="row"`, labelled keyboard-scrollable region), right-aligned tabular numbers, flexible shrink/grow columns, sticky header on `th` with `scroll-padding`, accessible sort, selection, row-action and row-activation patterns. The visual appearance is unchanged (R-38).

**Components**
- The menu's keyboard model is now fully specified (active descendant). The action row moved outside the listbox. Selected options get a check glyph.
- Code examples now read the size and padding tokens, so the density mode works.

**Assets**
- §2.11 now has a full **asset registry**: 21 entries with semantic name, depiction, purpose, file, size, display sizes and fallback. Also added style attributes measured from the actual assets (navy/blue palette, status coins, no text), rules for new illustrations, and the icon-tile fallback.

**New**
- Comfortable density mode, derived mechanically (§2.13, R-50).

**Open decisions resolved**
- R-23: keep 18px summary title.
- R-31: complete KPI labels.
- R-33: keep the detection green.
- R-36: accessible tag colors (pending visual check).

### Revision 2
- Added the Inconsistency Resolution Log with merit-based decisions; added responsive rules; corrected the tag-color contrast.

### Revision 1
- Initial extraction.

---

## 15. Open decisions & known issues

### 15.1 Decisions requiring designer approval

| # | Decision | Recommendation in this document | Ref |
|---|---|---|---|
| D-1 | Fields stay borderless (the source's depth-only look); exception A-1 (edges below 3:1) | Approve the exception for products whose fields always have visible labels. Where strict SC 1.4.11 conformance is required, turn boundary mode on by default (`data-contrast="more"`: 1px `#6b7280`, 3.12–3.62:1). Any other alternative must also reach 3:1 (a lighter fill or stronger shadow alone cannot) | A-1, R-56, R-58 |
| D-2 | Selected raised tab / current nav item use label weight 600 | Approve the visual. An alternative must also be non-color (e.g. a 2px `brand` indicator bar) | A-2, R-56 |
| D-3 | New tertiary grey `#8695aa` is close to muted `#94a3b8` | Verify visually that the hierarchy still reads | R-46 |
| D-4 | Darker green/amber tag fills | Verify visually (the instruction was to retain them, subject to verification) | R-36 |
| D-5 | Accent tab active fill moves from `#3b82f6` to `#2563eb` | Approve (required for contrast) | R-39 |
| D-6 | Toggle selected option gets an inset blue ring | Approve, or choose another ≥ 3:1 cue (e.g. a check glyph) | R-43 |
| D-7 | 2px gaps between chart segments | Approve (required by 1.4.11 for adjacent series) | R-45 |
| D-8 | Status columns left-aligned (were centered) | Approve | R-38 |
| D-9 | Recommended default for new products: Save enabled + validate on submit (the source disabled Save) | Approve as the system default | R-41 |
| D-10 | Heatmap fill snapping (0.55–0.59) and the 1px hover line | Approve. The alternative is a heat-palette change that skips the mid-tone luminance | A-3, R-56 |
| D-11 | Source illustrations with baked-in text ("ADMIN", "SHIFT" on `illus.site-admin`) | Commission a text-free version before reuse in other products/locales | §2.11 |
| D-12 | Comfortable density values | Approve the derived values in §2.13 | R-50 |
| D-13 | Single 20px radius for all surfaces including dialogs/modals (the source's 32px viewer modal is retired) | Approve (§2.5 rationale) | R-05, R-51 |
| D-14 | Popover radius 8 → 10px | Approve | R-51 |
| D-15 | Button labels may wrap to two lines instead of clipping | Approve, or require shorter labels in product copy guidelines | R-52 |
| D-16 | KPI labels/values and card titles wrap (the source truncated them) | Approve; affects row heights when content is long | R-53 |
| D-17 | RTL time-axis direction for charts | Product decision per adopting application (§8.9) | R-57 |
| D-18 | Single selects inside forms: recessed (R-03, current) or raised (as in the source) | Keep recessed for one consistent field column, or restore raised to match the source exactly. Neither has a default border | R-03, R-58 |

### 15.2 Known issues by category

Expected external dependencies are listed here as dependencies, not as documentation defects.

**Requires designer visual approval:** D-1 to D-18 in §15.1. D-2 (weight cue) and D-10 (heat snapping) are required for WCAG; approval is about their look. D-1 is different: it decides whether to accept exception A-1 or turn boundary mode on by default.

**Requires external assets**
1. The 3D illustrations and outline SVG icons are not bundled. The §2.11 registry lists file names; without the source pack, use the icon-tile fallback. Never generate look-alikes.
2. Illustrations with baked-in English text need text-free versions before use in other locales (D-11, A-8).
3. Fonts for non-Latin scripts are chosen by the adopting product (§8.9).

**Requires implementation code in adopting applications**
1. Scripted behavior per §5.55: listbox/combobox, menus, tooltips, focus management and `inert`, toasts, sorting and selection, sticky-header shadows, row-click delegation, and upload handling. The examples are HTML and CSS only; use native elements or an accessible headless library that meets the contracts.
2. Chart rendering: §7 specifies marks, colors and interactions, but there is no reference implementation. Line and area charts are extensions without a source visual.
3. Locale formatting (`Intl`), translations and plural rules (§8.9).

**Optional future extensions**
1. A rem token file. Conversion is described in §2.3; this document ships px.
2. Print styles (§8.9 gives the minimum rules).
3. A light theme (only with a product-supplied token set, §10 rule 14).
4. An ARIA `grid` for editable data grids (a product decision, §5.41).

**Notes on this document**
1. The completeness and consistency checks are partly heuristic (§15.4): they prove the absence of the patterns tested, not of every possible contradiction.
2. The source application has not been changed. It still uses several pre-standardization values; this document describes the target system.

### 15.3 Confirmed accessibility limitations

One documented exception and these limitations remain:
1. **Field boundaries (A-1).** The original depth-only fields stay below the 3:1 non-text contrast threshold (1.00–1.31:1). This is accepted only with designer and accessibility approval (D-1); boundary mode is the accessible alternative.
2. **Not verified with users or assistive technology.** Contrast is computed; keyboard and screen-reader behavior is specified but has not been run in a browser or with a screen reader.
3. **Interpretation-dependent passes.** Raised filter triggers (A-1b) rely on text identification, and the selected tab and nav item (A-2) rely on a weight change. Both follow the WCAG Understanding documents; an auditor applying a stricter reading should enable boundary mode by default (§9.3), which is a one-attribute change.
4. **Baked-in illustration text** (A-8) cannot be translated.
5. **Behavior depends on the adopter.** The §5.55 contracts cover the scripted behavior, but an implementation can still fail them; the §13 checklist must be run per product.

### 15.4 Validation report (revision 6)

Run against this file with scripts kept outside the repository. Nothing in the application was modified.

| # | Check | Method | Result |
|---|---|---|---|
| V-1 | CSS validity | Every ```css block (43) parsed with **lightningcss** (the project's own Tailwind dependency), error recovery on and warnings collected. Includes the new `:dir(rtl)` rules and logical properties | **0 errors, 0 warnings** |
| V-2 | Undefined token references | All `var(--ds-*)` usages vs all declarations | **0** undefined (3 intentional per-instance knobs with fallbacks, documented in §3) |
| V-3 | Duplicate / conflicting declarations | Duplicate keys in `:root`; every `--ds-*` value in a documentation table compared with `:root` | **0 duplicates, 0 conflicts** (including the new `--ds-shadow-drawer-mirrored`) |
| V-4 | Token naming | Regex against the documented naming scheme | **0** outliers |
| V-5 | Spec shorthand resolves | Every backticked token shorthand matched against tokens, named text styles and focus styles | **0** unresolved (the remaining matches are CSS keywords such as `border-inline-start`, and one retired name quoted in V-13) |
| V-6 | Hard-coded values in examples | Color literals equal to a token; color literals not stated in their section; px in sizing/gap/padding | **0** token duplicates; **0** unstated colors in §5–§7 (1 in §4 autofill = the documented sunken shadow); 29 px literals, all reviewed as Fixed-type intrinsic sizes or spec-stated values |
| V-7 | Example ↔ spec radius | Resolved `border-radius` values in code vs radii stated in the spec text, per section | **0** mismatches |
| V-8 | Dimension type | Minimum-type components checked for a fixed `height` in code | **0** violations |
| V-9 | Cross-section assertions | Targeted rules for known contradiction types: popover radius, tertiary and placeholder greys, KPI label policy, rigid widths and heights, status alignment, retired radii, layout-mandate phrases, card-title wrapping, truncated labels, the confirmation role, combobox triggers, and Save-disabled guidance. Rev-5 rules were first run against the rev-4 file, where they found the 6 known defects, to prove they detect them | See the note below |
| V-10 | Contract completeness | Keyword scan per section, plus coverage in the §5.52 and §5.54 tables | **0** residual gaps |
| V-11 | Interactive states | Interactive components must state hover + focus + disabled (in the section or the §5.54 index) | **0** missing |
| V-12 | Structure | §5 numbering continuity (5.1–5.55); R-01…R-57 sequence; no references to missing log IDs; top-level sections 0–15 present | Pass |
| V-14 | Field borders (rev 6) | New assertions: no `.ds-input` / `.ds-select__trigger` / `.ds-attach__field` rule with a border; `border-control-strong` used as a border only inside boundary mode or on the checkbox; no spec-table Border row giving fields that border. First run against the rev-5 file, where they found its 4 default-border instructions | **0** in revision 6 |
| V-13 | Retired values & leaks | Old focus tokens, `brand-link-hover`, retired radii, mandate phrases, source-domain terms in normative text | 0 in normative text (the only matches are this report and historical log rows) |

**V-9 note.** The 2 remaining matches were reviewed by hand and are false positives: the historical R-31 log row, and the `--ds-space-form-row` token description, which describes the gap between form rows rather than a layout mandate.

**Not automated (manual review or out of scope):**
- **Visual rendering.** No screenshots were compared; building a page was out of scope. Visual parity is asserted from the token values only.
- **Prose conflicts** beyond the targeted assertions. The rev-5 consistency fixes (R-57) came from a manual review of the eight components named in the brief: KPI card, search input, select/dropdown, data table, modal/drawer, tabs, button and tooltip.
- **Keyboard and screen-reader behavior.** It is specified (§5.55), not executed.
- **Contrast (rev 6).** The recessed-field edge was computed with the WCAG formula: fill vs card / elevated / shell / overlay 1.10 / 1.16 / 1.05 / 1.00; inset-shadow core vs card 1.28 (vs fill 1.16); bottom highlight 1.11–1.13 against its surface (1.24–1.31 against the fill); error ring 4.65 / 4.22; focus 4.76 / 4.31. Shadows were approximated by compositing black/75% and white/4% at full strength, which is the best case.
- **Contrast (rev 5).** New and changed pairs in rev 5 were computed with the WCAG formula: field boundary 3.12–3.62, error border on sunken 4.65, accent fill vs track 3.38, current page vs card 3.07, and heatmap text with snapping ≥ 4.56. Unchanged pairs keep their rev-3 values.
- **RTL rendering.** The logical properties and `:dir()` rules parse; they have not been rendered in an RTL locale.
