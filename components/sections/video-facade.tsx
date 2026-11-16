"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { track } from "@/lib/analytics";

/**
 * Facade de YouTube: no carga nada de YouTube hasta el clic. Al hacer clic abre un
 * <dialog> nativo (foco atrapado, Escape cierra) con el iframe de youtube-nocookie.
 */
export function VideoFacade({ id, titulo, label }: { id: string; titulo: string; label: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [cargado, setCargado] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCargado(true);
          dialogo.current?.showModal();
          track("video_play", { video: id, ubicacion: "hero" });
        }}
        className="group inline-flex min-h-11 items-center gap-3 rounded-pill bg-ink/80 py-1.5 pr-4 pl-1.5 text-sm font-medium text-paper ring-1 ring-paper/20 hover:bg-ink"
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand text-ink">
          <Play aria-hidden className="size-3.5 fill-current" strokeWidth={0} />
        </span>
        {label}
        <span className="sr-only"> (video de YouTube)</span>
      </button>
      <dialog
        ref={dialogo}
        aria-label={titulo}
        onClose={() => setCargado(false)}
        className="m-auto w-[min(92vw,960px)] overflow-visible bg-transparent p-0 backdrop:bg-ink/85"
      >
        <form method="dialog" className="mb-3 flex justify-end">
          <button className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-paper px-4 text-sm font-medium text-ink">
            <X aria-hidden className="size-4" /> Cerrar
          </button>
        </form>
        <div className="relative aspect-video overflow-hidden rounded-card bg-ink">
          {cargado && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
