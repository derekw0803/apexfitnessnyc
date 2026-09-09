import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));

vi.mock('@/lib/supabaseAdmin', () => ({
  getDb: () => ({ from: fromMock }),
}));

// Imported after the mock so the route picks up the mocked module.
const { POST } = await import('@/app/api/contact/route');

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
  });

  it('rejects a submission missing required fields, without touching the db', async () => {
    const res = await POST(makeRequest({ firstName: '', lastName: '', email: '' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.fieldErrors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      email: 'Email is required.',
    });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', async () => {
    const res = await POST(
      makeRequest({ firstName: 'Ada', lastName: 'Lovelace', email: 'nope' })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.fieldErrors).toEqual({ email: 'Enter a valid email address.' });
  });

  it('silently accepts (200, no db write) when the honeypot field is filled', async () => {
    const res = await POST(
      makeRequest({ firstName: '', lastName: '', email: '', company: 'bot filled this' })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('inserts a lowercased, trimmed record for a valid submission', async () => {
    insertMock.mockResolvedValue({ error: null });

    const res = await POST(
      makeRequest({
        firstName: '  Ada  ',
        lastName: '  Lovelace  ',
        email: '  ADA@Example.com  ',
        phone: '555-0100',
      })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('contacts');
    expect(insertMock).toHaveBeenCalledWith({
      first_name: 'Ada',
      last_name: 'Lovelace',
      phone: '555-0100',
      email: 'ada@example.com',
    });
  });

  it('returns a generic 500 and never leaks the db error when insert fails', async () => {
    insertMock.mockResolvedValue({ error: { message: 'connection refused: internal-host:5432' } });

    const res = await POST(
      makeRequest({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' })
    );
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(JSON.stringify(data)).not.toContain('internal-host');
  });
});
