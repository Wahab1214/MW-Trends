"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { BuildingCategory, ShopSlotMetadata } from "@/lib/data/buildingCategories";
import { useStore } from "@/lib/store/useStore";
import { createFasciaSignTexture, createComingSoonPlaqueTexture } from "@/lib/textures/marbleTextures";

interface ShopSlotProps {
  slotConfig: ShopSlotMetadata;
  category: BuildingCategory | null;
  floorNumber: number;
  onSelectShop: (category: BuildingCategory, doorPos: [number, number, number]) => void;
}

export default function ShopSlot({
  slotConfig,
  category,
  floorNumber,
  onSelectShop,
}: ShopSlotProps) {
  const [hovered, setHovered] = useState(false);
  const enteringShopSlug = useStore((state) => state.enteringShopSlug);
  const isEnteringThisShop = enteringShopSlug === category?.slug;

  const interiorLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const doorPivotRef = useRef<THREE.Group>(null);
  const heroDisplayRef = useRef<THREE.Group>(null);
  const handleMeshRef = useRef<THREE.MeshStandardMaterial>(null);

  const isComingSoon = category === null;
  const displayName = category ? category.name : "COMING SOON";

  const signTexture = useMemo(() => {
    return createFasciaSignTexture(displayName);
  }, [displayName]);

  const plaqueTexture = useMemo(() => {
    return isComingSoon ? createComingSoonPlaqueTexture() : null;
  }, [isComingSoon]);

  // Reusable materials strictly following the reference palette
  const materials = useMemo(() => {
    return {
      ivoryMarble: new THREE.MeshStandardMaterial({
        color: "#EDE2CF",
        roughness: 0.42,
        metalness: 0.08,
      }),
      interiorWallWarm: new THREE.MeshStandardMaterial({
        color: "#EFE8DC",
        roughness: 0.5,
        metalness: 0.05,
      }),
      interiorFloorWood: new THREE.MeshStandardMaterial({
        color: "#2C2018",
        roughness: 0.35,
        metalness: 0.15,
      }),
      blackMarbleFascia: new THREE.MeshStandardMaterial({
        color: "#0F0E0D",
        roughness: 0.18,
        metalness: 0.45,
      }),
      deepGraphite: new THREE.MeshStandardMaterial({
        color: "#181716",
        roughness: 0.35,
        metalness: 0.7,
      }),
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.16,
        metalness: 0.95,
      }),
      darkWalnut: new THREE.MeshStandardMaterial({
        color: "#38271E",
        roughness: 0.5,
        metalness: 0.1,
      }),
      ultraClearGlass: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.02,
        metalness: 0.05,
        transparent: true,
        opacity: 0.15,
      }),
      doorGlass: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.06,
        metalness: 0.02,
        transparent: true,
        opacity: 0.14,
      }),
      handleGold: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.15,
        metalness: 0.95,
        emissive: "#C59B32",
        emissiveIntensity: 0.15,
      }),
      fasciaCoveGlow: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
      whiteShirtFabric: new THREE.MeshStandardMaterial({
        color: "#FFFFFF",
        roughness: 0.82,
        metalness: 0.02,
      }),
      blueShirtFabric: new THREE.MeshStandardMaterial({
        color: "#6B8FA8",
        roughness: 0.8,
        metalness: 0.03,
      }),
      navyShirtFabric: new THREE.MeshStandardMaterial({
        color: "#1F2E3D",
        roughness: 0.85,
        metalness: 0.02,
      }),
      ceramicWhite: new THREE.MeshStandardMaterial({
        color: "#FAF8F5",
        roughness: 0.15,
        metalness: 0.1,
      }),
      ceramicBlack: new THREE.MeshStandardMaterial({
        color: "#121110",
        roughness: 0.2,
        metalness: 0.4,
      }),
      plantLeaf: new THREE.MeshStandardMaterial({
        color: "#274322",
        roughness: 0.45,
        metalness: 0.08,
      }),
      plantLeafLight: new THREE.MeshStandardMaterial({
        color: "#3E6334",
        roughness: 0.42,
        metalness: 0.06,
      }),
      plantStem: new THREE.MeshStandardMaterial({
        color: "#3A2E24",
        roughness: 0.8,
        metalness: 0.04,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    // 1. Door opening animation on click
    if (doorPivotRef.current) {
      const targetAngle = isEnteringThisShop ? -Math.PI * 0.45 : hovered ? -0.06 : 0;
      easing.dampE(doorPivotRef.current.rotation, [0, targetAngle, 0], 0.28, delta);
    }

    // 2. Subtle ambient movement in vitrines
    if (heroDisplayRef.current) {
      if (category?.theme === "mugs") {
        heroDisplayRef.current.rotation.y += delta * 0.35;
      } else if (category?.theme === "pens") {
        heroDisplayRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
      } else if (isComingSoon) {
        heroDisplayRef.current.rotation.y += delta * 0.4;
      }
    }

    // 3. Dynamic lighting on hover & entry
    if (interiorLightRef.current) {
      const targetIntensity = isEnteringThisShop ? 55 : hovered ? 45 : 32;
      easing.damp(interiorLightRef.current, "intensity", targetIntensity, 0.2, delta);
    }
    if (spotLightRef.current) {
      const targetIntensity = isEnteringThisShop ? 45 : hovered ? 35 : 24;
      easing.damp(spotLightRef.current, "intensity", targetIntensity, 0.2, delta);
    }

    // 4. Handle emissivity highlight
    if (handleMeshRef.current) {
      const targetEmissive = hovered || isEnteringThisShop ? 0.75 : 0.15;
      easing.damp(handleMeshRef.current, "emissiveIntensity", targetEmissive, 0.15, delta);
    }
  });

  const isLeftSlot = slotConfig.slotName.startsWith("left");
  const isRearSlot = slotConfig.slotName.endsWith("rear");
  const width = isRearSlot ? 3.2 : 3.6;
  const height = isRearSlot ? 4.8 : 4.2;
  const depth = isRearSlot ? 2.4 : 1.8;

  const doorWidth = isRearSlot ? 1.0 : 1.1;
  const doorHeight = isRearSlot ? 3.3 : 3.1;
  const doorOffsetX = isLeftSlot ? (isRearSlot ? 0.95 : 1.05) : (isRearSlot ? -0.95 : -1.05);
  const windowOffsetX = isLeftSlot ? (isRearSlot ? -0.55 : -0.65) : (isRearSlot ? 0.55 : 0.65);
  const windowWidth = isRearSlot ? 2.0 : 2.2;

  const signOffsetX = 0;
  const signWidth = width - 0.1;

  const handleShopClick = (e: any) => {
    e.stopPropagation();
    if (!isComingSoon && category) {
      const rad = slotConfig.rotationY;
      const worldDoorX = slotConfig.position[0] + Math.cos(rad) * doorOffsetX;
      const worldDoorZ = slotConfig.position[2] - Math.sin(rad) * doorOffsetX + depth / 2;
      onSelectShop(category, [worldDoorX, slotConfig.position[1], worldDoorZ]);
    }
  };

  return (
    <group
      position={slotConfig.position}
      rotation={[0, slotConfig.rotationY, 0]}
    >
      {/* ================================================== */}
      {/* 1. STOREFRONT ENVELOPE (LUMINOUS LUXURY INTERIOR) */}
      {/* ================================================== */}
      <group position={[0, height / 2, 0]}>
        {/* Rear Wall - Warm Ivory Stone with Cove Wash */}
        <mesh position={[0, 0, -depth / 2 + 0.1]} receiveShadow>
          <boxGeometry args={[width, height, 0.2]} />
          <primitive object={materials.interiorWallWarm} attach="material" />
        </mesh>

        {/* Luxury Nero Marquina Feature Wall behind Door Entrance */}
        <group position={[doorOffsetX, 0, -depth / 2 + 0.16]}>
          <mesh receiveShadow>
            <boxGeometry args={[doorWidth + 0.6, height - 0.5, 0.04]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>
          {/* Gold Perimeter Frame */}
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[doorWidth + 0.52, height - 0.58, 0.02]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[doorWidth + 0.44, height - 0.66, 0.02]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>
          {/* Warm Backlit Sconce / Chandelier behind Door */}
          <pointLight
            position={[0, 0.4, 0.4]}
            color="#F0B968"
            intensity={14}
            distance={4.2}
            decay={2}
          />
          {/* Dark Walnut Boutique Entrance Credenza */}
          <mesh position={[0, -height / 2 + 0.45, 0.35]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth * 0.75, 0.72, 0.45]} />
            <primitive object={materials.darkWalnut} attach="material" />
          </mesh>
          <mesh position={[0, -height / 2 + 0.82, 0.35]}>
            <boxGeometry args={[doorWidth * 0.72, 0.03, 0.42]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>
        </group>

        {/* Outer Side Wall */}
        <mesh position={[isLeftSlot ? -width / 2 + 0.1 : width / 2 - 0.1, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, height, depth]} />
          <primitive object={materials.ivoryMarble} attach="material" />
        </mesh>

        {/* ================================================== */}
        {/* ARCHITECTURAL INNER CORRIDOR WALL & CORNER PIER */}
        {/* ================================================== */}
        <group position={[isLeftSlot ? width / 2 - 0.1 : -width / 2 + 0.1, 0, 0]}>
          {/* Main Wall Plane with Calacatta Warm Ivory Finish */}
          <mesh 
            position={[0, 0, isRearSlot ? 0 : depth / 2 - 0.4]} 
            receiveShadow 
            castShadow
          >
            <boxGeometry args={[0.2, height, isRearSlot ? depth : 0.8]} />
            <primitive object={materials.ivoryMarble} attach="material" />
          </mesh>

          {/* Black Marble Baseboard Plinth along Floor */}
          <mesh 
            position={[isLeftSlot ? 0.02 : -0.02, -height / 2 + 0.2, isRearSlot ? 0 : depth / 2 - 0.4]} 
            receiveShadow
          >
            <boxGeometry args={[0.04, 0.4, isRearSlot ? depth : 0.8]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>

          {/* Champagne Gold Baseboard Top Trim */}
          <mesh position={[isLeftSlot ? 0.03 : -0.03, -height / 2 + 0.41, isRearSlot ? 0 : depth / 2 - 0.4]}>
            <boxGeometry args={[0.02, 0.03, isRearSlot ? depth : 0.8]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Warm Architectural Sconce on Corridor Face for rear shops */}
          {isRearSlot && (
            <group position={[isLeftSlot ? 0.04 : -0.04, 0.2, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.03, 0.9, 0.1]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[isLeftSlot ? 0.015 : -0.015, 0, 0]}>
                <boxGeometry args={[0.015, 0.75, 0.06]} />
                <primitive object={materials.fasciaCoveGlow} attach="material" />
              </mesh>
              <pointLight
                position={[isLeftSlot ? 0.15 : -0.15, 0, 0]}
                color="#F0B968"
                intensity={6.0}
                distance={3.8}
                decay={2}
              />
            </group>
          )}

          {/* Sleek Modern Luxury Architectural Corner Pier */}
          <group position={[0, 0, depth / 2]}>
            {/* Marble Pier Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.38, height, 0.38]} />
              <primitive object={materials.ivoryMarble} attach="material" />
            </mesh>
            {/* Black Marble Base Plinth */}
            <mesh position={[0, -height / 2 + 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.44, 0.4, 0.44]} />
              <primitive object={materials.blackMarbleFascia} attach="material" />
            </mesh>
            {/* Gold Base Bead Trim */}
            <mesh position={[0, -height / 2 + 0.41, 0]} castShadow>
              <boxGeometry args={[0.46, 0.03, 0.46]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>
            {/* Black Marble Capital Header */}
            <mesh position={[0, height / 2 - 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.44, 0.3, 0.44]} />
              <primitive object={materials.blackMarbleFascia} attach="material" />
            </mesh>
            {/* Gold Capital Bead Trim */}
            <mesh position={[0, height / 2 - 0.31, 0]} castShadow>
              <boxGeometry args={[0.46, 0.03, 0.46]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>
            {/* Vertical Warm Golden LED Reveal Strip Inset on Corner Face */}
            <mesh position={[0, 0, 0.2]}>
              <boxGeometry args={[0.06, height - 0.7, 0.02]} />
              <primitive object={materials.fasciaCoveGlow} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.19]}>
              <boxGeometry args={[0.1, height - 0.65, 0.02]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>
            <pointLight
              position={[0, 0, 0.32]}
              color="#F0B968"
              intensity={6.5}
              distance={3.8}
              decay={2}
            />
          </group>
        </group>

        {/* Ceiling Soffit */}
        <mesh position={[0, height / 2 - 0.1, 0]} receiveShadow>
          <boxGeometry args={[width, 0.2, depth]} />
          <primitive object={materials.ivoryMarble} attach="material" />
        </mesh>

        {/* Interior Wood Parquet Floor */}
        <mesh position={[0, -height / 2 + 0.06, 0]} receiveShadow>
          <boxGeometry args={[width - 0.2, 0.12, depth - 0.2]} />
          <primitive object={materials.interiorFloorWood} attach="material" />
        </mesh>

        {/* Fluted Ivory Marble Outer Side Pier with Champagne Gold Trim */}
        <group position={[isLeftSlot ? -width / 2 + 0.14 : width / 2 - 0.14, 0, depth / 2 + 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, height - 0.3, 0.16]} />
            <primitive object={materials.ivoryMarble} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.085]}>
            <boxGeometry args={[0.04, height - 0.4, 0.03]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>
        </group>

        {/* Center Mullion between Door and Showcase */}
        <group position={[isLeftSlot ? 0.48 : -0.48, -0.22, depth / 2 + 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, doorHeight + 0.2, 0.12]} />
            <primitive object={materials.deepGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[0.03, doorHeight + 0.2, 0.02]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>
        </group>

        {/* ================================================== */}
        {/* 2. SIGNATURE BLACK MARBLE FASCIA & GOLD SIGNAGE */}
        {/* Exactly matching reference: rich black with gold serif text */}
        {/* ================================================== */}
        <group position={[0, height / 2 - 0.55, depth / 2 + 0.08]}>
          {/* Upper Cornice Trim (Champagne Gold) */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[width + 0.12, 0.06, 0.18]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Polished Black Marble Fascia Band */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width + 0.08, 0.82, 0.12]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>

          {/* Lower Cornice Trim (Champagne Gold) */}
          <mesh position={[0, -0.44, 0]} castShadow>
            <boxGeometry args={[width + 0.12, 0.06, 0.18]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Recessed Warm Golden Cove Light Strip underneath Fascia */}
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[width - 0.2, 0.025, 0.08]} />
            <primitive object={materials.fasciaCoveGlow} attach="material" />
          </mesh>
          <pointLight
            position={[0, -0.6, 0.18]}
            color="#F0B968"
            intensity={9}
            distance={5}
            decay={2}
          />

          {/* Illuminated Store Name Signboard Plane */}
          <mesh position={[signOffsetX, 0, 0.085]}>
            <planeGeometry args={[signWidth, 0.78]} />
            <meshStandardMaterial
              map={signTexture}
              emissiveMap={signTexture}
              emissive="#E5BE5E"
              emissiveIntensity={0.65}
              roughness={0.15}
              metalness={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* ================================================== */}
      {/* 3. LUXURY BLACK MARBLE & GOLD ENTRANCE PORTAL */}
      {/* ================================================== */}
      <group position={[doorOffsetX, 0, depth / 2 + 0.04]}>
        {/* Polished Brass Floor Threshold with LED Under-glow */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[doorWidth + 0.36, 0.04, 0.4]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        <pointLight position={[0, 0.06, 0.15]} color="#F0B968" intensity={4} distance={2.5} decay={2} />

        {/* Outer Black Marble Portal Jambs & Architrave */}
        <group position={[0, doorHeight / 2 + 0.05, 0]}>
          {/* Left Black Marble Jamb */}
          <mesh position={[-doorWidth / 2 - 0.09, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.16, doorHeight + 0.14, 0.16]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>
          {/* Right Black Marble Jamb */}
          <mesh position={[doorWidth / 2 + 0.09, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.16, doorHeight + 0.14, 0.16]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>
          {/* Black Marble Transom Header */}
          <mesh position={[0, doorHeight / 2 + 0.07, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth + 0.34, 0.16, 0.16]} />
            <primitive object={materials.blackMarbleFascia} attach="material" />
          </mesh>

          {/* INTEGRATED VERTICAL GOLDEN LED LIGHT ACCENTS ON DOOR JAMBS */}
          {[-doorWidth / 2 - 0.01, doorWidth / 2 + 0.01].map((xJamb, jIdx) => (
            <group key={`door-accent-light-${jIdx}`} position={[xJamb, 0, 0.085]}>
              <mesh>
                <boxGeometry args={[0.025, doorHeight, 0.02]} />
                <primitive object={materials.fasciaCoveGlow} attach="material" />
              </mesh>
              <mesh position={[0, 0, -0.01]}>
                <boxGeometry args={[0.04, doorHeight + 0.04, 0.02]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <pointLight
                position={[0, 0, 0.12]}
                color="#F0B968"
                intensity={5.5}
                distance={3.0}
                decay={2}
              />
            </group>
          ))}
        </group>

        {/* Click Target Mesh covering the Door Opening */}
        <mesh
          position={[0, doorHeight / 2 + 0.05, 0.02]}
          onClick={handleShopClick}
          onPointerOver={() => {
            if (!isComingSoon) {
              document.body.style.cursor = "pointer";
              setHovered(true);
            }
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
            setHovered(false);
          }}
          visible={false}
        >
          <planeGeometry args={[doorWidth, doorHeight]} />
          <meshBasicMaterial />
        </mesh>

        {/* HINGED TRANSPARENT GLASS DOOR LEAF */}
        <group
          ref={doorPivotRef}
          position={[isLeftSlot ? doorWidth / 2 : -doorWidth / 2, 0, 0]}
        >
          <group position={[isLeftSlot ? -doorWidth / 2 : doorWidth / 2, doorHeight / 2 + 0.05, 0]}>
            {/* Clear Transparent Glass Door Leaf */}
            <mesh castShadow>
              <boxGeometry args={[doorWidth - 0.06, doorHeight, 0.04]} />
              <primitive object={materials.doorGlass} attach="material" />
            </mesh>

            {/* Perimeter Black Aluminum Frame */}
            {[-doorWidth / 2 + 0.02, doorWidth / 2 - 0.02].map((xBorder, bIdx) => (
              <mesh key={`door-frame-v-${bIdx}`} position={[xBorder, 0, 0.025]}>
                <boxGeometry args={[0.04, doorHeight, 0.03]} />
                <primitive object={materials.deepGraphite} attach="material" />
              </mesh>
            ))}
            {[-doorHeight / 2 + 0.02, doorHeight / 2 - 0.02].map((yBorder, bIdx) => (
              <mesh key={`door-frame-h-${bIdx}`} position={[0, yBorder, 0.025]}>
                <boxGeometry args={[doorWidth - 0.04, 0.04, 0.03]} />
                <primitive object={materials.deepGraphite} attach="material" />
              </mesh>
            ))}

            {/* DESIGNER VERTICAL GOLD PULL HANDLE */}
            <group position={[isLeftSlot ? -doorWidth / 2 + 0.18 : doorWidth / 2 - 0.18, 0, 0.06]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.026, 0.026, 1.8, 20]} />
                <primitive object={materials.handleGold} ref={handleMeshRef} attach="material" />
              </mesh>
              {/* Walnut Grip Inlay */}
              <mesh position={[0, 0, 0.015]}>
                <boxGeometry args={[0.035, 1.2, 0.022]} />
                <primitive object={materials.darkWalnut} attach="material" />
              </mesh>
              {[0.75, -0.75].map((y, i) => (
                <mesh key={`handle-bracket-${i}`} position={[0, y, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.022, 0.022, 0.08, 16]} />
                  <primitive object={materials.champagneGold} attach="material" />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>

      {/* ================================================== */}
      {/* 4. ULTRA-CLEAR FLOOR-TO-CEILING SHOWCASE VITRINE */}
      {/* ================================================== */}
      <group position={[windowOffsetX, doorHeight / 2 + 0.05, depth / 2 + 0.02]}>
        <mesh
          onClick={handleShopClick}
          onPointerOver={() => {
            if (!isComingSoon) {
              document.body.style.cursor = "pointer";
              setHovered(true);
            }
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
            setHovered(false);
          }}
        >
          <planeGeometry args={[windowWidth - 0.08, doorHeight]} />
          <primitive object={materials.ultraClearGlass} attach="material" />
        </mesh>
        {/* Sleek Champagne Gold Top and Bottom Perimeter Trim */}
        <mesh position={[0, doorHeight / 2, 0.01]}>
          <boxGeometry args={[windowWidth, 0.04, 0.04]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        <mesh position={[0, -doorHeight / 2, 0.01]}>
          <boxGeometry args={[windowWidth, 0.04, 0.04]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
      </group>

      {/* ================================================== */}
      {/* 5. POWERFUL INTERIOR SPOTLIGHTS & WARM AMBIENT GLOW */}
      {/* ================================================== */}
      <pointLight
        ref={interiorLightRef}
        position={[windowOffsetX, 3.2, 0.8]}
        color="#FCEFD8"
        intensity={34}
        distance={10}
        decay={2}
      />
      <spotLight
        ref={spotLightRef}
        position={[windowOffsetX, 4.0, 1.6]}
        target-position={[windowOffsetX, 1.2, 0.5]}
        angle={0.75}
        penumbra={0.8}
        color="#FAF5EE"
        intensity={28}
        distance={10}
        decay={2}
      />

      {/* ================================================== */}
      {/* 6. BESPOKE STOREFRONT INTERIORS (LOCKED TO REFERENCE) */}
      {/* ================================================== */}
      <group position={[windowOffsetX, 0, 0.4]}>
        {/* -------------------------------------------------- */}
        {/* SHIRTS BOUTIQUE (Left Front - Mannequins & Apparel) */}
        {/* -------------------------------------------------- */}
        {category?.theme === "shirts" && (
          <group position={[0, 0, 0]}>
            {/* Walnut & Marble Display Table */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[windowWidth - 0.25, 0.7, 0.7]} />
              <primitive object={materials.darkWalnut} attach="material" />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[windowWidth - 0.2, 0.04, 0.75]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>

            {/* Mannequin 1: Blue Tailored Shirt with White Collar & Tie (Left) */}
            <group ref={heroDisplayRef} position={[-0.45, 0.85, 0.05]}>
              {/* Polished Gold Stand & Base */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0.02, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.24, 0.04, 20]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              {/* Tailored Torso Bust */}
              <mesh position={[0, 0.88, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.21, 0.78, 24]} />
                <primitive object={materials.blueShirtFabric} attach="material" />
              </mesh>
              {/* Shoulders */}
              <mesh position={[0, 1.25, 0]} castShadow>
                <cylinderGeometry args={[0.33, 0.28, 0.32, 24]} />
                <primitive object={materials.blueShirtFabric} attach="material" />
              </mesh>
              {/* White Collar */}
              <mesh position={[0, 1.44, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.14, 0.08, 20]} />
                <primitive object={materials.whiteShirtFabric} attach="material" />
              </mesh>
              {/* Silk Navy Tie */}
              <mesh position={[0, 1.05, 0.16]} castShadow>
                <boxGeometry args={[0.06, 0.52, 0.02]} />
                <primitive object={materials.navyShirtFabric} attach="material" />
              </mesh>
              {/* Polished Gold Neck Finial */}
              <mesh position={[0, 1.54, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
            </group>

            {/* Mannequin 2: Crisp White Dress Shirt (Right) */}
            <group position={[0.45, 0.85, 0.05]}>
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0.02, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.24, 0.04, 20]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0.88, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.21, 0.78, 24]} />
                <primitive object={materials.whiteShirtFabric} attach="material" />
              </mesh>
              <mesh position={[0, 1.25, 0]} castShadow>
                <cylinderGeometry args={[0.33, 0.28, 0.32, 24]} />
                <primitive object={materials.whiteShirtFabric} attach="material" />
              </mesh>
              <mesh position={[0, 1.44, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.14, 0.08, 20]} />
                <primitive object={materials.whiteShirtFabric} attach="material" />
              </mesh>
              <mesh position={[0, 1.54, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
            </group>

            {/* Folded Shirt Stacks on Center Table */}
            <group position={[0, 0.85, 0]}>
              {[0, 0.07, 0.14, 0.21].map((y, j) => (
                <mesh key={`folded-${j}`} position={[0, y + 0.035, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.06, 0.45]} />
                  <primitive
                    object={
                      j % 3 === 0
                        ? materials.whiteShirtFabric
                        : j % 3 === 1
                        ? materials.blueShirtFabric
                        : materials.navyShirtFabric
                    }
                    attach="material"
                  />
                </mesh>
              ))}
            </group>

            {/* Menswear Fashion Art Visual on Back Wall */}
            <group position={[0, 2.3, -1.2]}>
              <mesh>
                <boxGeometry args={[2.0, 1.4, 0.04]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[1.9, 1.3]} />
                <primitive object={materials.deepGraphite} attach="material" />
              </mesh>
              <pointLight position={[0, 0, 0.25]} color="#F0B968" intensity={6} distance={3.5} decay={2} />
            </group>

            {/* Boutique Indoor Plant in Vitrine Corner */}
            <group position={[-1.3, 0.1, -0.6]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.18, 0.7, 16]} />
                <primitive object={materials.blackMarbleFascia} attach="material" />
              </mesh>
              <mesh position={[0, 0.85, 0]} castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <primitive object={materials.plantLeaf} attach="material" />
              </mesh>
            </group>
          </group>
        )}

        {/* -------------------------------------------------- */}
        {/* MUGS BOUTIQUE (Right Front - Backlit Shelving & Mugs) */}
        {/* -------------------------------------------------- */}
        {category?.theme === "mugs" && (
          <group position={[0, 0, 0]}>
            {/* Backlit Walnut & Glass Shelving Unit */}
            <group position={[0, 1.8, -0.1]}>
              {[-0.7, 0, 0.7].map((y, shelfIdx) => (
                <group key={`shelf-${shelfIdx}`} position={[0, y, 0]}>
                  {/* Glass Shelf with Gold Trim */}
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[windowWidth - 0.2, 0.04, 0.45]} />
                    <primitive object={materials.ultraClearGlass} attach="material" />
                  </mesh>
                  <mesh position={[0, 0, 0.23]}>
                    <boxGeometry args={[windowWidth - 0.18, 0.04, 0.02]} />
                    <primitive object={materials.champagneGold} attach="material" />
                  </mesh>
                  {/* Underside Golden LED Linear Glow Strip */}
                  <mesh position={[0, -0.025, 0.05]}>
                    <boxGeometry args={[windowWidth - 0.2, 0.015, 0.3]} />
                    <primitive object={materials.fasciaCoveGlow} attach="material" />
                  </mesh>

                  {/* Curated Ceramic & Gold MW Mugs */}
                  {[-0.65, -0.22, 0.22, 0.65].map((x, mugIdx) => (
                    <group key={`mug-${shelfIdx}-${mugIdx}`} position={[x, 0.2, 0]}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.14, 0.14, 0.32, 20]} />
                        <primitive
                          object={
                            (shelfIdx + mugIdx) % 2 === 0
                              ? materials.ceramicBlack
                              : materials.ceramicWhite
                          }
                          attach="material"
                        />
                      </mesh>
                      <mesh position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                        <torusGeometry args={[0.09, 0.026, 12, 16]} />
                        <primitive object={materials.champagneGold} attach="material" />
                      </mesh>
                    </group>
                  ))}
                </group>
              ))}

              {/* Backlit Shelf Glow Panel */}
              <mesh position={[0, 0, -0.3]}>
                <planeGeometry args={[windowWidth - 0.3, 2.2]} />
                <primitive object={materials.interiorWallWarm} attach="material" />
              </mesh>
              <pointLight position={[0, 0, -0.1]} color="#F0B968" intensity={12} distance={4} decay={2} />
            </group>

            {/* Foreground Pedestal displaying Hero Gold-Rim Mug */}
            <group ref={heroDisplayRef} position={[0, 0.85, 0.45]}>
              <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.42, 0.46, 0.8, 24]} />
                <primitive object={materials.ivoryMarble} attach="material" />
              </mesh>
              <mesh position={[0, 0.02, 0]} castShadow>
                <cylinderGeometry args={[0.44, 0.44, 0.04, 24]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0.24, 0]} castShadow>
                <cylinderGeometry args={[0.19, 0.19, 0.4, 24]} />
                <primitive object={materials.ceramicBlack} attach="material" />
              </mesh>
              <mesh position={[0.22, 0.24, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <torusGeometry args={[0.12, 0.035, 16, 20]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
            </group>

            {/* Boutique Indoor Plant in Window Corner */}
            <group position={[1.3, 0.1, -0.5]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.18, 0.7, 16]} />
                <primitive object={materials.blackMarbleFascia} attach="material" />
              </mesh>
              <mesh position={[0, 0.85, 0]} castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <primitive object={materials.plantLeaf} attach="material" />
              </mesh>
            </group>
          </group>
        )}

        {/* -------------------------------------------------- */}
        {/* PENS BOUTIQUE (Left Rear - Illuminated Jewelry Vitrines) */}
        {/* -------------------------------------------------- */}
        {category?.theme === "pens" && (
          <group position={[0, 0, 0]}>
            {/* Dark Walnut Horizontal Display Showcase */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[windowWidth - 0.4, 1.2, 1.0]} />
              <primitive object={materials.darkWalnut} attach="material" />
            </mesh>
            <mesh position={[0, 1.36, 0]}>
              <boxGeometry args={[windowWidth - 0.36, 0.03, 1.04]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>
            <mesh position={[0, 1.55, 0]}>
              <boxGeometry args={[windowWidth - 0.5, 0.35, 0.9]} />
              <primitive object={materials.ultraClearGlass} attach="material" />
            </mesh>

            {/* Illuminated Fountain Pens on Angled Brass Risers */}
            <group ref={heroDisplayRef} position={[0, 1.4, 0]}>
              {[-0.8, -0.27, 0.27, 0.8].map((x, i) => (
                <group key={`pen-vitrine-${i}`} position={[x, 0, 0]}>
                  <mesh position={[0, 0.03, 0]} castShadow>
                    <boxGeometry args={[0.18, 0.05, 0.24]} />
                    <primitive object={materials.champagneGold} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.16, 0]} rotation={[0.15, 0, 0.28]} castShadow>
                    <cylinderGeometry args={[0.024, 0.024, 0.68, 16]} />
                    <primitive
                      object={i % 2 === 0 ? materials.deepGraphite : materials.darkWalnut}
                      attach="material"
                    />
                  </mesh>
                  <mesh position={[0.03, 0.48, 0.03]} rotation={[0.15, 0, 0.28]}>
                    <coneGeometry args={[0.024, 0.1, 16]} />
                    <primitive object={materials.champagneGold} attach="material" />
                  </mesh>
                </group>
              ))}
            </group>

            {/* Vertical Hero Fountain Pen Showcase Panel on Back Wall */}
            <group position={[0, 2.3, -1.1]}>
              <mesh>
                <boxGeometry args={[1.4, 2.0, 0.04]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[1.3, 1.9]} />
                <primitive object={materials.deepGraphite} attach="material" />
              </mesh>
              {/* Stylized Golden Fountain Pen Graphic Silhouette */}
              <mesh position={[0, 0, 0.035]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.045, 0.045, 1.3, 16]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <pointLight position={[0, 0, 0.25]} color="#F0B968" intensity={7} distance={3.5} decay={2} />
            </group>
          </group>
        )}

        {/* -------------------------------------------------- */}
        {/* PHOTO FRAMES GALLERY (Right Rear - Museum Frame Wall) */}
        {/* -------------------------------------------------- */}
        {category?.theme === "frames" && (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[windowWidth - 0.4, 0.8, 0.9]} />
              <primitive object={materials.deepGraphite} attach="material" />
            </mesh>
            <mesh position={[0, 0.81, 0]}>
              <boxGeometry args={[windowWidth - 0.35, 0.03, 0.94]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>

            {/* Museum Gallery Composition of 3 Frames */}
            <group ref={heroDisplayRef} position={[0, 1.6, 0]}>
              {/* Hero Large Gold Frame (Center) */}
              <group position={[0, 0.25, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[1.15, 1.45, 0.06]} />
                  <primitive object={materials.champagneGold} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.035]}>
                  <planeGeometry args={[0.95, 1.25]} />
                  <primitive object={materials.ivoryMarble} attach="material" />
                </mesh>
              </group>
              {/* Left Walnut Frame */}
              <group position={[-0.9, -0.05, 0.12]} rotation={[0, 0.22, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.75, 0.95, 0.05]} />
                  <primitive object={materials.darkWalnut} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.03]}>
                  <planeGeometry args={[0.6, 0.8]} />
                  <primitive object={materials.interiorWallWarm} attach="material" />
                </mesh>
              </group>
              {/* Right Graphite Frame */}
              <group position={[0.9, -0.05, 0.12]} rotation={[0, -0.22, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.75, 0.95, 0.05]} />
                  <primitive object={materials.deepGraphite} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.03]}>
                  <planeGeometry args={[0.6, 0.8]} />
                  <primitive object={materials.champagneGold} attach="material" />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* -------------------------------------------------- */}
        {/* PREMIUM COMING SOON STOREFRONT (Luxury Monolith) */}
        {/* -------------------------------------------------- */}
        {isComingSoon && (
          <group position={[0, 0, 0]}>
            {/* Dark Marble & Gold Presentation Pedestal */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[windowWidth - 0.4, 0.72, 0.8]} />
              <primitive object={materials.blackMarbleFascia} attach="material" />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[windowWidth - 0.36, 0.04, 0.84]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>

            {/* Central Brushed Gold Monolith Emblem */}
            <group ref={heroDisplayRef} position={[0, 1.45, 0]}>
              <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.55, 0.55, 0.55]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              {/* Floating Halo Ring */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.018, 16, 32]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
            </group>

            {/* Smoked Acrylic Luxury Plaque on Pedestal */}
            <group position={[0, 0.45, 0.42]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.6, 0.36, 0.02]} />
                <primitive object={materials.deepGraphite} attach="material" />
              </mesh>
              {plaqueTexture && (
                <mesh position={[0, 0, 0.015]}>
                  <planeGeometry args={[1.56, 0.32]} />
                  <meshStandardMaterial
                    map={plaqueTexture}
                    emissiveMap={plaqueTexture}
                    emissive="#E5BE5E"
                    emissiveIntensity={0.65}
                    roughness={0.18}
                    metalness={0.4}
                  />
                </mesh>
              )}
            </group>
          </group>
        )}
      </group>
    </group>
  );
}
