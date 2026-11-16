import type { Metadata } from "next";
import { HomeConfianza, HomeCierre } from "@/components/sections/home-confianza";
import { HomeEvidencia } from "@/components/sections/home-evidencia";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePlanes } from "@/components/sections/home-planes";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: { absolute: `${home.seo.title} | DiagnostiCAR Lima` },
  description: home.seo.description,
  alternates: { canonical: "/" },
};

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
