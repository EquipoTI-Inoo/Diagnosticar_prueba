import Link from "next/link";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

/** Barra inferior fija en móvil (< 1024 px): WhatsApp + Ver precios (§4). */
export function MobileCtaBar() {
  return (
    <nav
      aria-label="Acciones rápidas"
      className="surface-dark fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ink/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <WhatsAppButton ubicacion="barra-movil" className="w-full">
          WhatsApp
        </WhatsAppButton>
        <Link
          href="/#planes"
          className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border-strong px-4 text-[0.95rem] font-medium text-fg"
        >
          Ver precios
        </Link>
      </div>
    </nav>
  );
}
