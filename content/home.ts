/**
 * Copy de la Home (§5.1 del prompt maestro). Escrito a mano: es copy, no datos.
 * Las cifras, precios y nombres se leen de negocio.ts / servicios.ts / problemas.ts…
 * Las frases marcadas «provisional» son redacción propia (ver DECISIONES.md).
 */
import { z } from "zod";

const texto = z.string().min(1);

export const home = z
  .object({
    seo: z.object({ title: texto, description: texto.max(155) }),
    hero: z.object({
      eyebrow: texto,
      h1Linea1: texto,
      h1Linea2: texto,
      subtitulo: texto,
      ctaPrimario: texto,
      ctaSecundario: texto,
      fotoPie: texto,
      verVideo: texto,
    }),
    consultaPlaca: z.object({
      titulo: texto,
      texto: texto,
      boton: texto,
      ayuda: texto,
      exito: texto,
    }),
    problemas: z.object({ titulo: texto, subtitulo: texto, cta: texto }),
    comparador: z.object({ eyebrow: texto, titulo: texto, tituloAcento: texto, texto: texto }),
    planes: z.object({
      eyebrow: texto,
      titulo: texto,
      tituloAcento: texto,
      nota: texto,
      comparar: texto,
    }),
    etapas: z.object({ eyebrow: texto, titulo: texto }),
    pasos: z.object({ eyebrow: texto, titulo: texto, tituloAcento: texto }),
    tecnologia: z.object({
      eyebrow: texto,
      titulo: texto,
      texto: texto,
      lista: z.array(texto).length(3),
      enlace: texto,
      aliados: texto,
    }),
    confianza: z.object({
      eyebrow: texto,
      titulo: texto,
      tituloAcento: texto,
      items: z
        .array(
          z.object({
            id: z.enum(["tecnicos", "equipos", "informes", "atencion"]),
            titulo: texto,
            subtitulo: texto,
          }),
        )
        .length(4),
    }),
    social: z.object({
      eyebrow: texto,
      titulo: texto,
      verResenas: texto,
      medios: texto,
      automovilismo: texto,
    }),
    tips: z.object({ eyebrow: texto, titulo: texto, nota: texto }),
    faq: z.object({ eyebrow: texto, titulo: texto, verTodas: texto }),
    ctaFinal: z.object({
      titulo: texto,
      tituloAcento: texto,
      primario: texto,
      secundario: texto,
      mensajeConsejos: texto,
    }),
  })
  .parse({
    seo: {
      title: "Diagnóstico pre-compra a domicilio",
      description:
        "Revisamos la historia legal y el estado real del auto usado antes de que lo compres. A domicilio en Lima, con escáneres profesionales y un veredicto claro.",
    },
    hero: {
      eyebrow: "Diagnóstico vehicular pre-compra a domicilio · Lima",
      h1Linea1: "Revisa antes de decidir.",
      h1Linea2: "Las máquinas no mienten.",
      subtitulo:
        "Vamos a donde está el auto, revisamos su historia legal y su estado real con equipos profesionales, y te damos un veredicto claro antes de que pagues.",
      ctaPrimario: "Agendar diagnóstico",
      ctaSecundario: "Ver planes y precios",
      fotoPie: "Equipo DiagnostiCAR",
      verVideo: "Ver cómo trabajamos",
    },
    consultaPlaca: {
      titulo: "Consulta gratis por placa",
      texto: "Te decimos si el SOAT y la Revisión Técnica están vigentes, sin costo.",
      boton: "Consultar gratis SOAT y Revisión Técnica",
      // provisional: aún no hay endpoint, la consulta sigue por WhatsApp (§5.1).
      ayuda: "Te respondemos por WhatsApp con el resultado.",
      exito: "Listo. Abrimos WhatsApp con tu placa para enviarte el resultado.",
    },
    problemas: {
      titulo: "Los problemas más comunes que encontramos",
      subtitulo: "Frecuencia real sobre los vehículos que hemos revisado.",
      cta: "¿Cómo evitarlos?",
    },
    comparador: {
      eyebrow: "Comprar con o sin diagnóstico",
      // provisional
      titulo: "Lo que dice el vendedor contra",
      tituloAcento: "lo que dicen los datos.",
      texto: "Mismo auto, dos formas de comprarlo.",
    },
    planes: {
      eyebrow: "Planes y precios",
      titulo: "Elige cuánto quieres saber",
      tituloAcento: "antes de comprar.",
      nota: "Programa tu cita con el 50 % del servicio. Aplican términos y condiciones.",
      comparar: "Comparar todo en tabla",
    },
    etapas: { eyebrow: "Por dónde empezar", titulo: "¿En qué etapa estás?" },
    pasos: {
      eyebrow: "Cómo funciona",
      titulo: "De la duda al veredicto,",
      tituloAcento: "en 4 pasos.",
    },
    tecnologia: {
      eyebrow: "Tecnología",
      titulo: "Un solo escáner no puede detectarlo todo.",
      texto:
        "Ningún escáner lee todos los códigos de falla de todas las marcas, modelos y años. Por eso tenemos 6 escáneres profesionales y llevamos a tu cita el más adecuado para tu auto: homologado y capaz de detectar alteraciones del kilometraje.",
      lista: [
        "Escaneo profesional de motor, caja, airbags y ABS",
        "Escaneo electromagnético de carrocería para detectar choques no declarados",
        "Videoscopía completa del vehículo",
      ],
      enlace: "Conoce nuestros equipos",
      aliados: "Equipos de",
    },
    confianza: {
      eyebrow: "Por qué DiagnostiCAR",
      titulo: "Confianza técnica,",
      tituloAcento: "no promesas vacías.",
      items: [
        { id: "tecnicos", titulo: "Técnicos certificados", subtitulo: "y con experiencia" },
        { id: "equipos", titulo: "Equipos profesionales", subtitulo: "de última generación" },
        { id: "informes", titulo: "Informes claros", subtitulo: "y con fotos" },
        { id: "atencion", titulo: "Atención rápida", subtitulo: "y flexible" },
      ],
    },
    social: {
      eyebrow: "Reseñas",
      titulo: "Lo que dicen nuestros clientes",
      verResenas: "Ver reseñas en Google",
      medios: "Estamos en los medios",
      automovilismo: "Apoyamos el automovilismo",
    },
    tips: {
      eyebrow: "Videos",
      titulo: "Tips antes de comprar",
      nota: "Se abren en Instagram.",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      titulo: "Lo que más nos preguntan",
      verTodas: "Ver todas las preguntas",
    },
    ctaFinal: {
      titulo: "¿Listo para tomar la mejor decisión?",
      tituloAcento: "Estamos para ayudarte.",
      primario: "Agendar diagnóstico",
      secundario: "Quiero recibir consejos gratis",
      mensajeConsejos: "Hola, quiero recibir consejos y ayuda gratis antes de comprar mi auto",
    },
  });
