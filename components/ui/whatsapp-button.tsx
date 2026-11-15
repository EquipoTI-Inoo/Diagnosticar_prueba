import { waHref, waReserva } from "@/lib/whatsapp";
import { Button } from "./button";

type Props = {
  /** Nombre del servicio para el mensaje prellenado; también va en el evento. */
  servicio?: string;
  /** Texto libre (si no es una reserva de servicio). */
  mensaje?: string;
  /** Dónde está el botón (hero, plan-card, footer…), para el evento `whatsapp_click`. */
  ubicacion: string;
  variant?: "whatsapp" | "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

/** CTA a WhatsApp con mensaje prellenado y evento `whatsapp_click {servicio, ubicacion}`. */
export function WhatsAppButton({
  servicio,
  mensaje,
  ubicacion,
  variant = "whatsapp",
  size,
  className,
  children = "Agendar diagnóstico",
}: Props) {
  const href = mensaje ? waHref(mensaje) : waReserva(servicio);
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      track={{ evento: "whatsapp_click", props: { servicio: servicio ?? "general", ubicacion } }}
    >
      {children}
    </Button>
  );
}
