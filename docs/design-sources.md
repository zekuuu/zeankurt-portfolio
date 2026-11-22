# Design sources

No third-party component code was copied into the redesign. Every component was written in this repo, so there are no license obligations to track.

| What | Source | How it was used | License |
|---|---|---|---|
| Bento tile and frame structure | Blitz-style bento (brief reference) | Structure only: sharp outer frame, rounded inner tiles, small gaps, pill CTA | n/a, no code or assets |
| Swiss index rows, mono section labels | [superdesign: Swiss Grid Agency Layout](https://superdesign.dev/library/swiss-grid-agency-layout) | Layout idea only | n/a, no code |
| Marquee | Pattern only (React Bits has one) | Rewritten as CSS-only (`ui/Marquee.tsx`) | React Bits not used: license reported as MIT + Commons Clause by some copies, unverified |
| Bento grid spans | Pattern only (Aceternity, Cult UI) | Plain CSS grid | Not used: licenses unverified |
| Icons | [lucide-react](https://lucide.dev) (already a dependency) | All UI icons, stroke 1.75 | ISC |
| Brand marks (GitHub, LinkedIn, Facebook, Instagram) | Existing `ui/SocialIcon.tsx` | Unchanged | Existing |
| Fonts | Unbounded, Geist, Geist Mono via `next/font/google` | Display, body, labels | SIL OFL 1.1 |

See `docs/design-exploration.md` for the reference shortlist and the prototype decision.
