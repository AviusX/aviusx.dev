/* Visual QA for the god theme (devoke.dev): scrolls through the site in
 * headless Chrome and captures screenshots at each section, desktop and
 * mobile. Uses the god.localhost host alias so the proxy serves the god
 * theme. Run against a server with: bun scripts/shot-god.mjs [port]
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const PORT = process.argv[2] ?? "3000";
const BASE = `http://god.localhost:${PORT}`;
const OUT = "/tmp/devoke-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

await shot("01-god-hero");
await page.mouse.move(500, 400);
await page.waitForTimeout(600);
await shot("02-god-hero-pointer");

const stops = [
  ["03-god-legend", 1100],
  ["04-god-marquee", 1000],
  ["05-god-eras-1", 900],
  ["06-god-eras-2", 1200],
  ["07-god-eras-3", 1600],
  ["08-god-eras-last", 2400],
  ["09-god-feats-1", 1200],
  ["10-god-feats-2", 1400],
  ["11-god-feats-3", 1400],
  ["12-god-summon", 1800],
  ["13-god-footer", 1400],
];
for (const [name, dy] of stops) {
  let remaining = dy;
  while (remaining > 0) {
    const step = Math.min(300, remaining);
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(90);
    remaining -= step;
  }
  await page.waitForTimeout(900);
  await shot(name);
}

// Mobile pass
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
mobile.on("pageerror", (err) => errors.push(`mobile: ${err}`));
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.waitForTimeout(3500);
await mobile.screenshot({ path: `${OUT}/14-god-mobile-hero.png` });
await mobile.evaluate(() => window.scrollTo(0, 1400));
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/15-god-mobile-legend.png` });
await mobile.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/16-god-mobile-summon.png` });

console.log("Console errors:", errors.length ? errors : "none");
await browser.close();
