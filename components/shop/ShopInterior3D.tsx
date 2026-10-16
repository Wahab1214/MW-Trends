"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { Product } from "@/lib/data/mockCatalog";
import ShirtsBoutique from "./interiors/ShirtsBoutique";
import MugsGallery from "./interiors/MugsGallery";
import PensLounge from "./interiors/PensLounge";
import FramesGallery from "./interiors/FramesGallery";
import DefaultBoutique from "./interiors/DefaultBoutique";

interface ShopInterior3DProps {
  categorySlug: string;
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onHoverProduct: (product: Product | null) => void;
  onDismissSelection: () => void;
}

// ---------------------------------------------------------------------------
// DYNAMIC INTERIOR CAMERA RIG (Supports Cinematic Hero Focus Transition)
// ---------------------------------------------------------------------------
function InteriorCameraRig({
  selectedProduct,
}: {
  selectedProduct: Product | null;
}) {
  const dummyPos = useRef(new THREE.Vector3(0, 2.0, 5.8));
  const dummyLook = useRef(new THREE.Vector3(0, 1.2, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((state, delta) => {
    if (selectedProduct) {
      // Cinematic Hero Focus Framing: glide closer to isolate product
      // If hero product (first item, center)
      if (selectedProduct.isFeatured || selectedProduct.sortOrder === 1) {
        dummyPos.current.set(0.35, 1.4, 2.6);
        dummyLook.current.set(0, 1.15, 0);
      } else {
        // Peripheral / standard product focus
        dummyPos.current.set(0.25, 1.5, 3.4);
        dummyLook.current.set(0, 1.1, 0);
      }
    } else {
      // Standard Luxury Atrium/Boutique Perspective with subtle pointer parallax
      const parallaxX = state.pointer.x * 0.35;
      const parallaxY = state.pointer.y * 0.15;
      dummyPos.current.set(parallaxX, 2.0 + parallaxY, 5.8);
      dummyLook.current.set(0, 1.2, 0);
    }

    // Smooth cinematic camera damping (~500ms)
    easing.damp3(state.camera.position, dummyPos.current, 0.32, delta);
    easing.damp3(currentLook.current, dummyLook.current, 0.32, delta);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}

// ---------------------------------------------------------------------------
// DEDICATED HERO FOCUS ISOLATION LIGHTING
// ---------------------------------------------------------------------------
function HeroFocusLighting({ isActive }: { isActive: boolean }) {
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame((_, delta) => {
    const targetIntensity = isActive ? 5.2 : 0;
    if (keyLightRef.current) {
      easing.damp(keyLightRef.current, "intensity", targetIntensity, 0.25, delta);
      if (targetRef.current && keyLightRef.current.target !== targetRef.current) {
        keyLightRef.current.target = targetRef.current;
      }
    }
    if (rimLightRef.current) {
      easing.damp(rimLightRef.current, "intensity", isActive ? 3.2 : 0, 0.25, delta);
    }
  });

  return (
    <group>
      <object3D ref={targetRef} position={[0, 1.15, 0]} />
      {/* Golden Key Light isolating the active product from front-top */}
      <spotLight
        ref={keyLightRef}
        position={[0, 4.2, 2.8]}
        intensity={0}
        angle={0.52}
        penumbra={0.6}
        color="#FFF6E0"
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Champagne Gold Rim Light behind active product */}
      <pointLight
        ref={rimLightRef}
        position={[0, 1.8, -1.2]}
        intensity={0}
        distance={5.0}
        color="#D4AF37"
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// MAIN 3D SHOP INTERIOR COMPONENT
// ---------------------------------------------------------------------------
export default function ShopInterior3D({
  categorySlug,
  products,
  selectedProduct,
  onSelectProduct,
  onHoverProduct,
  onDismissSelection,
}: ShopInterior3DProps) {
  const norm = (categorySlug || "").toLowerCase().trim();

  const renderBoutique = () => {
    switch (norm) {
      case "shirts":
      case "apparel":
      case "hoodies":
        return (
          <ShirtsBoutique
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            onHoverProduct={onHoverProduct}
          />
        );
      case "mugs":
      case "objects":
      case "ceramics":
        return (
          <MugsGallery
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            onHoverProduct={onHoverProduct}
          />
        );
      case "pens":
        return (
          <PensLounge
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            onHoverProduct={onHoverProduct}
          />
        );
      case "frames":
      case "prints":
        return (
          <FramesGallery
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            onHoverProduct={onHoverProduct}
          />
        );
      default:
        return (
          <DefaultBoutique
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            onHoverProduct={onHoverProduct}
          />
        );
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#131211]">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.38, powerPreference: "high-performance" }}
        camera={{ position: [0, 2.0, 5.8], fov: 48, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e: Event) => {
            e.preventDefault();
            console.warn("ShopInterior3D: WebGL context lost; recovering...");
          });
        }}
        onPointerMissed={() => {
          if (selectedProduct) onDismissSelection();
        }}
      >
        <color attach="background" args={["#131211"]} />
        <fog attach="fog" args={["#131211", 16, 45]} />

        {/* 1. Bulletproof Environmental Fill: Ceiling coffer bounce + Graphite floor bounce */}
        <hemisphereLight color="#FFF5E6" groundColor="#2D2824" intensity={1.4} />

        {/* 2. Soft Ambient Base Light */}
        <ambientLight intensity={0.55} color="#FFF1DE" />

        {/* 3. Main Front-Top Key Light (illuminates front faces of garments, displays & walls) */}
        <directionalLight
          position={[3.2, 5.0, 5.5]}
          intensity={2.8}
          color="#FFF8EB"
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[1024, 1024]}
        />

        {/* 4. Soft Frontal Fill Light (balances left side, lifts dark shadows) */}
        <directionalLight
          position={[-3.8, 3.5, 5.0]}
          intensity={1.6}
          color="#E8DAC8"
        />

        <Suspense fallback={null}>
          {/* Dynamic Category Specific Boutique Scene */}
          {renderBoutique()}

          {/* Hero Focus Mode Isolation Lighting */}
          <HeroFocusLighting isActive={selectedProduct !== null} />

          {/* Dynamic Cinematic Camera Rig */}
          <InteriorCameraRig selectedProduct={selectedProduct} />
        </Suspense>
      </Canvas>
    </div>
  );
}
