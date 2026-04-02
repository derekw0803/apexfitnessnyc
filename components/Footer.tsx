import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <a className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }} href="/">
            APE<span style={{ color: 'var(--cream)' }}>X</span>
          </a>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '1rem' }}>
            The exclusive NYC fitness system engineered specifically for men 45–70.
            Precision training, hormone optimization, guaranteed results.
          </p>
        </div>
        {/* <div>
          <h4 className={styles.footerH4}>Platform</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/about-me">About the Founder</a></li>
            <li><a href="/training">Tailored Workouts</a></li>
            <li><a href="/pricing">Membership Pricing</a></li>
            <li><a href="/">The APEX Method</a></li>
            <li><a href="/">Scientific Research</a></li>
          </ul>
        </div> */}
        {/* <div>
          <h4 className={styles.footerH4}>Members</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/dashboard">Member Portal</a></li>
            <li><a href="/pricing">Book a Trainer</a></li>
            <li><a href="/dashboard">Nutrition Dashboard</a></li>
            <li><button>Support &amp; FAQ</button></li>
          </ul>
        </div> */}
        {/* <div>
          <h4 className={styles.footerH4}>Private List</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            Join our private mailing list for exclusive insights on longevity and performance.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="YOUR EMAIL"
              style={{
                flex: 1, background: 'var(--charcoal)', border: '1px solid var(--border)',
                color: 'var(--cream)', padding: '0.75rem 1rem', fontSize: '0.85rem',
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            />
            <button style={{
              background: 'var(--gold)', border: 'none', color: 'var(--black)',
              padding: '0 1.5rem', fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            }}>JOIN</button>
          </div>
        </div> */}
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 APEX Human Performance. All rights reserved. New York City.</p>
        {/* <div className={styles.footerBottomLinks}>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
}
