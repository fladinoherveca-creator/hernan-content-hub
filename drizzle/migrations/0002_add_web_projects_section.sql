CREATE TABLE public.web_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  image_url text,
  link text NOT NULL DEFAULT ''::text,
  sort integer NOT NULL DEFAULT 0,
  CONSTRAINT web_projects_pkey PRIMARY KEY (id)
);

GRANT SELECT ON public.web_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.web_projects TO authenticated;
GRANT ALL ON public.web_projects TO service_role;

ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read web_projects" ON public.web_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert web_projects" ON public.web_projects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin update web_projects" ON public.web_projects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin delete web_projects" ON public.web_projects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));