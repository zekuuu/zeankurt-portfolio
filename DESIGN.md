# Design system

Neo-Swiss grid and typography with neo-brutalist honesty: a 1px page frame, flat color and sharp rectangular tiles, buttons and tags throughout. Light by default, with a persisted dark theme.

Everything below is implemented in `src/app/globals.css` and `src/components/ui/*`. Change the tokens there, not in components.

## Tokens

| Token | Light | Dark | Tailwind | Use |
|---|---|---|---|---|
| `--bg` | `#f4f1ea` | `#0a0a0a` | `bg-bg` | Page background |
| `--surface` | `#ffffff` | `#161616` | `bg-surface` | Neutral tiles, fields, popups |
| `--surface-2` | `#ebe7dd` | `#1f1f1f` | `bg-surface-2` | Muted tiles, hover fills, image placeholders |
| `--ink` | `#0a0a0a` | `#f4f1ea` | `text-ink` | Text; selected option and active nav fill |
| `--ink-muted` | `#55524b` | `#a8a39a` | `text-ink-muted` | Secondary text (AA on bg, surface and surface-2) |
| `--line` | `#0a0a0a` | `#f4f1ea` | `border-line` | Frame, dividers, tile and field borders |
| `--line-soft` | `#d6d1c4` | `#2e2e2e` | `border-line-soft` | Decorative inner dividers only. Never for fields or text. |
| `--primary` | `#1f3cff` | `#6c86ff` | `bg-primary`, `text-primary` | Primary buttons, links, focus ring, the hero featured project |
| `--on-primary` | `#ffffff` | `#0a0a0a` | `text-on-primary` | Text on primary |
| `--block-yellow` / `-orange` / `-green` | same in both themes | | `bg-block-*` | Status colors, see roles below |
| `--on-block` | `#0a0a0a` | `#0a0a0a` | `text-on-block` | Text on any block color, in both themes |
| `--overlay` / `--on-overlay` | `#0a0a0a` / `#f4f1ea` | same | `bg-overlay` | Image viewer: always dark for image fidelity |

Shape: sharp everywhere, with one exception. Bento tiles (`Tile`, `rounded-tile`) keep a 6px radius (8px from 640px) inside the sharp page frame; nothing else is rounded. Buttons, tags, inputs, dropdowns, icon buttons, dots, images and dialogs use `rounded-none`; `--field-radius` and `--radius-pill` are 0. Bento gap is 6px: use `gap-1.5`.

Type: `display` = Unbounded 700, tight tracking, sentence case. Body = Geist. `label` = Geist Mono 12px, sentence case, normal tracking, used only for data: dates, years, counts, status and short section names.

## Color roles

Color carries meaning; it is never assigned by position.

| Color | Means | Where |
|---|---|---|
| Cobalt (`primary`) | The one accent moment and actions | Hero featured project tile, primary buttons, links, focus |
| Yellow | Availability and in-progress | Hero "Open to" tile, `WIP` badge |
| Green | Live | `Live` badge |
| Orange | Something went wrong | 404 and error pages, admin error banners |
| Neutral (surface, surface-2) | Everything else | Project tiles, events, meta tiles |

The scroll progress bar is the single decorative exception: its flat color shifts cobalt, green, yellow, orange as the page scrolls (owner request).

## Do

- One flat fill per tile. Text on block colors is always `text-on-block`; on `bg-primary` it is `text-on-primary`.
- Keep the base (bg, surface, ink) at roughly 85% of the page.
- Start each section with `<Section>` (1px top rule) and `<SectionHeading eyebrow="…" title="…" />`. Vary the body: tiles, ruled lists, timelines and accordions are all in use, so a new section should not repeat its neighbour's composition.
- Keep all text in server HTML. Motion may enhance; it never hides content.
- Give every interactive element a 44px minimum target (`min-h-11`).
- Put `↗` only on links that open a new tab; use ← and → only for previous/next and pagination.

## Don't

- No shadows, glows, gradients or `rgba()` overlays. The only blur is the image viewer backdrop.
- No all-caps labels, no wide letter-spacing, no decorative numbering (`01 / Projects`).
- No hardcoded colors in components. The only literals live in `og.tsx`, `manifest.ts` and the `viewport.themeColor` in `layout.tsx`, because those render outside CSS.
- No `outline-none` on focusable elements: the global `:focus-visible` ring is the focus style.
- No native `<select>`, `title=` tooltips or OS-styled controls in public pages: use `Listbox`, `fieldClass` and visible labels.
- Don't pass conflicting color classes through `className`: `cn` is plain `clsx` with no class merging. Add a variant instead (see `inverse` in `Button.tsx`).
- Don't put `hidden` on a component whose base class sets `display`; wrap it in a `<div className="hidden lg:block">`.

## Components

| Component | File | Notes |
|---|---|---|
| `Tile` | `ui/Tile.tsx` | Variants `surface`, `muted`, `primary`, `yellow`, `orange`, `green`, `outline`; `interactive` adds a 2px lift. Pick the variant by meaning (see Color roles). |
| `Button`, `buttonClass` | `ui/Button.tsx` | Pills: `primary`, `secondary`, `ghost`, `inverse` (on primary tiles). |
| `Badge` | `ui/Badge.tsx` | Mono pill, sentence case. `live` green, `wip` yellow, `archived` surface-2, `solid`. |
| `SectionHeading` | `ui/SectionHeading.tsx` | Mono eyebrow, Unbounded title, optional description/action column. |
| `Listbox` | `ui/Listbox.tsx` | Themed select: Enter/Space/Arrows open, arrows/Home/End move, type-ahead, Enter selects, Esc closes and returns focus. `AdminSelect` wraps it for forms. |
| `fieldClass`, `fileInputClass` | `ui/field.ts` | Inputs, textareas, date fields; native file button styled as a secondary pill. |
| `ImageViewer` | `ui/ImageViewer.tsx` | One framed, always-dark `<dialog>` for screenshots, photos and certificates: blurred backdrop, zoom (double-click/tap, `+`/`-`), drag to pan, swipe, preload, loading/error states, optional filmstrip. |
| `ThemeToggle` | `ui/ThemeToggle.tsx` | Circular reveal from the button via View Transitions; instant without the API or with reduced motion. |
| `IntroLoader` | `ui/IntroLoader.tsx` | Once per tab session (`sessionStorage['zk-intro']`), decided before paint by an inline head script; never shown without JS, with reduced motion or on `/admin`; CSS fail-safe hides it after 3s. |
| `CopyEmailButton` | `ui/CopyEmailButton.tsx` | Clipboard plus an `sr-only` status message; `mailto:` stays as the fallback. |

## Motion (MOTION dial 2)

Every motion has a purpose and is off under `prefers-reduced-motion`.

- `enter` (200ms, staggered 30ms, max 8): newly revealed items after show more, filter or category switch, FAQ answers. Purpose: show what changed.
- Route fade-in (`app/template.tsx`, 180ms): continuity between pages.
- Image viewer: 160ms open, 120ms close, 120ms image crossfade.
- Theme reveal (450ms): makes the theme change legible.
- Nav indicator slide (200ms) and header hide on scroll below `lg` (200ms).
- Lenis inertial wheel scrolling (`components/providers/SmoothScroll.tsx`), off on `/admin`; touch stays native. Use `scrollToTarget`, `scrollToTop` and `lockScroll` from `lib/smooth-scroll.ts` instead of `window.scrollTo` or writing `overflow` directly.

## Decisions (one line each)

- Unbounded / Geist / Geist Mono: chosen by the owner; wide display face for identity, neutral sans for reading, mono only for data.
- Sharp edges everywhere except bento tiles: owner choice; rectangles fit the neo-Swiss grid and neo-brutalist honesty, while rounded bento tiles inside the sharp frame keep the original reference.
- Bento layout: chosen by the owner; used where content has different weights (hero, projects), not as every section's default.
- Lucide icons: owner chose one consistent set; icons appear only where they add meaning (actions, external, navigation).
- Warm off-white base: softer than pure white for long reading, and distinct from default white pages.
- Cobalt accent: one strong color that passes AA on both themes and stays the single accent.
- Blurred viewer backdrop: keeps page context visible behind an image without competing with it.
- Light default with a toggle: content-first portfolio; dark is offered, not imposed.

## QA

`node scripts/design-qa.mjs` (against `npm run build && npm run start`) screenshots every route in both themes at 375/768/1280/1920 into `design-qa/` and checks overflow, console and network errors, fonts, tap targets, focus rings, axe (serious/critical), theme persistence and no-flash, no-JS and reduced motion, content stress. It also checks the intro, the listbox keyboard flow, Lenis offsets, the nav indicator, the progress bar color, header hide, the scroll lock, the image viewer (blur, frame, speed, zoom, focus return), shareable photo links, swipe, image format and a source guard for caps and numbering.
