/**
 * Single source of truth for who Zean is, as read by search engines and AI
 * answer engines. Metadata, JSON-LD, llms.txt, the sitemap, OG images and
 * identity copy all read from here. Keep it technical-first: photography lives
 * on /photography only and must not leak into these fields.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://zeankurt.vercel.app"
).replace(/\/+$/, "");

export const identity = {
  name: "Zean Kurt Balboa",
  givenName: "Zean Kurt",
  familyName: "Balboa",
  alternateNames: ["Zean Balboa", "Ze.ku", "zekuuu"],
  jobTitles: [
    "Full-Stack Web Developer",
    "Full-Stack Software Developer",
    "Aspiring Software Engineer",
  ],
  /** Static hero subtitle and default title suffix. */
  role: "Full-Stack Web Developer & Aspiring Software Engineer",
  location: {
    locality: "Cavite",
    country: "PH",
    label: "Cavite, Philippines",
  },
  education: {
    degree: "BS Computer Science",
    year: "3rd year",
    school: "Cavite State University",
    campus: "Main Campus, Indang, Cavite",
    url: "https://cvsu.edu.ph",
  },
  credentials: [
    {
      name: "Computer Systems Servicing NC II",
      issuer: "TESDA",
      issuerUrl: "https://www.tesda.gov.ph",
      issued: "2024-10",
    },
  ],
  awards: [
    "Best Pivot Award, Base Batches Global Buildathon 2025 (Team TryCatch Us)",
    "Finalist, ICP Hub Philippines iThink Hackathon, Philippine Blockchain Week 2025",
  ],
  ventures: [
    {
      id: "webx",
      name: "WebX",
      role: "Co-Founder",
      description: "Web development team building client websites and web applications.",
    },
    {
      id: "studio-nomads",
      name: "Studio Nomads",
      role: "Co-Founder",
      description: "Co-founded by Zean Kurt Balboa.",
    },
  ],
  community: [
    {
      name: "AWS Student Builder Group – Spade (CvSU)",
      role: "Member, Software Development / Engineering",
    },
  ],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Laravel",
    "Supabase",
    "PostgreSQL",
    "MySQL",
    "Vite",
    "FastAPI",
    "SQLite",
    "Electron",
    "Rust (Odra smart contracts)",
  ],
  knowsAbout: [
    "Full-stack web development",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "MySQL",
    "Laravel",
    "REST APIs",
    "Authentication and authorization",
    "Web3",
    "Base ecosystem",
    "Smart contracts",
    "AI-assisted software development",
  ],
  profiles: {
    github: "https://github.com/zekuuu",
    linkedin: "https://www.linkedin.com/in/zeank/",
    x: "https://x.com/Ze_kuuuu",
    devfolio: "https://devfolio.co/@kurtt_z",
    devStation: "https://zekuuu.dev-station.dev",
  },
  twitterHandle: "@Ze_kuuuu",
  /** Meta description (<155 chars). Exact copy supplied by Zean. */
  metaDescription:
    "Zean Kurt Balboa is a full-stack web developer and aspiring software engineer in the Philippines building with Next.js, React, TypeScript and Supabase.",
  /** Exact copy supplied by Zean. Do not paraphrase. */
  bios: {
    short:
      "Full-stack web developer & aspiring software engineer 🇵🇭 | Next.js · React · TypeScript · Supabase | Co-founder @ WebX, Studio Nomads | Best Pivot Award, Base Batches 2025",
    medium:
      "I'm Zean Kurt Balboa, a full-stack web developer and aspiring software engineer based in Cavite, Philippines, studying BS Computer Science at Cavite State University. I build web applications with Next.js, React, TypeScript, Laravel and Supabase, including Clario, CLINIQ, Salikop and NameThat. I co-founded WebX and Studio Nomads, and won the Best Pivot Award at the Base Batches Global Buildathon 2025.",
    long: [
      "I'm Zean Kurt Balboa, a full-stack web developer and aspiring software engineer based in Cavite, Philippines. I'm a third-year BS Computer Science student at Cavite State University, and I like building tools that solve a real workflow problem: clean interfaces and the backend that holds them together.",
      "I work mainly with Next.js, React, TypeScript, Tailwind CSS, Laravel, Supabase and PostgreSQL. My projects include Clario, a desktop spreadsheet validation tool, CLINIQ, a clinic tracking system for a school, Salikop, a campus organization event management platform, and NameThat, a Web3 app on Base that I built as a developer for a hackathon.",
      "I co-founded WebX, a web development team that builds websites and web apps for clients, and Studio Nomads. I won the Best Pivot Award at the Base Batches Global Buildathon 2025 with Team TryCatch Us and was a finalist at the ICP Hub Philippines iThink Hackathon. I'm open to internships, client web projects through WebX, and collaborations.",
    ],
  },
  /** Hero paragraph: plain text so crawlers read it in one pass. */
  heroCopy:
    "Full-stack developer, Web3 builder and BS Computer Science student at Cavite State University. Co-founder of WebX and Studio Nomads. Best Pivot Award, Base Batches Global Buildathon 2025.",
  /** Technical roles for the decorative typewriter. */
  rotatingRoles: [
    "Full-Stack Developer",
    "Web3 Builder",
    "Aspiring Software Engineer",
    "Co-Founder @ WebX",
  ],
  lookingFor: [
    "Software engineering internships",
    "Client web projects through WebX",
    "Collaborations and hackathon teams",
  ],
} as const;

export const sameAs = Object.values(identity.profiles);

export const longBio = identity.bios.long.join("\n\n");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
