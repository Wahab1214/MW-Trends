"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Text, Box } from "@react-three/drei";
import ShopExterior from "./ShopExterior";
import { easing } from "maath";

export default function Plaza({ hasEntered }: { hasEntered: boolean }) {
  const centralSculptureRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  const billboardRef = useRef<THREE.MeshBasicMaterial>(null);

  const materials = useMemo(() => {
    return {
      stoneFloor: new THREE.MeshStandardMaterial({ 
        color: "#161618", 
        roughness: 0.8, 
        metalness: 0.2 
      }),
      inlayGold: new THREE.MeshStandardMaterial({
        color: "#F6D365",
        roughness: 0.2,
        metalness: 0.9
      }),
      sculptureMetal: new THREE.MeshStandardMaterial({
        color: "#E2C373",
        roughness: 0.3,
        metalness: 0.8
      }),
      graphiteMetal: new THREE.MeshStandardMaterial({
        color: "#2a2a2c",
        roughness: 0.4,
        metalness: 0.6
      }),
      billboardScreen: new THREE.MeshBasicMaterial({
        color: "#222222", // Starts dark
      }),
      distantBuilding: new THREE.MeshStandardMaterial({
        color: "#0a0a0a",
        roughness: 0.9,
      }),
      distantWindow: new THREE.MeshBasicMaterial({
        color: "#F7F4ED",
        transparent: true,
        opacity: 0
      })
    };
  }, []);

  useFrame((state, delta) => {
    if (centralSculptureRef.current) {
      // Subtle idle motion
      centralSculptureRef.current.rotation.y += delta * 0.1;
    }

    // MW City Awakens Sequence
    if (hasEntered) {
      // Billboard screen brightens
      easing.dampC(materials.billboardScreen.color, new THREE.Color("#ffffff"), 1.5, delta);
      // Distant windows light up
      easing.damp(materials.distantWindow, 'opacity', 0.25, 2.0, delta);
    }
  });

  return (
    <group>
      {/* Dynamic Lighting Group */}
      <group ref={lightsRef}>
        <pointLight position={[0, 8, 0]} intensity={hasEntered ? 80 : 20} color="#D4AF37" distance={50} decay={1} />
        <spotLight position={[0, 15, -10]} intensity={hasEntered ? 150 : 30} angle={0.9} penumbra={0.5} color="#F7F4ED" castShadow decay={1} distance={80} />
      </group>

      {/* Premium Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <primitive object={materials.stoneFloor} attach="material" />
      </mesh>
      
      {/* Floor Gold Inlays (Architectural lines) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 0.1]} />
        <primitive object={materials.inlayGold} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[0.1, 40]} />
        <primitive object={materials.inlayGold} attach="material" />
      </mesh>

      {/* Central MW Landmark Sculpture */}
      <group position={[0, 3, 0]} ref={centralSculptureRef}>
        {/* Outer Ring */}
        <mesh castShadow>
          <torusGeometry args={[2, 0.1, 16, 64]} />
          <primitive object={materials.graphiteMetal} attach="material" />
        </mesh>
        {/* Inner Diamond / M-W Shape Abstraction */}
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <octahedronGeometry args={[1.2, 0]} />
          <primitive object={materials.sculptureMetal} attach="material" />
        </mesh>
        {hasEntered && <pointLight color="#D4AF37" intensity={15} distance={5} decay={2} />}
      </group>

      {/* Hero Billboard */}
      <group position={[0, 8, -20]}>
        {/* Billboard Frame */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[16.5, 9.5, 0.5]} />
          <primitive object={materials.graphiteMetal} attach="material" />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[16, 9]} />
          <primitive object={materials.billboardScreen} attach="material" />
        </mesh>
        {/* Billboard Text Content (Revealed via light) */}
        <Text position={[0, 0, 0.27]} fontSize={1.2} color="#050505" font="/fonts/GeistVF.woff" letterSpacing={0.1}>
          MIDNIGHT / 01
        </Text>
        <Text position={[0, -1.5, 0.27]} fontSize={0.4} color="#050505" font="/fonts/GeistVF.woff" letterSpacing={0.2}>
          EXPLORE DROP
        </Text>
        {hasEntered && <rectAreaLight width={16} height={9} color="#ffffff" intensity={2} position={[0, 0, 0.3]} lookAt={[0, 0, 1]} />}
      </group>

      {/* Storefronts */}
      <ShopExterior id="tee-studio" position={[-16, 0, -10]} rotation={[0, Math.PI / 4, 0]} title="TEE STUDIO" subtitle="APPAREL / CUSTOM" hasEntered={hasEntered} />
      <ShopExterior id="mug-bar" position={[16, 0, -10]} rotation={[0, -Math.PI / 4, 0]} title="MUG BAR" subtitle="OBJECTS / GIFTS" hasEntered={hasEntered} />

      {/* Distant World Architecture */}
      <group position={[0, 0, -40]}>
        {/* Left Distant */}
        <mesh position={[-25, 10, 0]}>
          <boxGeometry args={[12, 20, 12]} />
          <primitive object={materials.distantBuilding} attach="material" />
        </mesh>
        <mesh position={[-25, 15, 6.1]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={materials.distantWindow} attach="material" />
        </mesh>
        
        {/* Right Distant */}
        <mesh position={[25, 15, -10]}>
          <boxGeometry args={[15, 30, 15]} />
          <primitive object={materials.distantBuilding} attach="material" />
        </mesh>
        <mesh position={[25, 20, -2.4]}>
          <planeGeometry args={[2, 0.5]} />
          <primitive object={materials.distantWindow} attach="material" />
        </mesh>
      </group>

      {/* Living Poster Kiosk (Foreground) */}
      <group position={[-6, 2, 4]} rotation={[0, Math.PI / 6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 4, 0.2]} />
          <primitive object={materials.graphiteMetal} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.8, 3.8]} />
          <primitive object={materials.billboardScreen} attach="material" />
        </mesh>
        <Text position={[0, 0, 0.12]} fontSize={0.2} color="#050505" font="/fonts/GeistVF.woff" letterSpacing={0.1}>
          LIVING POSTER
        </Text>
      </group>
    </group>
  );
}
