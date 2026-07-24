/* Visual QA: scrolls through the site in headless Chrome and captures
 * screenshots at each section in both themes. Run: bun scripts/shot.mjs */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/aviusx-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

// Dark is default
await shot("01-dark-hero");

// Wheel-scroll (drives Lenis like a real user) and capture along the way
const stops = [
  ["02-dark-about", 1100],
  ["03-dark-marquee", 900],
  ["04-dark-exp-1", 900],
  ["05-dark-exp-2", 1200],
  ["06-dark-exp-3", 1600],
  ["07-dark-exp-last", 2400],
  ["08-dark-projects-1", 1200],
  ["09-dark-projects-2", 1400],
  ["10-dark-projects-3", 1400],
  ["11-dark-contact", 1800],
  ["12-dark-footer", 1400],
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

// Light theme pass
await page.click('button[aria-label="Toggle color theme"]');
await page.waitForTimeout(1200);
await shot("13-light-contact");
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await shot("14-light-hero");
for (const [name, dy] of [
  ["15-light-about", 1300],
  ["16-light-projects", 6200],
]) {
  let remaining = dy;
  while (remaining > 0) {
    const step = Math.min(400, remaining);
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
    remaining -= step;
  }
  await page.waitForTimeout(900);
  await shot(name);
}

console.log("Console errors:", errors.length ? errors : "none");
await browser.close();
