-- Training-client payment records, migrated from freeform Apple Notes
-- ("<name> training tab") into structured storage.
--
-- Written only by the server (service_role). Row Level Security is enabled with
-- no policies for anon/authenticated, so this table is unreadable from the
-- browser even with the anon key — same posture as public.contacts and
-- public.orders.

create table if not exists public.training_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.training_payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.training_clients(id) on delete cascade,
  payment_date date not null,
  amount_cents integer not null,
  -- Freeform context that didn't fit date/amount, e.g. "James paid 20 extra",
  -- "paid 1900, owes 500" — preserved rather than discarded or netted out.
  note text,
  created_at timestamptz not null default now()
);

create index if not exists training_payments_client_id_idx on public.training_payments (client_id);
create index if not exists training_payments_payment_date_idx on public.training_payments (payment_date desc);

alter table public.training_clients enable row level security;
alter table public.training_payments enable row level security;

-- No policies for anon/authenticated => all access denied by default.
-- service_role bypasses RLS and is used exclusively by the server.
grant all on public.training_clients to service_role;
grant all on public.training_payments to service_role;
