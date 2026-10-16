"use client";

import { motion, AnimatePresence } from "framer-motion";
import WorldNav from "@/components/ui/WorldNav";
import ProductFocusMode from "@/components/world/ProductFocusMode";
import { useStore } from "@/lib/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, Suspense } from "react";

const LandingExperience = dynamic(() => import("@/components/ui/LandingExperience"), { ssr: false });

function DeepLinkHandler() {
  const searchParams = useSearchParams();
  const floorParam = searchParams.get('floor');
  const { setHasEntered, setCurrentFloor } = useStore();

  useEffect(() => {
    if (floorParam) {
      const parsed = parseInt(floorParam, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        setCurrentFloor(parsed);
        setHasEntered(true);
      }
    }
  }, [floorParam, setCurrentFloor, setHasEntered]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const floor = params.get('floor');
      if (floor) {
        const parsed = parseInt(floor, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setCurrentFloor(parsed);
          setHasEntered(true);
        }
      } else {
        setCurrentFloor(1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentFloor, setHasEntered]);

  return null;
}

export default function Home() {
  const { hasEntered, setHasEntered, setMode, setActiveShop } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).useStore = useStore;
    }
  }, []);

  const handleToggleQuickShop = () => {
    setMode('quick-shop');
    router.push('/shop');
  };

  const handleNavigate = (target: string) => {
    setActiveShop(target);
    const floor = useStore.getState().currentFloor;
    router.push(`/shop?shop=${target}&floor=${floor}`);
  };

  return (
    <main className="w-full h-full relative bg-transparent overflow-hidden">
      <Suspense fallback={null}>
        <DeepLinkHandler />
      </Suspense>
      
      {/* Cinematic Entrance Sequence */}
      <AnimatePresence>
        {!hasEntered && (
          <LandingExperience onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {/* 2D UI Layer for World Mode */}
      {hasEntered && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1.5 }}
          className="absolute inset-0 pointer-events-none z-50"
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
