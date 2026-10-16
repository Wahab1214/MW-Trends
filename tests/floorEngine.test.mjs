import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTotalFloors,
  getActiveCategories,
  sortCategories,
  getCategoriesForFloor,
  formatFloorNumber,
  getFloorForCategory,
  buildFloors,
  SHOP_SLOT_CONFIGS,
  DEFAULT_BUILDING_CATEGORIES,
} from '../lib/data/buildingCategories.ts';

function createMockCategory(id, sortOrder = 1, isActive = true) {
  return {
    id: `cat-${id}`,
    slug: `slug-${id}`,
    name: `Category ${id}`,
    subline: `Subline ${id}`,
    sortOrder,
    isActive,
    theme: 'default',
  };
}

test('MW Trends Floor Engine — Pure Unit Test Suite', async (t) => {
  await t.test('1. Dynamic floor calculation formula: Math.ceil(activeCount / 4)', () => {
    // 0 categories -> 1 floor (empty state)
    assert.equal(getTotalFloors([]), 1, '0 categories should yield 1 floor');

    // 1 category -> 1 floor
    const cats1 = [createMockCategory(1)];
    assert.equal(getTotalFloors(cats1), 1, '1 category should yield 1 floor');

    // 4 categories -> 1 floor
    const cats4 = Array.from({ length: 4 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats4), 1, '4 categories should yield 1 floor');

    // 5 categories -> 2 floors
    const cats5 = Array.from({ length: 5 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats5), 2, '5 categories should yield 2 floors');

    // 8 categories -> 2 floors
    const cats8 = Array.from({ length: 8 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats8), 2, '8 categories should yield 2 floors');

    // 9 categories -> 3 floors
    const cats9 = Array.from({ length: 9 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats9), 3, '9 categories should yield 3 floors');

    // 12 categories -> 3 floors
    const cats12 = Array.from({ length: 12 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats12), 3, '12 categories should yield 3 floors');

    // 13 categories -> 4 floors
    const cats13 = Array.from({ length: 13 }, (_, i) => createMockCategory(i + 1, i + 1));
    assert.equal(getTotalFloors(cats13), 4, '13 categories should yield 4 floors');
  });

  await t.test('2. Inactive category filtering: isActive === false is excluded', () => {
    const mixed = [
      createMockCategory(1, 1, true),
      createMockCategory(2, 2, false), // INACTIVE
      createMockCategory(3, 3, true),
      createMockCategory(4, 4, false), // INACTIVE
      createMockCategory(5, 5, true),
    ];

    const active = getActiveCategories(mixed);
    assert.equal(active.length, 3, 'Only 3 categories should be active');
    assert.deepEqual(active.map(c => c.id), ['cat-1', 'cat-3', 'cat-5']);

    // Total floors should be calculated from active categories only
    assert.equal(getTotalFloors(mixed), 1, '3 active categories require 1 floor');
  });

  await t.test('3. Deterministic admin sort order', () => {
    const unsorted = [
      createMockCategory(1, 30),
      createMockCategory(2, 10),
      createMockCategory(3, 20),
    ];

    const sorted = sortCategories(unsorted);
    assert.deepEqual(sorted.map(c => c.id), ['cat-2', 'cat-3', 'cat-1']);
  });

  await t.test('4. Slot distribution (4 slots per floor with null for Coming Soon)', () => {
    // 0 categories -> 4 null slots
    const floorEmpty = getCategoriesForFloor([], 1);
    assert.equal(floorEmpty.length, 4);
    assert.deepEqual(floorEmpty, [null, null, null, null]);

    // 5 categories: Floor 1 has 4 items; Floor 2 has 1 item and 3 Coming Soon slots
    const cats5 = Array.from({ length: 5 }, (_, i) => createMockCategory(i + 1, i + 1));
    const floor1 = getCategoriesForFloor(cats5, 1);
    assert.equal(floor1.length, 4);
    assert.equal(floor1[0]?.id, 'cat-1');
    assert.equal(floor1[1]?.id, 'cat-2');
    assert.equal(floor1[2]?.id, 'cat-3');
    assert.equal(floor1[3]?.id, 'cat-4');

    const floor2 = getCategoriesForFloor(cats5, 2);
    assert.equal(floor2.length, 4);
    assert.equal(floor2[0]?.id, 'cat-5');
    assert.equal(floor2[1], null, 'Slot 1 on Floor 2 should be Coming Soon (null)');
    assert.equal(floor2[2], null, 'Slot 2 on Floor 2 should be Coming Soon (null)');
    assert.equal(floor2[3], null, 'Slot 3 on Floor 2 should be Coming Soon (null)');

    // 13 categories: Floor 4 has 1 item and 3 Coming Soon slots
    const cats13 = Array.from({ length: 13 }, (_, i) => createMockCategory(i + 1, i + 1));
    const floor4 = getCategoriesForFloor(cats13, 4);
    assert.equal(floor4.length, 4);
    assert.equal(floor4[0]?.id, 'cat-13');
    assert.equal(floor4[1], null);
    assert.equal(floor4[2], null);
    assert.equal(floor4[3], null);
  });

  await t.test('5. Two-digit floor label formatting', () => {
    assert.equal(formatFloorNumber(1), 'FLOOR 01');
    assert.equal(formatFloorNumber(2), 'FLOOR 02');
    assert.equal(formatFloorNumber(9), 'FLOOR 09');
    assert.equal(formatFloorNumber(10), 'FLOOR 10');
    assert.equal(formatFloorNumber(12), 'FLOOR 12');
  });

  await t.test('6. Category-to-floor indexing lookup (getFloorForCategory)', () => {
    const cats13 = Array.from({ length: 13 }, (_, i) => createMockCategory(i + 1, i + 1));
    
    // cat-1 -> Floor 1, Slot 0
    const cat1Lookup = getFloorForCategory(cats13, 'cat-1');
    assert.equal(cat1Lookup?.floorNumber, 1);
    assert.equal(cat1Lookup?.slotIndex, 0);

    // cat-4 -> Floor 1, Slot 3
    const cat4Lookup = getFloorForCategory(cats13, 'cat-4');
    assert.equal(cat4Lookup?.floorNumber, 1);
    assert.equal(cat4Lookup?.slotIndex, 3);

    // cat-5 -> Floor 2, Slot 0
    const cat5Lookup = getFloorForCategory(cats13, 'cat-5');
    assert.equal(cat5Lookup?.floorNumber, 2);
    assert.equal(cat5Lookup?.slotIndex, 0);

    // cat-13 -> Floor 4, Slot 0
    const cat13Lookup = getFloorForCategory(cats13, 'cat-13');
    assert.equal(cat13Lookup?.floorNumber, 4);
    assert.equal(cat13Lookup?.slotIndex, 0);

    // Non-existent category
    const nonExistent = getFloorForCategory(cats13, 'cat-999');
    assert.equal(nonExistent, null);
  });

  await t.test('7. Multi-floor building structure generator (buildFloors)', () => {
    const cats9 = Array.from({ length: 9 }, (_, i) => createMockCategory(i + 1, i + 1));
    const floors = buildFloors(cats9);

    assert.equal(floors.length, 3, '9 categories should produce 3 floors');

    // Floor 1: hasNext = true, hasPrev = false, isHighest = false
    assert.equal(floors[0].floorNumber, 1);
    assert.equal(floors[0].hasNextFloor, true);
    assert.equal(floors[0].hasPrevFloor, false);
    assert.equal(floors[0].isHighestFloor, false);

    // Floor 2: hasNext = true, hasPrev = true, isHighest = false
    assert.equal(floors[1].floorNumber, 2);
    assert.equal(floors[1].hasNextFloor, true);
    assert.equal(floors[1].hasPrevFloor, true);
    assert.equal(floors[1].isHighestFloor, false);

    // Floor 3: hasNext = false, hasPrev = true, isHighest = true
    assert.equal(floors[2].floorNumber, 3);
    assert.equal(floors[2].hasNextFloor, false);
    assert.equal(floors[2].hasPrevFloor, true);
    assert.equal(floors[2].isHighestFloor, true);
  });

  await t.test('8. Standard slot coordinates (SHOP_SLOT_CONFIGS)', () => {
    assert.equal(SHOP_SLOT_CONFIGS.length, 4);
    assert.equal(SHOP_SLOT_CONFIGS[0].slotName, 'left-front');
    assert.equal(SHOP_SLOT_CONFIGS[1].slotName, 'left-rear');
    assert.equal(SHOP_SLOT_CONFIGS[2].slotName, 'right-front');
    assert.equal(SHOP_SLOT_CONFIGS[3].slotName, 'right-rear');
  });

  await t.test('9. Default building categories integrity', () => {
    assert.ok(DEFAULT_BUILDING_CATEGORIES.length >= 12, 'Default catalog must have at least 12 categories');
    // Verify first 4 categories match the reference-locked Floor 1
    assert.equal(DEFAULT_BUILDING_CATEGORIES[0].slug, 'shirts');
    assert.equal(DEFAULT_BUILDING_CATEGORIES[1].slug, 'pens');
    assert.equal(DEFAULT_BUILDING_CATEGORIES[2].slug, 'mugs');
    assert.equal(DEFAULT_BUILDING_CATEGORIES[3].slug, 'frames');
  });
});
