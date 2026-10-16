"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, RenderTexture, PerspectiveCamera, Text as DreiText, Image as DreiImage, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useCustomizerStore, DesignElement } from "@/lib/store/useCustomizerStore";

function RenderDesignTexture({ side }: { side: 'front' | 'back' }) {
  const elements = useCustomizerStore(state => state.elements.filter(el => el.side === side));
  
  return (
    <RenderTexture attach="map" anisotropy={16}>
      <PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 5]} />
      {/* Background color matches material base roughly or transparent */}
      <color attach="background" args={["#ffffff"]} />
      
      {/* Render elements */}
      {elements.map(el => (
        <group 
          key={el.id} 
          // Translate 2D framer-motion pixel coordinates roughly to 3D space.
          // In a production app, we would normalize these coordinates.
          position={[el.x / 100, -el.y / 100, 0]} 
          scale={[el.scale, el.scale, 1]}
          rotation={[0, 0, -el.rotation * (Math.PI / 180)]}
        >
          {el.type === 'text' ? (
            <DreiText
              color={el.color || "#000000"}
              fontSize={0.5}
              maxWidth={4}
              textAlign="center"
            >
              {el.content}
            </DreiText>
          ) : (
            <DreiImage url={el.content} scale={[2, 2]} transparent />
          )}
        </group>
      ))}
    </RenderTexture>
  );
}

function Apparel3D() {
  const activeVariant = useCustomizerStore(state => state.activeVariant);
  const color = activeVariant?.colorCode || "#111111";

  return (
    <group position={[0, -1, 0]}>
      {/* Torso Front */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0.35]}>
        <planeGeometry args={[1.4, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.9}>
          <RenderDesignTexture side="front" />
        </meshStandardMaterial>
      </mesh>
      
      {/* Torso Back */}
      <mesh castShadow receiveShadow position={[0, 1.2, -0.35]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.4, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.9}>
          <RenderDesignTexture side="back" />
        </meshStandardMaterial>
      </mesh>

      {/* Basic body structure behind the planes to give volume */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.65, 2.4, 32, 1, false]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Shoulders */}
      <mesh castShadow receiveShadow position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 1.8, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function Preview3D() {
  return (
    <div className="w-full h-full bg-[#111111] relative rounded-lg overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 6], fov: 40 }}>
        {/* Manual Studio Lighting (HDR Removed for Stability) */}
        <ambientLight intensity={1.0} color="#F4EFE7" />
        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={2} castShadow color="#ffffff" />
        <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={1.5} color="#D4AF37" />
        <pointLight position={[0, 2, 5]} intensity={1.0} color="#F4EFE7" />
        
        <Suspense fallback={null}>
          <Apparel3D />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
        <span className="text-[10px] tracking-widest text-[#9B9B9B] bg-[#111111]/80 px-4 py-2 border border-white/10 backdrop-blur-md">
          DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
