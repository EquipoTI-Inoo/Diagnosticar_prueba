"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { enviarContacto } from "@/app/(site)/acciones";
import { TextField, inputBase } from "@/components/ui/text-field";
import { track } from "@/lib/analytics";
import { contactoSchema, erroresDe, estadoInicial, type CampoError } from "@/lib/formularios";
import { cn } from "@/lib/utils";
import {
  BotonEnviar,
  Consentimiento,
  enfocarPrimerError,
  Honeypot,
  PanelResultado,
} from "./form-parts";

type Textos = {
  boton: string;
  exitoTitulo: string;
  exitoTexto: string;
  errorEnvio: string;
  errorFormulario: string;
  otraConsulta: string;
};

/** Formulario de contacto: Server Action + Zod en cliente y servidor + honeypot + fallback WhatsApp. */
export function ContactoForm({
  textos,
  ubicacion = "contacto",
}: {
  textos: Textos;
  ubicacion?: string;
}) {
  const id = useId();
  const [estado, accion, pendiente] = useActionState(enviarContacto, estadoInicial);
  const [erroresCliente, setErroresCliente] = useState<CampoError | null>(null);
  const [verForm, setVerForm] = useState(false);
  const [reinicio, setReinicio] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const errores = erroresCliente ?? (estado.estado === "error" ? estado.errores : undefined);
  const v = estado.valores ?? {};

  useEffect(() => {
    if (estado.estado === "ok") {
      setVerForm(false);
      track("lead_contacto", { ubicacion });
      panel.current?.focus();
    } else if (estado.estado === "error") {
      if (estado.errores) enfocarPrimerError(form.current, estado.errores);
      else panel.current?.focus();
    }
  }, [estado, ubicacion]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    const r = contactoSchema.safeParse({
      nombre: fd.get("nombre") ?? "",
      celular: fd.get("celular") ?? "",
      correo: fd.get("correo") ?? "",
      mensaje: fd.get("mensaje") ?? "",
      acepta: fd.get("acepta") ?? undefined,
      empresa: fd.get("empresa") ?? "",
    });
    if (!r.success) {
      e.preventDefault();
      const errs = erroresDe(r.error);
      setErroresCliente(errs);
      enfocarPrimerError(e.currentTarget, errs);
      return;
    }
    setErroresCliente(null);
  }

  if (estado.estado === "ok" && !verForm) {
    return (
      <div aria-live="polite">
        <PanelResultado
          ref={panel}
          tipo="ok"
          titulo={textos.exitoTitulo}
          texto={textos.exitoTexto}
          whatsapp={estado.whatsapp}
          servicio="contacto"
          ubicacion={ubicacion}
          accion={
            <button
              type="button"
              onClick={() => {
                setVerForm(true);
                setReinicio((n) => n + 1);
              }}
              className="inline-flex min-h-11 items-center rounded-pill border border-border-strong px-5 text-fg"
            >
              {textos.otraConsulta}
            </button>
          }
        />
      </div>
    );
  }

  const msgErr = errores?.mensaje;
  return (
    <form
      key={reinicio}
      ref={form}
      action={accion}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${id}-estado`}
      className="relative grid gap-4 sm:grid-cols-2"
    >
      <TextField
        id={`${id}-nombre`}
        name="nombre"
        label="Nombre"
        autoComplete="name"
        defaultValue={v.nombre}
        error={errores?.nombre}
      />
      <TextField
        id={`${id}-cel`}
        name="celular"
        label="Celular"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="9XX XXX XXX"
        maxLength={11}
        defaultValue={v.celular}
        error={errores?.celular}
      />
      <TextField
        id={`${id}-correo`}
        name="correo"
        label="Correo"
        type="email"
        autoComplete="email"
        defaultValue={v.correo}
        error={errores?.correo}
        className="sm:col-span-2"
      />
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor={`${id}-msg`} className="text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id={`${id}-msg`}
          name="mensaje"
          rows={5}
          maxLength={1000}
          defaultValue={v.mensaje}
          aria-invalid={msgErr ? true : undefined}
          aria-describedby={msgErr ? `${id}-msg-error` : undefined}
          className={cn(inputBase, "min-h-32 py-3")}
        />
        {msgErr && (
          <p id={`${id}-msg-error`} className="text-sm text-error">
            {msgErr}
          </p>
        )}
      </div>
      <Honeypot />
      <div className="sm:col-span-2">
        <Consentimiento
          id={`${id}-acepta`}
          error={errores?.acepta}
          texto="y que me contacten por WhatsApp o correo."
        />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <div>
          <BotonEnviar pendiente={pendiente}>{textos.boton}</BotonEnviar>
        </div>
        <div id={`${id}-estado`} aria-live="polite">
          {errores && Object.values(errores).some(Boolean) && (
            <p className="text-sm text-error">{textos.errorFormulario}</p>
          )}
          {estado.estado === "error" && estado.mensaje && (
            <PanelResultado
              ref={panel}
              tipo="error"
              titulo={textos.errorEnvio}
              texto=""
              whatsapp={estado.whatsapp}
              servicio="contacto"
              ubicacion={ubicacion}
            />
          )}
        </div>
      </div>
    </form>
  );
}
