import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSessionClaimsMock = vi.fn();
const deactivateClientAccountMock = vi.fn();

vi.mock('@/lib/auth', () => ({
  getSessionClaims: (...args: unknown[]) => getSessionClaimsMock(...args),
  deactivateClientAccount: (...args: unknown[]) => deactivateClientAccountMock(...args),
}));

// Imported after the mock so the route picks up the mocked module.
const { POST } = await import('@/app/api/account/delete/route');

describe('POST /api/account/delete', () => {
  beforeEach(() => {
    getSessionClaimsMock.mockReset();
    deactivateClientAccountMock.mockReset();
  });

  it('rejects when there is no session, without deactivating anything', async () => {
    getSessionClaimsMock.mockResolvedValue(null);

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(deactivateClientAccountMock).not.toHaveBeenCalled();
  });

  it('deactivates the caller\'s own auth user id (claims.sub), never a body-supplied id', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'auth-user-1',
      is_admin: false,
      client_id: 'client-1',
    });
    deactivateClientAccountMock.mockResolvedValue({ error: null });

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.redirectTo).toBe('/');
    expect(deactivateClientAccountMock).toHaveBeenCalledWith('auth-user-1');
  });

  it('returns a generic 500 and never leaks the underlying error when deactivation fails', async () => {
    getSessionClaimsMock.mockResolvedValue({
      sub: 'auth-user-1',
      is_admin: false,
      client_id: 'client-1',
    });
    deactivateClientAccountMock.mockResolvedValue({
      error: 'internal-host:5432 connection refused',
    });

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
