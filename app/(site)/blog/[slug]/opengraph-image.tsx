import { articulo, articulos, fechaLarga } from "@/lib/blog";
import { imagenOg, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Artículo del blog de DiagnostiCAR";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return articulos().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = articulo((await params).slug)!;
  return imagenOg({ eyebrow: `Blog · ${a.categoria} · ${fechaLarga(a.fecha)}`, titulo: a.titulo });
}
