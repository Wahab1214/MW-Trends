"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function AtriumMezzanine() {
  const materials = useMemo(() => {
    return {
      ivoryMarble: new THREE.MeshStandardMaterial({
        color: "#EDE2CF",
        roughness: 0.42,
        metalness: 0.08,
      }),
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E5BE5E",
        roughness: 0.16,
        metalness: 0.95,
        emissive: "#C59B32",
        emissiveIntensity: 0.22,
      }),
      blackMarble: new THREE.MeshStandardMaterial({
        color: "#080706",
        roughness: 0.16,
        metalness: 0.5,
      }),
      clearBalustradeGlass: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.02,
        metalness: 0.05,
        transparent: true,
        opacity: 0.18,
      }),
      plantLeaf: new THREE.MeshStandardMaterial({
        color: "#274322",
        roughness: 0.45,
        metalness: 0.08,
      }),
      plantLeafLight: new THREE.MeshStandardMaterial({
        color: "#3E6334",
        roughness: 0.42,
        metalness: 0.06,
      }),
      plantStem: new THREE.MeshStandardMaterial({
        color: "#3A2E24",
        roughness: 0.8,
        metalness: 0.04,
      }),
      warmCoveLight: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
      boutiqueInteriorGlow: new THREE.MeshStandardMaterial({
        color: "#F8DFB0",
        roughness: 0.6,
        metalness: 0.1,
        emissive: "#D9A443",
        emissiveIntensity: 0.42,
      }),
      upperStorefrontFrame: new THREE.MeshStandardMaterial({
        color: "#080706",
        roughness: 0.18,
        metalness: 0.55,
      }),
    };
  }, []);

  // Left and Right Mezzanine Balconies framing the central open atrium
  const sides = [-6.8, 6.8];

  return (
    <group position={[0, 5.5, 0]}>
      {/* ================================================== */}
      {/* 1. BALCONIES & UPPER BOUTIQUE STOREFRONTS */}
      {/* ================================================== */}
      {sides.map((x, i) => (
        <group key={`mezzanine-side-${i}`} position={[x, 0, 0]}>
          {/* Layered Balcony Floor Slab & Intermediate Architectural Soffit */}
          <mesh position={[x > 0 ? 3.8 : -3.8, -0.22, -1.0]} receiveShadow castShadow>
            <boxGeometry args={[7.8, 0.44, 26]} />
            <primitive object={materials.ivoryMarble} attach="material" />
          </mesh>

          {/* Underside Warm Cove Light Strip along Corridor Edge */}
          <mesh position={[0, -0.45, -1.0]}>
            <boxGeometry args={[0.08, 0.03, 26]} />
            <primitive object={materials.warmCoveLight} attach="material" />
          </mesh>

          {/* Champagne Gold Edge Fascia */}
          <mesh position={[0, -0.22, -1.0]} castShadow>
            <boxGeometry args={[0.08, 0.46, 26]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Clean Glass Balustrade with Champagne Gold Handrail */}
          <mesh position={[0, 0.55, -1.0]}>
            <boxGeometry args={[0.035, 1.05, 26]} />
            <primitive object={materials.clearBalustradeGlass} attach="material" />
          </mesh>
          <mesh position={[0, 1.12, -1.0]} castShadow>
            <boxGeometry args={[0.08, 0.07, 26]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Upper Floor Luxury Boutique Facades (Visible Behind Mezzanine Balustrade) */}
          {[-6.0, 0.5, 6.5].map((zStore, sIdx) => (
            <group key={`upper-boutique-${sIdx}`} position={[x > 0 ? 0.88 : -0.88, 2.1, zStore]}>
              {/* Backlit Display Window / Vitrine */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.08, 3.4, 4.8]} />
                <primitive object={materials.boutiqueInteriorGlow} attach="material" />
              </mesh>
              {/* Black Marble Framing Architrave */}
              <mesh position={[x > 0 ? -0.05 : 0.05, 0, 0]}>
                <boxGeometry args={[0.04, 3.6, 5.0]} />
                <primitive object={materials.upperStorefrontFrame} attach="material" />
              </mesh>
              {/* Champagne Gold Outer Trim */}
              <mesh position={[x > 0 ? -0.07 : 0.07, 1.76, 0]}>
                <boxGeometry args={[0.04, 0.06, 5.1]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              <mesh position={[x > 0 ? -0.07 : 0.07, -1.76, 0]}>
                <boxGeometry args={[0.04, 0.06, 5.1]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              {/* Boutique Warm Amber Interior Spotlights */}
              <pointLight
                position={[x > 0 ? -0.4 : 0.4, 0.5, 0]}
                color="#F7D496"
                intensity={9.0}
                distance={5.0}
                decay={2}
              />
            </group>
          ))}

          {/* Mezzanine Architectural Columns Spanning to Upper Ceiling */}
          {[-7.5, -0.5, 6.5].map((z, j) => (
            <group key={`upper-col-${j}`} position={[x > 0 ? 0.75 : -0.75, 2.2, z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 4.4, 0.55]} />
                <primitive object={materials.ivoryMarble} attach="material" />
              </mesh>
              {/* Champagne Gold Column Collar */}
              <mesh position={[0, -2.0, 0]}>
                <boxGeometry args={[0.62, 0.08, 0.62]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              {/* Warm Architectural Sconce on Atrium Face */}
              <group position={[x > 0 ? -0.34 : 0.34, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.04, 1.2, 0.14]} />
                  <primitive object={materials.champagneGold} attach="material" />
                </mesh>
                <mesh position={[x > 0 ? -0.025 : 0.025, 0, 0]}>
                  <boxGeometry args={[0.02, 1.0, 0.08]} />
                  <primitive object={materials.warmCoveLight} attach="material" />
                </mesh>
                <pointLight
                  position={[x > 0 ? -0.15 : 0.15, 0, 0]}
                  color="#F0B968"
                  intensity={9.0}
                  distance={5.0}
                  decay={2}
                />
              </group>
            </group>
          ))}

          {/* Balcony Potted Greenery & Urns */}
          {[-5.0, 2.0].map((z, k) => (
            <group key={`balcony-plant-${k}`} position={[x > 0 ? 0.7 : -0.7, 0.05, z]}>
              {/* Black Marble Fluted Urn */}
              <mesh position={[0, 0.32, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.18, 0.6, 20]} />
                <primitive object={materials.blackMarble} attach="material" />
              </mesh>
              <mesh position={[0, 0.62, 0]} castShadow>
                <cylinderGeometry args={[0.28, 0.26, 0.05, 20]} />
                <primitive object={materials.champagneGold} attach="material" />
              </mesh>
              {/* Plant Stem & Foliage */}
              <mesh position={[0, 0.85, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.05, 0.5, 8]} />
                <primitive object={materials.plantStem} attach="material" />
              </mesh>
              {[0, 1, 2, 3, 4].map((fIdx) => {
                const angle = (fIdx / 5) * Math.PI * 2;
                return (
                  <group key={`b-frond-${fIdx}`} position={[0, 1.0, 0]} rotation={[0.4, angle, 0]}>
                    <mesh position={[0, 0.35, 0.25]} rotation={[0.4, 0, 0]} castShadow>
                      <boxGeometry args={[0.18, 0.6, 0.015]} />
                      <primitive
                        object={fIdx % 2 === 0 ? materials.plantLeaf : materials.plantLeafLight}
                        attach="material"
                      />
                    </mesh>
                  </group>
                );
              })}
            </group>
          ))}
        </group>
      ))}

      {/* ================================================== */}
      {/* 2. REAR MEZZANINE BRIDGE BALUSTRADE (AT Z = -10.6) */}
      {/* Spans across the back landing overlooking the atrium */}
      {/* ================================================== */}
      <group position={[0, 0, -10.6]}>
        {/* Bridge Floor Slab */}
        <mesh position={[0, -0.15, -0.8]} receiveShadow castShadow>
          <boxGeometry args={[13.6, 0.32, 2.2]} />
          <primitive object={materials.ivoryMarble} attach="material" />
        </mesh>
        {/* Champagne Gold Edge Fascia */}
        <mesh position={[0, -0.15, 0.25]} castShadow>
          <boxGeometry args={[13.6, 0.34, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
        {/* Glass Balustrade */}
        <mesh position={[0, 0.58, 0.25]}>
          <boxGeometry args={[13.6, 1.05, 0.035]} />
          <primitive object={materials.clearBalustradeGlass} attach="material" />
        </mesh>
        {/* Champagne Gold Handrail */}
        <mesh position={[0, 1.12, 0.25]} castShadow>
          <boxGeometry args={[13.6, 0.07, 0.08]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
