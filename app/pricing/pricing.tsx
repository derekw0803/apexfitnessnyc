'use client';
import { useState } from 'react';

const PLANS = [
  {
    name: '1-Month Program',
    price: 120,
    desc: 'Full access to the 4-week APEX foundation protocol and nutrition dashboard.',
    features: ['Month 1 Training Regiment', 'Macro Tracking Dashboard', 'Weekly Progress Tracking', 'Community Access'],
    highlight: false,
  },
  {
    name: '2-Month Program',
    price: 200,
    desc: 'Access to Month 1 (Foundation) and Month 2 (MetCon) programs.',
    features: ['Everything in 1-Month', 'Month 2 MetCon Curriculum', 'Custom Meal Plans', 'Priority Support'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: '3-Month Program',
    price: 320,
    desc: 'The complete 12-week APEX lifecycle, including Longevity and Peak performance.',
    features: ['Everything in 2-Month', 'Month 3 Longevity Curriculum', 'Direct Line to Medical Staff', 'Guaranteed 90-Day Results'],
    highlight: false,
  },
];

export default function PricingPage() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Investment</div>
          <h2 className="section-h2" style={{ margin: '0.5rem 0' }}>The Price of Greatness</h2>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: 600 }}>
            Choose the protocol that fits your commitment level. Cancel anytime. No hidden fees,
            just guaranteed physical transformation.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                background: 'var(--charcoal)',
                border: plan.highlight ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '3rem 2.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
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
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4.5rem', lineHeight: 1, color: 'var(--cream)' }}>{plan.price}</span>
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
              {/* <button
                style={{
                  marginTop: '3rem', width: '100%', padding: '1.25rem', border: 'none', cursor: 'pointer',
                  background: plan.highlight ? 'var(--gold)' : 'rgba(200,168,75,0.1)',
                  color: plan.highlight ? 'var(--black)' : 'var(--gold)',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '1rem', transition: 'all 0.3s',
                }}
                onClick={() => setSelected(i)}
              >
                Select Protocol
              </button> */}
            </div>
          ))}
        </div>

        {/* Checkout */}
        {/* <div style={{ marginTop: '6rem', background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--cream)', marginBottom: '1rem', letterSpacing: '0.05em' }}>Secure Checkout</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your transformation starts immediately. Access the dashboard, download the training
              protocols, and log your starting metrics right after payment.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { placeholder: 'Cardholder Name', cols: 1 },
                { placeholder: 'Card Number', cols: 1 },
              ].map((field, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={field.placeholder}
                  style={{ width: '100%', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '1rem', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="MM/YY" style={{ width: '100%', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '1rem', fontFamily: 'inherit', fontSize: '0.9rem' }} />
                <input type="text" placeholder="CVC" style={{ width: '100%', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '1rem', fontFamily: 'inherit', fontSize: '0.9rem' }} />
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--card)', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Order Summary
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--cream)' }}>{PLANS[selected].name}</span>
              <span style={{ color: 'var(--cream)', fontWeight: 600 }}>${PLANS[selected].price}.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--muted)' }}>Initiation Fee</span>
              <span style={{ color: 'var(--gold)' }}>Waived</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--cream)', fontSize: '1.2rem', fontWeight: 600 }}>Total Due</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', lineHeight: 1, color: 'var(--gold)' }}>${PLANS[selected].price}.00</span>
            </div>
            <button style={{ marginTop: '2rem', background: '#32CD32', color: 'var(--black)', padding: '1.25rem', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Confirm &amp; Pay Securely
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
