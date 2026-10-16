"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant, FilterOptions } from "@/lib/data/mockCatalog";
import { CategoryInteriorProfile } from "@/lib/data/shopThemes";
import { useStore } from "@/lib/store/useStore";
import { useCartStore } from "@/lib/store/useCartStore";
import AddToCartSequence from "@/components/shop/AddToCartSequence";

interface ShopInteriorUIProps {
  categorySlug: string;
  theme: CategoryInteriorProfile;
  floorNumber: number;
  products: Product[];
  selectedProduct: Product | null;
  hoveredProduct: Product | null;
  filterOptions: FilterOptions;
  activeCollectionTab: string;
  onSelectProduct: (product: Product | null) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onTabChange: (tab: string) => void;
  onReturnToFloor: () => void;
}

export default function ShopInteriorUI({
  categorySlug,
  theme,
  floorNumber,
  products,
  selectedProduct,
  hoveredProduct,
  filterOptions,
  activeCollectionTab,
  onSelectProduct,
  onFilterChange,
  onTabChange,
  onReturnToFloor,
}: ShopInteriorUIProps) {
  const { setMiniCartOpen, addItem, items: cartItems, savedItems } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = savedItems ? savedItems.length : 0;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filterOptions.searchQuery || "");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  // Synchronize variant when selected product changes
  useEffect(() => {
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedProduct]);

  // Global ESC key listener to close focus mode or filter drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFilterOpen) {
          setIsFilterOpen(false);
        } else if (selectedProduct) {
          onSelectProduct(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterOpen, selectedProduct, onSelectProduct]);

  // Handle Add to Bag
  const handleAddToBag = () => {
    if (!selectedProduct) return;
    setIsAddingToBag(true);
    addItem({
      product: selectedProduct,
      variant: selectedVariant || null,
      size: null,
    });
    setTimeout(() => {
      setIsAddingToBag(false);
    }, 1200);
  };

  // 2-digit Floor Label
  const floorLabel = floorNumber < 10 ? `0${floorNumber}` : `${floorNumber}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between overflow-hidden">
      {/* Signature Add to Cart Animation Overlay */}
      <AddToCartSequence
        isActive={isAddingToBag}
        product={selectedProduct}
        onComplete={() => setIsAddingToBag(false)}
      />

      {/* ======================================================== */}
      {/* 1. TOP LUXURY SHOP HEADER */}
      {/* ======================================================== */}
      <header className="w-full px-4 md:px-8 py-5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#0D0C0B]/90 via-[#0D0C0B]/60 to-transparent backdrop-blur-[2px] border-b border-[#D4AF37]/15">
        {/* Top Left: Floor Return & Brand Mark */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={onReturnToFloor}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181614]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-[11px] font-bold tracking-[0.22em] text-[#D4AF37]"
            aria-label={`Return to Building Floor ${floorLabel}`}
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>FLOOR {floorLabel}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#444]">/</span>
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#A3998C]">MW TRENDS</span>
          </div>
        </div>

        {/* Center: Atelier Title & Mood */}
        <div className="flex flex-col items-center text-center">
          <span className="text-sm md:text-base font-bold tracking-[0.28em] text-[#F7F4ED] uppercase">
            {theme.title}
          </span>
          <span className="hidden md:inline-block text-[9px] tracking-[0.25em] text-[#C8A86B] uppercase font-semibold">
            {theme.moodTitle}
          </span>
        </div>

        {/* Top Right: Search, Vault, Filter, Sort & Bag */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('mw-open-search'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] hover:border-[#D4AF37] text-[10px] font-bold tracking-widest text-[#A3998C] hover:text-[#F7F4ED] transition-all"
            aria-label="Search Collection"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          {/* Vault Trigger */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-full bg-[#181614]/80 border border-[#333] hover:border-[#D4AF37] text-[#D3C7B8] hover:text-[#D4AF37] transition-all"
            aria-label={`Private Vault (${wishlistCount} items)`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "#D4AF37" : "none"} stroke="#D4AF37" strokeWidth="1.8">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Filter Trigger Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest transition-all ${
              isFilterOpen
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-[#181614]/80 border-[#333] text-[#D3C7B8] hover:border-[#D4AF37] hover:text-[#F7F4ED]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="hidden sm:inline">FILTERS</span>
          </button>

          {/* Sort Selector */}
          <div className="hidden lg:flex items-center">
            <select
              value={filterOptions.sortBy || "featured"}
              onChange={(e) =>
                onFilterChange({
                  ...filterOptions,
                  sortBy: e.target.value as FilterOptions["sortBy"],
                })
              }
              className="bg-[#181614]/80 text-[#D3C7B8] text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-[#333] hover:border-[#D4AF37] focus:outline-none cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="newest">NEWEST DROPS</option>
              <option value="bestselling">BEST SELLERS</option>
            </select>
          </div>

          {/* Mini Cart Button */}
          <button
            onClick={() => setMiniCartOpen(true)}
            className="relative p-2 rounded-full bg-[#181614]/80 border border-[#333] hover:border-[#D4AF37] transition-colors text-[#F7F4ED]"
            aria-label="Open Shopping Bag"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SUB-HEADER: CURATED COLLECTION TABS */}
      {/* ======================================================== */}
      <div className="w-full px-6 flex justify-center pointer-events-auto mt-2">
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-1 rounded-full bg-[#141312]/80 border border-[#333]/60 backdrop-blur-md">
          {[
            { id: "all", label: "CURATED ATELIER" },
            { id: "bestsellers", label: "BEST SELLERS" },
            { id: "new", label: "NEW DROPS" },
            { id: "customizable", label: "CUSTOMIZABLE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] tracking-widest font-bold transition-all ${
                activeCollectionTab === tab.id
                  ? "bg-[#D4AF37] text-black"
                  : "text-[#888] hover:text-[#F7F4ED]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. HOVER PRODUCT FLOATING LABEL (Non-intrusive) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {hoveredProduct && !selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none px-5 py-2.5 rounded-full bg-[#121110]/90 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-md flex items-center gap-4 text-center"
          >
            <span className="text-xs font-bold tracking-wider text-[#F7F4ED]">
              {hoveredProduct.name}
            </span>
            <span className="text-xs font-bold text-[#D4AF37]">{hoveredProduct.price}</span>
            {hoveredProduct.isCustomizable && (
              <span className="text-[9px] tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                CUSTOMIZABLE
              </span>
            )}
            <span className="text-[9px] tracking-widest text-[#777]">CLICK TO INSPECT</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 4. ZERO MATCHES EMPTY STATE */}
      {/* ======================================================== */}
      {products.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto p-6 text-center">
          <div className="max-w-md p-8 rounded-2xl bg-[#141312]/90 border border-[#D4AF37]/30 backdrop-blur-lg">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#D4AF37] block mb-3">
              MW ATELIER ARCHIVE
            </span>
            <h3 className="text-xl font-bold tracking-wider text-[#F7F4ED] mb-2">
              NO MATCHING PIECES
            </h3>
            <p className="text-xs text-[#888] mb-6">
              No bespoke creations currently match the applied filter criteria in this boutique.
            </p>
            <button
              onClick={() =>
                onFilterChange({
                  searchQuery: "",
                  sortBy: "featured",
                })
              }
              className="px-6 py-2.5 bg-[#D4AF37] text-black text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-white transition-colors"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CINEMATIC HERO FOCUS MODE PANEL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-auto flex justify-end"
          >
            {/* Background Dim Backdrop */}
            <div
              onClick={() => onSelectProduct(null)}
              className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[2px] transition-opacity cursor-pointer"
            />

            {/* Slide-In Luxury Product Detail & Action Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="relative z-20 w-full sm:w-[440px] h-full bg-[#121110] border-l border-[#D4AF37]/25 shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
            >
              {/* Header Bar */}
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#2B2825]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase">
                      HERO FOCUS
                    </span>
                    {selectedProduct.rating && (
                      <span className="text-[10px] text-[#A3998C]">
                        ★ {selectedProduct.rating}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectProduct(null)}
                    className="w-8 h-8 rounded-full border border-[#333] hover:border-[#D4AF37] text-[#888] hover:text-white flex items-center justify-center transition-colors text-sm"
                    aria-label="Close Hero Focus"
                  >
                    ✕
                  </button>
                </div>

                {/* Product Title & Short Subline */}
                <div className="mt-6">
                  {selectedProduct.isNew && (
                    <span className="text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 rounded bg-[#F7F4ED] text-black mb-2 inline-block">
                      NEW DROP
                    </span>
                  )}
                  {selectedProduct.isBestSeller && (
                    <span className="text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 rounded border border-[#D4AF37] text-[#D4AF37] ml-2 mb-2 inline-block">
                      BEST SELLER
                    </span>
                  )}
                  <h2 className="text-2xl font-bold tracking-wider text-[#F7F4ED] mb-2 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xs text-[#999] leading-relaxed mb-4">
                    {selectedProduct.shortDescription}
                  </p>
                  <div className="text-xl font-bold text-[#D4AF37]">{selectedProduct.price}</div>
                </div>

                {/* Color Variants Switcher */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#222]">
                    <div className="flex justify-between text-[10px] tracking-widest text-[#888] mb-3">
                      <span>FINISH / COLOR</span>
                      <span className="text-[#F7F4ED] font-bold">
                        {selectedVariant?.name || selectedProduct.variants[0].name}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            selectedVariant?.id === v.id
                              ? "border-2 border-[#D4AF37] p-0.5"
                              : "border border-[#444]"
                          }`}
                          aria-label={`Select ${v.name}`}
                        >
                          <span
                            className="w-full h-full rounded-full block border border-white/10"
                            style={{ backgroundColor: v.colorCode || "#111" }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Quick Preview */}
                {selectedProduct.specifications && (
                  <div className="mt-6 pt-6 border-t border-[#222] space-y-2 text-[11px]">
                    {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-[#888]">
                        <span className="text-[#A3998C]">{key}</span>
                        <span className="text-[#F7F4ED] font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-6 border-t border-[#2B2825] space-y-3">
                {/* 1. Primary: VIEW DETAILS (connects to approved PDP preserving context) */}
                <Link
                  href={`/products/${selectedProduct.slug}?shop=${categorySlug}&floor=${floorNumber}`}
                  className="w-full py-4 bg-[#F7F4ED] hover:bg-[#D4AF37] text-black font-bold tracking-[0.2em] text-xs text-center block transition-colors"
                >
                  VIEW FULL DETAILS
                </Link>

                {/* 2. Secondary: CUSTOMIZE (if customizable) */}
                {selectedProduct.isCustomizable && (
                  <Link
                    href={`/customize/${selectedProduct.slug}?shop=${categorySlug}&floor=${floorNumber}`}
                    className="w-full py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold tracking-[0.2em] text-xs text-center block transition-colors"
                  >
                    CUSTOMIZE THIS PIECE
                  </Link>
                )}

                {/* 3. ADD TO BAG */}
                <button
                  onClick={handleAddToBag}
                  className="w-full py-3 bg-[#1C1A18] hover:bg-[#2A2724] text-[#D3C7B8] hover:text-white font-bold tracking-[0.2em] text-[11px] text-center border border-[#333] transition-colors"
                >
                  ADD TO BAG
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 6. FLOATING FILTER DRAWER (Desktop & Tablet) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-6 z-40 w-80 max-h-[75vh] overflow-y-auto p-6 rounded-2xl bg-[#141312]/95 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#282624]">
              <span className="text-[10px] tracking-[0.25em] font-bold text-[#D4AF37]">
                ATELIER FILTERS
              </span>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-xs text-[#888] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Local Search Input */}
            <div className="mb-6">
              <label className="text-[9px] tracking-widest text-[#888] block mb-2 font-bold">
                SEARCH PIECES
              </label>
              <input
                type="text"
                placeholder="Search by title, fabric..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onFilterChange({ ...filterOptions, searchQuery: e.target.value });
                }}
                className="w-full px-3 py-2 bg-[#1C1A18] border border-[#333] rounded text-xs text-[#F7F4ED] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Category-Specific Filter Groups */}
            {theme.filterGroups.map((group) => (
              <div key={group.id} className="mb-5">
                <span className="text-[9px] tracking-widest text-[#888] block mb-2 font-bold">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((opt) => {
                    const currentVal = (filterOptions as any)[group.id] || "";
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          onFilterChange({
                            ...filterOptions,
                            [group.id]: isSelected ? "" : opt.value,
                          })
                        }
                        className={`px-2.5 py-1 rounded text-[9px] font-bold tracking-wider transition-all ${
                          isSelected
                            ? "bg-[#D4AF37] text-black"
                            : "bg-[#1E1C1A] text-[#888] hover:text-white border border-[#2B2825]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Customizable Toggle */}
            <div className="pt-3 border-t border-[#282624] mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-wider text-[#D3C7B8]">
                <input
                  type="checkbox"
                  checked={filterOptions.isCustomizableOnly || false}
                  onChange={(e) =>
                    onFilterChange({
                      ...filterOptions,
                      isCustomizableOnly: e.target.checked,
                    })
                  }
                  className="rounded border-[#333] text-[#D4AF37] focus:ring-0"
                />
                <span>CUSTOMIZABLE PIECES ONLY</span>
              </label>
            </div>

            {/* Reset Action */}
            <button
              onClick={() => {
                setSearchQuery("");
                onFilterChange({
                  sortBy: "featured",
                });
              }}
              className="w-full py-2 bg-[#1C1A18] hover:bg-[#252220] border border-[#333] text-[9px] tracking-widest text-[#A3998C] hover:text-white rounded transition-colors"
            >
              RESET FILTERS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 7. BOTTOM PRODUCT QUICK SWITCH DOCK */}
      {/* ======================================================== */}
      <div className="w-full px-4 pb-4 pointer-events-auto flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar max-w-full">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider border transition-all ${
                selectedProduct?.id === p.id
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                  : "bg-[#141312]/90 text-[#D3C7B8] border-[#333]"
              }`}
            >
              {idx === 0 ? `★ ${p.name.slice(0, 16)}` : p.name.slice(0, 16)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
