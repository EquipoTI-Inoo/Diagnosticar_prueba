import { fichaSlugs, getFicha } from "@/content/conversion";
import { imagenOg } from "@/lib/og";
import { formatPEN } from "@/lib/utils";

/** Imagen OG de cada ficha en una URL estable (/servicios/{slug}/og.png), generada en build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return fichaSlugs.map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const f = getFicha((await params).slug)!;
  const s = f.servicio;
  return imagenOg({
    eyebrow: "Planes y precios",
    titulo: `${s.nombre}: ${s.tagline.charAt(0).toLowerCase()}${s.tagline.slice(1)}`,
    dato: s.precio.actual !== null ? formatPEN(s.precio.actual) : undefined,
  });
}
