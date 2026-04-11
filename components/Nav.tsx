'use client';
import { useState } from 'react';
import styles from './Nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav id="nav" className={styles.nav}>
      <a className="nav-logo" href="/">
        APE<span style={{ color: 'var(--cream)' }}>X</span>
      </a>
      <ul className={`${styles.navLinks} ${open ? styles.navLinksOpen : ''}`}>
        <li><a href="/" onClick={() => setOpen(false)}>Home</a></li>
        <li><a href="/about-me" onClick={() => setOpen(false)}>About Me</a></li>
        <li><a href="/training" onClick={() => setOpen(false)}>Training</a></li>
        <li><a href="/pricing" onClick={() => setOpen(false)}>Pricing</a></li>
        <li><a href="/contact" onClick={() => setOpen(false)}>Contact</a></li>
      </ul>
      <div className={styles.navActions}>
        <a className={`${styles.navCtaBtn} ${styles.solid}`} href="/pricing">Start Now</a>
        <div
          className={`${styles.navHamburger} ${open ? styles.navHamburgerOpen : ''}`}
          id="hamburger"
          onClick={() => setOpen(!open)}
          role="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span /><span /><span />
        </div>
      </div>
    </nav>
  );
}
