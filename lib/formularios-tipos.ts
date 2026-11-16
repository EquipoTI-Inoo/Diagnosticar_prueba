/** Tipos y estado de los formularios (sin dependencias: se usan en el cliente). */
export type CampoError = Record<string, string>;

export type EstadoFormulario = {
  estado: "inicial" | "ok" | "error";
  /** Errores por campo (solo en «error» de validación). */
  errores?: CampoError;
  /** Error general (fallo al guardar). */
  mensaje?: string;
  /** Enlace a WhatsApp prellenado (éxito o fallback). */
  whatsapp?: string;
  /** Valores enviados, para repoblar el formulario sin JS. */
  valores?: Record<string, string>;
};

export const estadoInicial: EstadoFormulario = { estado: "inicial" };

/** Mensajes de error compartidos por la validación ligera del cliente y el esquema Zod del servidor. */
export const MSG = {
  placaVacia: "Ingresa la placa del auto.",
  placaFormato: "Revisa la placa: debe tener el formato ABC-123.",
  celularVacio: "Ingresa tu celular.",
  celularFormato: "El celular debe tener 9 dígitos y empezar con 9.",
  acepta: "Acepta la política de privacidad para continuar.",
  nombre: "Ingresa tu nombre.",
  nombreLargo: "El nombre es muy largo.",
  correoVacio: "Ingresa tu correo.",
  correoFormato: "Revisa el correo: debe tener el formato nombre@dominio.com.",
  mensajeCorto: "Cuéntanos un poco más (mínimo 10 caracteres).",
  mensajeLargo: "El mensaje es muy largo (máximo 1000 caracteres).",
} as const;
