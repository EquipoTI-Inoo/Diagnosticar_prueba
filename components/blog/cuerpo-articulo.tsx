import type { Bloque } from "@/lib/blog";

/** Renderiza el cuerpo de un artículo (subconjunto MDX) con la tipografía del sitio. */
export function CuerpoArticulo({ bloques }: { bloques: Bloque[] }) {
  return (
    <div className="max-w-[68ch] text-[1.0625rem] leading-[1.75]">
      {bloques.map((b, i) => {
        switch (b.tipo) {
          case "h2":
            return (
              <h2 key={i} className="mt-12 mb-4 text-[1.75rem] leading-tight tracking-[-0.02em] first:mt-0">
                {b.texto}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 mb-2 font-sans text-[1.125rem] font-medium tracking-normal [font-stretch:100%]">
                {b.texto}
              </h3>
            );
          case "cita":
            return (
              <blockquote key={i} className="my-8 border-l-2 border-brand-deep pl-5 font-display text-[1.25rem] leading-snug font-extrabold [font-stretch:87.5%]">
                {b.texto}
              </blockquote>
            );
          case "lista":
            return (
              <ul key={i} role="list" className="my-5 space-y-2.5">
                {b.items.map((it) => (
                  <li key={it} className="grid grid-cols-[1.25rem_1fr] gap-2">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 bg-brand-deep" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="my-5">
                {b.texto}
              </p>
            );
        }
      })}
    </div>
  );
}
