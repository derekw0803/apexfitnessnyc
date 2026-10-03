import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { formatDollars } from '@/lib/plans';
import ExpenseForm from './expense-form';
import ExpenseRowActions from './expense-row-actions';
import styles from './expenses.module.css';

export const dynamic = 'force-dynamic';

type Expense = {
  id: string;
  expense_date: string;
  amount_cents: number;
  category: string | null;
  description: string | null;
};

/**
 * Admin-only. middleware.ts already rewrites unauthenticated/non-admin
 * requests under /admin/* to a genuine 404, but this page independently
 * re-checks the fast-path claim before rendering — defense in depth against
 * a middleware matcher gap. The API routes behind the form/delete actions
 * re-verify against the database (verifyIsAdmin) before actually writing.
 */
export default async function ExpensesPage() {
  const claims = await getSessionClaims();

  if (!isAdminClaims(claims)) notFound();

  const { data, error } = await getDb()
    .from('expenses')
    .select('id,expense_date,amount_cents,category,description')
    .order('expense_date', { ascending: false });

  const expenses = (error ? [] : data) as Expense[] | null;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className={styles.header}>
          <div className="section-label">Admin</div>
          <h2 className="section-h2">Business Expenses</h2>
          <p className="section-sub">
            Track rent, equipment, and supplies. This is business overhead, separate from
            client billing.
          </p>
        </div>

        <ExpenseForm />

        <div className={styles.tableWrap}>
          {error ? (
            <div className={styles.empty}>We couldn&apos;t load expenses right now. Please try again shortly.</div>
          ) : !expenses || expenses.length === 0 ? (
            <div className={styles.empty}>No expenses recorded yet.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((row) => (
                  <tr key={row.id}>
                    <td>{row.expense_date}</td>
                    <td className={styles.amount}>${formatDollars(row.amount_cents)}</td>
                    <td>{row.category || '—'}</td>
                    <td>{row.description || '—'}</td>
                    <td>
                      <ExpenseRowActions id={row.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
