const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });

    console.log('Clicking the landing button...');
    const btn = await page.waitForSelector('button', { timeout: 15000 });
    await btn.click();

    console.log('Waiting 5s for Floor 1 entrance...');
    await new Promise(r => setTimeout(r, 5000));

    const artifactDir = 'C:\\Users\\premier\\.gemini\\antigravity\\brain\\32b57318-1206-47c6-929c-ba3ae57e7738';
    
    // 1. Capture Floor 1
    const floor1Path = path.join(artifactDir, 'current_view.png');
    await page.screenshot({ path: floor1Path });
    console.log(`Saved Floor 1 screenshot: ${floor1Path}`);

    // 2. Click "ASCEND TO FLOOR 02" button
    console.log('Finding Ascend button...');
    const ascendBtn = await page.waitForSelector('button[aria-label="Ascend to Floor 2"]', { timeout: 8000 });
    if (ascendBtn) {
      console.log('Clicking Ascend button...');
      await ascendBtn.click();
      console.log('Waiting 2s for ascent animation to Floor 2...');
      await new Promise(r => setTimeout(r, 2000));

      // Capture Floor 2
      const floor2Path = path.join(artifactDir, 'floor_2_view.png');
      await page.screenshot({ path: floor2Path });
      console.log(`Saved Floor 2 screenshot: ${floor2Path}`);
    } else {
      console.log('Ascend button not found');
    }

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error in capture_flow:', err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
