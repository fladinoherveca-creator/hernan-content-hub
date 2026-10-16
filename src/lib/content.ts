import { useQuery } from "@tanstack/react-query";
export type SiteContent = Partial<Record<
  | "school_name" | "hero_title" | "hero_subtitle" | "mission" | "vision" | "history"
  | "values" | "rector" | "address" | "phone" | "email" | "schedule", string>>;

import { supabase } from "@/integrations/supabase/client";

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      return Object.fromEntries(data.map((r) => [r.key, r.value])) as SiteContent;
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date");
      if (error) throw error;
      return data;
    },
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

/** Uploads an image and returns a long-lived URL to display it. */
export async function uploadImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2) throw e2;
  return data.signedUrl;
}

export function formatDate(d: string) {
  return new Date(d.length === 10 ? d + "T12:00:00" : d).toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").order("sort");
      if (error) throw error;
      return data;
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("sort");
      if (error) throw error;
      return data;
    },
  });
}

export function useWebProjects() {
  return useQuery({
    queryKey: ["web_projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("web_projects").select("*").order("sort");
      if (error) throw error;
      return data;
    },
  });
}
