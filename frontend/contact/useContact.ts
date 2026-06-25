import { useState } from "react";

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const useContact = () => {
  // Use process.env.NEXT_PUBLIC_BASE_URL if you are using Next.js App Router ('use client')
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8081';

  // Keep only one single source of truth for your state
  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const validate = (): boolean => {
    // Basic validation check: ensure required fields are not empty strings
    if (!form.firstName || !form.lastName || !form.email) {
      console.error("Missing required fields");
      return false; // Validation failed
    }
    return true; // Validation passed
  };

  const submit = async () => {
    const isValid = validate();

    // If validation fails, stop execution
    if (!isValid) {
      return;
    }

    try {
      console.log("Sending message:", form);

      const response = await fetch(`${BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        console.log("Message successfully sent");
        // Reset form state here after successful submit
        setForm({ firstName: '', lastName: '', phone: '', email: '' });
        return;
      }

      console.error("Server responded with an error:", response.status);
    } catch (e) {
      console.error("Network error during submission:", e);
    }
  };

  // Only return the necessary state and functions
  return {
    form,
    setForm,
    submit
  };
};

export default useContact;
