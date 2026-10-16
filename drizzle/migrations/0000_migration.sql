create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  body text not null default '',
  image_url text,
  published_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  event_date date not null,
  location text not null default ''
);
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['site_content','news','events','gallery'] loop
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

insert into public.site_content (key, value) values
('school_name', 'Institución Educativa Departamental Hernán Venegas Carrillo'),
('hero_title', 'Formamos personas íntegras para transformar su comunidad'),
('hero_subtitle', 'Educación de calidad con valores, ciencia y compromiso social.'),
('mission', 'Somos una institución educativa oficial que ofrece formación integral en los niveles de preescolar, básica y media, fundamentada en valores, el conocimiento científico y el respeto por el medio ambiente.'),
('vision', 'Para el año 2030 seremos reconocidos como una institución líder en la región por la calidad de sus procesos académicos y la formación de ciudadanos competentes y comprometidos con su entorno.'),
('history', 'La institución nació del esfuerzo de la comunidad por brindar educación a sus niños y jóvenes. Con los años ha crecido en sedes, estudiantes y programas, manteniendo siempre su compromiso con la excelencia.'),
('values', 'Respeto, Responsabilidad, Honestidad, Solidaridad, Tolerancia'),
('rector', 'Rector(a) de la institución'),
('address', 'Dirección de la sede principal'),
('phone', '(+57) 000 000 0000'),
('email', 'contacto@iedhernanvenegascarrillo.edu.co'),
('schedule', 'Lunes a viernes, 7:00 a.m. – 3:00 p.m.');

insert into public.news (title, summary, body) values
('Bienvenidos al nuevo año escolar', 'Damos la bienvenida a estudiantes, padres y docentes.', 'Con alegría iniciamos un nuevo año lleno de retos y aprendizajes. Invitamos a toda la comunidad a participar activamente.'),
('Feria de la ciencia', 'Nuestros estudiantes presentaron proyectos innovadores.', 'La feria de la ciencia reunió más de 40 proyectos elaborados por los estudiantes de todos los grados.');

insert into public.events (title, description, event_date, location) values
('Reunión de padres de familia', 'Entrega de informes del periodo.', current_date + 14, 'Sede principal'),
('Día de la familia', 'Jornada de integración con actividades culturales y deportivas.', current_date + 30, 'Cancha institucional');

create policy "media read" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));