import { useState } from "react";

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const useContact = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081';

  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const validate = (): boolean => {
    if (!form.firstName || !form.lastName || !form.email) {
      console.error("Missing required fields");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      console.log("Sending message:", form);

      const response = await fetch(`${BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        console.log("Message successfully sent");
        setForm({ firstName: '', lastName: '', phone: '', email: '' });
        return;
      }

      console.error("Server responded with an error:", response.status);
    } catch (e) {
      console.error("Network error during submission:", e);
    }
  };

  return { form, setForm, submit };
};

export default useContact;
