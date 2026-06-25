import Link from 'next/link';

export default function LinksPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}>
      <div className="section-inner" style={{ maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div className="nav-logo" style={{ display: 'inline-flex', marginBottom: '1.5rem', fontSize: '2.5rem' }}>
          APE<span style={{ color: 'var(--cream)' }}>X</span>
        </div>
        <p className="section-sub" style={{ margin: '0 auto 3rem', textAlign: 'center' }}>
          NYC Personal Training &amp; Online Coaching for Men 40+
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a
            className="btn-outline"
            href="https://www.instagram.com/apex.fitnessnyc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ justifyContent: 'center' }}
          >
            Instagram
          </a>
          <Link className="btn-outline" href="/" style={{ justifyContent: 'center' }}>
            Visit the Website
          </Link>
          <Link className="btn-gold" href="/pricing" style={{ justifyContent: 'center' }}>
            Get Started — View Pricing
          </Link>
          <Link className="btn-outline" href="/contact" style={{ justifyContent: 'center' }}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
