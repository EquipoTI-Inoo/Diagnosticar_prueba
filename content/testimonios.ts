/**
 * Reseñas de clientes (texto literal; permiso de uso pendiente).
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";
import { testimonioSchema, type Testimonio } from "./schema";

export const testimonios: Testimonio[] = z.array(testimonioSchema).parse([
  {
    id: "omar-carruitero",
    autor: "Omar Carruitero",
    fuente: "google",
    texto:
      "Es un servicio indispensable para la compra de vehículos seminuevos en mi caso me ha librado de compras desastrosas Súper recomendado un servicio de calidad no cabe duda",
    permisoConfirmado: false,
  },
  {
    id: "walther-panduro",
    autor: "Walther Panduro",
    fuente: "google",
    texto:
      "Excelente el Servicio de diagnóstico vehicular evitó que fuera estafado si compraba a ciegas",
    permisoConfirmado: false,
  },
  {
    id: "rafael-guinassi",
    autor: "Rafael Guinassi",
    fuente: "google",
    texto: "Excelente servicio, a tiempo, los reportes muy valiosos y de gran ayuda",
    permisoConfirmado: false,
  },
  {
    id: "giancarlo-rodolfo-hilari-fernandez",
    autor: "Giancarlo Rodolfo Hilari Fernández",
    fuente: "google",
    texto: "Excelente trabajo y detalle",
    permisoConfirmado: false,
  },
  {
    id: "alvaro-suarez",
    autor: "Alvaro Suarez",
    fuente: "google",
    texto: "Excelente servicio",
    permisoConfirmado: false,
  },
  {
    id: "julio-ramirez",
    autor: "Julio Ramirez",
    fuente: "sitio-anterior",
    texto:
      "Me recomendaron este servicio y fue lo mejor que pude hacer. Casi compro un carro con el KM totalmente alterado y que me había convencido por el precio. La verdad lo recomiendo totalmente, en unas horas puedes tener la seguridad de estar haciendo una buena compra y cuidas tu inversión.",
    permisoConfirmado: false,
  },
  {
    id: "luis-delgado",
    autor: "Luis Delgado",
    fuente: "sitio-anterior",
    texto:
      "Estaba muy preocupado por comprar un auto de segunda que me gustó mucho, pudieron identificar que el carro que iba a comprar era un carro siniestrado, bastantes profesionales a la hora de realizar el diagnóstico.",
    permisoConfirmado: false,
  },
  {
    id: "anonimo-8",
    autor: null,
    fuente: "sitio-anterior",
    texto:
      "Nunca he sabido nada de mecánica, tampoco conocía taller de confianza. Diagnosticar se encargó de la revisión de mi Suzuki y la experiencia fue maravillosa. Ahora son mi taller de confianza",
    permisoConfirmado: false,
  },
  {
    id: "anonimo-9",
    autor: null,
    fuente: "sitio-anterior",
    texto:
      "El servicio fue excelente desde el principio, pude estar presente durante la revisión del vehículo y quedé sorprendido con el nivel de detalle de las revisiones y el reporte final. Definitivamente volvería a contratarlos.",
    permisoConfirmado: false,
  },
  {
    id: "anonimo-10",
    autor: null,
    fuente: "sitio-anterior",
    texto:
      "Los dos primeros autos que diagnosticamos tenían problemas serios. Gracias a Diagnosticar compramos el tercero, estando convencidos al 100% de que fue la mejor inversión",
    permisoConfirmado: false,
  },
]);

/** Solo reseñas con nombre (Google): las que se muestran en la home. */
export const testimoniosConNombre = testimonios.filter((t) => t.autor !== null);
