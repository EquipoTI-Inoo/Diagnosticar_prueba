/**
 * Capa de analítica: `track(evento, props)` → `window.dataLayer.push`.
 * GTM, Meta Pixel y TikTok Pixel se conectan después (IDs [PENDIENTE CLIENTE]).
 *
 * Consentimiento: solo se envían eventos si el usuario aceptó cookies analíticas
 * (lo guarda el banner de cookies de la Fase 2 en localStorage `dc-consent`).
 */
export type Evento =
  | "whatsapp_click"
  | "phone_click"
  | "lead_placa"
  | "lead_contacto"
  | "informe_descarga"
  | "comparativa_view"
  | "faq_open"
  | "guia_read"
  | "consent_update";

export type Ubicacion = string;

export type Consentimiento = { analitica: boolean; marketing: boolean };

const CLAVE = "dc-consent";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function leerConsentimiento(): Consentimiento | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as Consentimiento) : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(c: Consentimiento): void {
  window.localStorage.setItem(CLAVE, JSON.stringify(c));
  track("consent_update", { ...c }, { forzar: true });
}

export function track(
  evento: Evento,
  props: Record<string, string | number | boolean | undefined> = {},
  opts: { forzar?: boolean } = {},
): void {
  if (typeof window === "undefined") return;
  const permitido = opts.forzar || leerConsentimiento()?.analitica === true;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[track]${permitido ? "" : " (sin consentimiento, no enviado)"}`, evento, props);
  }
  if (!permitido) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: evento, ...props });
}
