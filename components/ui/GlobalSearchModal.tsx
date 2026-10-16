"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { getAllProducts, Product } from "@/lib/data/mockCatalog";
import { DEFAULT_BUILDING_CATEGORIES, BuildingCategory } from "@/lib/data/buildingCategories";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryFilter?: string | null;
}

const RECENT_SEARCHES_KEY = "mw_recent_searches";

export default function GlobalSearchModal({
  isOpen,
  onClose,
  initialCategoryFilter = null,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(initialCategoryFilter);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Sync category filter
  useEffect(() => {
    setActiveCategoryFilter(initialCategoryFilter);
  }, [initialCategoryFilter]);

  // All catalog items
  const allProducts = useMemo(() => getAllProducts(), []);
  const allCategories = useMemo(() => DEFAULT_BUILDING_CATEGORIES.filter((c) => c.isActive), []);

  // Filtered categories and products
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchingCategories = q
      ? allCategories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
      : [];

    let matchingProducts = allProducts;
    if (activeCategoryFilter) {
      matchingProducts = matchingProducts.filter((p) => p.categorySlug === activeCategoryFilter);
    }

    if (q) {
      matchingProducts = matchingProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    return {
      categories: matchingCategories,
      products: q ? matchingProducts : matchingProducts.slice(0, 6),
    };
  }, [query, activeCategoryFilter, allProducts, allCategories]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.name);
    onClose();
    router.push(`/products/${product.slug}?shop=${product.categorySlug}`);
  };

  const handleSelectCategory = (category: BuildingCategory) => {
    saveRecentSearch(category.name);
    onClose();
    router.push(`/shop?shop=${category.slug}&floor=1`);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, searchResults.products.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && searchResults.products.length > 0) {
        e.preventDefault();
        if (searchResults.products[selectedIndex]) {
          handleSelectProduct(searchResults.products[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search MW Trends Atelier"
      className="fixed inset-0 z-[200] flex items-start justify-center pt-12 md:pt-24 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-[#0D0C0B] border border-[#D4AF37]/35 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 md:p-5 border-b border-[#24211E] flex items-center gap-3">
          <Search size={20} className="text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search ateliers, bespoke apparel, mugs, pens..."
            aria-label="Search query"
            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-[#F7F4ED] placeholder-[#777] font-medium tracking-wide"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-1 rounded-full text-[#888] hover:text-[#F7F4ED] hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="px-2.5 py-1 rounded border border-[#333] hover:border-[#D4AF37] text-[10px] tracking-widest text-[#A3998C] hover:text-[#D4AF37] transition-all uppercase"
          >
            ESC
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 py-2.5 border-b border-[#1A1816] bg-[#12100E] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[9px] tracking-widest text-[#777] uppercase shrink-0 mr-1">
            FILTER:
          </span>
          <button
            onClick={() => setActiveCategoryFilter(null)}
            className={`px-2.5 py-1 rounded-full text-[9px] tracking-wider font-semibold transition-all shrink-0 ${
              activeCategoryFilter === null
                ? "bg-[#D4AF37] text-black"
                : "border border-[#2C2926] text-[#A3998C] hover:border-[#D4AF37]/50"
            }`}
          >
            ALL ATELIERS
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === cat.slug ? null : cat.slug)}
              className={`px-2.5 py-1 rounded-full text-[9px] tracking-wider font-semibold transition-all shrink-0 ${
                activeCategoryFilter === cat.slug
                  ? "bg-[#D4AF37] text-black"
                  : "border border-[#2C2926] text-[#A3998C] hover:border-[#D4AF37]/50"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Recent Searches (when query is empty) */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[10px] tracking-widest text-[#888] uppercase mb-2.5">
                <span className="flex items-center gap-1.5 font-bold">
                  <Clock size={12} className="text-[#D4AF37]" /> RECENT SEARCHES
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem(RECENT_SEARCHES_KEY);
                  }}
                  className="hover:text-[#D4AF37] text-[9px] lowercase"
                >
                  clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={`recent-${i}`}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg bg-[#181614] border border-[#24211E] text-xs text-[#D3C7B8] hover:border-[#D4AF37] hover:text-[#F7F4ED] transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Results */}
          {searchResults.categories.length > 0 && (
            <div>
              <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold block mb-2.5">
                BOUTIQUE CATEGORIES ({searchResults.categories.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {searchResults.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className="p-3 rounded-xl bg-[#141210] border border-[#24211E] hover:border-[#D4AF37] hover:bg-[#1E1B18] transition-all flex items-center justify-between text-left group"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#F7F4ED] group-hover:text-[#D4AF37] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[9px] text-[#777] block mt-0.5 tracking-wider">
                        Floor {Math.floor(((cat.sortOrder || 1) - 1) / 4) + 1} Boutique
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-[#888] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
                {query ? `MATCHING PRODUCTS (${searchResults.products.length})` : "CURATED ATELIER PIECES"}
              </span>
              <span className="text-[9px] text-[#666] tracking-widest uppercase">
                {activeCategoryFilter ? `FILTERED: ${activeCategoryFilter}` : "ALL COLLECTIONS"}
              </span>
            </div>

            {searchResults.products.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#222] rounded-xl p-6">
                <Sparkles size={24} className="text-[#D4AF37]/40 mx-auto mb-2" />
                <p className="text-xs font-bold tracking-wider text-[#A3998C]">
                  NO ATELIER PRODUCTS FOUND FOR &ldquo;{query}&rdquo;
                </p>
                <p className="text-[10px] text-[#666] mt-1">
                  Try searching for apparel, ceramic mugs, brass pens, or fine art frames.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.products.map((product, idx) => {
                  const isHighlighted = idx === selectedIndex;
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full p-2.5 rounded-xl border transition-all flex items-center gap-3 text-left ${
                        isHighlighted
                          ? "bg-[#1C1916] border-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.12)]"
                          : "bg-[#12100E] border-[#222] hover:border-[#444]"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-[#080706] border border-white/5 relative overflow-hidden shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-[#666]">
                            MW
                          </div>
                        )}
                      </div>

                      {/* Product Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold tracking-wider text-[#D4AF37] uppercase">
                            {product.categorySlug}
                          </span>
                          {product.isCustomizable && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 tracking-widest font-semibold uppercase">
                              BESPOKE
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#F7F4ED] truncate mt-0.5">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-[#888] truncate">
                          {product.shortDescription}
                        </p>
                      </div>

                      {/* Valuation */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#F7F4ED] tracking-wider block">
                          Rs. {product.numericPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[9px] text-[#666] tracking-tight">
                          VIEW PIECE →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-5 py-3 border-t border-[#1C1A18] bg-[#0A0908] flex items-center justify-between text-[9px] text-[#666] tracking-wider">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#181614] border border-[#333] text-[#A3998C]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[#181614] border border-[#333] text-[#A3998C]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#181614] border border-[#333] text-[#A3998C]">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#181614] border border-[#333] text-[#A3998C]">ESC</kbd> Close</span>
          </div>
          <span className="text-[#D4AF37] font-semibold">MW TRENDS DIGITAL ATELIER</span>
        </div>
      </div>
    </div>
  );
}
