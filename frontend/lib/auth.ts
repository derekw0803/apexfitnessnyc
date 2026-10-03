import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { getDb } from '@/lib/supabaseAdmin';
import { getSupabaseAuthConfig } from '@/lib/supabase/config';

export type SessionClaims = {
  sub: string;
  email?: string;
  is_admin: boolean;
  client_id: string | null;
};

/**
 * Reads and verifies the current session's JWT, returning its claims —
 * including is_admin/client_id, stamped in by the Custom Access Token Hook
 * (backend/supabase/migrations/20260918000000_client_auth.sql). This is the
 * fast path: no database query, the claims come straight off the verified
 * token. getClaims() actually validates the JWT (locally via WebCrypto, or
 * against the auth server for older symmetric-secret projects) rather than
 * trusting an unverified cookie value — this is Supabase's currently
 * documented replacement for getSession()/getUser() when you need more than
 * bare identity.
 *
 * Returns null when there is no session at all. Never throws for "not
 * logged in" — callers branch on the return value (redirect vs. 401 JSON
 * vs. 404, depending on what kind of route this is), so this function stays
 * a plain data source, not a control-flow helper.
 */
export async function getSessionClaims(): Promise<SessionClaims | null> {
  // Auth not configured for this deployment: nobody can be signed in.
  if (!getSupabaseAuthConfig()) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return null;

  const claims = data.claims;
  return {
    sub: claims.sub as string,
    email: claims.email as string | undefined,
    is_admin: claims.is_admin === true,
    client_id: (claims.client_id as string | undefined) ?? null,
  };
}

/**
 * Fast-path admin check from the JWT claim alone. Fine for page
 * rendering/routing decisions. NOT sufficient on its own to gate a
 * destructive or sensitive write — see verifyIsAdmin() below for why.
 */
export function isAdminClaims(claims: SessionClaims | null): boolean {
  return claims?.is_admin === true;
}

/**
 * Database re-check of admin status, bypassing the JWT claim entirely.
 *
 * A claim baked into a JWT only changes when that JWT refreshes (Supabase
 * access tokens default to a 1-hour lifetime) — revoking someone's admin
 * status doesn't retroactively invalidate a token they're already holding.
 * Every admin-gated *write* (inviting a client, revoke/purge, recording an
 * expense) must call this before actually executing, rather than trusting
 * the claim alone. The claim is the fast path for routing/UI; this is the
 * actual gate on anything destructive.
 */
export async function verifyIsAdmin(authUserId: string): Promise<boolean> {
  const { data, error } = await getDb()
    .from('admins')
    .select('auth_user_id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  return !error && data !== null;
}

/**
 * Client-triggered account deletion: revokes login access only. The
 * client's clients row and all related business history (health_metrics,
 * training_payments, client_offerings, client_nutrition_plans) are left
 * intact — clients.auth_user_id clears itself via the column's
 * "on delete set null" foreign key, no manual null-out needed.
 */
export async function deactivateClientAccount(authUserId: string): Promise<{ error: string | null }> {
  const { error } = await getDb().auth.admin.deleteUser(authUserId);
  return { error: error?.message ?? null };
}

/**
 * Admin-only full erasure: deletes the clients row (cascading through
 * health_metrics/nutrition_logs/training_payments/client_offerings/
 * client_nutrition_plans via their existing "on delete cascade" foreign
 * keys) and the auth identity. Irreversible — callers must have already
 * confirmed this is genuinely wanted, not the default delete path.
 */
export async function purgeClientAccount(
  clientId: string,
  authUserId: string | null
): Promise<{ error: string | null }> {
  const { error: dbError } = await getDb().from('clients').delete().eq('id', clientId);
  if (dbError) return { error: dbError.message };

  if (authUserId) {
    const { error: authError } = await getDb().auth.admin.deleteUser(authUserId);
    if (authError) return { error: authError.message };
  }

  return { error: null };
}
