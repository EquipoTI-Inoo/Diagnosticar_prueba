"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** Registra la micro-conversión `comparativa_view` una vez, cuando la tabla entra en pantalla. */
export function VistaComparativa({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          track("comparativa_view", { ubicacion: window.location.pathname });
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}
