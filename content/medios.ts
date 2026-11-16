/**
 * Videos y fotos de la home (tips, video explicativo, fotos de confianza).
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";
import { imagenSchema } from "./schema";

export const medios = z
  .object({
    tips: z
      .array(z.object({ titulo: z.string(), url: z.url(), miniatura: imagenSchema }))
      .length(3),
    youtube: z.object({ id: z.string().regex(/^[\w-]{11}$/), titulo: z.string() }),
    confianza: z.record(z.enum(["tecnicos", "equipos", "informes", "atencion"]), imagenSchema),
  })
  .parse({
    tips: [
      {
        titulo: "Sus respuestas nos hicieron dudar",
        url: "https://www.instagram.com/reel/DemfLhmheE8/",
        miniatura: {
          src: "/img/clave/reco1-frame.jpg",
          alt: "Sus respuestas nos hicieron dudar",
          alto: 598,
          ancho: 414,
          posicion: "0% 0%",
          escala: 1.4,
          pie: {
            tipo: "Reel de Instagram",
          },
        },
      },
      {
        titulo: "La facilidad de bajar el kilometraje",
        url: "https://www.instagram.com/reel/DWxZeoKBUyk/",
        miniatura: {
          src: "/img/clave/reco2-frame.jpg",
          alt: "La facilidad de bajar el kilometraje",
          alto: 598,
          ancho: 414,
          posicion: "0% 0%",
          escala: 1.4,
          pie: {
            tipo: "Reel de Instagram",
          },
        },
      },
      {
        titulo: "¿Puedes detectar un daño estructural?",
        url: "https://www.instagram.com/reel/DUPLabvDgcL/",
        miniatura: {
          src: "/img/clave/reco3-frame.jpg",
          alt: "¿Puedes detectar un daño estructural?",
          alto: 600,
          ancho: 960,
          pie: {
            tipo: "Reel de Instagram",
          },
        },
      },
    ],
    youtube: {
      id: "Wqtfs4rwgoE",
      titulo: "Video explicativo del servicio",
    },
    confianza: {
      tecnicos: {
        src: "/img/clave/asi-trabajamos-frame2.jpg",
        alt: "Equipo de escaneo profesional usado en la inspección vehicular",
        alto: 600,
        ancho: 960,
        pie: {
          tipo: "Fotograma de video",
          texto: "Equipo DiagnostiCAR",
        },
      },
      equipos: {
        src: "/img/clave/motor-reparado.jpg",
        alt: "Inspección con videoscopio detecta intervención previa en motor",
        alto: 600,
        ancho: 960,
        pie: {
          tipo: "Hallazgo real",
          texto: "Inspección con videoscopio",
        },
        posicion: "50% 0%",
        escala: 1.25,
      },
      informes: {
        src: "/img/informe/informe-pagina-02.webp",
        alt: "Página de un informe DiagnostiCAR con el puntaje por sistema: seguridad, frenos, motor, escaneo, suspensión y más (placa de ejemplo)",
        ancho: 1287,
        alto: 910,
        pie: {
          tipo: "Informe de ejemplo",
          texto: "2022 · placa de ejemplo",
        },
      },
      atencion: {
        src: "/img/clave/IMG_5446.webp",
        alt: "Dos camionetas con la marca DiagnostiCAR estacionadas en la calle",
        ancho: 1024,
        alto: 512,
        pie: {
          tipo: "Foto",
          texto: "Unidades móviles DiagnostiCAR",
        },
      },
    },
  });
