# SEO Audit: Baseline (2026-11-15)

Branch: `seo/geo-entity-optimization`. Measured on a local production build (`next build && next start`).

## Build

`npm run build` is clean (Next.js 16.2.9, Turbopack). Routes:

| Route | Type |
|---|---|
| `/` | static, revalidate 1m |
| `/photography`, `/photography/[album]` (5 albums) | static / SSG, revalidate 1m |
| `/admin`, `/admin/login`, `/api/admin/upload-file`, `/auth/callback` | dynamic |
| `/icon.jpg` | static (2736x2736 JPEG) |

No `robots`, `sitemap`, `manifest`, `opengraph-image`, `/projects` or `llms.txt` routes.

## Built HTML (`.next/server/app/index.html`)

- `ld+json` blocks: **0**
- `<title>`: `Zean Kurt Balboa — My Personal Portfolio`
- `description`: "Co-Founder at Studio Nomads, Co-Founder at WebX, Aspiring Full-Stack Developer, Web3 community contributor, and photographer/videographer and editor at Studio Nomads — based in Cavite, Philippines."
- `og:title`: `Zean Kurt Balboa — Full-Stack Developer & Photographer`. There is no `og:image`, `og:url` or `og:site_name`, and no Twitter tags.
- Canonical: **none**
- The hero `<section>` is server-rendered with `style="visibility:hidden"` (confirms finding #4).
- Other sections (About, Projects, Experience, Skills, Contact) are **not** hidden in the server HTML. Their GSAP `autoAlpha: 0` states are applied client-side only.

## CMS (Supabase), live values

`src/data/site.ts` is **not in git** and does not exist locally. `scripts/seed-supabase.mjs` imports it, so the seed script cannot run as-is.

`site_content.site_config`:

| Field | Current value |
|---|---|
| `title` | `Full-Stack Developer & Photographer` |
| `headline` | `Building modern systems. Capturing real moments.` |
| `description` | "Co-Founder at Studio Nomads, Co-Founder at WebX, Aspiring Full-Stack Developer, Web3 community contributor, and photographer/videographer and editor at Studio Nomads — based in Cavite, Philippines." |
| `tone` | confident, minimalist, futuristic, **creative** |
| `email` | set |

The DB has drifted from the `src/data/*.ts` seeds:
- `projects` has **14** published rows. Not in seeds: Beavr, Pollen Panic, PlanPal, Capture The Block UI, Stock Market Bubble Sort Visualizer, FarmChain, Peppa's Shoppe Discord Bot, StitchyBot. Mount Tala is not in the DB.
- **9 project `github_url`s still point to `github.com/xKurty06/…`** (the old handle).
- `projects.namethat.role` = `Co-Founder & Developer`.
- `experience_items` already has `WebX — Co-Founder & Full-Stack Developer` and `Base Batches Global Buildathon 2025 — Best Pivot Award`. It also has an old `Base Philippines — Builder - Global Buildathon / Participated` row.
- The iThink finalist entry is **duplicated**: slugs `ithink-hackathon` and `icp-hub-philippines-ithink-hackathon-finalist`.
- Creative/non-technical experience rows: `Studio Nomads — Co-Founder, Photographer, Videographer & Editor`, `When In Manila — Featured Photographer`, and `TESDA NC II` (typed `work`; it is a credential).
- `skill_categories` includes a published `Creative & Media`.

## Lighthouse (mobile, local prod, `/`)

| Category | Score |
|---|---|
| Accessibility | 96 (fail: color contrast of `--foreground-muted` on cards, 4.21:1; `--foreground-subtle` carousel counter, 4.23:1) |
| Best Practices | 96 (console errors) |
| SEO | 100 (this score only checks basics such as title, meta and crawlable links, not entity signals) |

Performance trace (desktop, no throttling): **LCP 3477 ms**, of which render delay was 3459 ms (TTFB 19 ms). The page loader plus the hidden hero cause the delay. **CLS 0.00.**

## Findings confirmed

All P0 findings in the master prompt §1 were reproduced. The hero copy, `ROLES`, the "Creatives" CTA, the About/Skills/Contact headings and the footer copy are hard-coded in components. The meta description, OG title and hero tagline come from the CMS.
