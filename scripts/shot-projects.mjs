/* Step-through QA of the marquee + projects stack. Run: bun scripts/shot-projects.mjs */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/aviusx-shots/projects";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// Wheel down to the marquee first
const marqueeY = await page.evaluate(
  () => document.querySelector('[aria-label="Technologies I work with"]').offsetTop
);
let pos = 0;
const wheelTo = async (target) => {
  while (pos < target) {
    const step = Math.min(400, target - pos);
    await page.mouse.wheel(0, step);
    pos += step;
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(800);
};

await wheelTo(marqueeY - 200);
await page.screenshot({ path: `${OUT}/marquee.png` });

// Then step through the whole projects section in small increments
const projY = await page.evaluate(() => document.getElementById("projects").offsetTop);
const projEnd = await page.evaluate(() => {
  const el = document.getElementById("projects");
  return el.offsetTop + el.offsetHeight - innerHeight;
});
await wheelTo(projY - 100);
let n = 0;
while (pos < projEnd + 200) {
  await page.screenshot({ path: `${OUT}/step-${String(n).padStart(2, "0")}.png` });
  n++;
  await wheelTo(pos + 450);
}
console.log(`captured marquee + ${n} steps`);
await browser.close();
