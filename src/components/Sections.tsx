import { Cpu, Calculator, Sun, BookOpen, User } from "lucide-react";
import { usePrograms, useStaff } from "@/lib/content";

function iconFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("tic") || t.includes("sistema")) return Cpu;
  if (t.includes("contab")) return Calculator;
  if (t.includes("solar")) return Sun;
  return BookOpen;
}

export function ProgramsGrid() {
  const { data } = usePrograms();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {data?.map((p) => {
        const Icon = iconFor(p.title);
        return (
          <article key={p.id} className="overflow-hidden rounded-xl border-t-4 border-primary bg-card shadow-card">
            {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" className="h-44 w-full object-cover" />}
            <div className="p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary"><Icon /></span>
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function StaffGrid() {
  const { data } = useStaff();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((s) => (
        <div key={s.id} className="flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-card">
          {s.photo_url ? (
            <img src={s.photo_url} alt={s.name} loading="lazy" className="h-28 w-28 rounded-full object-cover ring-4 ring-secondary" />
          ) : (
            <span className="flex h-28 w-28 items-center justify-center rounded-full bg-secondary text-primary"><User className="h-12 w-12" /></span>
          )}
          {s.name && <p className="mt-4 text-lg font-semibold">{s.name}</p>}
          <p className={`text-sm font-semibold text-primary ${s.name ? "" : "mt-4"}`}>{s.role}</p>
        </div>
      ))}
    </div>
  );
}
