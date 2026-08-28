'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './contact.module.css';
import useContact from './useContact';

function FieldError({ text }: { text: string }) {
  return (
    <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
      {text}
    </span>
  );
}

export default function ContactPage() {
  const {
    form,
    setForm,
    submit,
    status,
    message,
    fieldErrors
  } = useContact();
  const [consent, setConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    submit();
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className={styles.header}>
          <div className="section-label">Contact</div>
          <h2 id="contact" className="section-h2">Get In Touch</h2>
          <p className="section-sub">
            Ready to start your transformation? Fill out your details and a coach will reach out within 24 hours.
          </p>
        </div>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="FIRST NAME"
                value={form.firstName}
                onChange={handleChange}
                className={styles.input}
                aria-invalid={!!fieldErrors.firstName}
                required
              />
              {fieldErrors.firstName && <FieldError text={fieldErrors.firstName} />}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="LAST NAME"
                value={form.lastName}
                onChange={handleChange}
                className={styles.input}
                aria-invalid={!!fieldErrors.lastName}
                required
              />
              {fieldErrors.lastName && <FieldError text={fieldErrors.lastName} />}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="PHONE NUMBER"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                aria-invalid={!!fieldErrors.email}
                required
              />
              {fieldErrors.email && <FieldError text={fieldErrors.email} />}
            </div>
          </div>

          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree to the <Link href="/privacy">Privacy Policy</Link> and consent to APEX
              storing my information to respond to this inquiry. See how we handle{' '}
              <Link href="/privacy#consent-for-health-information">health information</Link>.
            </span>
          </label>

          {/* Honeypot: hidden from humans and screen readers, tempting to bots. */}
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />

          <button type="submit" className="btn-gold" disabled={!consent || status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Submit'}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: status === 'success' ? '#4ade80' : '#f87171',
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
