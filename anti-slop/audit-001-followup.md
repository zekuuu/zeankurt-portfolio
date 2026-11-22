# antislop audit 001: follow-up (2026-11-22)

Mode: after. The owner approved all findings in `audit-001-2026-11-22.md`, then overrode two of them during the work (R-37, recorded below).

Design Read: personal developer portfolio for recruiters, clients and hackathon teams, in a neo-Swiss / neo-brutalist bento language, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

## Finding status

| # | Status | What changed |
|---|---|---|
| 1 | Fixed in code; CMS pending | Seed titles and descriptions in `src/data/projects.ts` use colons; the admin empty value reads "Unknown". The live titles come from Supabase and still contain em dashes; listed in `TODO_ZEAN.md` (owner content, also used in metadata and JSON-LD, so code does not rewrite it). |
| 2 | Fixed | New `Listbox` (themed select with keyboard support) for the project filter and the admin (`AdminSelect` wraps it); `fieldClass` for inputs, textareas and dates; native file button styled as a pill; square ink checkbox; native `title` tooltips removed from social links. |
| 3, 3b | Fixed | `.label` is sentence case with normal tracking; Badge, nav, theme toggle and admin labels follow. Section indexes, tile numbers, row numbers and `01 / 24` counters are gone ("3 of 24" in the viewer). A source guard in the QA script fails on `uppercase`, `tracking-[0.` or `padStart(2`. |
| 4 | Fixed | Hero eyebrow removed; location moved into the status tile. |
| 5 | Fixed | Arrows only on external links and previous/next; status list uses ruled rows. |
| 6 | Owner override | The owner asked to keep the infinite marquee. It now shows Simple Icons brand logos in muted ink that take their brand color on hover, pauses on hover/focus and is static under reduced motion. |
| 7 | Owner override (partial) | The owner asked to keep multi-color project cards. Rotation kept; the barely visible muted card became green and status badges got an ink border so they stay readable on a card of the same color. Everywhere else color follows meaning (404/error orange, events and meta tiles neutral). |
| 8 | Fixed | "Case study" renamed to "Project details". |
| 10 | Fixed | Skills is a ruled definition list instead of tiles; alternating section backgrounds removed. |
| 12 | Fixed | Gallery captions removed; titles stay in alt text and the viewer header. |
| 14 | Fixed | Admin loading is a plain status line. |

Also delivered at the owner's request: once-per-tab intro, Lenis inertial scrolling with exact section offsets, nav in page order with a sliding indicator, header hide on scroll below `lg`, framed image viewer (blurred backdrop, zoom, swipe, preload, loading and error states, filmstrip, shareable `?photo=` links), route fade, circular theme reveal, multi-color progress bar, themed scrollbars.

## Delivery Gate

### Block 1: Hard Gate

| Rule | Result | Evidence |
|---|---|---|
| R-02 | PASS (agent copy); owner content pending | No em dash in agent-written UI text or seed data. CMS project titles still contain them: listed in `TODO_ZEAN.md`. |
| R-03 | PASS | QA: zero horizontal overflow on 9 pages × 2 themes × 375/768/1280/1920, plus stress content at 375 and 1280. |
| R-17, R-18, R-36, R-38 | PASS | Only CMS data and `identity.ts` facts; no testimonials, no invented numbers. |
| R-23 | PASS | Logos are the projects' real tools (Simple Icons, CC0); no invented people or assets. |
| R-24 | PASS | Every nav item maps to an existing section or page; order matches the page. |
| R-25 | PASS | axe: zero serious/critical issues (including contrast) on every page in both themes at 375 and 1280. |
| R-26, R-35 | PASS | Automated click-through in `scripts/design-qa.mjs`: listbox (Enter opens, ArrowDown + Enter selects, `?filter=` updates, Esc closes, focus returns); nav "Projects" lands within 6px of the header edge; nav indicator moves between sections; theme toggle persists after reload with no errors; mobile menu opens and locks scrolling; image viewer opens with blur and 1px frame, zoom toggles, Esc closes and focus returns; photo click sets `?photo=`, swipe changes the photo, Back closes, a `?photo=` link opens the viewer. |
| R-27 | PASS | Viewer has loading line, error message and Retry; empty states for filters and galleries; admin loading line. |
| R-28 | PASS | FAQ is built from real identity facts (`lib/faq.ts`). |
| R-32 | PASS | QA Tab walk: visible focus ring on every focused element; dialogs close with Esc; listbox fully keyboard operable. |
| R-33 | PASS | All changes are in source; no patch scripts in the repo. |
| R-34 | PASS | Every QA check runs in light and dark. |
| R-37 | PASS | `DESIGN.md` is the direction; owner overrides recorded above. |

### Block 2: Purpose-Gate

| Rule | Result | Reason written in `DESIGN.md` |
|---|---|---|
| R-01 / R-13 | PASS | No gradients or glows; block colors on cards are an owner override; the progress bar color shift is a recorded exception. |
| R-04 | PASS | Lucide (owner choice) only where icons carry meaning; brand logos only in the stack marquee. |
| R-06 | PASS | Fonts chosen by the owner, reasons in Decisions; mono only for data; no caps or wide tracking. |
| R-07 | PASS | No background grids. |
| R-08 | PASS | ↗ only for new-tab links. |
| R-09 | PASS | Badges are real status or tags; no eyebrow pill above the H1. |
| R-10 | PASS | One blur: the viewer backdrop. |
| R-12 | PASS | No shadows. |
| R-14 | PASS | Project cards differ by size (wide first card) and color; Skills uses a list, not cards. |
| R-19 | PASS | Each motion has a purpose (Motion section); QA confirms zero running animations, no Lenis and no intro under reduced motion. |
| R-22 | PASS | No illustrations. |

### Block 3: Liveliness

| Check | Result |
|---|---|
| Dials declared | PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 |
| Output matches dials | PASS: sections vary (bento, ruled list, timeline, accordion, CTA block); motion is purposeful, not cinematic |
| Focal point per screen | PASS: hero name; one large heading per section |
| Structural whitespace | PASS |
| One deliberate accent | PASS: cobalt; block colors are the owner's card identity |
| Identity motif | PASS: sharp frame with rounded tiles, `ZK.` wordmark, Unbounded headings |

### Block 4: Craftsmanship & Quality Locks

All PASS: no default-only decisions without a written reason (C-1, R-31); every control works (C-2); sections serve content (C-3); states, themes, breakpoints and keyboard covered by QA (C-4); no fabricated claims (C-5); bento is an owner choice used where content differs in weight (R-05); radii follow the system (R-11); CTAs are specific ("View projects", "Email me", "Project details") (R-15); no buzzwords (R-16); light default with a working toggle (R-21); palette is neutral + cobalt + the owner's block colors (R-29); no clone (R-30).

## Not verified

- Authenticated admin screens: no credentials locally. The admin changes are visual (Listbox, fields, labels), but please click through add/edit/delete in both themes.
- Lighthouse on a fresh session (intro shown): home 86 performance, 100 accessibility, 96 best practices, 100 SEO, LCP 4.2s; project page 88 / 100 / 96 / 100, LCP 4.0s. About 80 to 90% of LCP is render delay while the intro covers the page; later loads in the same tab skip it. Best practices is 96 only because Vercel analytics scripts 404 locally.
