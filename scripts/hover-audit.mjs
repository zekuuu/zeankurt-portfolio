// Hover audit: hovers every visible button/link/pill three times (leaving in
// between) and reports controls whose fill never changes or repeats a color.
// Usage: node scripts/hover-audit.mjs [baseUrl] [path...]   (against `npm run start`)
import { chromium } from "playwright";

const base = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ["/", "/projects", "/photography"];
const browser = await chromium.launch();
const rows = [];

for (const path of paths) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("zk-intro", "1"));
  const page = await context.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const handles = await page.$$(
    "a.rounded-full, button.rounded-full, a.rounded-tile, .hover-fill, header nav a, button[aria-haspopup]",
  );

  for (const h of handles) {
    if (!(await h.isVisible())) continue;
    const name = ((await h.getAttribute("aria-label")) || (await h.innerText()).trim() || "?").replace(/\s+/g, " ").slice(0, 32);
    const bg = () => h.evaluate((e) => getComputedStyle(e).backgroundColor);
    await h.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await page.waitForTimeout(220);
    const rest = await bg();
    const seen = [];
    for (let i = 0; i < 3; i++) {
      await h.hover({ force: true }).catch(() => {});
      await page.waitForTimeout(220);
      seen.push(await bg());
      await page.mouse.move(2, 2);
      await page.waitForTimeout(120);
    }
    const changed = seen.some((c) => c !== rest);
    const repeats = seen.some((c, i) => i > 0 && c === seen[i - 1]);
    rows.push({ path, name, rest, seen: seen.join(" / "), ok: changed && !repeats });
  }
  await context.close();
}

await browser.close();
const bad = rows.filter((r) => !r.ok);
console.log(`audited ${rows.length} controls, ${bad.length} problems`);
for (const r of bad) console.log(`${r.path} "${r.name}" rest=${r.rest} hovers=${r.seen}`);
process.exit(bad.length ? 1 : 0);
