"use client";

import { Canvas } from "@react-three/fiber";
import Plaza from "./Plaza";
import CameraRig from "./CameraRig";
import { SafeEnvironment } from "./SafeEnvironment";

interface WorldCanvasProps {
  targetPosition: [number, number, number];
  hasEntered: boolean;
}

export default function WorldCanvas({ targetPosition, hasEntered }: WorldCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#11100F] z-0">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.18, powerPreference: "high-performance" }} 
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e: Event) => {
            e.preventDefault();
            console.warn("MW Trends: WebGL context lost; recovering...");
          });
        }}
        camera={{ position: [0, 2.50, 15.2], fov: 52, near: 0.1, far: 120 }}
      >
        <color attach="background" args={["#11100F"]} />
        
        {/* Environment Lighting for Subtle Architectural Reflections */}
        <SafeEnvironment />

        {/* Global Architectural Atmosphere */}
        <ambientLight intensity={hasEntered ? 0.65 : 0.35} color="#E7D6BE" />

        {/* Core Multi-Floor Luxury Building */}
        <Plaza hasEntered={hasEntered} />
        <CameraRig targetPosition={targetPosition} />
      </Canvas>
    </div>
  );
}
