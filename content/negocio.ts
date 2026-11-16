/**
 * Datos del negocio: identidad, contacto, métricas, aliados.
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { negocioSchema, type Negocio } from "./schema";

export const negocio: Negocio = negocioSchema.parse({
  marca: "DiagnostiCAR",
  razonSocial: "Diagnosticar S.A.C.",
  ruc: "20609649420",
  partidaRegistral: "15011145 (Registro de Personas Jurídicas de Lima)",
  sitio: "https://diagnosticarperu.com/",
  queEs:
    "Empresa limeña de diagnóstico vehicular pre-compra a domicilio para autos usados: antecedentes legales/registrales (SUNARP, SAT, papeletas, gravámenes, robo, pérdida total) e inspección técnica con escáneres profesionales, escaneo electromagnético de carrocería (choques/masilla), videoscopía, verificación de kilometraje, VIN y motor. También certifica autos para la venta ('Vehículo verificado por DiagnostiCAR' con QR) y da asesoría precompra online.",
  lema: "Las máquinas no mienten",
  direccion: {
    calle: "Av. José Pardo 1167, of. 303",
    distrito: "Miraflores",
    ciudad: "Lima",
    pais: "PE",
    codigoPostal: "15074",
    referencia: "Oficina administrativa. El servicio es a domicilio: vamos a donde está el auto.",
    geo: {
      lat: -12.119244,
      lng: -77.040568,
    },
  },
  whatsapp: {
    numero: "51923374470",
    display: "+51 923 374 470",
  },
  telefono: {
    e164: "+51923374470",
    display: "923 374 470",
  },
  email: "[PENDIENTE CLIENTE]",
  emailReferenciaInterna: "info@diagnosticar.com",
  horario: {
    dias: "Lunes a domingo",
    horas: "[PENDIENTE CLIENTE]",
  },
  redes: {
    instagram: {
      url: "https://www.instagram.com/diagnosticar.peru/",
      usuario: "@diagnosticar.peru",
    },
    youtube: {
      url: "https://www.youtube.com/@diagnosticarperu",
      usuario: "@diagnosticarperu",
    },
    facebook: {
      url: "https://www.facebook.com/profile.php?id=100083559722874",
    },
    tiktok: {
      url: "https://vt.tiktok.com/ZSPVKqXRd/",
      usuario: "[PENDIENTE CLIENTE]",
    },
    grupoFacebook: {
      nombre: "Compra Segura Autos Usados Lima",
      url: "[PENDIENTE CLIENTE]",
    },
  },
  metricas: {
    diagnosticos: {
      valor: 6000,
      display: "+6,000",
      etiqueta: "diagnósticos realizados",
      notaFuente: "home 2026; landing venta-sin-consignar dice 5,000",
      confirmar: false,
    },
    rating: {
      valor: 4.9,
      display: "4.9",
      etiqueta: "en Google",
      confirmar: false,
    },
    resenas: {
      valor: 575,
      display: "+575",
      etiqueta: "reseñas en Google",
      notaFuente: "meta description aún dice +400; landing dice 450",
      confirmar: false,
    },
    anios: {
      valor: 4,
      display: "4",
      etiqueta: "años de experiencia",
      notaFuente: "contador /nosotros/",
      confirmar: false,
    },
    independencia: {
      valor: 100,
      display: "100 %",
      etiqueta: "independientes del vendedor",
      confirmar: false,
    },
    leadsDiarios: {
      valor: 300,
      display: "300–400",
      etiqueta: "leads diarios",
      notaFuente: "landing venta-sin-consignar; CONFIRMAR",
      confirmar: true,
    },
    seguidores: {
      valor: 100000,
      display: "+100k",
      etiqueta: "seguidores",
      notaFuente: "landing venta-sin-consignar; CONFIRMAR",
      confirmar: true,
    },
  },
  aliados: [
    {
      nombre: "LAUNCH",
      rol: "escáner",
      logo: {
        src: "/logos/launch-official-v2.png",
        alt: "LAUNCH",
        ancho: 1050,
        alto: 250,
      },
      vigente: true,
    },
    {
      nombre: "Autel",
      rol: "escáner",
      logo: {
        src: "/logos/logo-autel.png",
        alt: "Autel",
        ancho: 250,
        alto: 47,
      },
      vigente: true,
    },
    {
      nombre: "SONAX",
      rol: "Mencionado solo en páginas antiguas",
      vigente: false,
    },
  ],
  medios: [
    {
      nombre: "Gestión",
      logo: {
        src: "/logos/logo-gestion.png",
        alt: "Gestión",
        ancho: 361,
        alto: 82,
        fondo: "oscuro",
      },
      url: "[PENDIENTE CLIENTE]",
    },
  ],
  automovilismo: [
    {
      nombre: "Rally Caminos del Inca",
      logo: {
        src: "/logos/caminos-del-inca-logo.png",
        alt: "Rally Caminos del Inca",
        ancho: 520,
        alto: 520,
        fondo: "oscuro",
      },
    },
  ],
  tecnologia: [
    "6 escáneres profesionales (se lleva el adecuado a cada marca/modelo), homologados y con capacidad para detectar alteración de kilometraje",
    "Escaneo profesional de motor, caja, airbags y ABS (y transmisión, ABS/ESP, inmovilizador, dirección, BCM en certificación)",
    "Escaneo electromagnético de carrocería: detecta masilla; 100–120 mediciones por vehículo según reporte",
    "Videoscopía (cilindros, válvulas, pistones, cableado)",
    "PaintSCAN Pro + TintSCAN Pro (Plus)",
    "Escaneo láser de frenos y llantas (Plus)",
    "Medición de calidad de aceite y líquido de frenos; prueba de arranque, alternador y batería (página legacy revision-vehicular, 320 puntos)",
  ],
  reserva: {
    adelantoPorcentaje: 50,
    texto: "Reservas con el 50 % del servicio y pagas el saldo al terminar.",
    mediosDePago: "[PENDIENTE CLIENTE]",
  },
});
