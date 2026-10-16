const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  const enterBtn = await page.waitForSelector('button');
  await enterBtn.click();
  await new Promise(r => setTimeout(r, 4500));

  console.log('Setting 5 categories and navigating to Floor 2...');
  await page.evaluate(() => {
    if (window.useStore) {
      window.useStore.getState().setCategoryCountOverride(5);
      window.useStore.getState().setCurrentFloor(2);
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  const outPath = 'C:\\Users\\premier\\.gemini\\antigravity\\brain\\32b57318-1206-47c6-929c-ba3ae57e7738\\coming_soon_view.png';
  await page.screenshot({ path: outPath });
  console.log('Screenshot of Floor 4 with Coming Soon saved!');
  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
