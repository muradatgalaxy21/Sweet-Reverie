import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });

  console.log("Taking full page screenshot...");
  await page.screenshot({
    path: "C:/Users/H0P/.gemini/antigravity-ide/brain/278db0a4-28b4-463e-8c49-76b1c310182e/homepage_full.png",
    fullPage: true,
  });

  console.log("Testing Add to Cart interaction...");
  const addToCartBtn = page.locator("button:has-text('Add to cart')").first();
  await addToCartBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: "C:/Users/H0P/.gemini/antigravity-ide/brain/278db0a4-28b4-463e-8c49-76b1c310182e/homepage_cart_drawer.png",
  });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
