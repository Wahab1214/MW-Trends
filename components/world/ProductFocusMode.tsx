"use client";

import { useStore } from "@/lib/store/useStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductBySlug, Product, ProductVariant } from "@/lib/data/mockCatalog";
import Link from "next/link";
import AddToCartSequence from "@/components/shop/AddToCartSequence";

export default function ProductFocusMode() {
  const { focusedProduct, setFocusedProduct } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleOpenFocus = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setFocusedProduct(customEvent.detail as unknown as Product);
    };
    window.addEventListener('OPEN_PRODUCT_FOCUS', handleOpenFocus);
    return () => window.removeEventListener('OPEN_PRODUCT_FOCUS', handleOpenFocus);
  }, [setFocusedProduct]);

  useEffect(() => {
    // focusedProduct could be a string slug or a Product object depending on legacy code.
    const slug = typeof focusedProduct === 'string' ? focusedProduct : focusedProduct?.slug;
    if (slug) {
      const data = getProductBySlug(slug);
      if (data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProduct(data);
        if (data.variants && data.variants.length > 0) setSelectedVariant(data.variants[0]);
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProduct(null);
    }
  }, [focusedProduct]);

  const handleAddToBag = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setFocusedProduct(null);
    }, 1500);
  };

  return (
    <>
      <AddToCartSequence isActive={isAdding} product={product} onComplete={() => {}} />

      <AnimatePresence>
        {focusedProduct && product && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-end pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background Dim (Environment reduces intensity) */}
            <motion.div 
              className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFocusedProduct(null)}
            />

            {/* Product Focus Info Panel (Slides in from right) */}
            <motion.div 
              className="w-full lg:w-[400px] h-full bg-[#0a0a0b] border-l border-[#222] shadow-2xl relative z-10 flex flex-col pointer-events-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#222]">
                <span className="text-[10px] tracking-widest text-[#888]">QUICK VIEW</span>
                <button 
                  onClick={() => setFocusedProduct(null)}
                  className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#F7F4ED] transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-wider text-[#F7F4ED] mb-2">{product.name}</h2>
                  <p className="text-sm text-[#888] mb-4">{product.shortDescription}</p>
                  <div className="text-lg text-[#F7F4ED]">{product.price}</div>
                </div>

                {/* Color Variants Quick Selection */}
                {product.variants.length > 0 && (
                  <div>
                    <div className="text-[10px] tracking-widest text-[#888] mb-3">COLOR: {selectedVariant?.name.toUpperCase()}</div>
                    <div className="flex gap-3">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedVariant?.id === v.id ? 'border border-[#D4AF37] p-[2px]' : 'border border-[#333]'}`}
                        >
                          <span className="w-full h-full rounded-full block border border-white/10" style={{ backgroundColor: v.colorCode }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Size Preview (Selection disabled in quick view) */}
                {product.sizes && (
                  <div>
                    <div className="text-[10px] tracking-widest text-[#888] mb-3">AVAILABLE SIZES</div>
                    <div className="flex gap-2">
                      {product.sizes.map((s) => (
                        <div key={s.id} className={`w-8 h-8 flex items-center justify-center text-[10px] tracking-widest border ${s.isAvailable ? 'border-[#333] text-[#F7F4ED]' : 'border-[#222] text-[#444] opacity-50'}`}>
                          {s.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-[#222] flex flex-col gap-3 bg-[#0a0a0b]">
                {/* Note: Full selection requires going to PDP, but for quick-add we can fake it or force full details */}
                {product.sizes ? (
                  <Link 
                    href={`/products/${product.slug}`}
                    className="w-full py-4 border border-[#F7F4ED] text-[#F7F4ED] font-bold tracking-[0.2em] text-[10px] text-center hover:bg-[#F7F4ED]/10 transition-colors"
                  >
                    SELECT OPTIONS
                  </Link>
                ) : (
                  <button 
                    onClick={handleAddToBag}
                    className="w-full py-4 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-[10px] text-center hover:bg-[#D4AF37] transition-colors"
                  >
                    ADD TO BAG
                  </button>
                )}
                <Link 
                  href={`/products/${product.slug}`}
                  className="w-full py-4 text-[#888] font-bold tracking-[0.2em] text-[10px] text-center hover:text-[#F7F4ED] transition-colors"
                >
                  VIEW FULL DETAILS
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
