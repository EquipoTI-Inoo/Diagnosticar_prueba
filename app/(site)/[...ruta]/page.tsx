import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { rutasPlanificadas } from "@/content/navegacion";

/** Marcador «en construcción» para las rutas del §4 que se construyen en las fases 3 y 4. */
export const dynamicParams = false;

export function generateStaticParams() {
  return rutasPlanificadas.map((r) => ({ ruta: r.href.slice(1).split("/") }));
}

function buscar(ruta: string[]) {
  return rutasPlanificadas.find((r) => r.href === `/${ruta.join("/")}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ruta: string[] }>;
}): Promise<Metadata> {
  const r = buscar((await params).ruta);
  return { title: r?.titulo ?? "Página", robots: { index: false, follow: true } };
}

export default async function EnConstruccion({ params }: { params: Promise<{ ruta: string[] }> }) {
  const r = buscar((await params).ruta);
  if (!r) notFound();
  return (
    <section className="surface-dark bg-inspeccion pt-32 pb-24 lg:pt-48">
      <div className="container-site max-w-3xl">
        <Eyebrow>Prototipo · en construcción · Fase {r.fase}</Eyebrow>
        <h1 className="mt-5 text-h2">{r.titulo}</h1>
        <p className="mt-5 text-fg-muted">
          Esta página se construye en la Fase {r.fase} del prototipo. Mientras tanto, te atendemos
          por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton ubicacion={`placeholder${r.href}`} variant="primary">
            Agendar diagnóstico
          </WhatsAppButton>
          <Button href="/" variant="secondary" arrow={false}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </section>
  );
}
