-- Nutrition plan templates: prescribed multi-week protocols (full recipes,
-- macros, ingredients), distinct from public.nutrition_logs (which records
-- what a client actually ate on a given day). A plan is a reusable library
-- item; public.client_nutrition_plans assigns one to a client, mirroring
-- how public.client_offerings assigns an offering.
--
-- Same posture as every other table here: RLS enabled, no policies for
-- anon/authenticated (deny by default), service_role only.

create table if not exists public.nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.nutrition_plan_weeks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.nutrition_plans(id) on delete cascade,
  week_number integer not null,
  phase text,
  phase_description text,
  unique (plan_id, week_number)
);

create table if not exists public.nutrition_plan_days (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.nutrition_plan_weeks(id) on delete cascade,
  day_number integer not null,
  theme text,
  unique (week_id, day_number)
);

create table if not exists public.nutrition_plan_meals (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.nutrition_plan_days(id) on delete cascade,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner')),
  name text not null,
  time_of_day text,
  kcal integer,
  protein_g integer,
  carbs_g integer,
  fat_g integer,
  description text,
  -- [{"name": "...", "amount": "..."}, ...] — always scoped to exactly one
  -- meal in the source data, no cross-meal ingredient lookup need, so kept
  -- inline rather than a separate join table (same reasoning as the jsonb
  -- columns on public.health_metrics).
  ingredients jsonb,
  prep_instructions text
);

create table if not exists public.client_nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  plan_id uuid not null references public.nutrition_plans(id) on delete restrict,
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now()
);

create index if not exists nutrition_plan_weeks_plan_id_idx on public.nutrition_plan_weeks (plan_id);
create index if not exists nutrition_plan_days_week_id_idx on public.nutrition_plan_days (week_id);
create index if not exists nutrition_plan_meals_day_id_idx on public.nutrition_plan_meals (day_id);
create index if not exists client_nutrition_plans_client_id_idx on public.client_nutrition_plans (client_id);

alter table public.nutrition_plans enable row level security;
alter table public.nutrition_plan_weeks enable row level security;
alter table public.nutrition_plan_days enable row level security;
alter table public.nutrition_plan_meals enable row level security;
alter table public.client_nutrition_plans enable row level security;

grant all on public.nutrition_plans to service_role;
grant all on public.nutrition_plan_weeks to service_role;
grant all on public.nutrition_plan_days to service_role;
grant all on public.nutrition_plan_meals to service_role;
grant all on public.client_nutrition_plans to service_role;
