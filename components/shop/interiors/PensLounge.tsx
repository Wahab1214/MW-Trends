"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Product } from "@/lib/data/mockCatalog";
import InteriorProduct3D from "../InteriorProduct3D";

interface BoutiqueProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onHoverProduct: (product: Product | null) => void;
}

export default function PensLounge({
  products,
  selectedProduct,
  onSelectProduct,
  onHoverProduct,
}: BoutiqueProps) {
  const heroProduct = products[0] || null;
  const standardProducts = useMemo(() => products.slice(1, 7), [products]);

  // Dedicated spotlight targets for accurate focus
  const heroTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 0.85, 0);
    return obj;
  }, []);

  const leftVitrineTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-4.5, 1.2, 0);
    return obj;
  }, []);

  const rightVitrineTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(4.5, 1.2, 0);
    return obj;
  }, []);

  return (
    <group>
      {/* 1. ROOM ARCHITECTURE (Writing Lounge Envelope) */}
      {/* Dark Nero Marquina Marble Floor with Walnut Inlay Pattern */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#201D1A" roughness={0.24} metalness={0.25} />
      </mesh>

      {/* Dark Walnut Coffered Ceiling */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#2E2218" roughness={0.65} />
      </mesh>

      {/* Rear Wall: Architectural Dark Walnut Acoustic Slats */}
      <mesh position={[0, 2.5, -7.5]}>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial color="#3A2A1E" roughness={0.45} />
      </mesh>
      {/* Center Polished Black Granite Feature Inset */}
      <mesh position={[0, 2.6, -7.42]}>
        <planeGeometry args={[6.2, 3.8]} />
        <meshStandardMaterial color="#282420" roughness={0.16} metalness={0.35} />
      </mesh>
      <mesh position={[0, 2.6, -7.4]}>
        <boxGeometry args={[6.35, 3.95, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Left Wall Glass Vitrines with Walnut Millwork */}
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292018" roughness={0.55} />
      </mesh>
      {/* Wall Display Case Structure */}
      <mesh position={[-5.8, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.6, 6.8]} />
        <meshStandardMaterial color="#3C281C" roughness={0.35} metalness={0.25} />
      </mesh>
      {/* Cognac Leather Lined Interior Inset */}
      <mesh position={[-5.0, 1.6, 0]}>
        <boxGeometry args={[0.04, 2.2, 6.4]} />
        <meshStandardMaterial color="#6B4328" roughness={0.8} />
      </mesh>

      {/* Right Wall Symmetrical Glass Vitrine */}
      <mesh position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292018" roughness={0.55} />
      </mesh>
      <mesh position={[5.8, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.6, 6.8]} />
        <meshStandardMaterial color="#3C281C" roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh position={[5.0, 1.6, 0]}>
        <boxGeometry args={[0.04, 2.2, 6.4]} />
        <meshStandardMaterial color="#6B4328" roughness={0.8} />
      </mesh>

      {/* 2. HERO PRODUCT DISPLAY ZONE (Monumental Glass & Walnut Vitrine Island) */}
      {heroProduct && (
        <group position={[0, 0, 0]}>
          {/* Monumental Walnut Base Cabinet */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.7, 1.3]} />
            <meshStandardMaterial color="#42281A" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Brushed Brass Chamfer Trim Band */}
          <mesh position={[0, 0.71, 0]}>
            <boxGeometry args={[1.94, 0.03, 1.34]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* Cognac Leather Presentation Tray Inset */}
          <mesh position={[0, 0.73, 0]}>
            <boxGeometry args={[1.65, 0.02, 1.05]} />
            <meshStandardMaterial color="#724528" roughness={0.85} />
          </mesh>
          {/* Protective Low-Iron Glass Showcase Cover */}
          <mesh position={[0, 1.08, 0]}>
            <boxGeometry args={[1.75, 0.68, 1.15]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.92}
              roughness={0.05}
              ior={1.5}
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Hero Pen 3D Display (Inside Vitrine) */}
          <InteriorProduct3D
            product={heroProduct}
            position={[0, 0.76, 0]}
            scale={1.25}
            isHero={true}
            isSelected={selectedProduct?.id === heroProduct.id}
            isDeemphasized={selectedProduct !== null && selectedProduct.id !== heroProduct.id}
            onSelect={onSelectProduct}
            onHover={onHoverProduct}
          />
        </group>
      )}

      {/* 3. STANDARD PRODUCTS (In Lit Cases & Trays: up to 6) */}
      {standardProducts.map((product, idx) => {
        let pos: [number, number, number] = [0, 0, 0];
        let rot: [number, number, number] = [0, 0, 0];

        if (idx === 0) {
          pos = [-4.6, 0.65, -1.8];
          rot = [0, 0.45, 0];
        } else if (idx === 1) {
          pos = [-4.6, 0.65, 1.8];
          rot = [0, -0.45, 0];
        } else if (idx === 2) {
          pos = [4.6, 0.65, -1.8];
          rot = [0, -0.45, 0];
        } else if (idx === 3) {
          pos = [4.6, 0.65, 1.8];
          rot = [0, 0.45, 0];
        } else if (idx === 4) {
          pos = [-2.2, 0.5, -4.8];
          rot = [0, 0.2, 0];
        } else if (idx === 5) {
          pos = [2.2, 0.5, -4.8];
          rot = [0, -0.2, 0];
        }

        return (
          <group key={product.id}>
            {/* Tray Display Base */}
            <mesh position={[pos[0], pos[1] - 0.05, pos[2]]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.06, 0.7]} />
              <meshStandardMaterial color="#3C281C" roughness={0.35} metalness={0.25} />
            </mesh>
            <mesh position={[pos[0], pos[1] - 0.01, pos[2]]}>
              <boxGeometry args={[0.9, 0.02, 0.6]} />
              <meshStandardMaterial color="#6B4328" roughness={0.8} />
            </mesh>

            <InteriorProduct3D
              product={product}
              position={pos}
              rotation={rot}
              scale={1.05}
              isHero={false}
              isSelected={selectedProduct?.id === product.id}
              isDeemphasized={selectedProduct !== null && selectedProduct.id !== product.id}
              onSelect={onSelectProduct}
              onHover={onHoverProduct}
            />
          </group>
        );
      })}

      {/* 4. WRITING LOUNGE WARM PIN-SPOT LIGHTING */}
      <primitive object={heroTargetObj} />
      <primitive object={leftVitrineTargetObj} />
      <primitive object={rightVitrineTargetObj} />

      {/* Precision Focused Pin-Spot on Vitrine Island from front-top */}
      <spotLight
        target={heroTargetObj}
        position={[0, 4.6, 2.4]}
        intensity={4.4}
        angle={0.55}
        penumbra={0.65}
        color="#FFF2DE"
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Vitrine Left & Right Pin Spots */}
      <spotLight
        target={leftVitrineTargetObj}
        position={[-4.2, 4.0, 1.8]}
        intensity={3.2}
        angle={0.6}
        penumbra={0.7}
        color="#FDE5C5"
      />
      <spotLight
        target={rightVitrineTargetObj}
        position={[4.2, 4.0, 1.8]}
        intensity={3.2}
        angle={0.6}
        penumbra={0.7}
        color="#FDE5C5"
      />
      {/* Rear Slats Warm Accent Wash */}
      <pointLight position={[0, 3.4, -6.8]} intensity={2.2} color="#D4AF37" distance={8} />
    </group>
  );
}
