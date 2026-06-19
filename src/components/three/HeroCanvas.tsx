"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { FloatingObject, type FloatingObjectProps } from "./FloatingObject";

/**
 * Composition of the floating hero pieces, positioned to echo the screenshot
 * layout (ring top-left, skull, trapeze figure + necklace top-right,
 * sunglasses bottom-left, earrings, nail ring bottom-right).
 */
const OBJECTS: FloatingObjectProps[] = [
  { kind: "ring", position: [-4.4, 2, 0], finish: "gold", scale: 0.95 },
  { kind: "skull", position: [-1.6, 1.9, -0.5], finish: "silver", scale: 1 },
  { kind: "figure", position: [1.5, 2.2, -0.5], finish: "silver", scale: 1 },
  { kind: "necklace", position: [4.3, 2, -0.5], finish: "silver", scale: 1 },
  { kind: "sunglasses", position: [-3.9, -1.9, 0], finish: "silver", scale: 0.9 },
  { kind: "earring", position: [0.6, -2, 0], finish: "silver", scale: 0.7 },
  { kind: "earring", position: [1.4, -1.7, 0], finish: "silver", scale: 0.7 },
  { kind: "nailring", position: [4.2, -1.8, 0], finish: "silver", scale: 0.85 },
];

export default function HeroCanvas() {
  return (
    <Canvas
      // Clamp DPR for performance on high-density displays.
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={42} />

      {/* Lighting + reflections for the metallic finishes. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <directionalLight position={[-6, -2, 2]} intensity={0.5} color="#ec5198" />

      <Suspense fallback={null}>
        <Environment preset="city" />
        {OBJECTS.map((obj, i) => (
          <FloatingObject key={i} {...obj} rotationSpeed={0.1 + i * 0.02} />
        ))}
      </Suspense>
    </Canvas>
  );
}
