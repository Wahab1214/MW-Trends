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

export default function MugsGallery({
  products,
  selectedProduct,
  onSelectProduct,
  onHoverProduct,
}: BoutiqueProps) {
  const heroProduct = products[0] || null;
  const standardProducts = useMemo(() => products.slice(1, 7), [products]);

  // Dedicated spotlight target for accurate hero frontal focus
  const heroTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 0.7, 0);
    return obj;
  }, []);

  return (
    <group>
      {/* 1. ROOM ARCHITECTURE (Gallery Envelope) */}
      {/* Polished Marble & Terrazzo Floor with subtle warm specular pool */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#201E1C" roughness={0.24} metalness={0.25} />
      </mesh>

      {/* Acoustic Ceiling Grid */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#262320" roughness={0.75} />
      </mesh>

      {/* Rear Gallery Wall with Recessed Gold Object Plinth */}
      <mesh position={[0, 2.5, -7.5]}>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial color="#2D2824" roughness={0.45} />
      </mesh>
      {/* Architectural Backlit Wall Band */}
      <mesh position={[0, 2.6, -7.45]}>
        <planeGeometry args={[12, 1.8]} />
        <meshStandardMaterial color="#352E28" roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.5, -7.42]}>
        <boxGeometry args={[12.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#FFDF9E" />
      </mesh>
      <mesh position={[0, 1.7, -7.42]}>
        <boxGeometry args={[12.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#FFDF9E" />
      </mesh>

      {/* Left Wall Niches with 2700K Amber Shelf Lighting */}
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#282522" roughness={0.55} />
      </mesh>
      {[-2.2, 0, 2.2].map((z, i) => (
        <group key={`mug-niche-left-${i}`} position={[-6.8, 1.6, z]}>
          {/* Recessed Niche Backing */}
          <mesh position={[-0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 2.2]} />
            <meshStandardMaterial color="#383028" roughness={0.45} />
          </mesh>
          {/* Floating Marble Shelf */}
          <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.08, 1.6]} />
            <meshStandardMaterial color="#F0ECE4" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Under-shelf Warm Amber Concealed Glow */}
          <mesh position={[0, -0.66, 0]}>
            <boxGeometry args={[1.1, 0.02, 1.5]} />
            <meshBasicMaterial color="#FFB85C" />
          </mesh>
        </group>
      ))}

      {/* Right Wall Symmetrical Niches */}
      <mesh position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#282522" roughness={0.55} />
      </mesh>
      {[-2.2, 0, 2.2].map((z, i) => (
        <group key={`mug-niche-right-${i}`} position={[6.8, 1.6, z]}>
          <mesh position={[0.4, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 2.2]} />
            <meshStandardMaterial color="#383028" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.08, 1.6]} />
            <meshStandardMaterial color="#F0ECE4" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.66, 0]}>
            <boxGeometry args={[1.1, 0.02, 1.5]} />
            <meshBasicMaterial color="#FFB85C" />
          </mesh>
        </group>
      ))}

      {/* 2. HERO PRODUCT DISPLAY ZONE (Circular Rotating Marble Pedestal) */}
      {heroProduct && (
        <group position={[0, 0, 0]}>
          {/* Symmetrical Tiered Circular Base */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.65, 0.3, 36]} />
            <meshStandardMaterial color="#262320" roughness={0.25} metalness={0.35} />
          </mesh>
          {/* Calacatta Gold Polished Tier */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.25, 1.25, 0.24, 36]} />
            <meshStandardMaterial color="#F2EDE4" roughness={0.16} metalness={0.15} />
          </mesh>
          {/* Champagne Gold Outer Trim Ring */}
          <mesh position={[0, 0.54, 0]}>
            <torusGeometry args={[1.25, 0.025, 16, 36]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Hero Mug 3D Display */}
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

      {/* 3. STANDARD PRODUCTS (Curated Niches & Plinths: up to 6) */}
      {standardProducts.map((product, idx) => {
        let pos: [number, number, number] = [0, 0, 0];
        let rot: [number, number, number] = [0, 0, 0];

        if (idx === 0) {
          pos = [-4.8, 0.55, -2.0];
          rot = [0, 0.4, 0];
        } else if (idx === 1) {
          pos = [-4.8, 0.55, 2.0];
          rot = [0, -0.4, 0];
        } else if (idx === 2) {
          pos = [4.8, 0.55, -2.0];
          rot = [0, -0.4, 0];
        } else if (idx === 3) {
          pos = [4.8, 0.55, 2.0];
          rot = [0, 0.4, 0];
        } else if (idx === 4) {
          pos = [-2.5, 0.48, -4.6];
          rot = [0, 0.2, 0];
        } else if (idx === 5) {
          pos = [2.5, 0.48, -4.6];
          rot = [0, -0.2, 0];
        }

        return (
          <group key={product.id}>
            {/* Cylindrical Plinth for Mug */}
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

      {/* 4. GALLERY AMBER LIGHTING */}
      <primitive object={heroTargetObj} />

      {/* Warm Pin-Spot on Hero Mug from front-top */}
      <spotLight
        target={heroTargetObj}
        position={[0, 4.6, 2.4]}
        intensity={4.2}
        angle={0.6}
        penumbra={0.65}
        color="#FFF4E0"
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Symmetrical Gallery Downlights */}
      <pointLight position={[-4.5, 3.4, 1.2]} intensity={2.4} color="#FFB85C" distance={7} />
      <pointLight position={[4.5, 3.4, 1.2]} intensity={2.4} color="#FFB85C" distance={7} />
      <pointLight position={[0, 3.5, -6.5]} intensity={2.0} color="#FFE0B2" distance={7} />
    </group>
  );
}
