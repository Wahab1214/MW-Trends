"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { getProductBySlug, getAllProducts, type Product, type ProductVariant, type ProductSize } from "@/lib/data/mockCatalog";
import {
  CATEGORY_CUSTOMIZATION_PROFILES,
  type SelectedCustomization
} from "@/lib/data/productCustomizations";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductViewer3D from "@/components/shop/ProductViewer3D";
import AddToCartSequence from "@/components/shop/AddToCartSequence";
import { useCartStore } from "@/lib/store/useCartStore";

// ---------------------------------------------------------------------------
// Cart Badge in Navigation
// ---------------------------------------------------------------------------
function CartBadge() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  if (count === 0) return null;
  return (
    <div className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
      {count}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Size Guide Modal Component
// ---------------------------------------------------------------------------
function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  if (!isOpen) return null;

  const measurements = [
    { size: "S", chestIn: "38", chestCm: "96", lengthIn: "28", lengthCm: "71", shoulderIn: "17.5", shoulderCm: "44.5" },
    { size: "M", chestIn: "40", chestCm: "102", lengthIn: "29", lengthCm: "73.5", shoulderIn: "18.5", shoulderCm: "47" },
    { size: "L", chestIn: "42", chestCm: "107", lengthIn: "30", lengthCm: "76", shoulderIn: "19.5", shoulderCm: "49.5" },
    { size: "XL", chestIn: "44", chestCm: "112", lengthIn: "31", lengthCm: "78.5", shoulderIn: "20.5", shoulderCm: "52" },
    { size: "XXL", chestIn: "46", chestCm: "117", lengthIn: "32", lengthCm: "81", shoulderIn: "21.5", shoulderCm: "54.5" }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D0B0A] border border-[#D4AF37]/30 max-w-lg w-full p-6 md:p-8 rounded shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 border-b border-[#24211E] pb-4">
          <div>
            <h3 className="text-sm font-bold tracking-[0.25em] text-[#F7F4ED] uppercase">
              ATELIER SIZE & FIT GUIDE
            </h3>
            <p className="text-[10px] text-[#A3998C] tracking-wider mt-1">
              Tailored fit — designed for an elegant drape.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-[#D4AF37] hover:bg-[#1E1B18] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setUnit("in")}
            className={`px-3 py-1 text-[10px] font-bold tracking-widest rounded ${
              unit === "in"
                ? "bg-[#D4AF37] text-black"
                : "bg-[#1C1A18] text-[#888] hover:text-white"
            }`}
          >
            INCHES
          </button>
          <button
            onClick={() => setUnit("cm")}
            className={`px-3 py-1 text-[10px] font-bold tracking-widest rounded ${
              unit === "cm"
                ? "bg-[#D4AF37] text-black"
                : "bg-[#1C1A18] text-[#888] hover:text-white"
            }`}
          >
            CENTIMETERS
          </button>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#24211E] text-[10px] text-[#D4AF37] tracking-widest">
                <th className="py-2.5">SIZE</th>
                <th className="py-2.5">CHEST</th>
                <th className="py-2.5">LENGTH</th>
                <th className="py-2.5">SHOULDER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1816] text-[#D3C7B8]">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-[#151311]">
                  <td className="py-3 font-bold text-[#F7F4ED]">{row.size}</td>
                  <td className="py-3">{unit === "in" ? `${row.chestIn}″` : `${row.chestCm} cm`}</td>
                  <td className="py-3">{unit === "in" ? `${row.lengthIn}″` : `${row.lengthCm} cm`}</td>
                  <td className="py-3">{unit === "in" ? `${row.shoulderIn}″` : `${row.shoulderCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] text-[#666] mt-6 leading-relaxed">
          *If you fall between sizes or prefer a relaxed silhouette, we recommend selecting one size up.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail Content Component
// ---------------------------------------------------------------------------
function ProductDetailContent({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route & Context Parameters
  const shopQuery = searchParams.get("shop");
  const floorQuery = searchParams.get("floor");
  const floorNumber = floorQuery ? parseInt(floorQuery, 10) : 1;

  // Product Data
  const [product, setProduct] = useState<Product | null>(null);
  const [activeMedia, setActiveMedia] = useState<"3d" | "image" | "alternate">("image");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [sizeWarning, setSizeWarning] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"story" | "specs" | "care" | "delivery">("story");
  const [vaultPulse, setVaultPulse] = useState<boolean>(false);

  // Customization State
  const [customText, setCustomText] = useState<string>("");
  const [customFont, setCustomFont] = useState<string>("serif");
  const [customPlacement, setCustomPlacement] = useState<string>("chest-left");
  const [printSide, setPrintSide] = useState<string>("front");
  const [customOrientation, setCustomOrientation] = useState<string>("portrait");
  const [giftBox, setGiftBox] = useState<boolean>(false);
  const [photoName, setPhotoName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  // Store Hooks
  const { addItem, setMiniCartOpen, isInVault, toggleVault } = useCartStore();

  // Load product data
  useEffect(() => {
    const data = getProductBySlug(slug);
    if (data) {
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
      if (data.has3D) {
        setActiveMedia("3d");
      }
    } else {
      notFound();
    }
  }, [slug]);

  // Context-aware Back navigation
  const resolvedShopSlug = shopQuery || product?.categorySlug || "shirts";
  const returnShopUrl = `/shop?shop=${resolvedShopSlug}&floor=${floorNumber}`;
  const backShopLabel = resolvedShopSlug.toUpperCase().replace("-", " ");

  // Customization Profile for this category
  const customizationProfile = useMemo(() => {
    if (!product) return null;
    return CATEGORY_CUSTOMIZATION_PROFILES[product.categorySlug] || null;
  }, [product]);

  // Authoritatively compute surcharges
  const customizationSurcharge = useMemo(() => {
    if (!product || !product.isCustomizable) return 0;
    let surcharge = 0;
    if (customText.trim().length > 0) {
      if (product.categorySlug === "shirts") surcharge += 299;
      else if (product.categorySlug === "mugs") surcharge += 199;
      else if (product.categorySlug === "pens") surcharge += 249;
      else if (product.categorySlug === "frames") surcharge += 199;
    }
    if (printSide === "both") surcharge += 150;
    if (giftBox) {
      if (product.categorySlug === "pens") surcharge += 350;
      else surcharge += 250;
    }
    if (photoName) surcharge += 299;
    return surcharge;
  }, [product, customText, printSide, giftBox, photoName]);

  const baseNumericPrice = product?.numericPrice || 0;
  const totalUnitPrice = baseNumericPrice + customizationSurcharge;
  const totalLinePrice = totalUnitPrice * quantity;

  // Build customization payload
  const currentCustomizationPayload = useMemo((): SelectedCustomization | null => {
    if (!product?.isCustomizable) return null;
    const hasAnyCustom =
      customText.trim().length > 0 ||
      printSide === "both" ||
      giftBox ||
      Boolean(photoName);

    if (!hasAnyCustom) return null;

    return {
      customText: customText.trim() || undefined,
      font: customFont,
      placement: customPlacement,
      printSide: printSide,
      orientation: customOrientation,
      giftBox: giftBox,
      photoName: photoName || undefined,
    };
  }, [product, customText, customFont, customPlacement, printSide, customOrientation, giftBox, photoName]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const all = getAllProducts();
    return all
      .filter((p) => p.slug !== product.slug)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#080706] text-[#F7F4ED] flex flex-col items-center justify-center">
        <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase animate-pulse mb-3">
          MW TRENDS ATELIER
        </span>
        <div className="w-16 h-[1px] bg-[#D4AF37]/40" />
      </div>
    );
  }

  // Handle Add to Bag
  const handleAddToBag = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeWarning(true);
      window.scrollTo({ top: 380, behavior: "smooth" });
      return;
    }
    setSizeWarning(false);
    setIsAdding(true);

    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
      customization: currentCustomizationPayload
        ? {
            ...currentCustomizationPayload,
            surcharge: customizationSurcharge,
          }
        : null,
    });
  };

  // Handle Buy Now (Instant checkout entry)
  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeWarning(true);
      return;
    }
    setSizeWarning(false);
    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
      customization: currentCustomizationPayload
        ? {
            ...currentCustomizationPayload,
            surcharge: customizationSurcharge,
          }
        : null,
    });
    router.push("/checkout");
  };

  // Toggle Vault
  const handleToggleVault = () => {
    toggleVault(product, selectedVariant, selectedSize);
    setVaultPulse(true);
    setTimeout(() => setVaultPulse(false), 800);
  };

  const isSavedInVault = isInVault(product.id) || isInVault(product.slug);

  return (
    <div className="min-h-screen bg-[#080706] text-[#F7F4ED] font-sans selection:bg-[#D4AF37] selection:text-[#080706] pb-28">
      {/* Signature MW Add To Cart Visual Sequence */}
      <AddToCartSequence
        isActive={isAdding}
        product={product}
        onComplete={() => setIsAdding(false)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* ======================================================== */}
      {/* 1. TOP LUXURY ATELIER NAVIGATION */}
      {/* ======================================================== */}
      <header className="sticky top-0 w-full h-16 flex items-center justify-between px-4 md:px-8 z-50 bg-[#080706]/90 backdrop-blur-md border-b border-[#24211E]">
        {/* Back Context & Brand */}
        <div className="flex items-center gap-4">
          <Link
            href={returnShopUrl}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161412] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-[10px] font-bold tracking-[0.22em] text-[#D4AF37]"
            aria-label={`Return to ${backShopLabel}`}
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>BACK TO {backShopLabel}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#888]">
            <span>/</span>
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              FLOOR 0{floorNumber}
            </Link>
          </div>
        </div>

        {/* Center: Atelier Brandmark */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-[0.35em] text-[#F7F4ED] uppercase">
            MW TRENDS
          </span>
          <span className="text-[8px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            BESPOKE ATELIER
          </span>
        </div>

        {/* Right: Search, Vault & Bag Drawer Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('mw-open-search'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] hover:border-[#D4AF37] text-[10px] font-bold tracking-widest text-[#A3998C] hover:text-[#F7F4ED] transition-all"
            aria-label="Search Collection (Shortcut: /)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          <button
            onClick={handleToggleVault}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border transition-all ${
              isSavedInVault
                ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                : "border-[#333] text-[#A3998C] hover:border-[#D4AF37] hover:text-[#F7F4ED]"
            }`}
            title="Private Atelier Vault"
          >
            <span className={`transition-transform duration-300 ${vaultPulse ? "scale-125 text-[#D4AF37]" : ""}`}>
              {isSavedInVault ? "★" : "☆"}
            </span>
            <span className="hidden sm:inline">VAULT</span>
          </button>

          <button
            onClick={() => setMiniCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161412] border border-[#333] hover:border-[#D4AF37] text-[#D3C7B8] hover:text-[#F7F4ED] text-[10px] font-bold tracking-widest transition-all"
            aria-label="Open Shopping Bag"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hidden sm:inline">BAG</span>
            <CartBadge />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN SPLIT PDP STAGE (60% Media / 40% Config) */}
      {/* ======================================================== */}
      <main className="max-w-[1680px] mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
          {/* ---------------------------------------------------- */}
          {/* LEFT: 60% IMMERSIVE MEDIA STAGE */}
          {/* ---------------------------------------------------- */}
          <div className="w-full lg:w-[60%] lg:h-[calc(100vh-64px)] lg:sticky top-16 bg-[#0B0908] border-r border-[#24211E] flex flex-col relative overflow-hidden">
            {/* Media Stage Top Bar Controls */}
            <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex items-center justify-between gap-2 pointer-events-none">
              {/* View Mode Toggle Controls */}
              {product.has3D && (
                <div className="flex gap-1.5 sm:gap-2 pointer-events-auto">
                  <button
                    onClick={() => setActiveMedia("3d")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-bold tracking-[0.2em] transition-all border ${
                      activeMedia === "3d"
                        ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
                        : "bg-[#161412]/80 backdrop-blur-md border-[#333] text-[#A3998C] hover:border-[#D4AF37] hover:text-white"
                    }`}
                  >
                    3D VIEW
                  </button>
                  <button
                    onClick={() => setActiveMedia("image")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-bold tracking-[0.2em] transition-all border ${
                      activeMedia === "image" || activeMedia === "alternate"
                        ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
                        : "bg-[#161412]/80 backdrop-blur-md border-[#333] text-[#A3998C] hover:border-[#D4AF37] hover:text-white"
                    }`}
                  >
                    PHOTO
                  </button>
                </div>
              )}

              {/* Atelier Status Badges */}
              <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
                {product.isNew && (
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 sm:py-1 rounded bg-[#F7F4ED] text-[#080706] uppercase">
                    NEW DROP
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 sm:py-1 rounded border border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 uppercase">
                    BEST SELLER
                  </span>
                )}
                {product.isCustomizable && (
                  <span className="hidden sm:inline-block text-[7px] sm:text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 sm:py-1 rounded border border-[#C8A86B]/60 text-[#C8A86B] bg-[#161412]/90 uppercase">
                    BESPOKE
                  </span>
                )}
              </div>
            </div>

            {/* Media Presentation Stage */}
            <div className="flex-1 w-full relative h-[65vh] lg:h-full flex items-center justify-center bg-[#090807]">
              {activeMedia === "3d" ? (
                <ProductViewer3D
                  colorCode={selectedVariant?.colorCode || "#2B2825"}
                  productType={product.categorySlug}
                  customText={customText}
                  fallbackImage={product.images[0]}
                />
              ) : (
                <div className="w-full h-full relative p-8 flex items-center justify-center">
                  <Image
                    src={
                      activeMedia === "alternate" && product.images[1]
                        ? product.images[1]
                        : product.images[0]
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                    priority
                  />
                  {/* Live Inscription Watermark on Image */}
                  {customText.trim().length > 0 && (
                    <div className="absolute bottom-16 right-16 px-4 py-2 bg-[#12100E]/90 border border-[#D4AF37]/40 rounded backdrop-blur-md flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span className="text-[10px] font-bold tracking-[0.22em] text-[#D4AF37] uppercase">
                        &ldquo;{customText.toUpperCase()}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Gallery Thumbnails */}
            {activeMedia !== "3d" && product.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-[#12100E]/80 backdrop-blur-md p-2 rounded-full border border-[#24211E]">
                <button
                  onClick={() => setActiveMedia("image")}
                  className={`w-12 h-12 rounded relative overflow-hidden border transition-all ${
                    activeMedia === "image" ? "border-[#D4AF37] scale-105" : "border-[#333] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={product.images[0]} alt="Primary View" fill className="object-cover" />
                </button>
                <button
                  onClick={() => setActiveMedia("alternate")}
                  className={`w-12 h-12 rounded relative overflow-hidden border transition-all ${
                    activeMedia === "alternate" ? "border-[#D4AF37] scale-105" : "border-[#333] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={product.images[1]} alt="Alternate Angle" fill className="object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* RIGHT: 40% PRODUCT CONFIGURATION & COMMERCE PANEL */}
          {/* ---------------------------------------------------- */}
          <div className="w-full lg:w-[40%] px-6 md:px-12 py-8 lg:py-12 overflow-y-auto space-y-8">
            {/* Atelier Breadcrumbs */}
            <nav className="text-[9px] tracking-[0.25em] text-[#888] uppercase">
              <Link href="/" className="hover:text-[#D4AF37] transition-colors">MW WORLD</Link>
              <span className="mx-2 text-[#444]">/</span>
              <Link href={returnShopUrl} className="hover:text-[#D4AF37] transition-colors">{backShopLabel}</Link>
              <span className="mx-2 text-[#444]">/</span>
              <span className="text-[#F7F4ED] font-semibold">{product.name}</span>
            </nav>

            {/* Title, Category & Sku */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-[0.28em] text-[#D4AF37] uppercase">
                  {product.categorySlug.toUpperCase()} COLLECTION
                </span>
                {product.sku && (
                  <span className="text-[9px] text-[#666] tracking-widest">
                    • SKU: {product.sku}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-[#F7F4ED] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#A3998C] mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Authoritative Live Price Display */}
            <div className="p-4 rounded bg-[#12100E] border border-[#24211E] flex items-center justify-between">
              <div>
                <span className="text-[9px] tracking-[0.25em] text-[#888] uppercase block">
                  ATELIER VALUATION
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-bold tracking-wider text-[#D4AF37]">
                    Rs. {totalUnitPrice.toLocaleString("en-IN")}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-[#666] line-through">
                      {product.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>

              {customizationSurcharge > 0 && (
                <div className="text-right">
                  <span className="text-[9px] font-bold tracking-widest text-[#C8A86B] uppercase block">
                    +Rs. {customizationSurcharge.toLocaleString("en-IN")} BESPOKE
                  </span>
                  <span className="text-[8px] text-[#888]">Included in total</span>
                </div>
              )}
            </div>

            {/* -------------------------------------------------- */}
            {/* COLOR / FINISH VARIANT SELECTOR */}
            {/* -------------------------------------------------- */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#A3998C] uppercase">
                    COLOR / ATELIER FINISH
                  </span>
                  <span className="text-xs font-bold text-[#F7F4ED] tracking-wider">
                    {selectedVariant?.name}
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-2 border-[#D4AF37] p-1 scale-105 shadow-md shadow-[#D4AF37]/20"
                            : "border border-[#333] hover:border-[#888]"
                        }`}
                        aria-label={`Select color variant ${v.name}`}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-white/10"
                          style={{ backgroundColor: v.colorCode || "#111" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -------------------------------------------------- */}
            {/* SIZE VARIANT SELECTOR (for Apparel/Shirts) */}
            {/* -------------------------------------------------- */}
            {product.sizes && product.sizes.length > 0 && (
              <div className={`space-y-3 p-4 rounded transition-all ${sizeWarning ? "bg-[#2A1D0B]/80 border border-[#D4AF37] animate-pulse" : "border border-transparent"}`}>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#A3998C] uppercase">
                      SELECT SIZE
                    </span>
                    {sizeWarning && (
                      <span className="text-[9px] font-bold text-[#D4AF37] tracking-wider uppercase">
                        • Required
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[9px] font-bold tracking-[0.2em] text-[#D4AF37] hover:underline uppercase"
                  >
                    SIZE GUIDE
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize?.id === s.id;
                    const isAvailable = s.isAvailable;

                    return (
                      <button
                        key={s.id}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(s);
                          setSizeWarning(false);
                        }}
                        className={`py-3 text-xs font-bold tracking-widest rounded border transition-all relative overflow-hidden ${
                          !isAvailable
                            ? "border-[#222] text-[#444] bg-[#0E0C0A] cursor-not-allowed opacity-50"
                            : isSelected
                            ? "border-[#D4AF37] text-black bg-[#D4AF37] shadow-md shadow-[#D4AF37]/20"
                            : "border-[#333] text-[#F7F4ED] bg-[#161412] hover:border-[#D4AF37]"
                        }`}
                      >
                        {s.label}
                        {!isAvailable && (
                          <span className="absolute inset-0 bg-[#E25555]/40 h-[1.5px] w-[150%] -rotate-45 origin-center top-1/2 -left-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {product.fit && (
                  <p className="text-[10px] text-[#888] leading-relaxed pt-1">
                    Fit Note: {product.fit}
                  </p>
                )}
              </div>
            )}

            {/* -------------------------------------------------- */}
            {/* CATEGORY-SPECIFIC CUSTOMIZATION ENGINE CARD */}
            {/* -------------------------------------------------- */}
            {product.isCustomizable && customizationProfile && (
              <div className="p-5 rounded-lg bg-[#100E0D] border border-[#D4AF37]/30 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-[#24211E] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <h3 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                      {customizationProfile.title}
                    </h3>
                  </div>
                  <span className="text-[8px] font-bold tracking-widest text-[#A3998C] uppercase">
                    OPTIONAL BESPOKE
                  </span>
                </div>

                {/* 1. Custom Text Inscription */}
                {customizationProfile.fields.some((f) => f.id === "customText") && (
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-[#A3998C] mb-1.5 font-medium">
                      <span>INSCRIPTION / INITIALS</span>
                      <span>
                        {customText.length} /{" "}
                        {customizationProfile.fields.find((f) => f.id === "customText")?.maxLength || 15}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={customText}
                      maxLength={customizationProfile.fields.find((f) => f.id === "customText")?.maxLength || 15}
                      onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                      placeholder={customizationProfile.fields.find((f) => f.id === "customText")?.placeholder || "e.g., W.A."}
                      aria-label="Custom inscription or monogram initials"
                      className="w-full bg-[#181614] border border-[#333] focus:border-[#D4AF37] focus:outline-none rounded px-3 py-2 text-xs font-bold tracking-[0.18em] text-[#F7F4ED] placeholder-[#555] uppercase"
                    />
                    <div className="flex justify-between items-center mt-1 text-[9px] text-[#666]">
                      <span>{customizationProfile.fields.find((f) => f.id === "customText")?.description}</span>
                      <span className="text-[#D4AF37] font-semibold">
                        +Rs. {customizationProfile.fields.find((f) => f.id === "customText")?.surcharge}
                      </span>
                    </div>

                    {customText.trim().length > 0 && (
                      <div className="mt-2.5 p-2.5 rounded bg-[#12100E] border border-[#D4AF37]/40 flex items-center justify-between text-[10px]">
                        <span className="text-[#A3998C] font-semibold tracking-widest uppercase">
                          BESPOKE INSCRIPTION:
                        </span>
                        <span className="text-[#D4AF37] font-serif font-bold tracking-[0.25em]">
                          &ldquo;{customText.toUpperCase()}&rdquo;
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Font Style (if applicable) */}
                {customizationProfile.fields.some((f) => f.id === "font") && (
                  <div>
                    <span className="text-[10px] font-medium text-[#A3998C] block mb-1.5">
                      TYPOGRAPHY STYLE
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Serif Roman", value: "serif" },
                        { label: "Modern Sans", value: "sans" },
                        { label: "Couture Script", value: "script" },
                      ].map((fontOpt) => (
                        <button
                          key={fontOpt.value}
                          onClick={() => setCustomFont(fontOpt.value)}
                          className={`py-2 px-1 text-[9px] font-bold tracking-wider rounded border transition-all ${
                            customFont === fontOpt.value
                              ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                              : "bg-[#181614] border-[#2A2724] text-[#888] hover:border-[#444]"
                          }`}
                        >
                          {fontOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Placement (for shirts) */}
                {customizationProfile.fields.some((f) => f.id === "placement") && (
                  <div>
                    <span className="text-[10px] font-medium text-[#A3998C] block mb-1.5">
                      EMBROIDERY PLACEMENT
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Chest Left", value: "chest-left" },
                        { label: "Right Cuff", value: "cuff" },
                        { label: "Rear Yoke", value: "collar-back" },
                      ].map((placeOpt) => (
                        <button
                          key={placeOpt.value}
                          onClick={() => setCustomPlacement(placeOpt.value)}
                          className={`py-2 px-1 text-[9px] font-bold tracking-wider rounded border transition-all ${
                            customPlacement === placeOpt.value
                              ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                              : "bg-[#181614] border-[#2A2724] text-[#888] hover:border-[#444]"
                          }`}
                        >
                          {placeOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Print Side (for Mugs) */}
                {customizationProfile.fields.some((f) => f.id === "printSide") && (
                  <div>
                    <span className="text-[10px] font-medium text-[#A3998C] block mb-1.5">
                      CERAMIC PRINT ORIENTATION
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPrintSide("front")}
                        className={`py-2 px-2 text-[9px] font-bold tracking-wider rounded border transition-all ${
                          printSide === "front"
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                            : "bg-[#181614] border-[#2A2724] text-[#888] hover:border-[#444]"
                        }`}
                      >
                        Front Face Only (+Rs. 0)
                      </button>
                      <button
                        onClick={() => setPrintSide("both")}
                        className={`py-2 px-2 text-[9px] font-bold tracking-wider rounded border transition-all ${
                          printSide === "both"
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                            : "bg-[#181614] border-[#2A2724] text-[#888] hover:border-[#444]"
                        }`}
                      >
                        Both Sides (+Rs. 150)
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Archival Photo Upload Simulation (for Frames) */}
                {customizationProfile.fields.some((f) => f.id === "photoUpload") && (
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-[#A3998C] mb-1.5">
                      <span>FINE ART ARCHIVAL PRINT</span>
                      <span className="text-[#D4AF37] font-semibold">+Rs. 299</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-3 rounded bg-[#181614] border border-[#333] hover:border-[#D4AF37] cursor-pointer flex items-center justify-between text-xs text-[#D3C7B8] transition-colors">
                        <span className="truncate text-[10px] tracking-wider">
                          {photoName || "Select art photograph..."}
                        </span>
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase">UPLOAD</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          aria-label="Upload fine art photography image"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                setUploadError("Invalid file type. Please upload a valid JPG, PNG, or WEBP image.");
                                setPhotoName("");
                                return;
                              }
                              if (file.size > 10 * 1024 * 1024) {
                                setUploadError("File size exceeds 10MB limit. Please upload an image under 10MB.");
                                setPhotoName("");
                                return;
                              }
                              setUploadError("");
                              const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                              setPhotoName(cleanName);
                            }
                          }}
                        />
                      </label>
                      {photoName && (
                        <button
                          onClick={() => {
                            setPhotoName("");
                            setUploadError("");
                          }}
                          className="px-2 py-2 text-[#888] hover:text-[#E25555] text-xs"
                          title="Remove uploaded art"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {uploadError && (
                      <p className="text-[9px] text-[#E25555] mt-1 tracking-wider">{uploadError}</p>
                    )}
                  </div>
                )}

                {/* 6. Presentation Gift Box Toggle */}
                {customizationProfile.fields.some((f) => f.id === "giftBox") && (
                  <label className="flex items-center gap-3 p-2.5 rounded bg-[#181614] border border-[#24211E] hover:border-[#D4AF37]/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={giftBox}
                      onChange={(e) => setGiftBox(e.target.checked)}
                      aria-label="Include presentation gift box"
                      className="accent-[#D4AF37] w-4 h-4 rounded"
                    />
                    <div className="flex-1 flex justify-between items-center text-xs">
                      <span className="text-[#D3C7B8] text-[10px] font-bold tracking-wider">
                        {customizationProfile.fields.find((f) => f.id === "giftBox")?.label}
                      </span>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* -------------------------------------------------- */}
            {/* QUANTITY & PRIMARY ACTION BUTTONS */}
            {/* -------------------------------------------------- */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#333] rounded bg-[#161412] px-3 py-2">
                  <span className="text-[9px] tracking-widest text-[#888] mr-3 uppercase">QTY</span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-[#888] hover:text-[#D4AF37] px-2 font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#F7F4ED]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="text-[#888] hover:text-[#D4AF37] px-2 font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal Preview */}
                <div className="text-right flex-1">
                  <span className="text-[9px] text-[#888] tracking-widest block uppercase">LINE TOTAL</span>
                  <span className="text-base font-bold text-[#F7F4ED] tracking-wider">
                    Rs. {totalLinePrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* ADD TO BAG */}
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5C358] text-black font-bold tracking-[0.22em] text-xs uppercase rounded transition-colors shadow-lg shadow-[#D4AF37]/20"
                >
                  {product.sizes && product.sizes.length > 0 && !selectedSize
                    ? "SELECT A SIZE"
                    : "ADD TO BAG"}
                </button>

                {/* BUY NOW */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#F7F4ED] hover:bg-white text-black font-bold tracking-[0.22em] text-xs uppercase rounded transition-colors"
                >
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Atelier Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#24211E] text-center text-[8px] tracking-[0.18em] text-[#A3998C] uppercase">
              <div className="p-2 rounded bg-[#12100E] border border-[#24211E]">
                <span className="text-[#D4AF37] block font-bold mb-1">HANDCRAFTED</span>
                <span>Made in Atelier</span>
              </div>
              <div className="p-2 rounded bg-[#12100E] border border-[#24211E]">
                <span className="text-[#D4AF37] block font-bold mb-1">INSURED</span>
                <span>White-Glove Delivery</span>
              </div>
              <div className="p-2 rounded bg-[#12100E] border border-[#24211E]">
                <span className="text-[#D4AF37] block font-bold mb-1">MW VAULT</span>
                <span>Authenticity Seal</span>
              </div>
            </div>

            {/* -------------------------------------------------- */}
            {/* ACCORDION TABS: Story, Specs, Care, Delivery */}
            {/* -------------------------------------------------- */}
            <div className="pt-4 border-t border-[#24211E] space-y-2">
              {/* Tab Selector */}
              <div className="flex border-b border-[#24211E] text-[10px] font-bold tracking-widest uppercase">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeTab === "story"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888] hover:text-white"
                  }`}
                >
                  STORY
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeTab === "specs"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888] hover:text-white"
                  }`}
                >
                  SPECS
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeTab === "care"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888] hover:text-white"
                  }`}
                >
                  CARE
                </button>
                <button
                  onClick={() => setActiveTab("delivery")}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${
                    activeTab === "delivery"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888] hover:text-white"
                  }`}
                >
                  DELIVERY
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-3 text-xs text-[#A3998C] leading-relaxed">
                {activeTab === "story" && (
                  <p>
                    {product.description ||
                      `${product.name} embodies the timeless luxury ethos of MW Trends. Meticulously engineered from refined raw materials with artisanal hand-finishing, this creation is tailored for enduring elegance.`}
                  </p>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-2">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-[#1A1816] text-[11px]">
                          <span className="text-[#888]">{key}</span>
                          <span className="text-[#F7F4ED] font-medium">{val}</span>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between"><span>Category</span><span className="text-[#F7F4ED]">{product.categorySlug}</span></div>
                        <div className="flex justify-between"><span>Origin</span><span className="text-[#F7F4ED]">MW Trends Atelier</span></div>
                        <div className="flex justify-between"><span>Warranty</span><span className="text-[#F7F4ED]">Atelier Authenticity</span></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="text-[11px] space-y-2">
                    {product.careInstructions && product.careInstructions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {product.careInstructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        Preserve in low humidity away from direct sunlight. Handle with care using clean cotton gloves for metal & ceramic finishes.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "delivery" && (
                  <div className="text-[11px] space-y-2">
                    <p>
                      Each order is individually curated and dispatched in our signature MW graphite & gold gift box.
                    </p>
                    <p className="text-[#D4AF37]">
                      • Standard Luxury Courier: 2–3 Business Days<br />
                      • Cash on Delivery (COD) & Online Bank Transfer available at checkout.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------------------------------------- */}
            {/* CLIENT REVIEWS SUMMARY */}
            {/* -------------------------------------------------- */}
            <div className="pt-4 border-t border-[#24211E] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#F7F4ED] uppercase">
                  CLIENT TESTIMONIALS
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">★ 4.9 / 5.0</span>
              </div>
              <p className="text-[11px] text-[#A3998C] italic">
                &ldquo;Exceptional craftsmanship. The custom inscription is razor-sharp and the fabric weight is museum grade.&rdquo;
              </p>
              <span className="text-[9px] text-[#666] tracking-widest block uppercase">
                — Verified Collector, Lahore
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. RELATED ATELIER CREATIONS ("YOU MAY ALSO LIKE") */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 px-6 md:px-12 py-16 border-t border-[#24211E] bg-[#0A0908]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                  COMPLEMENTARY ATELIER PIECES
                </span>
                <h3 className="text-xl md:text-2xl font-bold tracking-wider text-[#F7F4ED] uppercase">
                  YOU MAY ALSO CURATE
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}?shop=${rel.categorySlug}&floor=${floorNumber}`}
                    className="group block p-4 rounded bg-[#12100E] border border-[#24211E] hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="aspect-[4/5] relative bg-[#060605] rounded mb-3 overflow-hidden">
                      {rel.images[0] && (
                        <Image
                          src={rel.images[0]}
                          alt={rel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold tracking-wider text-[#F7F4ED] group-hover:text-[#D4AF37] transition-colors">
                          {rel.name}
                        </h4>
                        <span className="text-[9px] text-[#888] tracking-widest uppercase">
                          {rel.categorySlug}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {rel.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ======================================================== */}
      {/* 4. MOBILE STICKY COMMERCE BAR (< 1024px) */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0D0B0A]/95 backdrop-blur-md border-t border-[#D4AF37]/20 p-3.5 lg:hidden z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#D4AF37]">
            Rs. {totalUnitPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[9px] text-[#888] truncate max-w-[150px]">
            {selectedVariant?.name || "Standard"} {selectedSize ? `• ${selectedSize.label}` : ""}
          </span>
        </div>

        <button
          onClick={handleAddToBag}
          className="flex-1 max-w-[200px] py-3 bg-[#D4AF37] hover:bg-[#E5C358] text-black font-bold tracking-[0.2em] text-[10px] text-center rounded transition-colors uppercase"
        >
          {product.sizes && product.sizes.length > 0 && !selectedSize ? "SELECT SIZE" : "ADD TO BAG"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Export wrapped in Suspense for Safe SSR / Next.js Hydration
// ---------------------------------------------------------------------------
export default function ProductDetailClient({ slug }: { slug: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080706] text-[#F7F4ED] flex flex-col items-center justify-center">
          <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase animate-pulse mb-3">
            ENTERING ATELIER SUITE
          </span>
          <div className="w-16 h-[1px] bg-[#D4AF37]/40" />
        </div>
      }
    >
      <ProductDetailContent slug={slug} />
    </Suspense>
  );
}
