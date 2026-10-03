'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './detail.module.css';

const CONFIRM_PHRASE = 'PERMANENTLY DELETE';

/**
 * The API also hard-gates this (see
 * app/api/admin/clients/[id]/purge/route.ts) — this client-side check is
 * about making the destructive action hard to trigger by accident, not
 * the actual security boundary.
 */
export default function PurgeForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handlePurge() {
    if (confirmText !== CONFIRM_PHRASE) return;

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/purge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: confirmText }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.push('/admin');
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
    <div className={styles.dangerBox}>
      <h3>Permanently Erase</h3>
      <p>
        Deletes this client&apos;s record and all history (payments, health metrics, offerings,
        nutrition plans) and their login. This cannot be undone.
      </p>
      <p className={styles.hint}>
        Type <strong>{CONFIRM_PHRASE}</strong> to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className={styles.actionInput}
        placeholder={CONFIRM_PHRASE}
        aria-label="Type PERMANENTLY DELETE to confirm"
      />
      <button
        type="button"
        className={styles.btnDanger}
        disabled={confirmText !== CONFIRM_PHRASE || status === 'submitting'}
        onClick={handlePurge}
      >
        {status === 'submitting' ? 'Erasing…' : 'Permanently Erase Client'}
      </button>
      {message && <span className={styles.errorText}>{message}</span>}
    </div>
  );
}
