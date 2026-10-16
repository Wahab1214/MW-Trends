"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Realistic Architectural Ficus / Olive Tree Component
function RealisticIndoorTree() {
  const materials = useMemo(() => {
    return {
      trunk: new THREE.MeshStandardMaterial({
        color: "#352A20",
        roughness: 0.85,
        metalness: 0.04,
      }),
      branch: new THREE.MeshStandardMaterial({
        color: "#423428",
        roughness: 0.8,
        metalness: 0.04,
      }),
      leafForest: new THREE.MeshStandardMaterial({
        color: "#1E3B18",
        roughness: 0.38,
        metalness: 0.06,
        side: THREE.DoubleSide,
      }),
      leafOlive: new THREE.MeshStandardMaterial({
        color: "#355B27",
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      leafHighlight: new THREE.MeshStandardMaterial({
        color: "#4E7738",
        roughness: 0.32,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  // Natural organic multi-tier branching & leaf canopy
  const canopyNodes = useMemo(() => {
    const nodes: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number]; matType: number }[] = [];
    const count = 46;
    for (let i = 0; i < count; i++) {
      const radius = 0.28 + Math.random() * 0.52;
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const height = 0.7 + Math.random() * 0.95;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      nodes.push({
        pos: [x, height, z],
        rot: [(Math.random() - 0.5) * 0.7, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.7],
        scale: [0.22 + Math.random() * 0.16, 0.16 + Math.random() * 0.12, 0.22 + Math.random() * 0.16],
        matType: i % 3,
      });
    }
    return nodes;
  }, []);

  return (
    <group position={[0, 0.88, 0]}>
      {/* Sculpted Trunk with Natural Taper */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.078, 0.96, 16]} />
        <primitive object={materials.trunk} attach="material" />
      </mesh>

      {/* Main Organic Branches Reaching Outward */}
      {[
        { pos: [0.08, 0.68, 0.06], rot: [0.42, 0.35, 0.48], len: 0.72 },
        { pos: [-0.08, 0.74, -0.06], rot: [-0.45, -0.3, -0.52], len: 0.68 },
        { pos: [-0.07, 0.82, 0.08], rot: [0.38, -0.65, -0.42], len: 0.64 },
        { pos: [0.08, 0.88, -0.07], rot: [-0.4, 0.75, 0.45], len: 0.6 },
        { pos: [0.0, 0.95, 0.0], rot: [0.1, 0.2, -0.1], len: 0.5 },
      ].map((b, idx) => (
        <mesh key={`branch-${idx}`} position={b.pos as any} rotation={b.rot as any} castShadow>
          <cylinderGeometry args={[0.018, 0.034, b.len, 10]} />
          <primitive object={materials.branch} attach="material" />
        </mesh>
      ))}

      {/* Natural Foliage Canopy with Realistic Volume */}
      {canopyNodes.map((c, idx) => {
        const mat =
          c.matType === 0
            ? materials.leafForest
            : c.matType === 1
            ? materials.leafOlive
            : materials.leafHighlight;
        return (
          <group key={`foliage-${idx}`} position={c.pos} rotation={c.rot} scale={[c.scale[0] * 1.3, c.scale[1] * 0.55, c.scale[2] * 1.3]}>
            {/* Fine leafy cluster */}
            <mesh castShadow>
              <dodecahedronGeometry args={[0.24, 0]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0.05, 0.03, 0.05]} scale={[0.85, 0.85, 0.85]} castShadow>
              <dodecahedronGeometry args={[0.2, 0]} />
              <primitive object={mat} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Warm Golden Botanical Canopy Uplight */}
      <pointLight
        position={[0, 0.75, 0]}
        color="#F0B968"
        intensity={9.0}
        distance={3.5}
        decay={2}
      />
    </group>
  );
}

export default function CorridorAccents() {
  const materials = useMemo(() => {
    return {
      blackMarble: new THREE.MeshStandardMaterial({
        color: "#0A0908",
        roughness: 0.14,
        metalness: 0.55,
      }),
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E5BE5E",
        roughness: 0.15,
        metalness: 0.95,
        emissive: "#C59B32",
        emissiveIntensity: 0.2,
      }),
      soil: new THREE.MeshStandardMaterial({
        color: "#161311",
        roughness: 0.95,
        metalness: 0.02,
      }),
      coveGlow: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
    };
  }, []);

  // Symmetrical Planter Positions matching reference image:
  // 1. Foreground concourse zone (z = 2.2)
  // 2. Midground staircase flank zone (z = -3.8)
  const planters = [
    { x: -3.4, z: 2.2 },
    { x: 3.4, z: 2.2 },
    { x: -3.4, z: -3.8 },
    { x: 3.4, z: -3.8 },
  ];

  // Two Symmetrical Luxury Benches flanking the central concourse
  // Running LENGTHWISE along the aisle (z = -0.8)
  const benches = [
    { x: -3.4, z: -0.8 },
    { x: 3.4, z: -0.8 },
  ];

  return (
    <group>
      {/* ================================================== */}
      {/* 1. LUXURY BLACK MARBLE PLANTERS WITH BASE COVE GLOW */}
      {/* ================================================== */}
      {planters.map((pos, idx) => (
        <group key={`planter-${idx}`} position={[pos.x, 0, pos.z]}>
          {/* Recessed Base Kickplate with Warm Golden Cove Lighting */}
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[1.32, 0.07, 1.32]} />
            <primitive object={materials.coveGlow} attach="material" />
          </mesh>
          <pointLight
            color="#F0B968"
            intensity={6.0}
            distance={2.6}
            decay={2}
            position={[0, 0.12, 0]}
          />

          {/* Polished Black Marble Planter Body */}
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.24, 0.82, 1.24]} />
            <primitive object={materials.blackMarble} attach="material" />
          </mesh>

          {/* Champagne Gold Top Rim Molding */}
          <mesh position={[0, 0.89, 0]} castShadow>
            <boxGeometry args={[1.3, 0.05, 1.3]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Planter Soil Bed */}
          <mesh position={[0, 0.87, 0]}>
            <boxGeometry args={[1.12, 0.02, 1.12]} />
            <primitive object={materials.soil} attach="material" />
          </mesh>

          {/* Realistic Indoor Tree */}
          <RealisticIndoorTree />
        </group>
      ))}

      {/* ================================================== */}
      {/* 2. LUXURY POLISHED BLACK MARBLE CONCOURSE BENCHES */}
      {/* Oriented lengthwise along walkway exactly matching reference */}
      {/* ================================================== */}
      {benches.map((pos, idx) => (
        <group key={`bench-${idx}`} position={[pos.x, 0, pos.z]}>
          {/* Base Recessed Kickplate with Cove Glow */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.76, 0.06, 2.38]} />
            <primitive object={materials.coveGlow} attach="material" />
          </mesh>
          <pointLight
            color="#F0B968"
            intensity={5.5}
            distance={2.4}
            decay={2}
            position={[0, 0.1, 0]}
          />

          {/* Polished Black Marble Main Plinth */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.38, 2.32]} />
            <primitive object={materials.blackMarble} attach="material" />
          </mesh>

          {/* Champagne Gold Perimeter Plinth Trim */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.78, 0.04, 2.4]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Polished Chamfered Top Bench Slab */}
          <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.76, 0.06, 2.38]} />
            <primitive object={materials.blackMarble} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
