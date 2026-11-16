import { PlanCard } from "@/components/ui/plan-card";
import { escalera } from "@/content/servicios";

/**
 * Los 5 planes: carrusel con snap en móvil/tablet (la tarjeta siguiente asoma) y rejilla de 5
 * en escritorio con subgrid (precio, «Incluye» y botones alineados). Usado en Home y /servicios.
 */
export function PlanesCarrusel({
  ubicacion,
  headingLevel = 3,
}: {
  ubicacion: string;
  headingLevel?: 2 | 3;
}) {
  return (
    <div className="container-site px-0 lg:px-(--spacing-gutter)">
      <ul
        role="list"
        tabIndex={0}
        aria-label="Planes (desliza para ver todos)"
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-4 outline-offset-4 lg:grid lg:grid-cols-5 lg:grid-rows-[auto_auto_auto_1fr_auto] lg:gap-y-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {escalera.map((s, i) => (
          <li
            key={s.slug}
            className="w-[82%] max-w-[24rem] shrink-0 snap-start sm:w-[46%] lg:row-span-5 lg:grid lg:w-auto lg:max-w-none lg:grid-rows-subgrid"
          >
            <PlanCard
              servicio={s}
              indice={i + 1}
              total={escalera.length}
              ubicacion={ubicacion}
              headingLevel={headingLevel}
              compacta
              subgrid
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
