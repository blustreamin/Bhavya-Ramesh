"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

/**
 * Placeholder geometry standing in for the hero's sculptural jewellery pieces.
 * Each `kind` is a lightweight metallic primitive composed to echo the
 * silhouette of the real product.
 *
 * TODO: replace these primitives with the actual GLB models (loaded via
 * useGLTF from @react-three/drei) once the 3D jewellery assets are available.
 */
export type ObjectKind =
  | "ring"
  | "skull"
  | "figure"
  | "necklace"
  | "sunglasses"
  | "earring"
  | "nailring";

export type FloatingObjectProps = {
  kind: ObjectKind;
  position: [number, number, number];
  scale?: number;
  /** "gold" or "silver" metallic finish. */
  finish?: "gold" | "silver";
  rotationSpeed?: number;
};

const FINISHES: Record<string, string> = {
  gold: "#d8b15a",
  silver: "#c7ccd1",
};

export function FloatingObject({
  kind,
  position,
  scale = 1,
  finish = "silver",
  rotationSpeed = 0.15,
}: FloatingObjectProps) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });

  const color = FINISHES[finish];
  const material = (
    <meshStandardMaterial color={color} metalness={1} roughness={0.22} />
  );

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.4}
      floatIntensity={0.9}
      position={position}
    >
      <group ref={group} scale={scale}>
        {kind === "ring" && (
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.7, 0.22, 24, 64]} />
            {material}
          </mesh>
        )}

        {kind === "skull" && (
          <mesh>
            <dodecahedronGeometry args={[0.7, 0]} />
            {material}
          </mesh>
        )}

        {kind === "figure" && (
          <mesh rotation={[0, 0, Math.PI / 6]}>
            <capsuleGeometry args={[0.22, 0.9, 8, 20]} />
            {material}
          </mesh>
        )}

        {kind === "necklace" && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.95, 0.07, 16, 80]} />
            {material}
          </mesh>
        )}

        {kind === "sunglasses" && (
          <group>
            <mesh position={[-0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.42, 0.06, 16, 48]} />
              {material}
            </mesh>
            <mesh position={[0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.42, 0.06, 16, 48]} />
              {material}
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 0.06, 0.06]} />
              {material}
            </mesh>
          </group>
        )}

        {kind === "earring" && (
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.28, 1, 24]} />
            {material}
          </mesh>
        )}

        {kind === "nailring" && (
          <mesh>
            <coneGeometry args={[0.32, 1.1, 6]} />
            {material}
          </mesh>
        )}
      </group>
    </Float>
  );
}
