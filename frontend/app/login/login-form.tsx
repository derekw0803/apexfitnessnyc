'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import styles from './login.module.css';

function FieldError({ text }: { text: string }) {
  return (
    <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
      {text}
    </span>
  );
}

type Mode = 'login' | 'forgot';
type Status = 'idle' | 'submitting' | 'error' | 'success';

/**
 * There is no signup form here — account creation is admin-invite-only (see
 * the approved auth plan). This component only ever signs an existing user
 * in, or kicks off Supabase's password-recovery email.
 *
 * Both actions call lib/supabase/browser.ts's Auth-only client directly, no
 * API route: Supabase Auth itself sets the session cookie via @supabase/ssr,
 * and middleware.ts is what actually persists/refreshes it on navigation.
 */
export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setStatus('submitting');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Could not sign in. Check your email and password.');
      return;
    }

    setStatus('success');
    router.push(next);
    router.refresh();
  }

  async function handleForgot(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setStatus('submitting');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/set-password`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
    setMessage("If that email has an account, we've sent a password reset link.");
  }

  if (mode === 'forgot') {
    return (
      <form className={styles.form} noValidate onSubmit={handleForgot}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="forgot-email">Email Address</label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          className={styles.forgot}
          onClick={() => {
            setMode('login');
            setStatus('idle');
            setMessage('');
          }}
        >
          Back to login
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: status === 'error' ? '#f87171' : '#4ade80',
            }}
          >
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleLogin}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="EMAIL ADDRESS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          aria-invalid={status === 'error'}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          aria-invalid={status === 'error'}
          required
        />
      </div>

      <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Signing In…' : 'Sign In'}
      </button>

      <button
        type="button"
        className={styles.forgot}
        onClick={() => {
          setMode('forgot');
          setStatus('idle');
          setMessage('');
        }}
      >
        Forgot password?
      </button>

      {message && status === 'error' && <FieldError text={message} />}
    </form>
  );
}
