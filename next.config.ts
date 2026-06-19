import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// This repo nests multiple pnpm lockfiles, so Turbopack's automatic
// workspace-root detection guesses wrong. Pin it to this project directory.
const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Security headers applied to every route.
 * CSP is intentionally omitted here for now — a 3D + Shopify app needs a
 * carefully tuned policy (blob:/data: workers for Three.js, Shopify domains),
 * which we'll add once the asset domains are finalized.
 */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  turbopack: {
    root: projectRoot,
  },

  images: {
    // Shopify product imagery is served from its CDN.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Pre-bundle heavy 3D libs so route chunks stay lean.
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "@react-three/fiber"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
