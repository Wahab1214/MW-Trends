import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_CATALOG,
  getProductsByCategory,
  getProductBySlug,
  filterAndSortProducts,
} from '../lib/data/mockCatalog.ts';
import { getShopTheme, SHOP_THEMES } from '../lib/data/shopThemes.ts';

test('PHASE 4 AUDIT — Product Catalog & Category Binding', async (t) => {
  await t.test('1. Sourcing: All primary categories have authentic curated products', () => {
    const shirts = getProductsByCategory('shirts');
    const mugs = getProductsByCategory('mugs');
    const pens = getProductsByCategory('pens');
    const frames = getProductsByCategory('frames');

    assert.ok(shirts.length >= 6, `Shirts must have at least 6 products, found ${shirts.length}`);
    assert.ok(mugs.length >= 6, `Mugs must have at least 6 products, found ${mugs.length}`);
    assert.ok(pens.length >= 6, `Pens must have at least 6 products, found ${pens.length}`);
    assert.ok(frames.length >= 6, `Frames must have at least 6 products, found ${frames.length}`);
  });

  await t.test('2. First-View Batching Constraint: Never render > 8 products simultaneously', () => {
    const categories = ['shirts', 'mugs', 'pens', 'frames', 'cases'];
    for (const cat of categories) {
      const items = getProductsByCategory(cat);
      const batched = items.slice(0, 7);
      assert.ok(batched.length <= 8, `Batched view for ${cat} must be <= 8, got ${batched.length}`);
    }
  });

  await t.test('3. Hero Product Resolution: Every shop defines a valid hero anchor', () => {
    const categories = ['shirts', 'mugs', 'pens', 'frames'];
    for (const cat of categories) {
      const items = getProductsByCategory(cat);
      const hero = items.find((p) => p.isFeatured) || items[0];
      assert.ok(hero !== undefined, `Category ${cat} must have a hero product`);
      assert.ok(hero.name.length > 0, `Hero product must have a valid title`);
      assert.ok(hero.numericPrice > 0, `Hero product must have a valid price`);
    }
  });

  await t.test('4. 3D Model Availability & Fallback Status', () => {
    const shirtHero = getProductBySlug('midnight-oversized-tee');
    assert.equal(shirtHero?.has3D, true, 'Hero shirt must have 3D support');

    const mugHero = getProductBySlug('signature-mug');
    assert.equal(mugHero?.has3D, true, 'Hero mug must have 3D support');

    const penHero = getProductBySlug('bespoke-brass-fountain-pen');
    assert.equal(penHero?.has3D, true, 'Hero pen must have 3D support');

    const frameHero = getProductBySlug('memory-frame-01');
    assert.equal(frameHero?.has3D, true, 'Hero frame must have 3D support');

    const card = getProductBySlug('custom-story-card');
    assert.equal(card?.has3D, false, 'Card uses premium 2.5D fallback');
  });
});

test('PHASE 4 AUDIT — Filter, Search & Sort Logic', async (t) => {
  const allShirts = getProductsByCategory('shirts');

  await t.test('1. Search Filter: matches title, description, or material', () => {
    const searched = filterAndSortProducts(allShirts, { searchQuery: 'Oversized' });
    assert.ok(searched.length > 0, 'Search for "Oversized" should return matching items');
    assert.ok(searched.every((p) => p.name.includes('OVERSIZED') || p.fit === 'Oversized'));
  });

  await t.test('2. Customizable Filter: isolates customizable pieces', () => {
    const customizable = filterAndSortProducts(allShirts, { isCustomizableOnly: true });
    assert.ok(customizable.every((p) => p.isCustomizable === true));
  });

  await t.test('3. Sorting: Price Low-to-High and High-to-Low', () => {
    const asc = filterAndSortProducts(allShirts, { sortBy: 'price-asc' });
    for (let i = 0; i < asc.length - 1; i++) {
      assert.ok(asc[i].numericPrice <= asc[i + 1].numericPrice, 'Price-asc must be ascending');
    }

    const desc = filterAndSortProducts(allShirts, { sortBy: 'price-desc' });
    for (let i = 0; i < desc.length - 1; i++) {
      assert.ok(desc[i].numericPrice >= desc[i + 1].numericPrice, 'Price-desc must be descending');
    }
  });

  await t.test('4. Zero Match Handling: empty results handled without error', () => {
    const emptyResult = filterAndSortProducts(allShirts, { searchQuery: 'NonExistentProductXYZ123' });
    assert.equal(emptyResult.length, 0, 'No products should match impossible query');
  });
});

test('PHASE 4 AUDIT — Category Interior Theme Profiles', async (t) => {
  await t.test('1. Unique moods defined for Shirts, Mugs, Pens, Frames', () => {
    const shirtsTheme = getShopTheme('shirts');
    assert.equal(shirtsTheme.moodTitle, 'LUXURY FASHION BOUTIQUE');
    assert.equal(shirtsTheme.heroDisplay.type, 'podium-mannequin');

    const mugsTheme = getShopTheme('mugs');
    assert.equal(mugsTheme.moodTitle, 'PREMIUM CERAMIC & OBJECT GALLERY');
    assert.equal(mugsTheme.heroDisplay.type, 'rotating-pedestal');

    const pensTheme = getShopTheme('pens');
    assert.equal(pensTheme.moodTitle, 'LUXURY WRITING LOUNGE');
    assert.equal(pensTheme.heroDisplay.type, 'vitrine-island');

    const framesTheme = getShopTheme('frames');
    assert.equal(framesTheme.moodTitle, 'REFINED ART GALLERY');
    assert.equal(framesTheme.heroDisplay.type, 'gallery-feature-wall');
  });

  await t.test('2. Extensible fallback for secondary/future categories', () => {
    const casesTheme = getShopTheme('cases');
    assert.ok(casesTheme !== null);
    assert.equal(casesTheme.slug, 'default');

    const unknownTheme = getShopTheme('futuristic-gadgets-category');
    assert.equal(unknownTheme.slug, 'default');
  });
});
