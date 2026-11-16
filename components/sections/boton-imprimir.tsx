"use client";

import { Printer } from "lucide-react";

export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-5 font-medium text-fg hover:border-accent hover:text-accent"
    >
      <Printer aria-hidden className="size-4" strokeWidth={1.75} />
      Imprimir checklist
    </button>
  );
}
