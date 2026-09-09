import Stripe from 'stripe';

/**
 * Server-only Stripe client.
 *
 * SECURITY: STRIPE_SECRET_KEY must never reach the browser. Only import this
 * from route handlers or server components.
 */
let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripe) return stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables.'
    );
  }

  stripe = new Stripe(key, {
    apiVersion: '2026-07-29.dahlia',
    typescript: true,
  });

  return stripe;
}

/**
 * Absolute base URL for building Stripe redirect URLs.
 * Stripe requires fully-qualified success/cancel URLs.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Vercel provides this automatically on preview deployments.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
