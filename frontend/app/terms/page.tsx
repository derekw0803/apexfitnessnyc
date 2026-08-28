import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | APEX Human Performance',
  description: 'The terms governing use of the APEX Human Performance website and coaching services.',
};

const updated = 'August 17, 2026';

export default function TermsPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 760 }}>
        <div className="section-label">Legal</div>
        <h2 id="terms-of-service" className="section-h2">Terms of Service</h2>
        <p className="section-sub" style={{ maxWidth: 760 }}>Last updated: {updated}</p>

        <div style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
          <p>
            These Terms govern your use of this website and any coaching, training, or nutrition
            services you purchase through it (the &quot;Service&quot;), operated by [COMPANY NAME]
            (&quot;APEX,&quot; &quot;we,&quot; &quot;us&quot;). By using the site or purchasing a
            program, you agree to these Terms.
          </p>

          <h3 id="health-notice" style={sectionHeading}>1. Health and Safety Notice</h3>
          <p>
            <strong style={{ color: 'var(--cream)' }}>APEX provides fitness coaching, not medical
            care.</strong> We are not physicians, dietitians, physical therapists, or licensed
            healthcare providers, and nothing we provide is medical advice, diagnosis, or treatment.
            Our coaches do not prescribe, recommend, or manage medication, hormone therapy, or
            supplements as medical treatment.
          </p>
          <p>
            You should consult a physician before beginning any exercise or nutrition program. This
            matters especially if you are over 40, have been sedentary, or have or suspect any of the
            following: heart disease, high blood pressure, diabetes, a metabolic or endocrine
            condition, joint or musculoskeletal injury, a respiratory condition, or you are taking
            prescription medication.
          </p>
          <p>
            <strong style={{ color: 'var(--cream)' }}>Stop exercising and seek immediate medical
            attention</strong> if you experience chest pain or pressure, pain radiating into the arm
            or jaw, severe shortness of breath, dizziness, fainting, or an irregular heartbeat.
          </p>
          <p>
            You participate voluntarily and assume the inherent risks of physical training, including
            the risk of injury. You agree to disclose relevant medical conditions to your coach and to
            keep that information current.
          </p>

          <h3 id="no-guarantee" style={sectionHeading}>2. Results and Claims</h3>
          <p>
            Individual results vary and depend on factors outside our control, including your genetics,
            starting condition, medical history, adherence, sleep, and stress. Testimonials and
            examples shown on this site reflect individual experiences and are not a promise that you
            will achieve the same outcome.
          </p>

          <h3 id="eligibility" style={sectionHeading}>3. Eligibility</h3>
          <p>
            You must be at least 18 years old and able to enter a binding contract to purchase the
            Service.
          </p>

          <h3 id="purchases" style={sectionHeading}>4. Purchases and Payment</h3>
          <ul style={listStyle}>
            <li>All prices are in U.S. dollars and are charged as a single one-time payment unless
              expressly described otherwise at checkout.</li>
            <li>Payments are processed by Stripe. By purchasing, you also agree to Stripe&apos;s terms.
              We do not receive or store your full card details.</li>
            <li>Program access begins once payment clears and you have completed intake.</li>
            <li>We may change prices at any time, but a change never affects a program you have
              already purchased.</li>
          </ul>

          <h3 id="refunds" style={sectionHeading}>5. Refunds and Cancellation</h3>
          <p>
            Refund requests are handled case by case. Contact us through our{' '}
            <Link href="/contact">contact page</Link> to discuss a specific purchase.
          </p>

          <h3 id="your-responsibilities" style={sectionHeading}>6. Your Responsibilities</h3>
          <ul style={listStyle}>
            <li>Provide accurate information at intake, including relevant health information</li>
            <li>Follow the program as prescribed, and tell your coach when you cannot</li>
            <li>Use good judgment and stop if something hurts</li>
            <li>Keep any account credentials confidential</li>
          </ul>

          <h3 id="intellectual-property" style={sectionHeading}>7. Intellectual Property</h3>
          <p>
            All program materials, training protocols, written content, and media on this site are
            owned by APEX. When you purchase a program you receive a personal, non-transferable
            licence to use those materials for your own training. You may not resell, redistribute,
            publish, or share them, or use them to coach others commercially.
          </p>

          <h3 id="acceptable-use" style={sectionHeading}>8. Acceptable Use</h3>
          <p>
            Do not misuse the site: no attempting to breach security or access other users&apos; data,
            no scraping or automated data collection, no interfering with the Service&apos;s operation,
            and no unlawful, harassing, or abusive conduct toward staff or other clients.
          </p>

          <h3 id="termination" style={sectionHeading}>9. Termination</h3>
          <p>
            We may suspend or terminate access if you materially breach these Terms, behave abusively
            toward our staff or clients, or if continuing would be unsafe for you. Where we terminate
            for reasons other than your breach, we will refund the unused portion of your program.
          </p>

          <h3 id="disclaimers" style={sectionHeading}>10. Disclaimers and Limitation of Liability</h3>
          <p>
            The Service is provided &quot;as is.&quot; To the fullest extent permitted by law, we
            disclaim implied warranties of merchantability and fitness for a particular purpose.
          </p>
          <p>
            To the fullest extent permitted by law, our total liability arising out of the Service is
            limited to the amount you paid us in the twelve months preceding the claim.{' '}
            <strong style={{ color: 'var(--cream)' }}>Nothing in these Terms excludes or limits
            liability for death or personal injury caused by our negligence, for fraud, or for any
            other liability that cannot lawfully be excluded.</strong>
          </p>

          <h3 id="governing-law" style={sectionHeading}>11. Governing Law</h3>
          <p>
            These Terms are governed by the laws of the State of New York, without regard to conflict
            of law principles. Disputes will be brought in the state or federal courts located in New
            York County, New York. This does not affect any right you have to bring a claim in your
            local small claims court, or any mandatory consumer protection rights in your state of
            residence.
          </p>

          <h3 id="changes" style={sectionHeading}>12. Changes to These Terms</h3>
          <p>
            We may update these Terms. Material changes will be reflected in the &quot;Last
            updated&quot; date above. Changes do not apply retroactively to programs already
            purchased.
          </p>

          <h3 id="contact" style={sectionHeading}>13. Contact</h3>
          <p>
            Questions about these Terms? Reach us through our{' '}
            <Link href="/contact">contact page</Link>. See also our{' '}
            <Link href="/privacy">Privacy Policy</Link>.
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
