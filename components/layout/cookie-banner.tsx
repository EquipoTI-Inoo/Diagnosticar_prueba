"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { EVENTO_ABRIR_COOKIES, guardarConsentimiento, leerConsentimiento } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Banner de cookies con consentimiento real: Aceptar / Rechazar / Configurar con el mismo
 * peso visual. Hasta que el usuario elige, no se envía ningún evento ni se carga ningún
 * pixel (ver lib/analytics.ts y third-party-scripts.tsx). Se reabre desde el footer.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(false);
  const [analitica, setAnalitica] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titulo = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actual = leerConsentimiento();
    if (!actual) setVisible(true);
    else {
      setAnalitica(actual.analitica);
      setMarketing(actual.marketing);
    }
    const abrir = () => {
      const c = leerConsentimiento();
      setAnalitica(c?.analitica ?? false);
      setMarketing(c?.marketing ?? false);
      setVisible(true);
      setConfig(true);
      requestAnimationFrame(() => panel.current?.focus());
    };
    window.addEventListener(EVENTO_ABRIR_COOKIES, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_COOKIES, abrir);
  }, []);

  if (!visible) return null;

  const decidir = (a: boolean, m: boolean) => {
    guardarConsentimiento({ analitica: a, marketing: m });
    setVisible(false);
    setConfig(false);
  };

  const boton =
    "inline-flex min-h-11 min-w-0 items-center justify-center rounded-pill border px-2 text-[0.9rem] font-medium transition-colors";

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="region"
      aria-labelledby={titulo}
      data-no-print
      className="surface-dark fixed inset-x-3 bottom-[5.25rem] z-50 rounded-card border border-border-strong p-4 sm:p-5 shadow-[0_8px_30px_rgb(0_0_0/0.35)] outline-none sm:inset-x-auto sm:left-6 sm:max-w-md lg:bottom-6"
    >
      <p id={titulo} className="font-medium">
        Cookies
      </p>
      <p className="mt-1.5 text-sm text-fg-muted">
        Usamos cookies necesarias para que el sitio funcione. Si aceptas, también usamos cookies de
        analítica y de publicidad para medir y mejorar. Puedes cambiarlo cuando quieras.{" "}
        <Link href="/legal/cookies" className="text-accent underline underline-offset-2">
          Política de cookies
        </Link>
      </p>

      {config && (
        <fieldset className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          <legend className="sr-only">Preferencias de cookies</legend>
          <label className="flex min-h-11 items-start gap-3">
            <input type="checkbox" checked disabled className="mt-1 size-4 accent-brand" />
            <span>
              <span className="font-medium">Necesarias</span>
              <span className="block text-fg-muted">Siempre activas. Guardan esta elección.</span>
            </span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={analitica}
              onChange={(e) => setAnalitica(e.target.checked)}
              className="mt-1 size-4 accent-brand"
            />
            <span>
              <span className="font-medium">Analítica</span>
              <span className="block text-fg-muted">
                Google Tag Manager: qué páginas y botones se usan.
              </span>
            </span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 size-4 accent-brand"
            />
            <span>
              <span className="font-medium">Publicidad</span>
              <span className="block text-fg-muted">Meta Pixel y TikTok Pixel.</span>
            </span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => decidir(false, false)}
          className={cn(boton, "border-border-strong text-fg hover:border-accent")}
        >
          Rechazar
        </button>
        {config ? (
          <button
            type="button"
            onClick={() => decidir(analitica, marketing)}
            className={cn(boton, "border-border-strong text-fg hover:border-accent")}
          >
            Guardar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfig(true)}
            className={cn(boton, "border-border-strong text-fg hover:border-accent")}
          >
            Configurar
          </button>
        )}
        <button
          type="button"
          onClick={() => decidir(true, true)}
          className={cn(boton, "border-brand bg-brand text-ink hover:bg-brand/85")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
