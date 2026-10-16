import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useNews, formatDate } from "@/lib/content";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Noticias | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Noticias y comunicados de la institución." },
      { property: "og:title", content: "Noticias" },
      { property: "og:description", content: "Noticias y comunicados de la institución." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: news, isLoading } = useNews();
  return (
    <>
      <PageHeader title="Noticias" subtitle="Lo que está pasando en nuestra comunidad educativa." />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-14">
        {isLoading && <p className="text-muted-foreground">Cargando…</p>}
        {news?.length === 0 && <p className="text-muted-foreground">Aún no hay noticias.</p>}
        {news?.map((n) => (
          <article key={n.id} className="overflow-hidden rounded-xl border bg-card shadow-card md:flex">
            {n.image_url && <img src={n.image_url} alt={n.title} loading="lazy" className="h-56 w-full object-cover md:h-auto md:w-72" />}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase text-primary">{formatDate(n.published_at)}</p>
              <h2 className="mt-2 text-2xl font-semibold">{n.title}</h2>
              <p className="mt-2 font-semibold text-muted-foreground">{n.summary}</p>
              <p className="mt-3 whitespace-pre-line leading-relaxed">{n.body}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
