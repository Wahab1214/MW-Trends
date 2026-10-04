import { create } from 'zustand';
import { Product } from '@/lib/data/mockCatalog';

type ViewMode = 'world' | 'quick-shop';
type ActiveShop = 'plaza' | 'tee-studio' | 'mug-bar' | 'custom-lab';

interface AppState {
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;
  
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  
  activeShop: ActiveShop;
  setActiveShop: (shop: ActiveShop) => void;
  
  focusedProduct: Product | null;
  setFocusedProduct: (product: Product | null) => void;
  
  quickShopCategory: string | null;
  setQuickShopCategory: (category: string | null) => void;
  
  isMapOpen: boolean;
  setMapOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  hasEntered: false,
  setHasEntered: (hasEntered) => set({ hasEntered }),
  
  mode: 'world',
  setMode: (mode) => set({ mode }),
  
  activeShop: 'plaza',
  setActiveShop: (shop) => set({ activeShop: shop }),
  
  focusedProduct: null,
  setFocusedProduct: (product) => set({ focusedProduct: product }),
  
  quickShopCategory: null,
  setQuickShopCategory: (category) => set({ quickShopCategory: category }),
  
  isMapOpen: false,
  setMapOpen: (isOpen) => set({ isMapOpen: isOpen })
}));
