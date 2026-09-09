import { useState } from "react";

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** Honeypot. Hidden from real users; bots fill it in. */
  company: string;
};

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: Form = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  company: '',
};

const useContact = () => {
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    setFieldErrors({});
    setMessage('');

    // Client-side check for instant feedback; the server validates again.
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setMessage('Please check the highlighted fields.');
      return;
    }

    setStatus('submitting');

    try {
      // Same-origin call: the API now ships with the site, so there is no
      // cross-origin base URL to configure and nothing pointing at localhost.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setForm(EMPTY);
        setStatus('success');
        setMessage("Thanks. We've got your details. A coach will reach out within 24 hours.");
        return;
      }

      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setStatus('error');
      setMessage(data.error || 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  };

  return { form, setForm, submit, status, message, fieldErrors };
};

export default useContact;
