import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin, purgeClientAccount } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIRM_PHRASE = 'PERMANENTLY DELETE';

/**
 * Admin-only, irreversible: erases the clients row (cascading through
 * health_metrics/training_payments/client_offerings/client_nutrition_plans)
 * and the auth identity. The confirm phrase is checked BEFORE any DB lookup
 * or call to purgeClientAccount — a missing/wrong confirm never gets
 * anywhere near the destructive path, by construction, not just by caller
 * discipline.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (body.confirm !== CONFIRM_PHRASE) {
    return NextResponse.json(
      { error: `Type "${CONFIRM_PHRASE}" exactly to confirm.` },
      { status: 400 }
    );
  }

  const { id } = await params;

  try {
    const { data, error } = await getDb()
      .from('clients')
      .select('id,auth_user_id')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { error: purgeError } = await purgeClientAccount(data.id, data.auth_user_id ?? null);
    if (purgeError) throw new Error(purgeError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/clients/purge] failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
