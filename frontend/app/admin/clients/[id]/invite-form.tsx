'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './detail.module.css';

export default function InviteForm({
  clientId,
  initialEmail,
}: {
  clientId: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? '');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
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
    <form onSubmit={handleSubmit} className={styles.actionForm}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="client@email.com"
        className={styles.actionInput}
        required
      />
      <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Invite'}
      </button>
      {message && <span className={styles.errorText}>{message}</span>}
    </form>
  );
}
