/**
 * Esquemas Zod del contenido del sitio.
 *
 * Cada archivo de `/content` valida sus datos contra estos esquemas al cargarse,
 * así que un dato mal formado rompe `npm run build` en lugar de llegar a producción.
 * Los tipos exportados son los que consumen los componentes (y, en el futuro, el CMS).
 */
import { z } from "zod";

/** Marcador literal para datos que debe entregar el cliente (regla 1 del prompt maestro). */
export const PENDIENTE = "[PENDIENTE CLIENTE]" as const;
/** Marcador para cifras que existen en la fuente pero deben confirmarse antes de publicar. */
export const CONFIRMAR = "[CONFIRMAR CLIENTE]" as const;

const texto = z.string().min(1);
const url = z.url();

/** Imagen local en `/public`. `alt` sale del sitio original cuando existe. */
export const imagenSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string(),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
  /** Fondo que necesita el archivo (p. ej. un logo blanco con transparencia → "oscuro"). */
  fondo: z.enum(["claro", "oscuro"]).optional(),
  /**
   * Pie de foto honesto: `tipo` dice qué es la imagen (p. ej. «Fotograma de video»),
   * `texto` qué muestra. Sin fechas ni datos que no estén en la fuente.
   */
  pie: z.object({ tipo: z.string().min(1), texto: z.string().optional() }).optional(),
  /** `object-position` para recortar (p. ej. ocultar subtítulos quemados abajo). */
  posicion: z.string().optional(),
  /**
   * Zoom de recorte (≥ 1) con origen en `posicion`: deja fuera bordes con texto quemado
   * (subtítulos, captions) sin editar el archivo. 1.25 = se ve el 80 % del encuadre.
   */
  escala: z.number().min(1).max(2).optional(),
});
export type Imagen = z.infer<typeof imagenSchema>;

/** Cifra mostrable: `valor` para animar contadores y `display` tal como se publica. */
export const metricaSchema = z.object({
  valor: z.number(),
  display: texto,
  etiqueta: texto,
  /** Origen de la cifra o variantes contradictorias del sitio actual (ver PENDIENTES.md). */
  notaFuente: z.string().optional(),
  confirmar: z.boolean().default(false),
});
export type Metrica = z.infer<typeof metricaSchema>;

export const negocioSchema = z.object({
  marca: texto,
  razonSocial: texto,
  ruc: z.string().regex(/^\d{11}$/),
  partidaRegistral: texto,
  sitio: url,
  queEs: texto,
  lema: texto,
  direccion: z.object({
    calle: texto,
    distrito: texto,
    ciudad: texto,
    pais: z.literal("PE"),
    codigoPostal: texto,
    referencia: texto,
    geo: z.object({ lat: z.number(), lng: z.number() }),
  }),
  whatsapp: z.object({
    /** Solo dígitos con código de país, para `wa.me`. */
    numero: z.string().regex(/^51\d{9}$/),
    display: texto,
  }),
  telefono: z.object({ e164: z.string().regex(/^\+51\d{9}$/), display: texto }),
  email: texto,
  /** Email que aparece en T&C (dominio distinto). Solo referencia interna: no publicar. */
  emailReferenciaInterna: z.string().optional(),
  horario: z.object({ dias: texto, horas: texto }),
  redes: z.object({
    instagram: z.object({ url, usuario: texto }),
    youtube: z.object({ url, usuario: texto }),
    facebook: z.object({ url }),
    tiktok: z.object({ url, usuario: texto }),
    grupoFacebook: z.object({ nombre: texto, url: texto }),
  }),
  metricas: z.object({
    diagnosticos: metricaSchema,
    rating: metricaSchema,
    resenas: metricaSchema,
    anios: metricaSchema,
    independencia: metricaSchema,
    leadsDiarios: metricaSchema,
    seguidores: metricaSchema,
  }),
  aliados: z.array(
    z.object({ nombre: texto, rol: texto, logo: imagenSchema.optional(), vigente: z.boolean() }),
  ),
  medios: z.array(z.object({ nombre: texto, logo: imagenSchema, url: texto })),
  automovilismo: z.array(z.object({ nombre: texto, logo: imagenSchema })),
  tecnologia: z.array(texto),
  reserva: z.object({ adelantoPorcentaje: z.number(), texto: texto, mediosDePago: texto }),
});
export type Negocio = z.infer<typeof negocioSchema>;

export const servicioSlugs = [
  "antecedentes-basico",
  "antecedentes-completo",
  "diagnostico-basico",
  "diagnosticar",
  "diagnosticar-plus",
  "asesoria-precompra-online",
  "certifica-tu-auto",
] as const;
export const servicioSlugSchema = z.enum(servicioSlugs);
export type ServicioSlug = z.infer<typeof servicioSlugSchema>;

export const precioSchema = z.object({
  /** Precio vigente en soles. `null` = pendiente del cliente. */
  actual: z.number().int().positive().nullable(),
  /** Precio anterior (tachado). */
  antes: z.number().int().positive().nullable(),
  moneda: z.literal("PEN"),
  /** `true` si hay versiones contradictorias o falta confirmar (IGV, etc.). */
  porConfirmar: z.boolean(),
  nota: z.string().optional(),
});
export type Precio = z.infer<typeof precioSchema>;

export const servicioSchema = z.object({
  slug: servicioSlugSchema,
  nombre: texto,
  /** Nombre para el mensaje prellenado de WhatsApp. */
  nombreWhatsapp: texto,
  href: z.string().startsWith("/"),
  tipo: z.enum(["antecedentes", "inspeccion", "asesoria", "certificacion"]),
  tagline: z.string(),
  badge: z.string().optional(),
  destacado: z.boolean(),
  /** Aparece en la escalera de 5 planes de la home/comparativa. */
  enEscalera: z.boolean(),
  precio: precioSchema,
  /** Bullets cortos para la tarjeta de plan. */
  resumen: z.array(texto).min(1),
  /** Lista completa para la ficha («Todo lo que revisamos»). */
  detalle: z.array(texto).min(1),
  nota: z.string().optional(),
  urlActual: z.array(z.string().startsWith("/")),
});
export type Servicio = z.infer<typeof servicioSchema>;

export const faqCategorias = ["servicio", "reserva-pagos", "certificacion", "alcances"] as const;
export const faqSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  categoria: z.enum(faqCategorias),
  pregunta: texto,
  respuesta: texto,
  enHome: z.boolean(),
});
export type Faq = z.infer<typeof faqSchema>;

export const testimonioSchema = z.object({
  id: z.string(),
  autor: z.string().nullable(),
  fuente: z.enum(["google", "sitio-anterior"]),
  texto: texto,
  /** Permiso de uso confirmado por el cliente. */
  permisoConfirmado: z.boolean(),
});
export type Testimonio = z.infer<typeof testimonioSchema>;

export const problemaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: texto,
  detalle: z.string().optional(),
  casos: z.number().int().positive(),
  base: z.number().int().positive(),
  imagen: imagenSchema,
  /** La foto muestra el hallazgo en sí (no solo al equipo). */
  muestraHallazgo: z.boolean(),
});
export type Problema = z.infer<typeof problemaSchema>;

export const pasoSchema = z.object({
  numero: z.string().regex(/^\d{2}$/),
  titulo: texto,
  texto: texto,
});
export type Paso = z.infer<typeof pasoSchema>;

export const navItemSchema = z.object({
  label: texto,
  href: z.string().startsWith("/"),
  descripcion: z.string().optional(),
  /** El enlace es un CTA de WhatsApp (reserva) en vez de una página. */
  whatsapp: z.boolean().optional(),
});
export type NavItem = z.infer<typeof navItemSchema>;
