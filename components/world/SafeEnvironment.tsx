"use client";

export function SafeEnvironment() {
  return (
    <group>
      {/* 
        COMPLETELY REMOVED <Environment preset="city" /> 
        TO PREVENT potsdamer_platz_1k.hdr FETCH FAILURES.
        Relying exclusively on stable manual lighting.
      */}
      {/* Main Architectural Directional Light (Warm Ivory) */}
      <directionalLight position={[20, 30, 20]} intensity={2.5} color="#F4EFE7" castShadow shadow-mapSize={[2048, 2048]} />
      
      {/* Secondary Cool Fill (Deep Teal / Twilight) */}
      <directionalLight position={[-20, 20, -20]} intensity={1.5} color="#23444A" />
      
      {/* General Environment Fill (Warm-Neutral) */}
      <hemisphereLight args={["#23444A", "#CFC3B4", 1.2]} />
      
      {/* Soft Base Ambient */}
      <ambientLight intensity={0.8} color="#CFC3B4" />
    </group>
  );
}
