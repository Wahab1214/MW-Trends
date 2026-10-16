export interface FilterGroupConfig {
  id: string;
  label: string;
  type: 'select' | 'chips' | 'toggle';
  options: { label: string; value: string }[];
}

export interface CategoryInteriorProfile {
  slug: string;
  title: string;
  subline: string;
  moodTitle: string;
  ambianceDescription: string;
  palette: {
    wallColor: string;
    floorColor: string;
    trimColor: string;
    accentColor: string;
    woodColor?: string;
    ambientLightColor: string;
    keySpotlightColor: string;
    rimLightColor: string;
  };
  lighting: {
    ambientIntensity: number;
    spotIntensity: number;
    rimIntensity: number;
    shadowSoftness: number;
  };
  heroDisplay: {
    type: 'podium-mannequin' | 'rotating-pedestal' | 'vitrine-island' | 'gallery-feature-wall' | 'luxury-plinth';
    heroTitle: string;
    pedestalMaterial: 'nero-marquina' | 'calacatta-gold' | 'dark-walnut' | 'brushed-brass';
    rotationSpeed: number;
  };
  productDisplayStyle: 'fashion-rail' | 'illuminated-shelves' | 'glass-vitrines' | 'art-consoles' | 'modern-plinths';
  filterGroups: FilterGroupConfig[];
  decorations: string[];
}

export const SHOP_THEMES: Record<string, CategoryInteriorProfile> = {
  shirts: {
    slug: 'shirts',
    title: 'SHIRTS',
    subline: 'CUSTOM APPAREL ATELIER',
    moodTitle: 'LUXURY FASHION BOUTIQUE',
    ambianceDescription: 'Tailored streetwear silhouettes, hanging brass rails, full-height bronze mirrors, and warm fashion spotlights.',
    palette: {
      wallColor: '#141416',
      floorColor: '#1A1817', // Polished Nero Marquina with Calacatta veining
      trimColor: '#C8A86B', // Champagne gold
      accentColor: '#D4AF37',
      woodColor: '#2B221B',
      ambientLightColor: '#F7EFE2',
      keySpotlightColor: '#FFF8EB',
      rimLightColor: '#D4AF37',
    },
    lighting: {
      ambientIntensity: 0.75,
      spotIntensity: 2.8,
      rimIntensity: 1.6,
      shadowSoftness: 0.3,
    },
    heroDisplay: {
      type: 'podium-mannequin',
      heroTitle: 'HERO MANNEQUIN SHOWCASE',
      pedestalMaterial: 'nero-marquina',
      rotationSpeed: 0.12,
    },
    productDisplayStyle: 'fashion-rail',
    filterGroups: [
      {
        id: 'fit',
        label: 'FIT',
        type: 'chips',
        options: [
          { label: 'ALL FITS', value: '' },
          { label: 'OVERSIZED', value: 'oversized' },
          { label: 'STANDARD', value: 'standard' },
          { label: 'TAILORED', value: 'tailored' },
        ],
      },
      {
        id: 'sleeve',
        label: 'SLEEVE',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'SHORT SLEEVE', value: 'short sleeve' },
          { label: 'LONG SLEEVE', value: 'long sleeve' },
        ],
      },
      {
        id: 'material',
        label: 'MATERIAL',
        type: 'select',
        options: [
          { label: 'ALL FABRICS', value: '' },
          { label: 'ORGANIC COTTON', value: 'cotton' },
          { label: 'PIMA COTTON', value: 'pima' },
          { label: 'BELGIAN LINEN', value: 'linen' },
        ],
      },
    ],
    decorations: ['mannequins', 'bronze-mirrors', 'folded-shirt-wall', 'gold-rails'],
  },

  mugs: {
    slug: 'mugs',
    title: 'MUGS',
    subline: 'CUSTOM DRINKWARE GALLERY',
    moodTitle: 'PREMIUM CERAMIC & OBJECT GALLERY',
    ambianceDescription: 'Museum-grade illuminated niches, rotating circular marble plinths, and warm 2700K amber shelf illumination.',
    palette: {
      wallColor: '#181615',
      floorColor: '#161514', // Calacatta cream and deep graphite
      trimColor: '#C8A86B',
      accentColor: '#D4AF37',
      ambientLightColor: '#FFE7CF',
      keySpotlightColor: '#FFF2DF',
      rimLightColor: '#E2B870',
    },
    lighting: {
      ambientIntensity: 0.7,
      spotIntensity: 3.0,
      rimIntensity: 1.8,
      shadowSoftness: 0.25,
    },
    heroDisplay: {
      type: 'rotating-pedestal',
      heroTitle: 'CENTRAL ROTATING OBJECT PEDESTAL',
      pedestalMaterial: 'calacatta-gold',
      rotationSpeed: 0.2,
    },
    productDisplayStyle: 'illuminated-shelves',
    filterGroups: [
      {
        id: 'material',
        label: 'MATERIAL',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'CERAMIC', value: 'ceramic' },
          { label: 'BOROSILICATE GLASS', value: 'glass' },
          { label: 'STONEWARE', value: 'stoneware' },
        ],
      },
      {
        id: 'capacity',
        label: 'CAPACITY',
        type: 'chips',
        options: [
          { label: 'ALL SIZES', value: '' },
          { label: '11 OZ', value: '11 oz' },
          { label: '12 OZ', value: '12 oz' },
          { label: '14+ OZ', value: '14 oz' },
        ],
      },
      {
        id: 'colorName',
        label: 'FINISH',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'MATTE BLACK', value: 'black' },
          { label: 'IVORY', value: 'ivory' },
          { label: 'GOLD ACCENT', value: 'gold' },
        ],
      },
    ],
    decorations: ['circular-pedestals', 'amber-niche-lighting', 'marble-display-islands'],
  },

  pens: {
    slug: 'pens',
    title: 'PENS',
    subline: 'PERSONALIZED WRITING INSTRUMENTS',
    moodTitle: 'LUXURY WRITING LOUNGE',
    ambianceDescription: 'Rich American walnut paneling, glass vitrines with brushed brass frames, cognac leather pads, and focused pin-spots.',
    palette: {
      wallColor: '#12100E',
      floorColor: '#0E0D0B', // Rich dark marble with walnut inlay
      trimColor: '#C8A86B',
      accentColor: '#D4AF37',
      woodColor: '#3A271B', // Rich American Walnut
      ambientLightColor: '#F5E6D3',
      keySpotlightColor: '#FFF5E6',
      rimLightColor: '#D4AF37',
    },
    lighting: {
      ambientIntensity: 0.65,
      spotIntensity: 3.2,
      rimIntensity: 2.0,
      shadowSoftness: 0.2,
    },
    heroDisplay: {
      type: 'vitrine-island',
      heroTitle: 'MONUMENTAL GLASS & WALNUT VITRINE',
      pedestalMaterial: 'dark-walnut',
      rotationSpeed: 0.15,
    },
    productDisplayStyle: 'glass-vitrines',
    filterGroups: [
      {
        id: 'penStyle',
        label: 'INSTRUMENT TYPE',
        type: 'chips',
        options: [
          { label: 'ALL TYPES', value: '' },
          { label: 'FOUNTAIN', value: 'fountain' },
          { label: 'ROLLERBALL', value: 'rollerball' },
          { label: 'BALLPOINT', value: 'ballpoint' },
        ],
      },
      {
        id: 'material',
        label: 'BODY MATERIAL',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'BRUSHED BRASS', value: 'brass' },
          { label: 'AMERICAN WALNUT', value: 'walnut' },
          { label: 'TITANIUM', value: 'titanium' },
          { label: 'DAMASCUS STEEL', value: 'steel' },
        ],
      },
      {
        id: 'inkColor',
        label: 'INK TONE',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'BLACK', value: 'black' },
          { label: 'BLUE', value: 'blue' },
          { label: 'SEPIA', value: 'sepia' },
        ],
      },
    ],
    decorations: ['walnut-cabinetry', 'glass-cases', 'leather-display-trays', 'brass-rests'],
  },

  frames: {
    slug: 'frames',
    title: 'PHOTO FRAMES',
    subline: 'MEMORIES, FRAMED',
    moodTitle: 'REFINED ART GALLERY',
    ambianceDescription: 'Museum ivory gallery walls, walnut consoles, framed artwork compositions, and overhead architectural gallery spotlights.',
    palette: {
      wallColor: '#171615',
      floorColor: '#121110', // Light terrazzo and dark marble borders
      trimColor: '#C8A86B',
      accentColor: '#D4AF37',
      woodColor: '#362417',
      ambientLightColor: '#F7EFE5',
      keySpotlightColor: '#FFFFFF',
      rimLightColor: '#D4AF37',
    },
    lighting: {
      ambientIntensity: 0.8,
      spotIntensity: 2.8,
      rimIntensity: 1.5,
      shadowSoftness: 0.35,
    },
    heroDisplay: {
      type: 'gallery-feature-wall',
      heroTitle: 'GALLERY APEX DISPLAY',
      pedestalMaterial: 'nero-marquina',
      rotationSpeed: 0.08,
    },
    productDisplayStyle: 'art-consoles',
    filterGroups: [
      {
        id: 'orientation',
        label: 'ORIENTATION',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'PORTRAIT', value: 'portrait' },
          { label: 'LANDSCAPE', value: 'landscape' },
          { label: 'SQUARE', value: 'square' },
        ],
      },
      {
        id: 'material',
        label: 'FRAME MATERIAL',
        type: 'chips',
        options: [
          { label: 'ALL', value: '' },
          { label: 'SOLID WALNUT', value: 'walnut' },
          { label: 'BRUSHED METAL', value: 'metal' },
          { label: 'CHAMPAGNE GOLD', value: 'gold' },
        ],
      },
    ],
    decorations: ['ivory-gallery-walls', 'walnut-consoles', 'spotlight-tracks', 'leaning-frames'],
  },

  default: {
    slug: 'default',
    title: 'MW ATELIER',
    subline: 'CURATED LUXURY EDITIONS',
    moodTitle: 'SIGNATURE MW BOUTIQUE',
    ambianceDescription: 'Signature champagne gold accents, Nero Marquina plinths, and warm directional lighting.',
    palette: {
      wallColor: '#151413',
      floorColor: '#121110',
      trimColor: '#C8A86B',
      accentColor: '#D4AF37',
      ambientLightColor: '#F7EFE5',
      keySpotlightColor: '#FFF8EB',
      rimLightColor: '#D4AF37',
    },
    lighting: {
      ambientIntensity: 0.7,
      spotIntensity: 2.8,
      rimIntensity: 1.5,
      shadowSoftness: 0.3,
    },
    heroDisplay: {
      type: 'luxury-plinth',
      heroTitle: 'HERO SHOWCASE PLINTH',
      pedestalMaterial: 'nero-marquina',
      rotationSpeed: 0.15,
    },
    productDisplayStyle: 'modern-plinths',
    filterGroups: [],
    decorations: ['minimal-plinths', 'brand-accent-wall'],
  },
};

export function getShopTheme(slugOrCategory: string): CategoryInteriorProfile {
  const norm = (slugOrCategory || '').toLowerCase().trim();
  if (SHOP_THEMES[norm]) {
    return SHOP_THEMES[norm];
  }
  // Secondary mappings
  if (norm === 'apparel' || norm === 'hoodies') return SHOP_THEMES.shirts;
  if (norm === 'objects' || norm === 'ceramics') return SHOP_THEMES.mugs;
  if (norm === 'prints') return SHOP_THEMES.frames;
  return SHOP_THEMES.default;
}
