/**
 * Imágenes Open Graph (1200×630) generadas en build con next/og. Fondo tinta de la marca,
 * logo real (derivado del PNG oficial), titular en Archivo 800 y datos en JetBrains Mono.
 * Fuentes TTF en assets/og (instancias de las mismas familias del sitio, OFL).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { negocio } from "@/content/negocio";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const A = (f: string) => readFileSync(join(process.cwd(), "assets/og", f));
const logo = `data:image/png;base64,${A("logo-dark-360.png").toString("base64")}`;

export function imagenOg({
  eyebrow,
  titulo,
  dato,
}: {
  eyebrow: string;
  titulo: string;
  dato?: string;
}) {
  const largo = titulo.length;
  const tam = largo > 70 ? 54 : largo > 45 ? 64 : 78;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px",
        backgroundColor: "#0B1214",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: "#F4F5F3",
        borderTop: "10px solid #04ADBF",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={216} height={115} alt="" />
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains",
            fontSize: 22,
            color: "#9AA6A8",
            letterSpacing: 2,
          }}
        >
          {negocio.lema.toUpperCase()}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains",
            fontSize: 24,
            color: "#04ADBF",
            letterSpacing: 3,
          }}
        >
          {eyebrow.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo",
            fontSize: tam,
            lineHeight: 1.02,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {titulo}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontFamily: "JetBrains",
          fontSize: 24,
          color: "#9AA6A8",
          borderTop: "1px solid rgba(255,255,255,0.14)",
          paddingTop: 22,
        }}
      >
        <div style={{ display: "flex" }}>
          diagnosticarperu.com · WhatsApp {negocio.whatsapp.display}
        </div>
        {dato ? (
          <div style={{ display: "flex", color: "#F4F5F3", fontSize: 34 }}>{dato}</div>
        ) : null}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: A("archivo-800-87.ttf"), weight: 800, style: "normal" },
        { name: "JetBrains", data: A("jetbrains-500.ttf"), weight: 500, style: "normal" },
      ],
    },
  );
}
