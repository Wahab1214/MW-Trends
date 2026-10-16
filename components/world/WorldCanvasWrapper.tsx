"use client";

import { useStore } from "@/lib/store/useStore";
import dynamic from "next/dynamic";
const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  DEFAULT_BUILDING_CATEGORIES,
  FLOOR_HEIGHT,
  SHOP_SLOT_CONFIGS,
  getCategoriesForFloor,
  getActiveCategories,
} from "@/lib/data/buildingCategories";

export default function WorldCanvasWrapper() {
  const { activeShop, mode, hasEntered, currentFloor, categoryCountOverride, categories } = useStore();
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 2, 16]);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).useStore = useStore;
    }
  }, []);

  useEffect(() => {
    const floorY = (currentFloor - 1) * FLOOR_HEIGHT;

    if (!hasEntered) {
      setTargetPosition([0, 2, 16]);
    } else if (activeShop) {
      let source = categories;
      if (categoryCountOverride !== null) {
        source = categories.slice(0, categoryCountOverride);
      }
      const activeCategories = getActiveCategories(source);

      const floorCats = getCategoriesForFloor(activeCategories, currentFloor);
      const slotIndex = floorCats.findIndex(c => c?.slug === activeShop || c?.id === activeShop);

      if (slotIndex !== -1 && SHOP_SLOT_CONFIGS[slotIndex]) {
        const slot = SHOP_SLOT_CONFIGS[slotIndex];
        const isLeft = slot.slotName.startsWith("left");
        const doorOffsetX = isLeft ? 1.75 : -1.75;
        // Exact door threshold coordinates
        setTargetPosition([slot.position[0] + doorOffsetX, floorY, slot.position[2] + 1.75]);
      } else {
        setTargetPosition([0, floorY, 0]);
      }
    } else {
      setTargetPosition([0, floorY, 0]);
    }
  }, [activeShop, hasEntered, currentFloor, categoryCountOverride, categories]);

  // Three.js world canvas is not rendered on isolated administrative/account/shop/product routes
  const isIsolatedRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/checkout') || pathname?.startsWith('/account') || pathname?.startsWith('/shop') || pathname?.startsWith('/products');
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
