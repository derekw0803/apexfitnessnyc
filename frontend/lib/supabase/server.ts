import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server Component / Route Handler Supabase client. Reads/writes the auth
 * session cookie via next/headers. Like lib/supabase/browser.ts, this is
 * for Auth endpoints only (getUser, signOut) — real data access stays on
 * lib/supabaseAdmin.ts's service-role client.
 *
 * A Server Component can't actually write cookies (Next.js throws if you
 * try outside a Server Action / Route Handler) — the try/catch below is not
 * error-hiding, it's the documented way to let a session-refresh write
 * silently no-op there, since middleware.ts is what actually persists a
 * refreshed session on every request. See Supabase's own Next.js App
 * Router guidance for this exact pattern.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware.ts refreshes the
            // session on the next request instead.
          }
        },
      },
    }
  );
}
