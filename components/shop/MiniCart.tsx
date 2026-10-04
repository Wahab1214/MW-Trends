"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MiniCart() {
  const { items, isMiniCartOpen, setMiniCartOpen, updateQuantity, removeItem } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-[#050505]/60 backdrop-blur-sm z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
          />
          <motion.div 
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0b] border-l border-[#222] z-[160] flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0a0a0b] shrink-0">
              <h2 className="text-xs font-bold tracking-[0.3em] text-[#D4AF37]">YOUR BAG</h2>
              <button onClick={() => setMiniCartOpen(false)} className="text-[#888] hover:text-white transition-colors">✕</button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border border-[#222] rotate-45 mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border border-[#333]" />
                  </div>
                  <h3 className="text-[#F7F4ED] tracking-widest text-sm mb-2">YOUR BAG IS WAITING FOR A STORY.</h3>
                  <p className="text-[#666] text-xs mb-8">Discover the MW Collection or create your own.</p>
                  <Link href="/shop" onClick={() => setMiniCartOpen(false)} className="px-6 py-3 border border-[#F7F4ED] text-[10px] tracking-widest hover:bg-[#F7F4ED] hover:text-black transition-colors">
                    QUICK SHOP
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-[#222] bg-[#111] relative group">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 relative bg-[#050505] border border-[#222] shrink-0">
                      {item.designConfig && item.designConfig.length > 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#D4AF37] tracking-widest text-center p-2 border border-[#D4AF37]/20">
                          CUSTOM<br/>DESIGN
                        </div>
                      ) : (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover opacity-80" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold tracking-wider text-[#F7F4ED]">{item.product.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-[#666] hover:text-white text-[10px] tracking-widest">✕</button>
                        </div>
                        <div className="text-[10px] tracking-widest text-[#888] mt-1 space-y-1">
                          {item.variant && <p>COLOR: {item.variant.name}</p>}
                          {item.size && <p>SIZE: {item.size.label}</p>}
                          {item.designConfig && item.designConfig.length > 0 && <p className="text-[#D4AF37]">DESIGN READY</p>}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 border border-[#333] px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#888] hover:text-white text-xs">−</button>
                          <span className="text-[10px] text-[#F7F4ED] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#888] hover:text-white text-xs">+</button>
                        </div>
                        <span className="text-xs font-bold tracking-wider">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Edit Design Hover Overlay for Custom Items */}
                    {item.designConfig && item.designConfig.length > 0 && (
                      <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setMiniCartOpen(false);
                            // Real app would load item.designConfig into Customizer store first
                            router.push(`/customize/${item.product.slug}`);
                          }} 
                          className="px-6 py-2 bg-[#F7F4ED] text-black text-[10px] tracking-widest font-bold hover:bg-[#D4AF37]"
                        >
                          EDIT DESIGN
                        </button>
                        <p className="text-[8px] text-[#888] tracking-widest">MW-DESIGN-{item.id.slice(0,5).toUpperCase()}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#222] bg-[#0a0a0b] shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs tracking-widest text-[#888]">SUBTOTAL</span>
                  <span className="text-lg font-bold tracking-wider">Rs. {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-3">
                  <Link href="/checkout" onClick={() => setMiniCartOpen(false)} className="block w-full py-4 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-[10px] text-center hover:bg-[#D4AF37] transition-colors">
                    PROCEED TO CHECKOUT
                  </Link>
                  <Link href="/cart" onClick={() => setMiniCartOpen(false)} className="block w-full py-4 border border-[#333] text-[#888] font-bold tracking-[0.2em] text-[10px] text-center hover:text-white transition-colors">
                    VIEW PACKING ROOM
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
