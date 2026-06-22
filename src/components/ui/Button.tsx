"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost";
};

/**
 * Reusable button. `primary` = solid pink CTA, `ghost` = bordered/transparent.
 * Built on framer-motion for subtle press / hover feedback.
 */
export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-brand-soft text-white hover:bg-brand"
      : "border border-white/30 text-white hover:bg-white/10";

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-medium uppercase tracking-widest transition-colors ${styles} ${className ?? ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
