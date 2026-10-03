'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../account.module.css';

type Status = 'idle' | 'submitting' | 'error';

export default function DeleteAccountForm() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleDelete() {
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/account/delete', { method: 'POST' });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        router.push(data.redirectTo || '/');
        router.refresh();
        return;
      }

      setStatus('error');
      setMessage(data.error || 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <div>
      <label className={styles.field} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem', maxWidth: 600 }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ marginTop: '0.2rem', accentColor: 'var(--gold)' }}
        />
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          I understand this will permanently remove my ability to log in, and that a coach
          will need to re-invite me if I want access again.
        </span>
      </label>

      <div className={styles.actions} style={{ marginTop: '2rem' }}>
        <button
          type="button"
          className={styles.btnDanger}
          disabled={!confirmed || status === 'submitting'}
          onClick={handleDelete}
        >
          {status === 'submitting' ? 'Deleting…' : 'Permanently Delete My Login'}
        </button>

        {message && (
          <p role="status" aria-live="polite" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#f87171' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
