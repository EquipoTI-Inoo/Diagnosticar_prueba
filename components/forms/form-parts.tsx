"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { IconWhatsApp } from "@/components/ui/icons";
import { TrackedLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";

/** Casilla de consentimiento con error asociado. */
export function Consentimiento({
  id,
  error,
  defaultChecked,
  texto = "y que me contacten por WhatsApp.",
}: {
  id: string;
  error?: string;
  defaultChecked?: boolean;
  texto?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
        <input
          id={id}
          name="acepta"
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-brand-deep"
        />
        <span className="text-fg-muted">
          Acepto la{" "}
          <Link href="/legal/privacidad" className="text-accent underline underline-offset-2">
            política de privacidad
          </Link>{" "}
          {texto}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Honeypot anti-spam: invisible para personas y lectores de pantalla. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Empresa
        <input name="empresa" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Botón de envío con estado «enviando». */
export function BotonEnviar({
  pendiente,
  children,
}: {
  pendiente: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pendiente}
      aria-disabled={pendiente}
      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-pill bg-brand px-6 font-medium text-ink hover:bg-brand/85 disabled:opacity-70"
    >
      {pendiente ? "Enviando…" : children}
    </button>
  );
}

/** Panel de resultado (éxito o error de envío) con fallback a WhatsApp. Recibe el foco al aparecer. */
export const PanelResultado = forwardRef<
  HTMLDivElement,
  {
    tipo: "ok" | "error";
    titulo: string;
    texto: string;
    whatsapp?: string;
    ubicacion: string;
    servicio: string;
    accion?: React.ReactNode;
  }
>(function PanelResultado({ tipo, titulo, texto, whatsapp, ubicacion, servicio, accion }, ref) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn(
        "rounded-card border p-5 outline-none",
        tipo === "ok" ? "border-ok" : "border-error",
      )}
    >
      <p className="font-medium text-fg">
        <span
          aria-hidden
          className={cn(
            "mr-2 inline-block size-2.5 rounded-full",
            tipo === "ok" ? "bg-ok" : "bg-alert",
          )}
        />
        {titulo}
      </p>
      <p className="mt-1 text-sm text-fg-muted">{texto}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {whatsapp && (
          <TrackedLink
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            evento="whatsapp_click"
            props={{ servicio, ubicacion }}
            className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-whatsapp px-5 font-medium text-ink"
          >
            <IconWhatsApp className="size-5" />
            Abrir WhatsApp
          </TrackedLink>
        )}
        {accion}
      </div>
    </div>
  );
});

/** Enfoca el primer campo con error (por orden en el formulario). */
export function enfocarPrimerError(
  form: HTMLFormElement | null,
  errores: Record<string, string> | undefined,
) {
  if (!form || !errores) return;
  const campo = Array.from(form.elements).find(
    (el) => el instanceof HTMLElement && "name" in el && errores[(el as HTMLInputElement).name],
  ) as HTMLElement | undefined;
  campo?.focus();
}
