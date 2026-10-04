"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { useRef } from "react";

interface CameraRigProps {
  targetPosition: [number, number, number];
}

export default function CameraRig({ targetPosition }: CameraRigProps) {
  const dummy = useRef(new THREE.Vector3());

  const lookTarget = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((state, delta) => {
    // Elevate camera more (+5) and pull back (+15)
    dummy.current.set(targetPosition[0], targetPosition[1] + 5, targetPosition[2] + 15);
    easing.damp3(state.camera.position, dummy.current, 0.4, delta);
    
    // Look slightly downwards at the target (+1 instead of +2)
    dummy.current.set(targetPosition[0], targetPosition[1] + 1, targetPosition[2]);
    easing.damp3(lookTarget.current, dummy.current, 0.4, delta);
    
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}
