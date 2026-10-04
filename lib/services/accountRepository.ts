export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  isDefault: boolean;
}

export interface SavedDesign {
  id: string;
  name: string;
  productId: string;
  productName: string;
  variantId: string;
  status: 'DRAFT' | 'READY' | 'ORDERED';
  lastUpdated: number;
  designConfig: any[]; // The canvas elements
}

const ADDRESS_KEY = 'mw_mock_addresses';
const DESIGN_KEY = 'mw_mock_designs';

const seedDemoAddresses = (): SavedAddress[] => [
  { id: 'addr_1', label: 'Home', fullName: 'Ahmed Khan', phone: '03001234567', addressLine1: '123 Defense Phase 6', city: 'Lahore', province: 'Punjab', isDefault: true },
  { id: 'addr_2', label: 'Office', fullName: 'Ahmed Khan', phone: '03001234567', addressLine1: 'Gulberg Galleria, Main Blvd', city: 'Lahore', province: 'Punjab', isDefault: false }
];

const seedDemoDesigns = (): SavedDesign[] => [
  {
    id: 'design_demo1',
    name: 'Midnight Story Tee',
    productId: 'midnight-oversized-tee',
    productName: 'Midnight Oversized Tee',
    variantId: 'graphite',
    status: 'ORDERED',
    lastUpdated: Date.now() - 86400000,
    designConfig: [{ id: '1', type: 'text', content: 'ARCHIVE', x: 50, y: 30, scale: 1.5, fill: '#FFFFFF', font: 'sans-serif' }]
  },
  {
    id: 'design_demo2',
    name: 'Birthday Mug',
    productId: 'signature-mug',
    productName: 'Signature Mug',
    variantId: 'bone',
    status: 'DRAFT',
    lastUpdated: Date.now() - 172800000,
    designConfig: [{ id: '1', type: 'text', content: 'HBD', x: 50, y: 50, scale: 2, fill: '#111111', font: 'serif' }]
  }
];

export const accountRepository = {
  getAddresses: async (): Promise<SavedAddress[]> => {
    if (typeof window === 'undefined') return [];
    let data = localStorage.getItem(ADDRESS_KEY);
    if (!data) {
      const demo = seedDemoAddresses();
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(data);
  },

  getDesigns: async (): Promise<SavedDesign[]> => {
    if (typeof window === 'undefined') return [];
    let data = localStorage.getItem(DESIGN_KEY);
    if (!data) {
      const demo = seedDemoDesigns();
      localStorage.setItem(DESIGN_KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(data);
  },

  getDesign: async (id: string): Promise<SavedDesign | null> => {
    const designs = await accountRepository.getDesigns();
    return designs.find(d => d.id === id) || null;
  },

  duplicateDesign: async (id: string): Promise<SavedDesign | null> => {
    const designs = await accountRepository.getDesigns();
    const original = designs.find(d => d.id === id);
    if (!original) return null;

    const duplicate: SavedDesign = {
      ...original,
      id: `design_${Math.random().toString(36).substring(2, 9)}`,
      name: `${original.name} (Copy)`,
      status: 'DRAFT',
      lastUpdated: Date.now(),
      designConfig: JSON.parse(JSON.stringify(original.designConfig))
    };

    localStorage.setItem(DESIGN_KEY, JSON.stringify([duplicate, ...designs]));
    return duplicate;
  },

  deleteDesign: async (id: string): Promise<void> => {
    const designs = await accountRepository.getDesigns();
    localStorage.setItem(DESIGN_KEY, JSON.stringify(designs.filter(d => d.id !== id)));
  }
};
