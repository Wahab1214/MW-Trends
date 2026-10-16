"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useStore } from "@/lib/store/useStore";
import { FLOOR_HEIGHT, SHOP_SLOT_CONFIGS } from "@/lib/data/buildingCategories";

interface CameraRigProps {
  targetPosition: [number, number, number];
}

export default function CameraRig({ targetPosition }: CameraRigProps) {
  const currentFloor = useStore((state) => state.currentFloor);
  const activeShop = useStore((state) => state.activeShop);
  const enteringShopSlug = useStore((state) => state.enteringShopSlug);
  const isStairsAscending = useStore((state) => state.isStairsAscending);
  const selectedMobileSlot = useStore((state) => state.selectedMobileSlot);
  const setIsFloorTransitioning = useStore((state) => state.setIsFloorTransitioning);

  // Exact reference calibrated initial camera coordinates
  const dummyPos = useRef(new THREE.Vector3(0, 2.50, 15.2));
  const dummyLook = useRef(new THREE.Vector3(0, 2.45, -3.8));
  const currentLook = useRef(new THREE.Vector3(0, 2.45, -3.8));

  const prevFloor = useRef(currentFloor);

  // Transition lock when floor changes
  useEffect(() => {
    if (prevFloor.current !== currentFloor) {
      setIsFloorTransitioning(true);
      const timer = setTimeout(() => {
        setIsFloorTransitioning(false);
      }, 1100);
      prevFloor.current = currentFloor;
      return () => clearTimeout(timer);
    }
  }, [currentFloor, setIsFloorTransitioning]);

  useFrame((state, delta) => {
    const floorY = (currentFloor - 1) * FLOOR_HEIGHT;

    if (enteringShopSlug && targetPosition) {
      // Cinematic door entry approach: glide toward and through door threshold
      dummyPos.current.set(targetPosition[0] * 0.88, floorY + 1.95, targetPosition[2] + 1.5);
      dummyLook.current.set(targetPosition[0], floorY + 1.85, targetPosition[2] - 1.4);
    } else if (isStairsAscending) {
      // Symmetrical staircase ascending sequence: climb toward the upper landing
      dummyPos.current.set(0, floorY + 4.2, -4.2);
      dummyLook.current.set(0, floorY + 6.0, -10.0);
    } else if (selectedMobileSlot !== null && SHOP_SLOT_CONFIGS[selectedMobileSlot]) {
      // Guided mobile anchor: Frame the selected shop slot directly
      const slot = SHOP_SLOT_CONFIGS[selectedMobileSlot];
      const offsetX = slot.position[0] > 0 ? 3.4 : -3.4;
      dummyPos.current.set(offsetX, floorY + 2.2, slot.position[2] + 5.2);
      dummyLook.current.set(slot.position[0], floorY + 2.0, slot.position[2]);
    } else {
      // Standard Panoramic Floor 1 View: Exact match to Reference Image composition
      // Human eye level, perfectly centered perspective looking down the grand aisle
      const parallaxX = state.pointer.x * 0.45;
      const parallaxY = state.pointer.y * 0.18;

      dummyPos.current.set(parallaxX, floorY + 2.50 + parallaxY, 15.2);
      dummyLook.current.set(0, floorY + 2.45, -3.8);
    }

    // Smooth camera damping
    easing.damp3(state.camera.position, dummyPos.current, 0.42, delta);
    easing.damp3(currentLook.current, dummyLook.current, 0.42, delta);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
