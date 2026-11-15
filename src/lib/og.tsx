import { ImageResponse } from "next/og";
import { identity } from "@/lib/identity";

export const ogSize = { width: 1200, height: 630 };

/** Text-only brand card. Deliberately no photos. */
export function renderOgImage({
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
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#e6f6fb",
          background:
            "radial-gradient(circle at 85% 15%, rgba(72,202,228,0.28), transparent 45%), linear-gradient(135deg, #023e8a 0%, #03111f 55%, #030712 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#90e0ef", textTransform: "uppercase" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: title.length > 28 ? 64 : 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#ffffff" }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#caf0f8" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {chips.slice(0, 6).map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "8px 20px",
                borderRadius: 999,
                border: "2px solid rgba(144,224,239,0.45)",
                fontSize: 24,
                color: "#caf0f8",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}

export const defaultOgCopy = {
  eyebrow: "Developer portfolio",
  title: identity.name,
  subtitle: identity.role,
  chips: ["Next.js", "React", "TypeScript", "Supabase", "Laravel", "Web3"],
};
