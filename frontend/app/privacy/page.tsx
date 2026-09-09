export const metadata = {
  title: 'Privacy Policy | APEX Human Performance',
};

const updated = 'June 23, 2026';

export default function PrivacyPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 760 }}>
        <div className="section-label">Legal</div>
        <h2 id="privacy-policy" className="section-h2">Privacy Policy</h2>
        <p className="section-sub" style={{ maxWidth: 760 }}>
          Last updated: {updated}
        </p>

        <div style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
          <p>
            [COMPANY NAME] (&quot;APEX,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
            this website and the coaching services offered through it (the &quot;Service&quot;). This
            Privacy Policy explains what personal information we collect, how we use and protect it,
            and the choices and rights available to you. By using the Service, you agree to the
            practices described here.
          </p>

          <h3 id="information-we-collect" style={sectionHeading}>1. Information We Collect</h3>
          <p><strong style={{ color: 'var(--cream)' }}>Contact information.</strong> When you submit our
            contact form, we collect your first name, last name, phone number, and email address so a
            coach can respond to your inquiry.</p>
          <p><strong style={{ color: 'var(--cream)' }}>Health and fitness information.</strong> If you
            become a client and use the member dashboard, we may collect information you choose to
            provide such as workout logs, body composition or biometric measurements, training history,
            fitness goals, and other health-related information you share with your coach. We collect
            this category of information only after you affirmatively opt in, and you may decline to
            provide it without affecting your ability to inquire about our services.</p>
          <p><strong style={{ color: 'var(--cream)' }}>Technical information.</strong> Our servers
            automatically log standard technical data (such as IP address, browser type, and request
            timestamps) for security and debugging purposes. We do not currently use advertising cookies,
            analytics trackers, or third-party tracking pixels on this site. If that changes, we will
            update this policy.</p>

          <h3 id="how-we-use-your-information" style={sectionHeading}>2. How We Use Your Information</h3>
          <ul style={listStyle}>
            <li>To respond to inquiries submitted through our contact form</li>
            <li>To deliver, personalize, and improve coaching and training services</li>
            <li>To communicate with you about your account, sessions, or program</li>
            <li>To maintain the security and integrity of our systems</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p>We do not use your health information for advertising and will never sell it.</p>

          <h3 id="consent-for-health-information" style={sectionHeading}>3. Consent for Health Information</h3>
          <p>
            Before we collect any health or fitness data beyond basic contact information, we will ask
            for your explicit, opt-in consent and explain how that specific data will be used. You may
            withdraw consent at any time by contacting us, after which we will stop collecting new
            health data from you and delete what we are not legally required to retain.
          </p>

          <h3 id="how-we-share-information" style={sectionHeading}>4. How We Share Information</h3>
          <p>We do not sell personal information. We share information only with:</p>
          <ul style={listStyle}>
            <li>Service providers who host our infrastructure and database (currently Supabase) and our
              website (currently Vercel), strictly to operate the Service on our behalf</li>
            <li>Our payment processor (currently Stripe), which collects and processes your payment
              details directly. APEX never receives or stores your full card number. Stripe handles
              that information under its own privacy policy, available at{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
            <li>Law enforcement or regulators when required by valid legal process</li>
            <li>A successor entity in the event of a merger, acquisition, or sale of assets, subject to
              the same protections described in this policy</li>
          </ul>

          <h3 id="data-security" style={sectionHeading}>5. Data Security</h3>
          <p>
            We use industry-standard safeguards to protect your information, including encrypted
            transmission (HTTPS), restricted database access controls, and rate-limiting to prevent
            abuse of our systems. No method of transmission or storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h3 id="data-retention" style={sectionHeading}>6. Data Retention</h3>
          <p>
            We retain personal information only as long as necessary to provide the Service, respond to
            your inquiry, or comply with legal obligations. You may request deletion of your information
            at any time as described in <a href="#your-rights">Section 8</a>.
          </p>

          <h3 id="hipaa" style={sectionHeading}>7. Not a HIPAA-Covered Entity</h3>
          <p>
            APEX is a personal training and coaching business, not a healthcare provider, health plan,
            or healthcare clearinghouse, and is generally not subject to HIPAA. We nonetheless apply
            safeguards modeled on those standards to protect any health-related information you share
            with us.
          </p>

          <h3 id="your-rights" style={sectionHeading}>8. Your Rights and Choices</h3>
          <p>Regardless of where you live, you may contact us to:</p>
          <ul style={listStyle}>
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Withdraw consent for the collection of health-related information</li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}><strong style={{ color: 'var(--cream)' }}>California
            residents (CCPA/CPRA).</strong> You have the right to know what personal information we
            collect, to request deletion or correction, to opt out of the sale or sharing of personal
            information (we do not sell or share your information), and to limit the use of sensitive
            personal information. We will not discriminate against you for exercising these rights.</p>
          <p><strong style={{ color: 'var(--cream)' }}>Consumer health data rights (Washington, Nevada,
            Connecticut, and similar state laws).</strong> Where applicable, you have the right to
            confirm whether we collect consumer health data about you, to access it, to withdraw consent,
            and to request its deletion. We do not use geofencing around healthcare facilities, and we do
            not sell consumer health data.</p>
          <p>To exercise any of these rights, contact us using the information in <a href="#contact-us">Section 11</a>.</p>

          <h3 id="childrens-privacy" style={sectionHeading}>9. Children&apos;s Privacy</h3>
          <p>
            The Service is intended for adults. We do not knowingly collect personal information from
            anyone under 18. If you believe a minor has provided us information, contact us and we will
            delete it.
          </p>

          <h3 id="changes" style={sectionHeading}>10. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected by
            updating the &quot;Last updated&quot; date above, and where required by law, we will provide
            additional notice or seek renewed consent.
          </p>

          <h3 id="contact-us" style={sectionHeading}>11. Contact Us</h3>
          <p>
            For questions about this Privacy Policy or to exercise your privacy rights, contact us at{' '}
            <a href="mailto:privacy@apexhumanperformance.com">privacy@apexhumanperformance.com</a> or
            through our <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

const sectionHeading: React.CSSProperties = {
  color: 'var(--cream)',
  fontFamily: "'Barlow Condensed', sans-serif",
  letterSpacing: '0.04em',
  fontSize: '1.15rem',
  marginTop: '2.5rem',
  marginBottom: '0.75rem',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  margin: '0.5rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};
