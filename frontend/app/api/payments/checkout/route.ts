import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth';
import { getPlan } from '@/lib/plans';
import { getStripe, getBaseUrl } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a Stripe Checkout Session for an authenticated client paying from
 * their own /payments page.
 *
 * This is a SEPARATE route from /api/checkout (the public, anonymous
 * pricing-page flow) — that route must keep working exactly as-is for
 * visitors who aren't logged in. This one additionally stamps the session's
 * metadata with client_id, resolved server-side from the verified session
 * (never trusted from the request body — same principle as never trusting a
 * client-supplied price), so the webhook can attribute the payment to the
 * right client in training_payments.
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();

  if (!claims) {
    return NextResponse.json({ error: 'You must be signed in to pay.' }, { status: 401 });
  }

  if (!claims.client_id) {
    return NextResponse.json(
      { error: 'No client profile is linked to this account. Contact us to get set up.' },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const planId = typeof body.planId === 'string' ? body.planId : '';
  const plan = getPlan(planId);

  if (!plan) {
    return NextResponse.json({ error: 'Unknown plan selected.' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan.amount,
            product_data: {
              name: plan.name,
              description: plan.desc,
            },
          },
        },
      ],
      customer_email: claims.email,
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      success_url: `${baseUrl}/payments?paid=1`,
      cancel_url: `${baseUrl}/payments?checkout=cancelled`,
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        requires_booking: plan.requiresBooking ? 'true' : 'false',
        client_id: claims.client_id,
      },
    });

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.');
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[payments/checkout] session creation failed:', err);
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again or contact us.' },
      { status: 500 }
    );
  }
}
