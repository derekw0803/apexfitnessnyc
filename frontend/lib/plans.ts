/**
 * Canonical plan catalogue.
 *
 * This is the single source of truth for what things cost. The pricing page
 * renders from it, and the checkout API prices from it.
 *
 * SECURITY: the browser only ever sends us a plan `id`. The amount charged is
 * looked up here, server-side. Never accept a price from the client — that
 * would let anyone buy a $600 program for $1 by editing the request.
 */

export type Plan = {
  id: string;
  name: string;
  /** Price in cents. Stripe works in the smallest currency unit. */
  amount: number;
  desc: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  /** Whether this product requires scheduling a session after purchase. */
  requiresBooking?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'program-1-month',
    name: '1-Month Program',
    amount: 30000,
    desc: 'Full access to the 4-week APEX foundation protocol and nutrition dashboard.',
    features: [
      'Month 1 Training Regiment',
      'Macro Tracking Dashboard',
      'Weekly Progress Tracking',
      'Community Access',
    ],
  },
  {
    id: 'program-2-month',
    name: '2-Month Program',
    amount: 45000,
    desc: 'Access to Month 1 (Foundation) and Month 2 (MetCon) programs.',
    features: ['Everything in 1-Month', 'Month 2 MetCon Curriculum', 'Priority Support'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'program-3-month',
    name: '3-Month Program',
    amount: 60000,
    desc: 'The complete 12-week APEX lifecycle, including Longevity and Peak performance.',
    features: [
      'Everything in 2-Month',
      'Month 3 Longevity Curriculum',
      '90-Day Results Commitment',
    ],
  },
  {
    id: 'coaching-1-on-1',
    name: '1-on-1 Coaching',
    amount: 20000,
    desc: 'Personalized coaching sessions tailored to your individual needs and goals.',
    features: [
      '1 hour one-on-one coaching',
      'Customized workout plans',
      'Accountability and support',
    ],
    requiresBooking: true,
  },
  {
    id: 'nutrition-custom',
    name: 'Customized Nutrition Plan',
    amount: 50000,
    desc: 'Personalized nutrition plans tailored to your individual needs and goals.',
    features: [
      'Included macros',
      'Customized meal plans',
      'Dietary restriction support',
      'Weekly and monthly check-ins',
    ],
    requiresBooking: true,
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** Format cents as a whole-dollar display string, e.g. 30000 -> "300". */
export function formatDollars(amount: number): string {
  return (amount / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
