import type { Metadata, Viewport } from "next";
import { negocio } from "@/content/negocio";
import { indexable } from "@/lib/site";
import { archivo, interTight, jetbrains } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(negocio.sitio),
  title: {
    default: `Diagnóstico vehicular pre-compra a domicilio | ${negocio.marca} Lima`,
    template: `%s | ${negocio.marca} Lima`,
  },
  description:
    "Revisamos la historia legal y el estado real del auto usado que quieres comprar, a domicilio en Lima, con equipos profesionales.",
  // Solo se indexa con SITE_ENV=production (lib/site.ts); robots.txt sigue la misma regla (app/robots.ts).
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      }
    : { index: false, follow: false },
  openGraph: { type: "website", locale: "es_PE", siteName: negocio.marca },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B1214",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-PE"
      className={`${archivo.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
