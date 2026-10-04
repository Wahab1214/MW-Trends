"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";

interface ProductViewer3DProps {
  colorCode: string;
  productType: 'apparel' | 'objects' | 'frames' | 'cases' | 'paper' | 'gifts';
}

function ApparelModel({ colorCode }: { colorCode: string }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Stylized premium torso shape for Apparel prototyping */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.65, 2.4, 32, 1, false]} />
        <meshStandardMaterial 
          ref={materialRef} 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>
      {/* Shoulders */}
      <mesh castShadow receiveShadow position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 1.8, 16, 32]} />
        <meshStandardMaterial color={colorCode} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

function MugModel({ colorCode }: { colorCode: string }) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
        <meshPhysicalMaterial 
          ref={materialRef} 
          roughness={0.2} 
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.9, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color={colorCode} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

function FrameModel({ colorCode }: { colorCode: string }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, new THREE.Color(colorCode), 0.3, delta);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Frame Border */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 3.2, 0.1]} />
        <meshStandardMaterial ref={materialRef} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Frame Glass/Canvas */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2, 3]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} />
      </mesh>
      {/* Frame Print Mock */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
    </group>
  );
}

export default function ProductViewer3D({ colorCode, productType }: ProductViewer3DProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] relative group">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 6], fov: 40 }}>
        <color attach="background" args={["#0a0a0a"]} />
        <Environment preset="studio" environmentIntensity={0.8} />
        
        {/* Soft studio lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={1} castShadow shadow-bias={-0.0001} />
        <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={0.5} />
        <pointLight position={[0, 2, 5]} intensity={0.5} />

        <Suspense fallback={null}>
          {productType === 'apparel' && <ApparelModel colorCode={colorCode} />}
          {productType === 'objects' && <MugModel colorCode={colorCode} />}
          {productType === 'frames' && <FrameModel colorCode={colorCode} />}
          {(productType === 'cases' || productType === 'paper' || productType === 'gifts') && (
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color={colorCode} />
            </mesh>
          )}

          <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* 3D Interaction Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-widest text-[#9B9B9B] bg-[#111111]/80 px-4 py-2 border border-white/10 backdrop-blur-md">
          DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
