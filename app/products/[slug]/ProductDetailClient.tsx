"use client";

import { useState, useEffect } from "react";
import { getProductBySlug, Product, ProductVariant, ProductSize } from "@/lib/data/mockCatalog";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductViewer3D from "@/components/shop/ProductViewer3D";
import AddToCartSequence from "@/components/shop/AddToCartSequence";
import { useStore } from "@/lib/store/useStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { notFound } from "next/navigation";

function CartBadge() {
  const items = useCartStore(state => state.items);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  if (count === 0) return null;
  return (
    <div className="absolute -top-1 -right-2 bg-[#D4AF37] text-black text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
      {count}
    </div>
  );
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeMedia, setActiveMedia] = useState<'3d' | 'image' | 'alternate'>('image');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { setMode, setActiveShop } = useStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    const data = getProductBySlug(slug);
    if (data) {
      setProduct(data);
      if (data.variants.length > 0) setSelectedVariant(data.variants[0]);
      if (data.has3D) setActiveMedia('3d');
    } else {
      notFound();
    }
  }, [slug]);

  if (!product) {
    return <div className="min-h-screen bg-[#050505] text-[#F7F4ED] flex items-center justify-center">Loading product...</div>;
  }

  const handleAddToBag = () => {
    if (product.sizes && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    setIsAdding(true);
    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
    });
    // Add to cart animation completes on its own now.
  };

  const handleViewInWorld = () => {
    if (product.worldShop) {
      setActiveShop(product.worldShop as any);
      setMode('world');
      // A full implementation would router.push('/') then trigger Product Focus Mode
    }
  };

  return (
    <div className="pointer-events-auto min-h-screen bg-[#050505] text-[#F7F4ED] font-sans selection:bg-[#D4AF37] selection:text-[#050505] pb-24">
      <header className="fixed top-0 w-full h-16 flex items-center justify-between px-8 z-50 mix-blend-difference pointer-events-auto">
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-sm font-bold tracking-[0.2em]">MW TRENDS</Link>
          <Link href="/shop" className="text-xs font-semibold tracking-widest hover:text-[#D4AF37] transition-colors ml-4 hidden md:block">BACK TO SHOP</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/wishlist" className="text-xs font-semibold tracking-widest hover:text-[#D4AF37] transition-colors flex items-center gap-2">
            <span className="hidden md:inline">VAULT</span>
            <div className="w-4 h-4 border border-current rotate-45" />
          </Link>
          <button 
            onClick={() => useCartStore.getState().setMiniCartOpen(true)}
            className="text-xs font-semibold tracking-widest hover:text-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <span className="hidden md:inline">BAG</span>
            <div className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <CartBadge />
            </div>
          </button>
        </div>
      </header>

      {/* Signature MW Add To Cart Animation */}
      <AddToCartSequence isActive={isAdding} product={product} onComplete={() => setIsAdding(false)} />

      <main className="max-w-[1600px] mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row min-h-screen">
          
          {/* LEFT: 60% MEDIA STAGE */}
          <div className="w-full lg:w-[60%] lg:h-screen lg:sticky top-0 bg-[#0a0a0b] flex flex-col relative overflow-hidden">
            {/* Media Toggle */}
            {product.has3D && (
              <div className="absolute top-20 left-8 z-10 flex gap-2">
                <button 
                  onClick={() => setActiveMedia('image')}
                  className={`px-4 py-2 text-[10px] tracking-widest border transition-all ${activeMedia === 'image' || activeMedia === 'alternate' ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#333] text-[#888] hover:border-white'}`}
                >
                  PHOTO
                </button>
                <button 
                  onClick={() => setActiveMedia('3d')}
                  className={`px-4 py-2 text-[10px] tracking-widest border transition-all ${activeMedia === '3d' ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#333] text-[#888] hover:border-white'}`}
                >
                  3D VIEW
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-20 right-8 z-10 flex flex-col items-end gap-2">
              {product.isNew && <span className="text-[9px] tracking-widest px-2 py-1 bg-[#F7F4ED] text-[#050505] font-bold">NEW DROP</span>}
              {product.isBestSeller && <span className="text-[9px] tracking-widest px-2 py-1 border border-[#D4AF37] text-[#D4AF37]">BEST SELLER</span>}
            </div>

            {/* Stage */}
            <div className="flex-1 w-full relative h-[60vh] lg:h-full">
              {activeMedia === '3d' && selectedVariant ? (
                <ProductViewer3D colorCode={selectedVariant.colorCode || '#ffffff'} productType={product.category} />
              ) : (
                <div className="w-full h-full relative">
                  <Image 
                    src={activeMedia === 'alternate' && product.images[1] ? product.images[1] : product.images[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Image Gallery Thumbnails */}
            {activeMedia !== '3d' && product.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                <button onClick={() => setActiveMedia('image')} className={`w-12 h-12 border ${activeMedia === 'image' ? 'border-[#D4AF37]' : 'border-transparent'} relative`}>
                  <Image src={product.images[0]} alt="Front" fill className="object-cover" />
                </button>
                <button onClick={() => setActiveMedia('alternate')} className={`w-12 h-12 border ${activeMedia === 'alternate' ? 'border-[#D4AF37]' : 'border-transparent'} relative`}>
                  <Image src={product.images[1]} alt="Alternate" fill className="object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: 40% PRODUCT INFO & PURCHASE PANEL */}
          <div className="w-full lg:w-[40%] px-8 lg:px-16 py-12 lg:py-32 overflow-y-auto">
            {/* Breadcrumbs */}
            <div className="text-[10px] tracking-widest text-[#666] mb-8">
              HOME / {product.category.toUpperCase()} / <span className="text-[#F7F4ED]">{product.name}</span>
            </div>

            {/* Title & Price */}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-wider mb-2">{product.name}</h1>
            <p className="text-sm text-[#888] mb-6">{product.shortDescription}</p>
            <div className="text-xl mb-10 flex items-center gap-4">
              <span className="text-[#F7F4ED]">{product.price}</span>
              {product.compareAtPrice && <span className="text-[#666] line-through text-sm">{product.compareAtPrice}</span>}
            </div>

            {/* Color Variants */}
            {product.variants.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs tracking-widest text-[#888]">COLOR</span>
                  <span className="text-xs font-semibold">{selectedVariant?.name}</span>
                </div>
                <div className="flex gap-4">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedVariant?.id === v.id ? 'border-2 border-[#D4AF37] p-1' : 'border border-[#333]'}`}
                      aria-label={`Select color ${v.name}`}
                    >
                      <span className="w-full h-full rounded-full block border border-white/10" style={{ backgroundColor: v.colorCode }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {product.sizes && (
              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs tracking-widest text-[#888]">SIZE</span>
                  <button className="text-[10px] tracking-widest text-[#D4AF37] underline underline-offset-4 decoration-[#D4AF37]/40 hover:decoration-[#D4AF37] transition-all">
                    SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs tracking-widest border transition-all ${
                        !s.isAvailable ? 'border-[#222] text-[#444] cursor-not-allowed relative overflow-hidden' :
                        selectedSize?.id === s.id ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' :
                        'border-[#333] text-[#F7F4ED] hover:border-[#F7F4ED]'
                      }`}
                    >
                      {s.label}
                      {!s.isAvailable && <span className="absolute inset-0 bg-[#444] h-[1px] w-[150%] -rotate-45 origin-center top-1/2 -left-2" />}
                    </button>
                  ))}
                </div>
                
                {/* Fit Info */}
                {product.fit && (
                  <div className="mt-4 p-4 border border-[#222] bg-[#111] text-xs text-[#aaa] leading-relaxed">
                    {product.fit}
                  </div>
                )}
              </div>
            )}

            {/* Primary Actions */}
            <div className="space-y-4 mb-12">
              <button 
                onClick={handleAddToBag}
                className="w-full py-5 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-xs hover:bg-[#D4AF37] transition-colors"
              >
                {product.sizes && !selectedSize ? 'SELECT A SIZE' : 'ADD TO BAG'}
              </button>
              
              {product.isCustomizable && (
                <Link href={`/customize/${product.slug}`} className="w-full py-4 border border-[#F7F4ED] text-[#F7F4ED] font-bold tracking-[0.2em] text-xs hover:bg-[#F7F4ED]/10 transition-colors flex items-center justify-center gap-2">
                  <span>CUSTOMIZE THIS</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </Link>
              )}
            </div>

            {/* Trust Elements */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-[#222] py-6 mb-12 text-[10px] tracking-widest text-[#888]">
              <div className="flex flex-col gap-1">
                <span className="text-[#D4AF37]">MADE TO ORDER</span>
                <span>Produced in 2-3 days</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#F7F4ED]">SECURE DELIVERY</span>
                <span>COD available at checkout</span>
              </div>
            </div>

            {/* View in MW World Link */}
            {product.worldShop && (
              <div className="mb-12 p-6 bg-[#111] border border-[#222] flex items-center justify-between group cursor-pointer" onClick={handleViewInWorld}>
                <div>
                  <h3 className="text-xs font-bold tracking-widest mb-1 text-[#F7F4ED]">VIEW IN MW WORLD</h3>
                  <p className="text-[10px] tracking-widest text-[#888]">Found in: {product.worldShop.toUpperCase()}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                  →
                </div>
              </div>
            )}

            {/* Specs & Care Accordions */}
            <div className="space-y-4">
              {product.specifications && (
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#222] text-xs tracking-widest font-bold text-[#F7F4ED]">
                    SPECIFICATIONS
                    <span className="transition group-open:rotate-180">↓</span>
                  </summary>
                  <div className="py-4 text-xs text-[#888] space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[#F7F4ED]">{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              
              {product.careInstructions && (
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#222] text-xs tracking-widest font-bold text-[#F7F4ED]">
                    CARE INSTRUCTIONS
                    <span className="transition group-open:rotate-180">↓</span>
                  </summary>
                  <ul className="py-4 text-xs text-[#888] space-y-2 list-disc list-inside">
                    {product.careInstructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM: EDITORIAL STORYTELLING & DESIGN FAMILY */}
        {product.storySections && (
          <div className="w-full bg-[#111111] border-t border-[#222] py-24 px-8 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-32">
              {product.storySections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col gap-6 text-center"
                >
                  <h2 className="text-2xl lg:text-4xl font-bold tracking-wider text-[#D4AF37]">{section.title}</h2>
                  <p className="text-sm lg:text-base text-[#aaa] leading-relaxed max-w-2xl mx-auto">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CROSS-SELL: SAME DESIGN, DIFFERENT CANVAS */}
        {product.designFamilyId && (
          <div className="w-full bg-[#050505] py-24 px-8 lg:px-24">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-[10px] tracking-[0.3em] text-[#D4AF37] mb-4">LOVE THIS DESIGN?</h3>
                <h2 className="text-3xl font-bold tracking-widest text-[#F7F4ED]">TRY IT ON ANOTHER CANVAS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Mocked Cross-Sell Items based on Midnight-01 family */}
                <Link href="/products/signature-mug" className="group block">
                  <div className="aspect-[4/5] bg-[#111] border border-[#222] mb-4 relative overflow-hidden flex items-center justify-center p-8">
                    <span className="text-[10px] tracking-widest text-[#666] absolute bottom-4">CERAMIC MUG</span>
                    <div className="w-full h-full border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors bg-[url('/placeholder-mug-1.jpg')] bg-cover bg-center" />
                  </div>
                  <h4 className="text-xs font-bold tracking-widest mb-1 text-[#F7F4ED]">SIGNATURE MUG</h4>
                  <p className="text-[10px] tracking-widest text-[#888]">Rs. 899</p>
                </Link>
                <Link href="/products/monogram-phone-case" className="group block">
                  <div className="aspect-[4/5] bg-[#111] border border-[#222] mb-4 relative overflow-hidden flex items-center justify-center p-8">
                    <span className="text-[10px] tracking-widest text-[#666] absolute bottom-4">MATTE CASE</span>
                    <div className="w-full h-full border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors bg-[url('/placeholder-case-1.jpg')] bg-cover bg-center" />
                  </div>
                  <h4 className="text-xs font-bold tracking-widest mb-1 text-[#F7F4ED]">MONOGRAM CASE</h4>
                  <p className="text-[10px] tracking-widest text-[#888]">Rs. 999</p>
                </Link>
                <Link href="/products/memory-frame-01" className="group block">
                  <div className="aspect-[4/5] bg-[#111] border border-[#222] mb-4 relative overflow-hidden flex items-center justify-center p-8">
                    <span className="text-[10px] tracking-widest text-[#666] absolute bottom-4">METAL FRAME</span>
                    <div className="w-full h-full border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors bg-[url('/placeholder-frame-1.jpg')] bg-cover bg-center" />
                  </div>
                  <h4 className="text-xs font-bold tracking-widest mb-1 text-[#F7F4ED]">MEMORY FRAME 01</h4>
                  <p className="text-[10px] tracking-widest text-[#888]">Rs. 1,499</p>
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Mobile Sticky Add To Bag (only visible on small screens when scrolled past original CTA) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-[#222] p-4 lg:hidden z-50 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#F7F4ED]">{product.price}</span>
          <span className="text-[10px] text-[#888]">{selectedVariant?.name} {selectedSize && `/ ${selectedSize.label}`}</span>
        </div>
        <button 
          onClick={handleAddToBag}
          className="flex-1 py-3 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-xs text-center"
        >
          {product.sizes && !selectedSize ? 'SELECT SIZE' : 'ADD TO BAG'}
        </button>
      </div>
    </div>
  );
}
