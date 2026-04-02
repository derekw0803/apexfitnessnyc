'use client';
import { useEffect, useRef, useState } from 'react';

const TICKER_ITEMS = [
  '90-Day Guaranteed Transformation',
  'Men 45–70 Only',
  '$120/Month — Less Than Any Competitor',
  'Hormone-Optimized Nutrition',
  "NYC's #1 Senior Men's Program",
  '2,400+ Members Strong',
  '97% Completion Rate',
];

const SCIENCE = [
  {
    num: '01',
    title: 'Testosterone Decline: 1–2% Per Year',
    body: 'After 40, men lose testosterone at 1–2% annually. By 55, many have 30–40% less than their peak. This drives fat gain (especially visceral), muscle loss, low energy, and reduced motivation. APEX training is specifically designed around compound lifts, sprint intervals, and sleep protocols that maximize the body\'s natural testosterone production — without pharmaceuticals.',
  },
  {
    num: '02',
    title: 'Sarcopenia: The Silent Enemy',
    body: 'After 50, men lose 1–2% of muscle mass per year without resistance training. This reduces metabolic rate, increases injury risk, and creates the "skinny fat" physique. APEX\'s progressive overload program directly counteracts sarcopenia by stimulating muscle protein synthesis through leucine-triggering protein targets and mechanical load.',
  },
  {
    num: '03',
    title: 'Insulin Sensitivity Drops After 45',
    body: 'Carbohydrate tolerance decreases significantly with age. Eating carbs the same way you did at 30 leads to fat storage, energy crashes, and prediabetes risk. APEX nutrition times carbohydrates precisely around training windows and eliminates them at night — matching food to the biological clock of the aging male metabolism.',
  },
  {
    num: '04',
    title: 'Recovery Takes Longer — and That\'s OK',
    body: 'After 45, cortisol clearance slows and mTOR signaling (muscle repair) takes 20–40% longer than in younger men. Generic programs ignore this and lead to chronic injury. APEX builds in mandatory recovery days, periodizes intensity across 3-week cycles, and programs sleep as a training variable — because that\'s exactly what it is.',
  },
  {
    num: '05',
    title: 'Inflammation: The Root of "Feeling Old"',
    body: 'Chronic low-grade inflammation — called inflammaging — is the primary driver of fatigue, joint pain, slow recovery, and disease risk in men over 45. APEX\'s anti-inflammatory nutrition protocol (Omega-3s, turmeric, Mediterranean-style eating) directly targets this mechanism, often producing dramatic changes in how members feel within the first 2 weeks.',
  },
];

const MONTHS = [
  {
    label: 'Month 1 — Foundation',
    days: [
      { day: 'DAY 1', title: 'Push — Chest & Triceps' },
      { day: 'DAY 2', title: 'Pull — Back & Biceps'},
      { day: 'DAY 3', title: 'Legs — Quads & Calves'},
      { day: 'DAY 4', title: 'Upper — Chest & Back Volume'},
      { day: 'DAY 5', title: 'Posterior — Hamstrings & Core'},
    ],
  },
  {
    label: 'Month 2 — Accelerate',
    days: [
      { day: 'DAY 1', title: 'Strength + MetCon — Full Body Power'},
      { day: 'DAY 2', title: 'Aerobic Base — Mitochondrial Density'},
      { day: 'DAY 3', title: 'Hypertrophy — Shoulders & Arms'},
      { day: 'DAY 4', title: 'Athletic — Leg Power Endurance'},
      { day: 'DAY 5', title: 'The Furnace — Benchmark Circuit'},
    ],
  },
  {
    label: 'Month 3 — Peak',
    days: [
      { day: 'DAY 1', title: 'Max Upper — Heavy Tension'},
      { day: 'DAY 2', title: 'Slow Legs — Eccentric Control'},
      { day: 'DAY 3', title: 'Mobility & Core — Joint Bulletproofing'},
      { day: 'DAY 4', title: 'Pump Matrix — Blood Flow'},
      { day: 'DAY 5', title: 'Functional Output — Dynamic Carry'},
    ],
  },
];

const COMPARE = [
  { feature: 'Target Demographic', apex: 'Men 45–70', apps: '"Everyone" (Usually 18-35)', trainer: 'General Population' },
  { feature: 'Periodization', apex: '4-Week Phase Adapted', apps: 'Randomized Daily Workouts', trainer: 'Basic Linear Progression' },
  { feature: 'Joint & CNS Focus', apex: 'Mandatory Recovery & Mobility', apps: 'High-Impact Only', trainer: 'Varies heavily by trainer' },
  { feature: 'Hormone Optimization', apex: 'Science-backed Protocols', apps: 'Ignored', trainer: 'Seldom understood' },
  { feature: 'Cost', apex: '$120 / mo', apps: '$15 – $30 / mo', trainer: '$800+ / mo' },
];

const FAQS = [
  {
    q: "I haven't trained in years. Am I too old or injury-prone for this?",
    a: "Standard fitness programs are designed for 20-somethings and will destroy your joints. APEX is strictly engineered for the biomechanics of men 45–70. We prioritize joint-sparing movements (like trap bar deadlifts instead of conventional) and eccentric control to build armor around your joints.",
  },
  {
    q: 'How is this different from hiring a personal trainer?',
    a: 'Most personal trainers lack formal knowledge of age-related hormonal decline. APEX is built on clinical research specific to men 45–70 and costs a fraction of in-person training — with a results guarantee that no trainer offers.',
  },
  {
    q: 'What if I travel frequently or miss days?',
    a: 'Every program includes travel-friendly alternatives and built-in flexibility windows. Missing a day has zero impact on your 90-day outcome — the program is periodized to absorb life.',
  },
  {
    q: "I'm already in decent shape. Is this still for me?",
    a: 'APEX is built for optimization, not just recovery. Members who enter already active routinely report the biggest gains — because for the first time, their programming actually matches their physiology.',
  },
];

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(t);
      }, 20);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [activeMonth, setActiveMonth] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', padding: '0 5vw', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', width: '100%' }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
            New York City · Men 45–70 · Est. 2025
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(4rem, 10vw, 9rem)', lineHeight: 0.9, color: 'var(--cream)', letterSpacing: '0.02em', marginBottom: '2rem' }}>
            YOU ARE<br />NOT DONE<br />YET.
          </h1>
          <p style={{ color: 'var(--text)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 560, marginBottom: '2.5rem' }}>
            The best NYC fitness system engineered exclusively for men 45–70.
            Precision training, hormone-optimized nutrition, and a documented 90-day body
            transformation — <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>.</em>
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a className="btn-gold" href="/pricing">Start Your Transformation</a>
            <a className="btn-outline" href="/training">See Real Results</a>
          </div>
        </div>
        <a href="#ticker" style={{ position: 'absolute', bottom: '2.5rem', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', animation: 'bounce 2s infinite' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </a>
      </section>

      {/* ── Ticker ───────────────────────────────────── */}
      <div id="ticker"className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats counters ───────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            {[
              { val: 90, suffix: 'd', label: 'Transformation Window', sub: 'Guaranteed visible results or full refund' },
              { val: 120, prefix: '$', label: 'Per Month', sub: 'vs. $195 NYC gym average — 54% less' },
              { val: 2400, suffix: '+', label: 'NYC Members', sub: 'Men who chose to finish what they started' },
              { val: 97, suffix: '%', label: 'Completion Rate', sub: 'vs. 22% industry average for fitness programs' },
              { val: 22, suffix: 'lb', label: 'Avg. Fat Loss', sub: 'Average across 90-day program completers' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--gold)', lineHeight: 1 }}>
                  <Counter target={s.val} suffix={s.suffix ?? ''} prefix={s.prefix ?? ''} />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cream)', marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{s.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science ──────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">The Science</div>
          <h2 className="section-h2">Why 45 Is Different.</h2>
          <p className="section-sub" style={{ marginBottom: '4rem' }}>
            APEX isn&apos;t a modified general fitness program. It&apos;s a system built from the ground up
            around the endocrinology, musculoskeletal changes, and metabolic shifts that define
            male physiology after 45.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {SCIENCE.map((s) => (
              <div key={s.num} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--gold)', opacity: 0.5, lineHeight: 1 }}>{s.num}</span>
                <div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: '0.75rem' }}>{s.title}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Performance metrics ──────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">Program Performance vs. Industry</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {[
              { label: '90-Day Completion Rate', val: '97%', sub: 'Industry Average 22%' },
              { label: 'Member Satisfaction (NPS)', val: '94%', sub: '' },
              { label: 'Avg. Fat Loss — 90 Days', val: '22 lbs', sub: 'NYC Gym Average 6 lbs' },
              { label: 'Testosterone Improvement', val: '+34%', sub: '' },
              { label: 'Members Who Renew', val: '89%', sub: '' },
              { label: 'Recommend to a Friend', val: '96%', sub: '' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.75rem' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: 'var(--gold)', lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cream)', fontSize: '0.82rem', margin: '0.5rem 0 0.25rem' }}>{m.label}</div>
                {m.sub && <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{m.sub}</div>}
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
            Data from 2,400+ APEX member cohort, 2025. Testosterone data from 90-day bloodwork comparison (n=312 Elite tier members).
          </p>
        </div>
      </section>

      {/* ── Training preview ─────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Training Program</div>
          <h2 className="section-h2">Built For Your Body.<br />Not a 25-Year-Old&apos;s.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            APEX workouts protect joints, maximize testosterone-boosting compound movements,
            and scale with your recovery capacity. Every exercise is video-guided and coach-reviewed.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {MONTHS.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveMonth(i)}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontSize: '0.82rem', padding: '0.6rem 1.4rem',
                  border: activeMonth === i ? '2px solid var(--gold)' : '1px solid var(--border)',
                  background: activeMonth === i ? 'var(--gold-dim)' : 'transparent',
                  color: activeMonth === i ? 'var(--gold)' : 'var(--muted)',
                  transition: 'all 0.2s',
                }}
              >{m.label}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {MONTHS[activeMonth].days.map((d, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>{d.day}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--cream)', marginBottom: '1rem', lineHeight: 1.3 }}>{d.title}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {/* {d.exercises.map((ex, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>›</span>{ex}
                    </li>
                  ))} */}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">The Standard</div>
          <h2 className="section-h2">Why APEX Wins</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            Stop wasting time on generic apps or overpriced trainers who
            just count your reps. Look at the data.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif" }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Feature</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', borderBottom: '2px solid var(--gold)', background: 'var(--gold-dim)' }}>APEX Health</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Generic Apps</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Local Trainer</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--cream)', fontSize: '0.9rem' }}>{row.feature}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 700, background: 'var(--gold-dim)' }}>{row.apex}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>{row.apps}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>{row.trainer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn-gold" href="/pricing">Choose Your Protocol</a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 800 }}>
          <div className="section-label">Objections Overruled</div>
          <h2 className="section-h2" style={{ marginBottom: '3rem' }}>Why APEX?</h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1.5rem 0', background: 'transparent', border: 'none', textAlign: 'left',
                  color: 'var(--cream)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  fontSize: '1.05rem', letterSpacing: '0.04em', cursor: 'pointer',
                }}
              >
                {faq.q}
                <span style={{ color: 'var(--gold)', fontSize: '1.4rem', lineHeight: 1, flexShrink: 0, marginLeft: '1rem' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p style={{ color: 'var(--muted)', lineHeight: 1.7, paddingBottom: '1.5rem', fontSize: '0.95rem' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </>
  );
}
