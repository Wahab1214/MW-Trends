export type ProductCategory = 'apparel' | 'objects' | 'paper' | 'frames' | 'cases' | 'gifts' | 'pens';

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
  numericPrice: number;
  compareAtPrice?: string;
  category: ProductCategory;
  categorySlug: string; // 'shirts' | 'mugs' | 'pens' | 'frames' | etc.
  collections: string[];
  images: string[];
  has3D: boolean;
  isCustomizable: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured?: boolean;
  sortOrder: number;
  rating?: number;
  
  // Advanced Filter Attributes
  material?: string;
  colorName?: string;
  fit?: string;
  sleeve?: string;
  capacity?: string;
  inkColor?: string;
  penStyle?: string;
  orientation?: string;
  
  // Advanced Variants
  variants: ProductVariant[];
  sizes?: ProductSize[];
  
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
  // ========================================================
  // 1. SHIRTS / APPAREL (Luxury Fashion Boutique)
  // ========================================================
  {
    id: 'p_shirt_01',
    slug: 'midnight-oversized-tee',
    name: 'MIDNIGHT OVERSIZED TEE',
    shortDescription: 'Heavyweight Cotton / Oversized Streetwear Fit',
    price: 'Rs. 1,799',
    numericPrice: 1799,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['midnight-series', 'essentials'],
    images: ['/placeholder-apparel-1.jpg', '/placeholder-apparel-1-back.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.95,
    material: 'Organic Cotton (280 GSM)',
    colorName: 'Black',
    fit: 'Oversized',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_black', name: 'Black', colorCode: '#111111' },
      { id: 'v_ivory', name: 'Ivory', colorCode: '#F7F4ED' },
      { id: 'v_charcoal', name: 'Charcoal', colorCode: '#222222' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: true },
      { id: 's_xxl', label: 'XXL', isAvailable: true, stockCount: 3 }
    ],
    storySections: [
      { title: 'SCULPTED STREETWEAR ARCHITECTURE', content: 'Crafted from 280GSM combed cotton with dropped shoulders and a dense rib collar.' }
    ],
    specifications: {
      'Material': '100% Combed Heavy Cotton (280 GSM)',
      'Fit': 'Oversized Dropped Shoulder',
      'Origin': 'Hand-finished in Atelier'
    },
    worldShop: 'shirts',
    worldZone: 'hero-mannequin',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_shirt_02',
    slug: 'signature-gold-tee',
    name: 'SIGNATURE GOLD TEE',
    shortDescription: 'Peruvian Pima Cotton / Champagne Accent',
    price: 'Rs. 1,499',
    numericPrice: 1499,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['essentials'],
    images: ['/placeholder-apparel-2.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    sortOrder: 2,
    rating: 4.88,
    material: 'Pima Cotton',
    colorName: 'Ivory',
    fit: 'Standard',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_white', name: 'Ivory', colorCode: '#F7F4ED' },
      { id: 'v_black', name: 'Obsidian', colorCode: '#111111' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'rail-left'
  },
  {
    id: 'p_shirt_03',
    slug: 'monogram-oxford-shirt',
    name: 'MONOGRAM OXFORD SHIRT',
    shortDescription: 'Tailored Egyptian Giza Cotton / French Cuffs',
    price: 'Rs. 2,899',
    numericPrice: 2899,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-apparel-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: false,
    sortOrder: 3,
    rating: 4.92,
    material: 'Egyptian Giza Cotton',
    colorName: 'White',
    fit: 'Tailored',
    sleeve: 'Long Sleeve',
    variants: [
      { id: 'v_white', name: 'Crisp White', colorCode: '#FFFFFF' },
      { id: 'v_blue', name: 'Sky Celeste', colorCode: '#8FA9C4' }
    ],
    sizes: [
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'rail-left'
  },
  {
    id: 'p_shirt_04',
    slug: 'atelier-raw-linen-shirt',
    name: 'ATELIER RAW LINEN SHIRT',
    shortDescription: 'Bespoke Belgian Flax / Camp Collar',
    price: 'Rs. 2,499',
    numericPrice: 2499,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['resort-atelier'],
    images: ['/placeholder-apparel-3.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: false,
    isBestSeller: true,
    sortOrder: 4,
    rating: 4.85,
    material: 'Belgian Linen',
    colorName: 'Sand',
    fit: 'Relaxed',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_sand', name: 'Raw Sand', colorCode: '#D9C8B4' },
      { id: 'v_black', name: 'Washed Charcoal', colorCode: '#2B2B2B' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'rail-right'
  },
  {
    id: 'p_shirt_05',
    slug: 'shadowline-heavyweight-tee',
    name: 'SHADOWLINE HEAVYWEIGHT TEE',
    shortDescription: 'Dense Double-Knit Jersey / Minimalist Collar',
    price: 'Rs. 2,199',
    numericPrice: 2199,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['midnight-series'],
    images: ['/placeholder-apparel-2.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: false,
    sortOrder: 5,
    rating: 4.9,
    material: 'Double-Knit Cotton',
    colorName: 'Charcoal',
    fit: 'Oversized',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_charcoal', name: 'Anthracite', colorCode: '#242424' }
    ],
    sizes: [
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'rail-right'
  },
  {
    id: 'p_shirt_06',
    slug: 'minimal-mock-neck-tee',
    name: 'MINIMAL MOCK NECK TEE',
    shortDescription: 'Silk-Cotton Blend / Architectural Silhouette',
    price: 'Rs. 1,999',
    numericPrice: 1999,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['essentials'],
    images: ['/placeholder-apparel-1.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: false,
    isBestSeller: false,
    sortOrder: 6,
    rating: 4.79,
    material: 'Silk-Cotton Blend',
    colorName: 'Black',
    fit: 'Standard',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_black', name: 'Noir Black', colorCode: '#111111' }
    ],
    sizes: [
      { id: 's_s', label: 'S', isAvailable: true },
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'wall-display'
  },
  {
    id: 'p_shirt_07',
    slug: 'heritage-mercerized-polo',
    name: 'HERITAGE MERCERIZED POLO',
    shortDescription: 'Liquid Mercerized Cotton / Hidden Placket',
    price: 'Rs. 2,599',
    numericPrice: 2599,
    category: 'apparel',
    categorySlug: 'shirts',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-apparel-3.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    sortOrder: 7,
    rating: 4.93,
    material: 'Mercerized Cotton',
    colorName: 'Gold',
    fit: 'Tailored',
    sleeve: 'Short Sleeve',
    variants: [
      { id: 'v_gold', name: 'Champagne Gold', colorCode: '#C8A86B' },
      { id: 'v_navy', name: 'Deep Midnight', colorCode: '#131B2B' }
    ],
    sizes: [
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: true }
    ],
    worldShop: 'shirts',
    worldZone: 'wall-display'
  },

  // ========================================================
  // 2. MUGS / DRINKWARE (Ceramic & Object Gallery)
  // ========================================================
  {
    id: 'p_mug_01',
    slug: 'signature-mug',
    name: 'SIGNATURE MUG',
    shortDescription: 'Matte Ceramic / Champagne Gold Print / 11 oz',
    price: 'Rs. 899',
    numericPrice: 899,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['gifts-under-2000', 'essentials'],
    images: ['/placeholder-mug-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.94,
    material: 'Ceramic',
    colorName: 'Matte Black',
    capacity: '11 oz',
    variants: [
      { id: 'v_black_matte', name: 'Black Matte', colorCode: '#111111' },
      { id: 'v_white_matte', name: 'Ivory Matte', colorCode: '#F7F4ED' }
    ],
    specifications: {
      'Capacity': '11 oz / 325 ml',
      'Material': 'High-fire stoneware ceramic',
      'Finish': 'Satin matte glaze'
    },
    worldShop: 'mugs',
    worldZone: 'hero-pedestal',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_mug_02',
    slug: 'minimal-glass-mug',
    name: 'MINIMAL BOROSILICATE MUG',
    shortDescription: 'Dual-Walled Borosilicate Glass / 12 oz',
    price: 'Rs. 1,199',
    numericPrice: 1199,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['essentials'],
    images: ['/placeholder-mug-2.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: true,
    isBestSeller: false,
    sortOrder: 2,
    rating: 4.82,
    material: 'Glass',
    colorName: 'Clear Glass',
    capacity: '12 oz',
    variants: [
      { id: 'v_clear', name: 'Clear Fluted', colorCode: '#E5E5E5' }
    ],
    worldShop: 'mugs',
    worldZone: 'shelf-left'
  },
  {
    id: 'p_mug_03',
    slug: 'nero-marquina-ceramic-cup',
    name: 'NERO MARQUINA VESSEL',
    shortDescription: 'Black Stoneware / Gold Leaf Rim / 14 oz',
    price: 'Rs. 1,399',
    numericPrice: 1399,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['midnight-series'],
    images: ['/placeholder-mug-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    sortOrder: 3,
    rating: 4.96,
    material: 'Ceramic',
    colorName: 'Gold Rim',
    capacity: '14 oz',
    variants: [
      { id: 'v_nero', name: 'Nero Black & Gold', colorCode: '#1A1817' }
    ],
    worldShop: 'mugs',
    worldZone: 'shelf-left'
  },
  {
    id: 'p_mug_04',
    slug: 'artisan-espresso-tumbler',
    name: 'ARTISAN ESPRESSO CUP',
    shortDescription: 'Hand-Pinched Raw Clay / Gloss Interior / 4 oz',
    price: 'Rs. 799',
    numericPrice: 799,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-mug-2.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: false,
    isBestSeller: false,
    sortOrder: 4,
    rating: 4.78,
    material: 'Stoneware',
    colorName: 'Ivory',
    capacity: '4 oz Espresso',
    variants: [
      { id: 'v_clay', name: 'Terracotta & Bone', colorCode: '#CBB29C' }
    ],
    worldShop: 'mugs',
    worldZone: 'shelf-right'
  },
  {
    id: 'p_mug_05',
    slug: 'thermal-travel-caravan-mug',
    name: 'THERMAL CARAVAN TUMBLER',
    shortDescription: 'Ceramic Core / Matte Steel Exterior / 16 oz',
    price: 'Rs. 1,699',
    numericPrice: 1699,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['essentials'],
    images: ['/placeholder-mug-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    sortOrder: 5,
    rating: 4.91,
    material: 'Stoneware',
    colorName: 'Matte Black',
    capacity: '16 oz',
    variants: [
      { id: 'v_graphite', name: 'Graphite Black', colorCode: '#1E1E1E' },
      { id: 'v_sand', name: 'Warm Cream', colorCode: '#EFE9DF' }
    ],
    worldShop: 'mugs',
    worldZone: 'shelf-right'
  },
  {
    id: 'p_mug_06',
    slug: 'ivory-gold-accent-mug',
    name: 'IVORY GOLD ACCENT MUG',
    shortDescription: 'Fine Porcelain / Monogram Base / 11 oz',
    price: 'Rs. 1,499',
    numericPrice: 1499,
    category: 'objects',
    categorySlug: 'mugs',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-mug-2.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    sortOrder: 6,
    rating: 4.87,
    material: 'Ceramic',
    colorName: 'Ivory',
    capacity: '11 oz',
    variants: [
      { id: 'v_ivory_gold', name: 'Ivory & Gold', colorCode: '#F4EFE7' }
    ],
    worldShop: 'mugs',
    worldZone: 'pedestal-rear'
  },

  // ========================================================
  // 3. PENS / WRITING INSTRUMENTS (Luxury Writing Lounge)
  // ========================================================
  {
    id: 'p_pen_01',
    slug: 'bespoke-brass-fountain-pen',
    name: 'BESPOKE BRASS FOUNTAIN PEN',
    shortDescription: 'Solid Machined Brass / 18k Gold Nib / Laser Engraved',
    price: 'Rs. 3,499',
    numericPrice: 3499,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.98,
    material: 'Brushed Brass',
    inkColor: 'Black',
    penStyle: 'Fountain',
    variants: [
      { id: 'v_brass', name: 'Raw Brushed Brass', colorCode: '#D4AF37' },
      { id: 'v_black_brass', name: 'PVD Obsidian Black', colorCode: '#181818' }
    ],
    specifications: {
      'Weight': '48g Balanced Weight',
      'Nib': '18k Bicolour Gold Nib (Fine)',
      'Refill': 'Standard International Cartridge / Converter'
    },
    worldShop: 'pens',
    worldZone: 'hero-vitrine',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_pen_02',
    slug: 'walnut-monogram-rollerball',
    name: 'WALNUT MONOGRAM ROLLERBALL',
    shortDescription: 'American Walnut Barrel / Brushed Champagne Clip',
    price: 'Rs. 2,799',
    numericPrice: 2799,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['essentials'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    sortOrder: 2,
    rating: 4.9,
    material: 'Walnut Wood',
    inkColor: 'Black',
    penStyle: 'Rollerball',
    variants: [
      { id: 'v_walnut', name: 'American Walnut', colorCode: '#4A3324' },
      { id: 'v_ebony', name: 'Smoked Ebony', colorCode: '#211C18' }
    ],
    worldShop: 'pens',
    worldZone: 'case-left'
  },
  {
    id: 'p_pen_03',
    slug: 'obsidian-matte-ballpoint',
    name: 'OBSIDIAN EXECUTIVE BALLPOINT',
    shortDescription: 'Aerospace Aluminium / Tactile Micro-Knurl',
    price: 'Rs. 1,899',
    numericPrice: 1899,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['essentials'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: false,
    sortOrder: 3,
    rating: 4.84,
    material: 'Titanium',
    inkColor: 'Black',
    penStyle: 'Ballpoint',
    variants: [
      { id: 'v_matte_black', name: 'Matte Obsidian', colorCode: '#111111' }
    ],
    worldShop: 'pens',
    worldZone: 'case-left'
  },
  {
    id: 'p_pen_04',
    slug: 'champagne-gold-fineliner',
    name: 'CHAMPAGNE GOLD FINELINER',
    shortDescription: 'Brushed Gold Finish / 0.5mm Precision Archival Point',
    price: 'Rs. 2,299',
    numericPrice: 2299,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    sortOrder: 4,
    rating: 4.88,
    material: 'Brushed Brass',
    inkColor: 'Blue',
    penStyle: 'Rollerball',
    variants: [
      { id: 'v_gold', name: 'Champagne Gold', colorCode: '#D4AF37' }
    ],
    worldShop: 'pens',
    worldZone: 'case-right'
  },
  {
    id: 'p_pen_05',
    slug: 'damascus-steel-executive-pen',
    name: 'DAMASCUS STEEL EXECUTIVE PEN',
    shortDescription: 'Layered Damascus Steel Pattern / Magnetic Cap',
    price: 'Rs. 4,999',
    numericPrice: 4999,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: true,
    isBestSeller: true,
    sortOrder: 5,
    rating: 4.97,
    material: 'Steel',
    inkColor: 'Black',
    penStyle: 'Fountain',
    variants: [
      { id: 'v_damascus', name: 'Damascus Steel', colorCode: '#5A5B60' }
    ],
    worldShop: 'pens',
    worldZone: 'case-right'
  },
  {
    id: 'p_pen_06',
    slug: 'heritage-calligraphy-set',
    name: 'HERITAGE CALLIGRAPHY PEN',
    shortDescription: 'Weighted Walnut Dipping Pen with Brass Rest & Inks',
    price: 'Rs. 2,999',
    numericPrice: 2999,
    category: 'pens',
    categorySlug: 'pens',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-card-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    sortOrder: 6,
    rating: 4.86,
    material: 'Walnut Wood',
    inkColor: 'Sepia',
    penStyle: 'Fountain',
    variants: [
      { id: 'v_wood_brass', name: 'Walnut & Brass', colorCode: '#4B3621' }
    ],
    worldShop: 'pens',
    worldZone: 'display-stand'
  },

  // ========================================================
  // 4. PHOTO FRAMES (Refined Art Gallery)
  // ========================================================
  {
    id: 'p_frame_01',
    slug: 'memory-frame-01',
    name: 'MEMORY FRAME 01',
    shortDescription: 'Brushed Metal Profile / Museum Float Glass / A4',
    price: 'Rs. 1,499',
    numericPrice: 1499,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['gifts-under-2000', 'essentials'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.95,
    material: 'Brushed Metal',
    orientation: 'Portrait',
    variants: [
      { id: 'v_black_metal', name: 'Black Metal', colorCode: '#1B1B1B' },
      { id: 'v_gold_metal', name: 'Gold Metal', colorCode: '#D4AF37' }
    ],
    sizes: [
      { id: 's_a4', label: 'A4', isAvailable: true },
      { id: 's_a3', label: 'A3', isAvailable: true }
    ],
    worldShop: 'frames',
    worldZone: 'hero-gallery-wall',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_frame_02',
    slug: 'solid-walnut-gallery-frame',
    name: 'SOLID WALNUT GALLERY FRAME',
    shortDescription: 'American Walnut Moulding / Acid-Free Archival Mat',
    price: 'Rs. 2,499',
    numericPrice: 2499,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['essentials'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    sortOrder: 2,
    rating: 4.93,
    material: 'Solid Walnut',
    orientation: 'Landscape',
    variants: [
      { id: 'v_walnut', name: 'Natural Walnut', colorCode: '#4F3827' }
    ],
    sizes: [
      { id: 's_a4', label: 'A4', isAvailable: true },
      { id: 's_a3', label: 'A3', isAvailable: true }
    ],
    worldShop: 'frames',
    worldZone: 'wall-left'
  },
  {
    id: 'p_frame_03',
    slug: 'champagne-gold-float-frame',
    name: 'CHAMPAGNE GOLD FLOAT FRAME',
    shortDescription: 'Slimline Brass Edge / Floating Dual-Glass Effect',
    price: 'Rs. 1,999',
    numericPrice: 1999,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: false,
    sortOrder: 3,
    rating: 4.89,
    material: 'Champagne Gold',
    orientation: 'Square',
    variants: [
      { id: 'v_gold', name: 'Brushed Champagne', colorCode: '#D4AF37' }
    ],
    sizes: [
      { id: 's_8x10', label: '8x10', isAvailable: true }
    ],
    worldShop: 'frames',
    worldZone: 'wall-left'
  },
  {
    id: 'p_frame_04',
    slug: 'noir-minimal-square-frame',
    name: 'NOIR MINIMAL SQUARE FRAME',
    shortDescription: 'Deep Box Shadow Moulding / Gallery White Mat',
    price: 'Rs. 1,299',
    numericPrice: 1299,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['essentials'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    sortOrder: 4,
    rating: 4.81,
    material: 'Brushed Metal',
    orientation: 'Square',
    variants: [
      { id: 'v_black', name: 'Satin Noir', colorCode: '#111111' }
    ],
    worldShop: 'frames',
    worldZone: 'wall-right'
  },
  {
    id: 'p_frame_05',
    slug: 'heritage-oak-easel-frame',
    name: 'HERITAGE OAK EASEL FRAME',
    shortDescription: 'Solid White Oak Desktop Frame / Brass Hinges',
    price: 'Rs. 1,699',
    numericPrice: 1699,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: false,
    isBestSeller: false,
    sortOrder: 5,
    rating: 4.86,
    material: 'Solid Walnut',
    orientation: 'Portrait',
    variants: [
      { id: 'v_oak', name: 'Bleached Oak', colorCode: '#C8B195' }
    ],
    worldShop: 'frames',
    worldZone: 'console-table'
  },
  {
    id: 'p_frame_06',
    slug: 'grand-gallery-triptych-frame',
    name: 'GRAND GALLERY TRIPTYCH FRAME',
    shortDescription: 'Three-Panel Continuous Oak Moulding / Archival Art Print',
    price: 'Rs. 3,899',
    numericPrice: 3899,
    category: 'frames',
    categorySlug: 'frames',
    collections: ['bespoke-tailored'],
    images: ['/placeholder-frame-1.jpg'],
    has3D: true,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    sortOrder: 6,
    rating: 4.96,
    material: 'Solid Walnut',
    orientation: 'Landscape',
    variants: [
      { id: 'v_walnut_gold', name: 'Walnut & Gold Inlay', colorCode: '#3D2817' }
    ],
    worldShop: 'frames',
    worldZone: 'console-table'
  },

  // ========================================================
  // 5. SECONDARY CATEGORIES (Tech Cases, Paper, Totes, Hoodies)
  // ========================================================
  {
    id: 'p_case_01',
    slug: 'monogram-phone-case',
    name: 'MONOGRAM LEATHER CASE',
    shortDescription: 'Italian Full-Grain Leather / Microfiber Lining',
    price: 'Rs. 999',
    numericPrice: 999,
    category: 'cases',
    categorySlug: 'cases',
    collections: ['essentials'],
    images: ['/placeholder-case-1.jpg'],
    has3D: false,
    isCustomizable: true,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.9,
    material: 'Leather',
    variants: [
      { id: 'v_black', name: 'Matte Black', colorCode: '#111111' },
      { id: 'v_cognac', name: 'Cognac Saddle', colorCode: '#9B5B2E' }
    ],
    worldShop: 'cases',
    designFamilyId: 'midnight-01'
  },
  {
    id: 'p_paper_01',
    slug: 'custom-story-card',
    name: 'CUSTOM STORY CARD ATELIER',
    shortDescription: 'Premium Textured Cotton Cardstock / Hot Gold Foil',
    price: 'Rs. 499',
    numericPrice: 499,
    category: 'paper',
    categorySlug: 'paper',
    collections: ['gifts-under-2000'],
    images: ['/placeholder-card-1.jpg'],
    has3D: false,
    isCustomizable: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.88,
    material: 'Cotton Cardstock',
    variants: [
      { id: 'v_ivory', name: 'Ivory Rag', colorCode: '#F4EFE7' }
    ],
    worldShop: 'paper'
  },
  {
    id: 'p_tote_01',
    slug: 'mw-essential-tote',
    name: 'MW ESSENTIAL HEAVYWEIGHT TOTE',
    shortDescription: '18oz Waxed Cotton Canvas / Italian Bridle Leather Handles',
    price: 'Rs. 1,299',
    numericPrice: 1299,
    category: 'gifts',
    categorySlug: 'totes',
    collections: ['essentials'],
    images: ['/placeholder-tote-1.jpg'],
    has3D: false,
    isCustomizable: false,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.85,
    material: 'Waxed Canvas',
    variants: [
      { id: 'v_black', name: 'Noir Black', colorCode: '#111111' },
      { id: 'v_olive', name: 'Deep Olive', colorCode: '#3E4233' }
    ],
    worldShop: 'totes'
  },
  {
    id: 'p_hoodie_01',
    slug: 'shadowline-hoodie',
    name: 'SHADOWLINE FLEECE HOODIE',
    shortDescription: '450GSM French Terry / Double Hood / Charcoal',
    price: 'Rs. 2,999',
    numericPrice: 2999,
    compareAtPrice: 'Rs. 3,499',
    category: 'apparel',
    categorySlug: 'hoodies',
    collections: ['midnight-series'],
    images: ['/placeholder-apparel-3.jpg'],
    has3D: true,
    isCustomizable: false,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    sortOrder: 1,
    rating: 4.94,
    material: 'French Terry Cotton',
    colorName: 'Charcoal',
    fit: 'Oversized',
    variants: [
      { id: 'v_charcoal', name: 'Charcoal Heather', colorCode: '#222222' }
    ],
    sizes: [
      { id: 's_m', label: 'M', isAvailable: true },
      { id: 's_l', label: 'L', isAvailable: true },
      { id: 's_xl', label: 'XL', isAvailable: true }
    ],
    worldShop: 'hoodies'
  }
];

export const CATEGORIES = [
  { id: 'shirts', name: 'Shirts', slug: 'shirts', alias: 'apparel' },
  { id: 'mugs', name: 'Mugs', slug: 'mugs', alias: 'objects' },
  { id: 'pens', name: 'Pens', slug: 'pens', alias: 'pens' },
  { id: 'frames', name: 'Photo Frames', slug: 'frames', alias: 'frames' },
  { id: 'cases', name: 'Tech Cases', slug: 'cases', alias: 'cases' },
  { id: 'paper', name: 'Paper Atelier', slug: 'paper', alias: 'paper' },
  { id: 'totes', name: 'Canvas Totes', slug: 'totes', alias: 'gifts' },
  { id: 'hoodies', name: 'Hoodies', slug: 'hoodies', alias: 'apparel' }
];

export const COLLECTIONS = [
  { id: 'midnight-series', name: 'MIDNIGHT SERIES', slug: 'midnight-series', description: 'Explore apparel designed around contrast, form and identity.' },
  { id: 'essentials', name: 'ESSENTIALS', slug: 'essentials', description: 'Core pieces for everyday.' },
  { id: 'gifts-under-2000', name: 'GIFTS UNDER 2000', slug: 'gifts-under-2000', description: 'Curated premium objects perfect for gifting.' },
  { id: 'bespoke-tailored', name: 'BESPOKE TAILORED', slug: 'bespoke-tailored', description: 'Mastercrafted personalized commissions.' }
];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_CATALOG.find(p => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(categoryIdOrSlug: string): Product[] {
  const norm = (categoryIdOrSlug || '').toLowerCase().trim();
  return MOCK_CATALOG.filter(p => 
    p.categorySlug === norm || 
    p.category === norm ||
    (norm === 'shirts' && p.category === 'apparel') ||
    (norm === 'mugs' && p.category === 'objects') ||
    (norm === 'pens' && p.category === 'pens') ||
    (norm === 'frames' && p.category === 'frames') ||
    (norm === 'cases' && p.category === 'cases') ||
    (norm === 'paper' && p.category === 'paper') ||
    (norm === 'totes' && p.category === 'gifts')
  );
}

export function getProductsByCollection(collectionId: string): Product[] {
  return MOCK_CATALOG.filter(p => p.collections.includes(collectionId));
}

export interface FilterOptions {
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'bestselling';
  material?: string;
  colorName?: string;
  fit?: string;
  sleeve?: string;
  capacity?: string;
  inkColor?: string;
  penStyle?: string;
  orientation?: string;
  isCustomizableOnly?: boolean;
}

export function filterAndSortProducts(products: Product[], options: FilterOptions): Product[] {
  let list = [...products];

  // 1. Text Search Query
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.material && p.material.toLowerCase().includes(q))
    );
  }

  // 2. Attribute Filters
  if (options.isCustomizableOnly) {
    list = list.filter(p => p.isCustomizable);
  }
  if (options.material) {
    list = list.filter(p => p.material?.toLowerCase().includes(options.material!.toLowerCase()));
  }
  if (options.colorName) {
    list = list.filter(p => 
      p.colorName?.toLowerCase().includes(options.colorName!.toLowerCase()) ||
      p.variants.some(v => v.name.toLowerCase().includes(options.colorName!.toLowerCase()))
    );
  }
  if (options.fit) {
    list = list.filter(p => p.fit?.toLowerCase() === options.fit!.toLowerCase());
  }
  if (options.sleeve) {
    list = list.filter(p => p.sleeve?.toLowerCase() === options.sleeve!.toLowerCase());
  }
  if (options.capacity) {
    list = list.filter(p => p.capacity?.toLowerCase().includes(options.capacity!.toLowerCase()));
  }
  if (options.inkColor) {
    list = list.filter(p => p.inkColor?.toLowerCase().includes(options.inkColor!.toLowerCase()));
  }
  if (options.penStyle) {
    list = list.filter(p => p.penStyle?.toLowerCase() === options.penStyle!.toLowerCase());
  }
  if (options.orientation) {
    list = list.filter(p => p.orientation?.toLowerCase() === options.orientation!.toLowerCase());
  }

  // 3. Sorting
  const sort = options.sortBy || 'featured';
  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.numericPrice - b.numericPrice);
      break;
    case 'price-desc':
      list.sort((a, b) => b.numericPrice - a.numericPrice);
      break;
    case 'newest':
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'bestselling':
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
    case 'featured':
    default:
      list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      break;
  }

  return list;
}

export const getAllProducts = (): Product[] => MOCK_CATALOG;
