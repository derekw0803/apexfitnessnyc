-- Movement patterns ("functionality") for the exercise catalog, alongside
-- the existing body_part and workout_category_id. Each exercise is
-- classified into exactly one pattern by scripts/exercise_taxonomy.py at
-- import time; re-run scripts/import_exercises.py after applying this
-- migration to populate exercises.movement_pattern_id.
--
-- The pattern names here must match MOVEMENT_PATTERNS in that script.
--
-- Same posture as every other table here: RLS enabled, no policies for
-- anon/authenticated (deny by default), service_role only.

create table if not exists public.movement_patterns (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

insert into public.movement_patterns (name, description) values
  ('Horizontal Push', 'Pressing away from the chest: bench press, push-ups, chest press.'),
  ('Vertical Push', 'Pressing overhead or down: shoulder press, dips, handstand push-ups.'),
  ('Horizontal Pull', 'Pulling toward the torso: rows, inverted rows, rear delt rows.'),
  ('Vertical Pull', 'Pulling from overhead or up the body: pull-ups, pulldowns, upright rows.'),
  ('Squat', 'Bilateral knee-dominant: squats, leg press, hack squat.'),
  ('Hinge', 'Hip-dominant: deadlifts, RDLs, good mornings, hip thrusts, back extensions.'),
  ('Lunge', 'Single-leg knee-dominant: lunges, split squats, step-ups, pistols.'),
  ('Carry', 'Loaded carries: farmers walk, overhead carry.'),
  ('Rotation', 'Rotation and anti-rotation: twists, Pallof press, windmills.'),
  ('Core Flexion', 'Spinal and hip flexion: crunches, sit-ups, leg raises, side bends.'),
  ('Core Stability', 'Bracing and anti-extension: planks, rollouts, dead bugs, levers.'),
  ('Power', 'Explosive and Olympic: cleans, snatches, swings, jumps, throws.'),
  ('Isolation', 'Single-joint: curls, extensions, raises, flyes, calf raises, shrugs.'),
  ('Cardio', 'Conditioning: running, cycling, burpees, jump rope.'),
  ('Mobility', 'Stretches and range-of-motion work.')
on conflict (name) do nothing;

alter table public.exercises
  add column if not exists movement_pattern_id uuid references public.movement_patterns(id);

create index if not exists exercises_movement_pattern_id_idx on public.exercises (movement_pattern_id);
create index if not exists exercises_body_part_idx on public.exercises (body_part);

alter table public.movement_patterns enable row level security;
grant all on public.movement_patterns to service_role;

-- One flat, human-readable row per exercise for browsing and filtering
-- (e.g. where body_part = 'upper legs' and movement_pattern = 'Hinge').
-- security_invoker so the underlying tables' RLS still applies.
create or replace view public.exercise_catalog
with (security_invoker = true) as
select
  e.id,
  e.external_id,
  e.name,
  e.body_part,
  e.target_muscle,
  e.secondary_muscles,
  wc.name as category,
  mp.name as movement_pattern,
  e.equipment,
  e.instructions
from public.exercises e
left join public.workout_categories wc on wc.id = e.workout_category_id
left join public.movement_patterns mp on mp.id = e.movement_pattern_id;

revoke all on public.exercise_catalog from anon, authenticated;
grant select on public.exercise_catalog to service_role;
