import { fichaSlugs, getFicha } from "@/content/conversion";
import { imagenOg, OG_SIZE, OG_TYPE } from "@/lib/og";
import { formatPEN } from "@/lib/utils";

export const alt = "Plan de diagnóstico vehicular de DiagnostiCAR";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return fichaSlugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const f = getFicha((await params).slug)!;
  const s = f.servicio;
  return imagenOg({
    eyebrow: "Planes y precios",
    titulo: `${s.nombre}: ${s.tagline.charAt(0).toLowerCase()}${s.tagline.slice(1)}`,
    dato: s.precio.actual !== null ? formatPEN(s.precio.actual) : undefined,
  });
}
