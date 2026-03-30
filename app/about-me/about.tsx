const FOUNDER_TIMELINE = [
  {
    year: 'UofM',
    title: 'University of Michigan — Kinesiology',
    body: 'Studied the science of human movement, exercise physiology, and strength adaptation. Built the academic foundation that every APEX protocol is written on.',
  },
  {
    year: '2021',
    title: 'Started Personal Training',
    body: 'Began coaching clients one-on-one, quickly specializing in men over 40 who were being failed by generic fitness programs not built for their biology.',
  },
  {
    year: '2025',
    title: 'Built the APEX System',
    body: 'APEX became a complete protocol: training, nutrition, recovery, and progression logic designed specifically for older men who want measurable body-composition change without guesswork.',
  },
  {
    year: '2026',
    title: 'Added Agentic AI Optimization',
    body: 'The system evolved from coaching logic into an adaptive engine. Logged lifts, bodyweight trends, and recovery signals now feed into a dashboard that recommends the next training block automatically.',
  },
];


const TRAINING_BLOCKS = [
  {
    phase: 'Month 1',
    title: 'Foundation and Joint Prep',
    detail: 'Controlled eccentrics, machine-supported compound work, and baseline movement quality build resilience before heavier loading begins.',
  },
  {
    phase: 'Month 2',
    title: 'Acceleration and Hormonal Output',
    detail: 'Trap bar strength, sled work, rowing, and sprint intervals raise work capacity while preserving joints and recovery bandwidth.',
  },
  {
    phase: 'Month 3',
    title: 'Peak Output and Longevity',
    detail: 'Heavier tension, strategic carries, and mobility-focused support work turn the previous eight weeks into visible performance change.',
  },
];

const AGENTIC_DASHBOARD = [
  {
    week: 'W1',
    movement: 'Trap Bar Deadlift',
    target: '4x6 @ 185 lbs',
    actual: '4x6 @ 185 lbs',
    next: '4x6 @ 195 lbs',
    status: 'On target',
  },
  {
    week: 'W1',
    movement: 'Weighted Pull-Ups',
    target: '4x6 @ BW+25',
    actual: '3x6 @ BW+25',
    next: '4x5 @ BW+25',
    status: 'Slight lag',
  },
  {
    week: 'W1',
    movement: 'Overhead Press',
    target: '4x6 @ 115 lbs',
    actual: '4x6 @ 120 lbs',
    next: '4x6 @ 125 lbs',
    status: 'Ahead',
  },
  {
    week: 'W2',
    movement: 'Romanian Deadlift',
    target: '4x8 @ 155 lbs',
    actual: '4x8 @ 155 lbs',
    next: '4x8 @ 165 lbs',
    status: 'On target',
  },
];

const STATUS_STYLES: Record<string, { color: string; background: string }> = {
  'On target': {
    color: 'var(--gold)',
    background: 'rgba(200, 168, 75, 0.12)',
  },
  Ahead: {
    color: '#77d77c',
    background: 'rgba(119, 215, 124, 0.12)',
  },
  'Slight lag': {
    color: '#f0c566',
    background: 'rgba(240, 197, 102, 0.12)',
  },
};

export default function AboutMePage() {
  return (
    <>
      <section
        className="section"
        style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}
      >
        <div
          className="section-inner about-me-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="section-label">About Me</div>
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
              I BUILT APEX
              <br />
              FOR MEN THE
              <br />
              INDUSTRY IGNORED.
            </h1>
            <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 620 }}>
              My name is Derek, and I am the founder of Apex Fitness. I graduated from the
              University of Michigan Kinesiology school and have been a personal trainer for 5
              years. My clients&rsquo; success of gaining 30 lbs of combined muscle is what inspired
              me to create this platform, and help guys past 40 reclaim the body and health they
              once had.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a className="btn-gold" href="/pricing">
                Start Your Protocol
              </a>
              <a className="btn-outline" href="/about">
                View Original About Page
              </a>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(180deg, rgba(200, 168, 75, 0.1), rgba(17, 24, 39, 0.9))',
              border: '1px solid rgba(200, 168, 75, 0.2)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                fontSize: '0.78rem',
                marginBottom: '1rem',
              }}
            >
              Operator Summary
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                '15+ years coaching men in high-performance environments',
                'Programming built around male aging physiology',
                'Training, nutrition, recovery, and progression in one system',
                'Agentic AI dashboard layered into the coaching workflow',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    border: '1px solid var(--border)',
                    background: 'rgba(5, 8, 16, 0.5)',
                    padding: '1rem 1.1rem',
                    color: 'var(--text)',
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">Founder Timeline</div>
          <h2 className="section-h2">How The System Took Shape.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            The coaching model came first. The software layer came later. Both came from the same
            frustration: older men were doing serious work with tools that were not built for them.
          </p>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {FOUNDER_TIMELINE.map((item) => (
              <div
                key={item.year}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '1.5rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}
                >
                  {item.year}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--cream)',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label">Client Stories</div>
          <h2 className="section-h2">Real Results From Real Men.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            The proof is in the people. Here is what two of our clients have to say about their
            experience with the APEX system.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                background: 'var(--charcoal)',
                border: '1px solid rgba(200, 168, 75, 0.2)',
                padding: '2rem',
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: '1.25rem',
                }}
              >
                Client Alpha
              </div>
              <p
                style={{
                  color: 'var(--text)',
                  lineHeight: 1.85,
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  marginBottom: '1.25rem',
                }}
              >
                &ldquo;I have been training with Apex for the last 3 years and I have never felt
                better about my body. My shoulder and joint pain has gone away and I look and feel
                20 years younger.&rdquo;
              </p>
            </div>

            <div
              style={{
                background: 'var(--charcoal)',
                border: '1px solid rgba(200, 168, 75, 0.2)',
                padding: '2rem',
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: '1.25rem',
                }}
              >
                Client B
              </div>
              <p
                style={{
                  color: 'var(--text)',
                  lineHeight: 1.85,
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  marginBottom: '1.25rem',
                }}
              >
                &ldquo;I have always been a taller individual so it is hard for me to understand
                how to perform complex movements in the right way. Apex has helped me learn how to
                train the right way for someone my size and I love the way my body looks.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">Training + AI</div>
          <h2 className="section-h2">The Program Logic Behind The Dashboard.</h2>
          <p className="section-sub" style={{ marginBottom: '3rem' }}>
            Three phases, twelve weeks, one system. Every block builds on the last to produce
            measurable body-composition change without destroying your joints.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {TRAINING_BLOCKS.map((block) => (
              <div
                key={block.phase}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {block.phase}
                </div>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--cream)',
                    marginBottom: '0.85rem',
                  }}
                >
                  {block.title}
                </h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.75 }}>{block.detail}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              border: '1px solid rgba(200, 168, 75, 0.22)',
              background: 'rgba(5, 8, 16, 0.55)',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.82rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                }}
              >
                Agentic Performance Dashboard
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                Training data synthesis preview
              </div>
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(200, 168, 75, 0.06)' }}>
                  {['Week', 'Movement', 'Target', 'Actual', 'AI Next', 'Status'].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: '0.95rem 1.1rem',
                        textAlign: 'left',
                        fontSize: '0.72rem',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGENTIC_DASHBOARD.map((row) => (
                  <tr key={`${row.week}-${row.movement}`} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--gold)' }}>{row.week}</td>
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--cream)' }}>{row.movement}</td>
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--muted)' }}>{row.target}</td>
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--muted)' }}>{row.actual}</td>
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--gold)' }}>{row.next}</td>
                    <td style={{ padding: '1rem 1.1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.75rem',
                          color: STATUS_STYLES[row.status].color,
                          background: STATUS_STYLES[row.status].background,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontSize: '0.72rem',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-me-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
