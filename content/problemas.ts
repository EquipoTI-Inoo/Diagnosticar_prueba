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
    },
  },
  {
    slug: "problemas-documentarios",
    titulo: "Problemas documentarios",
    detalle: "Garantías, papeletas, robo, pérdida total",
    casos: 6,
    base: 10,
    imagen: {
      src: "/img/clave/problemas-documentarios.jpg",
      alt: "Técnico de DiagnostiCAR explicando antecedentes documentarios del vehículo",
      ancho: 960,
      alto: 600,
    },
  },
  {
    slug: "choques-ocultos",
    titulo: "Choques ocultos",
    casos: 6,
    base: 10,
    imagen: {
      src: "/img/clave/choques-ocultos.jpg",
      alt: "Técnicos de DiagnostiCAR detectando daño estructural oculto",
      ancho: 960,
      alto: 600,
    },
  },
  {
    slug: "kilometraje-bajado",
    titulo: "Kilometraje bajado",
    casos: 4,
    base: 10,
    imagen: {
      src: "/img/clave/kilometraje200k.jpg",
      alt: "Kilometraje real distinto al mostrado en el odómetro",
      ancho: 360,
      alto: 640,
    },
  },
  {
    slug: "airbags-reventados",
    titulo: "Airbags reventados",
    casos: 3,
    base: 10,
    imagen: {
      src: "/img/clave/airbag.jpg",
      alt: "Airbag detonado no informado por el vendedor",
      ancho: 360,
      alto: 640,
    },
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
    },
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
    },
  },
]);
