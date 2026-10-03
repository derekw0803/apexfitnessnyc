import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSessionClaimsMock = vi.fn();
const verifyIsAdminMock = vi.fn();

// GET chain: getDb().from('expenses').select(...).order(...)
const orderFn = vi.fn();
const selectFn = vi.fn(() => ({ order: orderFn }));

// POST chain: getDb().from('expenses').insert({...}).select(...).single()
const singleFn = vi.fn();
const insertSelectFn = vi.fn(() => ({ single: singleFn }));
const insertFn = vi.fn(() => ({ select: insertSelectFn }));

const fromMock = vi.fn(() => ({ select: selectFn, insert: insertFn }));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: (...args: unknown[]) => getSessionClaimsMock(...args),
  verifyIsAdmin: (...args: unknown[]) => verifyIsAdminMock(...args),
}));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { GET, POST } = await import('@/app/api/admin/expenses/route');

const ADMIN_CLAIMS = { sub: 'admin-1', is_admin: true, client_id: null };

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/admin/expenses', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/admin/expenses', () => {
  beforeEach(() => {
    getSessionClaimsMock.mockReset();
    verifyIsAdminMock.mockReset();
    fromMock.mockClear();
    selectFn.mockClear();
    orderFn.mockReset();
  });

  it('returns 404 when there is no session, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(verifyIsAdminMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('returns 404 when signed in but not an admin, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(false);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('lists expenses ordered by expense_date desc for a verified admin', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    const rows = [
      { id: '1', expense_date: '2026-09-01', amount_cents: 5000, category: 'rent', description: null, created_at: '2026-09-01T00:00:00Z' },
    ];
    orderFn.mockResolvedValue({ data: rows, error: null });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.expenses).toEqual(rows);
    expect(fromMock).toHaveBeenCalledWith('expenses');
    expect(orderFn).toHaveBeenCalledWith('expense_date', { ascending: false });
  });

  it('returns a generic 500 and never leaks the db error when the list query fails', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    orderFn.mockResolvedValue({ data: null, error: { message: 'connection refused: internal-host:5432' } });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});

describe('POST /api/admin/expenses', () => {
  beforeEach(() => {
    getSessionClaimsMock.mockReset();
    verifyIsAdminMock.mockReset();
    fromMock.mockClear();
    insertFn.mockClear();
    insertSelectFn.mockClear();
    singleFn.mockReset();
  });

  it('returns 404 when there is no session, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await POST(makeRequest({ expense_date: '2026-09-01', amount_cents: 5000 }));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(verifyIsAdminMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('returns 404 when signed in but not an admin, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(false);

    const res = await POST(makeRequest({ expense_date: '2026-09-01', amount_cents: 5000 }));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('rejects a submission missing a date, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);

    const res = await POST(makeRequest({ expense_date: '', amount_cents: 5000 }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.fieldErrors).toEqual({ expense_date: 'Date is required.' });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects a non-positive/non-numeric amount, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);

    const res = await POST(makeRequest({ expense_date: '2026-09-01', amount_cents: -5 }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.fieldErrors).toEqual({ amount_cents: 'Amount must be a positive number.' });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects a non-numeric amount string, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);

    const res = await POST(makeRequest({ expense_date: '2026-09-01', amount_cents: 'lots' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.fieldErrors).toEqual({ amount_cents: 'Amount must be a positive number.' });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('creates an expense for a verified admin with valid input', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    const created = {
      id: 'exp-1',
      expense_date: '2026-09-01',
      amount_cents: 5000,
      category: 'rent',
      description: 'Monthly rent',
      created_at: '2026-09-01T00:00:00Z',
    };
    singleFn.mockResolvedValue({ data: created, error: null });

    const res = await POST(
      makeRequest({
        expense_date: '2026-09-01',
        amount_cents: 5000,
        category: 'rent',
        description: 'Monthly rent',
      })
    );
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.expense).toEqual(created);
    expect(fromMock).toHaveBeenCalledWith('expenses');
    expect(insertFn).toHaveBeenCalledWith({
      expense_date: '2026-09-01',
      amount_cents: 5000,
      category: 'rent',
      description: 'Monthly rent',
    });
  });

  it('returns a generic 500 and never leaks the db error when insert fails', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    singleFn.mockResolvedValue({ data: null, error: { message: 'connection refused: internal-host:5432' } });

    const res = await POST(makeRequest({ expense_date: '2026-09-01', amount_cents: 5000 }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
