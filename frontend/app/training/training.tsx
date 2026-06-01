const TRAINING_PHASES = [
  {
    phase: 'Month 1',
    title: 'Foundation & Joint Prep',
    detail:
      'Machine-based compound lifts, controlled eccentrics, 3×10 rep ranges. Building the armor before loading the cannon.',
  },
  {
    phase: 'Month 2',
    title: 'Accelerate & MetCon',
    detail:
      'Trap bar strength + sprint metabolic conditioning. Assault bike, sled, and rowing ergo work to spike testosterone naturally.',
  },
  {
    phase: 'Month 3',
    title: 'Peak Output & Longevity',
    detail:
      'Heavy tension loads, eccentric control techniques, and a Functional Output day that proves the system worked from Day 1.',
  },
];

const SAMPLE_WEEK = [
  { day: 'Monday', focus: 'Lower Power', },
  { day: 'Tuesday', focus: 'Upper Push', },
  { day: 'Wednesday', focus: 'Active Recovery', },
  { day: 'Thursday', focus: 'Upper Pull', },
  { day: 'Friday', focus: 'MetCon', },
  { day: 'Saturday', focus: 'Accessory', },
  { day: 'Sunday', focus: 'Rest', },
];

export default function TrainingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="section"
        style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}
      >
        <div className="section-inner">
          <div className="section-label">The Program</div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
              lineHeight: 0.92,
              letterSpacing: '0.03em',
              color: 'var(--cream)',
              marginBottom: '1.5rem',
            }}
          >
            BUILT FOR YOUR
            <br />
            BIOLOGY.
            <br />
            <span style={{ color: 'var(--gold)' }}>NOT THEIRS.</span>
          </h1>
          <p
            style={{
              color: 'var(--text)',
              fontSize: '1rem',
              lineHeight: 1.8,
              maxWidth: 600,
              marginBottom: '2.5rem',
            }}
          >
            The APEX training system is a 3-month, phase-based protocol engineered around male
            aging physiology. Every session accounts for your hormones, joint health, and recovery
            capacity — not an athlete half your age.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a className="btn-gold" href="/pricing">
              Start Your Protocol
            </a>
            <a className="btn-outline" href="/about-me">
              Meet the Founder
            </a>
          </div>
        </div>
      </section>

      {/* ── 3-Phase Overview ── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">The System</div>
          <h2 className="section-h2">Three Phases. One Protocol.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            Each phase builds directly on the last. There is no skipping ahead and no wasted weeks.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {TRAINING_PHASES.map((block) => (
              <div
                key={block.phase}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {block.phase}
                </div>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--cream)',
                    marginBottom: '1rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1.3,
                  }}
                >
                  {block.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                  {block.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Week ── */}
      {/* <section className="section">
        <div className="section-inner">
          <div className="section-label">Sample Schedule</div>
          <h2 className="section-h2">A Week Inside APEX.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            This is what Month 2 looks like. Every session has a purpose. Nothing is filler.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {SAMPLE_WEEK.map((day) => (
              <div
                key={day.day}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 160px 1fr',
                  gap: '1.5rem',
                  alignItems: 'start',
                  padding: '1.25rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.25rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}
                >
                  {day.day}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--cream)',
                  }}
                >
                  {day.focus}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA ── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div
          className="section-inner"
          style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Ready?
          </div>
          <h2 className="section-h2" style={{ marginBottom: '1.5rem' }}>
            The Next 90 Days Are Yours.
          </h2>
          <p
            className="section-sub"
            style={{ margin: '0 auto 3rem', textAlign: 'center', maxWidth: 500 }}
          >
            The program is waiting. Your biology is ready. The only thing left is the decision.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="btn-gold" href="/pricing">
              Choose Your Protocol →
            </a>
            <a className="btn-outline" href="/">
              See The Method
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .training-week-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
