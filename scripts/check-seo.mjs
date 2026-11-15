// Post-build SEO guard. Run `npm run build && npm run check:seo`.
// Fails (exit 1) on invalid JSON-LD, missing canonical/h1, hidden hero text,
// or photography leaking into identity signals.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), ".next", "server", "app");
const errors = [];
const fail = (file, msg) => errors.push(`${path.relative(root, file)}: ${msg}`);

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

const pages = htmlFiles(root).filter((file) => !/_not-found|_global-error|admin/.test(file));
if (pages.length === 0) fail(root, "no built HTML found; run `npm run build` first");

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail(file, "no JSON-LD");
  for (const [, json] of blocks) {
    try {
      const data = JSON.parse(json);
      if (data["@context"] !== "https://schema.org") fail(file, "JSON-LD missing @context");
      for (const node of data["@graph"] ?? [data]) {
        if (!node["@type"]) fail(file, "JSON-LD node missing @type");
        if (node["@type"] === "Person") {
          const signals = JSON.stringify([node.sameAs, node.knowsAbout, node.jobTitle]);
          if (/photo|shot\.by|instagram|videograph/i.test(signals)) {
            fail(file, "Person sameAs/knowsAbout/jobTitle mentions photography");
          }
        }
      }
    } catch (error) {
      fail(file, `invalid JSON-LD: ${error.message}`);
    }
  }

  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) fail(file, "missing canonical");
  if (/xKurty06/i.test(html)) fail(file, "links to old xKurty06 handle");

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(file, `expected 1 <h1>, found ${h1s.length}`);
}

const home = path.join(root, "index.html");
if (fs.existsSync(home)) {
  const html = fs.readFileSync(home, "utf8");
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (/photograph|videograph/i.test(description)) fail(home, "meta description mentions photography");
  if (/<section[^>]*visibility:\s*hidden/.test(html)) fail(home, "a section is visibility:hidden in server HTML");
  if (!/<h1[^>]*>[\s\S]*?Zean Kurt Balboa[\s\S]*?<\/h1>/.test(html)) fail(home, "<h1> does not contain the name");
  if (!html.includes("Full-Stack Web Developer &amp; Aspiring Software Engineer")) {
    fail(home, "static subtitle missing");
  }
}

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`SEO check passed for ${pages.length} pages.`);
