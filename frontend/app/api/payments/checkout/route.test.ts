import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createSessionMock = vi.fn();
const getSessionClaimsMock = vi.fn();

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: createSessionMock } } }),
  getBaseUrl: () => 'https://apexfitnessnyc.com',
}));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: () => getSessionClaimsMock(),
}));

vi.mock('@/lib/plans', () => ({
  getPlan: (id: string) =>
    id === 'program-2-month'
      ? {
          id: 'program-2-month',
          name: '2-Month Program',
          amount: 45000,
          desc: 'Test plan description.',
          features: [],
        }
      : undefined,
}));

// Imported after the mocks so the route picks up the mocked modules.
const { POST } = await import('@/app/api/payments/checkout/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const AUTHED_CLAIMS = {
  sub: 'user-1',
  email: 'client@example.com',
  is_admin: false,
  client_id: 'client-123',
};

describe('POST /api/payments/checkout', () => {
  beforeEach(() => {
    createSessionMock.mockReset();
    getSessionClaimsMock.mockReset();
  });

  it('rejects an unauthenticated request without ever calling Stripe', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await POST(makeRequest({ planId: 'program-2-month' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toMatch(/signed in/i);
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it('rejects an authenticated account with no linked client profile', async () => {
    getSessionClaimsMock.mockResolvedValue({ ...AUTHED_CLAIMS, client_id: null });

    const res = await POST(makeRequest({ planId: 'program-2-month' }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toMatch(/no client profile/i);
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it('rejects an unknown plan id without ever calling Stripe', async () => {
    getSessionClaimsMock.mockResolvedValue(AUTHED_CLAIMS);

    const res = await POST(makeRequest({ planId: 'not-a-real-plan' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Unknown plan selected.');
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it('resolves the charge amount server-side and stamps client_id from the verified session, ignoring any client-sent client_id', async () => {
    getSessionClaimsMock.mockResolvedValue(AUTHED_CLAIMS);
    createSessionMock.mockResolvedValue({ url: 'https://checkout.stripe.com/session/abc' });

    // A tampered request that also tries to smuggle in its own client_id/amount.
    const res = await POST(
      makeRequest({ planId: 'program-2-month', amount: 1, client_id: 'someone-elses-id' })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/session/abc');

    const callArgs = createSessionMock.mock.calls[0][0];
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(45000);
    expect(callArgs.metadata.plan_id).toBe('program-2-month');
    expect(callArgs.metadata.client_id).toBe('client-123');
    expect(callArgs.metadata.client_id).not.toBe('someone-elses-id');
  });

  it('returns a generic 500 if Stripe fails, without leaking the underlying error', async () => {
    getSessionClaimsMock.mockResolvedValue(AUTHED_CLAIMS);
    createSessionMock.mockRejectedValue(new Error('sk_live_xxx invalid'));

    const res = await POST(makeRequest({ planId: 'program-2-month' }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(JSON.stringify(data)).not.toContain('sk_live_xxx');
  });
});
