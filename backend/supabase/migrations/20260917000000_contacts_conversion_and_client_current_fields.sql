-- Two additions:
--
-- 1. contacts -> clients conversion tracking: when a lead captured by
--    /api/contact becomes an actual client, converted_client_id records
--    which client row they became.
--
-- 2. Denormalized "current offering" / "current nutrition plan" on clients,
--    for fast queries ("show me clients with no nutrition plan") without a
--    join. client_offerings and client_nutrition_plans remain the source of
--    truth for full history; these two columns are kept in sync with
--    triggers so they can never drift from "the row with end_date is null"
--    in each join table.

alter table public.contacts
  add column if not exists converted_client_id uuid references public.clients(id),
  add column if not exists converted_at timestamptz;

create index if not exists contacts_converted_client_id_idx on public.contacts (converted_client_id);

alter table public.clients
  add column if not exists current_offering_id uuid references public.offerings(id),
  add column if not exists current_nutrition_plan_id uuid references public.nutrition_plans(id);

-- ---------------------------------------------------------------------
-- Sync triggers. Each recomputes the affected client's "current" column as
-- whichever of their join-table rows has end_date is null (the active one),
-- breaking ties by the latest start_date if more than one is somehow open.
-- Fires on insert/update/delete so closing an enrollment (setting end_date)
-- correctly clears back to the next-active row, or to null if there isn't one.
-- ---------------------------------------------------------------------
create or replace function public.sync_client_current_offering()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_client_id uuid := coalesce(new.client_id, old.client_id);
begin
  update public.clients
  set current_offering_id = (
    select offering_id from public.client_offerings
    where client_id = affected_client_id and end_date is null
    order by start_date desc
    limit 1
  )
  where id = affected_client_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists client_offerings_sync_current on public.client_offerings;
create trigger client_offerings_sync_current
  after insert or update or delete on public.client_offerings
  for each row execute function public.sync_client_current_offering();

create or replace function public.sync_client_current_nutrition_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_client_id uuid := coalesce(new.client_id, old.client_id);
begin
  update public.clients
  set current_nutrition_plan_id = (
    select plan_id from public.client_nutrition_plans
    where client_id = affected_client_id and end_date is null
    order by start_date desc
    limit 1
  )
  where id = affected_client_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists client_nutrition_plans_sync_current on public.client_nutrition_plans;
create trigger client_nutrition_plans_sync_current
  after insert or update or delete on public.client_nutrition_plans
  for each row execute function public.sync_client_current_nutrition_plan();

-- Backfill in case either join table already has rows predating this migration.
update public.clients c
set current_offering_id = (
  select offering_id from public.client_offerings
  where client_id = c.id and end_date is null
  order by start_date desc
  limit 1
);

update public.clients c
set current_nutrition_plan_id = (
  select plan_id from public.client_nutrition_plans
  where client_id = c.id and end_date is null
  order by start_date desc
  limit 1
);
