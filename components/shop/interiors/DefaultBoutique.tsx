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

export default function DefaultBoutique({
  products,
  selectedProduct,
  onSelectProduct,
  onHoverProduct,
}: BoutiqueProps) {
  const heroProduct = products[0] || null;
  const standardProducts = useMemo(() => products.slice(1, 7), [products]);

  // Dedicated spotlight target for accurate focus
  const heroTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 0.8, 0);
    return obj;
  }, []);

  return (
    <group>
      {/* 1. ROOM ARCHITECTURE (Universal Luxury Atelier) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#201E1C" roughness={0.24} metalness={0.25} />
      </mesh>

      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#262320" roughness={0.75} />
      </mesh>

      {/* Rear Feature Wall */}
      <mesh position={[0, 2.5, -7.5]}>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial color="#2D2824" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.6, -7.42]}>
        <planeGeometry args={[6.5, 3.8]} />
        <meshStandardMaterial color="#352F28" roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.6, -7.4]}>
        <boxGeometry args={[6.65, 3.95, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Flanking Walls */}
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292521" roughness={0.55} />
      </mesh>
      <mesh position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292521" roughness={0.55} />
      </mesh>

      {/* 2. HERO PRODUCT DISPLAY (Curated Central Plinth) */}
      {heroProduct && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.3, 1.45, 0.5, 8]} />
            <meshStandardMaterial color="#272320" roughness={0.28} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.51, 0]}>
            <torusGeometry args={[1.3, 0.03, 16, 32]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
          </mesh>

          <InteriorProduct3D
            product={heroProduct}
            position={[0, 0.55, 0]}
            scale={1.2}
            isHero={true}
            isSelected={selectedProduct?.id === heroProduct.id}
            isDeemphasized={selectedProduct !== null && selectedProduct.id !== heroProduct.id}
            onSelect={onSelectProduct}
            onHover={onHoverProduct}
          />
        </group>
      )}

      {/* 3. STANDARD PRODUCTS (up to 6) */}
      {standardProducts.map((product, idx) => {
        let pos: [number, number, number] = [0, 0, 0];
        let rot: [number, number, number] = [0, 0, 0];

        if (idx === 0) {
          pos = [-4.6, 0.45, -1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 1) {
          pos = [-4.6, 0.45, 1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 2) {
          pos = [4.6, 0.45, -1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 3) {
          pos = [4.6, 0.45, 1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 4) {
          pos = [-2.4, 0.45, -4.6];
          rot = [0, 0.2, 0];
        } else if (idx === 5) {
          pos = [2.4, 0.45, -4.6];
          rot = [0, -0.2, 0];
        }

        return (
          <group key={product.id}>
            <mesh position={[pos[0], pos[1] / 2, pos[2]]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.55, pos[1], 24]} />
              <meshStandardMaterial color="#2B2723" roughness={0.28} metalness={0.35} />
            </mesh>
            <mesh position={[pos[0], pos[1], pos[2]]}>
              <torusGeometry args={[0.5, 0.02, 12, 24]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} />
            </mesh>

            <InteriorProduct3D
              product={product}
              position={pos}
              rotation={rot}
              scale={0.95}
              isHero={false}
              isSelected={selectedProduct?.id === product.id}
              isDeemphasized={selectedProduct !== null && selectedProduct.id !== product.id}
              onSelect={onSelectProduct}
              onHover={onHoverProduct}
            />
          </group>
        );
      })}

      {/* 4. LIGHTING */}
      <primitive object={heroTargetObj} />

      <spotLight
        target={heroTargetObj}
        position={[0, 4.6, 2.4]}
        intensity={4.2}
        angle={0.65}
        penumbra={0.7}
        color="#FFF6EC"
        castShadow
        shadow-bias={-0.0001}
      />
      <pointLight position={[-4.5, 3.4, 1.2]} intensity={2.4} color="#FFDCA8" distance={7} />
      <pointLight position={[4.5, 3.4, 1.2]} intensity={2.4} color="#FFDCA8" distance={7} />
      <pointLight position={[0, 3.4, -6.6]} intensity={2.0} color="#FFE6B8" distance={7} />
    </group>
  );
}
