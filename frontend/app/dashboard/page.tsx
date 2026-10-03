import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getSessionClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { formatDollars } from '@/lib/plans';
import { formatDate, formatJsonbEntries } from './format';

type ClientRow = {
  first_name: string;
  last_name: string | null;
  current_offering_id: string | null;
  current_nutrition_plan_id: string | null;
};

type HealthMetricRow = {
  id: string;
  recorded_date: string;
  weight: number | null;
  body_fat_percent: number | null;
  testosterone_level: number | null;
  blood_oxygenation: number | null;
  macros: unknown;
  endurance: unknown;
  dietary_restrictions: string | null;
  one_rep_max: unknown;
};

type PaymentRow = {
  id: string;
  payment_date: string;
  amount_cents: number;
  note: string | null;
};

const cardStyle: CSSProperties = {
  background: 'var(--charcoal)',
  border: '1px solid var(--border)',
  padding: '2rem',
};

/**
 * Client dashboard — a server component. Everything here is fetched with
 * the service-role client (getDb()), scoped manually to the signed-in
 * client's own id, since every table has RLS-enabled-with-zero-policies by
 * design (see frontend/lib/supabaseAdmin.ts).
 */
export default async function DashboardPage() {
  const claims = await getSessionClaims();

  // middleware.ts already gates /dashboard to authenticated users, so this
  // is a defensive fallback, not the primary guard.
  if (!claims) {
    return <UnlinkedNotice message="You need to be signed in to view your dashboard." />;
  }

  if (!claims.client_id) {
    return (
      <UnlinkedNotice message="Your account isn't linked to a client profile yet. Contact your trainer to get set up." />
    );
  }

  const db = getDb();

  const { data: client } = await db
    .from('clients')
    .select('first_name, last_name, current_offering_id, current_nutrition_plan_id')
    .eq('id', claims.client_id)
    .maybeSingle<ClientRow>();

  if (!client) {
    return (
      <UnlinkedNotice message="We couldn't find your client profile. Contact your trainer to get this sorted out." />
    );
  }

  const [offeringResult, nutritionPlanResult, metricsResult, paymentsResult] = await Promise.all([
    client.current_offering_id
      ? db.from('offerings').select('name').eq('id', client.current_offering_id).maybeSingle<{ name: string }>()
      : Promise.resolve({ data: null }),
    client.current_nutrition_plan_id
      ? db
          .from('nutrition_plans')
          .select('name')
          .eq('id', client.current_nutrition_plan_id)
          .maybeSingle<{ name: string }>()
      : Promise.resolve({ data: null }),
    db
      .from('health_metrics')
      .select('id, recorded_date, weight, body_fat_percent, testosterone_level, blood_oxygenation, macros, endurance, dietary_restrictions, one_rep_max')
      .eq('client_id', claims.client_id)
      .order('recorded_date', { ascending: false })
      .limit(8)
      .returns<HealthMetricRow[]>(),
    db
      .from('training_payments')
      .select('id, payment_date, amount_cents, note')
      .eq('client_id', claims.client_id)
      .order('payment_date', { ascending: false })
      .returns<PaymentRow[]>(),
  ]);

  const offeringName = offeringResult.data?.name ?? null;
  const nutritionPlanName = nutritionPlanResult.data?.name ?? null;
  const metrics = metricsResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 960 }}>
        <div className="section-label">Members</div>
        <h2 id="dashboard" className="section-h2">
          Welcome back, {client.first_name}
        </h2>
        <p className="section-sub">
          Here&apos;s where your program, nutrition plan, health metrics, and payment history live.
        </p>

        {/* Current program */}
        <section style={{ marginTop: '3rem' }}>
          <SectionHeading label="Program" title="Current Offering" />
          <div style={cardStyle}>
            {offeringName ? (
              <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}>{offeringName}</p>
            ) : (
              <EmptyState text="No active offering on file yet. Contact your trainer to get enrolled." />
            )}
            {/* Same rule as lib/libraryAccess.ts: an active program unlocks the library. */}
            {client.current_offering_id && (
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/library" className="btn-gold">Open Exercise Library</Link>
              </div>
            )}
          </div>
        </section>

        {/* Nutrition plan */}
        <section style={{ marginTop: '2.5rem' }}>
          <SectionHeading label="Nutrition" title="Current Nutrition Plan" />
          <div style={cardStyle}>
            {nutritionPlanName ? (
              <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}>{nutritionPlanName}</p>
            ) : (
              <EmptyState text="No nutrition plan assigned yet." />
            )}
          </div>
        </section>

        {/* Health metrics */}
        <section style={{ marginTop: '2.5rem' }}>
          <SectionHeading label="Progress" title="Recent Health Metrics" />
          {metrics.length === 0 ? (
            <div style={cardStyle}>
              <EmptyState text="No health metrics recorded yet." />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {metrics.map((m) => (
                <HealthMetricCard key={m.id} metric={m} />
              ))}
            </div>
          )}
        </section>

        {/* Payment history */}
        <section style={{ margin: '2.5rem 0' }}>
          <SectionHeading label="Billing" title="Payment History" />
          {payments.length === 0 ? (
            <div style={cardStyle}>
              <EmptyState text="No payments on file yet." />
            </div>
          ) : (
            <div style={{ ...cardStyle, padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{formatDate(p.payment_date)}</td>
                      <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: 700 }}>
                        ${formatDollars(p.amount_cents)}
                      </td>
                      <td style={tdStyle}>{p.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="section-label">{label}</div>
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.75rem',
          color: 'var(--cream)',
          letterSpacing: '0.03em',
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{text}</p>;
}

function HealthMetricCard({ metric }: { metric: HealthMetricRow }) {
  const plainFields: [string, string | number | null][] = [
    ['Weight', metric.weight],
    ['Body Fat %', metric.body_fat_percent],
    ['Testosterone', metric.testosterone_level],
    ['Blood Oxygenation', metric.blood_oxygenation],
  ];

  const jsonbSections: [string, unknown][] = [
    ['Macros', metric.macros],
    ['Endurance', metric.endurance],
    ['One-Rep Max', metric.one_rep_max],
  ];

  return (
    <div style={cardStyle}>
      <p style={{ color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {formatDate(metric.recorded_date)}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: metric.dietary_restrictions ? '1rem' : 0 }}>
        {plainFields
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([label, value]) => (
            <div key={label}>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
              </div>
              <div style={{ color: 'var(--cream)', fontSize: '1.1rem' }}>{value}</div>
            </div>
          ))}
      </div>

      {metric.dietary_restrictions && (
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Dietary restrictions: {metric.dietary_restrictions}
        </p>
      )}

      {jsonbSections.map(([label, value]) => {
        const entries = formatJsonbEntries(value);
        if (entries.length === 0) return null;

        return (
          <div key={label} style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              {label}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}>
              {entries.map((e) => (
                <li key={e.label} style={{ color: 'var(--cream)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{e.label}:</span> {e.value}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function UnlinkedNotice({ message }: { message: string }) {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 700 }}>
        <div className="section-label">Members</div>
        <h2 id="dashboard" className="section-h2">Member Portal</h2>
        <p className="section-sub">{message}</p>
        <div style={{ marginTop: '2rem' }}>
          <Link className="btn-gold" href="/contact">
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}

const thStyle: CSSProperties = {
  padding: '1rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.8rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  borderBottom: '1px solid var(--border)',
};

const tdStyle: CSSProperties = {
  padding: '1rem 1.5rem',
  color: 'var(--cream)',
  fontSize: '0.9rem',
};
