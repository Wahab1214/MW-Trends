import { create } from 'zustand';
import { Product } from '@/lib/data/mockCatalog';
import { BuildingCategory, DEFAULT_BUILDING_CATEGORIES } from '@/lib/data/buildingCategories';

type ViewMode = 'world' | 'quick-shop';
export type FloorTransitionState = 'idle' | 'leaving' | 'ascending' | 'arriving';

interface AppState {
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;
  
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  
  // Floor navigation
  currentFloor: number;
  setCurrentFloor: (floor: number) => void;
  isFloorTransitioning: boolean;
  setIsFloorTransitioning: (transitioning: boolean) => void;
  floorTransitionState: FloorTransitionState;
  setFloorTransitionState: (state: FloorTransitionState) => void;
  
  // Stair ascending animation state
  isStairsAscending: boolean;
  setIsStairsAscending: (isAscending: boolean) => void;
  
  // Shop and category focus & door opening
  activeShop: string | null;
  setActiveShop: (shop: string | null) => void;
  enteringShopSlug: string | null;
  setEnteringShopSlug: (slug: string | null) => void;
  lastVisitedShop: { slug: string; floor: number } | null;
  setLastVisitedShop: (shop: { slug: string; floor: number } | null) => void;
  
  selectedMobileSlot: number | null; // 0: Left-Front, 1: Left-Rear, 2: Right-Front, 3: Right-Rear
  setSelectedMobileSlot: (slot: number | null) => void;
  
  focusedProduct: Product | null;
  setFocusedProduct: (product: Product | null) => void;
  
  quickShopCategory: string | null;
  setQuickShopCategory: (category: string | null) => void;
  
  isMapOpen: boolean;
  setMapOpen: (isOpen: boolean) => void;

  // Dynamic admin-driven categories catalog
  categories: BuildingCategory[];
  setCategories: (categories: BuildingCategory[]) => void;
  addCategory: (category: BuildingCategory) => void;
  updateCategory: (id: string, updates: Partial<BuildingCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryActive: (id: string) => void;
  reorderCategory: (id: string, newSortOrder: number) => void;

  // QA testing override for dynamic category counts (e.g. 0, 4, 5, 8, 9, 12, 13)
  categoryCountOverride: number | null;
  setCategoryCountOverride: (count: number | null) => void;
}

export const useStore = create<AppState>((set) => ({
  hasEntered: false,
  setHasEntered: (hasEntered) => set({ hasEntered }),
  
  mode: 'world',
  setMode: (mode) => set({ mode }),
  
  currentFloor: 1,
  setCurrentFloor: (floor) => set({ currentFloor: Math.max(1, floor) }),
  isFloorTransitioning: false,
  setIsFloorTransitioning: (isFloorTransitioning) => set({ isFloorTransitioning }),
  floorTransitionState: 'idle',
  setFloorTransitionState: (floorTransitionState) => set({ floorTransitionState }),
  
  isStairsAscending: false,
  setIsStairsAscending: (isStairsAscending) => set({ isStairsAscending }),
  
  activeShop: null,
  setActiveShop: (shop) => set({ activeShop: shop }),
  enteringShopSlug: null,
  setEnteringShopSlug: (slug) => set({ enteringShopSlug: slug }),
  lastVisitedShop: null,
  setLastVisitedShop: (lastVisitedShop) => set({ lastVisitedShop }),
  
  selectedMobileSlot: null,
  setSelectedMobileSlot: (slot) => set({ selectedMobileSlot: slot }),
  
  focusedProduct: null,
  setFocusedProduct: (product) => set({ focusedProduct: product }),
  
  quickShopCategory: null,
  setQuickShopCategory: (category) => set({ quickShopCategory: category }),
  
  isMapOpen: false,
  setMapOpen: (isOpen) => set({ isMapOpen: isOpen }),

  // Dynamic admin-driven categories catalog
  categories: DEFAULT_BUILDING_CATEGORIES,
  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  toggleCategoryActive: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c
      ),
    })),
  reorderCategory: (id, newSortOrder) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, sortOrder: newSortOrder } : c
      ),
    })),

  categoryCountOverride: null,
  setCategoryCountOverride: (count) => set({ categoryCountOverride: count }),
}));
