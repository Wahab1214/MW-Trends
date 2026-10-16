"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface BuildingShellProps {
  totalFloors: number;
  floorHeight: number;
  currentFloor?: number;
}

export default function BuildingShell({
  totalFloors,
  floorHeight,
  currentFloor = 1,
}: BuildingShellProps) {
  const ceilingY = 12.8;
  const floorY = (currentFloor - 1) * floorHeight;

  const materials = useMemo(() => {
    return {
      ivoryStoneColumn: new THREE.MeshStandardMaterial({
        color: "#F6F1E8",
        roughness: 0.45,
        metalness: 0.1,
      }),
      graphiteStructure: new THREE.MeshStandardMaterial({
        color: "#141312",
        roughness: 0.35,
        metalness: 0.65,
      }),
      champagneTrim: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.16,
        metalness: 0.95,
      }),
      darkWall: new THREE.MeshStandardMaterial({
        color: "#0E0D0C",
        roughness: 0.5,
        metalness: 0.35,
      }),
      cofferCeilingPanel: new THREE.MeshStandardMaterial({
        color: "#181716",
        roughness: 0.45,
        metalness: 0.4,
      }),
      cofferLight: new THREE.MeshBasicMaterial({
        color: "#F0B968",
      }),
    };
  }, []);

  return (
    <group position={[0, floorY, 0]}>
      {/* ================================================== */}
      {/* 1. CINEMATIC WARM ARCHITECTURAL LIGHTING */}
      {/* (Color temperature ~2950K - 3100K) */}
      {/* ================================================== */}
      <group>
        {/* Warm-Neutral Fill */}
        <hemisphereLight args={["#FAF4EB", "#181410", 0.95]} />
        <ambientLight intensity={0.65} color="#EBDCC5" />

        {/* Primary Warm Key Directional Sunlight */}
        <directionalLight
          position={[8, 16, 14]}
          intensity={1.5}
          color="#FFF8F0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={16}
          shadow-camera-bottom={-4}
        />

        {/* Secondary Warm Fill Light */}
        <directionalLight
          position={[-10, 15, -6]}
          intensity={0.75}
          color="#F2C582"
        />

        {/* Overhead Concourse Downlights along Central Axis */}
        {[10.0, 4.0, -2.0, -7.0].map((z, idx) => (
          <pointLight
            key={`concourse-downlight-${idx}`}
            position={[0, 11.2, z]}
            color="#F0B968"
            intensity={18}
            distance={16}
            decay={2}
          />
        ))}
      </group>

      {/* ================================================== */}
      {/* 2. REAR & SIDE ATRIUM WALLS */}
      {/* ================================================== */}
      <group position={[0, ceilingY / 2, -13.8]}>
        <mesh receiveShadow>
          <boxGeometry args={[30, ceilingY + 2, 0.8]} />
          <primitive object={materials.darkWall} attach="material" />
        </mesh>
      </group>

      {/* Left Outer Wall */}
      <mesh
        position={[-14.2, ceilingY / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.8, ceilingY + 2, 34]} />
        <primitive object={materials.darkWall} attach="material" />
      </mesh>

      {/* Right Outer Wall */}
      <mesh
        position={[14.2, ceilingY / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.8, ceilingY + 2, 34]} />
        <primitive object={materials.darkWall} attach="material" />
      </mesh>

      {/* ================================================== */}
      {/* 3. PERIMETER COLUMNS WITH CHAMPAGNE GOLD REVEALS */}
      {/* ================================================== */}
      {[-12.8, 12.8].map((x, i) => (
        <group key={`outer-col-${i}`}>
          {[6.0, -6.0].map((z, j) => (
            <group key={`col-z-${j}`} position={[x, ceilingY / 2, z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.7, ceilingY, 0.7]} />
                <primitive object={materials.ivoryStoneColumn} attach="material" />
              </mesh>
              <mesh position={[x > 0 ? -0.36 : 0.36, 0, 0]}>
                <boxGeometry args={[0.04, ceilingY, 0.08]} />
                <primitive object={materials.champagneTrim} attach="material" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ================================================== */}
      {/* 4. LAYERED COFFERED LUXURY CEILING AT Y = 11.2 */}
      {/* Exactly matching reference: warm golden linear slots */}
      {/* ================================================== */}
      <group position={[0, ceilingY, 0]}>
        {/* Main Dark Graphite Coffered Soffit Plane */}
        <mesh position={[0, 0.2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[26, 30]} />
          <primitive object={materials.cofferCeilingPanel} attach="material" />
        </mesh>

        {/* Transverse Cross-Beams with Recessed Warm Golden Linear Lights */}
        {[-8, -3, 2, 7, 12].map((z, i) => (
          <group key={`roof-beam-${i}`} position={[0, 0, z]}>
            <mesh>
              <boxGeometry args={[26, 0.45, 0.55]} />
              <primitive object={materials.graphiteStructure} attach="material" />
            </mesh>
            {/* Underside Recessed Linear Glow Strip */}
            <mesh position={[0, -0.24, 0]}>
              <boxGeometry args={[24, 0.04, 0.16]} />
              <primitive object={materials.cofferLight} attach="material" />
            </mesh>
            {/* Champagne Gold Flanking Trims */}
            <mesh position={[0, -0.24, 0.2]}>
              <boxGeometry args={[25, 0.03, 0.04]} />
              <primitive object={materials.champagneTrim} attach="material" />
            </mesh>
            <mesh position={[0, -0.24, -0.2]}>
              <boxGeometry args={[25, 0.03, 0.04]} />
              <primitive object={materials.champagneTrim} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Longitudinal Champagne Gold Light Spine */}
        {[-4.0, 4.0].map((x, k) => (
          <group key={`longitudinal-spine-${k}`} position={[x, -0.1, -1]}>
            <mesh>
              <boxGeometry args={[0.2, 0.2, 28]} />
              <primitive object={materials.champagneTrim} attach="material" />
            </mesh>
            <mesh position={[0, -0.11, 0]}>
              <boxGeometry args={[0.1, 0.03, 26]} />
              <primitive object={materials.cofferLight} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
