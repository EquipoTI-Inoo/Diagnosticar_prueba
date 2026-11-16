import type { NextConfig } from "next";
import { REDIRECCIONES } from "./lib/redirecciones";
import { redireccionesBlog } from "./lib/redirecciones-blog";

/**
 * Redirecciones 301 de la §4 (tabla completa en docs/REDIRECTS.md). Las URLs antiguas llevan
 * barra final; se registran con y sin ella para que respondan con UN solo 301. Los 410 y la
 * normalización genérica de la barra final los resuelve middleware.ts.
 */
function variantes(origen: string): string[] {
  const codificada = encodeURI(origen);
  const sinBarra = codificada.replace(/\/$/, "") || "/";
  return [...new Set([codificada, sinBarra])];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Entorno visible también en el cliente (badge [PENDIENTE CLIENTE]): ver lib/entorno.ts.
  env: { NEXT_PUBLIC_SITE_ENV: process.env.SITE_ENV === "production" ? "production" : "preview" },
  poweredByHeader: false,
  // La barra final se normaliza en middleware.ts con 301 (no 308), después de estas
  // redirecciones: así cada URL antigua responde con un único 301 directo a su destino.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [...REDIRECCIONES, ...redireccionesBlog()].flatMap(({ origen, destino }) =>
      variantes(origen)
        .filter((source) => source !== destino) // «/servicios/» → «/servicios»: solo la variante con barra
        .map((source) => ({ source, destination: destino, statusCode: 301 as const })),
    );
  },
};

export default nextConfig;
