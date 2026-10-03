'use client';

import { useState } from 'react';
import styles from './account.module.css';

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

function FieldError({ text }: { text: string }) {
  return (
    <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
      {text}
    </span>
  );
}

export default function AccountForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState<Form>({
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    phone: profile.phone ?? '',
    address: profile.address ?? '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Your info has been updated.');
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
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={!!fieldErrors.firstName}
            required
          />
          {fieldErrors.firstName && <FieldError text={fieldErrors.firstName} />}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={!!fieldErrors.lastName}
            required
          />
          {fieldErrors.lastName && <FieldError text={fieldErrors.lastName} />}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <FieldError text={fieldErrors.phone} />}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            className={styles.input}
            disabled
            readOnly
          />
          <span className={styles.hint}>Contact us to change the email on your login.</span>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          className={styles.input}
          aria-invalid={!!fieldErrors.address}
        />
        {fieldErrors.address && <FieldError text={fieldErrors.address} />}
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Saving…' : 'Save Changes'}
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
  );
}
