import { StaffGrid } from "@/components/Sections";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useSiteContent } from "@/lib/content";

export const Route = createFileRoute("/institucion")({
  head: () => ({
    meta: [
      { title: "Institución | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Misión, visión, historia y valores de la institución." },
      { property: "og:title", content: "Nuestra institución" },
      { property: "og:description", content: "Misión, visión, historia y valores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: c } = useSiteContent();
  const values = (c?.values ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  return (
    <>
      <PageHeader title="Nuestra institución" subtitle={c?.school_name} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
        {[["Misión", c?.mission], ["Visión", c?.vision]].map(([t, v]) => (
          <div key={t} className="rounded-xl border-t-4 border-primary bg-card p-8 shadow-card">
            <h2 className="text-2xl font-semibold text-primary-deep">{t}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{v}</p>
          </div>
        ))}
        <div className="rounded-xl bg-card p-8 shadow-card md:col-span-2">
          <h2 className="text-2xl font-semibold text-primary-deep">Historia</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{c?.history}</p>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-primary-deep">Valores</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {values.map((v) => (
              <span key={v} className="rounded-full bg-secondary px-4 py-2 font-semibold text-secondary-foreground">{v}</span>
            ))}
          </div>
          <h2 className="mt-12 mb-6 text-2xl font-semibold text-primary-deep">Directivos</h2>
          <StaffGrid />
        </div>
      </div>
    </>
  );
}
