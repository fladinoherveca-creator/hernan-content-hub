import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProgramsGrid } from "@/components/Sections";

export const Route = createFileRoute("/tecnicas")({
  head: () => ({
    meta: [
      { title: "Técnicas SENA | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Programas técnicos en articulación con el SENA: TIC, Contabilidad y Paneles Solares." },
      { property: "og:title", content: "Técnicas SENA" },
      { property: "og:description", content: "Programas técnicos: TIC, Contabilidad y Paneles Solares." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Técnicas SENA" subtitle="Nuestros estudiantes de media se gradúan con una formación técnica en articulación con el SENA." />
      <div className="mx-auto max-w-6xl px-4 py-14"><ProgramsGrid /></div>
    </>
  ),
});
