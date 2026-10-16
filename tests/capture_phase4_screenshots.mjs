import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\premier\\.gemini\\antigravity\\brain\\32b57318-1206-47c6-929c-ba3ae57e7738';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Shirts Boutique (1440px)
  console.log('Capturing Shirts 1440px...');
  await page.goto(`${BASE_URL}/shop?shop=shirts&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_shirts_boutique.png') });

  // 2. Mugs Gallery (1440px)
  console.log('Capturing Mugs 1440px...');
  await page.goto(`${BASE_URL}/shop?shop=mugs&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_mugs_gallery.png') });

  // 3. Pens Lounge (1440px)
  console.log('Capturing Pens 1440px...');
  await page.goto(`${BASE_URL}/shop?shop=pens&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_pens_lounge.png') });

  // 4. Photo Frames Gallery (1440px)
  console.log('Capturing Frames 1440px...');
  await page.goto(`${BASE_URL}/shop?shop=frames&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_frames_gallery.png') });

  // 5. Hero Focus Mode (1440px)
  console.log('Capturing Hero Focus Mode 1440px...');
  await page.goto(`${BASE_URL}/shop?shop=shirts&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const productBtn = allButtons.find(b => b.innerText.includes('MIDNIGHT') || b.innerText.includes('TEE'));
    if (productBtn) productBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_hero_focus_mode.png') });

  // 6. Laptop 1280px Viewport
  console.log('Capturing Shirts 1280px...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/shop?shop=shirts&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_shirts_1280px.png') });

  // 7. Tablet 1024px Viewport
  console.log('Capturing Shirts 1024px...');
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto(`${BASE_URL}/shop?shop=shirts&floor=1`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_shirts_1024px.png') });

  await browser.close();
  console.log('All responsive screenshots captured successfully!');
}

capture();
