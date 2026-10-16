import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import escudo from "@/assets/escudo-hvc.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administrador | I.E.D. Hernán Venegas Carrillo" },
      { name: "description", content: "Ingreso al panel de administración del sitio." },
      { property: "og:title", content: "Acceso administrador" },
      { property: "og:description", content: "Ingreso al panel de administración." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error("Correo o contraseña incorrectos"); return; }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Revisa tu correo para confirmar la cuenta.");
      setMode("in");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-xl border bg-card p-8 shadow-card">
        <h1 className="text-3xl font-semibold text-primary-deep">{mode === "in" ? "Ingresar" : "Crear cuenta"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Panel de administración del sitio.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Contraseña</Label>
            <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{mode === "in" ? "Ingresar" : "Registrarme"}</Button>
        </form>
        <button className="mt-4 text-sm text-primary underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "¿Primera vez? Crear la cuenta de administrador" : "Ya tengo cuenta"}
        </button>
      </div>
    </div>
  );
}
