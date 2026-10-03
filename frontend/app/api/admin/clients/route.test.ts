import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderMock = vi.fn();
const selectMock = vi.fn(() => ({ order: orderMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: vi.fn(),
  verifyIsAdmin: vi.fn(),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { getSessionClaims, verifyIsAdmin } = await import('@/lib/auth');
const { GET } = await import('@/app/api/admin/clients/route');

describe('GET /api/admin/clients', () => {
  beforeEach(() => {
    vi.mocked(getSessionClaims).mockReset();
    vi.mocked(verifyIsAdmin).mockReset();
    orderMock.mockReset();
    selectMock.mockClear();
    fromMock.mockClear();
  });

  it('returns 404 when not signed in, without touching the db', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(404);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('returns 404 when signed in but not an admin, without touching the db', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({
      sub: 'user-1',
      is_admin: false,
      client_id: null,
    });
    vi.mocked(verifyIsAdmin).mockResolvedValue(false);

    const res = await GET();
    expect(res.status).toBe(404);
    expect(verifyIsAdmin).toHaveBeenCalledWith('user-1');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('lists clients for a verified admin', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({
      sub: 'admin-1',
      is_admin: true,
      client_id: null,
    });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    orderMock.mockResolvedValue({
      data: [
        {
          id: 'c1',
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.com',
          auth_user_id: null,
          offerings: null,
          nutrition_plans: null,
        },
      ],
      error: null,
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(fromMock).toHaveBeenCalledWith('clients');
    expect(data.clients).toHaveLength(1);
    expect(data.clients[0].email).toBe('ada@example.com');
  });

  it('returns a generic 500 and never leaks the db error', async () => {
    vi.mocked(getSessionClaims).mockResolvedValue({
      sub: 'admin-1',
      is_admin: true,
      client_id: null,
    });
    vi.mocked(verifyIsAdmin).mockResolvedValue(true);
    orderMock.mockResolvedValue({
      data: null,
      error: { message: 'connection refused: internal-host:5432' },
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
