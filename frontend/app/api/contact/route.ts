import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
// Never cache a form submission endpoint.
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/**
 * Lead capture. Replaces the old standalone Express backend, which could not
 * run on Vercel (it only called listen() outside production and exported no
 * serverless handler) — so every submission from the live site was failing
 * against the visitor's own localhost.
 *
 * Note there is deliberately no GET here. The previous Express router exposed
 * GET /all, which returned every lead's name, email and phone with no
 * authentication at all.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  // Honeypot: real users never fill a hidden field. Bots usually do.
  // Return 200 so the bot believes it succeeded and does not retry.
  if (clean(body.company, 100)) {
    return NextResponse.json({ success: true });
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 40);

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = 'First name is required.';
  if (!lastName) fieldErrors.lastName = 'Last name is required.';
  if (!email) fieldErrors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email address.';

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 }
    );
  }

  try {
    const { error } = await getDb().from('contacts').insert({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      email,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    // Log server-side for debugging, but never leak internals to the client.
    console.error('[contact] insert failed:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          'Something went wrong on our end. Please email us directly and we will get right back to you.',
      },
      { status: 500 }
    );
  }
}
