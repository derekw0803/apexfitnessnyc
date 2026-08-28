import Link from 'next/link';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Payment Confirmed | APEX',
  robots: { index: false, follow: false },
};

/**
 * Post-checkout confirmation.
 *
 * We re-fetch the session from Stripe rather than trusting query params, so
 * this page cannot be spoofed by visiting the URL with a made-up session id.
 * Fulfilment itself still happens in the webhook — this page is only display.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let planName = '';
  let email = '';
  let amount = '';
  let requiresBooking = false;

  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === 'paid';
      planName = session.metadata?.plan_name ?? '';
      requiresBooking = session.metadata?.requires_booking === 'true';
      email = session.customer_details?.email ?? '';
      if (session.amount_total != null) {
        amount = (session.amount_total / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: (session.currency ?? 'usd').toUpperCase(),
        });
      }
    } catch {
      paid = false;
    }
  }

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 720, textAlign: 'center' }}>
        {paid ? (
          <>
            <div className="section-label" style={{ justifyContent: 'center' }}>Confirmed</div>
            <h2 className="section-h2" style={{ margin: '0.5rem 0 1.5rem' }}>You&apos;re In</h2>

            <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
              Payment received{amount && ` — ${amount}`}
              {planName && ` for the ${planName}`}.
              {email && (
                <>
                  {' '}A receipt is on its way to <strong style={{ color: 'var(--cream)' }}>{email}</strong>.
                </>
              )}
            </p>

            <div style={{
              background: 'var(--charcoal)', border: '1px solid var(--border)',
              padding: '2.5rem', textAlign: 'left',
            }}>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'var(--gold)', fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}>
                What happens next
              </h3>

              <ol style={{ color: 'var(--cream)', fontSize: '0.95rem', lineHeight: 2, paddingLeft: '1.2rem' }}>
                <li>You&apos;ll get a payment receipt from Stripe by email.</li>
                <li>
                  A coach will contact you within 24 hours to collect your intake details and
                  starting metrics.
                </li>
                {requiresBooking && (
                  <li>
                    {bookingUrl ? (
                      <>
                        Book your first session here:{' '}
                        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
                          choose a time
                        </a>
                        .
                      </>
                    ) : (
                      <>We&apos;ll send you a scheduling link to book your first session.</>
                    )}
                  </li>
                )}
                <li>Your program materials are delivered once intake is complete.</li>
              </ol>
            </div>

            <p style={{ marginTop: '2rem', color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Questions before then? <Link href="/contact" style={{ color: 'var(--gold)' }}>Get in touch</Link>.
            </p>
          </>
        ) : (
          <>
            <div className="section-label" style={{ justifyContent: 'center' }}>Pending</div>
            <h2 className="section-h2" style={{ margin: '0.5rem 0 1.5rem' }}>We couldn&apos;t confirm this payment</h2>
            <p className="section-sub" style={{ marginBottom: '2rem' }}>
              If you just paid, your bank may still be processing it and your receipt will arrive
              shortly. If you were charged and don&apos;t hear from us within an hour, contact us and
              we&apos;ll sort it out straight away.
            </p>
            <Link href="/contact" className="btn-gold">Contact Us</Link>
          </>
        )}
      </div>
    </div>
  );
}
