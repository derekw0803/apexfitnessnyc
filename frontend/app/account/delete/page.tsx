import DeleteAccountForm from './delete-form';
import styles from '../account.module.css';

export default function DeleteAccountPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Account</div>
        <h2 className="section-h2">Delete Account</h2>
        <p className="section-sub" style={{ marginBottom: '2rem' }}>
          This deactivates your login — it is permanent and cannot be undone from here.
        </p>

        <div className={styles.dangerBox} style={{ marginTop: 0 }}>
          <h3>What happens</h3>
          <p>You will be signed out immediately and will no longer be able to log in.</p>
          <p>
            Your payment history and health/training records are <strong>not deleted</strong> —
            they stay on file, consistent with our{' '}
            <a href="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</a>.
          </p>
          <p>If you want access again, your coach will need to send you a new invite.</p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
