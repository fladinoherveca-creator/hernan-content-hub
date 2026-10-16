create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  sort int not null default 0
);
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  photo_url text,
  sort int not null default 0
);
do $$
declare t text;
begin
  foreach t in array array['programs','staff'] loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.has_role(auth.uid(), ''admin''))', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.has_role(auth.uid(), ''admin''))', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;
insert into public.programs (title, description, sort) values
('Técnico en Sistemas – TIC', 'Formación en articulación con el SENA en programación, redes, mantenimiento de equipos y herramientas digitales.', 1),
('Técnico en Contabilidad', 'Formación en articulación con el SENA en registros contables, facturación, nómina y manejo de software contable.', 2),
('Técnico en Paneles Solares', 'Formación en articulación con el SENA en instalación y mantenimiento de sistemas de energía solar fotovoltaica.', 3);
insert into public.staff (name, role, sort) values
('Nombre del rector(a)', 'Rector(a)', 1),
('Nombre del coordinador(a)', 'Coordinador(a) académico', 2),
('Nombre del coordinador(a)', 'Coordinador(a) de convivencia', 3);