import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook receiver.
 *
 * This is the ONLY trustworthy signal that a payment succeeded. The browser
 * being redirected to /checkout/success proves nothing — anyone can visit that
 * URL directly. Fulfilment must hang off this endpoint.
 *
 * We read the raw request body with request.text(); parsing it first would
 * break signature verification.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    // A failure here means the request was not signed by Stripe. Reject it.
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only fulfil once payment actually cleared.
        if (session.payment_status !== 'paid') break;

        const { error } = await getDb()
          .from('orders')
          .upsert(
            {
              stripe_session_id: session.id,
              stripe_payment_intent: (session.payment_intent as string) ?? null,
              plan_id: session.metadata?.plan_id ?? null,
              plan_name: session.metadata?.plan_name ?? null,
              requires_booking: session.metadata?.requires_booking === 'true',
              amount_total: session.amount_total ?? 0,
              currency: session.currency ?? 'usd',
              customer_email:
                session.customer_details?.email ?? session.customer_email ?? null,
              customer_name: session.customer_details?.name ?? null,
              customer_phone: session.customer_details?.phone ?? null,
              status: 'paid',
            },
            // Stripe can deliver the same event more than once. Upserting on the
            // session id makes replays harmless.
            { onConflict: 'stripe_session_id' }
          );

        if (error) throw error;
        console.log('[webhook] recorded order for session', session.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent = charge.payment_intent as string | null;
        if (!paymentIntent) break;

        const { error } = await getDb()
          .from('orders')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent', paymentIntent);

        if (error) throw error;
        break;
      }

      default:
        // Unhandled event types are fine — acknowledge so Stripe stops retrying.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Return 500 so Stripe retries; the event was genuine, our handling failed.
    console.error('[webhook] handler failed for', event.type, err);
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 });
  }
}
