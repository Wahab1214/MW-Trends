"use client";

import { useStore } from "@/lib/store/useStore";
import dynamic from "next/dynamic";
const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const LOCATIONS: Record<string, [number, number, number]> = {
  "plaza": [0, 0, 0],
  "tee-studio": [-16, 0, -10],
  "mug-bar": [16, 0, -10],
  "custom-lab": [0, 0, -28]
};

export default function WorldCanvasWrapper() {
  const { activeShop, mode, hasEntered } = useStore();
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 0, 16]); // Start further back to act as "pre-entry"
  const pathname = usePathname();

  useEffect(() => {
    if (!hasEntered) {
      setTargetPosition([0, 2, 16]); // Focal point slightly elevated and forward, camera will be at +12 Z.
    } else if (LOCATIONS[activeShop]) {
      setTargetPosition(LOCATIONS[activeShop]);
    }
  }, [activeShop, hasEntered]);

  // Phase 10 Rule: Three.js is never part of routes that do not need it
  const isIsolatedRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/checkout') || pathname?.startsWith('/account');
  
  if (isIsolatedRoute) return null;

  return (
    <>
      <WorldCanvas targetPosition={targetPosition} hasEntered={hasEntered} />
      
      {/* Optional: Darken the 3D world when in Quick Shop mode */}
      <AnimatePresence>
        {mode === 'quick-shop' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-[#050505] pointer-events-none z-10"
          />
        )}
      </AnimatePresence>
    </>
  );
}
