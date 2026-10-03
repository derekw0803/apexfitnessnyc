'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './detail.module.css';

export default function RevokeButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleRevoke() {
    if (
      !window.confirm(
        "Deactivate this client's portal login? They will no longer be able to sign in until re-invited."
      )
    ) {
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/revoke`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus('idle');
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
    <div className={styles.actionForm}>
      <button
        type="button"
        className="btn-outline"
        onClick={handleRevoke}
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Deactivating…' : 'Deactivate Portal Access'}
      </button>
      {message && <span className={styles.errorText}>{message}</span>}
    </div>
  );
}
