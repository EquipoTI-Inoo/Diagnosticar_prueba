import { articulo, articulos, fechaLarga } from "@/lib/blog";
import { imagenOg } from "@/lib/og";

/**
 * Portada OG de cada artículo en una URL estable (/blog/{slug}/og.png), generada en build.
 * La usan og:image y la propiedad `image` del BlogPosting.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return articulos().map((a) => ({ slug: a.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const a = articulo((await params).slug)!;
  return imagenOg({ eyebrow: `Blog · ${a.categoria} · ${fechaLarga(a.fecha)}`, titulo: a.titulo });
}
