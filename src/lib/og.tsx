import { ImageResponse } from "next/og";
import { identity } from "@/lib/identity";

export const ogSize = { width: 1200, height: 630 };

/*
 * OG images render outside the page, so CSS variables are unavailable. These
 * literals mirror the light-theme tokens in globals.css; keep them in sync.
 */
const OG = {
  bg: "#f4f1ea",
  surface: "#ffffff",
  ink: "#0a0a0a",
  muted: "#55524b",
  primary: "#1f3cff",
  onPrimary: "#ffffff",
  yellow: "#ffd84d",
};

/** Fetches a Google font subset at build time; returns null offline so the default font is used. */
async function loadFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

/** Text-only brand card in the neo-Swiss system. Deliberately no photos. */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  chips,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  chips: readonly string[];
}) {
  const [body, font] = await Promise.all([
    loadFont("Geist", 500, (s => s + s.toUpperCase())(`${eyebrow}${subtitle}${chips.join("")}${identity.location.label}`)),
    loadFont("Unbounded", 700, `${title}ZK.`),
  ]);
  const display = font ? "Unbounded" : undefined;
  // Satori uses the first font as the default, so Geist must come first.
  const fonts = [
    ...(body ? [{ name: "Geist", data: body, weight: 500 as const, style: "normal" as const }] : []),
    ...(font ? [{ name: "Unbounded", data: font, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 16, gap: 8, background: OG.bg, fontFamily: body ? "Geist" : undefined }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            borderRadius: 24,
            border: `2px solid ${OG.ink}`,
            background: OG.surface,
            color: OG.ink,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: OG.muted }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                fontFamily: display,
                fontSize: title.length > 28 ? 60 : 84,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 30, color: OG.muted }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {chips.slice(0, 5).map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: `2px solid ${OG.ink}`,
                  fontSize: 20,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              padding: 36,
              borderRadius: 24,
              background: OG.primary,
              color: OG.onPrimary,
              fontFamily: display,
              fontSize: 96,
              fontWeight: 700,
            }}
          >
            ZK.
          </div>
          <div style={{ height: 150, display: "flex", alignItems: "flex-end", padding: 28, borderRadius: 24, background: OG.yellow, color: OG.ink, fontSize: 24 }}>
            {identity.location.label}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}

export const defaultOgCopy = {
  eyebrow: "Developer portfolio",
  title: identity.name,
  subtitle: identity.role,
  chips: ["Next.js", "React", "TypeScript", "Supabase", "Laravel", "Web3"],
};

/** "ZK." monogram on a flat cobalt block, used for favicon and touch icons. */
export async function renderMonogram(size: number) {
  const font = await loadFont("Unbounded", 700, "ZK.");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: OG.primary,
          color: OG.onPrimary,
          fontFamily: font ? "Unbounded" : undefined,
          fontSize: size * 0.36,
          fontWeight: 700,
          letterSpacing: -size * 0.01,
        }}
      >
        ZK.
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: font ? [{ name: "Unbounded", data: font, weight: 700, style: "normal" }] : undefined,
    },
  );
}
