import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, ProductSize } from '../data/mockCatalog';
import { DesignElement } from './useCustomizerStore';

export interface CartItem {
  id: string; // Unique composite ID (productId-variantId-sizeId-customizationId)
  product: Product;
  variant: ProductVariant | null;
  size: ProductSize | null;
  quantity: number;
  price: number;
  designConfig?: DesignElement[]; // Preserves Phase 4 Custom Lab state
  addedAt: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  size: ProductSize | null;
  designConfig?: DesignElement[];
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  savedItems: WishlistItem[];
  recentlyRemoved: CartItem | null;
  isMiniCartOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'addedAt' | 'price' | 'quantity'> & { priceOverride?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  saveForLater: (id: string) => void;
  moveToBag: (id: string) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  addToVault: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromVault: (id: string) => void;
  
  // UI Actions
  setMiniCartOpen: (isOpen: boolean) => void;
}

// Helper to generate unique ID
const generateItemId = (product: Product, variant: ProductVariant | null, size: ProductSize | null, isCustom: boolean) => {
  return `${product.slug}-${variant?.id || 'base'}-${size?.id || 'nosize'}-${isCustom ? Math.random().toString(36).substr(2, 9) : 'standard'}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      recentlyRemoved: null,
      isMiniCartOpen: false,

      addItem: (item) => {
        set((state) => {
          const isCustom = !!item.designConfig && item.designConfig.length > 0;
          const id = generateItemId(item.product, item.variant, item.size, isCustom);
          
          // Determine Price
          let basePrice = parseInt(item.product.price.replace(/\D/g, ''));
          if (isCustom) basePrice += 499; // Custom Print premium
          if (item.priceOverride) basePrice = item.priceOverride;

          // If standard item already exists, just bump quantity
          if (!isCustom) {
            const existing = state.items.find(i => i.product.slug === item.product.slug && i.variant?.id === item.variant?.id && i.size?.id === item.size?.id && !i.designConfig);
            if (existing) {
              return {
                items: state.items.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i),
                isMiniCartOpen: true
              };
            }
          }

          // Otherwise add new item
          const newItem: CartItem = {
            ...item,
            id,
            quantity: 1,
            price: basePrice,
            addedAt: Date.now()
          };

          return { items: [...state.items, newItem], isMiniCartOpen: true };
        });
      },

      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity > 0 
          ? state.items.map(i => i.id === id ? { ...i, quantity } : i)
          : state.items // Remove should be handled by removeItem
      })),

      removeItem: (id) => set((state) => {
        const itemToRemove = state.items.find(i => i.id === id);
        return {
          items: state.items.filter(i => i.id !== id),
          recentlyRemoved: itemToRemove || null
        };
      }),

      undoRemove: () => set((state) => {
        if (!state.recentlyRemoved) return state;
        return {
          items: [...state.items, state.recentlyRemoved],
          recentlyRemoved: null
        };
      }),

      saveForLater: (id) => set((state) => {
        const item = state.items.find(i => i.id === id);
        if (!item) return state;
        
        const vaultItem: WishlistItem = {
          id: item.id,
          product: item.product,
          variant: item.variant,
          size: item.size,
          designConfig: item.designConfig,
          addedAt: Date.now()
        };

        return {
          items: state.items.filter(i => i.id !== id),
          savedItems: [...state.savedItems, vaultItem]
        };
      }),

      moveToBag: (id) => set((state) => {
        const vaultItem = state.savedItems.find(i => i.id === id);
        if (!vaultItem) return state;

        get().addItem({
          product: vaultItem.product,
          variant: vaultItem.variant,
          size: vaultItem.size,
          designConfig: vaultItem.designConfig
        });

        return {
          savedItems: state.savedItems.filter(i => i.id !== id)
        };
      }),

      clearCart: () => set({ items: [] }),

      addToVault: (item) => set((state) => {
        const isCustom = !!item.designConfig && item.designConfig.length > 0;
        const id = generateItemId(item.product, item.variant, item.size, isCustom);
        return {
          savedItems: [...state.savedItems, { ...item, id, addedAt: Date.now() }]
        };
      }),

      removeFromVault: (id) => set((state) => ({
        savedItems: state.savedItems.filter(i => i.id !== id)
      })),

      setMiniCartOpen: (isOpen) => set({ isMiniCartOpen: isOpen }),

    }),
    {
      name: 'mw-cart-storage',
      // Optionally omit UI state from persistence
      partialize: (state) => ({ items: state.items, savedItems: state.savedItems }),
    }
  )
);
