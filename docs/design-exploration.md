# Design exploration (Phase 0)

Redesign target: neo-Swiss + neo-brutalist bento, light by default. The locked decisions (fonts, tokens, sharp frame with rounded tiles, no shadows/glows/gradients) are fixed by the brief. This document covers what was left open: hero composition, grid proportions, ornaments and extra components.

## Method and limits

Research was done through web search, not by browsing each site visually. The table records what the search results describe. Where a row says "search summary only", the live site was not opened. Code was only considered for copying when a license was confirmed; none was, so every component in the redesign is written in-repo (see `docs/design-sources.md`).

## Shortlist

| # | Reference | Borrow (structure only) | Avoid | License (if code) |
|---|---|---|---|---|
| 1 | Blitz-style bento (brief reference) | Sharp outer frame, rounded inner tiles, 4–6px gaps, big headline, pill CTA | Its content, assets, colors | n/a |
| 2 | [meggnotec/grid](https://github.com/meggnotec/grid) (Astro bento portfolio) | 1 → 2 → 4 column responsive bento collapse | Dark-first theme, card shadows | MIT (per repo listing, not re-verified) |
| 3 | [Swiss Grid Agency Layout, superdesign](https://superdesign.dev/library/swiss-grid-agency-layout) | 12-col grid, ink on paper, one cobalt accent, mono micro-labels indexing every section, numbered index rows for work | Inter-only display face | Design reference, no code taken |
| 4 | [Really Good Designs: neo-brutalist examples](https://reallygooddesigns.com/neo-brutalist-website-examples/) | Flat color blocks, oversized type, sticker-like badges | Glitch/distortion motion, hard offset shadows | n/a |
| 5 | [Webflow: brutalist websites](https://webflow.com/blog/10-brutalist-websites) | Honest hairline structure, visible grid | Deliberately hostile UX, low contrast | n/a |
| 6 | DEV: neo-brutalist React/Tailwind portfolio breakdowns | Bold block palette mapped to Tailwind tokens | Thick black offset box-shadows (banned here) | Not used |
| 7 | Bento Cyber Portfolio (Astro theme) | Tile density on the hero | Glassmorphism, neon (banned) | Paid, not used |
| 8 | Framer "Bentolio" / "Gridwork" templates | Status tile + featured tile beside the hero | Template copy and imagery | Paid, not used |
| 9 | Swiss style articles (UX Planet, Smashing) | Flush-left ragged-right text, strict type hierarchy, whitespace | Helvetica lookalike (fonts are locked) | n/a |
| 10 | React Bits (marquee, rotating text) | Idea of a mono tech ticker | Copying code: license reported as MIT + Commons Clause by some copies, unverified | Not used |
| 11 | Aceternity UI (bento grid) | Bento grid spans idea | Copying code: license page covers Pro items; no confirmation for the free ones | Not used |
| 12 | Cult UI | Segmented control/tabs pattern | Motion dependency for simple tabs | Reported MIT, unverified; not used |

## Prototypes

Route `/design-lab` (temporary, `noindex`, not in the sitemap, deleted in Phase 6) rendered three directions in light and dark with real identity copy. Screenshots: `docs/design-exploration/proto-{A,B,C}-{375,1280}.png`. The old site header shows over the prototypes because the shell had not been rebuilt yet.

| Direction | Idea | Verdict |
|---|---|---|
| A. Poster bento | 8/4 split: big Unbounded name tile, yellow status tile, cobalt featured project tile, stack strip | **Chosen for the hero.** Strongest first read, block colors used as accents only. |
| B. Swiss index | Asymmetric 7/5 intro, numbered rows separated by 1px rules | **Chosen for section structure.** Mono `01 / PROJECTS` section rows and rule-separated lists (experience, FAQ). |
| C. Blueprint | Grid-line backdrop, `+` corner marks, coordinate labels | **Rejected.** The backdrop adds noise behind text, and coordinate labels would be invented data. |

## Chosen direction

- **Hero:** direction A. Name as the H1 in the large tile, role eyebrow, hero copy, pill CTAs and socials. Side tiles: status (from `identity.lookingFor`, real data), the first featured project as a block-color tile, and a tech-stack tile.
- **Sections:** direction B. Each section starts with a full-width 1px rule and a mono index row (`02 / PROJECTS`), then an Unbounded title.
- **Projects:** bento grid; the first tile spans 2 columns. Block colors rotate deterministically by index (primary, yellow, surface, orange), so they never change between builds.
- **Extras kept:** CSS-only tech marquee (paused under reduced motion), copy-email button with an accessible status message, theme toggle, flat 2px scroll progress bar.
- **Extras rejected:** command palette, live clock, GitHub stat tile (would need a build-time API fetch; no value for the technical story yet), sticky stacked cards (scroll-jacking cost), rotating-letter badge (decoration without information).
