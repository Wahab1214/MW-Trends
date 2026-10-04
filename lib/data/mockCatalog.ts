export type ProductCategory = 'apparel' | 'objects' | 'paper' | 'frames' | 'cases' | 'gifts';

export interface ProductVariant {
  id: string;
  name: string; // e.g., 'Black', 'White', 'A4', 'Matte'
  colorCode?: string;
}

export interface ProductSize {
  id: string;
  label: string;
  isAvailable: boolean;
  stockCount?: number;
}

export interface StorySection {
  title: string;
  content: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description?: string;
  sku?: string;
  customizable?: boolean;
  price: string;
  compareAtPrice?: string;
  category: ProductCategory;
  collections: string[];
  images: string[]; // [primary, alternate front/back, lifestyle, close-up]
  has3D: boolean;
  isCustomizable: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  
  // Advanced Variants
  variants: ProductVariant[];
  sizes?: ProductSize[];
  fit?: string;
  
  // Editorial Content
  storySections?: StorySection[];
  specifications?: Record<string, string>;
  careInstructions?: string[];
  
  // 3D placement metadata
  worldShop?: string;
  worldZone?: string;
  designFamilyId?: string;
}

export const MOCK_CATALOG: Product[] = [
  {
    id: 'p_01',
    slug: 'midnight-oversized-tee',
    name: 'MIDNIGHT OVERSIZED TEE',
    shortDescription: 'Heavyweight Cotton / Oversized Fit',
    price: 'Rs. 1,799',
    category: 'apparel',
    collections: ['midnight-series', 'essentials'],
    images: ['/placeholder-apparel-1.jpg', '/placeholder-apparel-1-back.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    variants: [
      { id: 'v_black', name: 'Black', colorCode: '#111111' },
      { id: 'v_ivory', name: 'Ivory', colorCode: '#F7F4ED' },
      { id: 'v_charcoal', name: 'Charcoal', colorCode: '#222222' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: false, stockCount: 0 },
      { id: 's_xxl', label: 'XXL', isAvailable: true, stockCount: 3 }
    ],
    fit: 'OVERSIZED FIT: Designed with a wider body and dropped shoulder.',
    storySections: [
      { title: 'DESIGNED FOR EVERYDAY EXPRESSION', content: 'Crafted from premium 280GSM heavyweight cotton, this tee provides structure without sacrificing comfort.' },
      { title: 'THE PERFECT CANVAS', content: 'Our printing process bonds ink directly to the fibers, ensuring your custom artwork feels seamless and lasts through countless washes.' }
    ],
    specifications: {
      'Material': '100% Premium Cotton (280 GSM)',
      'Fit': 'Oversized / Dropped Shoulder',
      'Construction': 'Double-needle stitched neckline'
    },
    careInstructions: ['Wash cold inside out', 'Do not iron directly on print', 'Tumble dry low'],
    worldShop: 'tee-studio',
    worldZone: 'hero-wall',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_02',
    slug: 'signature-gold-tee',
    name: 'SIGNATURE GOLD TEE',
    shortDescription: 'Premium Blend / Standard Fit',
    price: 'Rs. 1,499',
    category: 'apparel',
    collections: ['essentials'],
    images: ['/placeholder-apparel-2.jpg'],
    has3D: false,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    variants: [
      { id: 'v_white', name: 'White', colorCode: '#F7F4ED' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
    ],
    worldShop: 'tee-studio',
    worldZone: 'best-sellers'
  },
  {
    id: 'p_03',
    slug: 'shadowline-hoodie',
    name: 'SHADOWLINE HOODIE',
    shortDescription: 'Fleece Lined / Charcoal',
    price: 'Rs. 2,999',
    compareAtPrice: 'Rs. 3,499',
    category: 'apparel',
    collections: ['midnight-series'],
    images: ['/placeholder-apparel-3.jpg'],
    has3D: false,
    isCustomizable: false,
    isNew: true,
    isBestSeller: false,
    variants: [
      { id: 'v_charcoal', name: 'Charcoal', colorCode: '#222222' }
    ],
    worldShop: 'tee-studio',
    worldZone: 'new-drop'
  },
  {
    id: 'p_04',
    slug: 'signature-mug',
    name: 'SIGNATURE MUG',
    shortDescription: 'Matte Ceramic / Gold Print',
    price: 'Rs. 899',
    category: 'objects',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-mug-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    variants: [
      { id: 'v_black_matte', name: 'Black Matte', colorCode: '#111111' },
      { id: 'v_white_matte', name: 'Ivory Matte', colorCode: '#F7F4ED' }
    ],
    specifications: {
      'Capacity': '11 oz',
      'Material': 'High-fire ceramic',
      'Finish': 'Premium Matte'
    },
    careInstructions: ['Hand wash recommended', 'Microwave safe'],
    worldShop: 'mug-bar',
    worldZone: 'hero-pedestal',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_05',
    slug: 'minimal-glass-mug',
    name: 'MINIMAL GLASS MUG',
    shortDescription: 'Borosilicate Glass / Transparent',
    price: 'Rs. 1,199',
    category: 'objects',
    collections: [],
    images: ['/placeholder-mug-2.jpg'],
    has3D: false,
    isCustomizable: false,
    isNew: true,
    isBestSeller: false,
    variants: [],
    worldShop: 'mug-bar',
    worldZone: 'shelf'
  },
  {
    id: 'p_06',
    slug: 'memory-frame-01',
    name: 'MEMORY FRAME 01',
    shortDescription: 'Brushed Metal / A4',
    price: 'Rs. 1,499',
    category: 'frames',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    variants: [
      { id: 'v_black_metal', name: 'Black Metal', colorCode: '#1B1B1B' },
      { id: 'v_gold_metal', name: 'Gold Metal', colorCode: '#D4AF37' }
    ],
    sizes: [
      { id: 's_a4', label: 'A4', isAvailable: true },
      { id: 's_a3', label: 'A3', isAvailable: true }
    ],
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_07',
    slug: 'custom-story-card',
    name: 'CUSTOM STORY CARD',
    shortDescription: 'Premium Textured Paper',
    price: 'Rs. 499',
    category: 'paper',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-card-1.jpg'],
    has3D: false,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    variants: []
  },
  {
    id: 'p_08',
    slug: 'monogram-phone-case',
    name: 'MONOGRAM CASE',
    shortDescription: 'Matte Black / Drop Protection',
    price: 'Rs. 999',
    category: 'cases',
    collections: [],
    images: ['/placeholder-case-1.jpg'],
    has3D: false,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    variants: [
      { id: 'v_black', name: 'Matte Black', colorCode: '#111111' }
    ],
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_09',
    slug: 'mw-essential-tote',
    name: 'MW ESSENTIAL TOTE',
    shortDescription: 'Heavy Canvas / Black',
    price: 'Rs. 1,299',
    category: 'gifts',
    collections: ['essentials'],
    images: ['/placeholder-tote-1.jpg'],
    has3D: false,
    isCustomizable: false,
    isNew: false,
    isBestSeller: false,
    variants: [
      { id: 'v_black', name: 'Black', colorCode: '#111111' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'apparel', name: 'Apparel', slug: 'apparel' },
  { id: 'objects', name: 'Objects', slug: 'objects' },
  { id: 'paper', name: 'Paper', slug: 'paper' },
  { id: 'frames', name: 'Frames', slug: 'frames' },
  { id: 'cases', name: 'Cases', slug: 'cases' },
  { id: 'gifts', name: 'Gifts', slug: 'gifts' },
];

export const COLLECTIONS = [
  { id: 'midnight-series', name: 'MIDNIGHT SERIES', slug: 'midnight-series', description: 'Explore apparel designed around contrast, form and identity.' },
  { id: 'essentials', name: 'ESSENTIALS', slug: 'essentials', description: 'Core pieces for everyday.' },
  { id: 'gifts-under-2000', name: 'GIFTS UNDER 2000', slug: 'gifts-under-2000', description: 'Curated premium objects perfect for gifting.' }
];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_CATALOG.find(p => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return MOCK_CATALOG.filter(p => p.category === categoryId);
}

export function getProductsByCollection(collectionId: string): Product[] {
  return MOCK_CATALOG.filter(p => p.collections.includes(collectionId));
}
