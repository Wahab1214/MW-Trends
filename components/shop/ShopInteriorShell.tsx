"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Product,
  getProductsByCategory,
  filterAndSortProducts,
  FilterOptions,
} from "@/lib/data/mockCatalog";
import { getShopTheme, CategoryInteriorProfile } from "@/lib/data/shopThemes";
import { useStore } from "@/lib/store/useStore";
import { analytics } from "@/lib/analytics/eventBus";
import ShopInterior3D from "./ShopInterior3D";
import ShopInteriorUI from "./ShopInteriorUI";

interface ShopInteriorShellProps {
  initialShopSlug?: string;
  initialFloor?: number;
}

export default function ShopInteriorShell({
  initialShopSlug = "shirts",
  initialFloor = 1,
}: ShopInteriorShellProps) {
  const router = useRouter();
  const {
    currentFloor,
    setCurrentFloor,
    setHasEntered,
    setMode,
    setActiveShop,
    setLastVisitedShop,
  } = useStore();

  const shopSlug = (initialShopSlug || "shirts").toLowerCase();
  const floorNumber = initialFloor || currentFloor || 1;

  // Resolve Category Theme Profile
  const theme: CategoryInteriorProfile = useMemo(() => {
    return getShopTheme(shopSlug);
  }, [shopSlug]);

  // Filter & Sort State
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: "",
    sortBy: "featured",
  });
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>("all");

  // Hero Focus & Hover States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  // Transition & Ready State
  const [isReady, setIsReady] = useState(false);

  // Ensure state consistency on mount
  useEffect(() => {
    setHasEntered(true);
    setCurrentFloor(floorNumber);
    setActiveShop(shopSlug);
    setLastVisitedShop({ slug: shopSlug, floor: floorNumber });

    // Analytics hook
    analytics.track("shop_enter", {
      shop: shopSlug,
      floor: floorNumber,
      categoryTitle: theme.title,
    });

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [shopSlug, floorNumber, setHasEntered, setCurrentFloor, setActiveShop, setLastVisitedShop, theme.title]);

  // Query catalog for this category
  const baseProducts = useMemo(() => {
    return getProductsByCategory(shopSlug);
  }, [shopSlug]);

  // Apply tab filtration
  const tabFilteredProducts = useMemo(() => {
    if (activeCollectionTab === "bestsellers") {
      return baseProducts.filter((p) => p.isBestSeller);
    }
    if (activeCollectionTab === "new") {
      return baseProducts.filter((p) => p.isNew);
    }
    if (activeCollectionTab === "customizable") {
      return baseProducts.filter((p) => p.isCustomizable);
    }
    return baseProducts;
  }, [baseProducts, activeCollectionTab]);

  // Apply search, filters & sort
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(tabFilteredProducts, filterOptions);
  }, [tabFilteredProducts, filterOptions]);

  // Enforce first-view batch size constraint: 6–8 visible products maximum
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, 7);
  }, [filteredProducts]);

  // Handle Product Selection (Hero Focus Mode)
  const handleSelectProduct = (product: Product | null) => {
    setSelectedProduct(product);
    if (product) {
      analytics.track("product_focus", {
        slug: product.slug,
        name: product.name,
        price: product.price,
        category: shopSlug,
      });
    }
  };

  // Handle Product Hover
  const handleHoverProduct = (product: Product | null) => {
    setHoveredProduct(product);
    if (product) {
      analytics.track("product_impression", {
        slug: product.slug,
        category: shopSlug,
      });
    }
  };

  // Handle Return to Floor
  const handleReturnToFloor = () => {
    analytics.track("shop_exit", {
      shop: shopSlug,
      floor: floorNumber,
    });

    setMode("world");
    setActiveShop(shopSlug);
    // Keep shop context briefly for camera return proximity
    setTimeout(() => {
      setActiveShop(null);
    }, 1200);

    router.push(`/?floor=${floorNumber}`);
  };

  // Handle Filter Change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    analytics.track("filter_apply", {
      shop: shopSlug,
      hasSearch: Boolean(newFilters.searchQuery),
      sortBy: newFilters.sortBy,
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0D0C0B] select-none">
      {/* 1. Cinematic Shop Entrance Curtain (~500ms) */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-[#0A0908] flex flex-col items-center justify-center text-center pointer-events-auto"
          >
            <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] mb-3 uppercase font-bold">
              ENTERING ATELIER
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.25em] text-[#F7F4ED] uppercase">
              {theme.title}
            </h1>
            <div className="w-16 h-[1px] bg-[#D4AF37]/50 mt-4 mb-2 animate-pulse" />
            <span className="text-[9px] tracking-[0.2em] text-[#A3998C] uppercase">
              {theme.moodTitle}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 3D Shop Boutique Scene */}
      <ShopInterior3D
        categorySlug={shopSlug}
        products={visibleProducts}
        selectedProduct={selectedProduct}
        onSelectProduct={handleSelectProduct}
        onHoverProduct={handleHoverProduct}
        onDismissSelection={() => setSelectedProduct(null)}
      />

      {/* 3. Luxury 2D UI Layer */}
      <ShopInteriorUI
        categorySlug={shopSlug}
        theme={theme}
        floorNumber={floorNumber}
        products={visibleProducts}
        selectedProduct={selectedProduct}
        hoveredProduct={hoveredProduct}
        filterOptions={filterOptions}
        activeCollectionTab={activeCollectionTab}
        onSelectProduct={handleSelectProduct}
        onFilterChange={handleFilterChange}
        onTabChange={setActiveCollectionTab}
        onReturnToFloor={handleReturnToFloor}
      />
    </div>
  );
}
