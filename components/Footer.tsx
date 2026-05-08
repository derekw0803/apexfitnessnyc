import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <Link className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }} href="/">
            APE<span style={{ color: 'var(--cream)' }}>X</span>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '1rem' }}>
            The exclusive NYC fitness system engineered specifically for men 40+.
            Precision training, hormone optimization, guaranteed results.
          </p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 APEX Human Performance. All rights reserved. New York City.</p>
      </div>
    </footer>
  );
}
