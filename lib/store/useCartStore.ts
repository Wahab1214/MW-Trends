import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant, ProductSize } from '../data/mockCatalog';
import type { DesignElement } from './useCustomizerStore';

export interface CartCustomization {
  customText?: string;
  font?: string;
  placement?: string;
  printSide?: string;
  orientation?: string;
  photoUrl?: string;
  photoName?: string;
  giftBox?: boolean;
  giftNote?: string;
  surcharge?: number;
  summary?: string[];
}

export interface CartItem {
  id: string; // Unique composite ID
  product: Product;
  variant: ProductVariant | null;
  size: ProductSize | null;
  quantity: number;
  basePrice: number;
  surcharge: number;
  price: number; // total unit price (basePrice + surcharge)
  customization?: CartCustomization;
  designConfig?: DesignElement[]; // Preserves Phase 4 Custom Lab state
  addedAt: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  size: ProductSize | null;
  customization?: CartCustomization;
  designConfig?: DesignElement[];
  addedAt: number;
}

export interface AddItemInput {
  product: Product;
  variant?: ProductVariant | null;
  size?: ProductSize | null;
  quantity?: number;
  customization?: CartCustomization | null;
  designConfig?: DesignElement[];
  priceOverride?: number;
}

interface CartState {
  items: CartItem[];
  savedItems: WishlistItem[];
  recentlyRemoved: CartItem | null;
  isMiniCartOpen: boolean;
  
  // Cart Actions
  addItem: (item: AddItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  saveForLater: (id: string) => void;
  moveToBag: (id: string) => void;
  clearCart: () => void;
  
  // Vault / Wishlist Actions
  isInVault: (productId: string) => boolean;
  toggleVault: (product: Product, variant?: ProductVariant | null, size?: ProductSize | null) => void;
  addToVault: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromVault: (id: string) => void;
  
  // UI Actions
  setMiniCartOpen: (isOpen: boolean) => void;
}

// ===========================================================================
// DETERMINISTIC LINE-ITEM IDENTITY BUILDER
// ===========================================================================
export const generateCartItemId = (
  product: Product,
  variant: ProductVariant | null = null,
  size: ProductSize | null = null,
  customization?: CartCustomization | null,
  designConfig?: DesignElement[] | null
): string => {
  const slug = product.slug;
  const vId = variant?.id || 'standard';
  const sId = size?.id || 'onesize';

  // If Phase 4 Custom Lab canvas elements exist (canvas editor)
  if (designConfig && designConfig.length > 0) {
    return `${slug}-${vId}-${sId}-lab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }

  // If Phase 5 structured category customization exists
  if (
    customization &&
    (customization.customText ||
      customization.font ||
      customization.placement ||
      customization.printSide ||
      customization.orientation ||
      customization.giftBox ||
      customization.photoName)
  ) {
    const customKey = [
      (customization.customText || '').trim().toLowerCase(),
      customization.font || '',
      customization.placement || '',
      customization.printSide || '',
      customization.orientation || '',
      customization.giftBox ? 'gift' : '',
      customization.photoName || ''
    ].join('~');

    return `${slug}-${vId}-${sId}-c:${customKey}`;
  }

  return `${slug}-${vId}-${sId}-standard`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      recentlyRemoved: null,
      isMiniCartOpen: false,

      addItem: (input) => {
        set((state) => {
          const product = input.product;
          const variant = input.variant || null;
          const size = input.size || null;
          const quantityToAdd = input.quantity && input.quantity > 0 ? input.quantity : 1;
          const customization = input.customization || undefined;
          const designConfig = input.designConfig || undefined;

          // Compute Authoritative Unit Price
          const basePrice = input.priceOverride ?? product.numericPrice;
          let surcharge = customization?.surcharge || 0;
          if (designConfig && designConfig.length > 0) {
            surcharge += 499; // Phase 4 custom lab premium
          }
          const totalUnitPrice = basePrice + surcharge;

          // Generate composite deterministic key
          const id = generateCartItemId(product, variant, size, customization, designConfig);

          // Check if identical line-item already exists in cart
          const existingIndex = state.items.findIndex((item) => item.id === id);

          let updatedItems: CartItem[];
          if (existingIndex > -1) {
            // MERGE RULE: Only merge quantities when product, variant, size AND customization are 100% identical
            updatedItems = state.items.map((item, idx) =>
              idx === existingIndex
                ? {
                    ...item,
                    quantity: Math.min(10, item.quantity + quantityToAdd),
                    price: totalUnitPrice
                  }
                : item
            );
          } else {
            // NEW DISTINCT LINE ITEM
            const newItem: CartItem = {
              id,
              product,
              variant,
              size,
              quantity: quantityToAdd,
              basePrice,
              surcharge,
              price: totalUnitPrice,
              customization,
              designConfig,
              addedAt: Date.now()
            };
            updatedItems = [...state.items, newItem];
          }

          return {
            items: updatedItems,
            isMiniCartOpen: true
          };
        });
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((i) =>
                  i.id === id ? { ...i, quantity: Math.min(10, quantity) } : i
                )
              : state.items
        })),

      removeItem: (id) =>
        set((state) => {
          const itemToRemove = state.items.find((i) => i.id === id);
          return {
            items: state.items.filter((i) => i.id !== id),
            recentlyRemoved: itemToRemove || null
          };
        }),

      undoRemove: () =>
        set((state) => {
          if (!state.recentlyRemoved) return state;
          return {
            items: [...state.items, state.recentlyRemoved],
            recentlyRemoved: null
          };
        }),

      saveForLater: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const vaultItem: WishlistItem = {
            id: item.id,
            product: item.product,
            variant: item.variant,
            size: item.size,
            customization: item.customization,
            designConfig: item.designConfig,
            addedAt: Date.now()
          };

          return {
            items: state.items.filter((i) => i.id !== id),
            savedItems: [...state.savedItems, vaultItem]
          };
        }),

      moveToBag: (id) => {
        const vaultItem = get().savedItems.find((i) => i.id === id);
        if (!vaultItem) return;

        get().addItem({
          product: vaultItem.product,
          variant: vaultItem.variant,
          size: vaultItem.size,
          customization: vaultItem.customization,
          designConfig: vaultItem.designConfig
        });

        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.id !== id)
        }));
      },

      clearCart: () => set({ items: [] }),

      isInVault: (productId) => {
        return get().savedItems.some((item) => item.product.id === productId || item.product.slug === productId);
      },

      toggleVault: (product, variant = null, size = null) => {
        const isIn = get().isInVault(product.id) || get().isInVault(product.slug);
        if (isIn) {
          set((state) => ({
            savedItems: state.savedItems.filter(
              (i) => i.product.id !== product.id && i.product.slug !== product.slug
            )
          }));
        } else {
          const id = generateCartItemId(product, variant, size);
          set((state) => ({
            savedItems: [
              ...state.savedItems,
              {
                id,
                product,
                variant,
                size,
                addedAt: Date.now()
              }
            ]
          }));
        }
      },

      addToVault: (item) =>
        set((state) => {
          const id = generateCartItemId(
            item.product,
            item.variant,
            item.size,
            item.customization,
            item.designConfig
          );
          return {
            savedItems: [...state.savedItems, { ...item, id, addedAt: Date.now() }]
          };
        }),

      removeFromVault: (id) =>
        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.id !== id)
        })),

      setMiniCartOpen: (isOpen) => set({ isMiniCartOpen: isOpen })
    }),
    {
      name: 'mw-cart-storage',
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems
      })
    }
  )
);
