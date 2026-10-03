import { NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-only client roster (JSON). middleware.ts already hides /admin/* and
 * /api/admin/* behind a genuine 404 for non-admins based on the JWT claim,
 * but this route independently re-verifies admin status against the
 * database before touching anything — see lib/auth.ts's verifyIsAdmin().
 */
export async function GET() {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    let query = getDb()
      .from('clients')
      .select(
        'id,first_name,last_name,email,auth_user_id,offerings:current_offering_id(name),nutrition_plans:current_nutrition_plan_id(name)'
      );

    query = query.order('last_name', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ clients: data ?? [] });
  } catch (err) {
    console.error('[admin/clients] list failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
