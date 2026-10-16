"use client";

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import ShopSlot from "./ShopSlot";
import GrandStaircase from "./GrandStaircase";
import FloorMedallion from "./FloorMedallion";
import CorridorAccents from "./CorridorAccents";
import LogoWall from "./LogoWall";
import AtriumMezzanine from "./AtriumMezzanine";
import { getCalacattaMarbleTexture, createEmptyFloorBannerTexture } from "@/lib/textures/marbleTextures";
import {
  BuildingCategory,
  SHOP_SLOT_CONFIGS,
} from "@/lib/data/buildingCategories";

interface BuildingFloorProps {
  floorNumber: number;
  floorHeight: number;
  categories: (BuildingCategory | null)[];
  totalFloors: number;
  onSelectShop: (category: BuildingCategory, doorPos: [number, number, number]) => void;
  onAscend: () => void;
}

export default function BuildingFloor({
  floorNumber,
  floorHeight,
  categories,
  totalFloors,
  onSelectShop,
  onAscend,
}: BuildingFloorProps) {
  const [calacattaTex, setCalacattaTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCalacattaTex(getCalacattaMarbleTexture());
    }
  }, []);

  const materials = useMemo(() => {
    return {
      // Perimeter black marble accent border
      blackMarbleBorder: new THREE.MeshStandardMaterial({
        color: "#11100F",
        roughness: 0.22,
        metalness: 0.45,
      }),
      champagneGoldInlay: new THREE.MeshStandardMaterial({
        color: "#D9B45A",
        roughness: 0.18,
        metalness: 0.95,
      }),
    };
  }, []);

  const hasNextFloor = floorNumber < totalFloors;
  const floorY = (floorNumber - 1) * floorHeight;

  return (
    <group position={[0, floorY, 0]}>
      {/* ================================================== */}
      {/* 1. POLISHED CALACATTA MARBLE FLOOR WITH LIVE REFLECTIONS */}
      {/* Captures step-edge LEDs, shop lighting, and logo wall */}
      {/* ================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Reflective Calacatta Gold Floor Plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, -1.0]}
          receiveShadow
        >
          <planeGeometry args={[26, 32]} />
          <MeshReflectorMaterial
            blur={[250, 60]}
            resolution={1024}
            mirror={0.65}
            mixBlur={0.8}
            mixStrength={2.6}
            roughness={0.14}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#F4E8D7"
            metalness={0.06}
            map={calacattaTex || undefined}
          />
        </mesh>

        {/* Outer Perimeter Black Marble Border Bands Under Storefronts */}
        {[-12.2, 12.2].map((x, i) => (
          <mesh
            key={`outer-black-border-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.005, -1.0]}
            receiveShadow
          >
            <planeGeometry args={[1.6, 32]} />
            <primitive object={materials.blackMarbleBorder} attach="material" />
          </mesh>
        ))}

        {/* 2. EMBEDDED FOREGROUND CIRCULAR MW MEDALLION & AISLE RUNNERS */}
        <FloorMedallion />

        {/* 3. CORRIDOR PLANTERS WITH BASE COVE LIGHTING & LUXURY BENCHES */}
        <CorridorAccents />
      </group>

      {/* ================================================== */}
      {/* 4. FOUR REFERENCE-LOCKED BOUTIQUES */}
      {/* Shirts (LF), Pens (LR), Mugs (RF), Photo Frames (RR) */}
      {/* ================================================== */}
      <group>
        {SHOP_SLOT_CONFIGS.map((slotConfig) => {
          const category = categories[slotConfig.index];
          return (
            <ShopSlot
              key={`floor-${floorNumber}-slot-${slotConfig.index}`}
              slotConfig={slotConfig}
              category={category}
              floorNumber={floorNumber}
              onSelectShop={onSelectShop}
            />
          );
        })}
      </group>

      {/* ================================================== */}
      {/* 5. GRAND MONUMENTAL STAIRCASE WITH STEP-EDGE LEDS */}
      {/* ================================================== */}
      <GrandStaircase
        floorNumber={floorNumber}
        floorHeight={floorHeight}
        onAscend={onAscend}
        canAscend={hasNextFloor}
      />

      {/* Dynamic Empty Floor Banner when no active categories exist */}
      {categories.every((c) => c === null) && (
        <group position={[0, 1.8, 2.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.4, 0.9, 0.08]} />
            <primitive object={materials.blackMarbleBorder} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[4.32, 0.82, 0.02]} />
            <primitive object={materials.champagneGoldInlay} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.056]}>
            <planeGeometry args={[4.2, 0.76]} />
            <meshStandardMaterial
              map={createEmptyFloorBannerTexture()}
              emissiveMap={createEmptyFloorBannerTexture()}
              emissive="#E5BE5E"
              emissiveIntensity={0.65}
              roughness={0.18}
              metalness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* ================================================== */}
      {/* 6. TOWERING BLACK MARBLE MW LOGO FEATURE WALL */}
      {/* ================================================== */}
      <LogoWall />

      {/* ================================================== */}
      {/* 7. UPPER ATRIUM MEZZANINE BALCONIES & PLANT URNS */}
      {/* ================================================== */}
      <AtriumMezzanine />
    </group>
  );
}
