-- Full client-management schema: clients, offerings/enrollment history,
-- health metrics, nutrition logs, and a workout/exercise catalog.
--
-- Same posture as public.contacts / public.orders / public.training_payments
-- throughout: RLS enabled, no policies for anon/authenticated (deny by
-- default), service_role only.

-- ---------------------------------------------------------------------
-- Clients: replaces public.training_clients (richer intake fields). The
-- existing 4 rows are migrated below with their original ids preserved,
-- so public.training_payments.client_id needs no data changes, only a
-- retargeted foreign key.
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

insert into public.clients (id, first_name, created_at)
select id, name, created_at from public.training_clients
on conflict (id) do nothing;

alter table public.training_payments drop constraint if exists training_payments_client_id_fkey;
alter table public.training_payments
  add constraint training_payments_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete cascade;

drop table if exists public.training_clients;

alter table public.clients enable row level security;
grant all on public.clients to service_role;

-- ---------------------------------------------------------------------
-- Offerings: plan-type catalog + per-client enrollment history (a client
-- can move between offerings over time; end_date null = currently active).
-- ---------------------------------------------------------------------
create table if not exists public.offerings (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into public.offerings (name) values
  ('1 month'), ('2 month'), ('3 month'), ('1 on 1 coaching'), ('Customized')
on conflict (name) do nothing;

create table if not exists public.client_offerings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  offering_id uuid not null references public.offerings(id) on delete restrict,
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now()
);

create index if not exists client_offerings_client_id_idx on public.client_offerings (client_id);

alter table public.offerings enable row level security;
alter table public.client_offerings enable row level security;
grant all on public.offerings to service_role;
grant all on public.client_offerings to service_role;

-- ---------------------------------------------------------------------
-- Health metrics: one time-series table, one row per client per date.
-- macros/endurance/one_rep_max are jsonb rather than a single number or
-- text blob, since each is naturally multi-valued per entry (e.g. one_rep_max
-- = {"bench": 225, "squat": 315}, not one number) — everything else here is
-- a single well-defined measurement.
-- ---------------------------------------------------------------------
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  recorded_date date not null,
  weight numeric,
  body_fat_percent numeric,
  testosterone_level numeric,
  blood_oxygenation numeric,
  macros jsonb,
  endurance jsonb,
  dietary_restrictions text,
  one_rep_max jsonb,
  created_at timestamptz not null default now()
);

create index if not exists health_metrics_client_id_idx on public.health_metrics (client_id);
create index if not exists health_metrics_recorded_date_idx on public.health_metrics (recorded_date desc);

alter table public.health_metrics enable row level security;
grant all on public.health_metrics to service_role;

-- ---------------------------------------------------------------------
-- Nutrition: daily log, one row per client per date per meal slot.
-- ---------------------------------------------------------------------
create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null,
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists nutrition_logs_client_date_idx on public.nutrition_logs (client_id, log_date desc);

alter table public.nutrition_logs enable row level security;
grant all on public.nutrition_logs to service_role;

-- ---------------------------------------------------------------------
-- Workout categories + exercise catalog, seeded from
-- https://github.com/hasaneyldrm/exercises-dataset (MIT-licensed data).
--
-- IMPORTANT — media rights: image_path/gif_path/attribution below are
-- reference metadata only. The source repo's images/GIFs are Gym visual's
-- copyrighted media, redistributed there under a specific permission that
-- does NOT extend to downstream reuse ("this repository does not grant you
-- any rights to the media beyond what Gym visual's terms allow" — see that
-- repo's NOTICE.md). Do not display these images/GIFs on the live site
-- without your own permission from Gym visual (https://gymvisual.com/).
-- Only the exercise data itself (name, muscles, equipment, instructions) is
-- MIT-licensed and clear to use freely.
-- ---------------------------------------------------------------------
-- NOTE: "Push/Pull" and "Upper body" overlap heavily in standard training
-- taxonomy (chest/back/arms/shoulders work is both at once). The import
-- below routes all of that muscle group into "Push/Pull" and leaves
-- "Upper body" seeded but unused (0 exercises) rather than guess a split —
-- recategorize with a plain UPDATE on exercises.workout_category_id if a
-- different split is wanted.
create table if not exists public.workout_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

insert into public.workout_categories (name) values
  ('Push/Pull'), ('Upper body'), ('Lower Body'), ('Mobility/Stabilization'), ('Core')
on conflict (name) do nothing;

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  external_id text unique, -- the dataset's own zero-padded id, e.g. "0001"
  name text not null,
  workout_category_id uuid references public.workout_categories(id),
  body_part text,
  target_muscle text,
  secondary_muscles text[],
  equipment text,
  instructions text,
  -- Reference metadata only — see media-rights note above.
  image_path text,
  gif_path text,
  attribution text,
  created_at timestamptz not null default now()
);

create index if not exists exercises_workout_category_id_idx on public.exercises (workout_category_id);

alter table public.workout_categories enable row level security;
alter table public.exercises enable row level security;
grant all on public.workout_categories to service_role;
grant all on public.exercises to service_role;
