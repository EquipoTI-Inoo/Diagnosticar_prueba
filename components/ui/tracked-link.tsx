"use client";

import { track, type Evento } from "@/lib/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  evento: Evento;
  props?: Record<string, string | number | boolean | undefined>;
};

/** Enlace que registra un evento de analítica al hacer clic (WhatsApp, teléfono, descargas). */
export function TrackedLink({ evento, props, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(evento, props);
        onClick?.(e);
      }}
    />
  );
}
