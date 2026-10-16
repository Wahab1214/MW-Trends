const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  try {
    const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  const floorArg = process.argv[2] || '1';
  const url = floorArg === '1' ? 'http://localhost:3000' : `http://localhost:3000/?floor=${floorArg}`;

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  if (floorArg === '1') {
    console.log('Waiting for landing button...');
    const btn = await page.waitForSelector('button', { timeout: 15000 });
    console.log('Clicking the landing button...');
    await btn.click();
    console.log('Waiting for entrance...');
    await new Promise(r => setTimeout(r, 4500));
  } else {
    console.log('Deep-linked floor, waiting for 3D scene...');
    await new Promise(r => setTimeout(r, 3500));
  }
  
  const fileName = floorArg === '1' ? 'current_view.png' : `floor_${floorArg}_view.png`;
  const outPath = path.join('C:\\Users\\premier\\.gemini\\antigravity\\brain\\32b57318-1206-47c6-929c-ba3ae57e7738', fileName);
  await page.screenshot({ path: outPath });
  console.log(`Saved screenshot to ${outPath}`);
  
  try {
    await browser.close();
  } catch (e) {}
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
}

main();
