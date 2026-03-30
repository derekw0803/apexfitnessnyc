import type { Metadata } from 'next';
import { Bebas_Neue, Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Apex Health | Agentic Training',
  description: 'Next Generation Health Optimization for Men 45-70',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlowCondensed.variable} ${inter.variable}`}>
      <body>
        <div className="noise" />
        <div id="cursor" />
        <div id="cursor-ring" />

        {/* ── Nav ── */}
        <nav id="nav">
          <a className="nav-logo" href="/">
            APE<span style={{ color: 'var(--cream)' }}>X</span>
          </a>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about-me">About Me</a></li>
            <li><a href="/training">Training</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
          <div className="nav-actions">
            <button className="nav-cta-btn ghost">Log In</button>
            <a className="nav-cta-btn solid" href="/pricing">Start Now — $89/mo</a>
            <div className="nav-hamburger" id="hamburger">
              <span /><span /><span />
            </div>
          </div>
        </nav>

        {/* ── Page content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <main style={{ flex: 1, paddingTop: '72px' }}>{children}</main>

          {/* ── Footer ── */}
          <footer id="footer">
            <div className="footer-grid">
              <div>
                <a className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }} href="/">
                  APE<span style={{ color: 'var(--cream)' }}>X</span>
                </a>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '1rem' }}>
                  The exclusive NYC fitness system engineered specifically for men 45–70.
                  Precision training, hormone optimization, guaranteed results.
                </p>
              </div>
              <div>
                <h4 className="footer-h4">Platform</h4>
                <ul className="footer-links">
                  <li><a href="/about-me">About the Founder</a></li>
                  <li><a href="/training">Tailored Workouts</a></li>
                  <li><a href="/pricing">Membership Pricing</a></li>
                  <li><a href="/">The APEX Method</a></li>
                  <li><a href="/">Scientific Research</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-h4">Members</h4>
                <ul className="footer-links">
                  <li><a href="/dashboard">Member Portal</a></li>
                  <li><a href="/pricing">Book a Trainer</a></li>
                  <li><a href="/dashboard">Nutrition Dashboard</a></li>
                  <li><button>Support &amp; FAQ</button></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-h4">Private List</h4>
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
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 APEX Human Performance. All rights reserved. New York City.</p>
              <div className="footer-bottom-links">
                <a href="/">Privacy Policy</a>
                <a href="/">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>

        {/* ── Floating chat button ── */}
        <button className="chat-btn" aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* ── Custom cursor script ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var cursor = document.getElementById('cursor');
            var ring = document.getElementById('cursor-ring');
            var mx = 0, my = 0, rx = 0, ry = 0;
            document.addEventListener('mousemove', function(e) {
              mx = e.clientX; my = e.clientY;
              cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
            });
            function animRing() {
              rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
              ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
              requestAnimationFrame(animRing);
            }
            animRing();
          })();
        ` }} />
      </body>
    </html>
  );
}
