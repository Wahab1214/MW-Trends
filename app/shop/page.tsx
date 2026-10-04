"use client";

import { useStore } from "@/lib/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MOCK_CATALOG } from "@/lib/data/mockCatalog";
import ProductCard from "@/components/shop/ProductCard";
import { motion } from "framer-motion";

export default function QuickShop() {
  const { setMode } = useStore();
  const router = useRouter();

  // Ensure mode is set if user lands directly on this route
  useEffect(() => {
    setMode('quick-shop');
  }, [setMode]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0 z-[80] bg-[#050505]/95 backdrop-blur-xl overflow-y-auto pointer-events-auto"
    >
      <div className="sticky top-0 z-20 bg-[#050505]/90 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-[#1B1B1B]">
        <div className="text-xl font-bold tracking-[0.3em] text-[#D4AF37]">
          MW QUICK SHOP
        </div>
        <button 
          onClick={() => {
            setMode('world');
            router.push('/');
          }}
          className="px-6 py-3 text-xs tracking-widest border border-white/20 hover:border-[#D4AF37] transition-colors"
        >
          RETURN TO 3D WORLD
        </button>
      </div>
      
      <div className="px-12 py-16 max-w-7xl mx-auto">
        <h2 className="text-xs tracking-[0.3em] text-[#9B9B9B] mb-2">CURATED COLLECTION</h2>
        <h3 className="text-4xl tracking-tight mb-16 text-[#F7F4ED]">Latest Drops</h3>
        
        <div className="flex gap-8 mb-12 border-b border-[#111111] pb-4">
          <button className="text-sm tracking-wider text-[#D4AF37] border-b border-[#D4AF37] pb-4 -mb-[17px]">ALL PRODUCTS</button>
          <button className="text-sm tracking-wider text-[#9B9B9B] hover:text-[#F7F4ED] pb-4">APPAREL</button>
          <button className="text-sm tracking-wider text-[#9B9B9B] hover:text-[#F7F4ED] pb-4">OBJECTS</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {MOCK_CATALOG.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
