import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const inviteUserByEmailMock = vi.fn();
const eqMock = vi.fn();
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ update: updateMock }));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({
    from: fromMock,
    auth: { admin: { inviteUserByEmail: inviteUserByEmailMock } },
  }),
}));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: vi.fn(),
  verifyIsAdmin: vi.fn(),
}));

vi.mock('@/lib/stripe', () => ({
  getBaseUrl: () => 'https://apexfitnessnyc.com',
}));

// Imported after the mocks so the route picks up the mocked modules.
const { getSessionClaims, verifyIsAdmin } = await import('@/lib/auth');
const { POST } = await import('@/app/api/admin/clients/[id]/invite/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/admin/clients/c1/invite', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const ctx = { params: Promise.resolve({ id: 'c1' }) };

describe('POST /api/admin/clients/[id]/invite', () => {
  beforeEach(() => {
    vi.mocked(getSessionClaims).mockReset();
    vi.mocked(verifyIsAdmin).mockReset();
    inviteUserByEmailMock.mockReset();
    eqMock.mockReset();
    updateMock.mockClear();
    fromMock.mockClear();
  });

  it('returns 404 when not signed in, without inviting', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue(null);

    const res = await POST(makeRequest({ email: 'a@example.com' }), ctx);
    expect(res.status).toBe(404);
    expect(inviteUserByEmailMock).not.toHaveBeenCalled();
  });

  it('returns 404 when not an admin, without inviting', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'u1', is_admin: false, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(false);

    const res = await POST(makeRequest({ email: 'a@example.com' }), ctx);
    expect(res.status).toBe(404);
    expect(inviteUserByEmailMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid email without inviting', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);

    const res = await POST(makeRequest({ email: 'not-an-email' }), ctx);
    expect(res.status).toBe(400);
    expect(inviteUserByEmailMock).not.toHaveBeenCalled();
  });

  it('invites and links the client on success', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    inviteUserByEmailMock.mockResolvedValue({ data: { user: { id: 'auth-user-1' } }, error: null });
    eqMock.mockResolvedValue({ error: null });

    const res = await POST(makeRequest({ email: 'Client@Example.com' }), ctx);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(inviteUserByEmailMock).toHaveBeenCalledWith(
      'client@example.com',
      expect.objectContaining({
        redirectTo: 'https://apexfitnessnyc.com/auth/callback?next=/account/set-password',
      })
    );
    expect(updateMock).toHaveBeenCalledWith({
      email: 'client@example.com',
      auth_user_id: 'auth-user-1',
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'c1');
  });

  it('returns a generic 400 and never links when Supabase Auth errors, e.g. email already in use', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    inviteUserByEmailMock.mockResolvedValue({
      data: null,
      error: { message: 'A user with this email address has already been registered' },
    });

    const res = await POST(makeRequest({ email: 'a@example.com' }), ctx);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBeUndefined();
    expect(updateMock).not.toHaveBeenCalled();
  });
});
