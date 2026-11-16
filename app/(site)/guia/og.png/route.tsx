import { paginaGuia } from "@/content/educativo";
import { imagenOg } from "@/lib/og";

/** Imagen OG de la guía en una URL estable (/guia/og.png). */
export const dynamic = "force-static";

export function GET() {
  return imagenOg({ eyebrow: "Guía de compra 2026", titulo: paginaGuia.h1.replace(/\s*\(guía 2026\)$/, "") });
}
