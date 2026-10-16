"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Text, Float } from "@react-three/drei";
import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { easing } from "maath";

interface ProductViewer3DProps {
  colorCode: string;
  productType: string;
  customText?: string;
  font?: string;
  placement?: string;
  fallbackImage?: string;
}

// ---------------------------------------------------------------------------
// 1. APPAREL / SHIRT 3D MODEL
// ---------------------------------------------------------------------------
function ApparelModel({
  colorCode,
  customText,
}: {
  colorCode: string;
  customText?: string;
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      {/* Torso */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.65, 2.4, 32, 1, false]} />
        <meshStandardMaterial ref={materialRef} roughness={0.88} metalness={0.08} />
      </mesh>
      {/* Shoulders */}
      <mesh castShadow receiveShadow position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 1.8, 16, 32]} />
        <meshStandardMaterial color={colorCode} roughness={0.88} metalness={0.08} />
      </mesh>
      {/* Collar accent */}
      <mesh position={[0, 2.35, 0.1]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.35, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#2B2825" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Monogram Inscription if provided */}
      {customText && (
        <group position={[-0.32, 1.85, 0.67]}>
          <Text
            fontSize={0.08}
            color="#D4AF37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            {customText.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. CERAMIC MUG 3D MODEL
// ---------------------------------------------------------------------------
function MugModel({
  colorCode,
  customText,
}: {
  colorCode: string;
  customText?: string;
}) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Mug Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 2.0, 32]} />
        <meshPhysicalMaterial
          ref={materialRef}
          roughness={0.18}
          metalness={0.05}
          clearcoat={0.65}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* Mug Rim */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.04, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.95, 0, 0]}>
        <torusGeometry args={[0.55, 0.14, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color={colorCode} roughness={0.2} metalness={0.05} />
      </mesh>

      {/* Ceramic Inscription */}
      {customText && (
        <group position={[0, 0, 0.87]}>
          <Text
            fontSize={0.11}
            color="#D4AF37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.2}
          >
            {customText.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. ARCHIVAL FRAME 3D MODEL
// ---------------------------------------------------------------------------
function FrameModel({
  colorCode,
  customText,
}: {
  colorCode: string;
  customText?: string;
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Luxury Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 3.4, 0.12]} />
        <meshStandardMaterial ref={materialRef} roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Archival Mat (Parchment Ivory) */}
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[2.0, 3.0]} />
        <meshStandardMaterial color="#F4EFE7" roughness={0.9} />
      </mesh>
      {/* Inner Artwork Canvas */}
      <mesh position={[0, 0.2, 0.06]}>
        <planeGeometry args={[1.5, 2.0]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* Protective Glazing */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[2.0, 3.0]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.92} roughness={0.08} />
      </mesh>

      {/* Archival Mat Inscription */}
      {customText && (
        <group position={[0, -1.15, 0.065]}>
          <Text
            fontSize={0.07}
            color="#2B2825"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
          >
            {customText.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. PRECISION PEN 3D MODEL
// ---------------------------------------------------------------------------
function PenModel({
  colorCode,
  customText,
}: {
  colorCode: string;
  customText?: string;
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.2, 0.4, 0.6]}>
      {/* Tapered Barrel */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 3.2, 24]} />
        <meshStandardMaterial ref={materialRef} roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Gold Ring Band */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.08, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.185, 1.8, 24]} />
        <meshStandardMaterial color="#1E1C1A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Gold Clip */}
      <mesh position={[0.21, 1.25, 0]} castShadow>
        <boxGeometry args={[0.04, 1.2, 0.08]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Gold Nib / Tip */}
      <mesh position={[0, -1.8, 0]}>
        <coneGeometry args={[0.14, 0.5, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.98} />
      </mesh>

      {/* Laser Engraving on Barrel */}
      {customText && (
        <group position={[0.18, -0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <Text
            fontSize={0.065}
            color="#D4AF37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            {customText.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. ERROR BOUNDARY WRAPPER
// ---------------------------------------------------------------------------
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("ProductViewer3D WebGL context error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// 6. MAIN PRODUCT VIEWER COMPONENT
// ---------------------------------------------------------------------------
export default function ProductViewer3D({
  colorCode,
  productType,
  customText,
  fallbackImage,
}: ProductViewer3DProps) {
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const normType = (productType || '').toLowerCase();
  const isApparel = normType.includes('apparel') || normType.includes('shirt');
  const isMug = normType.includes('object') || normType.includes('mug');
  const isPen = normType.includes('pen');
  const isFrame = normType.includes('frame');

  return (
    <div className="w-full h-full bg-[#0A0908] relative group overflow-hidden">
      <WebGLErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0A0908]">
            {fallbackImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fallbackImage}
                alt="Product Preview"
                className="max-h-[80%] max-w-[80%] object-contain opacity-90"
              />
            ) : (
              <div className="text-center">
                <span className="text-xs text-[#D4AF37] tracking-[0.25em] uppercase font-bold block mb-2">
                  Atelier 3D View
                </span>
                <span className="text-[11px] text-[#888]">Interactive Studio Mode</span>
              </div>
            )}
          </div>
        }
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.2, 5.8], fov: 38 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e: Event) => {
              e.preventDefault();
              console.warn("ProductViewer3D: WebGL context lost; recovering...");
            });
          }}
        >
          <color attach="background" args={["#0A0908"]} />

          {/* Balanced Studio Lighting */}
          <ambientLight intensity={1.2} color="#F4EFE7" />
          <directionalLight
            position={[5, 8, 4]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
            color="#FFF8EE"
          />
          <directionalLight position={[-4, 4, -4]} intensity={1.2} color="#D4AF37" />
          <pointLight position={[0, -1, 3]} intensity={0.8} color="#C8A86B" />

          <Suspense fallback={null}>
            <Float
              speed={autoRotate ? 1.5 : 0}
              rotationIntensity={autoRotate ? 0.2 : 0}
              floatIntensity={autoRotate ? 0.2 : 0}
            >
              {isApparel && <ApparelModel colorCode={colorCode} customText={customText} />}
              {isMug && <MugModel colorCode={colorCode} customText={customText} />}
              {isPen && <PenModel colorCode={colorCode} customText={customText} />}
              {isFrame && <FrameModel colorCode={colorCode} customText={customText} />}
              {!isApparel && !isMug && !isPen && !isFrame && (
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.8, 1.8, 1.8]} />
                  <meshStandardMaterial color={colorCode} roughness={0.3} metalness={0.7} />
                </mesh>
              )}
            </Float>

            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.65}
              scale={8}
              blur={2.2}
              far={3.5}
              color="#000000"
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1.8}
            minDistance={2.8}
            maxDistance={8.5}
            minPolarAngle={Math.PI / 4.5}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating 3D Atelier Controls */}
      <div className="absolute bottom-12 sm:bottom-6 right-4 sm:right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] transition-all border ${
            autoRotate
              ? "bg-[#D4AF37] text-black border-[#D4AF37]"
              : "bg-[#181614]/80 text-[#D3C7B8] border-[#333] hover:border-[#D4AF37]"
          }`}
          title="Toggle Auto Rotation"
        >
          {autoRotate ? "STOP ROTATE" : "AUTO ROTATE"}
        </button>
        <button
          onClick={handleResetView}
          className="px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] bg-[#181614]/80 text-[#D3C7B8] border border-[#333] hover:border-[#D4AF37] hover:text-[#F7F4ED] transition-all"
          title="Reset Camera View"
        >
          RESET
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 bg-[#12100E]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 text-[9px] font-medium tracking-[0.2em] text-[#A3998C]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
        <span>DRAG TO ORBIT • SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
