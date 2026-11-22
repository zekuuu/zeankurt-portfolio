// First-load payload: JS/CSS/fonts referenced by a page's server HTML (no prefetches).
// Usage: node scripts/measure-payload.mjs <url> [...urls]   (against `npm run start`)
import zlib from "node:zlib";

const kb = (n) => Math.round(n / 1024);

for (const url of process.argv.slice(2)) {
  const html = await (await fetch(url)).text();
  const assets = [
    ...[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => ["js", m[1]]),
    ...[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => ["css", m[1]]),
    ...[...html.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.woff2)"/g)].map((m) => ["font", m[1]]),
  ].filter(([, href]) => !href.includes("/_vercel/"));

  const totals = { js: 0, jsGzip: 0, css: 0, font: 0 };
  for (const [type, href] of [...new Map(assets.map((a) => [a[1], a])).values()]) {
    const body = Buffer.from(await (await fetch(new URL(href, url))).arrayBuffer());
    totals[type] += body.length;
    if (type === "js") totals.jsGzip += zlib.gzipSync(body).length;
  }
  console.log(JSON.stringify({ url, jsKB: kb(totals.js), jsGzipKB: kb(totals.jsGzip), cssKB: kb(totals.css), fontKB: kb(totals.font) }));
}
