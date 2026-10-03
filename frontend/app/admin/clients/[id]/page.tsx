import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { formatDollars } from '@/lib/plans';
import InviteForm from './invite-form';
import RevokeButton from './revoke-button';
import PurgeForm from './purge-form';
import styles from './detail.module.css';

export const dynamic = 'force-dynamic';

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  auth_user_id: string | null;
};

type HealthMetric = {
  id: string;
  recorded_date: string;
  weight: number | null;
  body_fat_percent: number | null;
  testosterone_level: number | null;
  blood_oxygenation: number | null;
  dietary_restrictions: string | null;
};

type Payment = {
  id: string;
  payment_date: string;
  amount_cents: number;
  note: string | null;
};

type OfferingHistory = {
  id: string;
  start_date: string;
  end_date: string | null;
  offerings: { name: string } | null;
};

type NutritionHistory = {
  id: string;
  start_date: string;
  end_date: string | null;
  nutrition_plans: { name: string } | null;
};

function fmtDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

/**
 * Admin client detail. Same independent admin re-check as app/admin/page.tsx
 * — middleware.ts hides /admin/* by rule, but every page under this scope
 * re-verifies before rendering, per the "defense in depth" requirement.
 */
export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const claims = await getSessionClaims();
  if (!isAdminClaims(claims)) notFound();

  const { id } = await params;
  const db = getDb();

  const [clientRes, metricsRes, paymentsRes, offeringRes, nutritionRes] = await Promise.all([
    db
      .from('clients')
      .select('id,first_name,last_name,email,phone,address,created_at,auth_user_id')
      .eq('id', id)
      .maybeSingle<Client>(),
    db
      .from('health_metrics')
      .select(
        'id,recorded_date,weight,body_fat_percent,testosterone_level,blood_oxygenation,dietary_restrictions'
      )
      .eq('client_id', id)
      .order('recorded_date', { ascending: false }),
    db
      .from('training_payments')
      .select('id,payment_date,amount_cents,note')
      .eq('client_id', id)
      .order('payment_date', { ascending: false }),
    db
      .from('client_offerings')
      .select('id,start_date,end_date,offerings(name)')
      .eq('client_id', id)
      .order('start_date', { ascending: false }),
    db
      .from('client_nutrition_plans')
      .select('id,start_date,end_date,nutrition_plans(name)')
      .eq('client_id', id)
      .order('start_date', { ascending: false }),
  ]);

  const client = clientRes.data;
  if (!client) notFound();

  const healthMetrics = (metricsRes.data ?? []) as HealthMetric[];
  const trainingPayments = (paymentsRes.data ?? []) as Payment[];
  const offerings = (offeringRes.data ?? []) as unknown as OfferingHistory[];
  const nutritionPlans = (nutritionRes.data ?? []) as unknown as NutritionHistory[];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <Link href="/admin" className={styles.backLink}>
          ← All Clients
        </Link>
        <div className="section-label">Admin</div>
        <h2 className="section-h2">
          {client.first_name} {client.last_name}
        </h2>

        <div className={styles.profileGrid}>
          <div>
            <span className={styles.fieldLabel}>Email</span>
            <span>{client.email}</span>
          </div>
          <div>
            <span className={styles.fieldLabel}>Phone</span>
            <span>{client.phone ?? '—'}</span>
          </div>
          <div>
            <span className={styles.fieldLabel}>Address</span>
            <span>{client.address ?? '—'}</span>
          </div>
          <div>
            <span className={styles.fieldLabel}>Client Since</span>
            <span>{fmtDate(client.created_at)}</span>
          </div>
          <div>
            <span className={styles.fieldLabel}>Portal Access</span>
            <span className={client.auth_user_id ? styles.badgeLinked : styles.badgeUnlinked}>
              {client.auth_user_id ? 'Linked' : 'Not linked'}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          {!client.auth_user_id && (
            <InviteForm clientId={client.id} initialEmail={client.email} />
          )}
          {client.auth_user_id && <RevokeButton clientId={client.id} />}
          <PurgeForm clientId={client.id} />
        </div>

        <section className={styles.historySection}>
          <h3 className={styles.historyH3}>Offering History</h3>
          {offerings.length === 0 ? (
            <p className={styles.emptyText}>No offerings on record.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Offering</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {offerings.map((o) => (
                  <tr key={o.id}>
                    <td>{o.offerings?.name ?? '—'}</td>
                    <td>{fmtDate(o.start_date)}</td>
                    <td>{o.end_date ? fmtDate(o.end_date) : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.historySection}>
          <h3 className={styles.historyH3}>Nutrition Plan History</h3>
          {nutritionPlans.length === 0 ? (
            <p className={styles.emptyText}>No nutrition plans on record.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {nutritionPlans.map((n) => (
                  <tr key={n.id}>
                    <td>{n.nutrition_plans?.name ?? '—'}</td>
                    <td>{fmtDate(n.start_date)}</td>
                    <td>{n.end_date ? fmtDate(n.end_date) : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.historySection}>
          <h3 className={styles.historyH3}>Training Payments</h3>
          {trainingPayments.length === 0 ? (
            <p className={styles.emptyText}>No payments on record.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {trainingPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{fmtDate(p.payment_date)}</td>
                    <td>${formatDollars(p.amount_cents)}</td>
                    <td>{p.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.historySection}>
          <h3 className={styles.historyH3}>Health Metrics</h3>
          {healthMetrics.length === 0 ? (
            <p className={styles.emptyText}>No health metrics on record.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body Fat %</th>
                  <th>Testosterone</th>
                  <th>Blood O2</th>
                  <th>Dietary Restrictions</th>
                </tr>
              </thead>
              <tbody>
                {healthMetrics.map((m) => (
                  <tr key={m.id}>
                    <td>{fmtDate(m.recorded_date)}</td>
                    <td>{m.weight ?? '—'}</td>
                    <td>{m.body_fat_percent ?? '—'}</td>
                    <td>{m.testosterone_level ?? '—'}</td>
                    <td>{m.blood_oxygenation ?? '—'}</td>
                    <td>{m.dietary_restrictions ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
