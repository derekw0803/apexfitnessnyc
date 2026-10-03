import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const constructEventMock = vi.fn();
const upsertMock = vi.fn();
const insertMock = vi.fn();

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ webhooks: { constructEvent: constructEventMock } }),
}));

const fromMock = vi.fn((table: string) => {
  if (table === 'orders') {
    return { upsert: upsertMock };
  }
  if (table === 'training_payments') {
    return { insert: insertMock };
  }
  throw new Error(`Unexpected table in test: ${table}`);
});

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { POST } = await import('@/app/api/stripe/webhook/route');

function makeRequest(rawBody: string) {
  return new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body: rawBody,
    headers: { 'stripe-signature': 'test-signature' },
  });
}

function paidSession(metadata: Record<string, string> = {}) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        payment_intent: 'pi_test_123',
        payment_status: 'paid',
        amount_total: 45000,
        currency: 'usd',
        customer_details: { email: 'client@example.com', name: 'Test Client', phone: null },
        customer_email: null,
        metadata,
      },
    },
  };
}

describe('POST /api/stripe/webhook — training_payments branch', () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    constructEventMock.mockReset();
    upsertMock.mockReset().mockResolvedValue({ error: null });
    insertMock.mockReset().mockResolvedValue({ error: null });
    fromMock.mockClear();
  });

  it('records the order but does NOT touch training_payments for an anonymous purchase (no client_id)', async () => {
    const event = paidSession({ plan_id: 'program-2-month', plan_name: '2-Month Program' });
    constructEventMock.mockReturnValue(event);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('additionally inserts a training_payments row when metadata.client_id is present', async () => {
    const event = paidSession({
      plan_id: 'program-2-month',
      plan_name: '2-Month Program',
      client_id: 'client-123',
    });
    constructEventMock.mockReturnValue(event);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledTimes(1);

    const insertedRow = insertMock.mock.calls[0][0];
    expect(insertedRow.client_id).toBe('client-123');
    expect(insertedRow.amount_cents).toBe(45000);
    expect(insertedRow.note).toBe('Payment for 2-Month Program');
    expect(insertedRow.payment_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('falls back to a null note when metadata.plan_name is missing', async () => {
    const event = paidSession({ client_id: 'client-123' });
    constructEventMock.mockReturnValue(event);

    await POST(makeRequest(JSON.stringify(event)));

    const insertedRow = insertMock.mock.calls[0][0];
    expect(insertedRow.note).toBeNull();
  });

  it('returns 500 and does not swallow an error inserting into training_payments', async () => {
    const event = paidSession({ client_id: 'client-123', plan_name: 'Plan' });
    constructEventMock.mockReturnValue(event);
    insertMock.mockResolvedValue({ error: { message: 'insert failed' } });

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(500);
  });
});
