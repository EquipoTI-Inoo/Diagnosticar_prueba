import { IconWhatsApp } from "@/components/ui/icons";
import { TrackedLink } from "@/components/ui/tracked-link";
import { waReserva } from "@/lib/whatsapp";

/** Botón flotante de WhatsApp (solo escritorio; en móvil está la barra inferior). */
export function WhatsAppFloat() {
  return (
    <aside aria-label="Contacto rápido">
      <TrackedLink
        href={waReserva()}
        target="_blank"
        rel="noopener noreferrer"
        evento="whatsapp_click"
        props={{ servicio: "general", ubicacion: "flotante" }}
        className="fixed right-6 bottom-6 z-30 hidden size-14 place-items-center rounded-full bg-whatsapp text-ink shadow-[0_6px_20px_rgb(11_18_20/0.25)] transition-transform hover:scale-105 lg:grid"
      >
        <IconWhatsApp className="size-7" />
        <span className="sr-only">Escríbenos por WhatsApp</span>
      </TrackedLink>
    </aside>
  );
}
