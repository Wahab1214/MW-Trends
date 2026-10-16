const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  console.log('Waiting for landing button...');
  const btn = await page.waitForSelector('button');
  await btn.click();
  console.log('Waiting for entrance...');
  await new Promise(r => setTimeout(r, 4500));

  console.log('Switching to Floor 2 via useStore...');
  await page.evaluate(() => {
    if (window.useStore) {
      window.useStore.getState().setCurrentFloor(2);
    }
  });

  console.log('Waiting 2s for Floor 2 rendering...');
  await new Promise(r => setTimeout(r, 2000));

  const floor2Path = 'C:\\Users\\premier\\.gemini\\antigravity\\brain\\32b57318-1206-47c6-929c-ba3ae57e7738\\floor_2_view.png';
  await page.screenshot({ path: floor2Path });
  console.log('Screenshot of Floor 2 saved to:', floor2Path);

  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
