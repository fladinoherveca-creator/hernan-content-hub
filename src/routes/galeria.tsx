import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useGallery, useEvents, formatDate } from "@/lib/content";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería y eventos | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Fotos y calendario de actividades de la institución." },
      { property: "og:title", content: "Galería y eventos" },
      { property: "og:description", content: "Fotos y calendario de actividades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: photos } = useGallery();
  const { data: events } = useEvents();
  return (
    <>
      <PageHeader title="Galería y eventos" />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-semibold text-primary-deep">Calendario de actividades</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {events?.map((e) => (
            <div key={e.id} className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="text-xl font-semibold">{e.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-primary">
                <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{formatDate(e.event_date)}</span>
                {e.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{e.location}</span>}
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-3xl font-semibold text-primary-deep">Galería</h2>
        {photos?.length === 0 && <p className="mt-4 text-muted-foreground">Pronto publicaremos fotos.</p>}
        <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos?.map((p) => (
            <figure key={p.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-card shadow-card">
              <img src={p.image_url} alt={p.caption} loading="lazy" className="w-full" />
              {p.caption && <figcaption className="p-3 text-sm text-muted-foreground">{p.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
