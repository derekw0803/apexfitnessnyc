import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const maybeSingleMock = vi.fn();
const selectAfterUpdateMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock, select: selectAfterUpdateMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock, update: updateMock }));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

vi.mock('@/lib/auth', () => ({
  getSessionClaims: vi.fn(),
  verifyIsAdmin: vi.fn(),
}));

// Imported after the mocks so the route picks up the mocked modules.
const { getSessionClaims, verifyIsAdmin } = await import('@/lib/auth');
const { GET, PATCH } = await import('@/app/api/admin/clients/[id]/route');

function makeRequest(body?: unknown) {
  return new NextRequest('http://localhost/api/admin/clients/c1', {
    method: body === undefined ? 'GET' : 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
  });
}

const ctx = { params: Promise.resolve({ id: 'c1' }) };

describe('/api/admin/clients/[id]', () => {
  beforeEach(() => {
    vi.mocked(getSessionClaims).mockReset();
    vi.mocked(verifyIsAdmin).mockReset();
    maybeSingleMock.mockReset();
    selectAfterUpdateMock.mockClear();
    eqMock.mockClear();
    selectMock.mockClear();
    updateMock.mockClear();
    fromMock.mockClear();
  });

  describe('GET', () => {
    it('returns 404 when not signed in, without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue(null);

      const res = await GET(makeRequest(), { params: Promise.resolve({ id: 'c1' }) });
      expect(res.status).toBe(404);
      expect(fromMock).not.toHaveBeenCalled();
    });

    it('returns 404 when not an admin, without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'u1', is_admin: false, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(false);

      const res = await GET(makeRequest(), { params: Promise.resolve({ id: 'c1' }) });
      expect(res.status).toBe(404);
      expect(fromMock).not.toHaveBeenCalled();
    });

    it('returns the client record for a verified admin', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(true);
      maybeSingleMock.mockResolvedValue({
        data: { id: 'c1', first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com' },
        error: null,
      });

      const res = await GET(makeRequest(), { params: Promise.resolve({ id: 'c1' }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(eqMock).toHaveBeenCalledWith('id', 'c1');
      expect(data.client.email).toBe('ada@example.com');
    });

    it('returns 404 when the client does not exist', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(true);
      maybeSingleMock.mockResolvedValue({ data: null, error: null });

      const res = await GET(makeRequest(), { params: Promise.resolve({ id: 'missing' }) });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH', () => {
    const validBody = {
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.com',
      phone: '555-0100',
      address: '1 Main St',
    };

    it('returns 404 when not signed in, without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue(null);

      const res = await PATCH(makeRequest(validBody), ctx);
      expect(res.status).toBe(404);
      expect(fromMock).not.toHaveBeenCalled();
    });

    it('returns 404 when not an admin, without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'u1', is_admin: false, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(false);

      const res = await PATCH(makeRequest(validBody), ctx);
      expect(res.status).toBe(404);
      expect(fromMock).not.toHaveBeenCalled();
    });

    it('rejects a missing first/last name without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(true);

      const res = await PATCH(makeRequest({ first_name: '', last_name: '', email: 'ada@example.com' }), ctx);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.fieldErrors.first_name).toBeDefined();
      expect(data.fieldErrors.last_name).toBeDefined();
      expect(updateMock).not.toHaveBeenCalled();
    });

    it('rejects an invalid email without touching the db', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(true);

      const res = await PATCH(makeRequest({ ...validBody, email: 'not-an-email' }), ctx);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.fieldErrors.email).toBeDefined();
      expect(updateMock).not.toHaveBeenCalled();
    });

    it('updates only the allowed profile fields for a verified admin', async () => {
      vi.mocked(getSessionClaims).mockResolvedValue({ sub: 'a1', is_admin: true, client_id: null });
      vi.mocked(verifyIsAdmin).mockResolvedValue(true);
      maybeSingleMock.mockResolvedValue({
        data: { id: 'c1', ...validBody },
        error: null,
      });

      const res = await PATCH(makeRequest(validBody), ctx);
      const data = await res.json();

      expect(res.status).toBe(200);
      const updatePayload = updateMock.mock.calls[0][0];
      expect(updatePayload).toEqual({
        first_name: 'Ada',
        last_name: 'Lovelace',
        email: 'ada@example.com',
        phone: '555-0100',
        address: '1 Main St',
      });
      expect(updatePayload).not.toHaveProperty('current_offering_id');
      expect(updatePayload).not.toHaveProperty('current_nutrition_plan_id');
      expect(updatePayload).not.toHaveProperty('auth_user_id');
      expect(data.client.email).toBe('ada@example.com');
    });
  });
});
