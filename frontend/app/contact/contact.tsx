'use client';

import styles from './contact.module.css';
import useContact from './useContact';

export default function ContactPage() {
  const {
    form,
    setForm,
    submit
  } = useContact();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className={styles.header}>
          <div className="section-label">Contact</div>
          <h2 className="section-h2">Get In Touch</h2>
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
                required
              />
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
                required
              />
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
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-gold">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
