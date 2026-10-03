import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

type ClientRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  auth_user_id: string | null;
  offerings: { name: string } | null;
  nutrition_plans: { name: string } | null;
};

/**
 * Admin client roster. middleware.ts already rewrites unauthenticated/
 * non-admin requests under /admin/* to a genuine 404 based on the JWT
 * claim, but this page independently re-checks (defense in depth against
 * middleware matcher gaps) before rendering anything.
 */
export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const claims = await getSessionClaims();
  if (!isAdminClaims(claims)) notFound();

  const { q } = await searchParams;
  const query = (q ?? '').trim();

  let clientsQuery = getDb()
    .from('clients')
    .select(
      'id,first_name,last_name,email,auth_user_id,offerings:current_offering_id(name),nutrition_plans:current_nutrition_plan_id(name)'
    );

  if (query) {
    // Escape characters that have special meaning inside a PostgREST
    // ilike/or filter string so a search term can't break out of it.
    const escaped = query.replace(/[%,()]/g, '');
    clientsQuery = clientsQuery.or(
      `first_name.ilike.%${escaped}%,last_name.ilike.%${escaped}%,email.ilike.%${escaped}%`
    );
  }

  const { data, error } = await clientsQuery.order('last_name', { ascending: true });
  const clients = (data ?? []) as unknown as ClientRow[];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Admin</div>
        <h2 className="section-h2">Clients</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
          {clients.length} client{clients.length === 1 ? '' : 's'} on file.
        </p>

        <form method="get" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email…"
            className={styles.searchInput}
          />
          <button type="submit" className="btn-outline">Search</button>
          {query && (
            <Link href="/admin" className={styles.clearLink}>Clear</Link>
          )}
        </form>

        {error ? (
          <p className={styles.errorText}>We couldn&apos;t load clients right now.</p>
        ) : clients.length === 0 ? (
          <p className="section-sub">No clients match your search.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Offering</th>
                  <th>Nutrition Plan</th>
                  <th>Portal Access</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/clients/${c.id}`} className={styles.rowLink}>
                        {c.first_name} {c.last_name}
                      </Link>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.offerings?.name ?? '—'}</td>
                    <td>{c.nutrition_plans?.name ?? '—'}</td>
                    <td>
                      <span className={c.auth_user_id ? styles.badgeLinked : styles.badgeUnlinked}>
                        {c.auth_user_id ? 'Linked' : 'Not linked'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
