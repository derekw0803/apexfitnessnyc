'use client';
import { useState } from 'react';
import styles from './Nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="nav" className={styles.nav}>
        <a className="nav-logo" href="/">
          APE<span style={{ color: 'var(--cream)' }}>X</span>
        </a>
        <ul className={styles.navLinks}>
          <li><a href="/">Home</a></li>
          <li><a href="/about-me">About Me</a></li>
          <li><a href="/training">Training</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className={styles.navActions}>
          <a className={`${styles.navCtaBtn} ${styles.solid}`} href="/pricing">Start Now</a>
          <button
            className={`${styles.navHamburger} ${open ? styles.navHamburgerOpen : ''}`}
            id="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Full-screen drawer ── */}
      {open && (
        <div className={styles.drawer}>
          <button
            className={styles.drawerClose}
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <ul className={styles.drawerLinks}>
            <li><a href="/" onClick={() => setOpen(false)}>Home</a></li>
            <li><a href="/about-me" onClick={() => setOpen(false)}>About Me</a></li>
            <li><a href="/training" onClick={() => setOpen(false)}>Training</a></li>
            <li><a href="/pricing" onClick={() => setOpen(false)}>Pricing</a></li>
            <li><a href="/contact" onClick={() => setOpen(false)}>Contact</a></li>
          </ul>
          <a className={styles.drawerCta} href="/pricing" onClick={() => setOpen(false)}>
            Start Now
          </a>
        </div>
      )}
    </>
  );
}
