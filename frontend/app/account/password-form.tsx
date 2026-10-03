'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import styles from './account.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Shared by app/account/password/page.tsx (an already-signed-in client
 * changing their password) and app/account/set-password/page.tsx (landing
 * after an invite/recovery email link, per auth/callback/route.ts). Both
 * cases already hold a valid Supabase Auth session by the time this
 * renders, so this is a direct client-side auth.updateUser() call — a
 * Supabase Auth operation, not a data write, so the browser client (anon
 * key only, never touches public.* tables) is the correct client here.
 */
export default function PasswordForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus('error');
        setMessage(error.message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Password updated.');
      router.push(redirectTo);
      router.refresh();
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">New Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          autoComplete="new-password"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          autoComplete="new-password"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Saving…' : 'Save Password'}
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
