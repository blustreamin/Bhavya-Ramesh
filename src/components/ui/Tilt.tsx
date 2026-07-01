"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D tilt card — rotates in perspective toward the cursor, with a soft glare
 * highlight that tracks the pointer. Purely visual; children stay interactive.
 */
export function Tilt({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(340px circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 55%)`;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={() => { setHover(false); mx.set(0.5); my.set(0.5); }}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
