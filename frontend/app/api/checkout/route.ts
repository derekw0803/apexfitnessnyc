import { NextRequest, NextResponse } from 'next/server';
import { getPlan } from '@/lib/plans';
import { getStripe, getBaseUrl } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a Stripe Checkout Session and returns its hosted URL.
 *
 * The browser sends only a plan id. The price is resolved server-side from the
 * canonical catalogue in lib/plans.ts, so a tampered request cannot change the
 * amount charged.
 *
 * Card details are collected by Stripe on Stripe's own domain. We never see,
 * transmit, or store a card number — which is what keeps this out of PCI scope.
 */
export async function POST(request: NextRequest) {
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
      // Stripe collects the email; we use it to fulfil and to contact the client.
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        requires_booking: plan.requiresBooking ? 'true' : 'false',
      },
    });

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.');
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] session creation failed:', err);
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again or contact us.' },
      { status: 500 }
    );
  }
}
