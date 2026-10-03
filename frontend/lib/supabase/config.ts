/**
 * Supabase Auth's public URL and anon key, or null when either is unset.
 *
 * middleware.ts and the root layout check the session on every request, so
 * a deployment missing these (e.g. before scripts/wire-up-supabase-anon-key-prod.sh
 * has been run for that environment) must degrade to "nobody is signed in"
 * rather than throwing: a throw there takes down every page, public ones
 * included. Protected routes still redirect to /login, so this fails closed.
 */
export function getSupabaseAuthConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
