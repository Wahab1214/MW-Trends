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

function createMockCategory(id, sortOrder = 1, isActive = true, name = null) {
  return {
    id: `cat-${id}`,
    slug: `slug-${id}`,
    name: name || `Category ${id}`,
    subline: `Subline ${id}`,
    sortOrder,
    isActive,
    theme: 'default',
  };
}

test('PHASE 3 AUDIT — Category Counts (0, 1, 4, 5, 8, 9, 12, 13)', async (t) => {
  const countsToTest = [0, 1, 4, 5, 8, 9, 12, 13];

  for (const count of countsToTest) {
    await t.test(`Category Count: ${count}`, () => {
      // Create mock categories with 2 extra inactive categories to test exclusion
      const activeCats = Array.from({ length: count }, (_, i) =>
        createMockCategory(i + 1, (i + 1) * 10, true, `Cat ${i + 1}`)
      );
      const inactiveCats = [
        createMockCategory('inact-A', 5, false, 'Inactive A'),
        createMockCategory('inact-B', 95, false, 'Inactive B'),
      ];
      // Mixed pool with random shuffle
      const pool = [...inactiveCats, ...activeCats].sort(() => 0.5 - Math.random());

      // 1. Verify inactive categories strictly excluded
      const activeOnly = getActiveCategories(pool);
      assert.equal(
        activeOnly.length,
        count,
        `[Count ${count}] Inactive categories must be strictly excluded`
      );
      assert.ok(
        activeOnly.every((c) => c.isActive !== false),
        `[Count ${count}] No category with isActive === false may be present`
      );

      // 2. Verify total floor count
      const expectedFloors = count === 0 ? 1 : Math.max(1, Math.ceil(count / 4));
      const totalFloors = getTotalFloors(pool);
      assert.equal(
        totalFloors,
        expectedFloors,
        `[Count ${count}] totalFloors should be ${expectedFloors}, got ${totalFloors}`
      );

      // 3. Verify correct sortOrder mapping
      const sorted = sortCategories(activeOnly);
      for (let i = 0; i < sorted.length - 1; i++) {
        assert.ok(
          (sorted[i].sortOrder ?? 0) <= (sorted[i + 1].sortOrder ?? 0),
          `[Count ${count}] Sorted order must be monotonic ascending`
        );
      }

      // 4. Verify 4 slots per floor & Coming Soon distribution across all floors
      let totalPopulatedSlots = 0;
      let totalComingSoonSlots = 0;

      for (let f = 1; f <= totalFloors; f++) {
        const slots = getCategoriesForFloor(pool, f);
        assert.equal(
          slots.length,
          4,
          `[Count ${count}, Floor ${f}] Each floor must have exactly 4 slots`
        );

        for (let s = 0; s < 4; s++) {
          const globalIdx = (f - 1) * 4 + s;
          if (globalIdx < count) {
            assert.notEqual(
              slots[s],
              null,
              `[Count ${count}, Floor ${f}, Slot ${s}] Should be populated category`
            );
            assert.equal(
              slots[s]?.id,
              sorted[globalIdx].id,
              `[Count ${count}, Floor ${f}, Slot ${s}] Should match sorted category ${sorted[globalIdx].id}`
            );
            totalPopulatedSlots++;
          } else {
            assert.equal(
              slots[s],
              null,
              `[Count ${count}, Floor ${f}, Slot ${s}] Should be Coming Soon (null)`
            );
            totalComingSoonSlots++;
          }
        }
      }

      assert.equal(
        totalPopulatedSlots,
        count,
        `[Count ${count}] Total populated slots must match active count`
      );
      const expectedComingSoon = totalFloors * 4 - count;
      assert.equal(
        totalComingSoonSlots,
        expectedComingSoon,
        `[Count ${count}] Coming Soon slots must be ${expectedComingSoon}, got ${totalComingSoonSlots}`
      );
    });
  }
});

test('PHASE 3 AUDIT — Category CRUD & Dynamic Mutations', async (t) => {
  await t.test('Category Rename: updates category name without affecting layout', () => {
    let cats = [...DEFAULT_BUILDING_CATEGORIES];
    const targetId = 'cat-shirts';
    const newName = 'BESPOKE TAILORED SHIRTS';

    // Rename
    cats = cats.map((c) => (c.id === targetId ? { ...c, name: newName } : c));
    const floor1 = getCategoriesForFloor(cats, 1);
    assert.equal(floor1[0]?.name, newName, 'Renamed category should reflect in Slot 0');
    assert.equal(floor1[0]?.id, targetId, 'ID must remain preserved');
    assert.equal(getTotalFloors(cats), 3, 'Floor count must remain unchanged');
  });

  await t.test('Category Reorder: updates sortOrder and shifts floor slot placement', () => {
    let cats = [...DEFAULT_BUILDING_CATEGORIES];
    // Move cat-shirts (initially sortOrder 1, Slot 0) to sortOrder 99 (end)
    cats = cats.map((c) => (c.id === 'cat-shirts' ? { ...c, sortOrder: 99 } : c));
    const sorted = sortCategories(getActiveCategories(cats));

    // cat-pens should now be first (Slot 0 on Floor 1)
    const floor1 = getCategoriesForFloor(cats, 1);
    assert.equal(floor1[0]?.id, 'cat-pens', 'cat-pens should move to Slot 0');
    // cat-shirts should now be on Floor 3 (index 11)
    const floor3 = getCategoriesForFloor(cats, 3);
    assert.equal(floor3[3]?.id, 'cat-shirts', 'cat-shirts should be in last slot on Floor 3');
  });

  await t.test('Category Disable/Enable: toggles visibility, shifts slots and floor count', () => {
    let cats = [...DEFAULT_BUILDING_CATEGORIES]; // 12 categories -> 3 floors
    assert.equal(getTotalFloors(cats), 3);

    // Disable 5 categories (12 - 5 = 7 active -> 2 floors)
    const toDisable = ['cat-shirts', 'cat-pens', 'cat-mugs', 'cat-frames', 'cat-cases'];
    cats = cats.map((c) => (toDisable.includes(c.id) ? { ...c, isActive: false } : c));

    assert.equal(getActiveCategories(cats).length, 7);
    assert.equal(getTotalFloors(cats), 2, '7 active categories must require exactly 2 floors');

    // Floor 2 should now have 3 active categories and 1 Coming Soon slot
    const floor2 = getCategoriesForFloor(cats, 2);
    assert.notEqual(floor2[0], null);
    assert.notEqual(floor2[1], null);
    assert.notEqual(floor2[2], null);
    assert.equal(floor2[3], null, 'Slot 4 on Floor 2 must be Coming Soon (null)');

    // Re-enable
    cats = cats.map((c) => (toDisable.includes(c.id) ? { ...c, isActive: true } : c));
    assert.equal(getActiveCategories(cats).length, 12);
    assert.equal(getTotalFloors(cats), 3, 'Re-enabling must restore 3 floors');
  });

  await t.test('Category Delete: removes category and gracefully shifts slots', () => {
    let cats = [...DEFAULT_BUILDING_CATEGORIES]; // 12 categories -> 3 floors
    // Delete cat-shirts
    cats = cats.filter((c) => c.id !== 'cat-shirts');
    assert.equal(cats.length, 11);
    assert.equal(getTotalFloors(cats), 3); // 11 cats -> 3 floors

    // Floor 1 now starts with cat-pens
    const floor1 = getCategoriesForFloor(cats, 1);
    assert.equal(floor1[0]?.id, 'cat-pens');
    assert.equal(floor1[3]?.id, 'cat-cases'); // cat-cases moved from floor 2 to floor 1 slot 4!

    // Floor 3 slot 4 is now null (Coming Soon)
    const floor3 = getCategoriesForFloor(cats, 3);
    assert.equal(floor3[2]?.id, 'cat-leather');
    assert.equal(floor3[3], null, 'Slot 4 on Floor 3 must now be Coming Soon');
  });
});
