create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text,
  email text not null,
  created_at timestamptz not null default now()
);

-- Required since auto_expose_new_tables defaults to false as of 2026-05-30
grant all on public.contacts to service_role;
