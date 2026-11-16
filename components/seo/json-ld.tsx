import { esProduccion, neutralizar } from "@/lib/entorno";

/**
 * Inserta JSON-LD. `<` escapado para que el contenido no pueda cerrar el <script>.
 * En producción, las marcas `[PENDIENTE CLIENTE]` se neutralizan como en el texto visible.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: (esProduccion ? neutralizar(json) : json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
