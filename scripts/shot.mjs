// Quick screenshot helper: node scripts/shot.mjs <url> <out-prefix> [widths=375,1280] [themes=light,dark]
import { chromium } from "playwright";
const [url, out, widths = "375,1280", themes = "light,dark"] = process.argv.slice(2);
const browser = await chromium.launch();
for (const theme of themes.split(",")) {
  for (const w of widths.split(",").map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    await ctx.addInitScript((t) => localStorage.setItem("zk-theme", t), theme);
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}-${theme}-${w}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${theme} ${w}: overflow=${overflow} errors=${errors.length}${errors.length ? " " + errors.join(" | ") : ""}`);
    await ctx.close();
  }
}
await browser.close();
