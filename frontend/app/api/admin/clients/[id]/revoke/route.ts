import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin, deactivateClientAccount } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-only: revokes a client's portal login only. History
 * (health_metrics/training_payments/client_offerings/client_nutrition_plans)
 * is left intact — clients.auth_user_id clears itself via "on delete set
 * null", no manual null-out needed here.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  try {
    const { data, error } = await getDb()
      .from('clients')
      .select('auth_user_id')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!data.auth_user_id) {
      return NextResponse.json(
        { error: 'This client has no portal access to revoke.' },
        { status: 400 }
      );
    }

    const { error: revokeError } = await deactivateClientAccount(data.auth_user_id);
    if (revokeError) throw new Error(revokeError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/clients/revoke] failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
