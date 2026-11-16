import { NextResponse, type NextRequest } from "next/server";
import { RUTAS_ELIMINADAS } from "./lib/redirecciones";

/**
 * 410 Gone para las páginas basura del sitio WordPress (docs/REDIRECTS.md) y 301 de
 * normalización de barra final para cualquier otra ruta.
 * El matcher excluye estáticos para no tocar el resto del tráfico.
 */
export function middleware(req: NextRequest) {
  const ruta = req.nextUrl.pathname.replace(/\/$/, "");
  if (RUTAS_ELIMINADAS.has(ruta)) {
    return new NextResponse(
      '<!doctype html><html lang="es-PE"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página eliminada | DiagnostiCAR Lima</title></head><body style="font-family:system-ui;padding:2rem;max-width:40rem;margin:auto"><h1>Esta página ya no existe</h1><p>La retiramos de forma permanente.</p><p><a href="/servicios">Ver planes y precios</a> · <a href="/">Ir al inicio</a></p></body></html>',
      {
        status: 410,
        headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
      },
    );
  }
  // Normalización de barra final (skipTrailingSlashRedirect en next.config): 301, no 308.
  if (req.nextUrl.pathname.length > 1 && req.nextUrl.pathname.endsWith("/")) {
    // URL estándar (NextURL conserva la barra final al serializar).
    const url = new URL(req.url);
    url.pathname = ruta;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|img/|logos/|docs/|favicon|icon|apple-icon|.*\\.(?:png|jpg|webp|svg|pdf|txt|xml)$).*)",
  ],
};
