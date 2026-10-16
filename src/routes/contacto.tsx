import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useSiteContent } from "@/lib/content";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Dirección, teléfono, correo y horario de atención." },
      { property: "og:title", content: "Contacto" },
      { property: "og:description", content: "Dirección, teléfono, correo y horario." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: c } = useSiteContent();
  const items = [
    { icon: MapPin, label: "Dirección", value: c?.address },
    { icon: Phone, label: "Teléfono", value: c?.phone },
    { icon: Mail, label: "Correo", value: c?.email },
    { icon: Clock, label: "Horario", value: c?.schedule },
  ];
  return (
    <>
      <PageHeader title="Contacto" subtitle="Estamos para atenderte." />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 py-14 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-4 rounded-xl border bg-card p-6 shadow-card">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Icon /></span>
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-semibold break-words">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
