import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { WebProjectsGrid } from "@/components/Sections";

export const Route = createFileRoute("/proyectos")({
  head: () => ({
    meta: [
      { title: "Proyectos Web | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Proyectos web creados por los estudiantes de la I.E.D. Hernán Venegas Carrillo." },
      { property: "og:title", content: "Proyectos Web" },
      { property: "og:description", content: "Proyectos web creados por nuestros estudiantes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Proyectos Web" subtitle="Trabajos y aplicaciones web creadas por nuestros estudiantes y docentes." />
      <div className="mx-auto max-w-6xl px-4 py-14"><WebProjectsGrid /></div>
    </>
  ),
});
