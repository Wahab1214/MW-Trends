"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FinalCheckModal from "@/components/shop/FinalCheckModal";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PackingRoomPage() {
  const { items, recentlyRemoved, updateQuantity, removeItem, undoRemove, saveForLater } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutComplete = () => {
    setIsCheckingOut(false);
    router.push('/checkout');
  };

  return (
    <div className="pointer-events-auto min-h-screen bg-[#050505] text-[#F7F4ED] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#222] bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/shop" className="text-xs font-bold tracking-[0.2em] hover:text-[#D4AF37] transition-colors">
          ← BACK TO SHOP
        </Link>
        <span className="text-[10px] tracking-[0.3em] font-bold text-[#D4AF37]">THE PACKING ROOM</span>
        <Link href="/wishlist" className="text-xs font-semibold tracking-widest hover:text-[#D4AF37] transition-colors">
          MW VAULT
        </Link>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* LEFT: Product Staging Area */}
        <div className="flex-[2] flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-widest mb-8">YOUR BAG</h1>

          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col md:flex-row gap-6 p-6 border border-[#222] bg-[#0a0a0b] relative group"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-40 aspect-[4/5] relative bg-[#111] border border-[#222] shrink-0 overflow-hidden flex items-center justify-center">
                  {item.designConfig && item.designConfig.length > 0 ? (
                    <>
                      <div className="absolute top-2 left-2 text-[8px] text-[#D4AF37] tracking-widest border border-[#D4AF37]/30 px-2 py-1 z-10">CUSTOM</div>
                      <div className="w-[60%] h-[70%] border border-dashed border-[#333] flex items-center justify-center">
                         <span className="text-[10px] text-[#666] tracking-widest text-center">ARTWORK<br/>PREVIEW</span>
                      </div>
                    </>
                  ) : (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover opacity-80" />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold tracking-wider">{item.product.name}</h3>
                      <span className="text-sm font-bold tracking-wider">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="text-xs tracking-widest text-[#888] space-y-1 mb-6">
                      {item.variant && <p>COLOR: {item.variant.name}</p>}
                      {item.size && <p>SIZE: {item.size.label}</p>}
                      {item.designConfig && item.designConfig.length > 0 && <p className="text-[#D4AF37]">MW DESIGN READY</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center justify-between border-t border-[#222] pt-4 mt-auto">
                    {/* Actions */}
                    <div className="flex items-center gap-4 text-[10px] tracking-widest text-[#666]">
                      {item.designConfig && item.designConfig.length > 0 && (
                        <button 
                          onClick={() => router.push(`/customize/${item.product.slug}`)} 
                          className="hover:text-[#F7F4ED] underline underline-offset-4"
                        >
                          EDIT DESIGN
                        </button>
                      )}
                      <button onClick={() => saveForLater(item.id)} className="hover:text-[#F7F4ED]">SAVE TO VAULT</button>
                      <button onClick={() => removeItem(item.id)} className="hover:text-red-400">REMOVE</button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 border border-[#333] px-3 py-2 bg-[#111]">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#888] hover:text-white text-xs">−</button>
                      <span className="text-xs text-[#F7F4ED] w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#888] hover:text-white text-xs">+</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Undo Remove Toast */}
            {recentlyRemoved && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-between"
              >
                <span className="text-xs tracking-widest text-[#D4AF37]">{recentlyRemoved.product.name} removed.</span>
                <button onClick={undoRemove} className="text-xs font-bold tracking-widest text-[#F7F4ED] hover:text-[#D4AF37] underline underline-offset-4">UNDO</button>
              </motion.div>
            )}

            {items.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center border border-dashed border-[#333]">
                <h3 className="text-xl tracking-widest font-bold mb-4 text-[#888]">YOUR BAG IS WAITING FOR A STORY.</h3>
                <Link href="/shop" className="px-8 py-4 border border-[#F7F4ED] text-xs font-bold tracking-widest hover:bg-[#F7F4ED] hover:text-black transition-colors">
                  EXPLORE MW WORLD
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="flex-1 lg:sticky lg:top-24 h-max">
          <div className="border border-[#222] bg-[#0a0a0b] p-8 flex flex-col">
            <h2 className="text-lg font-bold tracking-widest mb-8 border-b border-[#222] pb-4">ORDER SUMMARY</h2>

            <div className="space-y-4 text-sm tracking-widest mb-8">
              <div className="flex justify-between text-[#888]">
                <span>Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span className="text-[#F7F4ED]">Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#F7F4ED] border-t border-[#222] pt-4 mt-4">
                <span>TOTAL</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              disabled={items.length === 0}
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-4 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-xs text-center hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10">PROCEED TO CHECKOUT</span>
              <div className="absolute inset-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-300 ease-out z-0" />
            </button>

            {items.some(i => i.designConfig) && (
              <p className="text-[10px] tracking-widest text-[#888] mt-6 text-center border border-[#222] p-3 bg-[#111]">
                CUSTOM ITEMS ARE MADE AFTER ORDER CONFIRMATION.
              </p>
            )}
          </div>
        </div>

      </main>

      {/* MW Final Check Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <FinalCheckModal onClose={() => setIsCheckingOut(false)} onComplete={handleCheckoutComplete} cartItems={items} />
        )}
      </AnimatePresence>
    </div>
  );
}
