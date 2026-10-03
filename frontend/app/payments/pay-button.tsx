'use client';

import { useState } from 'react';

/**
 * Client-side "Pay Now" trigger for an authenticated client's /payments page.
 *
 * Mirrors app/pricing/pricing.tsx's startCheckout: POST the plan id, redirect
 * to the Stripe-hosted URL we get back, surface a loading state and any
 * error inline. This one posts to /api/payments/checkout (authenticated)
 * instead of /api/checkout (anonymous) so the session carries client_id.
 */
export default function PayButton({
  planId,
  label = 'Pay Now',
  highlight = false,
}: {
  planId: string;
  label?: string;
  highlight?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error || 'We could not start checkout. Please try again.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('We could not reach the payment server. Check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={startCheckout}
        disabled={loading}
        aria-busy={loading}
        style={{
          width: '100%', padding: '1.1rem', border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: highlight ? 'var(--gold)' : 'rgba(200,168,75,0.1)',
          color: highlight ? 'var(--black)' : 'var(--gold)',
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.95rem',
          transition: 'all 0.3s',
        }}
      >
        {loading ? 'Redirecting…' : label}
      </button>

      {error && (
        <p role="alert" style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.6rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
