import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Las redirecciones 301 de la §4 se agregan en la Fase 5.
};

export default nextConfig;
