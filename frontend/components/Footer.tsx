import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Brand */}
        <div>
          <Link className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }} href="/">
            APE<span style={{ color: 'var(--cream)' }}>X</span>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '1rem' }}>
            The exclusive NYC fitness system engineered specifically for men 40+.
            Precision training, hormone optimization, guaranteed results.
          </p>
        </div>

        {/* Site map */}
        <div>
          <h4 className={styles.footerH4}>Site Map</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about-me">About Me</Link></li>
            <li><Link href="/training">Training</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className={styles.footerH4}>Programs</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/training">1-on-1 Private Training</Link></li>
            <li><Link href="/training">Online Coaching</Link></li>
            <li><Link href="/pricing">View Pricing</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.footerH4}>Contact</h4>
          <ul className={styles.footerLinks}>
            <li>New York City, NY</li>
            <li>
              <Link href="/contact">Send a Message</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 APEX Human Performance. All rights reserved. New York City.</p>
        <div className={styles.footerBottomLinks}>
          <Link href="/contact">Contact</Link>
          <Link href="/pricing">Get Started</Link>
        </div>
      </div>
    </footer>
  );
}
