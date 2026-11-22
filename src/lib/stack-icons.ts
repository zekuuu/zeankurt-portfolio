import {
  siClaude,
  siElectron,
  siFastapi,
  siFigma,
  siGit,
  siGithub,
  siGithubcopilot,
  siGooglegemini,
  siHtml5,
  siLaravel,
  siLinux,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siReact,
  siRust,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVite,
  type SimpleIcon,
} from "simple-icons";

/**
 * Brand marks for the stack marquee and skill tags (Simple Icons, CC0). Imported one by one,
 * so only these icons are bundled. Brand hex values come from the package and
 * are the one deliberate exception to the token-only color rule.
 */
const ICONS: Record<string, SimpleIcon> = {
  "Next.js": siNextdotjs,
  React: siReact,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  "Node.js": siNodedotjs,
  Laravel: siLaravel,
  Supabase: siSupabase,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  Vite: siVite,
  FastAPI: siFastapi,
  SQLite: siSqlite,
  Electron: siElectron,
  Rust: siRust,
  // Skill tags. Only exact matches: no logo is better than a wrong one.
  "HTML & CSS": siHtml5,
  Java: siOpenjdk,
  Git: siGit,
  GitHub: siGithub,
  Figma: siFigma,
  Linux: siLinux,
  "Github Copilot": siGithubcopilot,
  "GitHub Copilot": siGithubcopilot,
  Claude: siClaude,
  Gemini: siGooglegemini,
};

export interface StackLogo {
  label: string;
  path?: string;
  hex?: string;
  /** Brand color too dark to read on the dark theme (Next.js, Rust): use ink there. */
  darkBrand?: boolean;
}

function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Brand mark for one label, or just the label when there is no exact match. */
export function brandLogo(label: string): StackLogo {
  // "Rust (Odra smart contracts)" matches "Rust".
  const icon = ICONS[label] ?? ICONS[label.split(" (")[0]];
  return icon
    ? { label, path: icon.path, hex: `#${icon.hex}`, darkBrand: luminance(icon.hex) < 0.05 }
    : { label };
}

export function stackLogos(stack: readonly string[]): StackLogo[] {
  return stack.map(brandLogo);
}
