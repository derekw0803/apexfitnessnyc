import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/** Full client record for the admin detail page. */
export async function GET(
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
      .select(
        'id,first_name,last_name,email,phone,address,created_at,auth_user_id,current_offering_id,current_nutrition_plan_id'
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ client: data });
  } catch (err) {
    console.error('[admin/clients/[id]] get failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}

/**
 * Updates profile fields only (first_name, last_name, email, phone,
 * address). Deliberately never accepts current_offering_id,
 * current_nutrition_plan_id (DB-trigger derived from enrollment history) or
 * auth_user_id (owned by the invite/revoke/purge routes) — those fields are
 * not read from the request body at all, so there is nothing a caller could
 * smuggle in to touch them.
 */
export async function PATCH(
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

  const firstName = clean(body.first_name, 100);
  const lastName = clean(body.last_name, 100);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 40);
  const address = clean(body.address, 255);

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.first_name = 'First name is required.';
  if (!lastName) fieldErrors.last_name = 'Last name is required.';
  if (!email) fieldErrors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email address.';

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await getDb()
      .from('clients')
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        address: address || null,
      })
      .eq('id', id)
      .select('id,first_name,last_name,email,phone,address')
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ client: data });
  } catch (err) {
    console.error('[admin/clients/[id]] update failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 }
    );
  }
}
