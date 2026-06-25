alter table public.contacts enable row level security;

-- No policies are defined for anon/authenticated roles, so all access is
-- denied by default for those roles. Only service_role (used exclusively by
-- the backend) can read/write, since it bypasses RLS entirely.
