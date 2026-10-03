-- Links an existing clients row to a Supabase Auth identity, and adds a
-- small explicit admin allowlist.
--
-- Authorization is JWT-based, not RLS-based: a Custom Access Token Hook
-- (below) stamps is_admin/client_id into the JWT at token-issuance time,
-- read directly off the token by frontend/lib/auth.ts and middleware.ts —
-- no per-request database round-trip for the common case. This is
-- consistent with the rest of this schema, where the browser never queries
-- Postgres directly with any key but service_role; RLS stays enabled with
-- no anon/authenticated policies everywhere, exactly as before.

alter table public.clients
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
  -- on delete set null (not cascade): deleting the auth identity revokes
  -- login access only. The client's business/payment/health history must
  -- survive account deletion.

create unique index if not exists clients_auth_user_id_idx
  on public.clients (auth_user_id) where auth_user_id is not null;
  -- Partial + unique: at most one auth identity per client, at most one
  -- client per auth identity, any number of not-yet-linked (null) clients.

create table if not exists public.admins (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
grant all on public.admins to service_role;
-- No anon/authenticated policies, deliberately: even a logged-in client
-- must never be able to select this table (would let anyone enumerate who
-- the admin is). Admin status is resolved via the JWT claim below (and via
-- a direct service-role re-check before any admin-gated write executes),
-- never a client-side query against this table.

-- ---------------------------------------------------------------------
-- Custom Access Token Hook: stamps is_admin and client_id into every JWT
-- Supabase Auth issues for a user. Must be registered as the project's
-- Custom Access Token hook in the Supabase dashboard (Authentication ->
-- Hooks) — creating the function here does not activate it by itself.
-- ---------------------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claims jsonb;
  user_id uuid := (event->>'user_id')::uuid;
  is_admin_user boolean;
  linked_client_id uuid;
begin
  select exists(select 1 from public.admins where auth_user_id = user_id)
    into is_admin_user;

  select id into linked_client_id
  from public.clients
  where auth_user_id = user_id;

  claims := coalesce(event->'claims', '{}'::jsonb);
  claims := jsonb_set(claims, '{is_admin}', to_jsonb(is_admin_user));
  if linked_client_id is not null then
    claims := jsonb_set(claims, '{client_id}', to_jsonb(linked_client_id));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;
