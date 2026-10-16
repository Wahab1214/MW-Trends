"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import {
  DEFAULT_BUILDING_CATEGORIES,
  getTotalFloors,
  getCategoriesForFloor,
  getActiveCategories,
  formatFloorNumber,
} from "@/lib/data/buildingCategories";

interface WorldNavProps {
  onNavigate: (target: string) => void;
  onToggleQuickShop: () => void;
}

export default function WorldNav({ onNavigate, onToggleQuickShop }: WorldNavProps) {
  const currentFloor = useStore((state) => state.currentFloor);
  const setCurrentFloor = useStore((state) => state.setCurrentFloor);
  const isFloorTransitioning = useStore((state) => state.isFloorTransitioning);
  const selectedMobileSlot = useStore((state) => state.selectedMobileSlot);
  const setSelectedMobileSlot = useStore((state) => state.setSelectedMobileSlot);
  const setIsStairsAscending = useStore((state) => state.setIsStairsAscending);
  const categories = useStore((state) => state.categories);
  const categoryCountOverride = useStore((state) => state.categoryCountOverride);
  const setFloorTransitionState = useStore((state) => state.setFloorTransitionState);

  // Active categories and total floor calculation
  const activeCategories = useMemo(() => {
    let source = categories;
    if (categoryCountOverride !== null) {
      source = categories.slice(0, categoryCountOverride);
    }
    return getActiveCategories(source);
  }, [categories, categoryCountOverride]);

  const totalFloors = useMemo(() => {
    return getTotalFloors(activeCategories);
  }, [activeCategories]);

  // Current floor categories
  const floorCategories = useMemo(() => {
    return getCategoriesForFloor(activeCategories, currentFloor);
  }, [activeCategories, currentFloor]);

  // Ensure currentFloor is clamped within valid total floors
  useEffect(() => {
    if (currentFloor > totalFloors) {
      setCurrentFloor(totalFloors);
    }
  }, [totalFloors, currentFloor, setCurrentFloor]);

  // Synchronize URL query parameter with current floor
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const currentParam = url.searchParams.get("floor");
      const targetParam = currentFloor > 1 ? String(currentFloor) : null;
      if (currentParam !== targetParam) {
        if (targetParam) {
          url.searchParams.set("floor", targetParam);
        } else {
          url.searchParams.delete("floor");
        }
        window.history.pushState({ floor: currentFloor }, "", url.toString());
      }
    }
  }, [currentFloor]);

  // Keyboard floor navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFloorTransitioning) return;

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (currentFloor < totalFloors) {
          handleNextFloor();
        }
      } else if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (currentFloor > 1) {
          handlePrevFloor();
        }
      } else if (e.key >= "1" && e.key <= "9") {
        const target = parseInt(e.key, 10);
        if (target <= totalFloors) {
          handleSelectFloor(target);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFloor, totalFloors, isFloorTransitioning]);

  const handleNextFloor = () => {
    if (!isFloorTransitioning && currentFloor < totalFloors) {
      setSelectedMobileSlot(null);
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

  const handlePrevFloor = () => {
    if (!isFloorTransitioning && currentFloor > 1) {
      setSelectedMobileSlot(null);
      setFloorTransitionState('leaving');
      setTimeout(() => {
        setCurrentFloor(currentFloor - 1);
        setFloorTransitionState('arriving');
        setTimeout(() => setFloorTransitionState('idle'), 300);
      }, 300);
    }
  };

  const handleSelectFloor = (floorNum: number) => {
    if (!isFloorTransitioning && floorNum !== currentFloor) {
      setSelectedMobileSlot(null);
      if (floorNum > currentFloor) {
        setIsStairsAscending(true);
        setFloorTransitionState('ascending');
        setTimeout(() => {
          setCurrentFloor(floorNum);
          setIsStairsAscending(false);
          setFloorTransitionState('arriving');
          setTimeout(() => setFloorTransitionState('idle'), 400);
        }, 700);
      } else {
        setFloorTransitionState('leaving');
        setTimeout(() => {
          setCurrentFloor(floorNum);
          setFloorTransitionState('arriving');
          setTimeout(() => setFloorTransitionState('idle'), 300);
        }, 300);
      }
    }
  };

  const floorNumbers = Array.from({ length: totalFloors }, (_, i) => i + 1);

  return (
    <>
      {/* Top Header is now provided globally and unified by GlobalNav in RootLayout */}

      {/* ================================================== */}
      {/* 2. MOBILE GUIDED STOREFRONT DOCK (Phone screens) */}
      {/* ================================================== */}
      <div className="md:hidden absolute bottom-20 left-0 w-full px-4 pointer-events-auto z-40">
        <div className="bg-[#141619]/80 border border-[#D4AF37]/20 backdrop-blur-xl rounded-xl p-2.5 shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 text-[10px] tracking-[0.25em] text-[#D3C7B8]/70">
            <span>{formatFloorNumber(currentFloor)} BOUTIQUES</span>
            {selectedMobileSlot !== null && (
              <button
                onClick={() => setSelectedMobileSlot(null)}
                className="text-[#D4AF37] hover:underline flex items-center gap-1 text-[10px]"
              >
                <ArrowLeft size={10} /> ATRIUM
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {floorCategories.map((cat, idx) => {
              const isSelected = selectedMobileSlot === idx;
              const isAvailable = cat !== null;

              return (
                <button
                  key={`mobile-slot-${idx}`}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (isSelected && cat) {
                      onNavigate(cat.slug);
                    } else {
                      setSelectedMobileSlot(idx);
                    }
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-all flex flex-col items-center justify-center border ${
                    isSelected
                      ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#F4EFE7]"
                      : isAvailable
                      ? "border-white/10 bg-[#1B1D21]/50 text-[#D3C7B8]"
                      : "border-white/5 bg-transparent text-white/20"
                  }`}
                >
                  <span className="text-[9px] font-medium tracking-wider truncate w-full">
                    {cat ? cat.name : "SOON"}
                  </span>
                  {isSelected && cat && (
                    <span className="text-[7px] text-[#D4AF37] tracking-tighter mt-0.5">
                      ENTER →
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. SLIM ARCHITECTURAL FLOOR NAVIGATOR (DESKTOP) */}
      {/* Placed at Bottom-Right to preserve central corridor sightlines */}
      {/* ================================================== */}
      <nav
        aria-label="Building Floor Navigation"
        className="hidden md:flex flex-col items-end gap-2.5 absolute bottom-8 right-8 pointer-events-auto z-50 select-none"
      >
        {/* Next Floor Slim Pill */}
        {currentFloor < totalFloors && (
          <button
            onClick={handleNextFloor}
            disabled={isFloorTransitioning}
            aria-label={`Ascend to Floor ${currentFloor + 1}`}
            className="group px-4 py-2 rounded-full border border-[#D4AF37]/35 bg-[#141619]/75 backdrop-blur-md hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all text-[10px] tracking-[0.25em] font-medium text-[#F4EFE7] flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>ASCEND TO {formatFloorNumber(currentFloor + 1)}</span>
            <ChevronUp size={13} className="text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Minimal Floor Numeral Bar */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#141619]/75 backdrop-blur-md shadow-xl text-xs font-mono">
          <span className="text-[9px] tracking-[0.25em] text-[#D3C7B8]/60 mr-1 font-sans">
            FLOOR
          </span>

          {floorNumbers.map((num, i) => {
            const isActive = num === currentFloor;
            return (
              <div key={`floor-nav-${num}`} className="flex items-center gap-3">
                <button
                  onClick={() => handleSelectFloor(num)}
                  disabled={isFloorTransitioning}
                  aria-label={`Switch to Floor ${num}`}
                  className={`transition-all relative py-0.5 cursor-pointer ${
                    isActive
                      ? "text-[#D4AF37] font-bold"
                      : "text-[#D3C7B8]/50 hover:text-[#F4EFE7]"
                  }`}
                >
                  <span>{num < 10 ? `0${num}` : num}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFloorIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
                    />
                  )}
                </button>
                {i < floorNumbers.length - 1 && (
                  <span className="text-[#D4AF37]/30 text-[10px]">•</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous Floor Slim Pill */}
        {currentFloor > 1 && (
          <button
            onClick={handlePrevFloor}
            disabled={isFloorTransitioning}
            aria-label={`Descend to Floor ${currentFloor - 1}`}
            className="group px-4 py-2 rounded-full border border-[#D4AF37]/25 bg-[#141619]/75 backdrop-blur-md hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-[10px] tracking-[0.25em] font-medium text-[#D3C7B8] flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <ChevronDown size={13} className="text-[#D4AF37] group-hover:translate-y-0.5 transition-transform" />
            <span>DESCEND TO {formatFloorNumber(currentFloor - 1)}</span>
          </button>
        )}
      </nav>
    </>
  );
}
