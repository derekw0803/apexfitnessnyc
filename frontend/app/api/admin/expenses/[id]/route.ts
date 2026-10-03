import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Deletes a single business expense.
 *
 * Same admin-gate-first posture as the collection route: the 404 returned
 * for "not signed in" and "signed in but not an admin" is indistinguishable
 * on the wire from the 404 returned for "no expense with this id" — that's
 * intentional (hidden-by-rule), tests just verify the DB call was never
 * reached for the first two cases.
 */
export async function DELETE(
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
      .from('expenses')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/expenses/:id] delete failed:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
