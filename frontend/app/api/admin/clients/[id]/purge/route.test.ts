import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const maybeSingleMock = vi.fn();
const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: vi.fn(),
  verifyIsAdmin: vi.fn(),
  purgeClientAccount: vi.fn(),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { getSessionClaims, verifyIsAdmin, purgeClientAccount } = await import('@/lib/auth');
const { POST } = await import('@/app/api/admin/clients/[id]/purge/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/admin/clients/c1/purge', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const ctx = { params: Promise.resolve({ id: 'c1' }) };

describe('POST /api/admin/clients/[id]/purge', () => {
  beforeEach(() => {
    vi.mocked(getSessionClaims).mockReset();
    vi.mocked(verifyIsAdmin).mockReset();
    vi.mocked(purgeClientAccount).mockReset();
    maybeSingleMock.mockReset();
    eqMock.mockClear();
    selectMock.mockClear();
    fromMock.mockClear();
  });

  it('returns 404 when not signed in, without purging', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue(null);

    const res = await POST(makeRequest({ confirm: 'PERMANENTLY DELETE' }), ctx);
    expect(res.status).toBe(404);
    expect(purgeClientAccount).not.toHaveBeenCalled();
  });

  it('returns 404 when not an admin, without purging', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'u1', is_admin: false, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(false);

    const res = await POST(makeRequest({ confirm: 'PERMANENTLY DELETE' }), ctx);
    expect(res.status).toBe(404);
    expect(purgeClientAccount).not.toHaveBeenCalled();
  });

  it('rejects a missing confirm string without purging or touching the db', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);

    const res = await POST(makeRequest({}), ctx);
    expect(res.status).toBe(400);
    expect(purgeClientAccount).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects a wrong confirm string without purging or touching the db', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);

    const res = await POST(makeRequest({ confirm: 'delete please' }), ctx);
    expect(res.status).toBe(400);
    expect(purgeClientAccount).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('purges the client for a verified admin with the exact confirm phrase', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    maybeSingleMock.mockResolvedValue({ data: { id: 'c1', auth_user_id: 'auth-user-1' }, error: null });
    vi.mocked(purgeClientAccount).mockResolvedValue({ error: null });

    const res = await POST(makeRequest({ confirm: 'PERMANENTLY DELETE' }), ctx);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(purgeClientAccount).toHaveBeenCalledWith('c1', 'auth-user-1');
  });

  it('returns 404 when the client does not exist', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    const res = await POST(makeRequest({ confirm: 'PERMANENTLY DELETE' }), ctx);
    expect(res.status).toBe(404);
    expect(purgeClientAccount).not.toHaveBeenCalled();
  });
});
