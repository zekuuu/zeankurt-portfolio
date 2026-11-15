# SEO Changelog

## 2026-11-15: SEO + GEO/AEO + entity optimization (`seo/geo-entity-optimization`)

### Phase 1: Baseline
- Added `SEO_AUDIT.md`: build route table, built-HTML findings, live CMS values, Lighthouse and LCP baseline.

### Phase 2: Technical
- `src/lib/identity.ts`: single source of truth. Holds name, alternate names, job titles, education, credential, awards, ventures, stack, `knowsAbout`, profiles (`sameAs`), Zean's exact bios (`short` / `medium` / `long` P1–P3), meta description and hero copy.
- `src/app/layout.tsx`: `metadataBase`; title `Zean Kurt Balboa | Full-Stack Web Developer & Aspiring Software Engineer` with template `%s | Zean Kurt Balboa`; technical meta description; authors/creator/publisher/keywords; Open Graph `profile` (siteName, `en_PH`, url, image); Twitter `summary_large_image` + `@Ze_kuuuu`; `robots` with `max-image-preview: large` and `max-snippet: -1`; verification slots from env. Also adds a skip link and site-wide JSON-LD.
- Canonicals are set per page (`/`, `/projects`, `/projects/[slug]`, `/events`, `/photography`, albums).
- New routes: `robots.ts` (all named search/AI crawlers allowed; `/admin`, `/api`, `/auth` disallowed), `sitemap.ts` (CMS-driven, priorities 1.0 / 0.9 / 0.4 / 0.2, `lastModified` from `projects.updated_at`), `manifest.ts`, `opengraph-image.tsx` (text-only brand card), per-project `opengraph-image`, `llms.txt`, `llms-full.txt`.
- Icons: `src/app/icon.png` (512) and `apple-icon.png` (180) replace the 2736px `icon.jpg` / `favicon.jpg`.
- JSON-LD (`src/lib/structured-data.tsx`): `Person` (`@id /#person`, technical `jobTitle`/`knowsAbout` only, no photography in `sameAs`), `WebSite`, `Organization` for WebX and Studio Nomads (founder → Person), `ProfilePage` + `FAQPage` on `/`, `ItemList` + `BreadcrumbList` on `/projects`, and `SoftwareSourceCode`/`SoftwareApplication` + `BreadcrumbList` per project. NameThat is a project, not an organization. `<` is escaped in the inline JSON.
- `middleware.ts`: `X-Robots-Tag: noindex, nofollow` on `/admin`, `/api` and `/auth`. The admin layout also sets `robots: noindex`.
- CMS mapping: `github.com/xKurty06/…` URLs are rewritten to `github.com/zekuuu/…`. Duplicate experience rows (same organization + role) are de-duplicated. `updatedAt` is exposed for the sitemap.
- `scripts/check-seo.mjs` (`npm run check:seo`) fails the run on invalid or missing JSON-LD, a missing canonical, anything other than exactly one `<h1>`, `xKurty06` links, photography in Person signals or the meta description, a hidden hero section, or a missing static subtitle.

### Phase 3: Content and rendering
- Hero: the server HTML is no longer `visibility:hidden`. It is hidden after hydration only while the loader runs. `<h1>` holds the static name only. A static, non-animated subtitle reads "Full-Stack Web Developer & Aspiring Software Engineer". The typewriter is decorative (`aria-hidden`), sits outside the `<h1>`, and cycles technical roles only. Hero copy uses Zean's exact text. The "Creatives" CTA is now "GitHub". "Capture" is gone from the orbit.
- About: the H2 reads "Building full-stack web products." The three paragraphs are `bios.long` P1–P3 verbatim, with accents kept. The "Creative / shoots" counter is now "Hackathons".
- Homepage order: Hero, Projects, About, Skills, Experience, FAQ, Contact. `PhotographyTeaser` was removed (deleted, unused). The `Creative & Media` skill category and photographer/videographer experience rows are filtered out of the homepage. Meetup/attendee events moved to `/events`; hackathons and technical roles stay on `/`.
- New FAQ section: server-rendered `<details>` with technical answers only.
- New pages: `/projects` (index), `/projects/[slug]` (SSG detail with H1, honest badges such as Team repo / Hackathon / status, role, year, stack, repo/live links, next-project link) and `/events`. Homepage project titles link to their detail pages, and the section links to `/projects`.
- Contact: heading reads "Open to internships, client web projects, and collaborations."; only personal profiles are shown (no photography/Studio Nomads social groups).
- Skills heading is technical. The footer uses the meta description and links `/photography` (no `@shot.by.zk`). Footer nav adds All projects and Events.
- Photography titles: "Photography by Zean Kurt Balboa (Shot by ZK)".
- Seeds (`src/data`): NameThat is now a hackathon project with role "Full-stack Developer". Studio Nomads is a neutral "Co-Founder". Base Buildathon is now Best Pivot Award. Added a WebX experience entry and Clario and CLINIQ projects.
- Accessibility: the loader name is no longer an `<h2>` (it broke heading order), `--foreground-subtle` raised to `#7c8aa0`, and inactive carousel cards raised to 80% opacity (fixes contrast).
- README updated (Next 16, React 19, Tailwind 4, Supabase CMS, SEO setup).
