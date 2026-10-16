"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Compass, 
  Layers, 
  ArrowLeft 
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useStore } from "@/lib/store/useStore";
import { formatFloorNumber } from "@/lib/data/buildingCategories";
import GlobalSearchModal from "./GlobalSearchModal";

export default function GlobalNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFloor = useStore((state) => state.currentFloor);
  const activeShop = useStore((state) => state.activeShop);
  const hasEntered = useStore((state) => state.hasEntered);

  const { items: cartItems, savedItems, setMiniCartOpen } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = savedItems.length;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global custom event listener to open search from any component
  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("mw-open-search", handleOpenSearch);
    return () => window.removeEventListener("mw-open-search", handleOpenSearch);
  }, []);

  // Global Keyboard Shortcut: '/' or 'Ctrl+K' / 'Cmd+K' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInput) return;

      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine current contextual route hierarchy
  const floorQuery = searchParams.get("floor");
  const shopQuery = searchParams.get("shop");
  const floorNumber = floorQuery ? parseInt(floorQuery, 10) : currentFloor;

  // Contextual Location Breadcrumb Label
  const contextLocation = useMemo(() => {
    if (!pathname || pathname === "/" || pathname === "/world") {
      return {
        type: "world",
        primary: `FLOOR ${formatFloorNumber(floorNumber)}`,
        secondary: "GRAND CONCOURSE",
      };
    }
    if (pathname.startsWith("/shop")) {
      const categoryName = shopQuery || activeShop || "COLLECTION";
      return {
        type: "shop",
        primary: `FLOOR ${formatFloorNumber(floorNumber)}`,
        secondary: categoryName.toUpperCase().replace("-", " "),
        backUrl: `/?floor=${floorNumber}`,
        backLabel: `FLOOR ${formatFloorNumber(floorNumber)}`,
      };
    }
    if (pathname.startsWith("/products")) {
      const categoryName = shopQuery || "ATELIER";
      return {
        type: "product",
        primary: categoryName.toUpperCase().replace("-", " "),
        secondary: "BESPOKE PIECE",
        backUrl: `/shop?shop=${categoryName.toLowerCase()}&floor=${floorNumber}`,
        backLabel: categoryName.toUpperCase().replace("-", " "),
      };
    }
    if (pathname.startsWith("/cart")) {
      return {
        type: "cart",
        primary: "PACKING ROOM",
        secondary: "SHOPPING BAG",
        backUrl: `/shop?floor=${floorNumber}`,
        backLabel: "CONTINUE EXPLORING",
      };
    }
    if (pathname.startsWith("/wishlist")) {
      return {
        type: "wishlist",
        primary: "PRIVATE VAULT",
        secondary: "CURATED SAVES",
        backUrl: `/shop?floor=${floorNumber}`,
        backLabel: "EXPLORE ATELIERS",
      };
    }
    if (pathname.startsWith("/checkout")) {
      return {
        type: "checkout",
        primary: "CHECKOUT",
        secondary: "SECURE PAYMENT",
        backUrl: "/cart",
        backLabel: "BAG",
      };
    }
    return {
      type: "general",
      primary: "MW TRENDS",
      secondary: "LUXURY BAZAAR",
    };
  }, [pathname, shopQuery, activeShop, floorNumber]);

  // Check route types
  const isShop = pathname.startsWith("/shop");
  const isPDP = pathname.startsWith("/products");

  return (
    <>
      {/* ============================================================== */}
      {/* 1. UNIFIED DESKTOP TOP UTILITY NAVIGATION                      */}
      {/* Renders on World, Cart, Wishlist, Checkout, Account, etc.      */}
      {/* (/shop and /products have their approved specialized headers)  */}
      {/* ============================================================== */}
      {!isShop && !isPDP && (
        <header
          role="banner"
          aria-label="Global MW Trends Navigation"
          className="fixed top-0 left-0 w-full px-6 md:px-10 py-4 flex items-center justify-between pointer-events-none z-[120] select-none transition-all duration-300"
        >
          {/* Left: Brand Identity & Contextual Return Link */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <Link
              href={`/?floor=${floorNumber}`}
              className="flex items-center gap-2.5 group"
              aria-label="MW Trends Home"
            >
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#141210]/90 backdrop-blur-md flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs shadow-md shadow-[#D4AF37]/10 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all">
                MW
              </div>
              <span className="hidden sm:inline-block text-base font-serif tracking-[0.25em] text-[#F7F4ED] group-hover:text-[#D4AF37] transition-colors">
                MW TRENDS
              </span>
            </Link>

            {/* Contextual Back Pill if applicable */}
            {contextLocation.backUrl && (
              <Link
                href={contextLocation.backUrl}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181614]/80 border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] transition-all"
                aria-label={`Go back to ${contextLocation.backLabel}`}
              >
                <ArrowLeft size={11} />
                <span>{contextLocation.backLabel}</span>
              </Link>
            )}
          </div>

          {/* Center: Contextual Location Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12100E]/75 backdrop-blur-md border border-[#D4AF37]/20 pointer-events-auto shadow-lg shadow-black/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              {contextLocation.primary}
            </span>
            <span className="text-[10px] text-[#444]">/</span>
            <span className="text-[9px] tracking-[0.22em] text-[#A3998C] uppercase font-medium">
              {contextLocation.secondary}
            </span>
          </div>

          {/* Right: Actions (Search, Wishlist, Quick Shop, Bag) */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search collection (Shortcut: /)"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141210]/80 hover:bg-[#1E1B18] border border-[#2B2724] hover:border-[#D4AF37]/60 text-xs text-[#D3C7B8] hover:text-[#F7F4ED] transition-all shadow-md group"
            >
              <Search size={14} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-[10px] font-medium tracking-[0.18em]">
                SEARCH
              </span>
              <kbd className="hidden lg:inline-block text-[8px] px-1 py-0.2 rounded bg-black/40 border border-white/10 text-[#777]">
                /
              </kbd>
            </button>

            {/* Wishlist / Private Vault */}
            <Link
              href="/wishlist"
              aria-label={`Private Vault (${wishlistCount} items)`}
              className="relative w-9 h-9 rounded-full bg-[#141210]/80 hover:bg-[#1E1B18] border border-[#2B2724] hover:border-[#D4AF37]/60 flex items-center justify-center text-[#D3C7B8] hover:text-[#D4AF37] transition-all shadow-md"
            >
              <Heart size={15} className={wishlistCount > 0 ? "fill-[#D4AF37] text-[#D4AF37]" : ""} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black font-bold text-[9px] flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Quick Shop Button (for World view) */}
            <Link
              href={`/shop?floor=${floorNumber}`}
              aria-label="Browse All Ateliers"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141210]/80 hover:bg-[#1E1B18] border border-[#2B2724] hover:border-[#D4AF37]/60 text-xs text-[#D3C7B8] hover:text-[#F7F4ED] transition-all shadow-md"
            >
              <Layers size={13} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#F7F4ED]">
                ATELIERS
              </span>
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setMiniCartOpen(true)}
              aria-label={`Shopping Bag (${cartCount} items)`}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-xs text-[#D4AF37] hover:text-[#F7F4ED] transition-all shadow-md font-bold tracking-wider"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline-block text-[10px] tracking-[0.18em]">
                BAG
              </span>
              {mounted && cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black font-bold text-[9px] flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* ============================================================== */}
      {/* 2. UNIFIED GLOBAL MOBILE BOTTOM DOCK                            */}
      {/* Coordinates safely with safe-area insets & PDP sticky bars    */}
      {/* ============================================================== */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation Dock"
        className={`md:hidden fixed bottom-3 left-4 right-4 pointer-events-auto z-[110] transition-all duration-300 ${
          isPDP ? "opacity-0 pointer-events-none translate-y-12" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="bg-[#12100E]/95 border border-[#D4AF37]/30 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-around">
          {/* 1. World / Home */}
          <Link
            href={`/?floor=${floorNumber}`}
            aria-label="MW World Atrium"
            className="flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[44px] text-center group"
          >
            <Compass size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-bold tracking-wider text-[#A3998C] group-hover:text-[#F7F4ED] mt-0.5 uppercase">
              WORLD
            </span>
          </Link>

          {/* 2. Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Collection"
            className="flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[44px] text-center group"
          >
            <Search size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-bold tracking-wider text-[#A3998C] group-hover:text-[#F7F4ED] mt-0.5 uppercase">
              SEARCH
            </span>
          </button>

          {/* 3. Shop / Ateliers */}
          <Link
            href={`/shop?floor=${floorNumber}`}
            aria-label="Boutique Ateliers"
            className="flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[44px] text-center group"
          >
            <Layers size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-bold tracking-wider text-[#A3998C] group-hover:text-[#F7F4ED] mt-0.5 uppercase">
              SHOPS
            </span>
          </Link>

          {/* 4. Vault / Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Vault (${wishlistCount})`}
            className="relative flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[44px] text-center group"
          >
            <div className="relative">
              <Heart size={18} className={wishlistCount > 0 ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#D4AF37]"} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-black font-bold text-[8px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold tracking-wider text-[#A3998C] group-hover:text-[#F7F4ED] mt-0.5 uppercase">
              VAULT
            </span>
          </Link>

          {/* 5. Bag */}
          <button
            onClick={() => setMiniCartOpen(true)}
            aria-label={`Shopping Bag (${cartCount})`}
            className="relative flex flex-col items-center justify-center p-1.5 min-w-[48px] min-h-[44px] text-center group"
          >
            <div className="relative">
              <ShoppingBag size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-black font-bold text-[8px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold tracking-wider text-[#A3998C] group-hover:text-[#F7F4ED] mt-0.5 uppercase">
              BAG
            </span>
          </button>
        </div>
      </nav>

      {/* Global Command / Overlay Search Palette */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialCategoryFilter={shopQuery || null}
      />
    </>
  );
}
