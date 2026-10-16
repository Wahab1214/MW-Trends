"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { getBookmatchedBlackMarbleTexture } from "@/lib/textures/marbleTextures";

export default function LogoWall() {
  const logoTexture = useTexture("/mw-logo-gold.png");
  const blackMarbleTex = useMemo(() => {
    return typeof window !== "undefined" ? getBookmatchedBlackMarbleTexture() : null;
  }, []);

  const materials = useMemo(() => {
    return {
      ivoryPier: new THREE.MeshStandardMaterial({
        color: "#EDE2CF",
        roughness: 0.5,
        metalness: 0.1,
      }),
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.16,
        metalness: 0.95,
      }),
      verticalLightCove: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
      urnBlack: new THREE.MeshStandardMaterial({
        color: "#0B0A09",
        roughness: 0.25,
        metalness: 0.45,
      }),
      plantLeaf: new THREE.MeshStandardMaterial({
        color: "#274322",
        roughness: 0.5,
        metalness: 0.08,
      }),
      plantLeafLight: new THREE.MeshStandardMaterial({
        color: "#3E6334",
        roughness: 0.45,
        metalness: 0.06,
      }),
      plantStem: new THREE.MeshStandardMaterial({
        color: "#3A2E24",
        roughness: 0.8,
        metalness: 0.05,
      }),
    };
  }, []);

  return (
    <group position={[0, 0, -12.4]}>
      {/* ================================================== */}
      {/* ================================================== */}
      {/* 1. TOWERING BOOKMATCHED BLACK MARBLE FEATURE WALL */}
      {/* Rises majestically above the staircase landing */}
      {/* ================================================== */}
      <mesh position={[0, 9.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.8, 8.0, 0.3]} />
        <meshStandardMaterial
          color="#080706"
          roughness={0.16}
          metalness={0.42}
          map={blackMarbleTex || undefined}
        />
      </mesh>

      {/* Layered Architectural Double Gold Frame */}
      <group position={[0, 9.2, 0.16]}>
        {/* Outer Top Trim */}
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[8.88, 0.1, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        {/* Inner Top Trim Accent */}
        <mesh position={[0, 3.88, 0.01]}>
          <boxGeometry args={[8.6, 0.03, 0.06]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        {/* Bottom Trim */}
        <mesh position={[0, -4.0, 0]}>
          <boxGeometry args={[8.88, 0.1, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        {/* Left Trim */}
        <mesh position={[-4.4, 0, 0]}>
          <boxGeometry args={[0.1, 8.0, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        {/* Right Trim */}
        <mesh position={[4.4, 0, 0]}>
          <boxGeometry args={[0.1, 8.0, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
      </group>

      {/* Overhead Architectural Cornice Header with Cove Glow */}
      <group position={[0, 13.22, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[9.4, 0.22, 0.35]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[9.0, 0.03, 0.2]} />
          <primitive object={materials.verticalLightCove} attach="material" />
        </mesh>
        <pointLight position={[0, -0.25, 0.3]} color="#F0B968" intensity={12} distance={6} decay={2} />
      </group>

      {/* ================================================== */}
      {/* 2. VERTICAL WARM GOLDEN LIGHT COVES FLANKING THE WALL */}
      {/* ================================================== */}
      {[-4.44, 4.44].map((x, i) => (
        <group key={`light-cove-${i}`} position={[x, 9.2, 0.18]}>
          {/* Vertical Light Strip */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 8.0, 0.02]} />
            <primitive object={materials.verticalLightCove} attach="material" />
          </mesh>
          {/* Sponsoring Fluted Ivory Marble Pier */}
          <mesh position={[x > 0 ? 0.38 : -0.38, 0, -0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 8.4, 0.5]} />
            <primitive object={materials.ivoryPier} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ================================================== */}
      {/* 3. LARGE OFFICIAL MW TRENDS GOLD EMBLEM */}
      {/* Sits prominently at Y = 9.2, seamlessly on black marble */}
      {/* ================================================== */}
      <group position={[0, 9.2, 0.18]}>
        <mesh position={[0, 0, 0]} castShadow>
          <planeGeometry args={[5.6, 5.6]} />
          <meshStandardMaterial
            map={logoTexture}
            emissiveMap={logoTexture}
            emissive="#E5BE5E"
            emissiveIntensity={0.75}
            roughness={0.12}
            metalness={0.92}
            transparent
            alphaTest={0.05}
          />
        </mesh>

        {/* Ambient Warm Golden Backlight Halo behind the Emblem */}
        <pointLight
          position={[0, 0, 0.2]}
          color="#F0B968"
          intensity={10}
          distance={4.5}
          decay={2}
        />

        {/* Focused Architectural Downlight Aimed at the Logo */}
        <spotLight
          position={[0, 3.6, 3.4]}
          target-position={[0, 0, 0]}
          angle={0.58}
          penumbra={0.8}
          color="#FAF5EE"
          intensity={14}
          distance={10}
          decay={2}
          castShadow
        />
      </group>

      {/* ================================================== */}
      {/* 4. UPPER STAIR LANDING PALM TREES IN BLACK & GOLD URNS */}
      {/* ================================================== */}
      {[-3.8, 3.8].map((x, i) => (
        <group key={`upper-urn-${i}`} position={[x, 5.5, 0.6]}>
          {/* Black Marble Fluted Urn Base */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.28, 0.9, 24]} />
            <primitive object={materials.urnBlack} attach="material" />
          </mesh>
          {/* Gold Urn Rim */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.38, 0.08, 24]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Tropical Palms */}
          <group position={[0, 0.95, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.07, 0.9, 12]} />
              <primitive object={materials.plantStem} attach="material" />
            </mesh>
            {[0, 1, 2, 3, 4, 5, 6].map((frondIdx) => {
              const angle = (frondIdx / 7) * Math.PI * 2;
              return (
                <group
                  key={`frond-${frondIdx}`}
                  rotation={[0.38, angle, 0]}
                  position={[0, 0.75, 0]}
                >
                  <mesh position={[0, 0.5, 0.4]} rotation={[0.42, 0, 0]} castShadow>
                    <boxGeometry args={[0.26, 0.95, 0.02]} />
                    <primitive
                      object={
                        frondIdx % 2 === 0
                          ? materials.plantLeaf
                          : materials.plantLeafLight
                      }
                      attach="material"
                    />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Dedicated Landing Uplight */}
          <pointLight
            position={[0, 0.5, 0.3]}
            color="#F0B968"
            intensity={6}
            distance={3}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
