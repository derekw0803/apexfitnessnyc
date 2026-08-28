-- Orders recorded from verified Stripe webhook events.
--
-- Written only by the server (service_role). Row Level Security is enabled with
-- no policies for anon/authenticated, so this table is unreadable from the
-- browser even with the anon key — same posture as public.contacts.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  plan_id text,
  plan_name text,
  requires_booking boolean not null default false,
  amount_total integer not null default 0,
  currency text not null default 'usd',
  customer_email text,
  customer_name text,
  customer_phone text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_email_idx on public.orders (customer_email);
create index if not exists orders_payment_intent_idx on public.orders (stripe_payment_intent);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- No policies for anon/authenticated => all access denied by default.
-- service_role bypasses RLS and is used exclusively by the server.
grant all on public.orders to service_role;
