-- Business expense tracking. Admin-only, no client relationship — this is
-- business overhead (equipment, rent, supplies, etc.), not client billing.
-- Same posture as every other table: RLS enabled, no policies, service_role
-- only. Write access is gated at the application layer (verifyIsAdmin() in
-- frontend/lib/auth.ts, re-checked before any write executes), same as the
-- client-invite/revoke/purge admin actions.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  amount_cents integer not null,
  category text,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_expense_date_idx on public.expenses (expense_date desc);

alter table public.expenses enable row level security;
grant all on public.expenses to service_role;
