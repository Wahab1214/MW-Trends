import { adminService } from "./adminService";

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'ARCHIVED';

export type PlacementId = 
  | 'home.hero' 
  | 'home.editorial' 
  | 'shop.hero' 
  | 'plaza.billboard.a' 
  | 'plaza.billboard.b' 
  | 'plaza.livingPoster'
  | 'teeStudio.window'
  | 'street.banner';

export interface CampaignCreative {
  desktopMedia?: string;
  mobileMedia?: string;
  videoUrl?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
}

export interface Campaign {
  id: string;
  name: string;
  internalCode: string;
  type: string;
  status: CampaignStatus;
  startAt: number;
  endAt: number;
  priority: number; // Higher number = higher priority
  placements: PlacementId[];
  creative: CampaignCreative;
  targetUrl: string;
}

// ---------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------
let mockCampaigns: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'MIDNIGHT / 01',
    internalCode: 'MIDNIGHT-DROP',
    type: 'PRODUCT_DROP',
    status: 'ACTIVE',
    startAt: Date.now() - 86400000, // Started yesterday
    endAt: Date.now() + 86400000 * 7, // Ends in 7 days
    priority: 100,
    placements: ['home.hero', 'plaza.billboard.a', 'teeStudio.window', 'plaza.livingPoster'],
    creative: {
      desktopMedia: '/models/textures/midnight_hero.jpg',
      headline: 'MIDNIGHT SERIES',
      subheadline: 'OWN THE NIGHT.',
      ctaText: 'EXPLORE DROP'
    },
    targetUrl: '/collections/midnight-series'
  },
  {
    id: 'cmp_2',
    name: 'MAKE IT YOURS',
    internalCode: 'CUSTOM-LAB-EVERGREEN',
    type: 'EVERGREEN',
    status: 'ACTIVE',
    startAt: Date.now() - 86400000 * 30,
    endAt: Date.now() + 86400000 * 365,
    priority: 10,
    placements: ['plaza.billboard.b', 'shop.hero'],
    creative: {
      desktopMedia: '/models/textures/custom_lab_ad.jpg',
      headline: 'MAKE IT YOURS',
      subheadline: 'The MW Custom Lab is Open.',
      ctaText: 'CUSTOMIZE NOW'
    },
    targetUrl: '/customize'
  },
  {
    id: 'cmp_3',
    name: 'EID GIFT EDIT',
    internalCode: 'EID26-GIFTS',
    type: 'SEASONAL',
    status: 'SCHEDULED',
    startAt: Date.now() + 86400000 * 14, // Starts in 14 days
    endAt: Date.now() + 86400000 * 20,
    priority: 200, // Will override Midnight Drop when active
    placements: ['home.hero', 'plaza.billboard.a'],
    creative: {
      headline: 'THE EID EDIT',
      ctaText: 'SHOP GIFTS'
    },
    targetUrl: '/collections/gifts'
  }
];

const CAMPAIGNS_KEY = 'mw_admin_campaigns';

const getStoredCampaigns = (): Campaign[] => {
  if (typeof window === 'undefined') return mockCampaigns;
  const stored = localStorage.getItem(CAMPAIGNS_KEY);
  if (!stored) {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(mockCampaigns));
    return mockCampaigns;
  }
  return JSON.parse(stored);
};

const saveCampaigns = (campaigns: Campaign[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }
};

// ---------------------------------------------------------
// SERVICE LAYER
// ---------------------------------------------------------
export const campaignService = {
  getAllCampaigns: async (): Promise<Campaign[]> => {
    await new Promise(r => setTimeout(r, 200));
    return getStoredCampaigns().sort((a, b) => b.startAt - a.startAt);
  },

  getCampaign: async (id: string): Promise<Campaign | null> => {
    const campaigns = getStoredCampaigns();
    return campaigns.find(c => c.id === id) || null;
  },

  createCampaign: async (data: Omit<Campaign, 'id'>): Promise<Campaign> => {
    const campaigns = getStoredCampaigns();
    const newCampaign: Campaign = {
      ...data,
      id: `cmp_${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Conflict detection logic
    const conflicts = campaignService.checkConflictsLocal(campaigns, newCampaign);
    if (conflicts.length > 0) {
      console.warn("Conflicts detected:", conflicts);
      // We allow it to save, but warnings should be shown in UI.
    }

    campaigns.push(newCampaign);
    saveCampaigns(campaigns);
    
    adminService.logAction('CAMPAIGN_CREATED', 'Campaign', newCampaign.id, `Created ${newCampaign.internalCode}`);
    return newCampaign;
  },

  updateCampaignStatus: async (id: string, newStatus: CampaignStatus): Promise<void> => {
    const campaigns = getStoredCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return;

    campaigns[index].status = newStatus;
    saveCampaigns(campaigns);
    adminService.logAction('CAMPAIGN_STATUS_CHANGE', 'Campaign', id, `Status updated to ${newStatus}`);
  },

  checkConflictsLocal: (existing: Campaign[], newCamp: Campaign) => {
    const conflicts: string[] = [];
    existing.forEach(c => {
      if (c.id === newCamp.id || c.status === 'ARCHIVED' || c.status === 'ENDED') return;
      
      // Check time overlap
      const timeOverlap = (newCamp.startAt <= c.endAt) && (newCamp.endAt >= c.startAt);
      if (timeOverlap) {
        // Check placement overlap
        const sharedPlacements = newCamp.placements.filter(p => c.placements.includes(p));
        if (sharedPlacements.length > 0) {
          conflicts.push(`Overlaps with "${c.name}" on placements: ${sharedPlacements.join(', ')}`);
        }
      }
    });
    return conflicts;
  },

  // Storefront Hook Method: Resolves the currently active creative for a slot.
  resolvePlacement: async (placementId: PlacementId): Promise<Campaign | null> => {
    const campaigns = getStoredCampaigns();
    const now = Date.now();

    // 1. Filter active campaigns that include this placement
    const eligible = campaigns.filter(c => 
      c.status === 'ACTIVE' &&
      now >= c.startAt &&
      now <= c.endAt &&
      c.placements.includes(placementId)
    );

    if (eligible.length === 0) return null;

    // 2. Sort by priority descending
    eligible.sort((a, b) => b.priority - a.priority);

    // 3. Return the winner
    return eligible[0];
  }
};
