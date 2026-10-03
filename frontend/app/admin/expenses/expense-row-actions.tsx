'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './expenses.module.css';

export default function ExpenseRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        router.refresh();
        return;
      }

      setError(data.error || 'Could not delete this expense.');
      setDeleting(false);
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.btnDelete}
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
      {error && (
        <span role="alert" style={{ color: '#f87171', fontSize: '0.75rem', display: 'block', marginTop: '0.35rem' }}>
          {error}
        </span>
      )}
    </>
  );
}
