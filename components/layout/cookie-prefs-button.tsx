"use client";

import { abrirPreferenciasCookies } from "@/lib/analytics";

export function CookiePrefsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={abrirPreferenciasCookies} className={className}>
      Preferencias de cookies
    </button>
  );
}
