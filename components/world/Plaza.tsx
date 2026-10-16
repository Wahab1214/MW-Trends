"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import BuildingFloor from "./BuildingFloor";
import BuildingShell from "./BuildingShell";
import {
  DEFAULT_BUILDING_CATEGORIES,
  FLOOR_HEIGHT,
  getTotalFloors,
  getCategoriesForFloor,
  getActiveCategories,
  BuildingCategory,
} from "@/lib/data/buildingCategories";

interface PlazaProps {
  hasEntered: boolean;
}

export default function Plaza({ hasEntered }: PlazaProps) {
  const router = useRouter();
  const currentFloor = useStore((state) => state.currentFloor);
  const setCurrentFloor = useStore((state) => state.setCurrentFloor);
  const setActiveShop = useStore((state) => state.setActiveShop);
  const setEnteringShopSlug = useStore((state) => state.setEnteringShopSlug);
  const setIsStairsAscending = useStore((state) => state.setIsStairsAscending);
  const isFloorTransitioning = useStore((state) => state.isFloorTransitioning);
  const categories = useStore((state) => state.categories);
  const setLastVisitedShop = useStore((state) => state.setLastVisitedShop);
  const setFloorTransitionState = useStore((state) => state.setFloorTransitionState);
  const categoryCountOverride = useStore((state) => state.categoryCountOverride);

  // Compute active category set (allows dynamic admin categories & testing override)
  const activeCategories = useMemo(() => {
    let source = categories;
    if (categoryCountOverride !== null) {
      source = categories.slice(0, categoryCountOverride);
    }
    return getActiveCategories(source);
  }, [categories, categoryCountOverride]);

  // Dynamic floor calculation: totalFloors = Math.ceil(activeCategories.length / 4)
  const totalFloors = useMemo(() => {
    return getTotalFloors(activeCategories);
  }, [activeCategories]);

  // Handle clicking a shop facade and its door
  const handleSelectShop = (category: BuildingCategory, doorPos: [number, number, number]) => {
    setActiveShop(category.slug);
    setEnteringShopSlug(category.slug);
    setLastVisitedShop({ slug: category.slug, floor: currentFloor });
    setFloorTransitionState('leaving');
    // Smooth door opening + camera glide toward and through threshold (~950ms)
    setTimeout(() => {
      router.push(`/shop?shop=${category.slug}&floor=${currentFloor}`);
      setEnteringShopSlug(null);
      setFloorTransitionState('idle');
    }, 950);
  };

  // Handle ascending via the Grand Staircase
  const handleAscend = () => {
    if (!isFloorTransitioning && currentFloor < totalFloors) {
      setIsStairsAscending(true);
      setFloorTransitionState('ascending');
      setTimeout(() => {
        setCurrentFloor(currentFloor + 1);
        setIsStairsAscending(false);
        setFloorTransitionState('arriving');
        setTimeout(() => setFloorTransitionState('idle'), 400);
      }, 700);
    }
  };

  // Reusable floor stack array [1, 2, 3, ...]
  const floorNumbers = useMemo(() => {
    return Array.from({ length: totalFloors }, (_, i) => i + 1);
  }, [totalFloors]);

  return (
    <group>
      {/* 1. OUTER LUXURY BUILDING SHELL (Spans full building height) */}
      <BuildingShell
        currentFloor={currentFloor}
        totalFloors={totalFloors}
        floorHeight={FLOOR_HEIGHT}
      />

      {/* 2. DYNAMICALLY GENERATED BUILDING FLOORS */}
      {floorNumbers.map((floorNum) => {
        // Render strictly the active floor so upper floors don't double-render stairs or occlude logo wall
        if (floorNum !== currentFloor) return null;

        const floorCategories = getCategoriesForFloor(activeCategories, floorNum);

        return (
          <BuildingFloor
            key={`building-floor-${floorNum}`}
            floorNumber={floorNum}
            floorHeight={FLOOR_HEIGHT}
            categories={floorCategories}
            totalFloors={totalFloors}
            onSelectShop={handleSelectShop}
            onAscend={handleAscend}
          />
        );
      })}
    </group>
  );
}
