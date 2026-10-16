import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSiteContent } from "@/lib/content";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/institucion", label: "Institución" },
  { to: "/noticias", label: "Noticias" },
  { to: "/galeria", label: "Galería y eventos" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const { data } = useSiteContent();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="max-w-[16rem] font-display text-sm font-semibold leading-tight text-primary-deep">
            {data?.school_name ?? "I.E.D. Hernán Venegas Carrillo"}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 hover:bg-secondary hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 font-semibold">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { data } = useSiteContent();
  return (
    <footer className="mt-20 bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">{data?.school_name}</h3>
          <p className="mt-2 text-sm opacity-80">{data?.hero_subtitle}</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Contacto</p>
          <p className="mt-2">{data?.address}</p>
          <p>{data?.phone}</p>
          <p>{data?.email}</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold">Horario</p>
          <p className="mt-2">{data?.schedule}</p>
          <Link to="/admin" className="mt-4 inline-block text-xs underline opacity-70">Administración</Link>
        </div>
      </div>
    </footer>
  );
}
