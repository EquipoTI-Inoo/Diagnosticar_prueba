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
