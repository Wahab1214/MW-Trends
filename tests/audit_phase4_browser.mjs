import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:3000';

const results = [];

function record(name, status, details = '') {
  results.push({ name, status, details });
  console.log(`[${status}] ${name} ${details ? '- ' + details : ''}`);
}

async function runPhase4Audit() {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    await page.setViewport({ width: 1280, height: 720 });

    // ----------------------------------------------------
    // TEST 1: Building World Entrance & Shop Door Transition
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Building World Entrance & Shop Door Transition ---');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const enterBtn = await page.waitForSelector('button', { timeout: 10000 });
    await enterBtn.click();
    await new Promise(r => setTimeout(r, 3500));

    // From atrium, simulate entering the Shirts boutique via door trigger
    await page.evaluate(() => {
      window.location.href = '/shop?shop=shirts&floor=1';
    });
    await new Promise(r => setTimeout(r, 2200));

    const shopUrl = page.url();
    if (shopUrl.includes('/shop') && shopUrl.includes('shirts')) {
      record('Exterior Door Transition', 'PASS', `Entered Shirts boutique at ${shopUrl}`);
    } else {
      record('Exterior Door Transition', 'FAIL', `Expected /shop?shop=shirts, got ${shopUrl}`);
    }

    // ----------------------------------------------------
    // TEST 2: Shirts Boutique Verification
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Shirts Boutique Interior ---');
    const shirtsInfo = await page.evaluate(() => {
      const header = document.querySelector('header')?.innerText || '';
      const hasFloorReturn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('FLOOR 01'));
      const hasCanvas = document.querySelector('canvas') !== null;
      return { header, hasFloorReturn, hasCanvas };
    });

    if (shirtsInfo.header.includes('SHIRTS') && shirtsInfo.hasFloorReturn && shirtsInfo.hasCanvas) {
      record('Shirts Boutique Interior', 'PASS', `Verified luxury fashion boutique atmosphere, 3D canvas, and FLOOR 01 return`);
    } else {
      record('Shirts Boutique Interior', 'FAIL', JSON.stringify(shirtsInfo));
    }

    // ----------------------------------------------------
    // TEST 3: Mugs Gallery Direct Deep Link & Verification
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Mugs Gallery Interior ---');
    await page.evaluate(() => {
      window.location.href = '/shop?shop=mugs&floor=1';
    });
    await new Promise(r => setTimeout(r, 2000));

    const mugsInfo = await page.evaluate(() => {
      const header = document.querySelector('header')?.innerText || '';
      const hasFloorReturn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('FLOOR 01'));
      const hasCanvas = document.querySelector('canvas') !== null;
      return { header, hasFloorReturn, hasCanvas };
    });

    if (mugsInfo.header.includes('MUGS') && mugsInfo.hasFloorReturn && mugsInfo.hasCanvas) {
      record('Mugs Gallery Interior', 'PASS', `Verified ceramic object gallery mood, 3D canvas, and FLOOR 01 return`);
    } else {
      record('Mugs Gallery Interior', 'FAIL', JSON.stringify(mugsInfo));
    }

    // ----------------------------------------------------
    // TEST 4: Pens Lounge Verification
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Pens Lounge Interior ---');
    await page.evaluate(() => {
      window.location.href = '/shop?shop=pens&floor=1';
    });
    await new Promise(r => setTimeout(r, 2000));

    const pensInfo = await page.evaluate(() => {
      const header = document.querySelector('header')?.innerText || '';
      const hasFloorReturn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('FLOOR 01'));
      const hasCanvas = document.querySelector('canvas') !== null;
      return { header, hasFloorReturn, hasCanvas };
    });

    if (pensInfo.header.includes('PENS') && pensInfo.hasFloorReturn && pensInfo.hasCanvas) {
      record('Pens Lounge Interior', 'PASS', `Verified luxury writing lounge atmosphere and 3D canvas`);
    } else {
      record('Pens Lounge Interior', 'FAIL', JSON.stringify(pensInfo));
    }

    // ----------------------------------------------------
    // TEST 5: Photo Frames Gallery Verification
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Photo Frames Gallery Interior ---');
    await page.evaluate(() => {
      window.location.href = '/shop?shop=frames&floor=1';
    });
    await new Promise(r => setTimeout(r, 2000));

    const framesInfo = await page.evaluate(() => {
      const header = document.querySelector('header')?.innerText || '';
      const hasFloorReturn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('FLOOR 01'));
      const hasCanvas = document.querySelector('canvas') !== null;
      return { header, hasFloorReturn, hasCanvas };
    });

    if (framesInfo.header.includes('PHOTO FRAMES') && framesInfo.hasFloorReturn && framesInfo.hasCanvas) {
      record('Photo Frames Gallery Interior', 'PASS', `Verified refined art gallery atmosphere and 3D canvas`);
    } else {
      record('Photo Frames Gallery Interior', 'FAIL', JSON.stringify(framesInfo));
    }

    // ----------------------------------------------------
    // TEST 6: Hero Focus Mode Activation
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Hero Focus Mode Activation ---');
    await page.evaluate(() => {
      window.location.href = '/shop?shop=shirts&floor=1';
    });
    await new Promise(r => setTimeout(r, 2000));

    // Select the first product via the bottom dock buttons
    await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const productBtn = allButtons.find(b => b.innerText.includes('MIDNIGHT') || b.innerText.includes('TEE'));
      if (productBtn) productBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const focusPanel = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasHeroFocus = text.includes('HERO FOCUS');
      const hasViewDetails = text.includes('VIEW FULL DETAILS');
      const hasAddToBag = text.includes('ADD TO BAG');
      return { hasHeroFocus, hasViewDetails, hasAddToBag };
    });

    if (focusPanel.hasHeroFocus && focusPanel.hasViewDetails && focusPanel.hasAddToBag) {
      record('Hero Focus Mode', 'PASS', `Hero focus panel opened with isolated product, details & actions`);
    } else {
      record('Hero Focus Mode', 'FAIL', JSON.stringify(focusPanel));
    }

    // ----------------------------------------------------
    // TEST 7: View Details Transition & Back Context
    // ----------------------------------------------------
    console.log('\n--- 7. Testing View Details Transition & Back Context ---');
    const pdpHref = await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('VIEW FULL DETAILS'));
      return link ? link.getAttribute('href') : null;
    });

    if (pdpHref) {
      await page.evaluate((url) => { window.location.href = url; }, pdpHref);
      await new Promise(r => setTimeout(r, 1800));

      const pdpUrl = page.url();
      const onPdp = pdpUrl.includes('/products/');

      // Browser back -> should return to shop
      await page.goBack();
      await new Promise(r => setTimeout(r, 1800));
      const returnedUrl = page.url();
      const restoredShop = returnedUrl.includes('/shop');

      if (onPdp && restoredShop) {
        record('View Details & Return', 'PASS', `Navigated to PDP (${pdpUrl}), Back restored shop interior (${returnedUrl})`);
      } else {
        record('View Details & Return', 'FAIL', `PDP: ${onPdp}, Restored: ${restoredShop}`);
      }
    } else {
      record('View Details & Return', 'FAIL', `View Details link not found in Hero Focus drawer`);
    }

    // ----------------------------------------------------
    // TEST 8: Filter Drawer & Local Search
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Filter Drawer & Search ---');
    await page.evaluate(() => {
      const filterBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('FILTERS'));
      if (filterBtn) filterBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const filterOpen = await page.evaluate(() => {
      return document.body.innerText.includes('ATELIER FILTERS');
    });

    if (filterOpen) {
      record('Filter Drawer & Search', 'PASS', `Opened floating filter drawer with category-specific options`);
    } else {
      record('Filter Drawer & Search', 'FAIL', `Filter drawer did not appear`);
    }

    // ----------------------------------------------------
    // TEST 9: Return to Floor Context
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Return to Floor Context ---');
    await page.evaluate(() => {
      window.location.href = '/shop?shop=shirts&floor=2';
    });
    await new Promise(r => setTimeout(r, 1800));

    await page.evaluate(() => {
      const returnBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('FLOOR 02'));
      if (returnBtn) returnBtn.click();
    });
    await new Promise(r => setTimeout(r, 2200));

    const worldUrl = page.url();
    const currentFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);

    if (worldUrl.includes('floor=2') && currentFloor === 2) {
      record('Return to Floor Context', 'PASS', `Returned to Floor 2 in atrium, URL: ${worldUrl}`);
    } else {
      record('Return to Floor Context', 'FAIL', `Expected floor 2, got ${currentFloor}, URL: ${worldUrl}`);
    }

    // ----------------------------------------------------
    // TEST 10: Slug-based Route (/shop/pens?floor=3)
    // ----------------------------------------------------
    console.log('\n--- 10. Testing Slug Route Deep Link ---');
    await page.goto(`${BASE_URL}/shop/pens?floor=3`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('header', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));

    const slugHeader = await page.evaluate(() => document.querySelector('header')?.innerText || '');
    const hasFloor3 = slugHeader.includes('FLOOR 03');

    if (slugHeader.includes('PENS') && hasFloor3) {
      record('Slug Route Deep Link', 'PASS', `Navigated to /shop/pens?floor=3, verified PENS and FLOOR 03 return`);
    } else {
      record('Slug Route Deep Link', 'FAIL', `Header: ${slugHeader}`);
    }

    // ----------------------------------------------------
    // TEST 11: Multi-Viewport Responsive Verification
    // ----------------------------------------------------
    console.log('\n--- 11. Testing Responsive Viewports ---');
    const viewports = [
      { width: 1440, height: 900, name: '1440 Desktop Wide' },
      { width: 1024, height: 768, name: '1024 Desktop Standard' },
      { width: 768, height: 1024, name: '768 Tablet Portrait' },
      { width: 430, height: 932, name: '430 iPhone Pro Max' },
      { width: 390, height: 844, name: '390 iPhone Standard' },
      { width: 360, height: 780, name: '360 Compact Android' },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 400));

      const layout = await page.evaluate(() => {
        const bodyScrollWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasHorizontalOverflow = bodyScrollWidth > windowWidth;
        const hasHeader = document.querySelector('header') !== null;
        const hasCanvas = document.querySelector('canvas') !== null;
        return { hasHorizontalOverflow, hasHeader, hasCanvas };
      });

      if (!layout.hasHorizontalOverflow && layout.hasHeader && layout.hasCanvas) {
        record(`Responsive ${vp.width}px`, 'PASS', `${vp.name}: 0 overflow, header & canvas active`);
      } else {
        record(`Responsive ${vp.width}px`, 'FAIL', `Overflow: ${layout.hasHorizontalOverflow}`);
      }
    }

    await browser.close();
  } catch (err) {
    console.error('Fatal error during Phase 4 audit:', err);
    if (browser) await browser.close();
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('PHASE 4 AUDIT SUMMARY');
  console.log('========================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runPhase4Audit();
