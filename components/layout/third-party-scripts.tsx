"use client";

import { useEffect } from "react";
import { EVENTO_CONSENTIMIENTO, leerConsentimiento, type Consentimiento } from "@/lib/analytics";

type Ids = { gtm: string; metaPixel: string; tiktokPixel: string };

function inyectar(id: string, codigo: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.text = codigo;
  document.head.appendChild(s);
}

/**
 * Carga GTM / Meta Pixel / TikTok Pixel SOLO después del consentimiento correspondiente
 * y solo si existe el ID (hoy todos están [PENDIENTE CLIENTE] → no se carga nada).
 * Si el usuario retira el consentimiento, se deja de enviar (track) y se recarga la página
 * para descargar los scripts ya inyectados.
 */
export function ThirdPartyScripts({ ids }: { ids: Ids }) {
  useEffect(() => {
    let previo = leerConsentimiento();
    const aplicar = (c: Consentimiento | null) => {
      if (!c) return;
      if (c.analitica && ids.gtm) {
        inyectar(
          "dc-gtm",
          `window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var f=document.createElement('script');f.async=true;f.src='https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtm)}';document.head.appendChild(f);`,
        );
      }
      if (c.marketing && ids.metaPixel) {
        inyectar(
          "dc-meta",
          `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${encodeURIComponent(ids.metaPixel)}');fbq('track','PageView');`,
        );
      }
      if (c.marketing && ids.tiktokPixel) {
        inyectar(
          "dc-tiktok",
          `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n=d.createElement("script");n.async=!0;n.src="https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+e+"&lib="+t;d.head.appendChild(n)};ttq.load('${encodeURIComponent(ids.tiktokPixel)}');ttq.page()}(window,document,'ttq');`,
        );
      }
    };
    aplicar(previo);
    const onCambio = (e: Event) => {
      const c = (e as CustomEvent<Consentimiento>).detail;
      const retiro =
        previo && ((previo.analitica && !c.analitica) || (previo.marketing && !c.marketing));
      const cargado = ["dc-gtm", "dc-meta", "dc-tiktok"].some((id) => document.getElementById(id));
      previo = c;
      if (retiro && cargado) window.location.reload();
      else aplicar(c);
    };
    window.addEventListener(EVENTO_CONSENTIMIENTO, onCambio);
    return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, onCambio);
  }, [ids]);
  return null;
}
