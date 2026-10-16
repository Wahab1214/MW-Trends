"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useStore } from "@/lib/store/useStore";

interface ShopExteriorProps {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number, number];
  title: string;
  subtitle?: string;
  hasEntered: boolean;
}

export default function ShopExterior({ id, position, rotation, dimensions, title, subtitle, hasEntered }: ShopExteriorProps) {
  const interiorLight = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const setActiveShop = useStore(state => state.setActiveShop);

  const [w, h, d] = dimensions;

  const materials = useMemo(() => {
    return {
      graphiteFrame: new THREE.MeshStandardMaterial({ color: "#1C1E22", roughness: 0.3, metalness: 0.8 }),
      ivoryStone: new THREE.MeshStandardMaterial({ color: "#F4EFE7", roughness: 0.8, metalness: 0.05 }),
      warmStone: new THREE.MeshStandardMaterial({ color: "#CFC3B4", roughness: 0.9, metalness: 0.1 }),
      brushedMetal: new THREE.MeshStandardMaterial({ color: "#8B939C", roughness: 0.4, metalness: 0.7 }),
      champagneTrim: new THREE.MeshStandardMaterial({ color: "#D4AF37", roughness: 0.2, metalness: 0.9 }),
      tealAccent: new THREE.MeshStandardMaterial({ color: "#23444A", roughness: 0.5, metalness: 0.3 }),
      glass: new THREE.MeshPhysicalMaterial({ 
        color: "#050505", metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.3
      }),
      smokedGlass: new THREE.MeshPhysicalMaterial({ 
        color: "#111111", metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.6 
      }),
      signage: new THREE.MeshStandardMaterial({
        color: "#D4AF37", emissive: "#D4AF37", emissiveIntensity: 0
      }),
      screen: new THREE.MeshBasicMaterial({ color: "#E6C96A" })
    };
  }, []);

  useFrame((state, delta) => {
    if (hasEntered) {
      if (interiorLight.current) {
        const targetIntensity = hovered ? 120 : 60;
        easing.damp(interiorLight.current, 'intensity', targetIntensity, 0.5, delta);
      }
      easing.damp(materials.signage, 'emissiveIntensity', hovered ? 2.0 : 1.0, 0.5, delta);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveShop(id as any);
    setHovered(false);
    setTimeout(() => {
       window.location.href = `/shop?shop=${id}`;
    }, 600);
  };

  const frameMaterial = id === 'paper-atelier' || id === 'frame-gallery' ? materials.ivoryStone : 
                        id === 'mug-bar' || id === 'custom-lab' ? materials.warmStone : 
                        id === 'case-lab' ? materials.brushedMetal : materials.graphiteFrame;

  const trimMaterial = id === 'case-lab' ? materials.tealAccent : materials.champagneTrim;
  const glassMaterial = id === 'custom-lab' ? materials.smokedGlass : materials.glass;

  return (
    <group position={position} rotation={rotation}>
      {/* Architectural Frame */}
      <mesh castShadow receiveShadow position={[0, h/2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
      
      {/* Decorative Trim */}
      <mesh position={[0, h + 0.1, d/2]}>
        <boxGeometry args={[w + 0.2, 0.2, d + 0.2]} />
        <primitive object={trimMaterial} attach="material" />
      </mesh>

      {/* Glass Front (Clickable) */}
      <mesh 
        position={[0, h/2 - 0.2, d/2 + 0.01]} 
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
        <planeGeometry args={[w - 0.8, h - 0.8]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      
      {/* Subtle outline focus effect when hovered */}
      {hovered && (
        <mesh position={[0, h/2 - 0.2, d/2 + 0.02]}>
          <planeGeometry args={[w - 0.6, h - 0.6]} />
          <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.5} />
        </mesh>
      )}

      {/* Storefront Signage */}
      <group position={[0, h - 0.6, d/2 + 0.03]}>
        {/* Sign backplate */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[w * 0.7, 1.2]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
        <Text fontSize={0.45} letterSpacing={0.2} color="#D4AF37">
          {title}
          <primitive object={materials.signage} attach="material" />
        </Text>
        {subtitle && (
          <Text position={[0, -0.4, 0]} fontSize={0.2} letterSpacing={0.3} color="#F4EFE7">
            {subtitle}
          </Text>
        )}
      </group>

      {/* Interior Visual Hints (Products) scaled and shifted to fit within the box */}
      <group position={[0, h/2 - 0.5, 0]}>
        <pointLight ref={interiorLight} color={id === 'case-lab' ? "#ffffff" : "#F4EFE7"} intensity={0} distance={15} decay={2} />
        
        {/* We slightly scale interior displays so they fit nicely within the custom dimensions */}
        <group scale={w / 6}> 
          {id === 'tee-studio' && (
            <group position={[0, -1, 0]}>
              {/* Mannequin / Shirt Silhouette */}
              <mesh position={[1.5, 0.5, 0]}>
                <cylinderGeometry args={[0.4, 0.35, 1.8, 16]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              <mesh position={[1.5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.25, 1.2, 16, 16]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              {/* Folded Apparel Display Table */}
              <mesh position={[-1.5, 0, 0.5]}>
                <boxGeometry args={[2, 0.8, 1]} />
                <primitive object={materials.graphiteFrame} attach="material" />
              </mesh>
              {/* Stacked T-shirts */}
              {[0, 0.15, 0.3].map((y, i) => (
                <mesh key={`shirt-${i}`} position={[-1.5, 0.4 + y, 0.5]}>
                  <boxGeometry args={[0.8, 0.1, 0.8]} />
                  <primitive object={materials.ivoryStone} attach="material" />
                </mesh>
              ))}
            </group>
          )}

          {id === 'mug-bar' && (
            <group position={[0, -1, 0]}>
              {/* Ceramic Shelves */}
              {[0, 1, 2].map((y, i) => (
                <mesh key={`shelf-${i}`} position={[0, y, -0.5]}>
                  <boxGeometry args={[4, 0.1, 1]} />
                  <primitive object={materials.champagneTrim} attach="material" />
                </mesh>
              ))}
              {/* Hero Mugs Array */}
              {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                <mesh key={`mug1-${i}`} position={[x, 0.3, -0.5]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
                  <primitive object={materials.ivoryStone} attach="material" />
                </mesh>
              ))}
              {[-1, 0, 1].map((x, i) => (
                <mesh key={`mug2-${i}`} position={[x, 1.3, -0.5]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
                  <primitive object={materials.graphiteFrame} attach="material" />
                </mesh>
              ))}
            </group>
          )}

          {id === 'paper-atelier' && (
            <group position={[0, -1, 0]}>
              <mesh position={[0, 1, 0]} rotation={[0.2, 0.5, 0.1]}>
                <boxGeometry args={[2, 2.5, 0.1]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              <mesh position={[-1.5, 0.5, 0.5]} rotation={[-0.1, -0.3, -0.2]}>
                <boxGeometry args={[1.5, 2, 0.1]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              <mesh position={[1.5, 0.5, 0]} rotation={[0.1, 0.2, -0.1]}>
                <boxGeometry args={[1.5, 1.5, 0.1]} />
                <primitive object={materials.champagneTrim} attach="material" />
              </mesh>
            </group>
          )}

          {id === 'frame-gallery' && (
            <group position={[0, -1, 0]}>
              <mesh position={[-1.5, 1.5, -0.5]}>
                <boxGeometry args={[1.5, 2.5, 0.1]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              <mesh position={[1.5, 2, -0.5]}>
                <boxGeometry args={[2, 1.5, 0.1]} />
                <primitive object={materials.graphiteFrame} attach="material" />
              </mesh>
              <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[1.5, 1.8, 0.1]} />
                <primitive object={materials.champagneTrim} attach="material" />
              </mesh>
            </group>
          )}

          {id === 'case-lab' && (
            <group position={[0, -1, 0]}>
              {[-1.5, 0, 1.5].map((x, i) => (
                <group key={`case-${i}`} position={[x, 0.5, 0]}>
                  <mesh position={[0, -0.5, -0.2]}>
                    <cylinderGeometry args={[0.1, 0.3, 1, 16]} />
                    <primitive object={materials.graphiteFrame} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.5, 0]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[0.8, 1.8, 0.1]} />
                    <primitive object={i === 1 ? materials.tealAccent : materials.brushedMetal} attach="material" />
                  </mesh>
                </group>
              ))}
            </group>
          )}

          {id === 'custom-lab' && (
            <group position={[0, -1, 0]}>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
                <primitive object={materials.champagneTrim} attach="material" />
              </mesh>
              <mesh position={[0, 1.5, 0]}>
                <octahedronGeometry args={[0.6, 0]} />
                <primitive object={materials.ivoryStone} attach="material" />
              </mesh>
              <mesh position={[-2, 1.8, -0.5]}>
                <boxGeometry args={[2, 1.5, 0.1]} />
                <primitive object={materials.screen} attach="material" />
              </mesh>
              <mesh position={[2, 1.8, -0.5]}>
                <boxGeometry args={[2, 1.5, 0.1]} />
                <primitive object={materials.screen} attach="material" />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
