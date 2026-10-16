import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, useNews, useEvents, useGallery, usePrograms, useStaff, uploadImage, formatDate } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Administra el contenido del sitio." },
      { property: "og:title", content: "Panel de administración" },
      { property: "og:description", content: "Administra el contenido del sitio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is_admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <p className="p-10 text-center">Cargando…</p>;
  if (!isAdmin)
    return (
      <div className="p-10 text-center">
        <p>Esta cuenta no tiene permisos de administrador.</p>
        <Button className="mt-4" onClick={signOut}>Salir</Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-deep">Panel de administración</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>Cerrar sesión</Button>
      </div>
      <Tabs defaultValue="textos">
        <TabsList className="flex-wrap">
          <TabsTrigger value="textos">Textos</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="noticias">Noticias</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
          <TabsTrigger value="tecnicas">Técnicas SENA</TabsTrigger>
          <TabsTrigger value="directivos">Directivos</TabsTrigger>
        </TabsList>
        <TabsContent value="textos">
          <ContentForm fields={[
            ["school_name", "Nombre de la institución", false],
            ["hero_title", "Título de portada", false],
            ["hero_subtitle", "Subtítulo de portada", false],
            ["mission", "Misión", true],
            ["vision", "Visión", true],
            ["history", "Historia", true],
            ["values", "Valores (separados por comas)", false],
          ]} />
        </TabsContent>
        <TabsContent value="contacto">
          <ContentForm fields={[
            ["address", "Dirección", false],
            ["phone", "Teléfono", false],
            ["email", "Correo", false],
            ["schedule", "Horario de atención", false],
          ]} />
        </TabsContent>
        <TabsContent value="noticias"><NewsAdmin /></TabsContent>
        <TabsContent value="eventos"><EventsAdmin /></TabsContent>
        <TabsContent value="fotos"><GalleryAdmin /></TabsContent>
        <TabsContent value="tecnicas"><ProgramsAdmin /></TabsContent>
        <TabsContent value="directivos"><StaffAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

const card = "mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card";

function ContentForm({ fields }: { fields: [string, string, boolean][] }) {
  const { data } = useSiteContent();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setValues(data as Record<string, string>); }, [data]);

  async function save() {
    setSaving(true);
    const rows = fields.map(([key]) => ({ key, value: values[key] ?? "", updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_content").upsert(rows);
    setSaving(false);
    if (error) { toast.error("No se pudo guardar"); return; }
    toast.success("Cambios guardados");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  }

  return (
    <div className={card}>
      {fields.map(([key, label, long]) => (
        <div key={key} className="space-y-2">
          <Label>{label}</Label>
          {long ? (
            <Textarea rows={5} value={values[key] ?? ""} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
          ) : (
            <Input value={values[key] ?? ""} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
          )}
        </div>
      ))}
      <Button onClick={save} disabled={saving}>Guardar cambios</Button>
    </div>
  );
}

function NewsAdmin() {
  const { data: news } = useNews();
  const qc = useQueryClient();
  const empty = { id: "", title: "", summary: "", body: "", image_url: "" as string | null };
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!form.title) { toast.error("El título es obligatorio"); return; }
    setBusy(true);
    try {
      let image_url = form.image_url || null;
      if (file) image_url = await uploadImage(file);
      const payload = { title: form.title, summary: form.summary, body: form.body, image_url };
      const { error } = form.id
        ? await supabase.from("news").update(payload).eq("id", form.id)
        : await supabase.from("news").insert(payload);
      if (error) throw error;
      toast.success(form.id ? "Noticia actualizada" : "Noticia publicada");
      setForm(empty); setFile(null);
      qc.invalidateQueries({ queryKey: ["news"] });
    } catch {
      toast.error("No se pudo guardar");
    } finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta noticia?")) return;
    await supabase.from("news").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  return (
    <>
      <div className={card}>
        <h2 className="text-xl font-semibold">{form.id ? "Editar noticia" : "Nueva noticia"}</h2>
        <Input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Resumen corto" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <Textarea rows={6} placeholder="Contenido" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <div className="space-y-2"><Label>Imagen (opcional)</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
        <div className="flex gap-2">
          <Button onClick={save} disabled={busy}>{form.id ? "Guardar" : "Publicar"}</Button>
          {form.id && <Button variant="outline" onClick={() => setForm(empty)}>Cancelar</Button>}
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {news?.map((n) => (
          <li key={n.id} className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
            <div><p className="font-semibold">{n.title}</p><p className="text-xs text-muted-foreground">{formatDate(n.published_at)}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setForm({ id: n.id, title: n.title, summary: n.summary, body: n.body, image_url: n.image_url })}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function EventsAdmin() {
  const { data: events } = useEvents();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", event_date: "", location: "" });

  async function add() {
    if (!form.title || !form.event_date) { toast.error("Título y fecha son obligatorios"); return; }
    const { error } = await supabase.from("events").insert(form);
    if (error) { toast.error("No se pudo guardar"); return; }
    toast.success("Evento agregado");
    setForm({ title: "", description: "", event_date: "", location: "" });
    qc.invalidateQueries({ queryKey: ["events"] });
  }
  async function remove(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  return (
    <>
      <div className={card}>
        <h2 className="text-xl font-semibold">Nuevo evento</h2>
        <Input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          <Input placeholder="Lugar" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <Button onClick={add}>Agregar evento</Button>
      </div>
      <ul className="mt-6 space-y-3">
        {events?.map((e) => (
          <li key={e.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div><p className="font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{formatDate(e.event_date)} · {e.location}</p></div>
            <Button size="sm" variant="destructive" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
          </li>
        ))}
      </ul>
    </>
  );
}

function GalleryAdmin() {
  const { data: photos } = useGallery();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!file) { toast.error("Selecciona una foto"); return; }
    setBusy(true);
    try {
      const image_url = await uploadImage(file);
      const { error } = await supabase.from("gallery").insert({ image_url, caption });
      if (error) throw error;
      toast.success("Foto subida");
      setFile(null); setCaption("");
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch {
      toast.error("No se pudo subir la foto");
    } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }

  return (
    <>
      <div className={card}>
        <h2 className="text-xl font-semibold">Subir foto</h2>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Input placeholder="Descripción (opcional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Button onClick={add} disabled={busy}>{busy ? "Subiendo…" : "Subir"}</Button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos?.map((p) => (
          <div key={p.id} className="relative overflow-hidden rounded-lg border">
            <img src={p.image_url} alt={p.caption} className="aspect-square w-full object-cover" />
            <Button size="icon" variant="destructive" className="absolute right-2 top-2" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </>
  );
}

type Item = { id: string; a: string; b: string; img: string | null; sort: number };

function ListEditor({ table, queryKey, rows, aLabel, bLabel, imgLabel, long }: {
  table: "programs" | "staff"; queryKey: string; rows: Item[];
  aLabel: string; bLabel: string; imgLabel: string; long: boolean;
}) {
  const qc = useQueryClient();
  const empty: Item = { id: "", a: "", b: "", img: null, sort: rows.length + 1 };
  const [form, setForm] = useState<Item>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!form.a) { toast.error(`${aLabel} es obligatorio`); return; }
    setBusy(true);
    try {
      let img = form.img;
      if (file) img = await uploadImage(file);
      const payload = table === "programs"
        ? { title: form.a, description: form.b, image_url: img, sort: form.sort }
        : { name: form.a, role: form.b, photo_url: img, sort: form.sort };
      const q = supabase.from(table);
      const { error } = form.id
        ? await q.update(payload as never).eq("id", form.id)
        : await q.insert(payload as never);
      if (error) throw error;
      toast.success("Guardado");
      setForm({ ...empty, sort: rows.length + 2 }); setFile(null);
      qc.invalidateQueries({ queryKey: [queryKey] });
    } catch { toast.error("No se pudo guardar"); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm("¿Eliminar?")) return;
    await supabase.from(table).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  return (
    <>
      <div className={card}>
        <h2 className="text-xl font-semibold">{form.id ? "Editar" : "Agregar nuevo"}</h2>
        <div className="space-y-2"><Label>{aLabel}</Label><Input value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} /></div>
        <div className="space-y-2"><Label>{bLabel}</Label>
          {long ? <Textarea rows={4} value={form.b} onChange={(e) => setForm({ ...form, b: e.target.value })} />
            : <Input value={form.b} onChange={(e) => setForm({ ...form, b: e.target.value })} />}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{imgLabel}</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div className="space-y-2"><Label>Orden</Label><Input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
          {form.id && <Button variant="outline" onClick={() => setForm(empty)}>Cancelar</Button>}
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              {r.img && <img src={r.img} alt="" className="h-12 w-12 rounded-full object-cover" />}
              <div><p className="font-semibold">{r.a}</p><p className="line-clamp-1 text-xs text-muted-foreground">{r.b}</p></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setForm(r)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function ProgramsAdmin() {
  const { data } = usePrograms();
  const rows = (data ?? []).map((p) => ({ id: p.id, a: p.title, b: p.description, img: p.image_url, sort: p.sort }));
  return <ListEditor table="programs" queryKey="programs" rows={rows} aLabel="Nombre de la técnica" bLabel="Descripción" imgLabel="Imagen (opcional)" long />;
}

function StaffAdmin() {
  const { data } = useStaff();
  const rows = (data ?? []).map((s) => ({ id: s.id, a: s.name, b: s.role, img: s.photo_url, sort: s.sort }));
  return <ListEditor table="staff" queryKey="staff" rows={rows} aLabel="Nombre completo" bLabel="Cargo (Rector, Coordinador, Docente…)" imgLabel="Foto (opcional)" long={false} />;
}
