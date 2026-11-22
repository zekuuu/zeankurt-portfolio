# Design system

Neo-Swiss grid and typography with neo-brutalist honesty: a sharp 1px page frame, flat color, rounded bento tiles inside, pill controls. Light by default, with a persisted dark theme.

Everything below is implemented in `src/app/globals.css` and `src/components/ui/*`. Change the tokens there, not in components.

## Tokens

| Token | Light | Dark | Tailwind | Use |
|---|---|---|---|---|
| `--bg` | `#f4f1ea` | `#0a0a0a` | `bg-bg` | Page background |
| `--surface` | `#ffffff` | `#161616` | `bg-surface` | Neutral tiles |
| `--surface-2` | `#ebe7dd` | `#1f1f1f` | `bg-surface-2` | Muted tiles, hover fills, image placeholders |
| `--ink` | `#0a0a0a` | `#f4f1ea` | `text-ink` | Text |
| `--ink-muted` | `#55524b` | `#a8a39a` | `text-ink-muted` | Secondary text (AA on bg, surface and surface-2) |
| `--line` | `#0a0a0a` | `#f4f1ea` | `border-line` | Frame, dividers, tile and input borders |
| `--line-soft` | `#d6d1c4` | `#2e2e2e` | `border-line-soft` | Decorative inner dividers only. Never for inputs or text. |
| `--primary` | `#1f3cff` | `#6c86ff` | `bg-primary`, `text-primary` | Primary buttons, links, focus ring, active state |
| `--on-primary` | `#ffffff` | `#0a0a0a` | `text-on-primary` | Text on primary |
| `--block-yellow` / `-orange` / `-green` | same in both themes | | `bg-block-*` | Accent tiles and status |
| `--on-block` | `#0a0a0a` | `#0a0a0a` | `text-on-block` | Text on any block color, in both themes |
| `--overlay` / `--on-overlay` | `#0a0a0a` / `#f4f1ea` | same | `bg-overlay` | Lightbox and zoom: always dark for image fidelity |

Shape: `--tile-radius` (14px mobile, 18px from 640px, `rounded-tile`), `--field-radius` 12px (`rounded-field`), pills `rounded-full`, frame 0. Bento gap is 6px: use `gap-1.5`.

Type: `display` class = Unbounded 700, tight tracking, no all-caps. Body = Geist. `label` class = Geist Mono 11px uppercase, 0.12em tracking, for eyebrows (`01 / PROJECTS`), tags and dates.

## Do

- Use one flat fill per tile. Text on block colors is always `text-on-block`; text on `bg-primary` is `text-on-primary`.
- Keep the base (bg, surface, ink) at roughly 85% of the page. Block colors are accents.
- Start each section with `<Section>` (1px top rule) and `<SectionHeading index="0N" eyebrow="…" title="…" />`.
- Keep all text in server HTML. Animation may enhance; it never hides content.
- Respect `prefers-reduced-motion` (handled globally in `globals.css`).
- Give every interactive element a 44px minimum target (`min-h-11`).

## Don't

- No shadows, glows, blurs, gradients or `rgba()` overlays.
- No hardcoded colors in components. The only literals live in `og.tsx`, `manifest.ts` and the `viewport.themeColor` in `layout.tsx`, because those render outside CSS.
- No `outline-none` on focusable elements: the global `:focus-visible` ring is the focus style.
- Don't pass conflicting color classes through `className` (for example `buttonClass("secondary", "text-on-primary")`). `cn` is plain `clsx` with no class merging, so the winner depends on CSS order. Add a variant instead (see `inverse` in `Button.tsx`).
- Don't put `hidden` on a component whose base class sets `display`. Wrap it in a `<div className="hidden lg:block">`.

## Components

| Component | File | Notes |
|---|---|---|
| `Tile` | `ui/Tile.tsx` | Variants `surface`, `muted`, `primary`, `yellow`, `orange`, `green`, `outline`; `interactive` adds a 2px lift on hover/focus. `tileVariantAt(i)` gives a stable color rotation. |
| `Button`, `buttonClass` | `ui/Button.tsx` | Pills: `primary`, `secondary`, `ghost`, `inverse` (on primary tiles). |
| `Badge` | `ui/Badge.tsx` | Mono pill; `default` inherits text color. Status: `live` (green), `wip` (yellow), `archived` (surface-2), `solid`. |
| `SectionHeading` | `ui/SectionHeading.tsx` | Mono `index / eyebrow`, Unbounded title, optional description/action column. |
| `Container`, `Section` | `ui/Container.tsx` | Gutter, and a section with a top rule. `surface="subtle"` fills with surface-2. |
| `ThemeToggle` | `ui/ThemeToggle.tsx` | Icon and label swap with `dark:` variants (no hydration mismatch). |
| `Marquee` | `ui/Marquee.tsx` | CSS-only ticker; pauses on hover/focus; static under reduced motion. |
| `CopyEmailButton` | `ui/CopyEmailButton.tsx` | Clipboard plus an `sr-only` status message; `mailto:` stays as the fallback. |

## Adding a tile

```tsx
<div className="grid gap-1.5 lg:grid-cols-12">
  <Tile className="lg:col-span-8">
    <p className="label text-ink-muted">01 / Label</p>
    <h3 className="display mt-3 text-2xl">Title</h3>
    <p className="mt-2 text-ink-muted">Body copy.</p>
  </Tile>
  <Tile variant="yellow" className="lg:col-span-4">…</Tile>
</div>
```

For a whole-tile link, put the link on the title and stretch it: `className="after:absolute after:inset-0 after:rounded-tile after:content-['']"`. Give any other links inside the tile `relative z-10`.

## Theme

`next-themes` with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`, `storageKey="zk-theme"`. Dark mode is the `.dark` class on `<html>`, and Tailwind's `dark:` variant is bound to it in `globals.css`.

## QA

`node scripts/design-qa.mjs` (against `npm run build && npm run start`) screenshots every route in both themes at 375/768/1280/1920 into `design-qa/`, and checks overflow, console errors, failed requests, fonts, tap targets, focus rings, axe (serious/critical), theme persistence and the no-JS and reduced-motion views.
