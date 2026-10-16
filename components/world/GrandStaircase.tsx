"use client";

import { useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useStore } from "@/lib/store/useStore";

interface GrandStaircaseProps {
  floorNumber: number;
  floorHeight: number;
  onAscend: () => void;
  canAscend?: boolean;
}

export default function GrandStaircase({
  floorNumber,
  floorHeight,
  onAscend,
  canAscend = true,
}: GrandStaircaseProps) {
  const [hovered, setHovered] = useState(false);
  const isStairsAscending = useStore((state) => state.isStairsAscending);

  const materials = useMemo(() => {
    return {
      darkMarbleStep: new THREE.MeshStandardMaterial({
        color: "#141312",
        roughness: 0.24,
        metalness: 0.5,
      }),
      graphiteCarriage: new THREE.MeshStandardMaterial({
        color: "#0F0E0D",
        roughness: 0.35,
        metalness: 0.7,
      }),
      champagneGold: new THREE.MeshStandardMaterial({
        color: "#E2BA55",
        roughness: 0.16,
        metalness: 0.95,
      }),
      stepGlowLED: new THREE.MeshStandardMaterial({
        color: "#E8A838",
        emissive: "#D98E20",
        emissiveIntensity: 0.85,
        roughness: 0.3,
        metalness: 0.1,
      }),
      smokedGlass: new THREE.MeshPhysicalMaterial({
        color: "#111315",
        roughness: 0.05,
        metalness: 0.2,
        transparent: true,
        opacity: 0.3,
      }),
      landingMarble: new THREE.MeshStandardMaterial({
        color: "#0F0E0D",
        roughness: 0.2,
        metalness: 0.45,
      }),
    };
  }, []);

  // Monumental Grand Staircase rising to the Mezzanine Landing at Y = 5.5
  const numSteps = 18;
  const targetRise = 5.5;
  const stepRise = targetRise / numSteps; // ~0.305m per step
  const totalRun = 6.4;
  const stepRun = totalRun / numSteps; // ~0.355m per step
  const stairWidth = 6.4; // Wide monumental scale exactly matching the reference
  const startZ = -4.2;

  const steps = useMemo(() => {
    return Array.from({ length: numSteps }, (_, i) => {
      const y = (i + 0.5) * stepRise;
      const z = startZ - i * stepRun;
      return { index: i, y, z };
    });
  }, [numSteps, stepRise, stepRun, startZ]);

  const stepLightRefs = useRef<(THREE.PointLight | null)[]>([]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const isWaving = hovered || isStairsAscending;

    steps.forEach((step, idx) => {
      const light = stepLightRefs.current[idx];
      if (light) {
        let targetIntensity = 3.5;
        if (isWaving) {
          const waveSpeed = isStairsAscending ? 6.5 : 3.8;
          const wave = Math.max(0, Math.sin(time * waveSpeed - idx * 0.32));
          targetIntensity = 3.5 + wave * (isStairsAscending ? 10.0 : 6.0);
        }
        easing.damp(light, "intensity", targetIntensity, 0.12, delta);
      }
    });
  });

  const stairSlopeAngle = Math.atan2(targetRise, totalRun);
  const midY = targetRise / 2;
  const midZ = startZ - totalRun / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. CLICKABLE HITBOX & APPROACH TRIGGER */}
      <mesh
        position={[0, midY, midZ]}
        rotation={[stairSlopeAngle, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (canAscend) {
            onAscend();
          }
        }}
        onPointerOver={() => {
          if (canAscend) {
            document.body.style.cursor = "pointer";
            setHovered(true);
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          setHovered(false);
        }}
        visible={false}
      >
        <boxGeometry args={[stairWidth + 0.8, 1.8, totalRun * 1.3]} />
        <meshBasicMaterial />
      </mesh>

      {/* 2. STRUCTURAL GRAPHITE CARRIAGE */}
      <mesh
        position={[0, midY - 0.22, midZ]}
        rotation={[stairSlopeAngle, 0, 0]}
        castShadow
      >
        <boxGeometry args={[stairWidth + 0.2, 0.45, totalRun * 1.25]} />
        <primitive object={materials.graphiteCarriage} attach="material" />
      </mesh>

      {/* 3. MONUMENTAL DARK MARBLE STEPS WITH CONTINUOUS EDGE LED GLOW */}
      {steps.map((step) => (
        <group key={`stair-step-${step.index}`} position={[0, step.y, step.z]}>
          {/* Dark Marble Tread Slab */}
          <mesh castShadow receiveShadow position={[0, stepRise * 0.44, 0]}>
            <boxGeometry args={[stairWidth, 0.08, stepRun * 1.25]} />
            <primitive object={materials.darkMarbleStep} attach="material" />
          </mesh>

          {/* Continuous Glowing Warm Golden LED Linear Strip across Step Nosing */}
          <mesh position={[0, stepRise * 0.44, stepRun * 0.58]}>
            <boxGeometry args={[stairWidth + 0.04, 0.055, 0.04]} />
            <primitive object={materials.stepGlowLED} attach="material" />
          </mesh>

          {/* Polished Champagne Gold Step Nosing Beading */}
          <mesh position={[0, stepRise * 0.44 - 0.035, stepRun * 0.58]} castShadow>
            <boxGeometry args={[stairWidth + 0.04, 0.02, 0.04]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>

          {/* Symmetrical Left & Right Stair-Edge Ambient Warm Lighting */}
          {[-stairWidth / 2 + 0.45, stairWidth / 2 - 0.45].map((xEdge, edgeIdx) => (
            <pointLight
              key={`edge-light-${step.index}-${edgeIdx}`}
              ref={(el) => {
                if (edgeIdx === 0) stepLightRefs.current[step.index] = el;
              }}
              color="#F0B968"
              intensity={3.8}
              distance={3.5}
              decay={2}
              position={[xEdge, stepRise * 0.25, 0.25]}
            />
          ))}
        </group>
      ))}

      {/* Central Radiant Warm Staircase Cascade Illumination */}
      <pointLight
        position={[0, midY + 1.2, midZ + 0.8]}
        color="#F0B968"
        intensity={18}
        distance={9}
        decay={2}
      />

      {/* 4. BALUSTRADES (VERTICAL GOLD BALUSTERS + CONTINUOUS GOLD HANDRAIL) */}
      {[-stairWidth / 2 - 0.08, stairWidth / 2 + 0.08].map((x, i) => (
        <group key={`balustrade-${i}`} position={[x, 0, 0]}>
          {/* Frameless Smoked Glass Balustrade Infill */}
          <mesh
            position={[0, midY + 0.55, midZ]}
            rotation={[stairSlopeAngle, 0, 0]}
          >
            <boxGeometry args={[0.03, 0.95, totalRun * 1.25]} />
            <primitive object={materials.smokedGlass} attach="material" />
          </mesh>

          {/* Continuous Champagne Gold Handrail */}
          <mesh
            position={[0, midY + 1.08, midZ]}
            rotation={[stairSlopeAngle, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.08, totalRun * 1.28]} />
            <meshStandardMaterial
              color="#E5BE5E"
              roughness={0.15}
              metalness={0.92}
              emissive="#C59B32"
              emissiveIntensity={0.22}
            />
          </mesh>

          {/* Vertical Architectural Gold Baluster Spindles along each 2nd step */}
          {steps.filter((_, idx) => idx % 2 === 0).map((s) => (
            <mesh
              key={`spindle-${s.index}`}
              position={[0, s.y + 0.52, s.z]}
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.96, 12]} />
              <primitive object={materials.champagneGold} attach="material" />
            </mesh>
          ))}

          {/* Symmetrical Polished Gold Post Terminals at Stair Base */}
          <mesh position={[0, 0.6, startZ + 0.2]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 1.2, 24]} />
            <meshStandardMaterial
              color="#E5BE5E"
              roughness={0.15}
              metalness={0.92}
              emissive="#C59B32"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[0, 1.22, startZ + 0.2]} castShadow>
            <sphereGeometry args={[0.09, 24, 24]} />
            <primitive object={materials.champagneGold} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 5. UPPER MEZZANINE LANDING SLAB */}
      <group position={[0, targetRise, startZ - totalRun - 1.0]}>
        <mesh receiveShadow castShadow position={[0, -0.08, 0]}>
          <boxGeometry args={[stairWidth + 1.2, 0.2, 2.4]} />
          <primitive object={materials.landingMarble} attach="material" />
        </mesh>
        <mesh position={[0, 0.02, 1.18]}>
          <boxGeometry args={[stairWidth + 1.2, 0.04, 0.06]} />
          <primitive object={materials.champagneGold} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
