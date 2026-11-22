// Visual + a11y QA for the redesign. Run against a production build:
//   npm run build && npm run start   (then, in another shell)
//   node scripts/design-qa.mjs [baseUrl=http://localhost:3000]
// Screenshots go to design-qa/<page>-<theme>-<width>.png; a JSON report to design-qa/report.json.
// Exit code 1 when any assertion fails.
import fs from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const OUT = "design-qa";
const WIDTHS = [375, 768, 1280, 1920];
const AXE_WIDTHS = new Set([375, 1280]);
const THEMES = ["light", "dark"];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const failures = [];
const report = { pages: [], checks: {} };
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

// Discover two project slugs and one album from the built site.
async function discover() {
  const page = await browser.newPage();
  await page.goto(`${BASE}/projects`);
  const slugs = await page.$$eval('a[href^="/projects/"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  await page.goto(`${BASE}/photography`);
  const albums = await page.$$eval('a[href^="/photography/"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  await page.close();
  return { projects: slugs.slice(0, 2), album: albums[0] };
}

const { projects, album } = await discover();
const PAGES = [
  ["home", "/"],
  ["projects", "/projects"],
  ...projects.map((p, i) => [`project-${i + 1}`, p]),
  ["events", "/events"],
  ["photography", "/photography"],
  ...(album ? [["album", album]] : []),
  ["404", "/this-page-does-not-exist"],
  ["admin-login", "/admin/login"],
];

const IGNORED_REQUEST = /\/_vercel\/|vercel-insights|vitals\.vercel/;

async function newContext(theme, width, extra = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...extra });
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("zk-theme", t);
    } catch {}
  }, theme);
  return context;
}

for (const [name, path] of PAGES) {
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      const where = `${name} ${theme} ${width}`;
      const context = await newContext(theme, width);
      const page = await context.newPage();
      const errors = [];
      const failed = [];
      page.on("console", (m) => {
        if (m.type() !== "error") return;
        // Network failures are asserted (with URLs) by the response handler below; the console
        // copy has no URL. Vercel Analytics/Speed Insights scripts only exist on Vercel.
        if (/Failed to load resource|_vercel\//.test(m.text())) return;
        errors.push(m.text().slice(0, 200));
      });
      page.on("requestfailed", (r) => !IGNORED_REQUEST.test(r.url()) && failed.push(`${r.url()} ${r.failure()?.errorText}`));
      page.on("response", (r) => {
        if (r.status() < 400 || IGNORED_REQUEST.test(r.url())) return;
        if (name === "404" && r.request().resourceType() === "document") return;
        failed.push(`${r.status()} ${r.url()}`);
      });

      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${name}-${theme}-${width}.png`, fullPage: true });

      const metrics = await page.evaluate(() => {
        const html = document.documentElement;
        const fonts = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
        const small = [...document.querySelectorAll("header a, header button, main button, a.rounded-full, button.rounded-full")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && style.visibility !== "hidden" && style.opacity !== "0" && !el.closest("[aria-hidden=true], dialog:not([open])");
          })
          .filter((el) => el.getBoundingClientRect().height < 43.5)
          .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`);
        return {
          overflow: html.scrollWidth - window.innerWidth,
          dark: html.classList.contains("dark"),
          colorScheme: getComputedStyle(html).colorScheme,
          hasUnbounded: fonts.some((f) => /Unbounded/i.test(f)),
          hasGeist: fonts.some((f) => /Geist(?! Mono)/i.test(f)),
          small,
        };
      });

      if (metrics.overflow > 0) fail(where, `horizontal overflow ${metrics.overflow}px`);
      if (errors.length) fail(where, `console errors: ${errors.join(" | ")}`);
      if (failed.length) fail(where, `failed requests: ${failed.join(" | ")}`);
      if (!metrics.hasUnbounded || !metrics.hasGeist) fail(where, "Unbounded/Geist not loaded");
      if (metrics.dark !== (theme === "dark")) fail(where, `html dark class is ${metrics.dark}`);
      if (metrics.colorScheme !== theme) fail(where, `color-scheme is ${metrics.colorScheme}`);
      if (metrics.small.length) fail(where, `tap targets < 44px: ${metrics.small.join(", ")}`);

      // Focus ring: Tab through the first interactive elements and require a visible outline.
      if (width === 1280) {
        const missing = [];
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press("Tab");
          const info = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const s = getComputedStyle(el);
            return { label: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30), ok: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 };
          });
          if (info && !info.ok) missing.push(info.label);
        }
        if (missing.length) fail(where, `no visible focus ring on: ${missing.join(", ")}`);
      }

      if (AXE_WIDTHS.has(width)) {
        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        serious.forEach((v) => fail(where, `axe ${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" ; ")}`));
        report.pages.push({ where, axeSerious: serious.length });
      }

      await context.close();
    }
  }
}

// Theme: default light, persistence, no flash with slow JS.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const initial = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (initial) fail("theme", "first load with empty storage is not light");
  await page.locator("header").getByRole("button", { name: /Dark theme/ }).first().click();
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => [document.documentElement.classList.contains("dark"), localStorage.getItem("zk-theme")]);
  if (!persisted[0] || persisted[1] !== "dark") fail("theme", `toggle did not persist: ${persisted}`);

  // Slow every JS chunk by 3s: the theme must already be correct before hydration.
  await page.route("**/_next/static/chunks/**", async (route) => {
    await new Promise((r) => setTimeout(r, 3000));
    await route.continue();
  });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const early = await page.evaluate(() => [document.documentElement.classList.contains("dark"), getComputedStyle(document.body).backgroundColor]);
  await page.screenshot({ path: `${OUT}/theme-slow-js-dark.png` });
  if (!early[0] || early[1] !== "rgb(10, 10, 10)") fail("theme", `flash of wrong theme before hydration: ${early}`);
  report.checks.theme = { initialLight: !initial, persisted, beforeHydration: early };
  await context.close();
}

// No JS: hero, about, projects and FAQ visible.
{
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`);
  await page.screenshot({ path: `${OUT}/nojs-home-1280.png`, fullPage: true });
  const checks = {
    h1: await page.locator("h1").first().isVisible(),
    about: await page.locator("[data-about-para]").first().isVisible(),
    projects: await page.locator("#projects h3").first().isVisible(),
    faq: await page.locator("#faq summary").first().isVisible(),
  };
  Object.entries(checks).forEach(([k, ok]) => !ok && fail("no-js", `${k} not visible`));
  report.checks.noJs = checks;
  await context.close();

  const html = await (await fetch(`${BASE}/`)).text();
  const serverHtml = {
    h1: /<h1[^>]*>[^<]*Zean Kurt Balboa/.test(html),
    about: html.includes("data-about-para"),
  };
  Object.entries(serverHtml).forEach(([k, ok]) => !ok && fail("server-html", `${k} missing`));
  report.checks.serverHtml = serverHtml;
}

// Reduced motion: no running animations, content visible.
{
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const moving = await page.evaluate(() =>
    document.getAnimations().filter((a) => a.playState === "running" && (a.effect?.getComputedTiming().duration ?? 0) > 1).length,
  );
  await page.screenshot({ path: `${OUT}/reduced-motion-home-1280.png`, fullPage: true });
  if (moving) fail("reduced-motion", `${moving} animations still running`);
  report.checks.reducedMotion = { runningAnimations: moving };
  await context.close();
}

// Content stress: inject extreme CMS-like content into rendered tiles.
for (const width of [375, 1280]) {
  const context = await newContext("light", width);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const long = "Extremely long project name that keeps going without any natural break pneumonoultramicroscopicsilicovolcanoconiosis";
    document.querySelectorAll("#projects h3 a, #projects h4 a").forEach((a) => (a.textContent = long));
    document.querySelectorAll("#projects article p.line-clamp-3").forEach((p) => (p.textContent = "Lorem ipsum ".repeat(80)));
    const tags = document.querySelector("#projects article ul");
    if (tags) for (let i = 0; i < 12; i++) tags.insertAdjacentHTML("beforeend", `<li><span class="inline-flex rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] uppercase">Tag-number-${i}-supercalifragilistic</span></li>`);
    const timeline = document.querySelector("#experience ol li p.mt-3");
    if (timeline) timeline.textContent = "Very long bullet ".repeat(120);
  });
  await page.screenshot({ path: `${OUT}/stress-home-light-${width}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) fail(`stress ${width}`, `overflow ${overflow}px`);
  await context.close();
}

await browser.close();

report.failures = failures;
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`Pages: ${PAGES.map(([n]) => n).join(", ")}`);
console.log(`Screenshots: ${OUT}/`);
console.log(failures.length ? `FAIL (${failures.length})\n- ${failures.join("\n- ")}` : "PASS: all checks");
process.exit(failures.length ? 1 : 0);
