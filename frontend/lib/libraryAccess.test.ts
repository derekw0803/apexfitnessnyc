import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SessionClaims } from '@/lib/auth';

const clientRowMock = vi.fn();
const eqMock = vi.fn();

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({
    from: () => ({
      select: () => ({
        eq: (...args: unknown[]) => {
          eqMock(...args);
          return { maybeSingle: async () => clientRowMock() };
        },
      }),
    }),
  }),
}));

// Imported after the mock so the module picks up the mocked database.
const { getLibraryAccess } = await import('@/lib/libraryAccess');

const client = (overrides: Partial<SessionClaims> = {}): SessionClaims => ({
  sub: 'auth-user-1',
  email: 'client@example.com',
  is_admin: false,
  client_id: 'client-1',
  ...overrides,
});

describe('getLibraryAccess', () => {
  beforeEach(() => {
    clientRowMock.mockReset();
    eqMock.mockReset();
  });

  it('lets in a client with a current program', async () => {
    clientRowMock.mockReturnValue({ data: { current_offering_id: 'offering-1' }, error: null });

    expect(await getLibraryAccess(client())).toBe('allowed');
    expect(eqMock).toHaveBeenCalledWith('id', 'client-1');
  });

  it('refuses a client whose enrollment has ended', async () => {
    clientRowMock.mockReturnValue({ data: { current_offering_id: null }, error: null });
    expect(await getLibraryAccess(client())).toBe('no-program');
  });

  it('refuses a client id with no matching profile', async () => {
    clientRowMock.mockReturnValue({ data: null, error: null });
    expect(await getLibraryAccess(client())).toBe('no-program');
  });

  it('refuses an account not linked to a client profile, without a lookup', async () => {
    expect(await getLibraryAccess(client({ client_id: null }))).toBe('unlinked');
    expect(clientRowMock).not.toHaveBeenCalled();
  });

  it('refuses a signed-out visitor', async () => {
    expect(await getLibraryAccess(null)).toBe('signed-out');
  });

  it('always lets in an admin', async () => {
    expect(await getLibraryAccess(client({ is_admin: true, client_id: null }))).toBe('allowed');
    expect(clientRowMock).not.toHaveBeenCalled();
  });

  it('surfaces a database error instead of guessing', async () => {
    clientRowMock.mockReturnValue({ data: null, error: new Error('db down') });
    await expect(getLibraryAccess(client())).rejects.toThrow('db down');
  });
});
