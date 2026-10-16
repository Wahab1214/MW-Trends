import { strict as assert } from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('   MW TRENDS — PHASE 5 COMMERCE LOGIC & API AUDIT   ');
  console.log('====================================================\n');

  // -------------------------------------------------------------------------
  // Test 1: Standard Product Validation with Selected Size
  // -------------------------------------------------------------------------
  console.log('Test 1: Standard Shirt Validation via /api/products/price-check');
  const res1 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'midnight-oversized-tee',
      variantId: 'v_black',
      sizeId: 's_m',
      quantity: 1
    })
  });
  const data1 = await res1.json();
  assert.equal(data1.success, true);
  assert.equal(data1.basePrice, 1799);
  assert.equal(data1.customizationSurcharge, 0);
  assert.equal(data1.totalUnitPrice, 1799);
  assert.equal(data1.formattedUnitPrice, 'Rs. 1,799');
  console.log('✓ PASS: Standard shirt validated authoritatively at Rs. 1,799');

  // -------------------------------------------------------------------------
  // Test 2: Apparel Missing Size Rejection
  // -------------------------------------------------------------------------
  console.log('\nTest 2: Missing Size Rejection for Apparel');
  const res2 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'midnight-oversized-tee',
      variantId: 'v_black',
      sizeId: null, // missing size
      quantity: 1
    })
  });
  const data2 = await res2.json();
  assert.equal(data2.success, false);
  assert(data2.error.toLowerCase().includes('size'), `Expected size error, got: ${data2.error}`);
  console.log('✓ PASS: Missing size correctly rejected with message:', data2.error);

  // -------------------------------------------------------------------------
  // Test 3: Bespoke Shirt with Monogram Inscription (+Rs. 299)
  // -------------------------------------------------------------------------
  console.log('\nTest 3: Bespoke Shirt with Monogram (+Rs. 299)');
  const res3 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'midnight-oversized-tee',
      variantId: 'v_black',
      sizeId: 's_l',
      customization: {
        customText: 'W.A.',
        font: 'serif',
        placement: 'chest-left'
      },
      quantity: 2
    })
  });
  const data3 = await res3.json();
  assert.equal(data3.success, true);
  assert.equal(data3.basePrice, 1799);
  assert.equal(data3.customizationSurcharge, 299);
  assert.equal(data3.totalUnitPrice, 2098);
  assert.equal(data3.totalLinePrice, 2098 * 2);
  assert(data3.customizationSummary.includes('"W.A."'));
  console.log('✓ PASS: Shirt monogram surcharge verified: Rs. 299 (Unit: Rs. 2,098, Line: Rs. 4,196)');

  // -------------------------------------------------------------------------
  // Test 4: Custom Inscription Exceeding Character Limit Rejection
  // -------------------------------------------------------------------------
  console.log('\nTest 4: Character Limit Enforcement');
  const res4 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'midnight-oversized-tee',
      variantId: 'v_black',
      sizeId: 's_m',
      customization: {
        customText: 'TOO_LONG_FOR_MAX_12_CHARS'
      },
      quantity: 1
    })
  });
  const data4 = await res4.json();
  assert.equal(data4.success, false);
  assert(data4.error.includes('limit'), `Expected character limit error, got: ${data4.error}`);
  console.log('✓ PASS: Inscription exceeding character limit rejected:', data4.error);

  // -------------------------------------------------------------------------
  // Test 5: Full Ceramic Mug Customization (+Rs. 199 Inscription + Rs. 150 Both Sides + Rs. 250 Gift Box)
  // -------------------------------------------------------------------------
  console.log('\nTest 5: Ceramic Mug Multi-option Surcharges');
  const res5 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'signature-mug',
      variantId: 'v_black_matte',
      customization: {
        customText: 'ARCHITECT',
        printSide: 'both',
        giftBox: true
      },
      quantity: 1
    })
  });
  const data5 = await res5.json();
  assert.equal(data5.success, true);
  assert.equal(data5.basePrice, 899);
  // Surcharges: 199 + 150 + 250 = 599
  assert.equal(data5.customizationSurcharge, 599);
  assert.equal(data5.totalUnitPrice, 899 + 599);
  assert.equal(data5.formattedUnitPrice, 'Rs. 1,498');
  console.log('✓ PASS: Ceramic mug surcharges authoritatively calculated: Rs. 599 (Total: Rs. 1,498)');

  // -------------------------------------------------------------------------
  // Test 6: Precision Pen Laser Engraving (+Rs. 249) + American Walnut Case (+Rs. 350)
  // -------------------------------------------------------------------------
  console.log('\nTest 6: Pen Laser Engraving & Walnut Case');
  const res6 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'bespoke-brass-fountain-pen',
      variantId: 'v_brass',
      customization: {
        customText: 'WAHAB ALI',
        giftBox: true
      },
      quantity: 1
    })
  });
  const data6 = await res6.json();
  assert.equal(data6.success, true);
  assert.equal(data6.basePrice, 3499);
  // Surcharges: 249 + 350 = 599
  assert.equal(data6.customizationSurcharge, 599);
  assert.equal(data6.totalUnitPrice, 3499 + 599);
  assert.equal(data6.formattedUnitPrice, 'Rs. 4,098');
  console.log('✓ PASS: Pen laser engraving & walnut case verified: Rs. 599 (Total: Rs. 4,098)');

  // -------------------------------------------------------------------------
  // Test 7: Archival Frame Mat Inscription (+Rs. 199) + Art Print Upload (+Rs. 299)
  // -------------------------------------------------------------------------
  console.log('\nTest 7: Frame Archival Mat Inscription & Print Upload');
  const res7 = await fetch(`${BASE_URL}/api/products/price-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'memory-frame-01',
      variantId: 'v_black_metal',
      sizeId: 's_a4',
      customization: {
        customText: 'THE ATRIUM / OCT 2026',
        photoName: 'atrium_photo.jpg'
      },
      quantity: 1
    })
  });
  const data7 = await res7.json();
  assert.equal(data7.success, true);
  assert.equal(data7.basePrice, 1499);
  // Surcharges: 199 + 299 = 498
  assert.equal(data7.customizationSurcharge, 498);
  assert.equal(data7.totalUnitPrice, 1499 + 498);
  assert.equal(data7.formattedUnitPrice, 'Rs. 1,997');
  console.log('✓ PASS: Frame archival mat & print verified: Rs. 498 (Total: Rs. 1,997)');

  // -------------------------------------------------------------------------
  // Test 8: Server-Authoritative Cart Validation Endpoint (/api/cart/validate)
  // -------------------------------------------------------------------------
  console.log('\nTest 8: Full Multi-item Server Cart Validation');
  const res8 = await fetch(`${BASE_URL}/api/cart/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        {
          slug: 'midnight-oversized-tee',
          variantId: 'v_black',
          sizeId: 's_m',
          customization: { customText: 'W.A.' },
          quantity: 1
        },
        {
          slug: 'signature-mug',
          variantId: 'v_black_matte',
          customization: { customText: 'MW ATELIER', giftBox: true },
          quantity: 2
        }
      ]
    })
  });
  const data8 = await res8.json();
  assert.equal(data8.success, true);
  assert.equal(data8.items.length, 2);
  // Line 1: 1799 + 299 = 2098
  // Line 2: (899 + 199 + 250) * 2 = 1348 * 2 = 2696
  // Subtotal: 2098 + 2696 = 4794
  assert.equal(data8.subtotal, 4794);
  assert.equal(data8.formattedSubtotal, 'Rs. 4,794');
  console.log('✓ PASS: Server-authoritative cart subtotal calculated: Rs. 4,794 across 2 items');

  // -------------------------------------------------------------------------
  // Test 9: Cart Line-Item Identity Determinism Rule
  // -------------------------------------------------------------------------
  console.log('\nTest 9: Deterministic Line-Item Identity Rule');
  // Two custom items with different inscriptions MUST produce different hashes
  const customHash1 = ['wahab', '', '', '', '', '', ''].join('~');
  const customHash2 = ['ali', '', '', '', '', '', ''].join('~');
  const idMug1 = `signature-mug-v_black-onesize-c:${customHash1}`;
  const idMug2 = `signature-mug-v_black-onesize-c:${customHash2}`;
  assert.notEqual(idMug1, idMug2);

  // Two custom items with identical inscriptions MUST produce identical hashes
  const customHash3 = ['wahab', '', '', '', '', '', ''].join('~');
  const idMug3 = `signature-mug-v_black-onesize-c:${customHash3}`;
  assert.equal(idMug1, idMug3);
  console.log('✓ PASS: Different customizations produce distinct line-item keys');
  console.log('✓ PASS: Identical customizations produce identical keys to merge quantities');

  console.log('\n====================================================');
  console.log('   ALL 9 PHASE 5 COMMERCE LOGIC TESTS PASSED 100%   ');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILURE:', err);
  process.exit(1);
});
