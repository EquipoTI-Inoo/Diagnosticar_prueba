"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { enviarConsultaPlaca } from "@/app/(site)/acciones";
import { PlateInput } from "@/components/ui/plate-input";
import { TextField } from "@/components/ui/text-field";
import { track } from "@/lib/analytics";
import { consultaPlacaSchema, erroresDe, estadoInicial, type CampoError } from "@/lib/formularios";
import {
  BotonEnviar,
  Consentimiento,
  enfocarPrimerError,
  Honeypot,
  PanelResultado,
} from "./form-parts";

type Textos = {
  boton: string;
  ayudaCelular: string;
  exitoTitulo: string;
  exitoTexto: string;
  errorEnvio: string;
  errorFormulario: string;
  otraConsulta: string;
};

/**
 * «Consulta gratis por placa» (placa + celular + privacidad). Server Action con validación Zod
 * en cliente y servidor, honeypot, estados accesibles y fallback a WhatsApp prellenado.
 * Es el mismo componente en la Home y en /guia/consulta-placa-gratis.
 */
export function ConsultaPlacaForm({ textos, ubicacion }: { textos: Textos; ubicacion: string }) {
  const id = useId();
  const [estado, accion, pendiente] = useActionState(enviarConsultaPlaca, estadoInicial);
  const [erroresCliente, setErroresCliente] = useState<CampoError | null>(null);
  const [reinicio, setReinicio] = useState(0);
  const [verForm, setVerForm] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const errores = erroresCliente ?? (estado.estado === "error" ? estado.errores : undefined);

  // Tras la respuesta del servidor: foco al primer error o al panel de resultado.
  useEffect(() => {
    if (estado.estado === "ok") {
      setVerForm(false);
      track("lead_placa", { ubicacion });
      panel.current?.focus();
    } else if (estado.estado === "error") {
      if (estado.errores) enfocarPrimerError(form.current, estado.errores);
      else panel.current?.focus();
    }
  }, [estado, ubicacion]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    const r = consultaPlacaSchema.safeParse({
      placa: fd.get("placa") ?? "",
      celular: fd.get("celular") ?? "",
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
          servicio="consulta-placa"
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

  return (
    <form
      key={reinicio}
      ref={form}
      action={accion}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${id}-estado`}
      className="relative grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start"
    >
      <PlateInput
        id={`${id}-placa`}
        defaultValue={estado.valores?.placa ?? ""}
        error={errores?.placa}
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
        defaultValue={estado.valores?.celular}
        hint={textos.ayudaCelular}
        error={errores?.celular}
      />
      <Honeypot />
      <div className="lg:pt-[1.625rem]">
        <BotonEnviar pendiente={pendiente}>{textos.boton}</BotonEnviar>
      </div>
      <div className="lg:col-span-3">
        <Consentimiento id={`${id}-acepta`} error={errores?.acepta} />
        <div id={`${id}-estado`} aria-live="polite" className="mt-2">
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
              servicio="consulta-placa"
              ubicacion={ubicacion}
            />
          )}
        </div>
      </div>
    </form>
  );
}
