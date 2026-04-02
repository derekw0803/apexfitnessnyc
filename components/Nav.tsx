import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav id="nav" className={styles.nav}>
      <a className="nav-logo" href="/">
        APE<span style={{ color: 'var(--cream)' }}>X</span>
      </a>
      <ul className={styles.navLinks}>
        <li><a href="/">Home</a></li>
        <li><a href="/about-me">About Me</a></li>
        <li><a href="/training">Training</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
      <div className={styles.navActions}>
        {/* <button className={`${styles.navCtaBtn} ${styles.ghost}`}>Log In</button> */}
        <a className={`${styles.navCtaBtn} ${styles.solid}`} href="/pricing">Start Now</a>
        <div className={styles.navHamburger} id="hamburger">
          <span /><span /><span />
        </div>
      </div>
    </nav>
  );
}
