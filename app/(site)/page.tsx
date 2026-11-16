import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { HomeConfianza, HomeCierre } from "@/components/sections/home-confianza";
import { HomeEvidencia } from "@/components/sections/home-evidencia";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePlanes } from "@/components/sections/home-planes";
import { home } from "@/content/home";

export const metadata: Metadata = metadatos({ tema: home.seo.title, descripcion: home.seo.description, path: "/" });

/** Home (§5.1): 13 bloques en ritmo oscuro / claro. */
export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeEvidencia />
      <HomePlanes />
      <HomeConfianza />
      <HomeCierre />
    </>
  );
}
