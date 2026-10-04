"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddToCartSequence from "@/components/shop/AddToCartSequence";
import { Product } from "@/lib/data/mockCatalog";

export default function PrintCheckModal({ onClose, product }: { onClose: () => void, product: Product }) {
  const [step, setStep] = useState(0); // 0: checking, 1: success, 2: adding
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2000); // Check takes 2 seconds
    return () => clearTimeout(timer1);
  }, []);

  const handleConfirm = () => {
    setIsAdding(true);
    setTimeout(() => {
      onClose(); // Close customizer or redirect to cart after animation
    }, 1500);
  };

  if (isAdding) {
    return <AddToCartSequence isActive={true} product={product} onComplete={onClose} />;
  }

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Dim */}
      <motion.div 
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        onClick={step === 1 ? onClose : undefined}
      />

      {/* Modal Box */}
      <motion.div 
        className="relative w-full max-w-md bg-[#0a0a0b] border border-[#222] shadow-2xl overflow-hidden p-8"
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
      >
        {/* Scanning Line Animation */}
        {step === 0 && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        )}

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-widest text-[#F7F4ED] mb-2">
            {step === 0 ? 'MW PRINT CHECK' : 'READY TO PRINT'}
          </h2>
          <p className="text-[10px] tracking-widest text-[#888]">
            {step === 0 ? 'Verifying production parameters...' : 'Your custom design is approved for production.'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <CheckItem label="Print Safe Area" status={step >= 0 ? (step === 0 ? 'checking' : 'passed') : 'pending'} />
          <CheckItem label="Image Resolution" status={step >= 0 ? (step === 0 ? 'checking' : 'passed') : 'pending'} delay={0.5} />
          <CheckItem label="Color Validation" status={step >= 0 ? (step === 0 ? 'checking' : 'passed') : 'pending'} delay={1.0} />
          <CheckItem label="Variant Availability" status={step >= 0 ? (step === 0 ? 'checking' : 'passed') : 'pending'} delay={1.5} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.button 
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleConfirm}
              className="w-full py-4 bg-[#D4AF37] text-[#050505] font-bold tracking-[0.2em] text-[10px]"
            >
              CONFIRM & ADD TO BAG
            </motion.button>
          ) : (
            <motion.button 
              key="cancel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="w-full py-4 border border-[#333] text-[#888] font-bold tracking-[0.2em] text-[10px] hover:text-white"
            >
              CANCEL
            </motion.button>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}

function CheckItem({ label, status, delay = 0 }: { label: string, status: 'pending' | 'checking' | 'passed', delay?: number }) {
  const [localStatus, setLocalStatus] = useState<'pending' | 'checking' | 'passed'>('pending');

  useEffect(() => {
    if (status === 'checking') {
      const t = setTimeout(() => setLocalStatus('checking'), delay * 1000);
      const t2 = setTimeout(() => setLocalStatus('passed'), (delay + 0.5) * 1000);
      return () => { clearTimeout(t); clearTimeout(t2); };
    } else {
      setLocalStatus(status);
    }
  }, [status, delay]);

  return (
    <div className="flex justify-between items-center text-xs tracking-widest p-3 bg-[#111] border border-[#222]">
      <span className={localStatus === 'passed' ? 'text-[#F7F4ED]' : 'text-[#666]'}>{label}</span>
      <div className="text-[10px]">
        {localStatus === 'pending' && <span className="text-[#444]">--</span>}
        {localStatus === 'checking' && (
          <motion.span 
            className="text-[#D4AF37] block"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            SCANNING
          </motion.span>
        )}
        {localStatus === 'passed' && <span className="text-[#D4AF37]">PASS ✓</span>}
      </div>
    </div>
  );
}
