/* Mobile + reduced-motion QA. Run: bun scripts/shot-mobile.mjs */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/aviusx-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

// --- Mobile pass ---
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/m1-hero.png` });

const scrollAndShoot = async (px, name) => {
  await page.evaluate((y) => window.scrollBy({ top: y, behavior: "instant" }), px);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/${name}.png` });
};
await scrollAndShoot(900, "m2-about");
await scrollAndShoot(1400, "m3-exp");
await scrollAndShoot(1600, "m4-exp2");
await scrollAndShoot(1600, "m5-projects");
await scrollAndShoot(2600, "m6-contact");
await page.close();

// --- Reduced motion pass ---
const rm = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
rm.on("pageerror", (err) => errors.push(String(err)));
await rm.goto("http://localhost:3000", { waitUntil: "networkidle" });
await rm.waitForTimeout(1500);
await rm.screenshot({ path: `${OUT}/rm1-hero.png` });
await rm.evaluate(() => document.getElementById("experience").scrollIntoView());
await rm.waitForTimeout(800);
await rm.screenshot({ path: `${OUT}/rm2-exp.png` });
await rm.evaluate(() => document.getElementById("contact").scrollIntoView());
await rm.waitForTimeout(800);
await rm.screenshot({ path: `${OUT}/rm3-contact.png` });

console.log("Errors:", errors.length ? errors : "none");
await browser.close();
