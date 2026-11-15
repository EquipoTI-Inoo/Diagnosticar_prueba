/**
 * Preguntas frecuentes agrupadas por categoría.
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";
import { faqSchema, type Faq } from "./schema";

export const faqCategoriaLabel: Record<Faq["categoria"], string> = {
  servicio: "Servicio",
  "reserva-pagos": "Reserva y pagos",
  certificacion: "Certificación",
  alcances: "Alcances técnicos",
};

export const faqs: Faq[] = z.array(faqSchema).parse([
  {
    id: "donde-hacen-los-diagnosticos",
    categoria: "servicio",
    pregunta: "¿Dónde hacen los diagnósticos?",
    respuesta: "Vamos a domicilio, a donde esté el vehículo, dentro de Lima Metropolitana.",
    enHome: true,
  },
  {
    id: "es-necesario-que-este-presente-en-el-diagnostico",
    categoria: "servicio",
    pregunta: "¿Es necesario que esté presente en el diagnóstico?",
    respuesta:
      "No es obligatorio. Podemos coordinar directamente con el vendedor y te enviamos el informe al terminar.",
    enHome: true,
  },
  {
    id: "cuanto-dura-un-diagnostico",
    categoria: "servicio",
    pregunta: "¿Cuánto dura un diagnóstico?",
    respuesta: "Entre 40 y 70 minutos, según el plan y el estado del vehículo.",
    enHome: true,
  },
  {
    id: "cuanto-tiempo-despues-recibo-el-resultado",
    categoria: "servicio",
    pregunta: "¿Cuánto tiempo después recibo el resultado?",
    respuesta:
      "El informe se entrega al terminar la revisión, con fotos y recomendaciones del técnico.",
    enHome: true,
  },
  {
    id: "que-incluye-el-plus-que-no-incluye-diagnosticar",
    categoria: "servicio",
    pregunta: "¿Qué incluye el Plus que no incluye DiagnostiCAR?",
    respuesta:
      "Escaneo láser de frenos y llantas, protección anticlonación, PaintSCAN Pro + TintSCAN Pro y reportes escritos adicionales.",
    enHome: true,
  },
  {
    id: "que-incluye-la-certificacion-de-diagnosticar",
    categoria: "certificacion",
    pregunta: "¿Qué incluye la certificación de DiagnostiCAR?",
    respuesta:
      "Revisión técnica completa (motor, suspensión, frenos, sistema eléctrico, computadora, etc.) y revisión documentaria (partida registral, papeletas, SOAT, revisiones técnicas, gravámenes, denuncias, entre otros).",
    enHome: false,
  },
  {
    id: "cuanto-tiempo-demora-el-proceso",
    categoria: "certificacion",
    pregunta: "¿Cuánto tiempo demora el proceso?",
    respuesta:
      "Entre 24 y 48 horas. Si hay disponibilidad, agendamos el diagnóstico el mismo día; la revisión en sí demora 45 minutos.",
    enHome: false,
  },
  {
    id: "tengo-que-firmar-contrato-o-dar-exclusividad",
    categoria: "certificacion",
    pregunta: "¿Tengo que firmar contrato o dar exclusividad?",
    respuesta: "No. Sin exclusividad, sin dejar tu auto, sin letras chicas.",
    enHome: false,
  },
  {
    id: "puedo-reprogramar",
    categoria: "reserva-pagos",
    pregunta: "¿Puedo reprogramar?",
    respuesta:
      "Sí, con al menos 48 horas de anticipación. Una vez agendada la cita no hay reembolsos, salvo que DiagnostiCAR incumpla; en ese caso lo resolvemos en 5 días.",
    enHome: false,
  },
  {
    id: "miden-compresion-del-motor",
    categoria: "alcances",
    pregunta: "¿Miden compresión del motor?",
    respuesta: "No; es un procedimiento invasivo y la mayoría de propietarios no lo autoriza.",
    enHome: false,
  },
  {
    id: "hacen-prueba-de-manejo",
    categoria: "alcances",
    pregunta: "¿Hacen prueba de manejo?",
    respuesta:
      "Solo si la pides, con autorización del propietario, en una ruta corta de máximo 20 minutos y si el auto cumple condiciones mínimas de seguridad.",
    enHome: false,
  },
  {
    id: "que-recibo-despues-del-diagnostico",
    categoria: "certificacion",
    pregunta: "¿Qué recibo después del diagnóstico?",
    respuesta:
      "Reportes completos y un sello digital con QR verificable para usar en tu publicación y dar más confianza a los compradores.",
    enHome: false,
  },
  {
    id: "me-ayudan-a-vender-el-auto",
    categoria: "certificacion",
    pregunta: "¿Me ayudan a vender el auto?",
    respuesta:
      "Sí. Te derivamos compradores reales que buscan autos ya certificados (300 a 400 leads diarios [CONFIRMAR CLIENTE]), y tu auto destaca frente al resto.",
    enHome: false,
  },
  {
    id: "que-garantiza-que-mi-auto-no-sea-falsificado-por-otros",
    categoria: "certificacion",
    pregunta: "¿Qué garantiza que mi auto no sea falsificado por otros?",
    respuesta:
      "Cada certificado tiene un QR único vinculado a nuestra base de datos, así nadie puede copiar ni falsificar el reporte. Además, vigilamos el uso de nuestro sello oficial.",
    enHome: false,
  },
]);

export const faqsHome = faqs.filter((f) => f.enHome);
