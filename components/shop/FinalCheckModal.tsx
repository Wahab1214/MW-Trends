"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CartItem } from "@/lib/store/useCartStore";

interface FinalCheckModalProps {
  onClose: () => void;
  onComplete: () => void;
  cartItems: CartItem[];
}

export default function FinalCheckModal({ onClose, onComplete, cartItems }: FinalCheckModalProps) {
  const [step, setStep] = useState(0); 

  const hasCustom = cartItems.some(item => item.designConfig && item.designConfig.length > 0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300), // Variants check
      setTimeout(() => setStep(2), 600), // Custom Designs (if any)
      setTimeout(() => setStep(3), 900), // Ready
      setTimeout(() => {
        onComplete(); // Fire checkout handoff
      }, 1500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        className="relative w-full max-w-sm bg-[#0a0a0b] border border-[#222] shadow-2xl overflow-hidden p-8"
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-widest text-[#F7F4ED] mb-2">MW FINAL CHECK</h2>
          <p className="text-[10px] tracking-widest text-[#888]">Verifying order composition...</p>
        </div>

        <div className="space-y-4 mb-4">
          <CheckItem label="Product Selection" active={step >= 0} />
          <CheckItem label="Variant Availability" active={step >= 1} />
          {hasCustom && <CheckItem label="Custom Designs Ready" active={step >= 2} />}
          <CheckItem label="Order Ready" active={step >= 3} isFinal={true} />
        </div>

      </motion.div>
    </motion.div>
  );
}

function CheckItem({ label, active, isFinal = false }: { label: string, active: boolean, isFinal?: boolean }) {
  return (
    <div className={`flex justify-between items-center text-xs tracking-widest p-3 bg-[#111] border ${active && isFinal ? 'border-[#D4AF37]' : 'border-[#222]'}`}>
      <span className={active ? (isFinal ? 'text-[#D4AF37] font-bold' : 'text-[#F7F4ED]') : 'text-[#444]'}>{label}</span>
      <div className="text-[10px]">
        {!active && <span className="text-[#444]">--</span>}
        {active && !isFinal && <span className="text-[#D4AF37]">✓</span>}
        {active && isFinal && (
          <motion.div 
            className="w-2 h-2 bg-[#D4AF37]" 
            animate={{ rotate: 180 }}
            transition={{ type: "spring", repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </div>
    </div>
  );
}
