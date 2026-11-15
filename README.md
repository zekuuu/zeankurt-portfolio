# Zean Kurt Balboa — Personal Portfolio

> Developer portfolio of Zean Kurt Balboa, full-stack web developer and aspiring software engineer. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Supabase as a CMS.

---

## Overview

This site shows my projects, experience, hackathons and skills. A separate photography section lives at `/photography`. Built with modern web technologies and optimized for performance, accessibility, and user experience.

**Live:** [zeankurt.vercel.app](https://zeankurt.vercel.app)

---

## ✨ Key Features

- **Project Showcase** – Clean, interactive project cards with live links and source code references
- **Photography Gallery** – Multi-album layout with lightbox and optimized image loading
- **Smooth Animations** – GSAP-powered scroll effects, micro-interactions, and animated UI elements
- **Responsive Design** – Mobile-first, pixel-perfect across all devices
- **Dark Mode Ready** – Tailwind-based theming with accessibility in mind
- **Performance Optimized** – Next.js static generation, image optimization, and minimal runtime dependencies

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js](https://nextjs.org) 16 (App Router, Turbopack) |
| **UI** | React 19 with Server/Client boundaries |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **Animation** | GSAP, Framer Motion, three.js |
| **Content** | [Supabase](https://supabase.com) (Postgres CMS + Auth + Storage) with an `/admin` panel |
| **Deployment** | Vercel (+ Analytics, Speed Insights) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/zekuuu/zeankurt-portfolio.git
cd zeankurt-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout, site metadata, site-wide JSON-LD
│   ├── page.tsx           # Homepage (ProfilePage + FAQPage JSON-LD)
│   ├── projects/          # /projects index + /projects/[slug] detail pages
│   ├── events/            # Events & community list
│   ├── photography/       # Photography section
│   ├── admin/             # CMS admin (noindex, auth-gated)
│   ├── robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx
│   └── llms.txt/, llms-full.txt/  # Plain-text profile for AI crawlers
├── components/
│   ├── animation/         # GSAP & animation components
│   ├── layout/            # Header, Footer
│   ├── photography/       # Gallery, Lightbox, Albums
│   ├── sections/          # Hero, Projects, Skills, etc.
│   └── ui/                # Reusable UI elements
├── data/                  # Seed data for Supabase
├── lib/                   # identity.ts (SEO source of truth), CMS queries, structured data

└── types/                 # TypeScript type definitions
```

---

## 🎨 Sections

### Hero
Eye-catching landing section with animated background and CTA buttons.

### About
Brief professional overview with highlighted achievements and tech expertise.

### Experience
Timeline of roles, companies, and key contributions.

### Skills
Organized skill categories with visual badges.

### Projects
Featured and archived projects with descriptions, tech stacks, and links.

### Photography
Multi-album gallery with image thumbnails, lightbox viewer, and optimized lazy loading.

### Contact
Call-to-action section with social links and email contact.

---

## 🎬 Animation Highlights

- **Scroll Reveal** – Elements animate into view on scroll
- **Magnetic Buttons** – Cursor-tracking interactive buttons
- **Custom Cursor** – Smooth, animated cursor replacement
- **Animated Background** – Dynamic gradient backdrop effects
- **Typewriter Effect** – Cycling text animations
- **Scroll Progress** – Visual indicator of page scroll position

---

## 📸 Photography

Browse my photography portfolio across multiple albums:
- **Brands & Events** – Commercial and brand photography
- **Portraits** – Portrait and personal photography
- **Street & Landscapes** – Urban and travel photography
- **Campus Events** – Event documentation

Each album supports:
- Responsive grid layout
- Lightbox with zoom & navigation
- Optimized image delivery
- Lazy loading

---

## 🔧 Development

### Scripts

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Create production build
npm start          # Start production server
npm run check:seo  # After build: validate JSON-LD, canonical, h1, no hidden hero
```

### Configuration

- **TypeScript** – `tsconfig.json`
- **Tailwind** – CSS-first config in `src/app/globals.css`
- **PostCSS** – `postcss.config.mjs`
- **Next.js** – `next.config.ts`

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set these Vercel environment variables for **Production**, **Preview**, and **Development** as appropriate:

- `NEXT_PUBLIC_SITE_URL=https://zeankurt.vercel.app`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose it as `NEXT_PUBLIC_*`)
- `ADMIN_EMAILS` (comma-separated allowlisted admin emails)
- `PHOTOGRAPHY_BUCKET` (optional; defaults to `photography`)

In Supabase Auth URL Configuration, set the **Site URL** to `https://zeankurt.vercel.app` and add `https://zeankurt.vercel.app/auth/callback` to the allowed redirect URLs. Remove any `http://localhost:3000` value from the production Vercel environment. Keep the service-role key and admin email list in Vercel Environment Variables only.

## 🔎 SEO & AI discoverability

- `src/lib/identity.ts` is the single source for name, bios, roles, profiles and awards. Metadata, JSON-LD, `llms.txt` and OG images read from it.
- JSON-LD: `Person`, `WebSite`, `Organization` (site-wide); `ProfilePage` + `FAQPage` (home); `ItemList` (projects); `SoftwareSourceCode`/`SoftwareApplication` + `BreadcrumbList` (each project).
- Crawl files: `/robots.txt` (search + AI crawlers allowed, `/admin` `/api` `/auth` disallowed), `/sitemap.xml` (built from the CMS), `/llms.txt`, `/llms-full.txt`.
- Optional env: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`.
- Content-only fixes that live in Supabase are tracked in `TODO_ZEAN.md`.

---

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 📞 Connect

- **GitHub** – [@zekuuu](https://github.com/zekuuu)
- **Email** – [zkg.balboa@gmail.com](mailto:zkg.balboa@gmail.com)
- **LinkedIn** – [Zean Kurt Balboa](https://www.linkedin.com/in/zeank/)

---

<div align="center">

**Built by Zean Kurt Balboa**

*Last updated: November 2026*

</div>
