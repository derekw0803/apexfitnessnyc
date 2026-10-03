'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './expenses.module.css';

type Form = {
  expenseDate: string;
  amount: string;
  category: string;
  description: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: Form = {
  expenseDate: '',
  amount: '',
  category: '',
  description: '',
};

function FieldError({ text }: { text: string }) {
  return (
    <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
      {text}
    </span>
  );
}

/**
 * Adds a new business expense. The API's DB column is amount_cents, so the
 * dollar amount typed here is converted to cents client-side before POSTing
 * — the API itself expects amount_cents directly and does not accept a raw
 * dollar figure.
 */
export default function ExpenseForm() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    const dollars = Number(form.amount);
    const amountCents = Number.isFinite(dollars) ? Math.round(dollars * 100) : NaN;

    try {
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_date: form.expenseDate,
          amount_cents: amountCents,
          category: form.category,
          description: form.description,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setForm(EMPTY);
        setStatus('success');
        setMessage('Expense added.');
        router.refresh();
        return;
      }

      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setStatus('error');
      setMessage(data.error || 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formTitle}>Add Expense</div>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="expenseDate">Date</label>
            <input
              id="expenseDate"
              name="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={handleChange}
              className={styles.input}
              aria-invalid={!!fieldErrors.expense_date}
              required
            />
            {fieldErrors.expense_date && <FieldError text={fieldErrors.expense_date} />}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="amount">Amount (USD)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={styles.input}
              aria-invalid={!!fieldErrors.amount_cents}
              required
            />
            {fieldErrors.amount_cents && <FieldError text={fieldErrors.amount_cents} />}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="e.g. Rent, Equipment"
              value={form.category}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Optional notes"
              value={form.description}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Saving…' : 'Add Expense'}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: status === 'success' ? '#4ade80' : '#f87171',
              }}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
