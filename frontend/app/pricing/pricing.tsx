'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PLANS, formatDollars } from '@/lib/plans';

/**
 * NOTE: there is deliberately no card-number form on this page.
 *
 * Card details are collected by Stripe on Stripe's own hosted checkout page.
 * We never see or transmit a card number, which keeps this site out of PCI
 * scope. Do not reintroduce raw card inputs here.
 */
export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'cancelled') setCancelled(true);
  }, []);

  const startCheckout = async (planId: string) => {
    setError('');
    setCancelled(false);
    setLoadingPlan(planId);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only the plan id goes over the wire. The price is resolved on the
        // server so it cannot be tampered with.
        body: JSON.stringify({ planId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error || 'We could not start checkout. Please try again.');
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('We could not reach the payment server. Check your connection and try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Investment</div>
          <h2 id="pricing" className="section-h2" style={{ margin: '0.5rem 0' }}>The Price of Greatness</h2>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: 600 }}>
            Choose the protocol that fits your commitment level. One-time payment, no
            subscription, no hidden fees.
          </p>
        </div>

        {cancelled && (
          <p
            role="status"
            style={{
              textAlign: 'center', marginBottom: '2rem', color: 'var(--muted)',
              fontSize: '0.9rem',
            }}
          >
            Checkout cancelled. Nothing was charged. Pick a program below whenever you&apos;re ready.
          </p>
        )}

        {error && (
          <p
            role="alert"
            style={{
              textAlign: 'center', marginBottom: '2rem', color: '#f87171', fontSize: '0.9rem',
            }}
          >
            {error}
          </p>
        )}

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          {PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.id;
            const anyLoading = loadingPlan !== null;

            return (
              <div
                key={plan.id}
                style={{
                  background: 'var(--charcoal)',
                  border: plan.highlight ? '2px solid var(--gold)' : '1px solid var(--border)',
                  padding: '3rem 2.5rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gold)', color: 'var(--black)',
                    padding: '0.25rem 1.5rem',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                    letterSpacing: '0.2em', fontSize: '0.75rem', textTransform: 'uppercase',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: plan.highlight ? 'var(--gold)' : 'var(--cream)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  {plan.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--muted)', marginTop: '0.5rem' }}>$</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4.5rem', lineHeight: 1, color: 'var(--cream)' }}>
                    {formatDollars(plan.amount)}
                  </span>
                </div>

                <p style={{ color: 'rgba(240,235,224,0.6)', fontSize: '0.9rem', lineHeight: 1.6, paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                  {plan.desc}
                </p>

                <ul style={{ listStyle: 'none', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--cream)' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => startCheckout(plan.id)}
                  disabled={anyLoading}
                  aria-busy={isLoading}
                  style={{
                    marginTop: '3rem', width: '100%', padding: '1.25rem', border: 'none',
                    cursor: anyLoading ? 'wait' : 'pointer',
                    opacity: anyLoading && !isLoading ? 0.5 : 1,
                    background: plan.highlight ? 'var(--gold)' : 'rgba(200,168,75,0.1)',
                    color: plan.highlight ? 'var(--black)' : 'var(--gold)',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '1rem',
                    transition: 'all 0.3s',
                  }}
                >
                  {isLoading ? 'Redirecting…' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <p style={{
          textAlign: 'center', marginTop: '4rem', color: 'var(--muted)',
          fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Payments are processed securely by Stripe. APEX never sees or stores your card details.
          <br />
          By purchasing you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--gold)' }}>Terms of Service</Link> and{' '}
          <Link href="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</Link>.
        </p>

        <p style={{
          textAlign: 'center', marginTop: '2rem', color: 'var(--muted)',
          fontSize: '0.78rem', lineHeight: 1.7, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
          opacity: 0.75,
        }}>
          APEX provides fitness and general nutrition coaching. It is not medical care and does not
          replace advice from your physician. Consult your doctor before beginning any exercise or
          nutrition program, particularly if you have a heart condition, high blood pressure,
          diabetes, an injury, or take prescription medication.
        </p>
      </div>
    </div>
  );
}
