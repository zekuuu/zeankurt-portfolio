# TODO (Zean)

The code now handles identity, metadata and JSON-LD. The items below need your input, or live in Supabase, where code changes don't reach. Work through **1** before deploying: until then, `/projects/namethat` and `/llms.txt` still say "Co-Founder" for NameThat.

## 1. Supabase edits (Admin panel or Table Editor)

### `site_content` → row `key = 'site_config'` → `value` (JSON)

| Field | Set to |
|---|---|
| `title` | `Full-Stack Web Developer & Aspiring Software Engineer` |
| `headline` | `Building full-stack web products.` |
| `description` | `Zean Kurt Balboa is a full-stack web developer and aspiring software engineer in the Philippines building with Next.js, React, TypeScript and Supabase.` |
| `tone` | `["confident", "minimalist", "futuristic", "technical"]` |

The site no longer renders these fields. They are still serialized into the page payload, though, so crawlers can read the old creative wording until you change them.

### `projects`

| Row (`slug`) | Field | Set to |
|---|---|---|
| `namethat` | `role` | `Full-stack Developer` |
| `namethat` | `description` | `Hackathon project: a Web3 mini app on Base with image upload, community name suggestions and voting, a leaderboard, wallet linking and Supabase APIs.` |
| `namethat` | `tags` | `{Next.js,Tailwind CSS,Supabase,Web3,Base,Hackathon}` |
| `namethat` | `github_url` / `live_url` | the repo or demo URL, if public |
| `beavr` | `role` | pick one: currently `Full-stack Developer Lead Backend Developer` (two roles run together) |
| all 9 rows with `github.com/xKurty06/...` | `github_url` | `github.com/zekuuu/...`. The site rewrites these at render time already, but fix the source too. |
| new rows | | add **Clario** and **CLINIQ** (seed copy is in `src/data/projects.ts`). Add a GitHub URL and year for each. |
| all | `sort_order` | technical strength first: Clario, CLINIQ, Salikop, NameThat, Beavr, Aurum, KokConnect, then the rest |
| all | `long_description` | fill in for every project. Detail pages show it, and AI engines quote it. |

### `experience_items`

| Row (`slug`) | Change |
|---|---|
| `namethat` | `role` to `Full-stack Developer`, `type` to `hackathon`, `description` to `Built NameThat, a hackathon project: a Web3 mini app on Base with image upload, community name suggestions and voting, a leaderboard, wallet linking and Supabase APIs.` |
| `studio-nomads` | `role` to `Co-Founder`, `description` to `Co-founder of Studio Nomads.` The homepage hides this row until the role stops saying Photographer/Videographer/Editor. |
| `base-buildathon` (`Builder - Global Buildathon`) | unpublish. It duplicates `base-batches-global-buildathon-best-pivot-award`. |
| `ithink-hackathon` **or** `icp-hub-philippines-ithink-hackathon-finalist` | unpublish one. Same entry twice (the code de-dupes it, but the "hackathons" counter should be right at the source). |
| `when-in-manila-featured-photographer` | unpublish (or move to the photography page). The homepage already hides it. |
| `tesda-computer-systems-servicing-nc-ii` | unpublish. It is a credential and already appears under certifications. |
| new | **AWS Student Builder Group – Spade (CvSU)**, type `community`, role `Member, Software Development / Engineering`, plus period |

### `skill_categories`

- `Creative & Media`: set `published = false`. The homepage already filters it out.
- Add **Python** and **Java (OOP)**, plus networking/system administration if you want them listed. TODO: confirm first.

## 2. Confirm before any copy mentions them

- [ ] **Symph**: exact title (e.g. "Web & Mobile App Development Intern") and dates. Not mentioned anywhere yet.
- [ ] **Zentra**: "Co-founder (with Kurt and Aqil)" or "Head Admin & Moderation"? Pick one wording. Not mentioned anywhere yet.
- [ ] Which other GitHub-README projects to publish: KokConnect, Aurum, Catch The Block UI, zen-bot, ZiellyCheese, FeedFlow (proposal), USOP (proposal).
- [ ] Clario: repo URL, year, public or private.
- [ ] CLINIQ: repo URL, year.
- [ ] Custom domain (e.g. `zeankurt.dev`). After you buy it: add it in Vercel, set `NEXT_PUBLIC_SITE_URL`, and redirect `zeankurt.vercel.app` to it (Vercel → Domains → Redirect).
- [ ] Screenshots for each project (`projects.image_path`). Detail pages render them with alt text.
- [ ] Notes for 2–3 technical posts if you want a `/writing` section (skipped until there is real material).

## 3. Environment variables (Vercel)

- `NEXT_PUBLIC_SITE_URL`: canonical origin (currently falls back to `https://zeankurt.vercel.app`).
- `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`: optional. These render the verification meta tags.

## 4. Off-site (section 7 of the master prompt)

- [ ] Google Search Console + Bing Webmaster: verify, submit `/sitemap.xml`, request indexing for `/`, `/projects`, and each `/projects/<slug>`.
- [ ] Devfolio `@kurtt_z`: name → Zean Kurt Balboa; bio → `bios.short`; add the Best Pivot + iThink finalist results; add projects; link the portfolio.
- [ ] GitHub `zekuuu`: display name → Zean Kurt Balboa; bio leads with the developer role (drop "Aspiring Trader"); README: describe Studio Nomads as a neutral co-founder line; Twitter field `@xKurty_` → `@Ze_kuuuu`; re-pin cliniq, clario, Lost-N-Found, Centralized-Campus-Org-Event-Management, nextjs-supabase-template.
- [ ] LinkedIn: headline + About = `bios.short` / `bios.medium`; Honors: Best Pivot Award; NameThat as a project (Full-stack Developer).
- [ ] X `@Ze_kuuuu` and Instagram `@sc.kurty.z`: lead with the developer role.
- [ ] Same portfolio URL and the same name spelling in every profile.
- [ ] Re-check Google AI Mode, Gemini, ChatGPT and Perplexity in 2–6 weeks.
