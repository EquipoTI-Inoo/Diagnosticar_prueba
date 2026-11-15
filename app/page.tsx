import Link from "next/link";
import { Eyebrow, Highlight, Logo, WhatsAppButton } from "@/components/ui";
import { negocio } from "@/content/negocio";

/** Página temporal de la Fase 1. La Home completa (§5.1) se construye en la Fase 2. */
export default function Home() {
  return (
    <main className="surface-dark bg-inspeccion grid min-h-dvh place-items-center">
      <div className="container-site py-20">
        <Logo on="dark" className="h-16" />
        <Eyebrow className="mt-10">Prototipo · Fase 1 de 6</Eyebrow>
        <h1 className="mt-4 text-h1">
          Revisa antes de decidir.
          <br />
          <Highlight italic>{negocio.lema}.</Highlight>
        </h1>
        <p className="mt-6 max-w-[56ch] text-fg-muted">
          Fundaciones listas: tokens, tipografías, componentes y contenido importado. La Home
          completa llega en la Fase 2.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/design-system"
            className="inline-flex min-h-11 items-center rounded-pill bg-brand px-5 font-medium text-ink"
          >
            Ver el sistema de diseño
          </Link>
          <WhatsAppButton ubicacion="home-temporal" />
        </div>
      </div>
    </main>
  );
}
