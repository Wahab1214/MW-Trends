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

export default function FramesGallery({
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
    obj.position.set(0, 1.1, 0);
    return obj;
  }, []);

  const leftTrackTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-4.8, 1.2, 0);
    return obj;
  }, []);

  const rightTrackTargetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(4.8, 1.2, 0);
    return obj;
  }, []);

  return (
    <group>
      {/* 1. ROOM ARCHITECTURE (Gallery Envelope) */}
      {/* Light Terrazzo Floor with Nero Marquina Inset Borders */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#201E1C" roughness={0.24} metalness={0.25} />
      </mesh>

      {/* Museum Ceiling Grid with Recessed Spotlight Tracks */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#262320" roughness={0.8} />
      </mesh>

      {/* Rear Ivory Gallery Feature Wall */}
      <mesh position={[0, 2.5, -7.5]}>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial color="#302A24" roughness={0.55} />
      </mesh>
      {/* Center Gallery Spotlighted Niche Panel */}
      <mesh position={[0, 2.6, -7.42]}>
        <planeGeometry args={[6.8, 4.0]} />
        <meshStandardMaterial color="#383028" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.6, -7.4]}>
        <boxGeometry args={[6.95, 4.15, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Left Gallery Perimeter Wall */}
      <mesh position={[-7.5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292521" roughness={0.55} />
      </mesh>
      {/* Floating American Walnut Console Table (Left) */}
      <mesh position={[-5.8, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 6.5]} />
        <meshStandardMaterial color="#453020" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[-5.8, 0.5, 0]}>
        <boxGeometry args={[0.08, 1.0, 5.8]} />
        <meshStandardMaterial color="#24201C" roughness={0.6} />
      </mesh>

      {/* Right Gallery Perimeter Wall */}
      <mesh position={[7.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5.2]} />
        <meshStandardMaterial color="#292521" roughness={0.55} />
      </mesh>
      {/* Floating American Walnut Console Table (Right) */}
      <mesh position={[5.8, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 6.5]} />
        <meshStandardMaterial color="#453020" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[5.8, 0.5, 0]}>
        <boxGeometry args={[0.08, 1.0, 5.8]} />
        <meshStandardMaterial color="#24201C" roughness={0.6} />
      </mesh>

      {/* 2. HERO PRODUCT DISPLAY ZONE (Prominently Spotlighted Central Frame) */}
      {heroProduct && (
        <group position={[0, 0, 0]}>
          {/* Sculptural Gallery Plinth with Walnut Inlay */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.6, 1.1]} />
            <meshStandardMaterial color="#272320" roughness={0.28} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.61, 0]}>
            <boxGeometry args={[1.64, 0.02, 1.14]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Hero Frame 3D Display */}
          <InteriorProduct3D
            product={heroProduct}
            position={[0, 0.65, 0]}
            rotation={[0, 0, 0]}
            scale={1.2}
            isHero={true}
            isSelected={selectedProduct?.id === heroProduct.id}
            isDeemphasized={selectedProduct !== null && selectedProduct.id !== heroProduct.id}
            onSelect={onSelectProduct}
            onHover={onHoverProduct}
          />
        </group>
      )}

      {/* 3. STANDARD PRODUCTS (Console Displays & Gallery Walls: up to 6) */}
      {standardProducts.map((product, idx) => {
        let pos: [number, number, number] = [0, 0, 0];
        let rot: [number, number, number] = [0, 0, 0];

        if (idx === 0) {
          pos = [-4.8, 0.95, -1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 1) {
          pos = [-4.8, 0.95, 1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 2) {
          pos = [4.8, 0.95, -1.8];
          rot = [0, -0.35, 0];
        } else if (idx === 3) {
          pos = [4.8, 0.95, 1.8];
          rot = [0, 0.35, 0];
        } else if (idx === 4) {
          pos = [-2.4, 0.55, -4.8];
          rot = [0, 0.2, 0];
        } else if (idx === 5) {
          pos = [2.4, 0.55, -4.8];
          rot = [0, -0.2, 0];
        }

        return (
          <group key={product.id}>
            {/* Gallery Stand Base */}
            <mesh position={[pos[0], pos[1] - 0.05, pos[2]]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.06, 0.6]} />
              <meshStandardMaterial color="#332E28" roughness={0.35} metalness={0.25} />
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

      {/* 4. GALLERY ART TRACK SPOTLIGHTS */}
      <primitive object={heroTargetObj} />
      <primitive object={leftTrackTargetObj} />
      <primitive object={rightTrackTargetObj} />

      {/* Pure White Key Gallery Spotlight from front-top */}
      <spotLight
        target={heroTargetObj}
        position={[0, 4.6, 2.4]}
        intensity={4.2}
        angle={0.6}
        penumbra={0.65}
        color="#FFFBF5"
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Left Wall Track Spotlights */}
      <spotLight
        target={leftTrackTargetObj}
        position={[-4.5, 4.2, 1.8]}
        intensity={3.2}
        angle={0.65}
        penumbra={0.7}
        color="#FFF4E6"
      />
      {/* Right Wall Track Spotlights */}
      <spotLight
        target={rightTrackTargetObj}
        position={[4.5, 4.2, 1.8]}
        intensity={3.2}
        angle={0.65}
        penumbra={0.7}
        color="#FFF4E6"
      />
      {/* Rear Gallery Wall Illumination */}
      <pointLight position={[0, 3.6, -6.6]} intensity={2.2} color="#FFEACC" distance={8} />
    </group>
  );
}
