"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { savedItems, moveToBag, removeFromVault } = useCartStore();
  const router = useRouter();

  return (
    <div className="pointer-events-auto min-h-screen bg-[#050505] text-[#F7F4ED] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#222] bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/shop" className="text-xs font-bold tracking-[0.2em] hover:text-[#D4AF37] transition-colors">
          ← EXPLORE
        </Link>
        <span className="text-[10px] tracking-[0.3em] font-bold text-[#F7F4ED]">MW VAULT</span>
        <Link href="/cart" className="text-xs font-semibold tracking-widest hover:text-[#D4AF37] transition-colors">
          BAG
        </Link>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-widest text-center">SAVED ITEMS</h1>
          <p className="text-[#888] text-xs tracking-widest text-center mt-4 uppercase">Your personal collection</p>
        </div>

        {savedItems.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-[#222] max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-[#111] rotate-45 mb-8 flex items-center justify-center border border-[#333]">
              <div className="w-2 h-2 bg-[#888] rounded-full" />
            </div>
            <h3 className="text-sm tracking-widest font-bold mb-4 text-[#888]">YOUR VAULT IS EMPTY</h3>
            <Link href="/shop" className="px-8 py-4 border border-[#F7F4ED] text-[10px] font-bold tracking-widest hover:bg-[#F7F4ED] hover:text-black transition-colors">
              DISCOVER MW WORLD
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {savedItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#0a0a0b] border border-[#222] group flex flex-col"
                >
                  <div className="aspect-[4/5] relative bg-[#111] overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => router.push(`/products/${item.product.slug}`)}>
                    {item.designConfig && item.designConfig.length > 0 ? (
                      <>
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                          <span className="text-[8px] tracking-widest bg-[#D4AF37] text-black px-2 py-1 font-bold">SAVED DESIGN</span>
                        </div>
                        <div className="w-[60%] h-[70%] border border-dashed border-[#333] flex items-center justify-center relative z-0">
                           <span className="text-[10px] text-[#666] tracking-widest text-center">ARTWORK<br/>PREVIEW</span>
                        </div>
                      </>
                    ) : (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    )}
                    
                    {/* Vault Marker */}
                    <div className="absolute top-4 right-4 z-10 w-6 h-6 border border-[#D4AF37] rotate-45 flex items-center justify-center bg-[#050505]/80">
                      <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-sm font-bold tracking-wider mb-2">{item.product.name}</h3>
                    <div className="text-[10px] tracking-widest text-[#888] space-y-1 mb-6 flex-1">
                      {item.variant && <p>{item.variant.name}</p>}
                      {item.size && <p>Size {item.size.label}</p>}
                      <p className="text-[#F7F4ED] mt-2">Rs. {parseInt(item.product.price.replace(/\D/g, '')).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                      <button 
                        onClick={() => moveToBag(item.id)} 
                        className="w-full py-3 bg-[#F7F4ED] text-[#050505] font-bold tracking-widest text-[10px] hover:bg-[#D4AF37] transition-colors"
                      >
                        MOVE TO BAG
                      </button>
                      <div className="flex gap-2">
                        {item.designConfig && item.designConfig.length > 0 && (
                          <button 
                            onClick={() => router.push(`/customize/${item.product.slug}`)}
                            className="flex-1 py-3 border border-[#333] text-[#888] text-[10px] tracking-widest hover:text-white"
                          >
                            EDIT
                          </button>
                        )}
                        <button 
                          onClick={() => removeFromVault(item.id)}
                          className="flex-1 py-3 border border-[#333] text-[#888] text-[10px] tracking-widest hover:text-red-400"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
