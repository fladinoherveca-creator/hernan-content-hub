import { Link } from "@tanstack/react-router";
import { Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSiteContent } from "@/lib/content";
import escudo from "@/assets/escudo-hvc.png.asset.json";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/institucion", label: "Institución" },
  { to: "/tecnicas", label: "Técnicas SENA" },
  { to: "/noticias", label: "Noticias" },
  { to: "/galeria", label: "Galería y eventos" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const { data } = useSiteContent();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={escudo.url} alt="Escudo de la institución" className="h-12 w-auto shrink-0" />
          <span className="max-w-[14rem] font-display text-sm font-semibold leading-tight text-primary-deep">
            {data?.school_name ?? "I.E.D. Hernán Venegas Carrillo"}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 hover:bg-secondary hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/admin" className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Lock className="h-4 w-4" /><span className="hidden sm:inline">Administrador</span>
          </Link>
          <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-2 xl:hidden">
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
          <img src={escudo.url} alt="Escudo de la institución" className="h-16 w-auto" />
          <h3 className="mt-3 text-lg font-semibold">{data?.school_name}</h3>
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
