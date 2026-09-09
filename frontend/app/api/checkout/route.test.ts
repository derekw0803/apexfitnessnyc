import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPlan } from '@/lib/plans';

const createSessionMock = vi.fn();

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: createSessionMock } } }),
  getBaseUrl: () => 'https://apexfitnessnyc.com',
}));

// Imported after the mock so the route picks up the mocked module.
const { POST } = await import('@/app/api/checkout/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/checkout', () => {
  beforeEach(() => {
    createSessionMock.mockReset();
  });

  it('rejects an unknown plan id without ever calling Stripe', async () => {
    const res = await POST(makeRequest({ planId: 'not-a-real-plan' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Unknown plan selected.');
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it('rejects a missing/non-string plan id', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it('resolves the charge amount server-side from the catalogue, ignoring any client-sent price', async () => {
    createSessionMock.mockResolvedValue({ url: 'https://checkout.stripe.com/session/abc' });

    const plan = getPlan('program-2-month')!;
    // A tampered request that also tries to smuggle in its own amount.
    const res = await POST(makeRequest({ planId: plan.id, amount: 1 }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/session/abc');

    const callArgs = createSessionMock.mock.calls[0][0];
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(plan.amount);
    expect(callArgs.line_items[0].price_data.unit_amount).not.toBe(1);
    expect(callArgs.metadata.plan_id).toBe(plan.id);
  });

  it('returns a generic 500 if Stripe fails, without leaking the underlying error', async () => {
    createSessionMock.mockRejectedValue(new Error('sk_live_xxx invalid'));

    const res = await POST(makeRequest({ planId: 'program-1-month' }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(JSON.stringify(data)).not.toContain('sk_live_xxx');
  });
});
