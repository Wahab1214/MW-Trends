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

export default function ShirtsBoutique({
  products,
  selectedProduct,
  onSelectProduct,
  onHoverProduct,
}: BoutiqueProps) {
  // Curate 1 hero + up to 6 standard products (max 7-8 visible)
  const heroProduct = products[0] || null;
  const standardProducts = useMemo(() => products.slice(1, 7), [products]);

  // Dedicated spotlight targets for accurate frontal focus
  const heroTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 1.1, 0);
    return obj;
  }, []);

  const leftRailTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-4.6, 1.0, 0);
    return obj;
  }, []);

  const rightShelfTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(4.6, 1.0, 0);
    return obj;
  }, []);

  return (
    <group>
      {/* 1. ROOM ARCHITECTURE (Boutique Envelope) */}
      {/* Polished Nero Marquina Marble Floor with soft warm sheen */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#201E1C" roughness={0.24} metalness={0.25} />
      </mesh>

      {/* Ceiling with Recessed Warm Light Coffers */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#262320" roughness={0.7} />
      </mesh>

      {/* Rear Feature Wall with Smoked Bronze Mirrors */}
      <mesh position={[0, 2.5, -7.5]}>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial color="#2D2824" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Central Smoked Bronze Mirror Panel */}
      <mesh position={[0, 2.6, -7.42]}>
        <planeGeometry args={[5.2, 4.2]} />
        <meshPhysicalMaterial
          color="#44392D"
          roughness={0.12}
          metalness={0.92}
          clearcoat={0.9}
        />
      </mesh>
      {/* Mirror Champagne Gold Bevel Frame */}
      <mesh position={[0, 2.6, -7.41]}>
        <boxGeometry args={[5.35, 4.35, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} wireframe={false} />
      </mesh>

      {/* Left Wall (Hanging Brass Apparel Rail Architecture) */}
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#282522" roughness={0.55} />
      </mesh>
      {/* Minimalist Champagne Gold Apparel Rail */}
      <mesh position={[-5.8, 2.4, 0]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 6.5, 16]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Left Wall Backlit Alcove Recess */}
      <mesh position={[-7.4, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7.2, 3.4]} />
        <meshStandardMaterial color="#322C27" roughness={0.45} />
      </mesh>

      {/* Right Wall (Folded Shirt Boutique Shelving Architecture) */}
      <mesh position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#282522" roughness={0.55} />
      </mesh>
      {/* Right Wall Symmetrical Boutique Shelves */}
      {[-1.8, 0, 1.8].map((z, i) => (
        <group key={`shelf-${i}`} position={[6.2, 1.1, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.08, 1.2]} />
            <meshStandardMaterial color="#3A2E24" roughness={0.3} metalness={0.35} />
          </mesh>
          {/* Under-shelf Warm LED Strip */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[1.5, 0.02, 1.1]} />
            <meshBasicMaterial color="#FFDF9E" />
          </mesh>
        </group>
      ))}

      {/* 2. HERO PRODUCT DISPLAY ZONE (Center Luxury Plinth) */}
      {heroProduct && (
        <group position={[0, 0, 0]}>
          {/* Tiered Octagonal Nero Marquina Plinth */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.55, 0.44, 8]} />
            <meshStandardMaterial color="#25221F" roughness={0.22} metalness={0.4} />
          </mesh>
          {/* Champagne Gold Inlay Trim Ring */}
          <mesh position={[0, 0.45, 0]}>
            <torusGeometry args={[1.38, 0.03, 16, 32]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
          </mesh>

          {/* Hero Shirt 3D Display */}
          <InteriorProduct3D
            product={heroProduct}
            position={[0, 0.46, 0]}
            scale={1.15}
            isHero={true}
            isSelected={selectedProduct?.id === heroProduct.id}
            isDeemphasized={selectedProduct !== null && selectedProduct.id !== heroProduct.id}
            onSelect={onSelectProduct}
            onHover={onHoverProduct}
          />
        </group>
      )}

      {/* 3. STANDARD PRODUCTS (Boutique Rails & Niches: 4 to 6 max) */}
      {standardProducts.map((product, idx) => {
        let pos: [number, number, number] = [0, 0, 0];
        let rot: [number, number, number] = [0, 0, 0];

        if (idx === 0) {
          pos = [-4.6, 0.35, -1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 1) {
          pos = [-4.6, 0.35, 1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 2) {
          pos = [4.6, 0.35, -1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 3) {
          pos = [4.6, 0.35, 1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 4) {
          pos = [-2.4, 0.35, -4.8];
          rot = [0, 0.25, 0];
        } else if (idx === 5) {
          pos = [2.4, 0.35, -4.8];
          rot = [0, -0.25, 0];
        }

        return (
          <group key={product.id}>
            {/* Display Base Pedestal */}
            <mesh position={[pos[0], pos[1] / 2, pos[2]]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.6, pos[1], 24]} />
              <meshStandardMaterial color="#2A2623" roughness={0.28} metalness={0.35} />
            </mesh>
            <mesh position={[pos[0], pos[1], pos[2]]}>
              <torusGeometry args={[0.55, 0.02, 12, 24]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} />
            </mesh>

            <InteriorProduct3D
              product={product}
              position={pos}
              rotation={rot}
              scale={0.92}
              isHero={false}
              isSelected={selectedProduct?.id === product.id}
              isDeemphasized={selectedProduct !== null && selectedProduct.id !== product.id}
              onSelect={onSelectProduct}
              onHover={onHoverProduct}
            />
          </group>
        );
      })}

      {/* 4. WARM FASHION LIGHTING RIG */}
      {/* Target Primitives for Spotlights */}
      <primitive object={heroTargetObj} />
      <primitive object={leftRailTargetObj} />
      <primitive object={rightShelfTargetObj} />

      {/* Central Dramatic Key Spotlight illuminating front face of Hero */}
      <spotLight
        target={heroTargetObj}
        position={[0, 4.6, 2.6]}
        intensity={4.2}
        angle={0.65}
        penumbra={0.6}
        color="#FFF5E4"
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Left Rail Front-Angled Track Spotlight */}
      <spotLight
        target={leftRailTargetObj}
        position={[-4.5, 4.4, 2.0]}
        intensity={3.0}
        angle={0.7}
        penumbra={0.7}
        color="#FDE8C7"
      />
      {/* Right Shelf Front-Angled Track Spotlight */}
      <spotLight
        target={rightShelfTargetObj}
        position={[4.5, 4.4, 2.0]}
        intensity={3.0}
        angle={0.7}
        penumbra={0.7}
        color="#FDE8C7"
      />
      {/* Back Bronze Mirror Warm Accent Light */}
      <pointLight position={[0, 3.2, -6.8]} intensity={2.2} color="#D4AF37" distance={8} />
    </group>
  );
}
