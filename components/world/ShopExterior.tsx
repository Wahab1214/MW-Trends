"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

interface ShopExteriorProps {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  subtitle: string;
  hasEntered: boolean;
}

export default function ShopExterior({ id, position, rotation, title, subtitle, hasEntered }: ShopExteriorProps) {
  const interiorLight = useRef<THREE.PointLight>(null);

  const materials = useMemo(() => {
    return {
      frame: new THREE.MeshStandardMaterial({ 
        color: "#1a1a1c", 
        roughness: 0.3,
        metalness: 0.8
      }),
      glass: new THREE.MeshPhysicalMaterial({ 
        color: "#050505",
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
        transparent: true,
        opacity: 1
      }),
      ivoryAccent: new THREE.MeshStandardMaterial({
        color: "#F7F4ED",
        roughness: 0.2
      }),
      warmWalnut: new THREE.MeshStandardMaterial({
        color: "#3e2723",
        roughness: 0.8
      }),
      signage: new THREE.MeshStandardMaterial({
        color: "#D4AF37",
        emissive: "#D4AF37",
        emissiveIntensity: 0
      })
    };
  }, []);

  useFrame((state, delta) => {
    if (hasEntered) {
      if (interiorLight.current) {
        easing.damp(interiorLight.current, 'intensity', 60, 1.5, delta);
      }
      easing.damp(materials.signage, 'emissiveIntensity', 0.8, 1.5, delta);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Architectural Frame */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <boxGeometry args={[12, 8, 4]} />
        <primitive object={materials.frame} attach="material" />
      </mesh>

      {/* Smoked Glass Façade (Clickable) */}
      <mesh 
        position={[0, 3, 2]} 
        onClick={(e) => {
          e.stopPropagation();
          if (id === 'tee-studio') {
            window.dispatchEvent(new CustomEvent('OPEN_PRODUCT_FOCUS', { detail: 'midnight-oversized-tee' }));
          } else if (id === 'mug-bar') {
            window.dispatchEvent(new CustomEvent('OPEN_PRODUCT_FOCUS', { detail: 'signature-mug' }));
          }
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <planeGeometry args={[10, 6]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* Premium Signage */}
      <group position={[0, 7, 2.1]}>
        <Text fontSize={0.6} font="/fonts/GeistVF.woff" letterSpacing={0.2}>
          {title}
          <primitive object={materials.signage} attach="material" />
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.2} font="/fonts/GeistVF.woff" letterSpacing={0.3} color="#F7F4ED">
          {subtitle}
        </Text>
      </group>

      {/* Interior Staging */}
      <group position={[0, 3, 0]}>
        <pointLight ref={interiorLight} color="#ffedd6" intensity={0} distance={20} decay={1} />
        
        {id === 'tee-studio' && (
          <group>
            {/* Clothing Rail */}
            <mesh position={[-2, -1, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 3]} />
              <primitive object={materials.frame} attach="material" />
            </mesh>
            <mesh position={[-2, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 4]} />
              <primitive object={materials.frame} attach="material" />
            </mesh>
            {/* Mannequin / Hero Torso Placeholder */}
            <mesh position={[2, -1, 0]}>
              <cylinderGeometry args={[0.4, 0.3, 2]} />
              <primitive object={materials.ivoryAccent} attach="material" />
            </mesh>
          </group>
        )}

        {id === 'mug-bar' && (
          <group>
            {/* Warm Walnut Shelving */}
            <mesh position={[0, -1, -1]}>
              <boxGeometry args={[6, 0.2, 1.5]} />
              <primitive object={materials.warmWalnut} attach="material" />
            </mesh>
            <mesh position={[0, 0.5, -1]}>
              <boxGeometry args={[6, 0.2, 1.5]} />
              <primitive object={materials.warmWalnut} attach="material" />
            </mesh>
            {/* Hero Pedestal */}
            <mesh position={[2, -2, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 1]} />
              <primitive object={materials.ivoryAccent} attach="material" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
