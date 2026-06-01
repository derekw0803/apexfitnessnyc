'use client';
import { useState } from 'react';

const CREDENTIALS = [
  {
    num: '01',
    title: 'Certified Strength & Conditioning Specialist (CSCS)',
    body: 'The gold standard in performance coaching — earned through rigorous study of biomechanics, exercise physiology, and periodization science. Applied specifically to the hormonal and musculoskeletal realities of men 40+.',
  },
  {
    num: '02',
    title: 'Precision Nutrition Certified Coach',
    body: 'Trained in the science of hormone-optimized eating for the aging male. Carb timing, leucine thresholds, and anti-inflammatory protocols are core tools — not buzzwords.',
  },
  {
    num: '03',
    title: '5+ Years Coaching Men 40+ in NYC',
    body: 'Over five years spent exclusively coaching the demographic most underserved by the fitness industry.',
  },
  {
    num: '04',
    title: 'Applied Endocrinology & Longevity Research',
    body: 'Deep study of the clinical research on testosterone decline, sarcopenia, inflammaging, and metabolic shifts after 40. The APEX system is built on peer-reviewed science, not gym folklore.',
  },
];

const PHILOSOPHY = [
  {
    icon: '⚡',
    title: 'Precision Over Volume',
    body: 'More is not better. The right stimulus, at the right time, with the right recovery — that is the equation. Every APEX session is engineered for maximum hormonal return with zero wasted effort.',
  },
  {
    icon: '🧬',
    title: 'Biology-First Programming',
    body: 'Your physiology at 55 is not a limitation. It is a specification sheet. APEX is written to that spec — not adapted from a program designed for a 22-year-old who can recover overnight.',
  },
  {
    icon: '📊',
    title: 'Data Drives Decisions',
    body: 'Subjective feel is not a protocol. APEX tracks body composition, strength output, and recovery markers — then the Agentic Engine synthesizes that data into your next optimized training block.',
  },
  {
    icon: '🛡️',
    title: 'Joint Longevity Is Non-Negotiable',
    body: 'You cannot build the body you want if your knees, shoulders, or lower back are always compromised. APEX uses trap bar variations, controlled eccentrics, and mandatory mobility work to make you bulletproof for the long game.',
  },
];

// Agentic AI Dashboard data
// const NEURAL_MATRIX = [
//   { week: 'W1', movement: 'Trap Bar Deadlift', target: '4×6 @ 185 lbs', actual: '4×6 @ 185 lbs', aiNext: '4×6 @ 195 lbs', status: 'ON TARGET' },
//   { week: 'W1', movement: 'Weighted Pull-Ups', target: '4×6 @ BW+25', actual: '3×6 @ BW+25', aiNext: '4×5 @ BW+25', status: 'SLIGHT LAG' },
//   { week: 'W1', movement: 'Overhead Press', target: '4×6 @ 115 lbs', actual: '4×6 @ 120 lbs', aiNext: '4×6 @ 125 lbs', status: 'AHEAD' },
//   { week: 'W2', movement: 'Romanian Deadlift', target: '4×8 @ 155 lbs', actual: '4×8 @ 155 lbs', aiNext: '4×8 @ 165 lbs', status: 'ON TARGET' },
//   { week: 'W2', movement: 'Cable Lateral Raise', target: '4×15 @ 15 lbs', actual: '4×15 @ 17.5 lbs', aiNext: '4×15 @ 20 lbs', status: 'AHEAD' },
// ];

const STATUS_COLORS: Record<string, string> = {
  'ON TARGET': '#C8A84B',
  'AHEAD':     '#4CAF50',
  'SLIGHT LAG':'rgba(240,180,60,0.85)',
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'dashboard'>('curriculum');

  return (
    <>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="section" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}>
        <div className="section-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <div className="section-label">The Founder</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: 0.95, color: 'var(--cream)', letterSpacing: '0.02em', marginBottom: '2rem' }}>
              BUILT THIS<br />FOR YOU.<br /><span style={{ color: 'var(--gold)' }}>BECAUSE</span><br />I LIVED IT.
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 480, marginBottom: '2.5rem' }}>
              I spent years watching the fitness industry ignore the men who needed it most — the 50-year-old banker with bad knees, the 62-year-old executive who hadn&apos;t trained in a decade, the 48-year-old who kept getting hurt following programs designed for someone half his age. I built APEX to fix that — with science, precision, and a system that actually respects your biology.
            </p>
            <a className="btn-gold" href="/pricing">Start Your Protocol →</a>
          </div>

          {/* Stat card column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { val: '10+', label: 'Years Coaching Men 40–70', sub: 'Exclusively NYC-based clientele' },
              // { val: '2,400+', label: 'APEX Members Transformed', sub: '97% program completion rate' },
              { val: '22 lbs', label: 'Average Fat Loss', sub: 'Across 90-day program cohort' },
              // { val: '+34%', label: 'Testosterone Improvement', sub: 'From 90-day bloodwork comparisons' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--gold)', lineHeight: 1, minWidth: '5rem' }}>{s.val}</div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cream)', fontSize: '0.88rem' }}>{s.label}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── My Story ───────────────────────────────── */}
      {/* <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <div className="section-label">The Story</div>
          <h2 className="section-h2">Why I Built APEX.</h2>ff
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '3rem' }}>
            <div style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.97rem' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                At 28, I was a certified trainer working in commercial gyms. I was good at helping young athletes get bigger and faster. But I kept running into a different client — the 55-year-old man whose doctor had just told him to &ldquo;get more active&rdquo; without any real guidance. Men who were motivated, intelligent, and completely failed by the fitness industry.
              </p>
              <p>
                I went deep. I spent years studying the endocrinology of male aging — testosterone, cortisol, insulin sensitivity, mTOR signaling, inflammaging. I started to see that what these men needed wasn&apos;t a modified version of a general program. They needed an entirely different system — one written for their biology from the ground up.
              </p>
            </div>
            <div style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.97rem' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                I built the first version of APEX for a handful of clients in NYC. The results were striking. Men who&apos;d been stuck for years started dropping fat, building real muscle, and reporting that they felt 15 years younger within the first month. Word spread fast.
              </p>
              <p>
                Today, APEX is the only New York City fitness system designed exclusively for men 45–70. It is not a gym. It is not an app. It is a precision protocol — now powered by an Agentic AI engine that analyzes your performance data and synthesizes your next optimized training block automatically. The science is real. The results are guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── Credentials ────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Credentials</div>
          <h2 className="section-h2">The Expertise Behind<br />The System.</h2>
          <p className="section-sub" style={{ marginBottom: '4rem' }}>
            APEX is not built on gym hustle mythology. It&apos;s built on accredited science, clinical research, and over a decade of measured outcomes with real men.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CREDENTIALS.map((c) => (
              <div key={c.num} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--gold)', opacity: 0.5, lineHeight: 1 }}>{c.num}</span>
                <div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: '0.75rem' }}>{c.title}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">The Method</div>
          <h2 className="section-h2">The Four Pillars<br />of APEX.</h2>
          <p className="section-sub" style={{ marginBottom: '4rem' }}>
            Every decision in APEX training traces back to one of four core principles. No fluff. No filler. Just the mechanics of lasting physical transformation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {PHILOSOPHY.map((p, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: '1rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agentic AI Training Dashboard ──────────── */}
      <section className="section">
        <div className="section-inner">
          {/* <div className="section-label">Agentic AI Engine</div> */}
          {/* <h2 className="section-h2">Your Training,<br />Optimized By AI.</h2> */}
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            {/* The APEX  Engine is not a chatbot. It is a performance data synthesizer — analyzing your logged sets, reps, and weight trajectories to automatically generate your next optimized training block. No coach necessary. No guesswork. */}
          </p>

          {/* Dashboard toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        
              <button
                
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', fontSize: '0.82rem', padding: '0.65rem 1.75rem',
                  border: '2px solid var(--gold)' ,
                  background:  'var(--gold-dim)' ,
                  color:  'var(--gold)' ,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Curriculum View
              </button>
       
          </div>

          {activeTab === 'curriculum' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[
                { phase: 'Month 1 — Foundation', focus: 'Joint Prep & Baseline Strength', detail: 'Machine-based compound lifts, controlled eccentrics, 3×10 rep ranges. Building the armor before loading the cannon.' },
                { phase: 'Month 2 — Accelerate', focus: 'MetCon & Hormonal Output', detail: 'Trap bar strength + sprint metabolic conditioning. Assault bike, sled, and rowing ergo work to spike testosterone naturally.' },
                { phase: 'Month 3 — Peak', focus: 'Max Output & Longevity', detail: 'Heavy tension loads, eccentric control techniques, and a Functional Output day that proves the system worked from Day 1.' },
              ].map((block, i) => (
                <div key={i} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '2rem' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{block.phase}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--cream)', marginBottom: '1rem', letterSpacing: '0.04em', lineHeight: 1.3 }}>{block.focus}</div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{block.detail}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              {/* Neural Link Header */}
              {/* <div style={{ background: 'var(--charcoal)', border: '1px solid var(--gold)', padding: '1.25rem 2rem', marginBottom: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 8px #4CAF50', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.82rem', color: 'var(--gold)' }}>
                    Neural Link — Alpha Protocol Active
                  </span>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                 ENGINE v1.0 · SYNCED
                </span>
              </div> */}

              {/* Data matrix table */}
              {/* <div style={{ overflowX: 'auto', background: 'var(--charcoal)', border: '1px solid var(--border)', borderTop: 'none' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <thead>
                    <tr style={{ background: 'rgba(200,168,75,0.05)' }}>
                      {['Week', 'Movement', 'Alpha Protocol Target', 'Your Execution', 'AI Next Rec.', 'Status'].map((h) => (
                        <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NEURAL_MATRIX.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700 }}>{row.week}</td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--cream)', fontSize: '0.9rem', fontWeight: 700 }}>{row.movement}</td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '0.88rem' }}>{row.target}</td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '0.88rem' }}>{row.actual}</td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 700 }}>{row.aiNext}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                            fontSize: '0.7rem', letterSpacing: '0.15em',
                            color: STATUS_COLORS[row.status] ?? 'var(--muted)',
                            background: `${STATUS_COLORS[row.status] ?? 'var(--muted)'}18`,
                            padding: '0.25rem 0.75rem',
                          }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              {/* Synthesize button */}
              {/* <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.15em',
                    textTransform: 'uppercase', fontSize: '0.9rem', padding: '1rem 2.5rem',
                    background: 'var(--gold)', color: 'var(--black)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  ⚡ Synthesize Next Week
                </button>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
                  AI will generate a Target Optimized training block based on your logged data
                </span>
              </div> */}

              {/* Nutrition auto-regulate callout */}
              {/* <div style={{ marginTop: '2rem', background: 'rgba(200,168,75,0.06)', border: '1px solid rgba(200,168,75,0.25)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🧬</span>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                    Auto-Regulated Nutrition Active
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Macro targets are being calculated from your current bodyweight trajectory. A stalled weight-loss input will trigger a caloric reduction mapped precisely to your 7-Day Nutrition Protocol — no manual adjustments required.
                  </p>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Ready to Start?</div>
          <h2 className="section-h2" style={{ marginBottom: '1.5rem' }}>If Not Now, When?</h2>
          <p className="section-sub" style={{ margin: '0 auto 3rem', textAlign: 'center', maxWidth: 520 }}>
            You&apos;ve read the science. You&apos;ve seen the system. The only question is whether you&apos;re going to do something about it. The next 90 days are going to pass regardless.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="btn-gold" href="/pricing">Choose Your Protocol →</a>
            <a className="btn-outline" href="/">See The Method</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
