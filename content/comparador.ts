/**
 * Comparador «Sin diagnóstico / Con DiagnostiCAR» (§5.1.4).
 * Copy curado a mano; cada frase se apoya en el scrape:
 * - Papeletas: /guia/ («en las notarías SÓLO VISUALIZAN LAS PAPELETAS DE LIMA Y EL CALLAO») y
 *   /revision-antecedes-boost/ («Las notarías de Lima sólo revisan Papeletas de Lima y el Callao»).
 * - Papeletas nacionales, SUTRAN y ATU: servicios[Antecedentes Completo].incluye_detalle.
 * - Escáner, partida y carrocería: negocio.tecnologia y servicios.
 * - Kilometraje: blog «Cuidado con el kilometraje» (desgaste de volante, pedales y asiento).
 */
import { z } from "zod";

const ladoSchema = z.object({ etiqueta: z.string(), items: z.array(z.string().min(1)).min(1) });

export const comparador = z.object({ sin: ladoSchema, con: ladoSchema }).parse({
  sin: {
    etiqueta: "Sin diagnóstico",
    items: [
      "Confías en lo que dice el vendedor.",
      "Descubres las papeletas de provincia después de la notaría (las notarías solo ven Lima y Callao).",
      "El kilometraje es el que marca el tablero.",
    ],
  },
  con: {
    etiqueta: "Con DiagnostiCAR",
    items: [
      "Datos de escáner, partida registral y escaneo de carrocería.",
      "Papeletas a nivel nacional, SUTRAN y ATU.",
      "Kilometraje contrastado con el escáner y el desgaste del auto.",
    ],
  },
});
