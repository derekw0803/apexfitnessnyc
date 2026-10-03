import Link from 'next/link';
import { getSessionClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { PLANS, formatDollars } from '@/lib/plans';
import PayButton from './pay-button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Payments | APEX',
  robots: { index: false, follow: false },
};

type PaymentRow = {
  id: string;
  payment_date: string;
  amount_cents: number;
  note: string | null;
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  fontSize: '0.8rem',
};

/**
 * Authenticated client payments page: current program, a "Pay Now" flow
 * against the same plan catalogue as the public /pricing page, and this
 * client's payment history. Protected by middleware.ts (any authenticated
 * user reaches here), but a signed-in account without a linked client
 * profile (claims.client_id === null) gets a clear message instead of a
 * crash — that's a real, expected state (e.g. an admin-only account).
 */
export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; checkout?: string }>;
}) {
  const { paid, checkout } = await searchParams;
  const claims = await getSessionClaims();

  if (!claims) {
    return (
      <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="section-inner" style={{ maxWidth: 640 }}>
          <div className="section-label">Payments</div>
          <h2 className="section-h2">Sign In Required</h2>
          <p className="section-sub">You need to be signed in to view this page.</p>
          <Link href="/login" className="btn-gold" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!claims.client_id) {
    return (
      <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="section-inner" style={{ maxWidth: 640 }}>
          <div className="section-label">Payments</div>
          <h2 className="section-h2">No Client Profile Linked</h2>
          <p className="section-sub">
            This account isn&apos;t linked to a client profile, so there&apos;s nothing to bill here.
            If that&apos;s unexpected, get in touch and we&apos;ll sort it out.
          </p>
          <Link href="/contact" className="btn-gold" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Contact Us
          </Link>
        </div>
      </div>
    );
  }

  const db = getDb();

  const [{ data: client }, { data: payments }] = await Promise.all([
    db
      .from('clients')
      .select('current_offering_id, offerings!current_offering_id(name)')
      .eq('id', claims.client_id)
      .maybeSingle(),
    db
      .from('training_payments')
      .select('id, payment_date, amount_cents, note')
      .eq('client_id', claims.client_id)
      .order('payment_date', { ascending: false }),
  ]);

  const offeringName =
    (client?.offerings as { name?: string } | { name?: string }[] | null | undefined) instanceof
    Array
      ? (client?.offerings as { name?: string }[])[0]?.name ?? null
      : (client?.offerings as { name?: string } | null)?.name ?? null;

  const paymentRows = (payments ?? []) as PaymentRow[];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Payments</div>
          <h2 className="section-h2" style={{ margin: '0.5rem 0' }}>Your Account</h2>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: 600 }}>
            Current program, one-time payments, and your full payment history.
          </p>
        </div>

        {paid === '1' && (
          <p
            role="status"
            style={{ textAlign: 'center', marginBottom: '2rem', color: '#4ade80', fontSize: '0.9rem' }}
          >
            Payment received. Thank you — a receipt is on its way to your email.
          </p>
        )}
        {checkout === 'cancelled' && (
          <p
            role="status"
            style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}
          >
            Checkout cancelled. Nothing was charged.
          </p>
        )}

        {/* Current program */}
        <div
          style={{
            background: 'var(--charcoal)', border: '1px solid var(--border)',
            padding: '2rem 2.5rem', marginBottom: '3rem',
          }}
        >
          <h3 style={{ ...labelStyle, marginBottom: '0.75rem' }}>Current Program</h3>
          <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}>
            {offeringName ?? 'No active program on file.'}
          </p>
        </div>

        {/* Pay now */}
        <div style={{ marginBottom: '4rem' }}>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--cream)',
              marginBottom: '1.5rem', letterSpacing: '0.03em',
            }}
          >
            Make a Payment
          </h3>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: 'var(--charcoal)',
                  border: plan.highlight ? '2px solid var(--gold)' : '1px solid var(--border)',
                  padding: '2rem', display: 'flex', flexDirection: 'column',
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem',
                    color: plan.highlight ? 'var(--gold)' : 'var(--cream)', marginBottom: '0.5rem',
                  }}
                >
                  {plan.name}
                </h4>
                <p style={{ color: 'var(--cream)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  ${formatDollars(plan.amount)}
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {plan.desc}
                </p>
                <PayButton planId={plan.id} highlight={plan.highlight} />
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--cream)',
              marginBottom: '1.5rem', letterSpacing: '0.03em',
            }}
          >
            Payment History
          </h3>

          {paymentRows.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No payments on file yet.</p>
          ) : (
            <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', ...labelStyle }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', ...labelStyle }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '1rem', ...labelStyle }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: 'var(--cream)', fontSize: '0.9rem' }}>
                        {row.payment_date}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--cream)', fontSize: '0.9rem' }}>
                        ${formatDollars(row.amount_cents)}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        {row.note ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
