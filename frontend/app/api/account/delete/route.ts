import { NextResponse } from 'next/server';
import { getSessionClaims, deactivateClientAccount } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Client-triggered account deletion. Per the approved plan's policy
 * decision, this DEACTIVATES LOGIN ONLY — payment and health history are
 * kept (clients.auth_user_id clears itself via "on delete set null", no
 * manual null-out needed here). Full erasure is a separate, admin-only
 * action (lib/auth.ts's purgeClientAccount) and is not reachable from this
 * route.
 *
 * Deleting the auth user invalidates any session tokens tied to it, so the
 * caller's session is no longer valid after this succeeds — the frontend
 * redirects to `/` on a successful response.
 */
export async function POST() {
  const claims = await getSessionClaims();

  if (!claims) {
    return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
  }

  const { error } = await deactivateClientAccount(claims.sub);

  if (error) {
    console.error('[account/delete] deactivation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, redirectTo: '/' });
}
