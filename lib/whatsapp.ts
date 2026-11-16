import { negocio } from "@/content/negocio";
import { mensajeConsultaPlaca, waUrl } from "./wa";

/** Mensaje base del §3: «Hola, quiero reservar mi diagnóstico {Servicio}». */
export function mensajeReserva(servicio?: string): string {
  return servicio
    ? `Hola, quiero reservar mi diagnóstico ${servicio}`
    : "Hola, quiero reservar mi diagnóstico";
}

/** Enlace `wa.me` con texto prellenado (codificado). */
export function waHref(texto: string = mensajeReserva()): string {
  return waUrl(negocio.whatsapp.numero, texto);
}

export function waReserva(servicio?: string): string {
  return waHref(mensajeReserva(servicio));
}

export function waConsultaPlaca(placa: string): string {
  return waHref(mensajeConsultaPlaca(placa));
}
