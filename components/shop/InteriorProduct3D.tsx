"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { Product } from "@/lib/data/mockCatalog";

interface InteriorProduct3DProps {
  product: Product;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isHero?: boolean;
  isSelected?: boolean;
  isDeemphasized?: boolean;
  onSelect?: (product: Product) => void;
  onHover?: (product: Product | null) => void;
}

// Helper to prevent crushed blacks in ACES tone mapping while preserving dark luxury feel
function getSafeDisplayColor(hex: string, fallbackDark: string = "#2E2B28") {
  try {
    const c = new THREE.Color(hex);
    // Relative luminance calculation
    const luma = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    if (luma < 0.16) {
      return fallbackDark;
    }
    return hex;
  } catch {
    return fallbackDark;
  }
}

// ---------------------------------------------------------------------------
// 1. APPAREL / SHIRT 3D MODEL
// ---------------------------------------------------------------------------
function ApparelMesh({ colorCode, isHovered }: { colorCode: string; isHovered: boolean }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const displayColor = useMemo(() => getSafeDisplayColor(colorCode, "#2E2B28"), [colorCode]);

  useFrame((_, delta) => {
    if (matRef.current) {
      easing.dampC(matRef.current.color, new THREE.Color(displayColor), 0.25, delta);
      const targetEmissive = isHovered ? new THREE.Color("#3A3022") : new THREE.Color("#000000");
      easing.dampC(matRef.current.emissive, targetEmissive, 0.25, delta);
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* Mannequin Neck / Collar Block */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.35, 24]} />
        <meshStandardMaterial color="#2E2B28" roughness={0.35} metalness={0.5} />
      </mesh>
      {/* Mannequin Collar Champagne Gold Accent Ring */}
      <mesh position={[0, 1.41, 0]}>
        <torusGeometry args={[0.22, 0.012, 12, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Main Tailored Torso */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.45, 1.35, 32]} />
        <meshStandardMaterial
          ref={matRef}
          roughness={0.52}
          metalness={0.14}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Structured Shoulders & Dropped Sleeves */}
      <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.26, 1.25, 16, 24]} />
        <meshStandardMaterial color={displayColor} roughness={0.52} metalness={0.14} />
      </mesh>

      {/* Bottom Hem Trim Band */}
      <mesh position={[0, -0.22, 0]}>
        <torusGeometry args={[0.46, 0.025, 12, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.85} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. MUG / DRINKWARE 3D MODEL
// ---------------------------------------------------------------------------
function MugMesh({ colorCode, isHovered }: { colorCode: string; isHovered: boolean }) {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const displayColor = useMemo(() => getSafeDisplayColor(colorCode, "#2C2926"), [colorCode]);

  useFrame((_, delta) => {
    if (matRef.current) {
      easing.dampC(matRef.current.color, new THREE.Color(displayColor), 0.25, delta);
      const targetEmissive = isHovered ? new THREE.Color("#403018") : new THREE.Color("#000000");
      easing.dampC(matRef.current.emissive, targetEmissive, 0.25, delta);
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Ceramic Mug Body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.38, 0.82, 32]} />
        <meshPhysicalMaterial
          ref={matRef}
          roughness={0.22}
          metalness={0.15}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Mug Hollow Interior Rim */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.02, 32]} />
        <meshStandardMaterial color="#262320" roughness={0.4} />
      </mesh>

      {/* Champagne Gold Rim Accent */}
      <mesh position={[0, 0.76, 0]}>
        <torusGeometry args={[0.41, 0.015, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Curved Handle */}
      <mesh position={[0.48, 0.35, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.26, 0.065, 16, 24, Math.PI * 1.15]} />
        <meshPhysicalMaterial color={displayColor} roughness={0.22} metalness={0.15} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. PEN / WRITING INSTRUMENT 3D MODEL
// ---------------------------------------------------------------------------
function PenMesh({ colorCode, isHovered }: { colorCode: string; isHovered: boolean }) {
  const barrelMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const displayColor = useMemo(() => getSafeDisplayColor(colorCode, "#2B2824"), [colorCode]);

  useFrame((_, delta) => {
    if (barrelMatRef.current) {
      easing.dampC(barrelMatRef.current.color, new THREE.Color(displayColor), 0.25, delta);
      const targetEmissive = isHovered ? new THREE.Color("#453412") : new THREE.Color("#000000");
      easing.dampC(barrelMatRef.current.emissive, targetEmissive, 0.25, delta);
    }
  });

  return (
    <group position={[0, 0.25, 0]} rotation={[0.22, 0.45, 0.72]}>
      {/* Tapered Barrel */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.06, 1.5, 24]} />
        <meshStandardMaterial
          ref={barrelMatRef}
          roughness={0.22}
          metalness={0.85}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Center Gold Ring Band */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.04, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Pen Cap */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.078, 0.85, 24]} />
        <meshStandardMaterial color="#2E2A26" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Gold Clip */}
      <mesh position={[0.09, 0.58, 0]} castShadow>
        <boxGeometry args={[0.02, 0.55, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Gold Nib / Tip */}
      <mesh position={[0, -0.84, 0]}>
        <coneGeometry args={[0.06, 0.22, 24]} />
        <meshStandardMaterial color="#E8C768" roughness={0.1} metalness={0.98} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. PHOTO FRAME 3D MODEL
// ---------------------------------------------------------------------------
function FrameMesh({ colorCode, isHovered }: { colorCode: string; isHovered: boolean }) {
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const displayColor = useMemo(() => getSafeDisplayColor(colorCode, "#342E27"), [colorCode]);

  useFrame((_, delta) => {
    if (frameMatRef.current) {
      easing.dampC(frameMatRef.current.color, new THREE.Color(displayColor), 0.25, delta);
      const targetEmissive = isHovered ? new THREE.Color("#382914") : new THREE.Color("#000000");
      easing.dampC(frameMatRef.current.emissive, targetEmissive, 0.25, delta);
    }
  });

  return (
    <group position={[0, 0.45, 0]}>
      {/* Outer Luxury Moulding */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.25, 1.65, 0.08]} />
        <meshStandardMaterial
          ref={frameMatRef}
          roughness={0.35}
          metalness={0.55}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Beveled Gold Inner Lip */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.12, 1.52, 0.05]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Museum Acid-Free Mat Border */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.05, 1.45]} />
        <meshStandardMaterial color="#F6F2EB" roughness={0.85} />
      </mesh>

      {/* Center Artwork Mock Plane */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.78, 1.05]} />
        <meshBasicMaterial color="#262320" />
      </mesh>

      {/* Protective Float Glass Sheet with transmission */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.1, 1.5]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.88}
          roughness={0.05}
          ior={1.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. PREMIUM 2.5D IMAGE FALLBACK DISPLAY
// ---------------------------------------------------------------------------
function Fallback2DMesh({ product, isHovered }: { product: Product; isHovered: boolean }) {
  const texture = useMemo(() => {
    // Generate a luxury procedural visual card canvas
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark luxury gradient card background
    const grad = ctx.createLinearGradient(0, 0, 0, 680);
    grad.addColorStop(0, '#1E1D1B');
    grad.addColorStop(0.5, '#141312');
    grad.addColorStop(1, '#0D0C0B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 680);

    // Gold border trim
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 480, 648);

    // Subtle inner corner accents
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(20, 20, 24, 2);
    ctx.fillRect(20, 20, 2, 24);
    ctx.fillRect(468, 20, 24, 2);
    ctx.fillRect(490, 20, 2, 24);

    // MW Monogram Mark
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('MW', 256, 120);

    ctx.font = '11px sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillStyle = '#A3998C';
    ctx.fillText('CURATED COLLECTION', 256, 150);

    // Product Title
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = '#F7F4ED';
    const lines = product.name.split(' ');
    if (lines.length > 2) {
      ctx.fillText(lines.slice(0, 2).join(' '), 256, 320);
      ctx.fillText(lines.slice(2).join(' '), 256, 355);
    } else {
      ctx.fillText(product.name, 256, 335);
    }

    // Category & Price
    ctx.font = '13px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = '#C8A86B';
    ctx.fillText(product.categorySlug.toUpperCase(), 256, 420);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#F4EFE7';
    ctx.fillText(product.price, 256, 480);

    // Badge
    if (product.isNew || product.isBestSeller) {
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(176, 540, 160, 32);
      ctx.fillStyle = '#0D0C0B';
      ctx.font = 'bold 12px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(product.isNew ? 'NEW DROP' : 'BEST SELLER', 256, 560);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [product]);

  return (
    <group position={[0, 0.45, 0]}>
      {/* Front Textured Visual Plane */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[1.05, 1.4]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#1E1D1B" roughness={0.3} metalness={0.7} />
        )}
      </mesh>

      {/* Back Support Plaque */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[1.08, 1.44, 0.02]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Champagne Gold Frame Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.46, 0.01]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.9}
          wireframe={isHovered}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// MAIN INTERIOR PRODUCT 3D COMPONENT
// ---------------------------------------------------------------------------
export default function InteriorProduct3D({
  product,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  isHero = false,
  isSelected = false,
  isDeemphasized = false,
  onSelect,
  onHover,
}: InteriorProduct3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Active color code from first variant or default
  const activeColor = product.variants?.[0]?.colorCode || "#1A1A1A";

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Hero slow stately rotation (~0.12 - 0.18 rad/s)
    if (isHero && !isSelected) {
      groupRef.current.rotation.y += delta * 0.14;
    }

    // Hover or selection elevation
    const targetY = position[1] + (hovered || isSelected ? 0.08 : 0);
    easing.damp(groupRef.current.position, "y", targetY, 0.25, delta);

    // De-emphasis damping
    const targetScale = isDeemphasized ? scale * 0.92 : hovered ? scale * 1.04 : scale;
    easing.damp(groupRef.current.scale, "x", targetScale, 0.25, delta);
    easing.damp(groupRef.current.scale, "y", targetScale, 0.25, delta);
    easing.damp(groupRef.current.scale, "z", targetScale, 0.25, delta);
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(product);
    if (typeof document !== "undefined") {
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
    if (typeof document !== "undefined") {
      document.body.style.cursor = "default";
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect?.(product);
  };

  // Render category-specific 3D model if supported, otherwise 2.5D luxury fallback
  const renderProductContent = () => {
    if (!product.has3D) {
      return <Fallback2DMesh product={product} isHovered={hovered} />;
    }

    switch (product.categorySlug) {
      case "shirts":
      case "hoodies":
        return <ApparelMesh colorCode={activeColor} isHovered={hovered} />;
      case "mugs":
      case "ceramics":
        return <MugMesh colorCode={activeColor} isHovered={hovered} />;
      case "pens":
        return <PenMesh colorCode={activeColor} isHovered={hovered} />;
      case "frames":
      case "prints":
        return <FrameMesh colorCode={activeColor} isHovered={hovered} />;
      default:
        return <Fallback2DMesh product={product} isHovered={hovered} />;
    }
  };

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Soft Contact Shadow below object */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55 * scale, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={hovered ? 0.65 : 0.4} />
      </mesh>

      {/* Selection / Hover Subtle Golden Halo Ring */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.58 * scale, 0.62 * scale, 32]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Render Product Mesh / Fallback */}
      {renderProductContent()}

      {/* Dedicated Frontal Key Light for this Display Position */}
      <pointLight
        position={[0, 1.4, 1.2]}
        intensity={hovered || isSelected ? 3.4 : isHero ? 2.8 : 1.8}
        distance={4.8}
        color={hovered || isSelected ? "#FFF6DF" : "#FCEFD8"}
      />

      {/* Dedicated Subtle Rim Backlight for Hero separating it from dark wall */}
      {isHero && (
        <pointLight
          position={[0, 1.2, -1.0]}
          intensity={2.0}
          distance={4.0}
          color="#D4AF37"
        />
      )}
    </group>
  );
}
