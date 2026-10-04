"use client";

import { motion, AnimatePresence } from "framer-motion";
import WorldNav from "@/components/ui/WorldNav";
import ProductFocusMode from "@/components/world/ProductFocusMode";
import { useStore } from "@/lib/store/useStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { hasEntered, setHasEntered, setMode, setActiveShop } = useStore();
  const router = useRouter();

  const handleToggleQuickShop = () => {
    setMode('quick-shop');
    router.push('/shop');
  };

  const handleNavigate = (target: string) => {
    setActiveShop(target as any);
  };

  return (
    <main className="w-full h-full relative">
      
      {/* Entrance Sequence Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div 
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center pointer-events-auto"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle radial gradient to help text readability over the 3D scene */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-[#050505]/20 pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              className="text-center relative z-10"
            >
              {/* Premium MW SVG Logo Trace */}
              <div className="mx-auto mb-12 w-24 h-24 flex items-center justify-center relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    d="M 12,52 L 22,20 L 32,40 L 42,20 L 52,52" 
                    stroke="#D4AF37" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.path 
                    d="M 12,20 L 52,20 L 52,12 L 12,12 Z" 
                    fill="#D4AF37" 
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                  />
                  <motion.circle 
                    cx="32" cy="16" r="3" 
                    fill="#F7F4ED" 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                  />
                </svg>
              </div>
              
              <h1 className="text-xs font-semibold tracking-[0.6em] text-[#F7F4ED] mb-12">WELCOME TO MW TRENDS</h1>
              
              <button 
                onClick={() => setHasEntered(true)}
                className="group relative px-10 py-4 text-xs font-bold tracking-[0.2em] text-[#F7F4ED] overflow-hidden transition-all duration-700"
              >
                <div className="absolute inset-0 border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-colors duration-500" />
                
                {/* Geometric Hover Traces */}
                <span className="absolute top-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-700 ease-out" />
                <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-700 ease-out" />
                <span className="absolute top-0 right-0 w-[1px] h-0 bg-[#D4AF37] group-hover:h-full transition-all duration-700 ease-out delay-100" />
                <span className="absolute bottom-0 left-0 w-[1px] h-0 bg-[#D4AF37] group-hover:h-full transition-all duration-700 ease-out delay-100" />
                
                {/* Subtle Background Fill on Hover */}
                <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-colors duration-700" />
                
                <span className="relative z-10">ENTER THE WORLD OF CUSTOM</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2D UI Layer for World Mode */}
      {hasEntered && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5, duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <WorldNav 
            onNavigate={handleNavigate} 
            onToggleQuickShop={handleToggleQuickShop} 
          />
          <ProductFocusMode />
        </motion.div>
      )}

    </main>
  );
}
