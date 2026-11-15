"use client";

import { useEffect, useRef, useState } from "react";

/** `true` la primera vez que el elemento entra al viewport (una sola vez). */
export function useInViewOnce<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.3 },
) {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visto) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisto(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisto(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visto]);
  return { ref, visto };
}

export function prefiereMenosMovimiento(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Patrón «revelar al entrar»: el estado inicial (SSR / sin JS) es el FINAL (`mostrar = true`),
 * para que nunca se vea un dato falso si falla JavaScript. Solo en cliente, si el elemento
 * está fuera de pantalla y no hay prefers-reduced-motion, se «arma» (mostrar = false) y se
 * revela una vez al entrar en el viewport.
 */
export function useRevealOnView<T extends Element>(options?: IntersectionObserverInit) {
  const { ref, visto } = useInViewOnce<T>(options);
  const [armado, setArmado] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefiereMenosMovimiento()) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) setArmado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, armado, mostrar: !armado || visto };
}
