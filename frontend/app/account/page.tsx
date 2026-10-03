import Link from 'next/link';
import { getSessionClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import AccountForm from './account-form';
import styles from './account.module.css';

export const dynamic = 'force-dynamic';

type ClientProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

/**
 * Server component. middleware.ts already guarantees a session exists for
 * anything under /account, but a logged-in auth identity is not guaranteed
 * to be linked to a clients row yet (e.g. an admin-only account, or a client
 * invited before the linking step ran) — client_id can still be null here,
 * so that case is handled with a message rather than assumed away.
 */
export default async function AccountPage() {
  const claims = await getSessionClaims();

  if (!claims || !claims.client_id) {
    return (
      <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="section-inner">
          <div className="section-label">Account</div>
          <h2 className="section-h2">Account Not Linked</h2>
          <p className="section-sub">
            Your login isn&apos;t linked to a client profile yet. Please contact your coach
            so we can get this connected.
          </p>
        </div>
      </div>
    );
  }

  const { data: profile, error } = await getDb()
    .from('clients')
    .select('first_name,last_name,email,phone,address')
    .eq('id', claims.client_id)
    .single<ClientProfile>();

  if (error || !profile) {
    return (
      <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="section-inner">
          <div className="section-label">Account</div>
          <h2 className="section-h2">Something Went Wrong</h2>
          <p className="section-sub">
            We couldn&apos;t load your profile right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className={styles.header}>
          <div className="section-label">Account</div>
          <h2 className="section-h2">Your Info</h2>
          <p className="section-sub">Update your contact details below.</p>
        </div>

        <AccountForm profile={profile} />

        <div className={styles.links}>
          <Link href="/account/password">Change Password</Link>
        </div>

        <div className={styles.dangerBox}>
          <h3>Delete Account</h3>
          <p>
            Deleting your account removes your ability to log in. Your payment and health
            history are kept — this does not erase your records.
          </p>
          <Link href="/account/delete" className={styles.btnDanger} style={{ textDecoration: 'none' }}>
            Delete Account
          </Link>
        </div>
      </div>
    </div>
  );
}
