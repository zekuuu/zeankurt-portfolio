// Usage: node scripts/measure-payload.mjs <url> [...urls]  (against `npm run start`)
// Prints decoded JS/CSS/font bytes each page loads, for before/after comparisons.
import { chromium } from "playwright";

const urls = process.argv.slice(2);
const browser = await chromium.launch();
for (const url of urls) {
  const page = await browser.newPage();
  const totals = { script: 0, stylesheet: 0, font: 0 };
  page.on("response", async (res) => {
    const type = res.request().resourceType();
    if (!(type in totals)) return;
    try { totals[type] += (await res.body()).length; } catch {}
  });
  await page.goto(url, { waitUntil: "networkidle" });
  console.log(JSON.stringify({ url, jsKB: Math.round(totals.script / 1024), cssKB: Math.round(totals.stylesheet / 1024), fontKB: Math.round(totals.font / 1024) }));
  await page.close();
}
await browser.close();
