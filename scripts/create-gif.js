const path = require("path");
const os = require("os");
const { chromium } = require("playwright");

async function search(page, text) {
  const searchFieldButton = page.locator(".dsla-search-field button");
  await searchFieldButton.click({ delay: 500 });
  await page.waitForTimeout(500);

  await page.type(".aa-Input", text, { delay: 750 });
  await page.waitForTimeout(750);
  await page.press(".aa-Input", "Enter");
}

const size = { width: 1000, height: 600 };

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: {
      width: size.width * 1.2,
      height: size.height * 1.2,
    },
    logger: {
      isEnabled: (name, severity) => true,
      log: (name, severity, message, args) => console.log(`${name} ${message}`),
    },
    recordVideo: { dir: os.tmpdir(), size },
  });
  const page = await context.newPage();
  page.video().saveAs(path.join(__dirname, "preview.webm"));

  await page.goto("https://christianflach.de/OpenWeatherMap-PHP-API");

  await page.waitForTimeout(3000);

  await search(page, "php");
  await page.waitForTimeout(1000);

  await search(page, "api");
  await page.waitForTimeout(3000);

  await page.close();
  await context.close();
  await browser.close();
})();
