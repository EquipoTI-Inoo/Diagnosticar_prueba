import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/seo";
import { indexable } from "@/lib/site";

/**
 * robots.txt (§8). Solo con SITE_ENV=production se permite indexar; en cualquier otro entorno
 * (preview, local) se bloquea todo. Los bots de IA listados en la §8 se permiten de forma
 * explícita (decisión del cliente; por defecto, permitir).
 */
export const BOTS_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/design-system", "/api/"] },
      { userAgent: [...BOTS_IA], allow: "/", disallow: ["/design-system"] },
    ],
    sitemap: `${SITIO}/sitemap.xml`,
    host: SITIO,
  };
}
