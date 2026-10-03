'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

type NavProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

/** POSTs to the logout route and redirects — see app/api/auth/logout/route.ts
 * for why this goes through a server route instead of the browser client's
 * own signOut(). A plain HTML form works whether or not JS has hydrated. */
function LogoutForm({ className, onSubmit }: { className?: string; onSubmit?: () => void }) {
  return (
    <form action="/api/auth/logout" method="post" onSubmit={onSubmit}>
      <button type="submit" className={className}>Logout</button>
    </form>
  );
}

export default function Nav({ isAuthenticated, isAdmin }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="nav" className={styles.nav}>
        <Link className="nav-logo" href="/">
          APE<span style={{ color: 'var(--cream)' }}>X</span>
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about-me">About Me</Link></li>
          <li><Link href="/training">Training</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link href="/dashboard">Dashboard</Link></li>
              {isAdmin && <li><Link href="/admin">Admin</Link></li>}
              <li><LogoutForm className={styles.navLogoutBtn} /></li>
            </>
          ) : (
            <li><Link href="/login">Login</Link></li>
          )}
        </ul>
        <div className={styles.navActions}>
          <Link className={`${styles.navCtaBtn} ${styles.solid}`} href="/pricing">Start Now</Link>
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
            <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link href="/about-me" onClick={() => setOpen(false)}>About Me</Link></li>
            <li><Link href="/training" onClick={() => setOpen(false)}>Training</Link></li>
            <li><Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link></li>
            <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
                {isAdmin && <li><Link href="/admin" onClick={() => setOpen(false)}>Admin</Link></li>}
                <li><LogoutForm className={styles.drawerLogoutBtn} onSubmit={() => setOpen(false)} /></li>
              </>
            ) : (
              <li><Link href="/login" onClick={() => setOpen(false)}>Login</Link></li>
            )}
          </ul>
          <Link className={styles.drawerCta} href="/pricing" onClick={() => setOpen(false)}>
            Start Now
          </Link>
        </div>
      )}
    </>
  );
}
