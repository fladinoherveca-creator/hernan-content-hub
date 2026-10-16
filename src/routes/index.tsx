import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useSiteContent, useNews, useEvents, formatDate } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inicio | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Noticias, eventos e información de la I.E.D. Hernán Venegas Carrillo." },
      { property: "og:title", content: "I.E.D. Hernán Venegas Carrillo" },
      { property: "og:description", content: "Noticias, eventos e información institucional." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: c } = useSiteContent();
  const { data: news } = useNews();
  const { data: events } = useEvents();

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Estudiantes en la institución" width={1600} height={912} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 text-primary-foreground">
          <p className="mb-3 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            {c?.school_name ?? " "}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">{c?.hero_title}</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">{c?.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/institucion" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">Conócenos</Link>
            <Link to="/contacto" className="rounded-md border border-primary-foreground/60 px-5 py-3 font-semibold hover:bg-primary-foreground/10">Contacto</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-primary-deep">Últimas noticias</h2>
            <Link to="/noticias" className="flex items-center gap-1 text-sm font-semibold text-primary">Ver todas <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {news?.slice(0, 4).map((n) => (
              <article key={n.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
                {n.image_url && <img src={n.image_url} alt={n.title} loading="lazy" className="h-44 w-full object-cover" />}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase text-primary">{formatDate(n.published_at)}</p>
                  <h3 className="mt-2 text-xl font-semibold">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside>
          <h2 className="mb-6 text-3xl font-semibold text-primary-deep">Próximos eventos</h2>
          <ul className="space-y-4">
            {events?.slice(0, 5).map((e) => (
              <li key={e.id} className="flex gap-4 rounded-xl bg-secondary p-4">
                <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(e.event_date)} · {e.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-primary-deep">Técnicas SENA</h2>
            <Link to="/tecnicas" className="flex items-center gap-1 text-sm font-semibold text-primary">Ver más <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ProgramsGrid />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-semibold text-primary-deep">Directivos</h2>
        <StaffGrid />
      </section>
    </>
  );
}
