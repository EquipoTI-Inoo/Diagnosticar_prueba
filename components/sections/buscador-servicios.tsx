"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export type Destino = { titulo: string; href: string; detalle: string; claves: string };

const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Buscador local (sin servidor) de servicios y guías para la página 404 (§8). */
export function BuscadorServicios({ destinos }: { destinos: Destino[] }) {
  const id = useId();
  const [q, setQ] = useState("");
  const lista = useMemo(() => {
    const t = normal(q.trim());
    if (!t) return destinos;
    return destinos.filter((d) =>
      t.split(/\s+/).every((w) => normal(`${d.titulo} ${d.detalle} ${d.claves}`).includes(w)),
    );
  }, [q, destinos]);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        ¿Qué buscabas?
      </label>
      <div className="relative mt-2">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
        />
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej.: antecedentes, kilometraje, precios"
          aria-describedby={`${id}-n`}
          className="min-h-12 w-full rounded-pill border border-border-strong bg-white pr-4 pl-12 text-base outline-none focus-visible:border-brand-deep focus-visible:ring-2 focus-visible:ring-brand-deep/30"
        />
      </div>
      <p id={`${id}-n`} aria-live="polite" className="mt-2 font-mono text-xs text-muted">
        {lista.length} {lista.length === 1 ? "resultado" : "resultados"}
      </p>
      <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
        {lista.map((d) => (
          <li key={d.href}>
            <Link
              href={d.href}
              className="group flex min-h-14 items-center justify-between gap-4 py-3"
            >
              <span>
                <span className="block font-medium group-hover:text-brand-deep">{d.titulo}</span>
                <span className="block text-sm text-muted">{d.detalle}</span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-muted group-hover:text-brand-deep"
              />
            </Link>
          </li>
        ))}
        {lista.length === 0 && (
          <li className="py-4 text-muted">
            Sin resultados. Escríbenos por WhatsApp y te ayudamos a elegir el servicio.
          </li>
        )}
      </ul>
    </div>
  );
}
