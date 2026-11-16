"use client";

import { ConPendientes } from "@/components/ui/pendiente";
import { Plus } from "lucide-react";
import type { Faq } from "@/content/schema";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Acordeón FAQ con <details> nativo (accesible por teclado sin JS) y «+» en círculo. */
export function FaqAccordion({
  faqs,
  headingLevel = 3,
  className,
}: {
  faqs: Faq[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const H = `h${headingLevel}` as const;
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {faqs.map((f) => (
        <details
          key={f.id}
          id={f.id}
          className="group"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) track("faq_open", { id: f.id });
          }}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
            <H className="font-sans text-[1.0625rem] font-medium tracking-normal [font-stretch:100%]">
              {f.pregunta}
            </H>
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong transition-transform duration-200 group-open:rotate-45 group-open:border-accent group-open:text-accent"
            >
              <Plus className="size-4" strokeWidth={1.75} />
            </span>
          </summary>
          <p className="max-w-[62ch] pb-5 text-fg-muted">
            <ConPendientes>{f.respuesta}</ConPendientes>
          </p>
        </details>
      ))}
    </div>
  );
}
