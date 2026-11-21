// TEMPORARY Phase 0 prototype route. noindex, not in sitemap. Delete in Phase 6.
import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { identity } from "@/lib/identity";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-lab-display" });

export const metadata: Metadata = { title: "Design lab", robots: { index: false, follow: false } };

const css = `
.lab{--bg:#F4F1EA;--surface:#FFFFFF;--surface-2:#EBE7DD;--ink:#0A0A0A;--muted:#55524B;--line:#0A0A0A;--primary:#1F3CFF;--on-primary:#FFFFFF;--y:#FFD84D;--o:#FF5A3D;--g:#2FD27F;
  background:var(--bg);color:var(--ink);font-family:var(--font-geist-sans),system-ui,sans-serif;padding:16px}
.lab.dk{--bg:#0A0A0A;--surface:#161616;--surface-2:#1F1F1F;--ink:#F4F1EA;--muted:#A8A39A;--line:#F4F1EA;--primary:#6C86FF;--on-primary:#0A0A0A}
.lab .frame{border:1px solid var(--line);max-width:1200px;margin:0 auto}
.lab .bar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)}
.lab .mono{font-family:var(--font-geist-mono),monospace;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:500}
.lab .disp{font-family:var(--font-lab-display),sans-serif;font-weight:700;letter-spacing:-.03em;line-height:.98}
.lab .grid{display:grid;gap:6px;padding:6px}
.lab .tile{border-radius:18px;padding:20px;min-width:0}
.lab .t-surface{background:var(--surface);border:1px solid var(--line)}
.lab .t-muted{background:var(--surface-2)}
.lab .t-primary{background:var(--primary);color:var(--on-primary)}
.lab .t-y{background:var(--y);color:#0A0A0A}.lab .t-o{background:var(--o);color:#0A0A0A}.lab .t-g{background:var(--g);color:#0A0A0A}
.lab .pill{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);font-size:14px;font-weight:500}
.lab .pill.pri{background:var(--primary);color:var(--on-primary);border-color:var(--primary)}
.lab .tag{display:inline-flex;border:1px solid currentColor;border-radius:999px;padding:3px 10px}
.lab .rule{border-top:1px solid var(--line)}
.lab .corner{position:relative}.lab .corner:before,.lab .corner:after{content:"+";position:absolute;font-family:var(--font-geist-mono);font-size:14px;line-height:1}
.lab .corner:before{top:-8px;left:-5px}.lab .corner:after{bottom:-8px;right:-5px}
.lab .blueprint{background-image:linear-gradient(var(--surface-2) 1px,transparent 1px),linear-gradient(90deg,var(--surface-2) 1px,transparent 1px);background-size:32px 32px}
@media(min-width:900px){.lab .g12{grid-template-columns:repeat(12,minmax(0,1fr))}.lab .s8{grid-column:span 8}.lab .s4{grid-column:span 4}.lab .s6{grid-column:span 6}.lab .s3{grid-column:span 3}.lab .s5{grid-column:span 5}.lab .s7{grid-column:span 7}}
`;

function Controls() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <span className="pill pri">View projects <ArrowUpRight size={16} /></span>
      <span className="pill">Email</span>
      <span className="pill mono" aria-hidden><Sun size={14} /> Light</span>
      <span className="pill mono" aria-hidden><Moon size={14} /> Dark</span>
      <span className="tag mono t-g" style={{ borderColor: "transparent" }}>Live</span>
      <span className="tag mono">Next.js</span>
    </div>
  );
}

/** A: Poster bento — big headline tile, block-color side tiles. */
function DirectionA() {
  return (
    <div className="frame">
      <div className="bar"><span className="disp" style={{ fontSize: 20 }}>ZK.</span><span className="mono">A / Poster bento</span></div>
      <div className="grid g12">
        <div className="tile t-surface s8" style={{ minHeight: 360, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p className="mono" style={{ color: "var(--muted)" }}>Full-stack web developer · Cavite, PH</p>
          <p className="disp" style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)" }}>{identity.name}</p>
          <Controls />
        </div>
        <div className="s4 grid" style={{ padding: 0 }}>
          <div className="tile t-y"><p className="mono">Status</p><p className="disp" style={{ fontSize: 24, marginTop: 8 }}>Open to internships</p></div>
          <div className="tile t-primary"><p className="mono">01 / Featured</p><p className="disp" style={{ fontSize: 28, marginTop: 8 }}>Clario</p><p style={{ marginTop: 6, fontSize: 14 }}>Desktop spreadsheet validation tool.</p></div>
        </div>
        <div className="tile t-muted s12" style={{ gridColumn: "1/-1" }}><p className="mono">Next.js · React · TypeScript · Tailwind CSS · Laravel · Supabase · PostgreSQL</p></div>
      </div>
    </div>
  );
}

/** B: Swiss index — asymmetric columns, numbered rows, rules instead of tiles. */
function DirectionB() {
  const rows = [["01", "Clario", "Desktop tool", "2025"], ["02", "CLINIQ", "Clinic tracking", "2025"], ["03", "Salikop", "Event platform", "2024"]];
  return (
    <div className="frame">
      <div className="bar"><span className="disp" style={{ fontSize: 20 }}>ZK.</span><span className="mono">B / Swiss index</span></div>
      <div className="grid g12" style={{ padding: 24, gap: 24 }}>
        <div className="s7"><p className="mono" style={{ color: "var(--muted)" }}>00 / Intro</p><p className="disp" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginTop: 12 }}>Building full-stack web products.</p></div>
        <div className="s5" style={{ alignSelf: "end" }}><p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{identity.heroCopy}</p><div style={{ marginTop: 16 }}><Controls /></div></div>
      </div>
      {rows.map(([i, n, d, y]) => (
        <div key={i} className="rule" style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 16, padding: "16px 24px", alignItems: "baseline" }}>
          <span className="mono">{i}</span><span className="disp" style={{ fontSize: 28 }}>{n} <span style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 400, fontSize: 15, letterSpacing: 0, color: "var(--muted)" }}>{d}</span></span><span className="mono">{y}</span>
        </div>
      ))}
    </div>
  );
}

/** C: Blueprint — grid-line backdrop, + corner marks, coordinate labels. */
function DirectionC() {
  return (
    <div className="frame blueprint">
      <div className="bar" style={{ background: "var(--bg)" }}><span className="disp" style={{ fontSize: 20 }}>ZK.</span><span className="mono">C / Blueprint · 14.32°N 120.94°E</span></div>
      <div className="grid g12" style={{ padding: 24, gap: 24 }}>
        <div className="tile t-surface s6 corner"><p className="mono">[A1] Identity</p><p className="disp" style={{ fontSize: "clamp(2rem,5vw,3.75rem)", marginTop: 12 }}>{identity.name}</p><p style={{ marginTop: 12, color: "var(--muted)" }}>{identity.role}</p></div>
        <div className="tile t-o s3 corner"><p className="mono">[A2] Award</p><p className="disp" style={{ fontSize: 22, marginTop: 12 }}>Best Pivot, Base Batches 2025</p></div>
        <div className="tile t-surface s3 corner"><p className="mono">[A3] Controls</p><div style={{ marginTop: 12 }}><Controls /></div></div>
      </div>
    </div>
  );
}

export default function DesignLab() {
  return (
    <main id="main-content" className={unbounded.variable}>
      <style>{css}</style>
      <h1 className="sr-only">Design lab</h1>
      {[DirectionA, DirectionB, DirectionC].map((D, i) => (
        <section key={i} style={{ display: "grid", gap: 0 }}>
          <div className="lab"><D /></div>
          <div className="lab dk"><D /></div>
        </section>
      ))}
    </main>
  );
}
