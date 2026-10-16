"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ShopInteriorShell from "@/components/shop/ShopInteriorShell";

function ShopContent() {
  const searchParams = useSearchParams();
  const shopParam = searchParams.get("shop") || "shirts";
  const floorParam = searchParams.get("floor");
  const floorNumber = floorParam ? parseInt(floorParam, 10) : 1;

  return (
    <ShopInteriorShell
      initialShopSlug={shopParam}
      initialFloor={isNaN(floorNumber) || floorNumber < 1 ? 1 : floorNumber}
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 bg-[#0A0908] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] mb-2 uppercase font-bold">
            PREPARING ATELIER
          </span>
          <div className="w-12 h-[1px] bg-[#D4AF37]/40 animate-pulse" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
