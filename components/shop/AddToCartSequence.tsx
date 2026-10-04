"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Product } from "@/lib/data/mockCatalog";

interface AddToCartSequenceProps {
  isActive: boolean;
  product: Product | null;
  onComplete: () => void;
}

export default function AddToCartSequence({ isActive, product, onComplete }: AddToCartSequenceProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isActive && product) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 300), // Verification
        setTimeout(() => setStep(2), 600), // Package forms
        setTimeout(() => setStep(3), 900), // Seal
        setTimeout(() => setStep(4), 1100) // Travel
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isActive, product]);

  if (!product) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <motion.div 
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle dim */}
          <motion.div 
            className="absolute inset-0 bg-[#050505]/20 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ scale: 0.8, y: 50 }}
            animate={step >= 4 ? { scale: 0.1, y: -400, x: 300, opacity: 0 } : { scale: 1, y: 0 }}
            transition={step >= 4 ? { duration: 0.5, ease: "anticipate" } : { type: "spring", bounce: 0.2 }}
          >
            {/* The Package based on category */}
            <motion.div 
              className={`relative overflow-hidden flex items-center justify-center border border-[#222] shadow-2xl bg-[#0a0a0b]
                ${product.category === 'objects' ? 'w-48 h-48 rounded-xl' : // Mug box
                  product.category === 'cases' ? 'w-32 h-56 rounded-md' : // Slim Case tray
                  product.category === 'frames' ? 'w-56 h-72 rounded-sm' : // Frame wrap
                  'w-48 h-64 rounded-sm' // Apparel envelope
                }
              `}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Product Silhouette / Content */}
              <motion.div 
                className="absolute inset-4 border border-white/5 flex items-center justify-center text-[#333] text-xs font-bold tracking-widest"
                animate={{ opacity: step >= 2 ? 0.2 : 1 }}
              >
                {product.category.toUpperCase()}
              </motion.div>

              {/* Protective Layer / Packaging Animation */}
              {step >= 2 && (
                <motion.div
                  className={`absolute inset-0 z-10 ${
                    product.category === 'objects' ? 'bg-[#111] border-[8px] border-[#222]' :
                    product.category === 'cases' ? 'bg-[#151515] border-x-[16px] border-[#0a0a0b]' :
                    'bg-[#050505]'
                  }`}
                  initial={{ 
                    y: product.category === 'apparel' ? '100%' : 0, 
                    opacity: product.category === 'apparel' ? 1 : 0 
                  }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Verification Scanline */}
              {step >= 1 && step < 3 && (
                <motion.div 
                  className="absolute top-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] z-20"
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 0.6, ease: "linear" }}
                />
              )}

              {/* MW Diamond Seal */}
              <motion.div
                className="w-12 h-12 bg-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 flex items-center justify-center z-30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: step >= 3 ? 1 : 0, opacity: step >= 3 ? 1 : 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <div className="w-8 h-8 border border-[#111111] flex items-center justify-center">
                  <span className="text-[#111111] -rotate-45 text-[8px] font-bold tracking-tighter">MW</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
