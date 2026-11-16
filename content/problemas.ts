/**
 * Problemas más comunes encontrados (frecuencia sobre autos revisados).
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";
import { problemaSchema, type Problema } from "./schema";

export const problemasFuente = "Informes propios 2024-2026";

export const problemas: Problema[] = z.array(problemaSchema).parse([
  {
    slug: "fugas-de-aceite",
    titulo: "Fugas de aceite",
    casos: 8,
    base: 10,
    imagen: {
      src: "/img/clave/fugas-aceite.jpg",
      alt: "Fuga de aceite real detectada en diagnóstico de DiagnostiCAR",
      ancho: 960,
      alto: 600,
      pie: {
        tipo: "Hallazgo real",
        texto: "Fuga de aceite señalada",
      },
    },
    muestraHallazgo: true,
  },
  {
    slug: "problemas-documentarios",
    titulo: "Problemas documentarios",
    detalle: "Garantías, papeletas, robo, pérdida total",
    casos: 6,
    base: 10,
    imagen: {
      src: "/img/clave/problemas-documentarios.jpg",
      alt: "Técnico de DiagnostiCAR hablando a cámara junto a un auto rojo (fotograma de video)",
      ancho: 960,
      alto: 600,
      pie: {
        tipo: "Fotograma de video",
        texto: "Equipo DiagnostiCAR",
      },
      posicion: "50% 0%",
      escala: 1.2,
    },
    muestraHallazgo: false,
  },
  {
    slug: "choques-ocultos",
    titulo: "Choques ocultos",
    casos: 6,
    base: 10,
    imagen: {
      src: "/img/clave/choques-ocultos.jpg",
      alt: "Dos técnicos de DiagnostiCAR sentados conversando en una oficina (fotograma de video)",
      ancho: 960,
      alto: 600,
      pie: {
        tipo: "Fotograma de video",
        texto: "Equipo DiagnostiCAR",
      },
      posicion: "50% 30%",
    },
    muestraHallazgo: false,
  },
  {
    slug: "kilometraje-bajado",
    titulo: "Kilometraje bajado",
    casos: 4,
    base: 10,
    imagen: {
      src: "/img/clave/kilometraje-llanta.jpg",
      alt: "Primer plano de una llanta con barro durante una revisión (fotograma de video, recortado)",
      ancho: 360,
      alto: 268,
      pie: {
        tipo: "Fotograma de video",
        texto: "Llanta durante una revisión (recortado)",
      },
    },
    muestraHallazgo: false,
  },
  {
    slug: "airbags-reventados",
    titulo: "Airbags reventados",
    casos: 3,
    base: 10,
    imagen: {
      src: "/img/clave/airbag-motor.jpg",
      alt: "Cubierta del motor de un auto durante una inspección (fotograma de video, recortado)",
      ancho: 360,
      alto: 262,
      pie: {
        tipo: "Fotograma de video",
        texto: "Vano motor durante una inspección (recortado)",
      },
    },
    muestraHallazgo: false,
  },
  {
    slug: "motor-o-caja-reparados",
    titulo: "Motor o caja reparados",
    casos: 2,
    base: 10,
    imagen: {
      src: "/img/clave/motor-reparado.jpg",
      alt: "Inspección con videoscopio detecta intervención previa en motor",
      ancho: 960,
      alto: 600,
      pie: {
        tipo: "Hallazgo real",
        texto: "Inspección con videoscopio",
      },
      posicion: "50% 0%",
      escala: 1.25,
    },
    muestraHallazgo: true,
  },
  {
    slug: "carros-clonados",
    titulo: "Carros clonados",
    casos: 1,
    base: 1000,
    imagen: {
      src: "/img/clave/carros-clonados.jpg",
      alt: "Comparación de placas idénticas en caso real de vehículo clonado",
      ancho: 960,
      alto: 600,
      pie: {
        tipo: "Fotograma de video",
        texto: "Dos autos con la misma placa",
      },
      posicion: "50% 0%",
    },
    muestraHallazgo: true,
  },
]);
