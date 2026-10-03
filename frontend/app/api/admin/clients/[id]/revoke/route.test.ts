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
  deactivateClientAccount: vi.fn(),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { getSessionClaims, verifyIsAdmin, deactivateClientAccount } = await import('@/lib/auth');
const { POST } = await import('@/app/api/admin/clients/[id]/revoke/route');

function makeRequest() {
  return new NextRequest('http://localhost/api/admin/clients/c1/revoke', { method: 'POST' });
}

const ctx = { params: Promise.resolve({ id: 'c1' }) };

describe('POST /api/admin/clients/[id]/revoke', () => {
  beforeEach(() => {
    vi.mocked(getSessionClaims).mockReset();
    vi.mocked(verifyIsAdmin).mockReset();
    vi.mocked(deactivateClientAccount).mockReset();
    maybeSingleMock.mockReset();
    eqMock.mockClear();
    selectMock.mockClear();
    fromMock.mockClear();
  });

  it('returns 404 when not signed in, without revoking', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue(null);

    const res = await POST(makeRequest(), ctx);
    expect(res.status).toBe(404);
    expect(deactivateClientAccount).not.toHaveBeenCalled();
  });

  it('returns 404 when not an admin, without revoking', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'u1', is_admin: false, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(false);

    const res = await POST(makeRequest(), ctx);
    expect(res.status).toBe(404);
    expect(deactivateClientAccount).not.toHaveBeenCalled();
  });

  it('returns 400 when the client has no auth_user_id to revoke', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    maybeSingleMock.mockResolvedValue({ data: { auth_user_id: null }, error: null });

    const res = await POST(makeRequest(), ctx);
    expect(res.status).toBe(400);
    expect(deactivateClientAccount).not.toHaveBeenCalled();
  });

  it('returns 404 when the client does not exist', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    const res = await POST(makeRequest(), ctx);
    expect(res.status).toBe(404);
    expect(deactivateClientAccount).not.toHaveBeenCalled();
  });

  it('revokes the linked auth user for a verified admin', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    maybeSingleMock.mockResolvedValue({ data: { auth_user_id: 'auth-user-1' }, error: null });
    vi.mocked(deactivateClientAccount).mockResolvedValue({ error: null });

    const res = await POST(makeRequest(), ctx);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(deactivateClientAccount).toHaveBeenCalledWith('auth-user-1');
  });
});
