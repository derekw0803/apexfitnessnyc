import { createBrowserClient } from '@supabase/ssr';

/**
 * Client-component Supabase client, authenticated with the public anon key.
 *
 * This is used ONLY to call Supabase Auth endpoints (sign in, sign out,
 * update password) from 'use client' components — never to read/write
 * public-schema tables. Every table in this project has RLS enabled with no
 * anon/authenticated policies (see backend/supabase/migrations/), so a
 * query through this client against public.* would just get an empty
 * result — all real data access goes through server-side code using
 * lib/supabaseAdmin.ts's service-role client instead.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
