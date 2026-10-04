"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Plaza from "./Plaza";
import CameraRig from "./CameraRig";
import { Environment } from "@react-three/drei";

interface WorldCanvasProps {
  targetPosition: [number, number, number];
  hasEntered: boolean;
}

export default function WorldCanvas({ targetPosition, hasEntered }: WorldCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] z-0">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.2 }} 
        camera={{ position: [0, 5, 30], fov: 45 }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", hasEntered ? 25 : 35, hasEntered ? 90 : 120]} />
        
        {/* Environment Map for Premium Reflections */}
        <Environment preset="city" environmentIntensity={0.5} />

        {/* Global Lighting */}
        <ambientLight intensity={hasEntered ? 1.0 : 0.4} color="#F7F4ED" />
        
        <Suspense fallback={null}>
          <Plaza hasEntered={hasEntered} />
          <CameraRig targetPosition={targetPosition} />
        </Suspense>
      </Canvas>
    </div>
  );
}
