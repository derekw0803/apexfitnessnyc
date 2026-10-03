import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSessionClaimsMock = vi.fn();
const verifyIsAdminMock = vi.fn();

// DELETE chain: getDb().from('expenses').delete().eq('id', id).select('id').maybeSingle()
const maybeSingleFn = vi.fn();
const deleteSelectFn = vi.fn(() => ({ maybeSingle: maybeSingleFn }));
const eqFn = vi.fn(() => ({ select: deleteSelectFn }));
const deleteFn = vi.fn(() => ({ eq: eqFn }));
const fromMock = vi.fn(() => ({ delete: deleteFn }));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: (...args: unknown[]) => getSessionClaimsMock(...args),
  verifyIsAdmin: (...args: unknown[]) => verifyIsAdminMock(...args),
}));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { DELETE } = await import('@/app/api/admin/expenses/[id]/route');

const ADMIN_CLAIMS = { sub: 'admin-1', is_admin: true, client_id: null };

function makeRequest(id: string) {
  return new NextRequest(`http://localhost/api/admin/expenses/${id}`, { method: 'DELETE' });
}

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('DELETE /api/admin/expenses/[id]', () => {
  beforeEach(() => {
    getSessionClaimsMock.mockReset();
    verifyIsAdminMock.mockReset();
    fromMock.mockClear();
    deleteFn.mockClear();
    eqFn.mockClear();
    deleteSelectFn.mockClear();
    maybeSingleFn.mockReset();
  });

  it('returns 404 when there is no session, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await DELETE(makeRequest('exp-1'), makeContext('exp-1'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(verifyIsAdminMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('returns 404 when signed in but not an admin, without touching the db', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(false);

    const res = await DELETE(makeRequest('exp-1'), makeContext('exp-1'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
    expect(data.error).toBe('Not found');
  });

  it('deletes the expense for a verified admin', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    maybeSingleFn.mockResolvedValue({ data: { id: 'exp-1' }, error: null });

    const res = await DELETE(makeRequest('exp-1'), makeContext('exp-1'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('expenses');
    expect(eqFn).toHaveBeenCalledWith('id', 'exp-1');
  });

  it('returns 404 when the expense id does not exist', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    maybeSingleFn.mockResolvedValue({ data: null, error: null });

    const res = await DELETE(makeRequest('missing-id'), makeContext('missing-id'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it('returns a generic 500 and never leaks the db error when delete fails', async () => {
    getSessionClaimsMock.mockResolvedValue(ADMIN_CLAIMS);
    verifyIsAdminMock.mockResolvedValue(true);
    maybeSingleFn.mockResolvedValue({ data: null, error: { message: 'connection refused: internal-host:5432' } });

    const res = await DELETE(makeRequest('exp-1'), makeContext('exp-1'));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
