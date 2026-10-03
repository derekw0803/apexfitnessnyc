import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSessionClaimsMock = vi.fn();

// Chain: getDb().from('clients').update({...}).eq('id', clientId)
const eqFn = vi.fn();
const updateFn = vi.fn(() => ({ eq: eqFn }));
const fromMock = vi.fn(() => ({ update: updateFn }));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: (...args: unknown[]) => getSessionClaimsMock(...args),
}));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { POST } = await import('@/app/api/account/update/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/account/update', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/account/update', () => {
  beforeEach(() => {
    getSessionClaimsMock.mockReset();
    fromMock.mockClear();
    updateFn.mockClear();
    eqFn.mockReset();
  });

  it('rejects when there is no session', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await POST(makeRequest({ firstName: 'Ada', lastName: 'Lovelace' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects when the session has no linked client_id', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'user-1',
      is_admin: false,
      client_id: null,
    });

    const res = await POST(makeRequest({ firstName: 'Ada', lastName: 'Lovelace' }));
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.success).toBe(false);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects a submission missing required fields, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'user-1',
      is_admin: false,
      client_id: 'client-1',
    });

    const res = await POST(makeRequest({ firstName: '', lastName: '' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.fieldErrors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
    });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('updates only the caller\'s own row, using server-derived client_id (never a body-supplied one)', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'user-1',
      is_admin: false,
      client_id: 'client-1',
    });
    eqFn.mockResolvedValue({ error: null });

    const res = await POST(
      makeRequest({
        firstName: '  Ada  ',
        lastName: '  Lovelace  ',
        phone: '555-0100',
        address: '123 Main St',
        client_id: 'someone-elses-id',
      })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('clients');
    expect(updateFn).toHaveBeenCalledWith({
      first_name: 'Ada',
      last_name: 'Lovelace',
      phone: '555-0100',
      address: '123 Main St',
    });
    expect(eqFn).toHaveBeenCalledWith('id', 'client-1');
  });

  it('returns a generic 500 and never leaks the db error when update fails', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'user-1',
      is_admin: false,
      client_id: 'client-1',
    });
    eqFn.mockResolvedValue({ error: { message: 'connection refused: internal-host:5432' } });

    const res = await POST(makeRequest({ firstName: 'Ada', lastName: 'Lovelace' }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
