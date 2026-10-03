import Link from 'next/link';
import { PLANS } from '@/lib/plans';

/**
 * Informational only — no prices, no checkout. Purchasing now happens
 * exclusively through the logged-in /payments page; this page exists to
 * describe what each month of the program covers for visitors deciding
 * whether to reach out.
 *
 * Pulls name/desc/features straight from lib/plans.ts's PLANS (the same
 * catalogue checkout still prices from) rather than duplicating that copy,
 * so this page can't drift out of sync with what the program actually
 * includes. Only the three month-by-month programs are shown — 1-on-1
 * coaching and the customized nutrition plan stay purchasable via
 * /payments but aren't advertised here.
 */
const MONTH_PLAN_IDS = ['program-1-month', 'program-2-month', 'program-3-month'];
const monthPlans = MONTH_PLAN_IDS.map((id) => PLANS.find((p) => p.id === id)).filter(
  (p): p is NonNullable<typeof p> => p !== undefined
);

export default function PricingPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>The Program</div>
          <h2 id="pricing" className="section-h2" style={{ margin: '0.5rem 0' }}>Three Months. One Protocol.</h2>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: 600 }}>
            Here&apos;s what each phase of the program covers. Reach out to get started, or sign in
            if you&apos;re already a member.
          </p>
        </div>

        {/* Program months */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          {monthPlans.map((plan, i) => (
            <div
              key={plan.id}
              style={{
                background: 'var(--charcoal)',
                border: '1px solid var(--border)',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                Month {i + 1}
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--cream)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {plan.name}
              </h3>

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
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn-gold" href="/contact">Get Started</Link>
          <Link className="btn-outline" href="/login">Member Login</Link>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '2rem', color: 'var(--muted)',
          fontSize: '0.78rem', lineHeight: 1.7, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
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
