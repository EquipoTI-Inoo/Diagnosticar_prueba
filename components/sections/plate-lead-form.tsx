"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PlateInput } from "@/components/ui/plate-input";
import { TextField } from "@/components/ui/text-field";
import { track } from "@/lib/analytics";
import { validarCelular, validarPlaca } from "@/lib/validacion";
import { mensajeConsultaPlaca, waUrl } from "@/lib/wa";

type Textos = { boton: string; ayuda: string; exito: string };

/**
 * «Consulta gratis por placa» (placa + celular + privacidad). Aún no hay endpoint:
 * al validar, abre WhatsApp con la placa prellenada (§5.1) y registra `lead_placa`.
 * Anti-spam: honeypot. La versión con Server Action llega en la Fase 3.
 */
export function PlateLeadForm({
  textos,
  whatsappNumero,
  ubicacion,
}: {
  textos: Textos;
  whatsappNumero: string;
  ubicacion: string;
}) {
  const id = useId();
  const [placa, setPlaca] = useState("");
  const [errores, setErrores] = useState<{
    placa?: string | null;
    celular?: string | null;
    acepta?: string | null;
  }>({});
  const [enviado, setEnviado] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    if (datos.get("empresa")) return; // honeypot
    const celular = String(datos.get("celular") ?? "").replace(/\D/g, "");
    const nuevos = {
      placa: validarPlaca(placa),
      celular: validarCelular(celular),
      acepta: datos.get("acepta") ? null : "Acepta la política de privacidad para continuar.",
    };
    setErrores(nuevos);
    const primero = (["placa", "celular", "acepta"] as const).find((k) => nuevos[k]);
    if (primero) {
      const campo =
        primero === "placa" ? `${id}-placa` : primero === "celular" ? `${id}-cel` : `${id}-acepta`;
      document.getElementById(campo)?.focus();
      return;
    }
    track("lead_placa", { ubicacion });
    setEnviado(true);
    window.open(waUrl(whatsappNumero, mensajeConsultaPlaca(placa, celular)), "_blank", "noopener");
  }

  return (
    <form
      ref={form}
      noValidate
      onSubmit={onSubmit}
      className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start"
    >
      <PlateInput
        id={`${id}-placa`}
        onValueChange={(v) => {
          setPlaca(v);
          if (errores.placa) setErrores((x) => ({ ...x, placa: validarPlaca(v) }));
        }}
        error={errores.placa}
      />
      <TextField
        id={`${id}-cel`}
        name="celular"
        label="Tu celular"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="9XX XXX XXX"
        maxLength={11}
        hint={textos.ayuda}
        error={errores.celular}
      />
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Empresa
          <input name="empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-2 lg:pt-[1.625rem]">
        <button
          type="submit"
          className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-pill bg-brand px-6 font-medium text-ink hover:bg-brand/85"
        >
          {textos.boton}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
      <div className="lg:col-span-3">
        <label
          htmlFor={`${id}-acepta`}
          className="flex min-h-11 cursor-pointer items-start gap-3 text-sm"
        >
          <input
            id={`${id}-acepta`}
            name="acepta"
            type="checkbox"
            aria-invalid={errores.acepta ? true : undefined}
            aria-describedby={errores.acepta ? `${id}-acepta-error` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-brand-deep"
          />
          <span className="text-fg-muted">
            Acepto la{" "}
            <Link href="/legal/privacidad" className="text-accent underline underline-offset-2">
              política de privacidad
            </Link>{" "}
            y que me contacten por WhatsApp.
          </span>
        </label>
        {errores.acepta && (
          <p id={`${id}-acepta-error`} role="alert" className="text-sm text-error">
            {errores.acepta}
          </p>
        )}
        <p role="status" className="text-sm text-fg">
          {enviado ? textos.exito : ""}
        </p>
      </div>
    </form>
  );
}
