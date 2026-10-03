import { getDb } from '@/lib/supabaseAdmin';

/**
 * Members-only exercise catalog, read from the public.exercise_catalog view
 * (backend/supabase/migrations/20261001000000_add_exercise_movement_patterns.sql).
 *
 * SECURITY: server-only (uses the service-role client). Only call this after
 * the visitor's library access has been verified.
 */

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  secondary: string[];
  category: string | null;
  pattern: string;
  equipment: string;
  instructions: string | null;
};

// Supabase's API caps a response at 1,000 rows, and the catalog is larger.
const PAGE_SIZE = 1000;

type CatalogRow = {
  id: string;
  name: string;
  body_part: string | null;
  target_muscle: string | null;
  secondary_muscles: string[] | null;
  category: string | null;
  movement_pattern: string | null;
  equipment: string | null;
  instructions: string | null;
};

export async function getExercises(): Promise<Exercise[]> {
  const rows: CatalogRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await getDb()
      .from('exercise_catalog')
      .select(
        'id, name, body_part, target_muscle, secondary_muscles, category, movement_pattern, equipment, instructions'
      )
      .order('name')
      .order('id')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data as CatalogRow[]));
    if (data.length < PAGE_SIZE) break;
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    bodyPart: r.body_part ?? '',
    target: r.target_muscle ?? '',
    secondary: r.secondary_muscles ?? [],
    category: r.category,
    pattern: r.movement_pattern ?? 'Unclassified',
    equipment: r.equipment ?? '',
    instructions: r.instructions,
  }));
}

export async function getPatternDescriptions(): Promise<Record<string, string>> {
  const { data, error } = await getDb().from('movement_patterns').select('name, description');
  if (error) throw error;
  return Object.fromEntries(data.map((p) => [p.name, p.description ?? '']));
}
