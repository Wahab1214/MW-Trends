export interface BuildingCategory {
  id: string;
  slug: string;
  name: string;
  subline: string;
  sortOrder: number;
  isActive?: boolean;
  theme?: 'shirts' | 'mugs' | 'pens' | 'frames' | 'default';
  description?: string;
  shortLabel?: string;
  badge?: string;
  image?: string;
  thumbnail?: string;
  themeAccent?: string;
}

export interface FloorData {
  floorNumber: number;
  floorIndex: number;
  totalFloors: number;
  formattedLabel: string;
  categories: (BuildingCategory | null)[];
  hasNextFloor: boolean;
  hasPrevFloor: boolean;
  isHighestFloor: boolean;
}

export const FLOOR_HEIGHT = 8.0;

// Default Catalog Categories with strict Floor 1 specifications
export const DEFAULT_BUILDING_CATEGORIES: BuildingCategory[] = [
  // --- FLOOR 1 (Slots 1-4) ---
  {
    id: 'cat-shirts',
    slug: 'shirts',
    name: 'SHIRTS',
    subline: 'CUSTOM APPAREL',
    sortOrder: 1,
    isActive: true,
    theme: 'shirts',
    description: 'Heavyweight organic cottons, tailored streetwear silhouettes, and precision bespoke prints.',
  },
  {
    id: 'cat-pens',
    slug: 'pens',
    name: 'PENS',
    subline: 'PERSONALIZED WRITING',
    sortOrder: 2,
    isActive: true,
    theme: 'pens',
    description: 'Weighted brushed brass, dark walnut barrels, and monogrammed bespoke writing instruments.',
  },
  {
    id: 'cat-mugs',
    slug: 'mugs',
    name: 'MUGS',
    subline: 'CUSTOM DRINKWARE',
    sortOrder: 3,
    isActive: true,
    theme: 'mugs',
    description: 'High-fire ceramic matte vessels, borosilicate glassware, and lustrous metallic accents.',
  },
  {
    id: 'cat-frames',
    slug: 'frames',
    name: 'PHOTO FRAMES',
    subline: 'MEMORIES, FRAMED',
    sortOrder: 4,
    isActive: true,
    theme: 'frames',
    description: 'Museum-grade float glass, solid walnut mouldings, and gold leaf gallery profiles.',
  },

  // --- FLOOR 2 (Slots 5-8) ---
  {
    id: 'cat-cases',
    slug: 'cases',
    name: 'TECH CASES',
    subline: 'TACTILE ACCESSORIES',
    sortOrder: 5,
    isActive: true,
    theme: 'default',
    description: 'Microfiber-lined aerospace grade cases with customizable precision typography.',
  },
  {
    id: 'cat-paper',
    slug: 'paper',
    name: 'PAPER ATELIER',
    subline: 'BESPOKE STATIONERY',
    sortOrder: 6,
    isActive: true,
    theme: 'default',
    description: 'Heavyweight textured cotton cardstock, foil stamped invitations, and embossed notes.',
  },
  {
    id: 'cat-totes',
    slug: 'totes',
    name: 'CANVAS TOTES',
    subline: 'EVERYDAY ESSENTIALS',
    sortOrder: 7,
    isActive: true,
    theme: 'default',
    description: 'Heavy 16oz cotton duck canvas totes with hand-stitched leather handles.',
  },
  {
    id: 'cat-custom-lab',
    slug: 'custom-lab',
    name: 'CUSTOM LAB',
    subline: 'BESPOKE CREATIONS',
    sortOrder: 8,
    isActive: true,
    theme: 'default',
    description: 'Full studio customization suite for multi-medium bespoke objects and special commissions.',
  },

  // --- FLOOR 3 (Slots 9-12) ---
  {
    id: 'cat-hoodies',
    slug: 'hoodies',
    name: 'HOODIES',
    subline: 'HEAVYWEIGHT FLEECE',
    sortOrder: 9,
    isActive: true,
    theme: 'shirts',
    description: '450GSM French terry oversized pullovers crafted for longevity and subtle branding.',
  },
  {
    id: 'cat-prints',
    slug: 'prints',
    name: 'ART PRINTS',
    subline: 'GALLERY EDITIONS',
    sortOrder: 10,
    isActive: true,
    theme: 'frames',
    description: 'Archival giclée prints on museum rag paper with certificates of authenticity.',
  },
  {
    id: 'cat-ceramics',
    slug: 'ceramics',
    name: 'ARTISAN CERAMICS',
    subline: 'HANDCRAFTED FORM',
    sortOrder: 11,
    isActive: true,
    theme: 'mugs',
    description: 'Wheel-thrown studio vessels with hand-mixed reactive mineral glazes.',
  },
  {
    id: 'cat-leather',
    slug: 'leather',
    name: 'LEATHER GOODS',
    subline: 'MONOGRAMMED LUXURY',
    sortOrder: 12,
    isActive: true,
    theme: 'default',
    description: 'Vegetable-tanned full grain Italian leather accessories with hot foil initials.',
  },
];

/**
 * Filters only publicly active categories.
 * Inactive categories (isActive === false) do not occupy slots and do not count toward totalFloors.
 */
export function getActiveCategories(categories: BuildingCategory[]): BuildingCategory[] {
  if (!categories || !Array.isArray(categories)) return [];
  return categories.filter((c) => c && c.isActive !== false);
}

/**
 * Sorts categories deterministically by sortOrder ascending with stable fallback.
 */
export function sortCategories(categories: BuildingCategory[]): BuildingCategory[] {
  return [...categories].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.id || a.slug || '').localeCompare(b.id || b.slug || '');
  });
}

/**
 * Formats 1-indexed floor number into 2-digit format, e.g. "FLOOR 01", "FLOOR 02".
 */
export function formatFloorNumber(floorNumber: number): string {
  const padded = floorNumber < 10 ? `0${floorNumber}` : `${floorNumber}`;
  return `FLOOR ${padded}`;
}

/**
 * Calculates total floors required based on active category count.
 * Formula: totalFloors = Math.ceil(activeCategories.length / 4)
 * 0 categories -> 1 floor (empty state)
 * 1-4 categories -> 1 floor
 * 5-8 categories -> 2 floors
 * 9-12 categories -> 3 floors
 * 13-16 categories -> 4 floors
 */
export function getTotalFloors(categories: BuildingCategory[]): number {
  const active = getActiveCategories(categories);
  if (active.length === 0) return 1;
  return Math.max(1, Math.ceil(active.length / 4));
}

/**
 * Returns sorted active categories for a specific 1-indexed floor number.
 * Always returns an array of length 4, with null for unpopulated "Coming Soon" slots.
 */
export function getCategoriesForFloor(
  categories: BuildingCategory[], 
  floorNumber: number
): (BuildingCategory | null)[] {
  const activeSorted = sortCategories(getActiveCategories(categories));
  const validFloor = Math.max(1, floorNumber);
  const startIndex = (validFloor - 1) * 4;
  const floorItems = activeSorted.slice(startIndex, startIndex + 4);

  // Exactly 4 slots (null = Premium Coming Soon)
  const result: (BuildingCategory | null)[] = [null, null, null, null];
  for (let i = 0; i < 4; i++) {
    result[i] = floorItems[i] || null;
  }
  return result;
}

/**
 * Returns ShopSlotMetadata for slot index 0..3:
 * index 0 -> left-front
 * index 1 -> left-rear
 * index 2 -> right-front
 * index 3 -> right-rear
 */
export function getShopSlot(index: number): ShopSlotMetadata {
  return SHOP_SLOT_CONFIGS[index % 4] || SHOP_SLOT_CONFIGS[0];
}

/**
 * Finds the floor number and slot for a given category id or slug.
 */
export function getFloorForCategory(
  categories: BuildingCategory[],
  idOrSlug: string
): { floorNumber: number; slotIndex: number; slot: ShopSlotMetadata } | null {
  const activeSorted = sortCategories(getActiveCategories(categories));
  const catIndex = activeSorted.findIndex(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );
  if (catIndex === -1) return null;

  const floorNumber = Math.floor(catIndex / 4) + 1;
  const slotIndex = catIndex % 4;
  return {
    floorNumber,
    slotIndex,
    slot: getShopSlot(slotIndex),
  };
}

/**
 * Builds full structured array of floors for dynamic multi-floor rendering and testing.
 */
export function buildFloors(categories: BuildingCategory[]): FloorData[] {
  const total = getTotalFloors(categories);
  const floors: FloorData[] = [];

  for (let f = 1; f <= total; f++) {
    floors.push({
      floorNumber: f,
      floorIndex: f - 1,
      totalFloors: total,
      formattedLabel: formatFloorNumber(f),
      categories: getCategoriesForFloor(categories, f),
      hasNextFloor: f < total,
      hasPrevFloor: f > 1,
      isHighestFloor: f === total,
    });
  }

  return floors;
}

export type ShopSlotPosition = 'left-front' | 'left-rear' | 'right-front' | 'right-rear';

export interface ShopSlotMetadata {
  index: number; // 0 to 3
  slotName: ShopSlotPosition;
  position: [number, number, number];
  rotationY: number; // radians
  label: string;
}

/**
 * Standardized 4-shop slot coordinates relative to the floor origin [0, Y, 0]:
 * slot-1 (0): Left-Front  [-8.5, 0,  4.0]
 * slot-2 (1): Left-Rear   [-8.5, 0, -6.5]
 * slot-3 (2): Right-Front [ 8.5, 0,  4.0]
 * slot-4 (3): Right-Rear  [ 8.5, 0, -6.5]
 */
export const SHOP_SLOT_CONFIGS: ShopSlotMetadata[] = [
  {
    index: 0,
    slotName: 'left-front',
    position: [-5.3, 0, 6.2],
    rotationY: 0,
    label: 'SLOT 01 — LEFT FRONT',
  },
  {
    index: 1,
    slotName: 'left-rear',
    position: [-4.8, 0, -3.2],
    rotationY: 0,
    label: 'SLOT 02 — LEFT REAR',
  },
  {
    index: 2,
    slotName: 'right-front',
    position: [5.3, 0, 6.2],
    rotationY: 0,
    label: 'SLOT 03 — RIGHT FRONT',
  },
  {
    index: 3,
    slotName: 'right-rear',
    position: [4.8, 0, -3.2],
    rotationY: 0,
    label: 'SLOT 04 — RIGHT REAR',
  },
];
