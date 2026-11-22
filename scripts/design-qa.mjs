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

// Normal runs skip the once-per-tab intro; the intro has its own test below.
const skipIntro = () => {
  try {
    sessionStorage.setItem("zk-intro", "1");
  } catch {}
};

async function newContext(theme, width, extra = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...extra });
  await context.addInitScript(skipIntro);
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
  await context.addInitScript(skipIntro);
  const page = await context.newPage();
  const themeErrors = [];
  page.on("pageerror", (e) => themeErrors.push(e.message));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const initial = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (initial) fail("theme", "first load with empty storage is not light");
  await page.locator("header").getByRole("button", { name: /Dark theme/ }).first().click();
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => [document.documentElement.classList.contains("dark"), localStorage.getItem("zk-theme")]);
  if (!persisted[0] || persisted[1] !== "dark") fail("theme", `toggle did not persist: ${persisted}`);
  if (themeErrors.length) fail("theme", `errors during view-transition toggle: ${themeErrors.join(" | ")}`);

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
  await context.addInitScript(skipIntro);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const moving = await page.evaluate(() =>
    document.getAnimations().filter((a) => a.playState === "running" && (a.effect?.getComputedTiming().duration ?? 0) > 1).length,
  );
  await page.screenshot({ path: `${OUT}/reduced-motion-home-1280.png`, fullPage: true });
  if (moving) fail("reduced-motion", `${moving} animations still running`);
  if (await page.evaluate(() => document.documentElement.classList.contains("lenis"))) fail("reduced-motion", "Lenis active");
  if (await page.locator(".intro").isVisible()) fail("reduced-motion", "intro visible");
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

// Intro loader: once per tab, never without JS or with reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const shown = await page.locator(".intro").isVisible();
  await page.screenshot({ path: `${OUT}/intro-light-1280.png` });
  await page.waitForFunction(() => !document.documentElement.classList.contains("zk-intro"), null, { timeout: 3000 }).catch(() => {});
  const gone = await page.evaluate(() => !document.documentElement.classList.contains("zk-intro"));
  const flag = await page.evaluate(() => sessionStorage.getItem("zk-intro"));
  await page.reload({ waitUntil: "domcontentloaded" });
  const again = await page.locator(".intro").isVisible();
  if (!shown) fail("intro", "not shown on first visit");
  if (!gone) fail("intro", "still visible after 3s");
  if (flag !== "1") fail("intro", "sessionStorage flag not set");
  if (again) fail("intro", "shown again after reload in the same tab");
  report.checks.intro = { shown, gone, flag, shownAfterReload: again };
  await context.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const p2 = await noJs.newPage();
  await p2.goto(`${BASE}/`);
  if (await p2.locator(".intro").isVisible()) fail("intro", "visible without JS");
  await noJs.close();
}

// Listbox: keyboard flow, URL sync, themed list screenshot.
for (const theme of THEMES) {
  const context = await newContext(theme, 1280);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const trigger = page.locator("#projects button[aria-haspopup='listbox']");
  if (!(await trigger.count())) {
    fail("listbox", "role filter not found");
    await context.close();
    continue;
  }
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const listVisible = await page.locator("[role=listbox]").isVisible();
  await page.screenshot({ path: `${OUT}/listbox-open-${theme}-1280.png`, clip: await trigger.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left - 20), y: Math.max(0, r.top - 20), width: Math.min(window.innerWidth - r.left + 20, r.width + 40), height: 360 };
  }) });
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  const url = page.url();
  const closed = !(await page.locator("[role=listbox]").count());
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-haspopup") === "listbox");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  const escClosed = !(await page.locator("[role=listbox]").count());
  if (!listVisible) fail(`listbox ${theme}`, "did not open with Enter");
  if (!/[?&]filter=/.test(url)) fail(`listbox ${theme}`, "selection did not update ?filter=");
  if (!closed || !escClosed) fail(`listbox ${theme}`, "did not close on select/Escape");
  if (!focusBack) fail(`listbox ${theme}`, "focus did not return to the trigger");
  await context.close();
}

// Lenis, nav scroll offset, nav indicator, progress bar color, header hide.
{
  const context = await newContext("light", 1280);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  if (!(await page.evaluate(() => document.documentElement.classList.contains("lenis")))) fail("lenis", "not active on /");
  const barTop = await page.evaluate(() => getComputedStyle(document.querySelector(".scroll-progress")).backgroundColor);
  await page.locator("nav[aria-label=Primary] a", { hasText: "Projects" }).click();
  await page.waitForTimeout(1800);
  const offset = await page.evaluate(() => {
    const header = document.querySelector("[data-site-header]").getBoundingClientRect().height;
    return Math.round(document.getElementById("projects").getBoundingClientRect().top - header);
  });
  if (Math.abs(offset) > 6) fail("lenis", `#projects lands ${offset}px off the header edge`);
  const indicatorA = await page.evaluate(() => document.querySelector("nav[aria-label=Primary] li[aria-hidden]")?.style.transform);
  await page.locator("nav[aria-label=Primary] a", { hasText: "Skills" }).click();
  await page.waitForTimeout(1800);
  const indicatorB = await page.evaluate(() => document.querySelector("nav[aria-label=Primary] li[aria-hidden]")?.style.transform);
  if (!indicatorA || indicatorA === indicatorB) fail("nav indicator", `did not move (${indicatorA} -> ${indicatorB})`);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  const barBottom = await page.evaluate(() => getComputedStyle(document.querySelector(".scroll-progress")).backgroundColor);
  if (barTop === barBottom) fail("progress bar", `color did not change (${barTop})`);
  report.checks.progress = { barTop, barBottom };
  await context.close();

  const admin = await newContext("light", 1280);
  const ap = await admin.newPage();
  await ap.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  if (await ap.evaluate(() => document.documentElement.classList.contains("lenis"))) fail("lenis", "active on /admin");
  await admin.close();

  const mobile = await newContext("light", 375);
  const mp = await mobile.newPage();
  await mp.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await mp.evaluate(() => window.scrollTo(0, 1200));
  await mp.waitForTimeout(150);
  await mp.evaluate(() => window.scrollTo(0, 1600));
  await mp.waitForTimeout(400);
  const hidden = await mp.evaluate(() => document.querySelector("[data-site-header]").dataset.hidden);
  await mp.evaluate(() => window.scrollTo(0, 1300));
  await mp.waitForTimeout(400);
  const shownAgain = await mp.evaluate(() => document.querySelector("[data-site-header]").dataset.hidden);
  if (hidden !== "true" || shownAgain !== "false") fail("header hide", `hidden=${hidden} afterScrollUp=${shownAgain}`);
  // Menu open locks the page.
  await mp.locator("button[aria-label='Open menu']").click();
  const before = await mp.evaluate(() => window.scrollY);
  await mp.mouse.wheel(0, 600);
  await mp.waitForTimeout(400);
  const after = await mp.evaluate(() => window.scrollY);
  if (before !== after) fail("scroll lock", `page scrolled behind the menu (${before} -> ${after})`);
  await mobile.close();
}

// Image viewer: blurred backdrop, frame, speed, keyboard, zoom, swipe.
for (const theme of THEMES) {
  const context = await newContext(theme, 1280, { hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const zoomBtn = page.locator("#projects button[aria-label^='Zoom']").first();
  if (!(await zoomBtn.count())) {
    fail(`viewer ${theme}`, "no zoomable project image found");
    await context.close();
    continue;
  }
  await zoomBtn.scrollIntoViewIfNeeded();
  const t0 = Date.now();
  await zoomBtn.click();
  await page.waitForFunction(() => {
    const d = document.querySelector("dialog.viewer[open]");
    return d && getComputedStyle(d).opacity === "1";
  }, null, { timeout: 2000 }).catch(() => {});
  const openMs = Date.now() - t0;
  const info = await page.evaluate(() => {
    const d = document.querySelector("dialog.viewer[open]");
    if (!d) return null;
    const frame = d.firstElementChild;
    return { blur: getComputedStyle(d, "::backdrop").backdropFilter, border: getComputedStyle(frame).borderTopWidth };
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/viewer-${theme}-1280.png` });
  if (!info) fail(`viewer ${theme}`, "did not open");
  else {
    if (!/blur/.test(info.blur)) fail(`viewer ${theme}`, `backdrop not blurred (${info.blur})`);
    if (info.border !== "1px") fail(`viewer ${theme}`, `frame border is ${info.border}`);
  }
  if (openMs > 600) fail(`viewer ${theme}`, `took ${openMs}ms to open`);
  await page.locator("dialog.viewer[open] [aria-label='Zoom in']").click();
  const zoomed = await page.locator("dialog.viewer[open] [aria-label='Zoom out']").count();
  if (!zoomed) fail(`viewer ${theme}`, "zoom did not toggle");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
  if (!/^Zoom /.test(focusBack)) fail(`viewer ${theme}`, `focus returned to "${focusBack}"`);
  report.checks[`viewer-${theme}`] = { openMs, ...info };
  await context.close();
}

// Photography: shareable ?photo= links, Back closes, swipe changes photo.
{
  const context = await newContext("light", 1280, { hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${BASE}/photography`, { waitUntil: "networkidle" });
  const first = page.locator("#gallery-title ~ * button, section[aria-labelledby=gallery-title] ul button").first();
  await first.click();
  await page.waitForTimeout(300);
  const id = new URL(page.url()).searchParams.get("photo");
  if (!id) fail("photo link", "opening a photo did not set ?photo=");
  const count1 = await page.locator("dialog.viewer[open] .label").first().textContent();
  await page.evaluate(() => {
    const area = document.querySelector("dialog.viewer[open] .touch-none");
    const fire = (type, x) => area.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: 300, pointerType: "touch", bubbles: true, pointerId: 1 }));
    fire("pointerdown", 600);
    fire("pointerup", 450);
  });
  await page.waitForTimeout(200);
  const count2 = await page.locator("dialog.viewer[open] .label").first().textContent();
  if (count1 === count2) fail("swipe", `photo did not change (${count1})`);
  await page.goBack();
  await page.waitForTimeout(300);
  if (await page.locator("dialog.viewer[open]").count()) fail("photo link", "Back did not close the viewer");

  if (id) {
    await page.goto(`${BASE}/photography?photo=${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    if (!(await page.locator("dialog.viewer[open]").count())) fail("photo link", "?photo= did not open the viewer");
  }
  await context.close();
}

// Local image optimizer serves modern formats.
{
  const html = await (await fetch(`${BASE}/`)).text();
  const src = html.match(/\/_next\/image\?url=[^"&]+&amp;w=\d+&amp;q=\d+/)?.[0]?.replaceAll("&amp;", "&");
  if (src) {
    const res = await fetch(`${BASE}${src}`, { headers: { Accept: "image/avif,image/webp,*/*" } });
    const type = res.headers.get("content-type");
    if (!/webp|avif/.test(type ?? "")) fail("images", `optimizer returned ${type}`);
    report.checks.imageFormat = type;
  }
}

// Source guard: no all-caps labels, wide tracking or decorative numbering.
{
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
  const offenders = walk("src/components").concat(walk("src/app"))
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => /\buppercase\b|tracking-\[0\.|padStart\(2/.test(fs.readFileSync(f, "utf8")));
  if (offenders.length) fail("source", `caps/tracking/numbering in: ${offenders.join(", ")}`);
}

await browser.close();

report.failures = failures;
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`Pages: ${PAGES.map(([n]) => n).join(", ")}`);
console.log(`Screenshots: ${OUT}/`);
console.log(failures.length ? `FAIL (${failures.length})\n- ${failures.join("\n- ")}` : "PASS: all checks");
process.exit(failures.length ? 1 : 0);
