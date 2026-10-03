import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { getBaseUrl } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Admin-only: sends a Supabase Auth invite to the given email and links the
 * resulting auth identity to this client's row (auth_user_id + email are
 * only ever written together here, so they can never drift apart).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  try {
    const { data, error } = await getDb().auth.admin.inviteUserByEmail(email, {
      redirectTo: `${getBaseUrl()}/auth/callback?next=/account/set-password`,
    });

    if (error || !data?.user) {
      console.error('[admin/clients/invite] inviteUserByEmail failed:', error);
      return NextResponse.json(
        { error: 'Could not send invite. The email may already be in use.' },
        { status: 400 }
      );
    }

    const { error: updateError } = await getDb()
      .from('clients')
      .update({ email, auth_user_id: data.user.id })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/clients/invite] failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
