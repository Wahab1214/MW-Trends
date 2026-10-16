import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:3000';

const results = [];

function record(name, status, details = '') {
  results.push({ name, status, details });
  console.log(`[${status}] ${name} ${details ? '- ' + details : ''}`);
}

async function runBrowserAudit() {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // ----------------------------------------------------
    // TEST 1: Initial World Entrance
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Initial World Entrance ---');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const enterBtn = await page.waitForSelector('button', { timeout: 10000 });
    await enterBtn.click();
    await new Promise(r => setTimeout(r, 4500));

    const initialFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const hasEntered = await page.evaluate(() => window.useStore?.getState().hasEntered);
    if (initialFloor === 1 && hasEntered === true) {
      record('Initial Entrance', 'PASS', `Entered building at Floor ${initialFloor}`);
    } else {
      record('Initial Entrance', 'FAIL', `Expected Floor 1, got ${initialFloor}`);
    }

    // ----------------------------------------------------
    // TEST 2: Stairs Next Floor (Ascend)
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Stairs Next Floor (Ascend) ---');
    const ascendBtn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.innerText.includes('ASCEND') || b.getAttribute('aria-label')?.includes('Ascend')
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1200));
    const floorAfterAscend = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const urlAfterAscend = page.url();

    if (floorAfterAscend === 2 && urlAfterAscend.includes('floor=2')) {
      record('Stairs Next Floor (Ascend)', 'PASS', `Ascended to Floor 2, URL: ${urlAfterAscend}`);
    } else {
      record('Stairs Next Floor (Ascend)', 'FAIL', `Expected Floor 2, got ${floorAfterAscend}`);
    }

    // ----------------------------------------------------
    // TEST 3: Previous Floor (Descend)
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Previous Floor (Descend) ---');
    const descendBtn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.innerText.includes('DESCEND') || b.getAttribute('aria-label')?.includes('Descend')
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1000));
    const floorAfterDescend = await page.evaluate(() => window.useStore?.getState().currentFloor);

    if (floorAfterDescend === 1) {
      record('Previous Floor (Descend)', 'PASS', `Descended back to Floor 1`);
    } else {
      record('Previous Floor (Descend)', 'FAIL', `Expected Floor 1, got ${floorAfterDescend}`);
    }

    // ----------------------------------------------------
    // TEST 4: Direct Floor Selector
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Direct Floor Selector ---');
    // Click floor 3 directly via numeral bar
    const selectorClicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.getAttribute('aria-label') === 'Switch to Floor 3' || b.innerText.trim() === '03'
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1200));
    const floorAfterDirect = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const urlAfterDirect = page.url();

    if (floorAfterDirect === 3 && urlAfterDirect.includes('floor=3')) {
      record('Direct Floor Selector', 'PASS', `Directly selected Floor 3, URL: ${urlAfterDirect}`);
    } else {
      record('Direct Floor Selector', 'FAIL', `Expected Floor 3, got ${floorAfterDirect}`);
    }

    // ----------------------------------------------------
    // TEST 5: /world?floor=N Deep Link
    // ----------------------------------------------------
    console.log('\n--- 5. Testing /world?floor=N Deep Link ---');
    await page.goto(`${BASE_URL}/world?floor=2`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const deepLinkFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const deepLinkEntered = await page.evaluate(() => window.useStore?.getState().hasEntered);
    const deepLinkHeader = await page.evaluate(() => {
      const el = document.querySelector('header');
      return el ? el.innerText : '';
    });

    if (deepLinkFloor === 2 && deepLinkEntered === true && deepLinkHeader.includes('FLOOR 02')) {
      record('/world?floor=N Deep Link', 'PASS', `Navigated directly to Floor 2 in World mode`);
    } else {
      record('/world?floor=N Deep Link', 'FAIL', `Floor: ${deepLinkFloor}, Entered: ${deepLinkEntered}`);
    }

    // ----------------------------------------------------
    // TEST 6: Refresh Persistence
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Refresh Persistence ---');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const postReloadFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const postReloadEntered = await page.evaluate(() => window.useStore?.getState().hasEntered);

    if (postReloadFloor === 2 && postReloadEntered === true) {
      record('Refresh Persistence', 'PASS', `Preserved Floor 2 and entered state across full page reload`);
    } else {
      record('Refresh Persistence', 'FAIL', `Expected Floor 2, got ${postReloadFloor}`);
    }

    // ----------------------------------------------------
    // TEST 7: Browser Back/Forward
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Browser Back/Forward ---');
    // From Floor 2, navigate to Floor 3
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.getAttribute('aria-label') === 'Switch to Floor 3' || b.innerText.trim() === '03'
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    assertCurrentFloor(await page.evaluate(() => window.useStore?.getState().currentFloor), 3);

    // Browser Back -> Should return to Floor 2
    await page.goBack();
    await new Promise(r => setTimeout(r, 600));
    const floorBack = await page.evaluate(() => window.useStore?.getState().currentFloor);

    // Browser Forward -> Should return to Floor 3
    await page.goForward();
    await new Promise(r => setTimeout(r, 600));
    const floorForward = await page.evaluate(() => window.useStore?.getState().currentFloor);

    if (floorBack === 2 && floorForward === 3) {
      record('Browser Back/Forward', 'PASS', `Back returned to Floor 2, Forward returned to Floor 3`);
    } else {
      record('Browser Back/Forward', 'FAIL', `Back: ${floorBack}, Forward: ${floorForward}`);
    }

    // ----------------------------------------------------
    // TEST 8: Rapid Floor Switching
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Rapid Floor Switching ---');
    // Rapidly fire transitions 1 -> 2 -> 3 -> 1 -> 2 within a few milliseconds
    await page.evaluate(() => {
      const store = window.useStore.getState();
      store.setCurrentFloor(1);
      store.setCurrentFloor(2);
      store.setCurrentFloor(3);
      store.setCurrentFloor(1);
      store.setCurrentFloor(2);
    });
    await new Promise(r => setTimeout(r, 800));

    const settledFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const isTransitioning = await page.evaluate(() => window.useStore?.getState().isFloorTransitioning);

    if (settledFloor >= 1 && settledFloor <= 3 && typeof isTransitioning === 'boolean') {
      record('Rapid Floor Switching', 'PASS', `Store remained stable, settled cleanly at Floor ${settledFloor}`);
    } else {
      record('Rapid Floor Switching', 'FAIL', `Unstable floor: ${settledFloor}`);
    }

    // ----------------------------------------------------
    // TEST 9: Shop Enter -> Return to Same Floor
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Shop Enter -> Return to Same Floor ---');
    // Set to Floor 2
    await page.evaluate(() => window.useStore.getState().setCurrentFloor(2));
    await new Promise(r => setTimeout(r, 500));

    // Simulate clicking a Floor 2 shop (e.g. cases)
    await page.goto(`${BASE_URL}/shop?shop=cases&floor=2`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    const shopBreadcrumb = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn ? btn.innerText : '';
    });

    // Click return to world button containing arrow '←'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('←'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const returnedFloor = await page.evaluate(() => window.useStore?.getState().currentFloor);
    const returnedMode = await page.evaluate(() => window.useStore?.getState().mode);

    if (returnedFloor === 2 && returnedMode === 'world') {
      record('Shop Enter -> Return', 'PASS', `Entered shop from Floor 2, returned to Floor 2 in world mode`);
    } else {
      record('Shop Enter -> Return', 'FAIL', `Expected Floor 2, got ${returnedFloor}, mode: ${returnedMode}`);
    }

    // ----------------------------------------------------
    // TEST 10: Responsive Viewports
    // ----------------------------------------------------
    console.log('\n--- 10. Testing Responsive Viewports ---');
    const viewports = [
      { width: 1440, height: 900, name: '1440 Desktop Wide', expectedNav: 'desktop' },
      { width: 1024, height: 768, name: '1024 Desktop Standard', expectedNav: 'desktop' },
      { width: 768, height: 1024, name: '768 Tablet Portrait', expectedNav: 'desktop' },
      { width: 430, height: 932, name: '430 iPhone Pro Max', expectedNav: 'mobile' },
      { width: 390, height: 844, name: '390 iPhone Standard', expectedNav: 'mobile' },
      { width: 360, height: 780, name: '360 Compact Android', expectedNav: 'mobile' },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 400));

      const layout = await page.evaluate(() => {
        const desktopNav = document.querySelector('nav[aria-label="Building Floor Navigation"]');
        const mobileDock = document.querySelector('.grid-cols-4');
        const bodyScrollWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasHorizontalOverflow = bodyScrollWidth > windowWidth;

        return {
          desktopVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false,
          mobileDockVisible: mobileDock ? window.getComputedStyle(mobileDock.parentElement.parentElement).display !== 'none' : false,
          hasHorizontalOverflow,
        };
      });

      const navMatched = vp.expectedNav === 'desktop' ? layout.desktopVisible : layout.mobileDockVisible;
      const noOverflow = !layout.hasHorizontalOverflow;

      if (navMatched && noOverflow) {
        record(`Responsive ${vp.width}px`, 'PASS', `${vp.name}: ${vp.expectedNav} UI active, 0 horizontal overflow`);
      } else {
        record(`Responsive ${vp.width}px`, 'FAIL', `Expected ${vp.expectedNav}, desktop=${layout.desktopVisible}, mobile=${layout.mobileDockVisible}, overflow=${layout.hasHorizontalOverflow}`);
      }
    }

    await browser.close();
  } catch (err) {
    console.error('Fatal error during audit:', err);
    if (browser) await browser.close();
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('AUDIT SUMMARY');
  console.log('========================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  if (failCount > 0) {
    process.exit(1);
  }
}

function assertCurrentFloor(val, expected) {
  if (val !== expected) throw new Error(`Expected floor ${expected}, got ${val}`);
}

runBrowserAudit();
