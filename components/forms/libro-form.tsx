"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { enviarReclamo } from "@/app/(site)/acciones";
import { TextField, inputBase } from "@/components/ui/text-field";
import { estadoInicial, type CampoError } from "@/lib/formularios-tipos";
import { validarLibro } from "@/lib/libro";
import { cn } from "@/lib/utils";
import { BotonEnviar, enfocarPrimerError, Honeypot, PanelResultado } from "./form-parts";

type Opciones = {
  tiposDocumento: readonly string[];
  departamentos: readonly string[];
  tiposReclamo: readonly string[];
  tiposConsumo: readonly string[];
  definiciones: { reclamo: string; queja: string };
  declaraciones: readonly string[];
  aceptacion: string;
};

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="text-sm text-error">
      {msg}
    </p>
  ) : null;
}

function Select({
  id,
  name,
  label,
  opciones,
  placeholder,
  error,
  defaultValue,
  requerido,
}: {
  id: string;
  name: string;
  label: string;
  opciones: readonly string[];
  placeholder: string;
  error?: string;
  defaultValue?: string;
  requerido?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {requerido && <Req />}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={requerido || undefined}
        className={cn(inputBase, "appearance-auto")}
      >
        <option value="">{placeholder}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Err id={`${id}-error`} msg={error} />
    </div>
  );
}

function Area({
  id,
  name,
  label,
  error,
  defaultValue,
  requerido,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  defaultValue?: string;
  requerido?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {requerido && <Req />}
      </label>
      <textarea
        id={id}
        name={name}
        rows={4}
        maxLength={2000}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={requerido || undefined}
        className={cn(inputBase, "min-h-28 py-3")}
      />
      <Err id={`${id}-error`} msg={error} />
    </div>
  );
}

function Req() {
  return (
    <>
      <span aria-hidden className="ml-0.5 text-error">
        *
      </span>
      <span className="sr-only"> (obligatorio)</span>
    </>
  );
}

function Check({ id, name, texto, error }: { id: string; name: string; texto: string; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
        <input
          id={id}
          name={name}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-brand-deep"
        />
        <span className="text-fg-muted">
          {texto}
          <Req />
        </span>
      </label>
      <Err id={`${id}-error`} msg={error} />
    </div>
  );
}

/** Libro de Reclamaciones (Indecopi): campos del formulario original. Envío SIMULADO en el prototipo. */
export function LibroForm({ o, hoy }: { o: Opciones; hoy: string }) {
  const id = useId();
  const [estado, accion, pendiente] = useActionState(enviarReclamo, estadoInicial);
  const [erroresCliente, setErroresCliente] = useState<CampoError | null>(null);
  const [menor, setMenor] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const errores = erroresCliente ?? (estado.estado === "error" ? estado.errores : undefined);
  const v = estado.valores ?? {};

  useEffect(() => {
    if (estado.estado === "ok") panel.current?.focus();
    else if (estado.estado === "error" && estado.errores) enfocarPrimerError(form.current, estado.errores);
  }, [estado]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const errs = validarLibro(new FormData(e.currentTarget));
    if (errs) {
      e.preventDefault();
      setErroresCliente(errs);
      enfocarPrimerError(e.currentTarget, errs);
      return;
    }
    setErroresCliente(null);
  }

  if (estado.estado === "ok") {
    return (
      <div aria-live="polite">
        <PanelResultado
          ref={panel}
          tipo="ok"
          titulo="Envío simulado correctamente"
          texto={`Prototipo: tu ${(v.tipo_reclamo ?? "reclamación").replace(/\s*\(\d\)$/, "").toLowerCase()} del ${new Date(`${v.fecha ?? hoy}T12:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })} pasó todas las validaciones, pero no se registró ni se envió ningún dato. En el sitio definitivo aquí se mostrará el número de hoja y se enviará una copia a tu correo.`}
          servicio="libro"
          ubicacion="libro-de-reclamaciones"
        />
      </div>
    );
  }

  const e = errores ?? {};
  const f = (k: string) => `${id}-${k}`;
  return (
    <form ref={form} action={accion} onSubmit={onSubmit} noValidate className="relative space-y-12">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-h3 font-extrabold [font-stretch:87.5%]">Identificación del consumidor reclamante</legend>
        <p className="text-sm text-fg-muted sm:col-span-2">
          <span aria-hidden className="text-error">*</span> Datos requeridos
        </p>
        <TextField id={f("nombres")} name="nombres" label="Nombre *" autoComplete="given-name" defaultValue={v.nombres} error={e.nombres} aria-required />
        <TextField id={f("paterno")} name="paterno" label="Primer apellido *" autoComplete="family-name" defaultValue={v.paterno} error={e.paterno} aria-required />
        <TextField id={f("materno")} name="materno" label="Segundo apellido *" defaultValue={v.materno} error={e.materno} aria-required />
        <Select id={f("tipo_doc")} name="tipo_doc" label="Tipo de documentación" placeholder="Selección de documentación" opciones={o.tiposDocumento} defaultValue={v.tipo_doc} error={e.tipo_doc} requerido />
        <TextField id={f("nro_doc")} name="nro_doc" label="Número de documentación *" inputMode="text" defaultValue={v.nro_doc} error={e.nro_doc} aria-required />
        <TextField id={f("cel")} name="cel" label="Celular *" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="9XX XXX XXX" maxLength={11} defaultValue={v.cel} error={e.cel} aria-required />
        <Select id={f("dep")} name="dep" label="Departamento" placeholder="Seleccionar departamento" opciones={o.departamentos} defaultValue={v.dep} error={e.dep} requerido />
        <TextField id={f("prov")} name="prov" label="Provincia *" defaultValue={v.prov} error={e.prov} aria-required />
        <TextField id={f("dist")} name="dist" label="Distrito *" defaultValue={v.dist} error={e.dist} aria-required />
        <TextField id={f("direccion")} name="direccion" label="Dirección *" autoComplete="street-address" defaultValue={v.direccion} error={e.direccion} aria-required />
        <TextField id={f("referencia")} name="referencia" label="Referencia" defaultValue={v.referencia} />
        <TextField id={f("correo")} name="correo" label="Correo electrónico *" type="email" autoComplete="email" defaultValue={v.correo} error={e.correo} aria-required />
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium">¿Eres menor de edad?</legend>
          <div className="mt-2 flex gap-6">
            {[
              ["si", "Sí"],
              ["no", "No"],
            ].map(([val, txt]) => (
              <label key={val} className="flex min-h-11 cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="flag_menor"
                  value={val}
                  defaultChecked={val === "no"}
                  onChange={() => setMenor(val === "si")}
                  className="size-5 accent-brand-deep"
                />
                {txt}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      {menor && (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-display text-h3 font-extrabold [font-stretch:87.5%]">Padre / Madre / Tutor</legend>
          <TextField id={f("nombre_tutor")} name="nombre_tutor" label="Nombre *" defaultValue={v.nombre_tutor} error={e.nombre_tutor} aria-required />
          <TextField id={f("correo_tutor")} name="correo_tutor" label="Correo electrónico *" type="email" defaultValue={v.correo_tutor} error={e.correo_tutor} aria-required />
          <Select id={f("tipo_doc_tutor")} name="tipo_doc_tutor" label="Tipo de documentación" placeholder="Selección de documentación" opciones={o.tiposDocumento} defaultValue={v.tipo_doc_tutor} error={e.tipo_doc_tutor} requerido />
          <TextField id={f("nro_doc_tutor")} name="nro_doc_tutor" label="Número de documento *" defaultValue={v.nro_doc_tutor} error={e.nro_doc_tutor} aria-required />
        </fieldset>
      )}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-h3 font-extrabold [font-stretch:87.5%]">Detalle del reclamo y orden del consumidor</legend>
        <Select id={f("tipo_reclamo")} name="tipo_reclamo" label="Tipo de reclamo" placeholder="Tipo de reclamo" opciones={o.tiposReclamo} defaultValue={v.tipo_reclamo} error={e.tipo_reclamo} requerido />
        <Select id={f("tipo_consumo")} name="tipo_consumo" label="Tipo de consumo" placeholder="Tipo de consumo" opciones={o.tiposConsumo} defaultValue={v.tipo_consumo} error={e.tipo_consumo} requerido />
        <TextField id={f("nro_pedido")} name="nro_pedido" label="N.º de pedido *" defaultValue={v.nro_pedido} error={e.nro_pedido} aria-required />
        <TextField id={f("fch_reclamo")} name="fch_reclamo" label="Fecha de reclamación / queja" value={hoy} readOnly hint="Se completa automáticamente." />
        <TextField id={f("proveedor")} name="proveedor" label="Proveedor" defaultValue={v.proveedor} />
        <TextField id={f("monto_reclamado")} name="monto_reclamado" label="Monto reclamado (S/)" inputMode="decimal" defaultValue={v.monto_reclamado} error={e.monto_reclamado} />
        <Area id={f("descripcion")} name="descripcion" label="Descripción del producto o servicio" defaultValue={v.descripcion} error={e.descripcion} requerido />
        <TextField id={f("fch_compra")} name="fch_compra" label="Fecha de compra" type="date" defaultValue={v.fch_compra} />
        <TextField id={f("fch_consumo")} name="fch_consumo" label="Fecha de consumo" type="date" defaultValue={v.fch_consumo} />
        <TextField id={f("fch_vencimiento")} name="fch_vencimiento" label="Fecha de caducidad" type="date" defaultValue={v.fch_vencimiento} />
        <Area id={f("detalle_reclamo")} name="detalle_reclamo" label="Detalle de la Reclamación / Queja, según lo indicado por el cliente" defaultValue={v.detalle_reclamo} error={e.detalle_reclamo} requerido />
        <Area id={f("pedido_cliente")} name="pedido_cliente" label="Pedido del Cliente" defaultValue={v.pedido_cliente} error={e.pedido_cliente} requerido />
        <dl className="grid gap-3 rounded-card border border-border bg-card p-5 text-sm sm:col-span-2">
          <div>
            <dt className="inline font-medium">(1) Reclamación: </dt>
            <dd className="inline text-fg-muted">{o.definiciones.reclamo}</dd>
          </div>
          <div>
            <dt className="inline font-medium">(2) Queja: </dt>
            <dd className="inline text-fg-muted">{o.definiciones.queja}</dd>
          </div>
        </dl>
      </fieldset>

      <div className="space-y-3">
        <Check id={f("declaro")} name="declaro" texto={o.declaraciones[0]!} error={e.declaro} />
        <ul role="list" className="space-y-2 pl-8 text-sm text-fg-muted">
          {o.declaraciones.slice(1).map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <Check id={f("acepto")} name="acepto" texto={o.aceptacion} error={e.acepto} />
      </div>
      <Honeypot />
      <div className="flex flex-col gap-3">
        <div>
          <BotonEnviar pendiente={pendiente}>Enviar reclamo</BotonEnviar>
        </div>
        <div aria-live="polite">
          {errores && Object.values(errores).some(Boolean) && (
            <p className="text-sm text-error">Revisa los campos marcados.</p>
          )}
        </div>
      </div>
    </form>
  );
}
