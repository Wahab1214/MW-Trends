"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export default function FloorMedallion() {
  const logoTexture = useTexture("/mw-logo-gold.png");

  const materials = useMemo(() => {
    return {
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.15,
        metalness: 0.95,
      }),
      blackMarbleBand: new THREE.MeshStandardMaterial({
        color: "#0B0A09",
        roughness: 0.2,
        metalness: 0.45,
      }),
      goldAisleStrip: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.16,
        metalness: 0.95,
        emissive: "#C59B32",
        emissiveIntensity: 0.25,
      }),
      stripGlow: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
    };
  }, []);

  return (
    <group position={[0, 0.015, 9.2]}>
      {/* ================================================== */}
      {/* 1. ARCHITECTURAL CONCENTRIC EMBEDDED FLOOR RINGS */}
      {/* ================================================== */}

      {/* Outer Thin Champagne Gold Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.68, 1.76, 64]} />
        <primitive object={materials.champagneGold} attach="material" />
      </mesh>

      {/* Black Marble Annular Band */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.36, 1.68, 64]} />
        <primitive object={materials.blackMarbleBand} attach="material" />
      </mesh>

      {/* Inner Champagne Gold Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.28, 1.36, 64]} />
        <primitive object={materials.champagneGold} attach="material" />
      </mesh>

      {/* Solid Polished Black Marble Center Disc */}
      <mesh
        position={[0, 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.28, 64]} />
        <primitive object={materials.blackMarbleBand} attach="material" />
      </mesh>

      {/* Central Official MW Logo Artwork on Black Disc */}
      <mesh
        position={[0, 0.004, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.24, 64]} />
        <meshStandardMaterial
          map={logoTexture}
          emissiveMap={logoTexture}
          emissive="#E5BE5E"
          emissiveIntensity={0.65}
          roughness={0.12}
          metalness={0.92}
          transparent
          alphaTest={0.05}
        />
      </mesh>

      {/* Medallion Overhead Pinspot */}
      <pointLight
        position={[0, 3.6, 0]}
        color="#F0B968"
        intensity={24}
        distance={7}
        decay={2}
      />

      {/* ================================================== */}
      {/* 2. REFINED AISLE BORDER RUNNERS LEADING TO STAIRS */}
      {/* Thinner, elegant black/gold lines matching reference */}
      {/* ================================================== */}
      {[-3.15, 3.15].map((x, i) => (
        <group key={`concourse-runner-${i}`}>
          {/* Razor-Thin Gold Inlay Line */}
          <mesh
            position={[x, 0, -8.0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.025, 26]} />
            <primitive object={materials.goldAisleStrip} attach="material" />
          </mesh>

          {/* Sponsoring Black Marble Inlay Border */}
          <mesh
            position={[x + (x > 0 ? 0.035 : -0.035), 0, -8.0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.045, 26]} />
            <primitive object={materials.blackMarbleBand} attach="material" />
          </mesh>

          {/* Under-Floor Subtle Golden Light Glow Channel */}
          <mesh
            position={[x, 0.002, -8.0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.02, 26]} />
            <primitive object={materials.stripGlow} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Visual Border Continuing in Front of Shops */}
      {[-5.4, 5.4].map((xApron, aIdx) => (
        <mesh
          key={`shop-apron-border-${aIdx}`}
          position={[xApron, 0, -8.0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.02, 26]} />
          <primitive object={materials.goldAisleStrip} attach="material" />
        </mesh>
      ))}

      {/* Transverse Cross Inlays Framing Zones */}
      {[-3.8, 1.8, 6.2].map((z, j) => (
        <mesh
          key={`transverse-inlay-${j}`}
          position={[0, 0, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[10.8, 0.025]} />
          <primitive object={materials.goldAisleStrip} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
